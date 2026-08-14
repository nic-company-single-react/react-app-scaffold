import { useEffect, useMemo, useState, type ReactNode } from 'react';
import { Router, useInRouterContext, type Location, type Navigator, type To } from 'react-router';

export interface IDialogRouterBridgeProps {
	children: ReactNode;
}

/**
 * 다이얼로그 컨텐츠에 라우터 컨텍스트를 다시 공급하는 브리지.
 *
 * ## 왜 필요한가
 * 다이얼로그 호스트는 `AppProviders` 안, 즉 `RouterProvider` 의 **형제**로 마운트된다
 * (`main.tsx` → `<AppProviders><App/></AppProviders>`, `App.tsx` → `<RouterProvider/>`).
 * 그래서 호스트가 렌더하는 컨텐츠는 라우터 컨텍스트 밖에 있고, 그대로 두면
 * `useNavigate` / `useLocation` / `<Link>` 가 전부 터진다.
 *
 * 호스트를 `RootLayout` 안으로 옮기는 대안은 쓰지 않는다. `src/shared/router/index.tsx` 에서
 * `/`, `/example`, `/publishing/example`, `*` 네 개의 최상위 route 가 **각각** `<RootLayout/>` 을
 * element 로 갖기 때문에, `/` ↔ `/example` 이동 시 RootLayout 이 remount 되어 열린 다이얼로그가 전멸한다.
 *
 * ## 어떻게
 * react-router 가 공개 export 하는 저수준 `Router` 에, 전역 `$router` 를 어댑터로 감싼
 * `Navigator` 와 구독으로 갱신되는 `location` 을 물려준다.
 *
 * ## 동작 / 미동작
 * - ✅ `useLocation`, `useNavigate`, `useHref`, `useSearchParams`, `useResolvedPath`,
 *      `useInRouterContext`, `<Link>`, `<NavLink>`, `<Navigate>`
 * - ❌ `useParams` (항상 `{}` → `$router.getParams()` 로 대체하거나 props 로 전달)
 * - ❌ 데이터라우터 전용: `useLoaderData`, `useNavigation`, `useBlocker`, `useFetcher`, `<Form>`
 */
export default function DialogRouterBridge({ children }: IDialogRouterBridgeProps): React.ReactNode {
	// 호스트가 라우터 안으로 옮겨진 경우를 대비한 방어.
	// 이미 컨텍스트가 있으면 <Router> 중첩 경고가 나므로 그대로 통과시킨다.
	const alreadyInRouter = useInRouterContext();

	const [location, setLocation] = useState<Location>(() => window.$router.getLocation());

	useEffect(() => {
		// $router.subscribe 는 해제 함수를 돌려준다.
		return window.$router.subscribe(setLocation);
	}, []);

	const navigator = useMemo<Navigator>(
		() => ({
			createHref: (to: To) => window.$router.createHref(to),
			go: (delta: number) => window.$router.go(delta),
			push: (to: To, state?: unknown) => window.$router.push(to, { state }),
			replace: (to: To, state?: unknown) => window.$router.replace(to, { state }),
		}),
		[],
	);

	if (alreadyInRouter) return children;

	return (
		<Router
			location={location}
			navigator={navigator}
		>
			{children}
		</Router>
	);
}
