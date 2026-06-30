/**
 * SmartTable 공개 타입 정의
 *
 * 컬럼을 "설정 맵"으로 선언하면 포맷·정렬·페이징·검색·행액션·export까지
 * 흡수하는 고수준 데이터 그리드의 타입 계약입니다.
 *
 * 저수준 ColumnDef API가 필요하면 기존 DataTable을 사용하세요.
 */
import type { ColumnDef, RowData } from '@tanstack/react-table';
import type { VariantProps } from 'class-variance-authority';
import type { badgeVariants } from '@axiom/components/ui';
import type { THttpMethod } from '@/core/types/api-types';

/** 셀/헤더 정렬 */
export type SmartAlign = 'left' | 'center' | 'right';

/** 아이콘 컴포넌트 타입 (lucide 아이콘 등 className을 받는 컴포넌트) */
export type SmartIconComponent = React.ComponentType<{ className?: string }>;

/** 정렬 헤더 아이콘 커스터마이즈 (미지정 시 lucide 기본값) */
export interface ISmartTableSortIcons {
	/** 오름차순 (기본 ArrowUp) */
	asc?: SmartIconComponent;
	/** 내림차순 (기본 ArrowDown) */
	desc?: SmartIconComponent;
	/** 미정렬 — 정렬 가능 힌트 (기본 ChevronsUpDown) */
	unsorted?: SmartIconComponent;
}

/** Badge 컴포넌트가 지원하는 variant */
export type BadgeVariant = NonNullable<VariantProps<typeof badgeVariants>['variant']>;

/**
 * format 문자열 DSL — formatRegistry가 해석하여 $util.number/date/string에 매핑합니다.
 * - `date:YYYY.MM.DD` 처럼 콜론 뒤 인자를 받을 수 있습니다.
 * - `mask:1-2` 는 start-end 인덱스 구간을 가립니다.
 */
export type SmartFormat =
	| 'money'
	| 'number'
	| 'percent'
	| 'abbreviate'
	| 'date'
	| `date:${string}`
	| 'datetime'
	| 'fromNow'
	| 'phone'
	| 'rrn'
	| 'bizno'
	| 'cardno'
	| 'businessDate'
	| 'maskName'
	| 'maskMobile'
	| 'maskRRN'
	| `mask:${string}`;

/** 값 → 배지 매핑 */
export interface ISmartBadgeMap {
	/** 값별 배지 라벨/스타일. key는 String(value) 기준 */
	map?: Record<string, { label?: string; variant?: BadgeVariant; className?: string }>;
	/** map에 없는 값에 적용할 기본 variant */
	fallbackVariant?: BadgeVariant;
}

/** 셀 렌더 컨텍스트 (escape hatch) */
export interface ISmartCellContext<TRow> {
	value: unknown;
	row: TRow;
	index: number;
}

/**
 * 하단 합계 행 집계 방식.
 * - 'sum'/'avg': 컬럼 값을 숫자로 합산/평균 (컬럼 format으로 표시)
 * - 'count': 행 수
 * - 함수: 직접 계산 (화면 전용, export는 생략)
 */
export type SmartAggregate<TRow = Record<string, unknown>> =
	| 'sum'
	| 'avg'
	| 'count'
	| ((values: unknown[], rows: TRow[]) => React.ReactNode);

/** 컬럼 1개 상세 정의 */
export interface ISmartColumn<TRow = Record<string, unknown>> {
	/** 헤더 라벨 (필수) */
	label: string;
	/** 값 자동 포맷 → $util 매핑 */
	format?: SmartFormat;
	/** 셀/헤더 정렬 (숫자=right 권장) */
	align?: SmartAlign;
	/** px 숫자 또는 '20%' */
	width?: number | string;
	/** 정렬 가능 여부 (기본 true) */
	sortable?: boolean;
	/** 컬럼 토글 노출 여부 (기본 true) */
	hideable?: boolean;
	/** 초기 숨김 */
	hidden?: boolean;
	/** 값 → 배지 렌더 */
	badge?: ISmartBadgeMap;
	/**
	 * 같은 값이 연속되면 세로(rowspan)로 병합합니다. (현재 페이지 기준, 왼쪽 컬럼 경계 상속)
	 * 정렬/그룹된 데이터에서 사용하세요. 화면·엑셀 모두 병합됩니다.
	 */
	mergeCells?: boolean;
	/** 하단 합계 행 집계 방식 (summary 활성 시) */
	aggregate?: SmartAggregate<TRow>;
	/** key와 다른 값 추출 */
	accessor?: (row: TRow) => unknown;
	/** 셀 className 오버라이드 */
	className?: string;
	/** 헤더 className 오버라이드 */
	headerClassName?: string;
	/** 완전 커스텀 셀. 지정 시 format/badge 무시 */
	cell?: (ctx: ISmartCellContext<TRow>) => React.ReactNode;
	/** 최종 탈출구: 원본 ColumnDef 일부를 그대로 머지 */
	columnDef?: Partial<ColumnDef<TRow>>;
}

/**
 * 그룹(다단계) 헤더 정의 — 자식 컬럼들을 colspan으로 묶습니다.
 * 화면·엑셀 모두 병합 헤더로 렌더됩니다. 중첩 가능.
 * @example { 예수금: { label: '예수금', columns: { krw: '원화', usd: '외화' } } }
 */
export interface ISmartColumnGroup<TRow = Record<string, unknown>> {
	/** 그룹 헤더 라벨 (필수) */
	label: string;
	/** 자식 컬럼 맵 (leaf 또는 또 다른 그룹) */
	columns: SmartColumns<TRow>;
	/** 그룹 라벨 정렬 (기본 center) */
	align?: SmartAlign;
	/** 그룹 헤더 className */
	headerClassName?: string;
}

/** 컬럼 항목: '라벨' 단축형 | leaf 상세객체 | 그룹 */
export type SmartColumnDef<TRow = Record<string, unknown>> = string | ISmartColumn<TRow> | ISmartColumnGroup<TRow>;

/** 컬럼 맵 */
export type SmartColumns<TRow = Record<string, unknown>> = {
	[key: string]: SmartColumnDef<TRow>;
};

/** 서버 응답 → 표준형 매핑 어댑터 결과 */
export interface ISmartSelectResult<TRow> {
	rows: TRow[];
	total: number;
}

/** 서버 응답 → { rows, total } 매핑 함수 */
export type SmartSelect<TRaw, TRow> = (raw: TRaw) => ISmartSelectResult<TRow>;

/** 서버모드 파라미터 네이밍 (서버마다 달라서 커스터마이즈) */
export interface ISmartServerParamMap {
	/** 기본 'page' */
	page?: string;
	/** 기본 'size' */
	size?: string;
	/** 기본 'sort' */
	sort?: string;
	/** 기본 'order' (asc/desc) */
	order?: string;
	/** 기본 'keyword' */
	keyword?: string;
	/** 서버 페이지 시작값 (기본 1) */
	pageBase?: 0 | 1;
}

/** 일괄 액션 정의 */
export interface ISmartBulkAction<TRow> {
	label: string;
	onClick: (rows: TRow[]) => void;
	variant?: BadgeVariant;
}

/** 슬롯별 className 오버라이드 */
export interface ISmartTableSlotClassNames {
	root?: string;
	toolbar?: string;
	table?: string;
	header?: string;
	headerCell?: string;
	row?: string;
	cell?: string;
	pagination?: string;
}

/** 명령형 핸들 (ref) */
export interface ISmartTableHandle<TRow = Record<string, unknown>> {
	/** 서버모드: 재조회 (클라이언트모드: no-op) */
	refetch(): void;
	/** 현재 선택된 행 목록 */
	getSelectedRows(): TRow[];
	/** 선택 해제 */
	clearSelection(): void;
	/** 검색어 설정 */
	setKeyword(keyword: string): void;
	/** 페이지 이동 (0-base) */
	goToPage(pageIndex: number): void;
}

/** SmartTable Props */
export interface ISmartTableProps<TRow = Record<string, unknown>, TRaw = unknown> {
	/** 컬럼 DSL (필수) */
	columns: SmartColumns<TRow>;

	// ── 데이터 소스: data XOR endpoint ───────────────────────
	/** 클라이언트 모드: 배열 직접 전달 */
	data?: TRow[];
	/** 서버 모드: endpoint 자동 배선 (useApi) */
	endpoint?: string;
	/** 서버 응답 → { rows, total } 매핑. 미지정 시 기본 어댑터 추론 */
	select?: SmartSelect<TRaw, TRow>;
	/** 서버 파라미터 네이밍 */
	paramMap?: ISmartServerParamMap;
	/** endpoint에 항상 붙는 고정 파라미터 (필터 등) */
	params?: Record<string, string | number | boolean>;
	/** 서버 method (기본 GET) */
	method?: THttpMethod;

	// ── 행 식별/선택 ─────────────────────────────────────────
	/** 행 고유키 (기본 'id') */
	rowKey?: keyof TRow | ((row: TRow) => string);
	/** 행 선택 활성화 */
	selectable?: boolean | 'single' | 'multiple';
	/** 선택 변경 콜백 */
	onSelectionChange?: (rows: TRow[]) => void;

	// ── 페이징/정렬/검색 ─────────────────────────────────────
	/** 초기 페이지 크기 (기본 10) */
	pageSize?: number;
	/** 페이지 크기 옵션 (기본 [10,20,30,50]) */
	pageSizeOptions?: number[];
	/** 툴바 검색창 표시 */
	searchable?: boolean;
	/** 검색창 placeholder */
	searchPlaceholder?: string;
	/**
	 * 정렬 헤더 동작 방식 (기본 `'toggle'`).
	 * - `'toggle'`: 헤더 클릭 시 드롭다운 없이 정렬만 토글, 상/하 아이콘만 표시
	 * - `'menu'`: 헤더 클릭 시 드롭다운(오름차순/내림차순/컬럼 숨기기) 표시
	 *   (컬럼 숨기기는 `'toggle'`에서도 상단 툴바의 "컬럼" 버튼으로 가능합니다.)
	 */
	sortMode?: 'menu' | 'toggle';
	/**
	 * 정렬 해제 단계 허용 여부 (기본 `true`).
	 * - `true`: 오름차순 → 내림차순 → 해제(원래 순서) 3단계 순환
	 * - `false`: 오름차순 ↔ 내림차순 2단계만 순환 (해제 없음)
	 * `sortMode='toggle'`의 클릭 순환에 적용됩니다.
	 */
	sortRemoval?: boolean;
	/**
	 * 정렬 헤더 아이콘 교체 (오름/내림/미정렬). 미지정 시 lucide 기본 아이콘.
	 * @example sortIcons={{ asc: ChevronUp, desc: ChevronDown, unsorted: ChevronsUpDown }}
	 */
	sortIcons?: ISmartTableSortIcons;
	/**
	 * 정렬 표시/동작 방식 (기본 `'hover'`).
	 * - `'hover'`: 미정렬 힌트 아이콘을 헤더 호버 시 노출 (정렬되면 항상 화살표)
	 * - `'always'`: 미정렬 힌트 아이콘도 항상 표시
	 * - `'none'`: 정렬 아이콘을 모두 숨김 (헤더 클릭 정렬은 동작)
	 * - `'off'`: 정렬 기능 자체 비활성 (클릭해도 정렬 안 됨, 라벨만)
	 */
	sortDisplay?: 'hover' | 'always' | 'none' | 'off';
	/** 클라이언트 검색 대상 컬럼 (미지정=전 컬럼) */
	searchKeys?: (keyof TRow)[];
	/**
	 * 상단 툴바(검색/컬럼토글/export/일괄액션/슬롯) 표시 여부 (기본 true).
	 * `false`면 어떤 툴바 요소가 켜져 있어도 툴바 전체를 숨깁니다.
	 */
	toolbar?: boolean;
	/**
	 * 하단 페이징 UI 표시 여부 (기본 true).
	 * 클라이언트 모드에서 `false`면 페이지 분할 없이 전체 데이터를 한 번에 렌더합니다.
	 * (서버 모드에서는 UI만 숨겨지고 데이터는 여전히 서버 페이지 단위로 조회됩니다.)
	 */
	paginated?: boolean;

	// ── 스타일 ───────────────────────────────────────────────
	/** 외형 (기본 card) */
	variant?: 'card' | 'minimal' | 'bordered';
	/** 행 높이 밀도 (기본 normal) */
	density?: 'compact' | 'normal' | 'loose';
	/** 루트 className */
	className?: string;
	/** 슬롯별 className 오버라이드 */
	classNames?: ISmartTableSlotClassNames;

	// ── 상태/이벤트 ─────────────────────────────────────────
	/** 외부 제어 로딩 (클라이언트 모드) */
	loading?: boolean;
	/** 빈 상태 텍스트 */
	emptyText?: React.ReactNode;
	/** 행 클릭 콜백 */
	onRowClick?: (row: TRow, index: number) => void;

	// ── 슬롯/확장 ────────────────────────────────────────────
	/** 검색창 왼쪽 슬롯 */
	toolbarStart?: React.ReactNode;
	/** 컬럼토글 오른쪽 슬롯 */
	toolbarEnd?: React.ReactNode;
	/** 행 끝 액션 메뉴 */
	renderRowActions?: (row: TRow) => React.ReactNode;
	/** 선택 행 일괄 액션 */
	bulkActions?: ISmartBulkAction<TRow>[];
	/**
	 * 하단 합계/소계 행. `true` 또는 `{ label }`.
	 * 컬럼의 `aggregate`로 집계됩니다. 집계 범위 = 클라이언트: 필터된 전체 / 서버: 현재 페이지.
	 */
	summary?: boolean | { label?: string };
	/**
	 * 내보내기 활성화. `true`면 기본 `xlsx`(서식 있는 엑셀).
	 * `format`으로 `csv` 선택 가능. 진짜 .xlsx는 ExcelJS를 lazy import합니다.
	 */
	exportable?: boolean | { filename?: string; format?: 'xlsx' | 'csv'; sheetName?: string };
	/** 완전 커스텀 exporter (지정 시 기본 export 대체) — 예: 다중 시트/로고/합계행 */
	exporter?: (rows: TRow[], columns: SmartColumns<TRow>) => void;
	/** 빈 상태 커스텀 렌더 */
	renderEmpty?: () => React.ReactNode;

	/** 명령형 핸들 (React 19 ref-as-prop) */
	ref?: React.Ref<ISmartTableHandle<TRow>>;
}

/** 타입 추론용 헬퍼 — columns 정의에 감싸면 TRow가 추론됩니다. */
export function defineColumns<TRow>(columns: SmartColumns<TRow>): SmartColumns<TRow> {
	return columns;
}

// ── tanstack ColumnMeta 확장: 정렬/너비/클래스 정보를 셀 렌더에서 사용 ──
declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		label?: string;
		align?: SmartAlign;
		width?: number | string;
		cellClassName?: string;
		headerClassName?: string;
	}
}
