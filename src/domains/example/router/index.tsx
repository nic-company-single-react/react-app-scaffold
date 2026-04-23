import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

// 라우터에 연결할 페이지를 import 한다.
// loadable 라이브러리는 react에서 Code Splitting를 제공해주는 라이브러리 이다.
const AccountIndex = loadable(() => import('@/domains/example/pages/AccountIndex'));
const ExUseApi = loadable(() => import('@/domains/example/pages/use-api/ExUseApi'));

const routes: TAppRoute[] = [
	{
		path: 'account-page', // 라우터 path를 원하는 이름으로 정하여 작성한다.
		element: <AccountIndex />, // 위에서 가져온 페이지 컴포넌트를 element에 연결한다.
		name: '계좌 메인', // 페이지 name을 원하는 이름으로 정하여 입력한다.
	},
	{
		path: 'use-api',
		element: <ExUseApi />,
		name: 'ExUseApi',
	},
];

export default routes;
