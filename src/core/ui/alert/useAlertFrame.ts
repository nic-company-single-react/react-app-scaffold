import { useEffect, useRef, useState } from 'react';
import { CLOSE_ANIM_MS, Z_ALERT } from '@/shared/ui/overlay/overlay-layers';
import { useUIStore } from './alertStore';
import type { IAlertFrame, IConfirmDialogOption, IDialogResult, TDialogReason } from '@/types/components';

/**
 * alert/confirm 은 페이지·헤더·사이드바·$ui.dialog·팝오버 위에 무조건 떠야 한다.
 * Content 와 Overlay(딤 배경) 둘 다에 적용해야 헤더까지 가려진다.
 *
 * ⚠️ Tailwind 는 런타임 조합 클래스를 스캔하지 못하므로 인라인 style 로 준다.
 */
const Z_INDEX_STYLE: React.CSSProperties = { zIndex: Z_ALERT };

/**
 * 스킨이 그리는 확인 버튼을 찾는 선택자.
 * shadcn 컴포넌트가 항상 붙여주는 data-slot 을 쓴다 (`shared/lib/shadcn/ui/alert-dialog.tsx`).
 */
const CONFIRM_BUTTON_SELECTOR = '[data-slot="alert-dialog-action"]';

/**
 * alert 가 열릴 때 초기 포커스를 **다이얼로그 안으로** 들여놓는다.
 *
 * Radix 의 AlertDialog 는 열릴 때 **취소 버튼**(`AlertDialogCancel`)에 포커스를 주도록 만들어져 있고,
 * 그 과정에서 FocusScope 의 기본 오토포커스를 `preventDefault()` 로 막는다.
 * 그런데 $ui.alert 은 취소 버튼이 없어서(스킨은 confirm 일 때만 그린다) 포커스 대상이 없고,
 * 기본 오토포커스는 이미 막혀 있으므로 **아무것도 포커스되지 않는다.**
 *
 * 그러면 포커스가 알림을 띄운 트리거 버튼에 그대로 남아, 알림이 뜬 직후 Enter 를 누르면
 * 확인 버튼이 아니라 **그 트리거 버튼이 다시 눌린다** (핸들러 재실행 + 알림 중복 적립).
 *
 * 그래서 alert 에서만 확인 버튼으로 초기 포커스를 직접 옮긴다.
 * (confirm 은 Radix 가 취소 버튼에 포커스를 주므로 손대지 않는다 — 파괴적 동작의 기본값은 '취소'여야 한다)
 *
 * 확인 버튼을 못 찾으면 컨테이너에 포커스한다. 포커스가 다이얼로그 안에 있기만 하면
 * 포커스 트랩이 걸리고 트리거 버튼이 다시 눌리는 일은 없다.
 */
const focusConfirmOnOpen = (event: { preventDefault: () => void; currentTarget: EventTarget | null }): void => {
	event.preventDefault();
	const container = event.currentTarget as HTMLElement | null;
	const confirmButton = container?.querySelector<HTMLElement>(CONFIRM_BUTTON_SELECTOR);
	(confirmButton ?? container)?.focus({ preventScroll: true });
};

/**
 * $ui.alert / $ui.confirm 큐의 맨 앞 항목에 대한 **동작**을 계산한다.
 *
 * 모양은 `src/shared/ui/overlay/AlertSkin` 이 담당한다.
 * 큐가 비어 있으면 null 을 돌려주고, 그때 호스트는 아무것도 렌더하지 않는다.
 *
 * 지켜지는 불변식:
 *  1. 모든 닫기 경로는 `closeWith(reason)` 하나를 지난다 — Promise 정산이 정확히 한 번 일어난다.
 *  2. 정산과 큐 제거를 분리한다 — 바로 제거하면 닫힘 애니메이션이 재생되지 않는다.
 *  3. 열리면 포커스가 반드시 다이얼로그 안에 들어간다 — 밖에 남으면 Enter 로 트리거 버튼이
 *     다시 눌린다. 자세한 내용은 `focusConfirmOnOpen` 주석 참고.
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
		contentProps: {
			style: Z_INDEX_STYLE,
			overlayStyle: Z_INDEX_STYLE,
			// alert 만 배선한다. confirm 은 Radix 가 취소 버튼에 포커스를 준다.
			...(current.kind === 'alert' ? { onOpenAutoFocus: focusConfirmOnOpen } : {}),
		},
		// 기본은 아이콘 숨김. type 이 지정되면 표시하고, icon 옵션으로 강제 지정 가능.
		showIcon: current.option.icon ?? current.option.type != null,
		close: () => closeWith('close'),
		cancel: () => closeWith('cancel'),
		confirm: () => closeWith('confirm'),
	};
}
