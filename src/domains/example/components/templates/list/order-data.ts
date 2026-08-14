/**
 * 목록 화면 템플릿 데모용 샘플 데이터.
 *
 * 실제 프로젝트에서는 이 파일이 통째로 사라지고 SmartTable 의 `endpoint` 가 그 자리를 대신한다.
 * 여기서는 서버 없이 필터·정렬·페이징 동작을 보여주기 위해 고정 데이터를 둔다.
 */

/** 주문 상태 */
export type TOrderStatus = 'pending' | 'paid' | 'shipping' | 'done' | 'canceled';

/** 주문 한 건 */
export interface IOrder {
	id: number;
	orderNo: string;
	customer: string;
	phone: string;
	product: string;
	amount: number;
	status: TOrderStatus;
	channel: '온라인' | '모바일' | '지점';
	orderedAt: string;
}

/** 상태 코드 → 화면 표기. 배지·필터·상세를 이 한 곳에서 공유한다. */
export const ORDER_STATUS_META: Record<
	TOrderStatus,
	{ label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline' }
> = {
	pending: { label: '결제대기', variant: 'outline' },
	paid: { label: '결제완료', variant: 'default' },
	shipping: { label: '배송중', variant: 'secondary' },
	done: { label: '배송완료', variant: 'secondary' },
	canceled: { label: '취소', variant: 'destructive' },
};

/** 필터 Select 에 쓰는 상태 옵션 (전체 + 각 상태) */
export const ORDER_STATUS_OPTIONS = [
	{ value: 'all', label: '전체' },
	...(Object.keys(ORDER_STATUS_META) as TOrderStatus[]).map((key) => ({
		value: key,
		label: ORDER_STATUS_META[key].label,
	})),
];

/** 조회 기간 옵션. value 는 "며칠 전부터"를 뜻하는 일수다. */
export const PERIOD_OPTIONS = [
	{ value: 'all', label: '전체 기간' },
	{ value: '7', label: '최근 7일' },
	{ value: '30', label: '최근 30일' },
	{ value: '90', label: '최근 90일' },
];

/** 목록 화면의 조회 조건 한 벌 */
export interface IOrderFilters {
	keyword: string;
	/** 'all' 또는 TOrderStatus */
	status: string;
	/** 'all' 또는 일수 문자열('7' · '30' · '90') */
	period: string;
}

export const INITIAL_ORDER_FILTERS: IOrderFilters = {
	keyword: '',
	status: 'all',
	period: 'all',
};

/** 기준일 — 데모 데이터의 "오늘". 고정값이라 기간 필터 결과가 항상 재현된다. */
export const TODAY = '2026-08-14';

export const ORDERS: IOrder[] = [
	{
		id: 1,
		orderNo: 'ORD-20260814-001',
		customer: '김철수',
		phone: '01012345678',
		product: '무선 이어폰 Pro',
		amount: 249000,
		status: 'paid',
		channel: '온라인',
		orderedAt: '2026-08-14',
	},
	{
		id: 2,
		orderNo: 'ORD-20260814-002',
		customer: '이영희',
		phone: '01023456789',
		product: '스마트워치 6',
		amount: 389000,
		status: 'pending',
		channel: '모바일',
		orderedAt: '2026-08-14',
	},
	{
		id: 3,
		orderNo: 'ORD-20260813-001',
		customer: '박민수',
		phone: '01034567890',
		product: '노트북 스탠드',
		amount: 45000,
		status: 'shipping',
		channel: '온라인',
		orderedAt: '2026-08-13',
	},
	{
		id: 4,
		orderNo: 'ORD-20260812-001',
		customer: '최지우',
		phone: '01045678901',
		product: '기계식 키보드',
		amount: 178000,
		status: 'done',
		channel: '지점',
		orderedAt: '2026-08-12',
	},
	{
		id: 5,
		orderNo: 'ORD-20260811-001',
		customer: '정해인',
		phone: '01056789012',
		product: '4K 모니터 27"',
		amount: 529000,
		status: 'canceled',
		channel: '온라인',
		orderedAt: '2026-08-11',
	},
	{
		id: 6,
		orderNo: 'ORD-20260810-001',
		customer: '한가람',
		phone: '01067890123',
		product: 'USB-C 허브',
		amount: 62000,
		status: 'done',
		channel: '모바일',
		orderedAt: '2026-08-10',
	},
	{
		id: 7,
		orderNo: 'ORD-20260809-001',
		customer: '오세훈',
		phone: '01078901234',
		product: '무선 마우스',
		amount: 39000,
		status: 'paid',
		channel: '온라인',
		orderedAt: '2026-08-09',
	},
	{
		id: 8,
		orderNo: 'ORD-20260808-001',
		customer: '윤서연',
		phone: '01089012345',
		product: '노트북 파우치',
		amount: 28000,
		status: 'shipping',
		channel: '지점',
		orderedAt: '2026-08-08',
	},
	{
		id: 9,
		orderNo: 'ORD-20260805-001',
		customer: '강동원',
		phone: '01090123456',
		product: '외장 SSD 1TB',
		amount: 145000,
		status: 'done',
		channel: '온라인',
		orderedAt: '2026-08-05',
	},
	{
		id: 10,
		orderNo: 'ORD-20260803-001',
		customer: '신민아',
		phone: '01001234567',
		product: '웹캠 FHD',
		amount: 87000,
		status: 'canceled',
		channel: '모바일',
		orderedAt: '2026-08-03',
	},
	{
		id: 11,
		orderNo: 'ORD-20260801-001',
		customer: '도경수',
		phone: '01011112222',
		product: '태블릿 거치대',
		amount: 34000,
		status: 'done',
		channel: '온라인',
		orderedAt: '2026-08-01',
	},
	{
		id: 12,
		orderNo: 'ORD-20260729-001',
		customer: '배수지',
		phone: '01033334444',
		product: '블루투스 스피커',
		amount: 119000,
		status: 'done',
		channel: '지점',
		orderedAt: '2026-07-29',
	},
	{
		id: 13,
		orderNo: 'ORD-20260726-001',
		customer: '김철수',
		phone: '01012345678',
		product: '노트북 쿨링패드',
		amount: 52000,
		status: 'paid',
		channel: '온라인',
		orderedAt: '2026-07-26',
	},
	{
		id: 14,
		orderNo: 'ORD-20260722-001',
		customer: '이영희',
		phone: '01023456789',
		product: '모니터 암',
		amount: 98000,
		status: 'shipping',
		channel: '모바일',
		orderedAt: '2026-07-22',
	},
	{
		id: 15,
		orderNo: 'ORD-20260718-001',
		customer: '류승범',
		phone: '01055556666',
		product: '기계식 키보드',
		amount: 178000,
		status: 'done',
		channel: '온라인',
		orderedAt: '2026-07-18',
	},
	{
		id: 16,
		orderNo: 'ORD-20260715-001',
		customer: '문소리',
		phone: '01077778888',
		product: '무선 이어폰 Lite',
		amount: 89000,
		status: 'canceled',
		channel: '지점',
		orderedAt: '2026-07-15',
	},
	{
		id: 17,
		orderNo: 'ORD-20260710-001',
		customer: '조정석',
		phone: '01099990000',
		product: '노트북 어댑터',
		amount: 67000,
		status: 'done',
		channel: '온라인',
		orderedAt: '2026-07-10',
	},
	{
		id: 18,
		orderNo: 'ORD-20260705-001',
		customer: '한지민',
		phone: '01012223333',
		product: '스마트워치 밴드',
		amount: 25000,
		status: 'done',
		channel: '모바일',
		orderedAt: '2026-07-05',
	},
	{
		id: 19,
		orderNo: 'ORD-20260628-001',
		customer: '유재석',
		phone: '01034445555',
		product: '4K 모니터 32"',
		amount: 749000,
		status: 'paid',
		channel: '온라인',
		orderedAt: '2026-06-28',
	},
	{
		id: 20,
		orderNo: 'ORD-20260620-001',
		customer: '박보영',
		phone: '01056667777',
		product: '외장 SSD 2TB',
		amount: 269000,
		status: 'done',
		channel: '지점',
		orderedAt: '2026-06-20',
	},
	{
		id: 21,
		orderNo: 'ORD-20260612-001',
		customer: '차은우',
		phone: '01078889999',
		product: '무선 충전 패드',
		amount: 43000,
		status: 'shipping',
		channel: '모바일',
		orderedAt: '2026-06-12',
	},
	{
		id: 22,
		orderNo: 'ORD-20260603-001',
		customer: '김고은',
		phone: '01090001111',
		product: '노트북 스탠드',
		amount: 45000,
		status: 'done',
		channel: '온라인',
		orderedAt: '2026-06-03',
	},
	{
		id: 23,
		orderNo: 'ORD-20260521-001',
		customer: '남주혁',
		phone: '01023335555',
		product: '게이밍 헤드셋',
		amount: 159000,
		status: 'canceled',
		channel: '온라인',
		orderedAt: '2026-05-21',
	},
	{
		id: 24,
		orderNo: 'ORD-20260508-001',
		customer: '전여빈',
		phone: '01045557777',
		product: 'USB-C 케이블 2m',
		amount: 18000,
		status: 'done',
		channel: '모바일',
		orderedAt: '2026-05-08',
	},
];
