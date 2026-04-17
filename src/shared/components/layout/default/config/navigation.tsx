import { Layers, SquareDashedBottomCode, Square, FishingHook } from 'lucide-react';

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
		name: 'Remote1',
		subItems: [
			{ name: 'Remote1 메인', path: '/remote1/main' },
			{ name: 'Remote1 계좌목록', path: '/remote1/example/account-page' },
			{ name: 'Remote1 데이터가져오기', path: '/remote1/example/use-api-example' },
		],
	},
	{
		icon: <SquareDashedBottomCode />,
		name: 'Example',
		subItems: [
			{ name: 'Button', icon: <Square />, path: '/example/component-button' },
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
];

export const othersItems: NavItem[] = [];
