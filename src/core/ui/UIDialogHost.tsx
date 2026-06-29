import { useEffect, useRef, useState } from 'react';
import {
	AlertCircleIcon,
	AlertTriangleIcon,
	CheckCircleIcon,
	InfoIcon,
	XIcon,
	type LucideIcon,
} from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogMedia,
	AlertDialogTitle,
} from '@/shared/lib/shadcn/ui/alert-dialog';
import { Button } from '@/shared/lib/shadcn/ui/button';
import { useUIStore } from './store';
import type { TDialogReason, TUIDialogType, IDialogResult } from '@/types/components';

/**
 * alert/confirm 은 페이지·헤더·사이드바·다른 다이얼로그·팝오버 위에 무조건 떠야 한다.
 * 앱 헤더(AppHeader)가 sticky 로 z-99999 를 쓰므로, 그보다 높은 값으로 덮어쓴다.
 * Content 와 Overlay(딤 배경) 둘 다에 적용해야 헤더까지 가려진다.
 * (cn/twMerge 가 AlertDialog 기본 z-50 을 이 값으로 치환한다.)
 */
const Z_INDEX_CLASS = 'z-[100000]';

/**
 * 닫기 시 exit 애니메이션(AlertDialog 의 duration-100)이 끝난 뒤 큐에서 제거하기 위한 지연(ms).
 * 즉시 dequeue 하면 컴포넌트가 바로 언마운트되어 닫힘 애니메이션이 재생되지 않는다.
 */
const CLOSE_ANIM_MS = 150;

/** type 별 아이콘 + 색상 + 기본 제목 매핑 */
const TYPE_META: Record<TUIDialogType, { Icon: LucideIcon; iconClass: string; defaultTitle: string }> = {
	success: { Icon: CheckCircleIcon, iconClass: 'text-green-600', defaultTitle: '성공' },
	info: { Icon: InfoIcon, iconClass: 'text-blue-600', defaultTitle: '알림' },
	warning: { Icon: AlertTriangleIcon, iconClass: 'text-amber-600', defaultTitle: '경고' },
	error: { Icon: AlertCircleIcon, iconClass: 'text-destructive', defaultTitle: '오류' },
};

/**
 * 전역 $ui 다이얼로그(alert/confirm)를 렌더링하는 호스트.
 * AppProviders 에서 앱 전체에 단 한 번 마운트되며, 큐의 맨 앞 항목만 표시한다.
 */
export function UIDialogHost() {
	const current = useUIStore((s) => s.queue[0]);
	const dequeue = useUIStore((s) => s.dequeue);

	// 다이얼로그 open 상태(닫힘 애니메이션을 위해 dequeue 와 분리해서 관리)
	const [open, setOpen] = useState(false);
	// 동일 항목이 여러 경로(버튼/ESC 등)로 중복 close 되는 것을 막는 가드
	const closedIdRef = useRef<string | null>(null);
	// 닫힘 애니메이션 후 dequeue 를 예약하는 타이머
	const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

	const type: TUIDialogType = current?.option.type ?? 'info';
	const meta = TYPE_META[type];
	// 기본은 아이콘 숨김. type 이 지정되면 표시하고, icon 옵션으로 강제 지정 가능.
	const showIcon = current?.option.icon ?? current?.option.type != null;

	// 새 항목이 큐 맨 앞에 오면 가드를 초기화하고 열어서 enter 애니메이션을 재생한다.
	useEffect(() => {
		if (current) {
			closedIdRef.current = null;
			setOpen(true);
		}
	}, [current]);

	// 언마운트 시 예약된 타이머 정리
	useEffect(() => () => {
		if (closeTimerRef.current) clearTimeout(closeTimerRef.current);
	}, []);

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

	const { option, kind } = current;
	const { Icon, iconClass, defaultTitle } = meta;
	const title = option.title ?? defaultTitle;
	const confirmText = option.confirmText ?? '확인';
	const cancelText = (kind === 'confirm' && option.cancelText) || '취소';

	return (
		<AlertDialog
			open={open}
			onOpenChange={(next) => {
				// 버튼 onClick 이 먼저 reason 을 확정하므로, 여기는 ESC/외부 닫힘의 fallback.
				if (!next) closeWith('escape');
			}}
		>
			<AlertDialogContent className={Z_INDEX_CLASS} overlayClassName={Z_INDEX_CLASS}>
				{option.close && (
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="닫기"
						className="absolute top-2 right-2"
						onClick={() => closeWith('close')}
					>
						<XIcon />
					</Button>
				)}

				{/* shadcn Header 의 grid 자동배치에 의존하지 않고 아이콘 + 텍스트를 좌측 정렬 */}
				<div className="flex items-start gap-3">
					{showIcon && (
						<AlertDialogMedia className={`mb-0 bg-transparent ${iconClass}`}>
							<Icon />
						</AlertDialogMedia>
					)}
					<div className="flex min-w-0 flex-1 flex-col gap-1.5 pt-1 text-left">
						<AlertDialogTitle>{title}</AlertDialogTitle>
						{option.message && <AlertDialogDescription>{option.message}</AlertDialogDescription>}
					</div>
				</div>

				<AlertDialogFooter>
					{kind === 'confirm' && (
						<AlertDialogCancel onClick={() => closeWith('cancel')}>{cancelText}</AlertDialogCancel>
					)}
					<AlertDialogAction onClick={() => closeWith('confirm')}>{confirmText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
