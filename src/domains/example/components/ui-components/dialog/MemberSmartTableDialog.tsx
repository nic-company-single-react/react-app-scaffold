import { useState } from 'react';
import {
	Badge,
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	SmartTable,
	defineColumns,
} from '@axiom/components/ui';
import { Eye } from 'lucide-react';

/** 데모용 회원 타입 */
interface IMember {
	id: number;
	name: string;
	phone: string;
	balance: number;
	status: 'active' | 'dormant' | 'blocked';
	joinedAt: string;
}

const MEMBERS: IMember[] = [
	{ id: 1, name: '김철수', phone: '01012345678', balance: 1250000, status: 'active', joinedAt: '2024-03-12' },
	{ id: 2, name: '이영희', phone: '01023456789', balance: 870000, status: 'active', joinedAt: '2024-06-01' },
	{ id: 3, name: '박민수', phone: '01034567890', balance: 0, status: 'dormant', joinedAt: '2023-11-22' },
	{ id: 4, name: '최지우', phone: '01045678901', balance: 3400000, status: 'active', joinedAt: '2025-01-09' },
	{ id: 5, name: '정해인', phone: '01056789012', balance: 120000, status: 'blocked', joinedAt: '2022-08-30' },
];

const STATUS_META: Record<IMember['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
	active: { label: '활성', variant: 'default' },
	dormant: { label: '휴면', variant: 'secondary' },
	blocked: { label: '정지', variant: 'destructive' },
};

// SmartTable은 컬럼 DSL로 포맷/배지를 선언한다. 행 버튼은 renderRowActions로 붙인다.
const columns = defineColumns<IMember>({
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

/**
 * 실전 예제 — 패턴 A(SmartTable판): 공유 Dialog 1개 + 선택된 row 상태.
 *
 * 기본 Table 예제(MemberTableDialog)와 완전히 동일한 패턴이다. 테이블 구현만
 * SmartTable로 바뀌었을 뿐, Dialog는 여전히 테이블 바깥에 단 1개이고 target 상태로 제어한다.
 *
 * 유일한 차이: 행 버튼을 SmartTable의 renderRowActions 슬롯으로 넘긴다.
 * 그 안에서도 하는 일은 동일하다 → onClick={() => setTarget(member)}.
 */
export default function MemberSmartTableDialog(): React.ReactNode {
	// 열려있는 대상 row. null이면 닫힘.
	const [target, setTarget] = useState<IMember | null>(null);

	return (
		<div className="space-y-2">
			<SmartTable
				data={MEMBERS}
				columns={columns}
				toolbar={false}
				paginated={false}
				// row 버튼은 "누구를 열지"만 지정한다. Dialog는 여기 없다.
				renderRowActions={(member) => (
					<Button
						size="sm"
						variant="outline"
						className="h-7 gap-1 px-2 text-xs"
						onClick={() => setTarget(member)}
					>
						<Eye className="w-3.5 h-3.5" />
						상세
					</Button>
				)}
			/>

			{/* Dialog는 테이블 바깥에 단 하나. target으로 열고 닫는다. */}
			<Dialog
				open={target !== null}
				onOpenChange={(open) => {
					if (!open) setTarget(null); // 닫힐 때 선택 해제
				}}
			>
				<DialogContent>
					<DialogHeader>
						<DialogTitle>{target?.name} 회원 상세</DialogTitle>
						<DialogDescription>선택한 행의 정보를 하나의 Dialog에서 보여줍니다.</DialogDescription>
					</DialogHeader>

					{/* target이 있을 때만 본문을 그린다 (닫힐 때 target=null이라 옵셔널 접근) */}
					{target && (
						<dl className="grid grid-cols-[5rem_1fr] gap-x-4 gap-y-2.5 text-sm">
							<dt className="text-gray-500 dark:text-gray-400">회원번호</dt>
							<dd className="font-mono text-gray-800 dark:text-gray-200">#{target.id}</dd>

							<dt className="text-gray-500 dark:text-gray-400">이름</dt>
							<dd className="text-gray-800 dark:text-gray-200">{target.name}</dd>

							<dt className="text-gray-500 dark:text-gray-400">연락처</dt>
							<dd className="font-mono text-gray-800 dark:text-gray-200">
								{target.phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')}
							</dd>

							<dt className="text-gray-500 dark:text-gray-400">잔액</dt>
							<dd className="font-mono text-gray-800 dark:text-gray-200">{target.balance.toLocaleString()}원</dd>

							<dt className="text-gray-500 dark:text-gray-400">상태</dt>
							<dd>
								<Badge variant={STATUS_META[target.status].variant}>{STATUS_META[target.status].label}</Badge>
							</dd>

							<dt className="text-gray-500 dark:text-gray-400">가입일</dt>
							<dd className="text-gray-800 dark:text-gray-200">{target.joinedAt}</dd>
						</dl>
					)}

					<DialogFooter showCloseButton />
				</DialogContent>
			</Dialog>
		</div>
	);
}
