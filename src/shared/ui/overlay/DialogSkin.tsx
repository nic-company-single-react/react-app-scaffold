import { XIcon } from 'lucide-react';
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/shared/lib/shadcn/ui/dialog';
import { Button } from '@/shared/lib/shadcn/ui/button';
import { Spinner } from '@/shared/lib/shadcn/ui/spinner';
import { cn } from '@/shared/utils/cn';
import type { IDialogFrame, IDialogOption, TDialogSize } from '@/types/components';

/**
 * 컨텐츠가 지연 로딩(loadable/lazy)되는 동안 본문 자리에 보여줄 화면.
 * 표시만 담당합니다. 자유롭게 고쳐도 됩니다.
 */
export function DialogPendingFallback(): React.ReactNode {
	return (
		<div className="flex items-center justify-center py-10">
			<Spinner className="size-5 text-muted-foreground" />
		</div>
	);
}

/**
 * 컨텐츠 렌더가 실패했을 때 본문 자리에 보여줄 화면.
 *
 * 표시만 담당합니다 — Promise 정산(다이얼로그를 닫고 `await` 를 풀어주는 일)은
 * core 의 에러 경계가 이미 끝냈습니다.
 */
export function DialogErrorFallback(): React.ReactNode {
	return (
		<p className="py-6 text-center text-sm text-destructive">내용을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
	);
}

/* ════════════════════════════════════════════════════════════════════════════
 * $ui.dialog 의 **껍데기 디자인**. 프로젝트 스타일에 맞춰 마음껏 고치는 파일입니다.
 *
 * ✅ 자유롭게 바꿔도 되는 것
 *    - 아래 SIZE_CLASS 의 폭 값
 *    - 헤더 · 본문 · 푸터의 마크업 구조와 배치
 *    - 닫기 버튼의 위치 · 아이콘 · variant
 *    - 푸터 버튼의 순서 · 문구 · 색
 *    - 모든 Tailwind 클래스
 *
 * ⛔ 건드리면 안 되는 것 — 딱 두 줄입니다
 *    1. `{...frame.rootProps}`    — <Dialog> 의 열림 상태 배선
 *    2. `{...frame.contentProps}` — ESC · 배경 클릭 · 외부 인터랙션의 닫기 경로
 *
 *    특히 2번을 지우면 다이얼로그는 **잘 닫히는 것처럼 보이지만** beforeClose 가드가
 *    조용히 우회됩니다. 작성 중이던 폼이 확인 없이 날아가고, 화면상 이상은 없어서
 *    발견이 한참 늦습니다. 클래스만 바꾸고 이 두 스프레드는 그대로 두세요.
 *
 * 버튼의 onClick 에 붙는 frame.close / cancel / confirm 도 각각의 닫기 사유(reason)를
 * 구분하는 경로입니다. 빠뜨리면 버튼이 안 먹으므로 바로 알아챌 수 있습니다.
 * ════════════════════════════════════════════════════════════════════════════ */

/**
 * size 프리셋 → Tailwind 클래스.
 *
 * ⚠️ 반드시 **정적 리터럴**이어야 합니다. `sm:max-w-${size}` 처럼 조합하면 Tailwind 가
 *    스캔하지 못해 CSS 가 생성되지 않습니다(폭이 안 먹습니다).
 * DialogContent 기본값이 `w-full max-w-[calc(100%-2rem)] ... sm:max-w-sm` 이므로
 * twMerge 가 치환하도록 같은 접두(`sm:`) 그룹으로 줍니다. 'full' 은 무접두 max-w 까지 눌러야 합니다.
 */
const SIZE_CLASS: Record<TDialogSize, string> = {
	sm: 'sm:max-w-sm',
	md: 'sm:max-w-md',
	lg: 'sm:max-w-2xl',
	xl: 'sm:max-w-4xl',
	'2xl': 'sm:max-w-6xl',
	full: 'flex flex-col max-w-none sm:max-w-none w-[calc(100vw-2rem)] h-[calc(100vh-2rem)]',
};

export interface IDialogSkinProps {
	/** core 가 계산한 동작 묶음 (src/core/ui/dialog/useDialogFrame) */
	frame: IDialogFrame;
	/** 호출부가 넘긴 옵션 — 제목 · 설명 · 커스텀 클래스 등 표시용 값 */
	option: IDialogOption<unknown>;
}

export default function DialogSkin({ frame, option }: IDialogSkinProps): React.ReactNode {
	const isFull = frame.size === 'full';

	return (
		<Dialog {...frame.rootProps}>
			<DialogContent
				{...frame.contentProps}
				// 중첩 시 딤이 누적돼 화면이 새까매지는 것을 막는다. 실제 딤은 최하단만 그린다.
				overlayClassName={
					frame.depth > 0 ? 'bg-transparent supports-backdrop-filter:backdrop-blur-none' : undefined
				}
				className={cn(SIZE_CLASS[frame.size], option.className)}
			>
				{option.showCloseButton !== false && (
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

				{/* Radix 는 Title 이 없으면 콘솔 경고를 낸다. 제목이 없어도 sr-only 로 항상 넣는다. */}
				<DialogHeader className={option.title || frame.hasDescription ? undefined : 'sr-only'}>
					<DialogTitle className={option.title ? 'pr-8' : 'sr-only'}>{option.title ?? '대화상자'}</DialogTitle>
					{frame.hasDescription && <DialogDescription>{option.description}</DialogDescription>}
				</DialogHeader>

				<div
					className={cn(
						option.scrollable !== false && (isFull ? 'min-h-0 flex-1 overflow-y-auto' : 'max-h-[70vh] overflow-y-auto'),
						option.bodyClassName,
					)}
				>
					{frame.body}
				</div>

				{frame.footer.kind === 'shell' && (
					<DialogFooter>
						{!frame.footer.option.hideCancel && (
							<Button
								type="button"
								variant="outline"
								disabled={frame.loading}
								onClick={frame.cancel}
							>
								{frame.footer.option.cancelText ?? '취소'}
							</Button>
						)}
						<Button
							type="button"
							variant={frame.footer.option.confirmVariant ?? 'default'}
							disabled={frame.loading || frame.confirmDisabled}
							onClick={frame.confirm}
						>
							{frame.loading && <Spinner className="size-4" />}
							{frame.footer.option.confirmText ?? '확인'}
						</Button>
					</DialogFooter>
				)}

				{frame.footer.kind === 'custom' && <DialogFooter>{frame.footer.node}</DialogFooter>}
			</DialogContent>
		</Dialog>
	);
}
