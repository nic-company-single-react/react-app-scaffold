import { useMemo, useState } from 'react';
import { Button, SmartTable, defineColumns } from '@axiom/components/ui';
import { Eye } from 'lucide-react';
import OrderFilterBar from './OrderFilterBar';
import OrderDetailDialog from './OrderDetailDialog';
import { INITIAL_ORDER_FILTERS, ORDERS, ORDER_STATUS_META, TODAY, type IOrder, type IOrderFilters } from './order-data';

/** 컬럼 정의 — 렌더마다 새로 만들 이유가 없으므로 컴포넌트 밖에 둔다. */
const orderColumns = defineColumns<IOrder>({
	orderNo: { label: '주문번호', width: 172, className: 'font-mono text-xs' },
	customer: { label: '고객명', width: 88 },
	product: '상품',
	amount: { label: '결제금액', format: 'money', align: 'right', width: 120, aggregate: 'sum' },
	status: {
		label: '상태',
		align: 'center',
		width: 96,
		// 상태 표기는 order-data 한 곳에서만 관리한다. 필터·상세·목록이 같은 값을 쓴다.
		badge: { map: ORDER_STATUS_META },
	},
	channel: { label: '경로', align: 'center', width: 80 },
	orderedAt: { label: '주문일', format: 'date:YYYY.MM.DD', align: 'center', width: 108 },
});

/**
 * 조회 조건을 데이터에 적용한다.
 *
 * 클라이언트 모드 데모라 여기서 직접 거르지만, 서버 모드로 바꾸면 이 함수는 통째로 사라지고
 * 조건이 `SmartTable` 의 `params` 로 서버에 넘어간다.
 */
function filterOrders(orders: IOrder[], filters: IOrderFilters): IOrder[] {
	const keyword = filters.keyword.trim().toLowerCase();
	const from =
		filters.period === 'all' ? null : new Date(new Date(TODAY).getTime() - Number(filters.period) * 86_400_000);

	return orders.filter((order) => {
		if (filters.status !== 'all' && order.status !== filters.status) return false;
		if (from && new Date(order.orderedAt) < from) return false;
		if (keyword && ![order.orderNo, order.customer, order.product].some((v) => v.toLowerCase().includes(keyword)))
			return false;
		return true;
	});
}

/**
 * 실전 예제 — 주문 목록 화면.
 *
 * 업무 화면의 상당수가 이 형태다: **조회 조건 → 결과 요약 → 그리드 → 상세**.
 *
 * 핵심은 조건 상태를 둘로 나눈 것이다.
 *  - `draft`   — 사용자가 입력 중인 조건. 바뀌어도 목록은 그대로다.
 *  - `applied` — [조회] 를 눌러 확정된 조건. 목록은 오직 이 값만 본다.
 *
 * 하나로 합치면 Select 를 건드리는 순간 목록이 바뀌어, 조건을 여러 개 바꾸는 동안
 * 불필요한 재조회(서버 모드에서는 실제 API 호출)가 계속 발생한다.
 */
export default function OrderListTemplate(): React.ReactNode {
	/** 입력 중인 조건 */
	const [draft, setDraft] = useState<IOrderFilters>(INITIAL_ORDER_FILTERS);
	/** 확정된 조회 조건 — 목록은 이 값만 본다 */
	const [applied, setApplied] = useState<IOrderFilters>(INITIAL_ORDER_FILTERS);
	/** 원본 데이터. 주문 취소를 화면에 반영하려고 state 로 들고 있다. */
	const [orders, setOrders] = useState<IOrder[]>(ORDERS);
	/** 상세를 열어둔 행. null 이면 닫힘. */
	const [target, setTarget] = useState<IOrder | null>(null);

	const rows = useMemo(() => filterOrders(orders, applied), [orders, applied]);

	/** 결과 요약 — 그리드 위에 숫자로 먼저 보여주면 사용자가 스크롤 없이 규모를 파악한다. */
	const summary = useMemo(
		() => ({
			count: rows.length,
			total: rows.reduce((acc, o) => (o.status === 'canceled' ? acc : acc + o.amount), 0),
			canceled: rows.filter((o) => o.status === 'canceled').length,
		}),
		[rows],
	);

	const handleReset = () => {
		setDraft(INITIAL_ORDER_FILTERS);
		setApplied(INITIAL_ORDER_FILTERS);
	};

	/** 주문 취소 확정 — 실제 프로젝트에서는 mutation 후 invalidateQueries 로 목록을 다시 받는다. */
	const handleCancelOrder = (order: IOrder) => {
		setOrders((prev) => prev.map((o) => (o.id === order.id ? { ...o, status: 'canceled' } : o)));
		void $ui.alert({ type: 'success', message: `${order.orderNo} 주문이 취소되었습니다.` });
	};

	return (
		<div className="space-y-4">
			{/* ① 조회 조건 */}
			<OrderFilterBar
				value={draft}
				onChange={setDraft}
				onSearch={() => setApplied(draft)}
				onReset={handleReset}
			/>

			{/* ② 결과 요약 */}
			<div className="grid grid-cols-3 gap-3">
				{[
					{ label: '조회 건수', value: `${summary.count}건` },
					{ label: '결제 금액 합계', value: $util.number.currency(summary.total) },
					{ label: '취소 건수', value: `${summary.canceled}건` },
				].map((stat) => (
					<div
						key={stat.label}
						className="rounded-xl border border-gray-200 bg-white px-4 py-3 dark:border-gray-800 dark:bg-gray-900"
					>
						<p className="text-[11px] text-gray-500 dark:text-gray-400">{stat.label}</p>
						<p className="mt-0.5 font-mono text-sm font-semibold text-gray-900 dark:text-white">{stat.value}</p>
					</div>
				))}
			</div>

			{/* ③ 그리드 — 검색창은 위 조건 바가 담당하므로 툴바 검색은 끈다. */}
			<SmartTable
				data={rows}
				columns={orderColumns}
				rowKey="id"
				pageSize={8}
				searchable={false}
				exportable={{ filename: '주문목록', format: 'xlsx' }}
				summary={{ label: '합계' }}
				density="compact"
				emptyText="조회 조건에 맞는 주문이 없습니다."
				onRowClick={(row) => setTarget(row)}
				// 행 클릭만으로는 키보드 사용자가 상세를 열 수 없다. 버튼을 함께 둔다.
				// (행 액션 영역은 SmartTable 이 클릭 전파를 막아주므로 중복 실행되지 않는다.)
				renderRowActions={(row) => (
					<Button
						size="sm"
						variant="outline"
						className="h-7 gap-1 px-2 text-xs"
						onClick={() => setTarget(row)}
					>
						<Eye className="size-3.5" />
						상세
					</Button>
				)}
			/>

			{/* ④ 상세 — 목록 바깥에 인스턴스 하나. 어떤 행을 열지는 target 이 정한다. */}
			<OrderDetailDialog
				order={target}
				onClose={() => setTarget(null)}
				onCancelOrder={handleCancelOrder}
			/>
		</div>
	);
}
