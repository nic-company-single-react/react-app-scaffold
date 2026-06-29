/**
 * 컬럼 DSL(객체맵) → 정규화 → ColumnDef[] 변환
 *
 * normalizeColumns: '라벨' 단축형/상세객체를 단일 형태로 정규화 (export 등에서 재사용)
 * buildColumnDefs:  정규화 컬럼 + 선택/액션 컬럼을 tanstack ColumnDef[]로 조립
 */
import type { ColumnDef } from '@tanstack/react-table';

import CellFormatter from '../format/CellFormatter';
import { formatValue } from '../format/formatRegistry';
import SmartTableHeaderCell from '../parts/SmartTableHeaderCell';
import { SmartTableSelectAllHeader, SmartTableSelectRowCell } from '../parts/SmartTableSelectCell';
import SmartTableRowActions from '../parts/SmartTableRowActions';
import type { ISmartColumn, ISmartColumnGroup, SmartColumnDef, SmartColumns } from '../types';

/** 정규화된 컬럼 (단축형/상세객체 통합) */
export interface INormalizedColumn<TRow> extends ISmartColumn<TRow> {
	/** 객체맵의 key */
	key: string;
}

/** 그룹(다단계) 헤더 정의인지 판별 */
export function isColumnGroup<TRow>(def: SmartColumnDef<TRow>): def is ISmartColumnGroup<TRow> {
	return typeof def === 'object' && def !== null && 'columns' in def;
}

/** 컬럼맵을 leaf 배열로 정규화 (그룹은 깊이 우선으로 펼침) */
export function normalizeColumns<TRow>(columns: SmartColumns<TRow>): INormalizedColumn<TRow>[] {
	const out: INormalizedColumn<TRow>[] = [];
	for (const [key, def] of Object.entries(columns)) {
		if (typeof def === 'string') out.push({ key, label: def });
		else if (isColumnGroup(def)) out.push(...normalizeColumns(def.columns));
		else out.push({ key, ...def });
	}
	return out;
}

/** 행에서 컬럼 값을 추출 (accessor 우선, 없으면 key 접근) */
export function getCellValue<TRow>(col: INormalizedColumn<TRow>, row: TRow): unknown {
	if (col.accessor) return col.accessor(row);
	return (row as Record<string, unknown>)[col.key];
}

export interface IBuildColumnDefsOptions<TRow> {
	selectable: boolean;
	renderRowActions?: (row: TRow) => React.ReactNode;
}

/** 정규화 컬럼 → ColumnDef[] (선택/액션 컬럼 포함) */
export function buildColumnDefs<TRow>(
	normalized: INormalizedColumn<TRow>[],
	options: IBuildColumnDefsOptions<TRow>,
): ColumnDef<TRow>[] {
	const defs: ColumnDef<TRow>[] = [];

	// 선택 컬럼 (맨 앞)
	if (options.selectable) {
		defs.push({
			id: '__select__',
			header: ({ table }) => <SmartTableSelectAllHeader table={table} />,
			cell: ({ row }) => <SmartTableSelectRowCell row={row} />,
			enableSorting: false,
			enableHiding: false,
			meta: { width: 40 },
		});
	}

	// 데이터 컬럼
	for (const col of normalized) {
		const sortable = col.sortable !== false;
		defs.push({
			id: col.key,
			accessorFn: (row) => getCellValue(col, row),
			enableSorting: sortable,
			enableHiding: col.hideable !== false,
			meta: {
				label: col.label,
				align: col.align,
				width: col.width,
				cellClassName: col.className,
				headerClassName: col.headerClassName,
			},
			header: ({ column }) => (
				<SmartTableHeaderCell
					column={column}
					title={col.label}
					align={col.align}
				/>
			),
			cell: ({ row, getValue }) => {
				if (col.cell) {
					return col.cell({ value: getValue(), row: row.original, index: row.index });
				}
				return (
					<CellFormatter
						value={getValue()}
						format={col.format}
						badge={col.badge}
					/>
				);
			},
			...col.columnDef,
		});
	}

	// 액션 컬럼 (맨 뒤)
	if (options.renderRowActions) {
		const render = options.renderRowActions;
		defs.push({
			id: '__actions__',
			header: () => null,
			cell: ({ row }) => <SmartTableRowActions>{render(row.original)}</SmartTableRowActions>,
			enableSorting: false,
			enableHiding: false,
			meta: { align: 'right', width: 56 },
		});
	}

	return defs;
}

/** export 등에서 사용할 표시 텍스트 추출 (배지=라벨, format=포맷 적용) */
export function getDisplayText<TRow>(col: INormalizedColumn<TRow>, row: TRow): string {
	const value = getCellValue(col, row);
	if (col.badge) {
		const key = value === null || value === undefined ? '' : String(value);
		return col.badge.map?.[key]?.label ?? key;
	}
	if (col.cell) {
		// 커스텀 셀은 텍스트화 불가 → 원본 값으로 폴백
		return value === null || value === undefined ? '' : String(value);
	}
	return formatValue(col.format, value);
}
