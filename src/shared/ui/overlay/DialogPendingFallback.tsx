import { Spinner } from '@/shared/lib/shadcn/ui/spinner';

/**
 * $ui.dialog 컨텐츠가 지연 로딩(loadable/lazy)될 때 본문 자리에 보여줄 화면.
 *
 * 프로젝트 스타일에 맞춰 자유롭게 고쳐도 됩니다. 표시만 담당합니다.
 */
export default function DialogPendingFallback(): React.ReactNode {
	return (
		<div className="flex items-center justify-center py-10">
			<Spinner className="size-5 text-muted-foreground" />
		</div>
	);
}
