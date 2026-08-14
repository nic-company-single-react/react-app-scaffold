import { useEffect, useRef, useState } from 'react';
import { CLOSE_ANIM_MS, Z_ALERT } from '@/shared/ui/overlay/overlay-layers';
import { useUIStore } from './store';
import type { IAlertFrame, IConfirmDialogOption, IDialogResult, TDialogReason } from '@/types/components';

/**
 * alert/confirm 은 페이지·헤더·사이드바·$ui.dialog·팝오버 위에 무조건 떠야 한다.
 * Content 와 Overlay(딤 배경) 둘 다에 적용해야 헤더까지 가려진다.
 *
 * ⚠️ Tailwind 는 런타임 조합 클래스를 스캔하지 못하므로 인라인 style 로 준다.
 */
const Z_INDEX_STYLE: React.CSSProperties = { zIndex: Z_ALERT };

/**
 * $ui.alert / $ui.confirm 큐의 맨 앞 항목에 대한 **동작**을 계산한다.
 *
 * 모양은 `src/shared/ui/overlay/AlertSkin` 이 담당한다.
 * 큐가 비어 있으면 null 을 돌려주고, 그때 호스트는 아무것도 렌더하지 않는다.
 *
 * 지켜지는 불변식:
 *  1. 모든 닫기 경로는 `closeWith(reason)` 하나를 지난다 — Promise 정산이 정확히 한 번 일어난다.
 *  2. 정산과 큐 제거를 분리한다 — 바로 제거하면 닫힘 애니메이션이 재생되지 않는다.
 */
export function useAlertFrame(): IAlertFrame | null {
	const current = useUIStore((s) => s.queue[0]);
	const dequeue = useUIStore((s) => s.dequeue);

	// 다이얼로그 open 상태(닫힘 애니메이션을 위해 dequeue 와 분리해서 관리)
	const [open, setOpen] = useState(false);
	// 동일 항목이 여러 경로(버튼/ESC 등)로 중복 close 되는 것을 막는 가드
	const closedIdRef = useRef<string | null>(null);
	// 닫힘 애니메이션 후 dequeue 를 예약하는 타이머
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	// 새 항목이 큐 맨 앞에 오면 가드를 초기화하고 열어서 enter 애니메이션을 재생한다.
	useEffect(() => {
		if (current) {
			closedIdRef.current = null;
			setOpen(true);
		}
	}, [current]);

	// 언마운트 시 예약된 타이머 정리
	useEffect(
		() => () => {
			if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
		},
		[],
	);

	/** 모든 닫기 경로의 단일 진입점 */
	const closeWith = (reason: TDialogReason) => {
		if (!current) return;
		const id = current.option.id!;
		if (closedIdRef.current === id) return; // 이미 닫힘
		closedIdRef.current = id;

		const confirmed = reason === 'confirm';
		const result: IDialogResult = { id, confirmed, reason };
		current.option.onClose?.(result);

		if (current.kind === 'confirm') current.resolve(confirmed);
		else current.resolve();

		// open=false 로 먼저 exit 애니메이션을 재생하고, 끝난 뒤 큐에서 제거한다.
		setOpen(false);
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
		closeTimerRef.current = setTimeout(() => {
			closeTimerRef.current = null;
			dequeue();
		}, CLOSE_ANIM_MS);
	};

	// autoDismiss: 지정 시 N(ms) 후 자동 닫기
	useEffect(() => {
		const ms = current?.option.autoDismiss;
		if (!ms) return;
		const timer = setTimeout(() => closeWith('autoDismiss'), ms);
		return () => clearTimeout(timer);
		// current 가 바뀔 때마다 타이머를 재설정한다.
	}, [current]);

	if (!current) return null;

	return {
		kind: current.kind,
		option: current.option as IConfirmDialogOption,
		rootProps: {
			open,
			onOpenChange: (next) => {
				// 버튼 onClick 이 먼저 reason 을 확정하므로, 여기는 ESC/외부 닫힘의 fallback.
				if (!next) closeWith('escape');
			},
		},
		contentProps: { style: Z_INDEX_STYLE, overlayStyle: Z_INDEX_STYLE },
		// 기본은 아이콘 숨김. type 이 지정되면 표시하고, icon 옵션으로 강제 지정 가능.
		showIcon: current.option.icon ?? current.option.type != null,
		close: () => closeWith('close'),
		cancel: () => closeWith('cancel'),
		confirm: () => closeWith('confirm'),
	};
}
