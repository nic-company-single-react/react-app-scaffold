import type { TAppRoute } from '@/types/router';
import { RootLayout } from '@/shared/layouts';
import MainRouter from '@/domains/main/router';
import ExampleRouter from '@/domains/example/router';

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
		: []),
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
