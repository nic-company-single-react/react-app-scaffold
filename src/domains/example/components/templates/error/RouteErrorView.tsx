import { Link, isRouteErrorResponse, useRouteError } from 'react-router';
import { Button } from '@axiom/components/ui';
import { House, RefreshCw, TriangleAlert } from 'lucide-react';
import ErrorStateView from './ErrorStateView';
import NotFoundView from './NotFoundView';

/**
 * 라우트 단위 에러 화면 — 라우터의 `errorElement` 에 연결한다.
 *
 * 라우트를 렌더하는 도중(loader · action · 컴포넌트 렌더) 던져진 에러를 여기서 받는다.
 * 에러는 두 종류로 나뉜다.
 *
 *  1. `isRouteErrorResponse` — 라우터가 만든 HTTP 형태의 응답 에러(404 · 401 · 500 …).
 *     상태 코드별로 문구를 다르게 준다.
 *  2. 그 외 — 코드에서 던져진 일반 `Error`. 사용자에게는 같은 문구를 주고,
 *     원인은 개발 모드에서만 노출한다.
 */
export default function RouteErrorView(): React.ReactNode {
	const error = useRouteError();

	// 라우터가 만든 응답 에러 — 상태 코드로 분기한다.
	if (isRouteErrorResponse(error)) {
		if (error.status === 404) return <NotFoundView />;

		const title = error.status === 401 || error.status === 403 ? '접근 권한이 없습니다' : '요청을 처리하지 못했습니다';

		return (
			<ErrorStateView
				code={String(error.status)}
				icon={<TriangleAlert className="size-10" />}
				title={title}
				description={error.statusText || '잠시 후 다시 시도해 주세요. 문제가 계속되면 담당자에게 문의해 주세요.'}
				detail={typeof error.data === 'string' ? error.data : JSON.stringify(error.data, null, 2)}
				actions={
					<Button asChild>
						<Link to="/">
							<House className="size-3.5" />
							홈으로
						</Link>
					</Button>
				}
			/>
		);
	}

	// 그 외 — 코드에서 던져진 일반 에러
	return (
		<ErrorStateView
			icon={<TriangleAlert className="size-10" />}
			title="문제가 발생했습니다"
			description="일시적인 오류로 화면을 표시하지 못했습니다. 새로고침 후에도 같은 문제가 계속되면 담당자에게 문의해 주세요."
			detail={error instanceof Error ? `${error.name}: ${error.message}` : String(error)}
			actions={
				<>
					<Button onClick={() => window.location.reload()}>
						<RefreshCw className="size-3.5" />
						새로고침
					</Button>
					<Button
						variant="outline"
						asChild
					>
						<Link to="/">
							<House className="size-3.5" />
							홈으로
						</Link>
					</Button>
				</>
			}
		/>
	);
}
