/**
 * 다단계(병합) 헤더 레이아웃 계산
 *
 * 중첩 SmartColumns → 헤더 행렬(colSpan/rowSpan + 좌표)로 변환합니다.
 * 화면 렌더(<th colSpan rowSpan>)와 엑셀 export(mergeCells)가 이 동일 결과를 공유해
 * 둘이 항상 일치합니다. 컬럼 토글(가시성)도 반영합니다.
 *
 * - leaf: rowStart=자기 depth, rowSpan=depth-자기depth (아래까지 병합), colSpan=1
 * - group: rowSpan=1, colSpan=보이는 자식 leaf 수 (자식이 모두 숨김이면 생략)
 * - select/actions: depth 전체를 세로 병합하는 leaf로 양 끝에 배치
 */
import { isColumnGroup } from './resolveColumns';
import type { ISmartColumn, ISmartColumnGroup, SmartAlign, SmartColumns } from '../types';

export interface IHeaderCell {
	kind: 'leaf' | 'group' | 'select' | 'actions';
	/** leaf 컬럼 id (kind==='leaf'일 때) */
	id?: string;
	label: string;
	align?: SmartAlign;
	headerClassName?: string;
	width?: number | string;
	/** 0-base 좌표 */
	colStart: number;
	colEnd: number;
	rowStart: number;
	colSpan: number;
	rowSpan: number;
}

export interface IHeaderLayout {
	/** 헤더 행 수 (그룹 깊이) */
	depth: number;
	/** 렌더용 — 행별 셀 (좌→우 정렬됨) */
	rows: IHeaderCell[][];
	/** export용 — 전체 셀 평면 목록 */
	allCells: IHeaderCell[];
}

export interface IBuildHeaderLayoutOptions {
	/** 컬럼 가시성 판별 (컬럼 토글) */
	isVisible: (key: string) => boolean;
	/** 선택 컬럼 포함 (맨 앞) */
	selectable?: boolean;
	/** 액션 컬럼 포함 (맨 뒤) */
	hasActions?: boolean;
}

type HNode<TRow> =
	| { kind: 'leaf'; key: string; label: string; align?: SmartAlign; headerClassName?: string; width?: number | string }
	| { kind: 'group'; label: string; align?: SmartAlign; headerClassName?: string; children: HNode<TRow>[] };

function toTree<TRow>(columns: SmartColumns<TRow>): HNode<TRow>[] {
	return Object.entries(columns).map(([key, def]) => {
		if (typeof def === 'string') return { kind: 'leaf', key, label: def };
		if (isColumnGroup(def)) {
			const g = def as ISmartColumnGroup<TRow>;
			return { kind: 'group', label: g.label, align: g.align, headerClassName: g.headerClassName, children: toTree(g.columns) };
		}
		const c = def as ISmartColumn<TRow>;
		return { kind: 'leaf', key, label: c.label, align: c.align, headerClassName: c.headerClassName, width: c.width };
	});
}

function treeDepth<TRow>(nodes: HNode<TRow>[]): number {
	let max = 1;
	for (const n of nodes) {
		if (n.kind === 'group') max = Math.max(max, 1 + treeDepth(n.children));
	}
	return max;
}

export function buildHeaderLayout<TRow>(
	columns: SmartColumns<TRow>,
	options: IBuildHeaderLayoutOptions,
): IHeaderLayout {
	const { isVisible, selectable, hasActions } = options;
	const tree = toTree(columns);
	const depth = Math.max(1, treeDepth(tree));
	const rows: IHeaderCell[][] = Array.from({ length: depth }, () => []);
	const allCells: IHeaderCell[] = [];
	let col = 0;

	const push = (cell: IHeaderCell): void => {
		rows[cell.rowStart].push(cell);
		allCells.push(cell);
	};

	if (selectable) {
		push({ kind: 'select', label: '', colStart: col, colEnd: col, rowStart: 0, colSpan: 1, rowSpan: depth });
		col += 1;
	}

	const walk = (node: HNode<TRow>, level: number): number => {
		if (node.kind === 'leaf') {
			if (!isVisible(node.key)) return 0;
			const colStart = col;
			col += 1;
			push({
				kind: 'leaf',
				id: node.key,
				label: node.label,
				align: node.align,
				headerClassName: node.headerClassName,
				width: node.width,
				colStart,
				colEnd: colStart,
				rowStart: level,
				colSpan: 1,
				rowSpan: depth - level,
			});
			return 1;
		}
		// group
		const colStart = col;
		let count = 0;
		for (const child of node.children) count += walk(child, level + 1);
		if (count === 0) return 0;
		push({
			kind: 'group',
			label: node.label,
			align: node.align,
			headerClassName: node.headerClassName,
			colStart,
			colEnd: colStart + count - 1,
			rowStart: level,
			colSpan: count,
			rowSpan: 1,
		});
		return count;
	};

	for (const node of tree) walk(node, 0);

	if (hasActions) {
		push({ kind: 'actions', label: '', colStart: col, colEnd: col, rowStart: 0, colSpan: 1, rowSpan: depth });
		col += 1;
	}

	// 렌더 시 좌→우 순서 보장
	rows.forEach((r) => r.sort((a, b) => a.colStart - b.colStart));

	return { depth, rows, allCells };
}
