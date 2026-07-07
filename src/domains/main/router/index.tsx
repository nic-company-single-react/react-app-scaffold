import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

// 메인화면 컴포넌트 가져오기
const MainIndex = loadable(() => import('@/domains/main/pages/MainIndex'));

const routes: TAppRoute[] = [
	{
		path: '/',
		element: <MainIndex />,
		name: 'MainIndex',
	},
];

export default routes;
