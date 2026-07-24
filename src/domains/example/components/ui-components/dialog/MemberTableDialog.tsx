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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
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

const formatPhone = (v: string) => v.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');

/**
 * 실전 예제 — 패턴 A: 공유 Dialog 1개 + 선택된 row 상태.
 *
 * 테이블 row마다 Dialog를 만들지 않는다. DialogContent는 Portal로 document.body
 * 밑에 렌더되므로 row 안에 두는 건 위치상 의미가 없고, row 수만큼 인스턴스만 늘어난다.
 *
 * 핵심:
 *  - Dialog 인스턴스는 테이블 바깥에 단 1개.
 *  - "어떤 row를 열지"는 target 상태(선택된 row 객체)로 넘긴다.
 *  - open은 target 존재 여부로 파생시키고, 닫힐 때 target을 null로 되돌린다.
 *  - 이 페이지 3번 "Controlled" 예제의 boolean open을 "선택된 row"로 확장한 것뿐이다.
 *
 * 이 패턴은 특정 테이블 구현과 무관하다. 여기서는 기본 Table을 썼지만,
 * SmartTable의 renderRowActions, DataTable의 cell 등 어떤 행 버튼이든 onClick에서
 * setTarget(row) 만 호출하면 그대로 적용된다.
 */
export default function MemberTableDialog(): React.ReactNode {
	// 열려있는 대상 row. null이면 닫힘.
	const [target, setTarget] = useState<IMember | null>(null);

	return (
		<div className="space-y-2">
			<div className="overflow-hidden rounded-lg border border-gray-200 dark:border-gray-700">
				<Table>
					<TableHeader>
						<TableRow className="bg-gray-50 dark:bg-gray-800/60 hover:bg-gray-50 dark:hover:bg-gray-800/60">
							<TableHead className="text-xs font-semibold text-gray-600 dark:text-gray-400">이름</TableHead>
							<TableHead className="text-xs font-semibold text-gray-600 dark:text-gray-400">연락처</TableHead>
							<TableHead className="text-right text-xs font-semibold text-gray-600 dark:text-gray-400">잔액</TableHead>
							<TableHead className="text-center text-xs font-semibold text-gray-600 dark:text-gray-400">상태</TableHead>
							<TableHead className="w-0 text-right text-xs font-semibold text-gray-600 dark:text-gray-400">동작</TableHead>
						</TableRow>
					</TableHeader>
					<TableBody>
						{MEMBERS.map((member) => (
							<TableRow
								key={member.id}
								className="border-b border-gray-100 dark:border-gray-800 hover:bg-gray-50/80 dark:hover:bg-gray-800/30"
							>
								<TableCell className="text-sm text-gray-700 dark:text-gray-300">{member.name}</TableCell>
								<TableCell className="font-mono text-sm text-gray-700 dark:text-gray-300">{formatPhone(member.phone)}</TableCell>
								<TableCell className="text-right font-mono text-sm text-gray-700 dark:text-gray-300">
									{member.balance.toLocaleString()}원
								</TableCell>
								<TableCell className="text-center">
									<Badge variant={STATUS_META[member.status].variant}>{STATUS_META[member.status].label}</Badge>
								</TableCell>
								<TableCell className="text-right">
									{/* row 버튼은 "누구를 열지"만 지정한다. Dialog는 여기 없다. */}
									<Button
										size="sm"
										variant="outline"
										className="h-7 gap-1 px-2 text-xs"
										onClick={() => setTarget(member)}
									>
										<Eye className="w-3.5 h-3.5" />
										상세
									</Button>
								</TableCell>
							</TableRow>
						))}
					</TableBody>
				</Table>
			</div>

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
							<dd className="font-mono text-gray-800 dark:text-gray-200">{formatPhone(target.phone)}</dd>

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
