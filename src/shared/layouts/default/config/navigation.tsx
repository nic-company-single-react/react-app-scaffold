import {
	Layers,
	SquareDashedBottomCode,
	Square,
	Group,
	FishingHook,
	Badge,
	ListChevronsDownUp,
	Megaphone,
	SquareStack,
	GalleryHorizontal,
	CheckSquare2,
	ChevronsUpDown,
	Table2,
	CalendarDays,
	PanelBottom,
	CircleDot,
	ListFilter,
	ToggleRight,
	TextCursorInput,
	LoaderCircle,
	Gauge,
	Bell,
	MessageSquareText,
	AppWindow,
	Wrench,
	Calculator,
	Type,
	Landmark,
	Braces,
	ListTree,
	Boxes,
	Store,
	Heart,
} from 'lucide-react';

/** leaf: `path`만 사용. 하위 그룹: `subItems`가 있으면 `path`는 무시됩니다.
 * 2뎁스 leaf에 `icon`이 있으면 사이드바에서 해당 아이콘을 쓰고, 없으면 기본(FileCode) 처리.
 * @example { name: '그룹', subItems: [{ name: '페이지', path: '/path' }] } */
export type NavSubItem = {
	name: string;
	icon?: React.ReactNode;
	path?: string;
	subItems?: NavSubItem[];
	pro?: boolean;
	new?: boolean;
};

export type NavItem = {
	name: string;
	icon: React.ReactNode;
	path?: string;
	subItems?: NavSubItem[];
};

export const navItems: NavItem[] = [
	{
		icon: <Layers />,
		name: 'Dev Examples',
		subItems: [
			{ name: 'introduction', path: '/' },
			{ name: 'Blank 페이지', path: '/example/blank-page' },
		],
	},
	{
		icon: <SquareDashedBottomCode />,
		name: 'UI Components',
		subItems: [
			{ name: 'Accordion', icon: <ListChevronsDownUp />, path: '/example/ui-components/accordion' },
			{ name: 'Alert', icon: <Megaphone />, path: '/example/ui-components/alert' },
			{ name: 'Badge', icon: <Badge />, path: '/example/ui-components/badge' },
			{ name: 'Button', icon: <Square />, path: '/example/ui-components/button' },
			{ name: 'Button Group', icon: <Group />, path: '/example/ui-components/button-group' },
			{ name: 'Card', icon: <SquareStack />, path: '/example/ui-components/card' },
			{ name: 'Carousel', icon: <GalleryHorizontal />, path: '/example/ui-components/carousel' },
			{ name: 'Checkbox', icon: <CheckSquare2 />, path: '/example/ui-components/checkbox' },
			{ name: 'Combobox', icon: <ChevronsUpDown />, path: '/example/ui-components/combobox' },
			{ name: 'Calendar', icon: <CalendarDays />, path: '/example/ui-components/calendar' },
			{ name: 'Data Table', icon: <Table2 />, path: '/example/ui-components/data-table' },
			{ name: 'Drawer', icon: <PanelBottom />, path: '/example/ui-components/drawer' },
			{ name: 'Input', icon: <TextCursorInput />, path: '/example/ui-components/input' },
			{ name: 'Progress', icon: <Gauge />, path: '/example/ui-components/progress' },
			{ name: 'Radio Group', icon: <CircleDot />, path: '/example/ui-components/radio-group' },
			{ name: 'Select', icon: <ListFilter />, path: '/example/ui-components/select' },
			{ name: 'SmartTable', icon: <Table2 />, path: '/example/ui-components/smart-table' },
			{ name: 'Spinner', icon: <LoaderCircle />, path: '/example/ui-components/spinner' },
			{ name: 'Switch', icon: <ToggleRight />, path: '/example/ui-components/switch' },
			{ name: 'Tabs', icon: <AppWindow />, path: '/example/ui-components/tabs' },
			{ name: 'Toast', icon: <Bell />, path: '/example/ui-components/toast' },
			{ name: 'Tooltip', icon: <MessageSquareText />, path: '/example/ui-components/tooltip' },
		],
	},
	{
		icon: <SquareDashedBottomCode />,
		name: 'API Examples',
		subItems: [
			{ name: 'useApi', icon: <FishingHook />, path: '/example/use-api' },
			{
				name: 'useClientState예제',
				subItems: [
					{ name: 'useClientState1', path: '/example/use-client-state-1' },
					{ name: 'useClientState2', path: '/example/use-client-state-2' },
				],
			},
		],
	},
	{
		icon: <Wrench />,
		name: 'Utils',
		subItems: [
			{ name: '전체 목록', icon: <Wrench />, path: '/example/utils' },
			{ name: 'number', icon: <Calculator />, path: '/example/utils/number' },
			{ name: 'string', icon: <Type />, path: '/example/utils/string' },
			{ name: 'date', icon: <CalendarDays />, path: '/example/utils/date' },
			{ name: 'finance', icon: <Landmark />, path: '/example/utils/finance' },
			{ name: 'object', icon: <Braces />, path: '/example/utils/object' },
			{ name: 'array', icon: <ListTree />, path: '/example/utils/array' },
		],
	},
	{
		icon: <Boxes />,
		name: 'Store (Zustand)',
		subItems: [
			{ name: '즐겨찾기 담기', icon: <Store />, path: '/example/store/catalog', new: true },
			{ name: '즐겨찾기 목록', icon: <Heart />, path: '/example/store/favorites' },
		],
	},
];

export const othersItems: NavItem[] = [];
