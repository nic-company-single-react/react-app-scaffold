import { Badge, Button, SmartTable, defineColumns } from '@axiom/components/ui';
import { Check } from 'lucide-react';
import { useDialog } from '@axiom/hooks';

/** 데모용 회원 타입 */
export interface IExampleMember {
	id: number;
	name: string;
	phone: string;
	balance: number;
	status: 'active' | 'dormant' | 'blocked';
	joinedAt: string;
}

const MEMBERS: IExampleMember[] = [
	{ id: 1, name: '김철수', phone: '01012345678', balance: 1250000, status: 'active', joinedAt: '2024-03-12' },
	{ id: 2, name: '이영희', phone: '01023456789', balance: 870000, status: 'active', joinedAt: '2024-06-01' },
	{ id: 3, name: '박민수', phone: '01034567890', balance: 0, status: 'dormant', joinedAt: '2023-11-22' },
	{ id: 4, name: '최지우', phone: '01045678901', balance: 3400000, status: 'active', joinedAt: '2025-01-09' },
	{ id: 5, name: '정해인', phone: '01056789012', balance: 120000, status: 'blocked', joinedAt: '2022-08-30' },
];

const columns = defineColumns<IExampleMember>({
	name: '이름',
	phone: { label: '연락처', format: 'phone' },
	balance: { label: '잔액', format: 'money', align: 'right' },
	status: {
		label: '상태',
		align: 'center',
		badge: {
			map: {
				active: { label: '활성', variant: 'default' },
				dormant: { label: '휴면', variant: 'secondary' },
				blocked: { label: '정지', variant: 'destructive' },
			},
		},
	},
});

export interface IMemberPickerDialogProps {
	/** 이미 선택되어 있는 회원 id (있으면 표시) */
	selectedId?: number;
}

/**
 * 예제 — headless 모드(`footer: false`).
 *
 * shell 이 버튼을 그리지 않으므로 컨텐츠가 직접 닫는다.
 * 행을 고르면 `dialog.close(member)` 로 그 회원을 결과로 넘긴다 → 호출부는 `await` 로 받는다.
 *
 * 제어 API 는 prop 으로 주입받지 않고 `useDialog<T>()` 로 꺼낸다. 여기서 준 `T` 는
 * 이 컴포넌트 안에서 `close(...)` 인자를 체크하는 용도이고,
 * 호출부의 `await` 결과 타입은 `$ui.dialog<IExampleMember>({...})` 로 따로 지정한다.
 *
 * 기존 `MemberSmartTableDialog`(컴포넌트형)와 비교하면,
 * `target` state · `open` 파생 · `onOpenChange` 리셋 · `{target && ...}` 가드가 전부 사라진다.
 */
export default function MemberPickerDialog({ selectedId }: IMemberPickerDialogProps): React.ReactNode {
	const dialog = useDialog<IExampleMember>();

	return (
		<SmartTable
			data={MEMBERS}
			columns={columns}
			toolbar={false}
			paginated={false}
			renderRowActions={(member) => (
				<div className="flex items-center gap-2">
					{member.id === selectedId && (
						<Badge variant="secondary">
							<Check className="size-3" />
							선택됨
						</Badge>
					)}
					<Button
						size="sm"
						variant="outline"
						className="h-7 px-2 text-xs"
						onClick={() => dialog.close(member)}
					>
						선택
					</Button>
				</div>
			)}
		/>
	);
}
