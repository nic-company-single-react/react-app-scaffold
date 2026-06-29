/**
 * 표시 컬럼 기준 UTF-8 BOM CSV 생성·다운로드
 *
 * 선두에 BOM(U+FEFF)을 붙여 Excel에서 한글이 깨지지 않습니다.
 * 진짜 .xlsx가 필요하면 SmartTable의 `exporter` prop으로 위임하세요.
 */
import { getDisplayText, normalizeColumns } from '../core/resolveColumns';
import type { SmartColumns } from '../types';

/** UTF-8 BOM (Excel 한글 인코딩) */
const BOM = '\uFEFF';

/** CSV 한 셀 이스케이프 (쉼표/따옴표/개행 포함 시 따옴표로 감쌈) */
function escapeCell(value: string): string {
	if (/[",\n\r]/.test(value)) {
		return `"${value.replace(/"/g, '""')}"`;
	}
	return value;
}

export interface IExportCsvOptions<TRow> {
	rows: TRow[];
	columns: SmartColumns<TRow>;
	/** 표시 중인(숨기지 않은) 컬럼 key 목록. 미지정 시 전체 */
	visibleKeys?: string[];
	filename?: string;
}

export function exportCsv<TRow>({ rows, columns, visibleKeys, filename }: IExportCsvOptions<TRow>): void {
	const normalized = normalizeColumns(columns).filter((c) => !visibleKeys || visibleKeys.includes(c.key));

	const header = normalized.map((c) => escapeCell(c.label)).join(',');
	const body = rows.map((row) => normalized.map((c) => escapeCell(getDisplayText(c, row))).join(',')).join('\n');

	const csv = `${BOM}${header}\n${body}`;
	const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
	const url = URL.createObjectURL(blob);

	const name = filename ? (filename.toLowerCase().endsWith('.csv') ? filename : `${filename}.csv`) : 'export.csv';
	const link = document.createElement('a');
	link.href = url;
	link.download = name;
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
