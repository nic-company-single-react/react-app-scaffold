import { useRef, useState } from 'react';
import { MoreHorizontal, Table2 } from 'lucide-react';

import { Button, CodeBlock, SmartTable, defineColumns } from '@axiom/components/ui';
import type { ISmartTableHandle, SmartColumns } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/lib/shadcn/ui/dropdown-menu';

// ── 샘플 타입/데이터 ──────────────────────────────────────────────────
type Member = {
	id: number;
	name: string;
	phone: string;
	balance: number;
	status: 'active' | 'dormant' | 'blocked';
	joinedAt: string;
};

const members: Member[] = [
	{ id: 1, name: '김철수', phone: '01012345678', balance: 1250000, status: 'active', joinedAt: '2024-03-12' },
	{ id: 2, name: '이영희', phone: '01023456789', balance: 870000, status: 'active', joinedAt: '2024-06-01' },
	{ id: 3, name: '박민수', phone: '01034567890', balance: 0, status: 'dormant', joinedAt: '2023-11-22' },
	{ id: 4, name: '최지우', phone: '01045678901', balance: 3400000, status: 'active', joinedAt: '2025-01-09' },
	{ id: 5, name: '정해인', phone: '01056789012', balance: 120000, status: 'blocked', joinedAt: '2022-08-30' },
	{ id: 6, name: '한가람', phone: '01067890123', balance: 560000, status: 'active', joinedAt: '2024-12-15' },
	{ id: 7, name: '오세훈', phone: '01078901234', balance: 95000, status: 'dormant', joinedAt: '2023-05-18' },
	{ id: 8, name: '윤서연', phone: '01089012345', balance: 2780000, status: 'active', joinedAt: '2025-04-02' },
	{ id: 9, name: '강동원', phone: '01090123456', balance: 430000, status: 'active', joinedAt: '2024-09-21' },
	{ id: 10, name: '신민아', phone: '01001234567', balance: 1010000, status: 'blocked', joinedAt: '2023-02-14' },
	{ id: 11, name: '도경수', phone: '01011112222', balance: 640000, status: 'active', joinedAt: '2025-02-27' },
	{ id: 12, name: '배수지', phone: '01033334444', balance: 7800, status: 'dormant', joinedAt: '2022-12-01' },
];

// ── 1. 클라이언트 모드 컬럼 (format/badge DSL) ────────────────────────
const memberColumns = defineColumns<Member>({
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
	joinedAt: { label: '가입일', format: 'date:YYYY.MM.DD' },
});

// ── 다단계(병합) 헤더 컬럼: 그룹은 colspan, leaf는 아래로 rowspan 병합 ─────
const memberGroupedColumns = defineColumns<Member>({
	고객정보: {
		label: '고객정보',
		columns: {
			name: '이름',
			phone: { label: '연락처', format: 'phone' },
		},
	},
	계정상태: {
		label: '계정 상태',
		columns: {
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
			joinedAt: { label: '가입일', format: 'date:YYYY.MM.DD' },
		},
	},
	balance: { label: '잔액', format: 'money', align: 'right' },
});

const GROUPED_CODE = `// 그룹은 { label, columns } 로 선언 — 화면·엑셀 모두 병합 헤더로 렌더됩니다.
const columns = defineColumns<Member>({
  고객정보: { label: '고객정보', columns: {
    name: '이름',
    phone: { label: '연락처', format: 'phone' },
  } },
  계정상태: { label: '계정 상태', columns: {
    status: { label: '상태', badge: { /* ... */ } },
    joinedAt: { label: '가입일', format: 'date:YYYY.MM.DD' },
  } },
  balance: { label: '잔액', format: 'money', align: 'right' },  // 그룹 밖 단독 컬럼은 세로 병합
});

<SmartTable data={members} columns={columns} exportable />  // xlsx도 mergeCells로 동일하게`;

// ── 본문 세로 병합 + 합계 행 데모 (지점/팀 그룹 + 실적 합계) ─────────────
type Ledger = { branch: string; team: string; name: string; amount: number };
const ledger: Ledger[] = [
	{ branch: '서울', team: '영업1팀', name: '김영수', amount: 12_500_000 },
	{ branch: '서울', team: '영업1팀', name: '이지은', amount: 8_700_000 },
	{ branch: '서울', team: '영업2팀', name: '박민호', amount: 9_300_000 },
	{ branch: '서울', team: '영업2팀', name: '최서연', amount: 15_400_000 },
	{ branch: '부산', team: '영업1팀', name: '정해성', amount: 6_200_000 },
	{ branch: '부산', team: '영업1팀', name: '한가람', amount: 5_600_000 },
	{ branch: '부산', team: '영업2팀', name: '오세란', amount: 7_800_000 },
	{ branch: '대구', team: '영업1팀', name: '윤도현', amount: 4_300_000 },
	{ branch: '대구', team: '영업1팀', name: '강민아', amount: 6_400_000 },
];

const ledgerColumns = defineColumns<Ledger>({
	branch: { label: '지점', mergeCells: true, align: 'center' },
	team: { label: '팀', mergeCells: true, align: 'center' },
	name: '담당자',
	amount: { label: '실적', format: 'money', align: 'right', aggregate: 'sum' },
});

const MERGE_CODE = `const columns = defineColumns<Ledger>({
  branch: { label: '지점', mergeCells: true },   // 연속 동일값 → 세로 병합
  team:   { label: '팀',   mergeCells: true },   // 왼쪽(지점) 경계 상속
  name: '담당자',
  amount: { label: '실적', format: 'money', align: 'right', aggregate: 'sum' }, // 합계 집계
});

<SmartTable data={ledger} columns={columns} summary exportable />
// 화면·엑셀 모두: 지점·팀 세로 병합 + 하단 '합계' 행(실적 sum)`;

// ── 2. 서버 모드 타입/컬럼 (JSONPlaceholder posts) ─────────────────────
type Post = { id: number; title: string; body: string };
const postColumns: SmartColumns<Post> = {
	id: { label: 'ID', align: 'right', width: 72 },
	title: '제목',
	body: {
		label: '내용',
		cell: ({ value }) => <span className="line-clamp-1 text-muted-foreground">{String(value)}</span>,
	},
};

const DSL_CODE = `// 컬럼을 "설정 맵"으로 선언 — cell 렌더 함수를 매번 짤 필요가 없습니다.
const columns = defineColumns<Member>({
  name: '이름',                                        // '라벨' 단축형
  phone:   { label: '연락처', format: 'phone' },        // → $util.string.formatMobile
  balance: { label: '잔액', format: 'money', align: 'right' }, // → $util.number.currency
  status: {
    label: '상태', align: 'center',
    badge: { map: {                                    // 값 → 배지 매핑
      active:  { label: '활성', variant: 'default' },
      dormant: { label: '휴면', variant: 'secondary' },
      blocked: { label: '정지', variant: 'destructive' },
    } },
  },
  joinedAt: { label: '가입일', format: 'date:YYYY.MM.DD' }, // → $util.date.format
});

<SmartTable data={members} columns={columns} searchable exportable selectable="multiple" />`;

const SERVER_CODE = `// endpoint만 주면 페이징/정렬/검색이 서버로 자동 배선됩니다.
<SmartTable
  endpoint="https://jsonplaceholder.typicode.com/posts"
  paramMap={{ page: '_page', size: '_limit', sort: '_sort', order: '_order', keyword: 'q' }}
  select={(raw) => ({ rows: raw, total: 100 })}   // 응답 형태가 제각각이므로 어댑터로 매핑
  columns={{ id: { label: 'ID', align: 'right' }, title: '제목', body: '내용' }}
  searchable
/>`;

// ── 행 액션 메뉴 ──────────────────────────────────────────────────────
function MemberRowActions({ member }: { member: Member }): React.ReactNode {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					size="icon"
					className="size-8"
				>
					<span className="sr-only">메뉴 열기</span>
					<MoreHorizontal className="size-4" />
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end">
				<DropdownMenuLabel>작업</DropdownMenuLabel>
				<DropdownMenuItem onClick={() => $ui.alert(`${member.name} 상세 보기`)}>상세 보기</DropdownMenuItem>
				<DropdownMenuSeparator />
				<DropdownMenuItem
					onClick={async () => {
						if (await $ui.confirm(`${member.name} 회원을 삭제할까요?`, { type: 'warning' })) {
							$ui.alert('삭제되었습니다 (데모)', { type: 'success' });
						}
					}}
				>
					삭제
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}

// ── 메인 페이지 ───────────────────────────────────────────────────────
export default function SmartTableComponent(): React.ReactNode {
	const [variant, setVariant] = useState<'card' | 'minimal' | 'bordered'>('card');
	const [density, setDensity] = useState<'compact' | 'normal' | 'loose'>('normal');
	const serverRef = useRef<ISmartTableHandle<Post>>(null);

	return (
		<div className="max-w-5xl space-y-8 p-6">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* 헤더 */}
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
					<Table2 className="h-5 w-5 text-primary" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-foreground">SmartTable</h1>
					<p className="text-sm text-muted-foreground">
						컬럼을 <span className="font-mono text-xs">설정 맵</span>으로 선언하면 포맷·정렬·페이징·검색·행액션·
						export가 자동으로 붙는 고수준 그리드입니다.
					</p>
				</div>
			</div>

			{/* 1. 클라이언트 모드 */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 클라이언트 모드 (배열 바인딩)"
					description="data 배열만 주면 정렬/검색/페이지/컬럼토글/행선택이 로컬로 동작합니다. 내보내기는 기본 xlsx(서식·숫자서식 포함, ExcelJS lazy load)."
				/>
				<SmartTable
					data={members}
					columns={memberColumns}
					variant={variant}
					density={density}
					searchable
					exportable={{ filename: '회원목록', sheetName: '회원' }}
					selectable="multiple"
					searchPlaceholder="이름·연락처 검색..."
					bulkActions={[
						{
							label: '선택 삭제',
							variant: 'destructive',
							onClick: (rows) => $ui.alert(`${rows.length}건 삭제 (데모)`),
						},
						{ label: '내보내기', onClick: (rows) => $ui.alert(`${rows.length}건 내보내기 (데모)`) },
					]}
					renderRowActions={(member) => <MemberRowActions member={member} />}
				/>
			</section>

			{/* 변형 스위처 */}
			<section className="space-y-3">
				<SectionHeader
					title="2. variant · density (스타일 교체)"
					description="모든 색은 시맨틱 토큰을 사용하므로 themes/theme-[project].css 교체만으로 룩이 바뀝니다. 아래로 즉시 전환해 보세요."
				/>
				<div className="flex flex-wrap gap-4">
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-medium text-muted-foreground">variant</span>
						{(['card', 'minimal', 'bordered'] as const).map((v) => (
							<Button
								key={v}
								size="xs"
								variant={variant === v ? 'default' : 'outline'}
								onClick={() => setVariant(v)}
							>
								{v}
							</Button>
						))}
					</div>
					<div className="flex items-center gap-1.5">
						<span className="text-xs font-medium text-muted-foreground">density</span>
						{(['compact', 'normal', 'loose'] as const).map((d) => (
							<Button
								key={d}
								size="xs"
								variant={density === d ? 'default' : 'outline'}
								onClick={() => setDensity(d)}
							>
								{d}
							</Button>
						))}
					</div>
				</div>
			</section>

			{/* 3. 서버 모드 */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 서버 모드 (endpoint 자동 배선)"
					description="endpoint만 주면 페이징/정렬/검색이 서버 쿼리 파라미터로 자동 전송됩니다. paramMap으로 서버별 파라미터명을, select로 응답 형태를 매핑합니다."
				/>
				<div className="flex gap-2">
					<Button
						size="sm"
						variant="outline"
						onClick={() => serverRef.current?.refetch()}
					>
						새로고침 (ref 핸들)
					</Button>
				</div>
				<SmartTable<Post>
					ref={serverRef}
					endpoint="https://jsonplaceholder.typicode.com/posts"
					paramMap={{ page: '_page', size: '_limit', sort: '_sort', order: '_order', keyword: 'q' }}
					select={(raw) => ({ rows: raw as Post[], total: 100 })}
					columns={postColumns}
					pageSize={5}
					searchable
					searchPlaceholder="제목·내용 검색..."
				/>
			</section>

			{/* 4. 다단계(병합) 헤더 */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 다단계(병합) 헤더"
					description="그룹은 { label, columns }로 선언합니다. 그룹은 colspan, 그룹 밖 단독 컬럼은 세로 rowspan으로 병합되고 — 내보내기(xlsx)도 mergeCells로 화면과 동일하게 떨어집니다. 컬럼 토글 시 그룹 폭도 자동 조정."
				/>
				<SmartTable
					data={members}
					columns={memberGroupedColumns}
					exportable={{ filename: '회원목록_그룹', sheetName: '회원' }}
					pageSize={6}
				/>
				<CodeBlock
					code={GROUPED_CODE}
					lang="tsx"
				/>
			</section>

			{/* 5. 본문 세로 병합 + 합계 행 */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 본문 세로 병합 + 합계 행"
					description="mergeCells로 연속 동일값을 세로 병합(왼쪽 컬럼 경계 상속), aggregate + summary로 하단 합계 행을 만듭니다. 화면·엑셀(mergeCells) 동일."
				/>
				<SmartTable
					data={ledger}
					columns={ledgerColumns}
					summary
					exportable={{ filename: '지점별실적', sheetName: '실적' }}
					pageSize={20}
				/>
				<CodeBlock
					code={MERGE_CODE}
					lang="tsx"
				/>
			</section>

			{/* 6. DSL 카탈로그 */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 컬럼 DSL"
					description="format 문자열이 기존 $util.number/date/string 으로 자동 연결됩니다. cell로 빠져나가는 escape hatch도 지원합니다."
				/>
				<CodeBlock
					code={DSL_CODE}
					lang="tsx"
				/>
				<CodeBlock
					code={SERVER_CODE}
					lang="tsx"
				/>
			</section>
		</div>
	);
}
