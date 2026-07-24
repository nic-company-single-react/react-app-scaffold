// src/domains/example/router/index.tsx
import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

const BlankPage = loadable(() => import('@/domains/example/pages/BlankPage'));
const ExUseApi = loadable(() => import('@/domains/example/pages/use-api/ExUseApi'));
const UiAlert = loadable(() => import('@/domains/example/pages/ui/UiAlert'));
const UiConfirm = loadable(() => import('@/domains/example/pages/ui/UiConfirm'));
const ButtonComponent = loadable(() => import('@/domains/example/pages/ui-components/ButtonComponent'));
const ButtonGroupComponent = loadable(() => import('@/domains/example/pages/ui-components/ButtonGroupComponent'));
const AccordionComponent = loadable(() => import('@/domains/example/pages/ui-components/AccordionComponent'));
const AvatarComponent = loadable(() => import('@/domains/example/pages/ui-components/AvatarComponent'));
const BreadcrumbComponent = loadable(() => import('@/domains/example/pages/ui-components/BreadcrumbComponent'));
const PaginationComponent = loadable(() => import('@/domains/example/pages/ui-components/PaginationComponent'));
const SkeletonComponent = loadable(() => import('@/domains/example/pages/ui-components/SkeletonComponent'));
const AlertComponent = loadable(() => import('@/domains/example/pages/ui-components/AlertComponent'));
const BadgeComponent = loadable(() => import('@/domains/example/pages/ui-components/BadgeComponent'));
const CardComponent = loadable(() => import('@/domains/example/pages/ui-components/CardComponent'));
const CarouselComponent = loadable(() => import('@/domains/example/pages/ui-components/CarouselComponent'));
const CheckboxComponent = loadable(() => import('@/domains/example/pages/ui-components/CheckboxComponent'));
const ComboboxComponent = loadable(() => import('@/domains/example/pages/ui-components/ComboboxComponent'));
const DrawerComponent = loadable(() => import('@/domains/example/pages/ui-components/DrawerComponent'));
const DropdownMenuComponent = loadable(() => import('@/domains/example/pages/ui-components/DropdownMenuComponent'));
const DialogComponent = loadable(() => import('@/domains/example/pages/ui-components/DialogComponent'));
const InputComponent = loadable(() => import('@/domains/example/pages/ui-components/InputComponent'));
const InputGroupComponent = loadable(() => import('@/domains/example/pages/ui-components/InputGroupComponent'));
const TextareaComponent = loadable(() => import('@/domains/example/pages/ui-components/TextareaComponent'));
const RadioGroupComponent = loadable(() => import('@/domains/example/pages/ui-components/RadioGroupComponent'));
const SelectComponent = loadable(() => import('@/domains/example/pages/ui-components/SelectComponent'));
const NativeSelectComponent = loadable(() => import('@/domains/example/pages/ui-components/NativeSelectComponent'));
const SpinnerComponent = loadable(() => import('@/domains/example/pages/ui-components/SpinnerComponent'));
const SwitchComponent = loadable(() => import('@/domains/example/pages/ui-components/SwitchComponent'));
const ToastComponent = loadable(() => import('@/domains/example/pages/ui-components/ToastComponent'));
const TooltipComponent = loadable(() => import('@/domains/example/pages/ui-components/TooltipComponent'));
const TabsComponent = loadable(() => import('@/domains/example/pages/ui-components/TabsComponent'));
const ToggleComponent = loadable(() => import('@/domains/example/pages/ui-components/ToggleComponent'));
const ProgressComponent = loadable(() => import('@/domains/example/pages/ui-components/ProgressComponent'));
const SliderComponent = loadable(() => import('@/domains/example/pages/ui-components/SliderComponent'));
const TableComponent = loadable(() => import('@/domains/example/pages/ui-components/TableComponent'));
const DataTableComponent = loadable(() => import('@/domains/example/pages/ui-components/DataTableComponent'));
const SmartTableComponent = loadable(() => import('@/domains/example/pages/ui-components/SmartTableComponent'));
const CalendarComponent = loadable(() => import('@/domains/example/pages/ui-components/CalendarComponent'));
const UtilIndex = loadable(() => import('@/domains/example/pages/utils/UtilIndex'));
const NumberUtil = loadable(() => import('@/domains/example/pages/utils/NumberUtil'));
const StringUtil = loadable(() => import('@/domains/example/pages/utils/StringUtil'));
const DateUtil = loadable(() => import('@/domains/example/pages/utils/DateUtil'));
const FinanceUtil = loadable(() => import('@/domains/example/pages/utils/FinanceUtil'));
const ObjectUtil = loadable(() => import('@/domains/example/pages/utils/ObjectUtil'));
const ArrayUtil = loadable(() => import('@/domains/example/pages/utils/ArrayUtil'));
const FavoriteCatalog = loadable(() => import('@/domains/example/pages/store/FavoriteCatalog'));
const FavoriteList = loadable(() => import('@/domains/example/pages/store/FavoriteList'));

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
		path: 'ui/alert',
		element: <UiAlert />,
		name: '$ui.alert 예제',
	},
	{
		path: 'ui/confirm',
		element: <UiConfirm />,
		name: '$ui.confirm 예제',
	},
	{
		path: 'ui-components/button',
		element: <ButtonComponent />,
		name: '버튼 컴포넌트',
	},
	{
		path: 'ui-components/button-group',
		element: <ButtonGroupComponent />,
		name: '버튼 그룹 컴포넌트',
	},
	{
		path: 'ui-components/alert',
		element: <AlertComponent />,
		name: '얼럿 컴포넌트',
	},
	{
		path: 'ui-components/avatar',
		element: <AvatarComponent />,
		name: '아바타 컴포넌트',
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
		path: 'ui-components/breadcrumb',
		element: <BreadcrumbComponent />,
		name: '브레드크럼 컴포넌트',
	},
	{
		path: 'ui-components/pagination',
		element: <PaginationComponent />,
		name: '페이지네이션 컴포넌트',
	},
	{
		path: 'ui-components/skeleton',
		element: <SkeletonComponent />,
		name: '스켈레톤 컴포넌트',
	},
	{
		path: 'ui-components/card',
		element: <CardComponent />,
		name: '카드 컴포넌트',
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
		path: 'ui-components/drawer',
		element: <DrawerComponent />,
		name: '드로어 컴포넌트',
	},
	{
		path: 'ui-components/dropdown-menu',
		element: <DropdownMenuComponent />,
		name: '드롭다운 메뉴 컴포넌트',
	},
	{
		path: 'ui-components/dialog',
		element: <DialogComponent />,
		name: '다이얼로그 컴포넌트',
	},
	{
		path: 'ui-components/input',
		element: <InputComponent />,
		name: '인풋 컴포넌트',
	},
	{
		path: 'ui-components/input-group',
		element: <InputGroupComponent />,
		name: '인풋 그룹 컴포넌트',
	},
	{
		path: 'ui-components/textarea',
		element: <TextareaComponent />,
		name: '텍스트영역 컴포넌트',
	},
	{
		path: 'ui-components/radio-group',
		element: <RadioGroupComponent />,
		name: '라디오 그룹 컴포넌트',
	},
	{
		path: 'ui-components/select',
		element: <SelectComponent />,
		name: '셀렉트 컴포넌트',
	},
	{
		path: 'ui-components/native-select',
		element: <NativeSelectComponent />,
		name: '네이티브 셀렉트 컴포넌트',
	},
	{
		path: 'ui-components/spinner',
		element: <SpinnerComponent />,
		name: '스피너 컴포넌트',
	},
	{
		path: 'ui-components/switch',
		element: <SwitchComponent />,
		name: '스위치 컴포넌트',
	},
	{
		path: 'ui-components/toast',
		element: <ToastComponent />,
		name: '토스트 컴포넌트',
	},
	{
		path: 'ui-components/tooltip',
		element: <TooltipComponent />,
		name: '툴팁 컴포넌트',
	},
	{
		path: 'ui-components/tabs',
		element: <TabsComponent />,
		name: '탭 컴포넌트',
	},
	{
		path: 'ui-components/toggle',
		element: <ToggleComponent />,
		name: '토글 컴포넌트',
	},
	{
		path: 'ui-components/progress',
		element: <ProgressComponent />,
		name: '프로그레스 컴포넌트',
	},
	{
		path: 'ui-components/slider',
		element: <SliderComponent />,
		name: '슬라이더 컴포넌트',
	},
	{
		path: 'ui-components/table',
		element: <TableComponent />,
		name: 'Table 컴포넌트',
	},
	{
		path: 'ui-components/data-table',
		element: <DataTableComponent />,
		name: 'Data Table 컴포넌트',
	},
	{
		path: 'ui-components/smart-table',
		element: <SmartTableComponent />,
		name: 'SmartTable 컴포넌트',
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
	{
		path: 'utils/date',
		element: <DateUtil />,
		name: 'date 유틸',
	},
	{
		path: 'utils/finance',
		element: <FinanceUtil />,
		name: 'finance 유틸',
	},
	{
		path: 'utils/object',
		element: <ObjectUtil />,
		name: 'object 유틸',
	},
	{
		path: 'utils/array',
		element: <ArrayUtil />,
		name: 'array 유틸',
	},
	{
		path: 'store/catalog',
		element: <FavoriteCatalog />,
		name: '즐겨찾기 담기',
	},
	{
		path: 'store/favorites',
		element: <FavoriteList />,
		name: '즐겨찾기 목록',
	},
];

export default routes;
