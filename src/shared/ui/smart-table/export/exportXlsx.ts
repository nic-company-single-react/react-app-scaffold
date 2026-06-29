/**
 * 표시 컬럼 기준 서식 있는 .xlsx 생성·다운로드 (ExcelJS, lazy import)
 *
 * - ExcelJS는 export 실행 시점에 동적 import → 메인 번들엔 포함되지 않습니다.
 * - 다단계(그룹) 헤더는 buildHeaderLayout 결과로 mergeCells 병합합니다. (화면과 동일)
 * - 금액/숫자/퍼센트 컬럼은 "진짜 숫자"로 기록하고 셀 표시 서식(#,##0 / 0.0%)을 입힙니다.
 *   나머지는 화면 표시 텍스트로 기록합니다.
 * - 헤더 굵게·배경·테두리, 본문 테두리, 헤더 전체 틀 고정까지 적용합니다.
 */
import type { Borders, Worksheet } from 'exceljs';

import { computeAggregateExport } from '../core/aggregate';
import { computeBodyMergeMap } from '../core/bodyMerge';
import { buildHeaderLayout } from '../core/headerLayout';
import { getCellValue, getDisplayText, normalizeColumns, type INormalizedColumn } from '../core/resolveColumns';
import type { SmartColumns } from '../types';

export interface IExportXlsxOptions<TRow> {
	rows: TRow[];
	columns: SmartColumns<TRow>;
	/** 표시 중인(숨기지 않은) 컬럼 key 목록. 미지정 시 전체 */
	visibleKeys?: string[];
	filename?: string;
	sheetName?: string;
	/** 하단 합계 행 */
	summary?: boolean | { label?: string };
}

/** 숫자로 기록할 포맷인지 판별 */
function numericKind(format?: string): 'comma' | 'percent' | null {
	if (format === 'money' || format === 'number') return 'comma';
	if (format === 'percent') return 'percent';
	return null;
}

/** 헤더 라벨/포맷 기반 대략적 컬럼 폭 추정 */
function estimateWidth<TRow>(col: INormalizedColumn<TRow>): number {
	const labelLen = [...col.label].reduce((n, ch) => n + (ch.charCodeAt(0) > 127 ? 2 : 1), 0);
	const base = Math.max(labelLen, 8) + 2;
	return Math.min(48, Math.max(10, base));
}

const THIN_BORDER: Partial<Borders> = {
	top: { style: 'thin', color: { argb: 'FFE5E7EB' } },
	left: { style: 'thin', color: { argb: 'FFE5E7EB' } },
	bottom: { style: 'thin', color: { argb: 'FFE5E7EB' } },
	right: { style: 'thin', color: { argb: 'FFE5E7EB' } },
};

function withExt(filename: string | undefined): string {
	if (!filename) return 'export.xlsx';
	return filename.toLowerCase().endsWith('.xlsx') ? filename : `${filename}.xlsx`;
}

/** 병합 영역 전체에 헤더 스타일 적용 (테두리가 모든 칸에 보이도록) */
function styleHeaderRange(ws: Worksheet, r1: number, c1: number, r2: number, c2: number): void {
	for (let r = r1; r <= r2; r++) {
		for (let c = c1; c <= c2; c++) {
			const cell = ws.getCell(r, c);
			cell.font = { bold: true, color: { argb: 'FF374151' } };
			cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'FFF3F4F6' } };
			cell.alignment = { vertical: 'middle', horizontal: 'center' };
			cell.border = THIN_BORDER;
		}
	}
}

export async function exportXlsx<TRow>({
	rows,
	columns,
	visibleKeys,
	filename,
	sheetName,
	summary,
}: IExportXlsxOptions<TRow>): Promise<void> {
	// lazy import: export 버튼을 누를 때만 ExcelJS 청크 로드
	const { Workbook } = await import('exceljs');

	const isVisible = (key: string): boolean => !visibleKeys || visibleKeys.includes(key);
	const leaves = normalizeColumns(columns).filter((c) => isVisible(c.key));
	const layout = buildHeaderLayout(columns, { isVisible });
	const headerDepth = layout.depth;

	const workbook = new Workbook();
	const ws = workbook.addWorksheet(sheetName ?? 'Sheet1', {
		views: [{ state: 'frozen', ySplit: headerDepth }],
	});

	// 컬럼 키/폭 (header는 수동으로 그리므로 미지정)
	ws.columns = leaves.map((c) => ({ key: c.key, width: estimateWidth(c) }));

	// ── 다단계 헤더 작성 + 병합 ───────────────────────────────
	for (const cell of layout.allCells) {
		const r1 = cell.rowStart + 1;
		const c1 = cell.colStart + 1;
		const r2 = cell.rowStart + cell.rowSpan;
		const c2 = cell.colEnd + 1;
		ws.getCell(r1, c1).value = cell.label;
		if (r2 > r1 || c2 > c1) ws.mergeCells(r1, c1, r2, c2);
		styleHeaderRange(ws, r1, c1, r2, c2);
	}
	for (let r = 1; r <= headerDepth; r++) ws.getRow(r).height = 22;

	// ── 본문 ─────────────────────────────────────────────────
	const bodyStart = headerDepth + 1;
	for (const row of rows) {
		const record: Record<string, unknown> = {};
		for (const c of leaves) {
			const kind = numericKind(c.format);
			record[c.key] = kind ? $util.number.toNumber(getCellValue(c, row)) : getDisplayText(c, row);
		}
		const added = ws.addRow(record);
		added.eachCell((cell, colNumber) => {
			const c = leaves[colNumber - 1];
			const kind = numericKind(c.format);
			if (kind === 'comma') cell.numFmt = '#,##0';
			else if (kind === 'percent') cell.numFmt = '0.0%';
			cell.alignment = { vertical: 'middle', horizontal: c.align ?? (kind ? 'right' : 'left') };
			cell.border = THIN_BORDER;
		});
	}

	// ── 본문 세로 병합(rowspan) ───────────────────────────────
	const mergeColIds = leaves.filter((c) => c.mergeCells).map((c) => c.key);
	if (mergeColIds.length > 0 && rows.length > 0) {
		const colIndexByKey = new Map(leaves.map((c, i) => [c.key, i + 1]));
		const mergeMap = computeBodyMergeMap(rows.length, mergeColIds, (ri, cid) => {
			const c = leaves[colIndexByKey.get(cid)! - 1];
			return String(getCellValue(c, rows[ri]) ?? '');
		});
		for (const cid of mergeColIds) {
			const col = colIndexByKey.get(cid)!;
			mergeMap[cid].forEach((info, ri) => {
				if (info.render && info.rowSpan > 1) {
					const top = bodyStart + ri;
					ws.mergeCells(top, col, top + info.rowSpan - 1, col);
					ws.getCell(top, col).alignment = { ...ws.getCell(top, col).alignment, vertical: 'middle' };
				}
			});
		}
	}

	// ── 합계 행 ───────────────────────────────────────────────
	if (summary) {
		const summaryLabel = (typeof summary === 'object' ? summary.label : undefined) ?? '합계';
		const firstAgg = leaves.findIndex((c) => c.aggregate != null);
		const labelSpan = firstAgg <= 0 ? 1 : firstAgg;

		const sRow = ws.addRow([]);
		const r = sRow.number;
		ws.getCell(r, 1).value = summaryLabel;
		if (labelSpan > 1) ws.mergeCells(r, 1, r, labelSpan);
		for (let i = labelSpan; i < leaves.length; i++) {
			const c = leaves[i];
			const agg = computeAggregateExport(c, rows);
			const cell = ws.getCell(r, i + 1);
			if (agg) {
				cell.value = agg.num;
				cell.numFmt = agg.numFmt;
				cell.alignment = { vertical: 'middle', horizontal: c.align ?? 'right' };
			}
		}
		// 합계 행 스타일 (굵게 + 윗 테두리)
		for (let c = 1; c <= leaves.length; c++) {
			const cell = ws.getCell(r, c);
			cell.font = { bold: true };
			cell.border = { ...THIN_BORDER, top: { style: 'medium', color: { argb: 'FF9CA3AF' } } };
			if (!cell.alignment) cell.alignment = { vertical: 'middle' };
		}
	}

	const buffer = await workbook.xlsx.writeBuffer();
	const blob = new Blob([buffer as BlobPart], {
		type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
	});
	const url = URL.createObjectURL(blob);

	const link = document.createElement('a');
	link.href = url;
	link.download = withExt(filename);
	document.body.appendChild(link);
	link.click();
	document.body.removeChild(link);
	URL.revokeObjectURL(url);
}
