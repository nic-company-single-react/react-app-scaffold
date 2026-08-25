import type { TAppRoute } from '@/types/router';
import { RootLayout } from '@/shared/layouts';
import MainRouter from '@/domains/main/router';
import ExampleRouter from '@/domains/example/router';

/**
 * 라우트 정의.
 *
 * ── 인증(JWT)을 붙일 때 ──────────────────────────────────────────────────────
 * 스캐폴드는 라우트를 보호하지 않은 상태로 출고된다. 기능은 `src/shared/auth`에 있고
 * 배선만 비어 있다. 붙이는 순서는 plan/jwt인증-공통개발자-적용가이드.md 에 있고, 이 파일에서 할 일은
 * 로그인 라우트를 게이트 **바깥**에 두고, 보호할 라우트를 게이트 **안**으로 옮기는 것이다.
 *
 *   import { ProtectedRoute } from '@/shared/auth';
 *   import AuthRouter from '@/domains/auth/router';
 *
 *   { path: '/auth', children: AuthRouter },              ← 게이트 바깥
 *   {
 *       element: <ProtectedRoute />,                       ← 게이트
 *       children: [{ path: '/', element: <RootLayout />, children: MainRouter }],
 *   },
 *
 * ⚠️ 인증 라우트(`/auth`)를 게이트 안에 넣으면 로그인하러 가는 길이 다시 막혀
 *    무한 리다이렉트가 된다.
 */
const routes: TAppRoute[] = [
	{
		path: '/',
		element: <RootLayout />,
		children: MainRouter,
	},
	// 업무(domain) 라우터 생성될 때 다음에 추가
	...(import.meta.env.DEV
		? [
				{
					path: '/example',
					element: <RootLayout />,
					children: ExampleRouter,
				},
				{
					path: '/publishing/example',
					element: <RootLayout />,
					// 조건이 false면 이 import 구문 자체가 도달 불가 → 번들에서 완전 제외
					children: (await import('@/publishing/example/router')).default,
				},
				// 여기에 추후 추가된 publishing 라우터를 추가.
			]
		: [
				{
					path: '/example',
					element: <RootLayout />,
					children: ExampleRouter,
				},
			]),
	{
		path: '*',
		element: (
			<RootLayout
			//message="죄송합니다. 현재 시스템에 일시적인 문제가 발생했습니다."
			//subMessage="잠시 후 다시 접속해주세요.
			//           <br />
			//           문제가 지속되면 아래 고객센터로 문의해주세요."
			/>
		),
	},
];

export default routes;
