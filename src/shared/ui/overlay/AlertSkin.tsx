import { AlertCircleIcon, AlertTriangleIcon, CheckCircleIcon, InfoIcon, XIcon, type LucideIcon } from 'lucide-react';
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
import type { IAlertFrame, TUIDialogType } from '@/types/components';

/* ════════════════════════════════════════════════════════════════════════════
 * $ui.alert / $ui.confirm 의 **껍데기 디자인**. 프로젝트 스타일에 맞춰 고치는 파일입니다.
 *
 * ✅ 자유롭게 바꿔도 되는 것
 *    - 아래 TYPE_META 의 아이콘 · 색상 · 기본 제목
 *    - 아이콘과 텍스트의 배치, 정렬, 여백
 *    - 버튼 순서 · 문구 · variant
 *    - 모든 Tailwind 클래스
 *
 * ⛔ 건드리면 안 되는 것 — 두 줄입니다
 *    1. `{...frame.rootProps}`    — 열림 상태와 ESC fallback 배선
 *    2. `{...frame.contentProps}` — z-index(인라인이 아니면 헤더에 가립니다) + 초기 포커스 배선
 *       (alert 은 취소 버튼이 없어 Radix 가 아무것도 포커스하지 못합니다. 이 스프레드를 지우면
 *        포커스가 트리거 버튼에 남아 알림이 뜬 직후 Enter 로 그 버튼이 다시 눌립니다)
 *
 * 버튼의 frame.confirm / cancel / close 는 각각 다른 닫기 사유(reason)이며,
 * confirm 만 `$ui.confirm` 의 결과를 true 로 만듭니다. 서로 바꿔 달면 안 됩니다.
 * ════════════════════════════════════════════════════════════════════════════ */

/** type 별 아이콘 + 색상 + 기본 제목 매핑 */
const TYPE_META: Record<TUIDialogType, { Icon: LucideIcon; iconClass: string; defaultTitle: string }> = {
	success: { Icon: CheckCircleIcon, iconClass: 'text-green-600', defaultTitle: '성공' },
	info: { Icon: InfoIcon, iconClass: 'text-blue-600', defaultTitle: '알림' },
	warning: { Icon: AlertTriangleIcon, iconClass: 'text-amber-600', defaultTitle: '경고' },
	error: { Icon: AlertCircleIcon, iconClass: 'text-destructive', defaultTitle: '오류' },
};

export interface IAlertSkinProps {
	/** core 가 계산한 동작 묶음 (src/core/ui/alert/useAlertFrame) */
	frame: IAlertFrame;
}

export default function AlertSkin({ frame }: IAlertSkinProps): React.ReactNode {
	const { option, kind } = frame;
	const { Icon, iconClass, defaultTitle } = TYPE_META[option.type ?? 'info'];

	const title = option.title ?? defaultTitle;
	const confirmText = option.confirmText ?? '확인';
	const cancelText = (kind === 'confirm' && option.cancelText) || '취소';

	return (
		<AlertDialog {...frame.rootProps}>
			<AlertDialogContent {...frame.contentProps}>
				{option.close && (
					<Button
						type="button"
						variant="ghost"
						size="icon-sm"
						aria-label="닫기"
						className="absolute top-2 right-2"
						onClick={frame.close}
					>
						<XIcon />
					</Button>
				)}

				{/* shadcn Header 의 grid 자동배치에 의존하지 않고 아이콘 + 텍스트를 좌측 정렬 */}
				<div className="flex items-start gap-3">
					{frame.showIcon && (
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
					{kind === 'confirm' && <AlertDialogCancel onClick={frame.cancel}>{cancelText}</AlertDialogCancel>}
					<AlertDialogAction onClick={frame.confirm}>{confirmText}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
