/**
 * 합계 행 집계 계산
 *
 * computeAggregateNode: 화면용 (함수 집계 = ReactNode 지원, 숫자는 컬럼 format으로 표시)
 * computeAggregateExport: 엑셀용 (sum/avg/count → 숫자 + numFmt, 함수 집계는 생략)
 */
import { formatValue } from '../format/formatRegistry';
import { getCellValue, type INormalizedColumn } from './resolveColumns';

/** 화면용 집계 결과 노드 (집계 없으면 null) */
export function computeAggregateNode<TRow>(col: INormalizedColumn<TRow>, rows: TRow[]): React.ReactNode {
	const agg = col.aggregate;
	if (agg == null) return null;

	const values = rows.map((r) => getCellValue(col, r));
	if (typeof agg === 'function') return agg(values, rows);
	if (agg === 'count') return $util.number.comma(rows.length);

	const sum = values.reduce<number>((acc, v) => acc + $util.number.toNumber(v), 0);
	const result = agg === 'avg' ? (rows.length ? sum / rows.length : 0) : sum;
	return formatValue(col.format, result);
}

/** 엑셀용 집계 결과 (숫자 + numFmt). 함수 집계/집계없음은 null */
export function computeAggregateExport<TRow>(
	col: INormalizedColumn<TRow>,
	rows: TRow[],
): { num: number; numFmt: string } | null {
	const agg = col.aggregate;
	if (agg == null || typeof agg === 'function') return null;
	if (agg === 'count') return { num: rows.length, numFmt: '#,##0' };

	const sum = rows.reduce<number>((acc, r) => acc + $util.number.toNumber(getCellValue(col, r)), 0);
	const result = agg === 'avg' ? (rows.length ? sum / rows.length : 0) : sum;
	const numFmt = col.format === 'percent' ? '0.0%' : '#,##0';
	return { num: result, numFmt };
}
