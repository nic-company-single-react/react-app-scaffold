import { Component, type ErrorInfo, type ReactNode } from 'react';
import { Button } from '@axiom/components/ui';
import { RefreshCw, TriangleAlert } from 'lucide-react';
import ErrorStateView from './ErrorStateView';

export interface IAppErrorBoundaryProps {
	children: ReactNode;
	/** 에러 화면을 직접 그리고 싶을 때. `reset` 을 호출하면 다시 children 을 렌더한다. */
	fallback?: (error: Error, reset: () => void) => ReactNode;
	/** 에러 리포팅 훅. 실제 프로젝트에서는 Sentry 등 수집 서버로 보낸다. */
	onError?: (error: Error, info: ErrorInfo) => void;
	/**
	 * 이 값이 바뀌면 에러 상태를 자동으로 푼다.
	 * 보통 현재 경로(`location.pathname`)를 넘긴다. 그래야 에러 화면에 갇힌 사용자가
	 * 메뉴를 눌러 다른 페이지로 이동했을 때 정상 화면이 나온다.
	 */
	resetKey?: unknown;
}

interface IAppErrorBoundaryState {
	error: Error | null;
}

/**
 * 렌더링 중 발생한 예외를 잡아 대체 화면을 보여주는 경계.
 *
 * 라우터의 `errorElement` 는 **라우트 단위**로 동작하므로, 화면 일부(위젯·차트·표)만
 * 격리하고 싶을 때는 이 경계를 그 부분만 감싼다. 그러면 위젯 하나가 터져도
 * 나머지 화면은 그대로 살아 있다.
 *
 * 참고 — 이 프로젝트의 컴포넌트는 함수형으로 작성하지만, 에러 경계만은 예외다.
 * `getDerivedStateFromError` · `componentDidCatch` 에 대응하는 훅이 아직 없어
 * **클래스 컴포넌트로만 만들 수 있다.**
 *
 * 잡지 못하는 것 — 이벤트 핸들러 · setTimeout · async 콜백에서 던져진 에러는
 * 렌더 경로가 아니므로 여기서 잡히지 않는다. 그쪽은 try/catch 로 직접 처리한다.
 */
export default class AppErrorBoundary extends Component<IAppErrorBoundaryProps, IAppErrorBoundaryState> {
	state: IAppErrorBoundaryState = { error: null };

	/** 렌더 중 에러가 나면 state 를 갱신해 다음 렌더에서 fallback 을 그린다. */
	static getDerivedStateFromError(error: Error): IAppErrorBoundaryState {
		return { error };
	}

	/** 화면 갱신과 무관한 부수효과(로깅·리포팅)는 여기서 한다. */
	componentDidCatch(error: Error, info: ErrorInfo): void {
		this.props.onError?.(error, info);
	}

	componentDidUpdate(prevProps: IAppErrorBoundaryProps): void {
		if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.reset();
	}

	reset = (): void => {
		this.setState({ error: null });
	};

	render(): ReactNode {
		const { error } = this.state;
		const { children, fallback } = this.props;

		if (!error) return children;
		if (fallback) return fallback(error, this.reset);

		return (
			<ErrorStateView
				icon={<TriangleAlert className="size-10" />}
				title="이 영역을 표시할 수 없습니다"
				description="일시적인 오류로 화면 일부를 그리지 못했습니다. 다시 시도해 주세요."
				detail={`${error.name}: ${error.message}`}
				actions={
					<Button onClick={this.reset}>
						<RefreshCw className="size-3.5" />
						다시 시도
					</Button>
				}
			/>
		);
	}
}
