import { Component, type ErrorInfo, type ReactNode } from 'react';
import DialogErrorFallback from '@/shared/ui/overlay/DialogErrorFallback';

export interface IDialogErrorBoundaryProps {
	/** 오류 발생 시 정산할 다이얼로그 id */
	id: string;
	/** 오류를 상위(컨트롤러)에 알린다. */
	onError: (id: string, error: unknown) => void;
	children: ReactNode;
}

interface IDialogErrorBoundaryState {
	error: unknown;
}

/**
 * 다이얼로그 컨텐츠 렌더 실패를 잡아 Promise 를 반드시 정산시킨다.
 *
 * 특히 `loadable(() => import(...))` 의 청크 로드 실패(배포 직후 캐시 불일치)가 흔한데,
 * 이걸 잡지 않으면 `await $ui.dialog(...)` 가 **영원히 resolve 되지 않는다.**
 */
export default class DialogErrorBoundary extends Component<IDialogErrorBoundaryProps, IDialogErrorBoundaryState> {
	state: IDialogErrorBoundaryState = { error: null };

	static getDerivedStateFromError(error: unknown): IDialogErrorBoundaryState {
		return { error };
	}

	componentDidCatch(error: Error, info: ErrorInfo): void {
		console.error('[$ui.dialog] 컨텐츠 렌더 중 오류가 발생했습니다.', error, info.componentStack);
		this.props.onError(this.props.id, error);
	}

	render(): ReactNode {
		// 화면은 shared 의 스킨이 그린다. 여기서는 "정산은 이미 끝났다"만 보장한다.
		if (this.state.error) return <DialogErrorFallback />;
		return this.props.children;
	}
}
