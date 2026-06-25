// src/domains/example/router/index.tsx
import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

const BlankPage = loadable(() => import('@/domains/example/pages/BlankPage'));
const ExUseApi = loadable(() => import('@/domains/example/pages/use-api/ExUseApi'));
const ButtonComponent = loadable(() => import('@/domains/example/pages/ui-components/ButtonComponent'));
const AccordionComponent = loadable(() => import('@/domains/example/pages/ui-components/AccordionComponent'));
const BadgeComponent = loadable(() => import('@/domains/example/pages/ui-components/BadgeComponent'));
const CarouselComponent = loadable(() => import('@/domains/example/pages/ui-components/CarouselComponent'));
const CheckboxComponent = loadable(() => import('@/domains/example/pages/ui-components/CheckboxComponent'));
const ComboboxComponent = loadable(() => import('@/domains/example/pages/ui-components/ComboboxComponent'));
const DataTableComponent = loadable(() => import('@/domains/example/pages/ui-components/DataTableComponent'));
const CalendarComponent = loadable(() => import('@/domains/example/pages/ui-components/CalendarComponent'));
const UtilIndex = loadable(() => import('@/domains/example/pages/utils/UtilIndex'));
const NumberUtil = loadable(() => import('@/domains/example/pages/utils/NumberUtil'));
const StringUtil = loadable(() => import('@/domains/example/pages/utils/StringUtil'));

const routes: TAppRoute[] = [
	{
		path: 'blank-page', // 라우터 path 를 원하는 이름으로 정하여 작성한다.
		element: <BlankPage />, // 위에서 가져온 페이지 컴포넌트를 element 에 연결한다.
		name: '빈 페이지', // 페이지 name 을 원하는 이름으로 정하여 입력한다.
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
	{
		path: 'ui-components/combobox',
		element: <ComboboxComponent />,
		name: '콤보박스 컴포넌트',
	},
	{
		path: 'ui-components/data-table',
		element: <DataTableComponent />,
		name: 'Data Table 컴포넌트',
	},
	{
		path: 'ui-components/calendar',
		element: <CalendarComponent />,
		name: '캘린더 컴포넌트',
	},
	{
		path: 'utils',
		element: <UtilIndex />,
		name: '유틸리티',
	},
	{
		path: 'utils/number',
		element: <NumberUtil />,
		name: 'number 유틸',
	},
	{
		path: 'utils/string',
		element: <StringUtil />,
		name: 'string 유틸',
	},
];

export default routes;
