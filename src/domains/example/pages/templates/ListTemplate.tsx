import { CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import OrderListTemplate from '@/domains/example/components/templates/list/OrderListTemplate';
import orderListSource from '@/domains/example/components/templates/list/OrderListTemplate.tsx?raw';
import orderFilterBarSource from '@/domains/example/components/templates/list/OrderFilterBar.tsx?raw';
import orderDetailDialogSource from '@/domains/example/components/templates/list/OrderDetailDialog.tsx?raw';
import { TableProperties } from 'lucide-react';

const STRUCTURE = [
	{
		step: '①',
		title: '조회 조건',
		file: 'OrderFilterBar.tsx',
		desc: '검색어·상태·기간을 받아 [조회] 로 확정한다. 조회를 직접 하지 않고 조건만 다룬다.',
	},
	{
		step: '②',
		title: '결과 요약',
		file: 'OrderListTemplate.tsx',
		desc: '건수·합계를 그리드 위에 먼저 보여준다. 사용자가 스크롤 없이 규모를 파악한다.',
	},
	{
		step: '③',
		title: '그리드',
		file: 'SmartTable',
		desc: '정렬·페이징·컬럼토글·엑셀 내보내기까지 컴포넌트가 흡수한다.',
	},
	{
		step: '④',
		title: '상세',
		file: 'OrderDetailDialog.tsx',
		desc: '목록 바깥에 인스턴스 하나. 어떤 행을 열지는 선택된 행 상태가 정한다.',
	},
];

const DRAFT_APPLIED_CODE = `// 조건 상태를 둘로 나눈다 — 이 화면 설계의 핵심
const [draft, setDraft]     = useState(INITIAL_ORDER_FILTERS);  // 입력 중인 조건
const [applied, setApplied] = useState(INITIAL_ORDER_FILTERS);  // 확정된 조회 조건

// 목록은 오직 applied 만 본다. draft 가 바뀌어도 화면은 그대로다.
const rows = useMemo(() => filterOrders(orders, applied), [orders, applied]);

<OrderFilterBar
  value={draft}
  onChange={setDraft}                    // 타이핑·선택은 draft 만 갱신
  onSearch={() => setApplied(draft)}     // [조회] 를 눌러야 확정된다
  onReset={handleReset}                  // 초기화는 둘 다 되돌린다
/>`;

const FILTER_CODE = `/**
 * 조회 조건을 데이터에 적용한다.
 * 클라이언트 모드라 여기서 직접 거르지만, 서버 모드에서는 이 함수가 통째로 사라진다.
 */
function filterOrders(orders: IOrder[], filters: IOrderFilters): IOrder[] {
  const keyword = filters.keyword.trim().toLowerCase();
  const from = filters.period === 'all'
    ? null
    : new Date(new Date(TODAY).getTime() - Number(filters.period) * 86_400_000);

  return orders.filter((order) => {
    if (filters.status !== 'all' && order.status !== filters.status) return false;
    if (from && new Date(order.orderedAt) < from) return false;
    if (keyword && ![order.orderNo, order.customer, order.product]
      .some((v) => v.toLowerCase().includes(keyword))) return false;
    return true;
  });
}`;

const COLUMNS_CODE = `// 렌더마다 새로 만들 이유가 없으므로 컴포넌트 밖에 둔다.
const orderColumns = defineColumns<IOrder>({
  orderNo:   { label: '주문번호', width: 172, className: 'font-mono text-xs' },
  customer:  { label: '고객명', width: 88 },
  product:   '상품',                                          // 라벨만 필요하면 문자열 단축형
  amount:    { label: '결제금액', format: 'money', align: 'right', aggregate: 'sum' },
  status:    { label: '상태', align: 'center', badge: { map: ORDER_STATUS_META } },
  channel:   { label: '경로', align: 'center', width: 80 },
  orderedAt: { label: '주문일', format: 'date:YYYY.MM.DD', align: 'center' },
});

// 상태 표기(라벨·배지색)는 order-data.ts 한 곳에서만 관리한다.
// 필터 Select · 목록 배지 · 상세 배지가 모두 같은 ORDER_STATUS_META 를 쓴다.`;

const DETAIL_CODE = `const [target, setTarget] = useState<IOrder | null>(null);

<SmartTable
  data={rows}
  columns={orderColumns}
  onRowClick={(row) => setTarget(row)}
  // 행 클릭만으로는 키보드 사용자가 상세를 열 수 없다. 버튼을 함께 둔다.
  // 행 액션 영역은 SmartTable 이 클릭 전파를 막아주므로 중복 실행되지 않는다.
  renderRowActions={(row) => (
    <Button size="sm" variant="outline" onClick={() => setTarget(row)}>상세</Button>
  )}
/>

{/* 목록 바깥에 인스턴스 하나. 행마다 Dialog 를 만들지 않는다. */}
<OrderDetailDialog
  order={target}
  onClose={() => setTarget(null)}
  onCancelOrder={handleCancelOrder}
/>`;

const SERVER_CODE = `// 클라이언트 모드 — 데모(전체 데이터를 받아 화면에서 거름)
const rows = useMemo(() => filterOrders(orders, applied), [orders, applied]);
<SmartTable data={rows} columns={orderColumns} />

// ── 서버 모드로 전환 ──────────────────────────────────────────────
// filterOrders 는 삭제한다. 조건은 params 로 서버에 넘어가고,
// 정렬·페이징도 SmartTable 이 알아서 쿼리스트링으로 붙인다.
<SmartTable
  endpoint="/api/orders"
  columns={orderColumns}
  params={{
    keyword: applied.keyword,
    status: applied.status === 'all' ? '' : applied.status,
    period: applied.period,
  }}
  // 서버 응답 모양이 { rows, total } 이 아니면 여기서 맞춰준다.
  select={(raw: IOrderListResponse) => ({ rows: raw.content, total: raw.totalElements })}
  // 서버의 파라미터 이름이 다르면 매핑한다. (기본: page/size/sort/order/keyword)
  paramMap={{ page: 'pageNo', size: 'pageSize', pageBase: 1 }}
/>

// applied 가 바뀌면 params 가 바뀌고 → SmartTable 이 자동으로 다시 조회한다.
// draft/applied 분리가 여기서 값을 한다: Select 를 건드릴 때마다 API 가 나가지 않는다.`;

const CHECKLIST = [
	{
		item: 'draft / applied 분리',
		desc: '조건 입력과 조회 실행을 분리한다. 합치면 조건 하나 바꿀 때마다 API 가 나간다.',
	},
	{
		item: '조건 Enter 조회',
		desc: '조건 바를 <form> 으로 감싸고 onSubmit 에 조회를 건다. 검색창에서 Enter 를 눌러도 [조회] 와 같은 경로로 동작한다.',
	},
	{
		item: '코드 표기 단일 출처',
		desc: '상태 라벨·배지색을 상수 한 곳(ORDER_STATUS_META)에 두고 필터·목록·상세가 공유한다. 흩어놓으면 반드시 어긋난다.',
	},
	{
		item: 'Dialog 는 하나만',
		desc: '행마다 Dialog 를 만들지 않는다. 목록 바깥에 하나 두고 "어떤 행" 상태로 연다.',
	},
	{
		item: '키보드 접근',
		desc: 'onRowClick 만 두면 키보드 사용자가 상세를 열 수 없다. 행 액션 버튼을 함께 제공한다.',
	},
	{
		item: '되돌릴 수 없는 동작',
		desc: '취소·삭제는 $ui.confirm 으로 한 번 더 묻고, 상태에 따라 버튼 자체를 비활성화한다.',
	},
	{
		item: '빈 상태 문구',
		desc: 'emptyText 를 조건 조회 맥락에 맞게 쓴다. "데이터가 없습니다"보다 "조회 조건에 맞는 주문이 없습니다"가 낫다.',
	},
	{
		item: '컬럼 정의 위치',
		desc: 'defineColumns 결과를 컴포넌트 밖에 둔다. 안에 두면 렌더마다 새 객체가 되어 불필요한 재계산이 생긴다.',
	},
];

export default function ListTemplate(): React.ReactNode {
	return (
		<div className="p-6 space-y-8 max-w-4xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<TableProperties className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">목록 화면 템플릿</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						조회 조건 · 결과 요약 · 그리드 · 상세 다이얼로그를 한 벌로 묶은 조회 화면입니다. 업무 화면 대부분이 이
						형태입니다.
					</p>
				</div>
			</div>

			{/* ── 1. 화면 구성 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 화면 구성 — 네 덩어리"
					description="조회 화면은 아래 네 부분으로 나뉩니다. 각각을 별도 컴포넌트로 떼어두면 다른 목록 화면을 만들 때 조건 바와 상세만 갈아끼우면 됩니다."
				/>
				<div className="grid gap-3 sm:grid-cols-2">
					{STRUCTURE.map((s) => (
						<div
							key={s.step}
							className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1.5"
						>
							<div className="flex items-center gap-2">
								<span className="text-sm font-bold text-sky-600 dark:text-sky-400">{s.step}</span>
								<span className="text-sm font-medium text-gray-900 dark:text-white">{s.title}</span>
								<code className="ml-auto text-[10px] font-mono text-gray-400 dark:text-gray-500">{s.file}</code>
							</div>
							<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── 2. draft / applied ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 조건 상태를 둘로 나눈다 — draft / applied"
					description="이 화면 설계에서 가장 중요한 부분입니다. 조건 상태를 하나로 두면 Select 를 건드리는 순간 목록이 바뀌어, 조건을 여러 개 바꾸는 동안 불필요한 재조회가 계속 발생합니다. 서버 모드에서는 그대로 API 호출 횟수가 됩니다."
				/>
				<CodeBlock
					code={DRAFT_APPLIED_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<div className="rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-900/15 px-4 py-3">
					<p className="text-xs leading-relaxed text-sky-800 dark:text-sky-300">
						아래 데모에서 <b>상태나 기간만 바꿔보세요.</b> 목록은 그대로입니다. <b>[조회]</b> 를 눌러야 반영됩니다. 실무
						사용자는 조건을 두세 개 바꾼 뒤 한 번에 조회하는 것을 자연스럽게 여깁니다.
					</p>
				</div>
			</section>

			{/* ── 3. 조건 적용 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 조건을 데이터에 적용하기 (클라이언트 모드)"
					description="데이터가 수백 건 이하로 적고 한 번에 다 받아올 수 있다면 화면에서 거르는 편이 훨씬 빠릅니다. 조건별 early return 으로 쓰면 규칙이 늘어도 읽기 쉽습니다."
				/>
				<CodeBlock
					code={FILTER_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 4. 컬럼 정의 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 컬럼 정의 — defineColumns DSL"
					description="컬럼은 '설정 맵'으로 선언합니다. format 이 금액·날짜·전화번호 포맷을, badge 가 코드값 표기를, aggregate 가 합계 행을 담당하므로 셀 렌더 함수를 직접 쓸 일이 거의 없습니다."
				/>
				<CodeBlock
					code={COLUMNS_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
					컬럼 DSL 의 전체 옵션(그룹 헤더 · 셀 병합 · 커스텀 셀 · 서버 모드)은 <b>UI Components → SmartTable</b>{' '}
					페이지에 정리돼 있습니다.
				</p>
			</section>

			{/* ── 5. 상세 연결 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 행 → 상세 다이얼로그 연결"
					description="행마다 Dialog 를 만들지 않습니다. DialogContent 는 Portal 로 body 밑에 렌더되므로 행 안에 두는 건 위치상 의미가 없고, 행 수만큼 인스턴스만 늘어납니다. 목록 바깥에 하나만 두고 '어떤 행을 열지'를 상태로 넘깁니다."
				/>
				<CodeBlock
					code={DETAIL_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 6. 라이브 데모 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 라이브 데모 — 주문 목록"
					description="행을 클릭하거나 [상세] 버튼을 누르면 상세가 열립니다. 결제대기·결제완료 주문은 상세에서 취소할 수 있고(확인 다이얼로그 → 목록 배지 즉시 갱신), 배송이 시작된 주문은 취소 버튼이 잠깁니다. 툴바의 내보내기로 현재 조회 결과를 엑셀로 받을 수 있습니다."
				/>
				<OrderListTemplate />
				<SourceTabs
					files={[
						{ filename: 'OrderListTemplate.tsx', code: orderListSource, lang: 'tsx' },
						{ filename: 'OrderFilterBar.tsx', code: orderFilterBarSource, lang: 'tsx' },
						{ filename: 'OrderDetailDialog.tsx', code: orderDetailDialogSource, lang: 'tsx' },
					]}
				/>
			</section>

			{/* ── 7. 서버 모드 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 서버 모드로 전환하기"
					description="데이터가 많아지면 data 를 endpoint 로 바꿉니다. filterOrders 는 삭제되고, 조건은 params 로 서버에 넘어갑니다. 정렬·페이징도 SmartTable 이 쿼리스트링으로 붙여 보냅니다. 화면 구조는 그대로 둔 채 데이터 소스만 교체하면 됩니다."
				/>
				<CodeBlock
					code={SERVER_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 8. 체크리스트 ────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="8. 목록 화면 체크리스트"
					description="새 조회 화면을 만들 때 확인하세요."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs w-44">
									항목
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									확인 내용
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{CHECKLIST.map((row) => (
								<tr
									key={row.item}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400">{row.item}</code>
									</td>
									<td className="px-4 py-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
