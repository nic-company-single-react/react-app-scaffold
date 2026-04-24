// src/domains/example/router/index.tsx
import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

const AccountIndex = loadable(() => import('@/domains/example/pages/AccountIndex'));
const ExUseApi = loadable(() => import('@/domains/example/pages/use-api/ExUseApi'));
const ButtonComponent = loadable(() => import('@/domains/example/pages/ui-components/ButtonComponent'));
const AccordionComponent = loadable(() => import('@/domains/example/pages/ui-components/AccordionComponent'));
const BadgeComponent = loadable(() => import('@/domains/example/pages/ui-components/BadgeComponent'));
const CarouselComponent = loadable(() => import('@/domains/example/pages/ui-components/CarouselComponent'));
const CheckboxComponent = loadable(() => import('@/domains/example/pages/ui-components/CheckboxComponent'));

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
	{
		path: 'ui-components/button',
		element: <ButtonComponent />,
		name: '버튼 컴포넌트',
	},
	{
		path: 'ui-components/badge',
		element: <BadgeComponent />,
		name: '뱃지 컴포넌트',
	},
	{
		path: 'ui-components/accordion',
		element: <AccordionComponent />,
		name: '아코디언 컴포넌트',
	},
	{
		path: 'ui-components/carousel',
		element: <CarouselComponent />,
		name: '캐러셀 컴포넌트',
	},
	{
		path: 'ui-components/checkbox',
		element: <CheckboxComponent />,
		name: '체크박스 컴포넌트',
	},
];

export default routes;
