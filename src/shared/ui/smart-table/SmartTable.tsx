/**
 * SmartTable — 선언형 고수준 데이터 그리드
 *
 * 컬럼을 설정 맵으로 선언하면 포맷·정렬·페이징·검색·행액션·일괄액션·export를
 * 흡수합니다. 클라이언트(data) / 서버(endpoint) 양쪽 모드를 한 API로 지원합니다.
 *
 * @example
 * <SmartTable data={users} columns={{ name: '이름', amount: { label: '금액', format: 'money', align: 'right' } }} searchable exportable />
 */
import { useImperativeHandle } from 'react';
import { flexRender } from '@tanstack/react-table';

import { cn } from '@/shared/utils/cn';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@axiom/components/ui';

import { computeAggregateNode } from './core/aggregate';
import { computeBodyMergeMap } from './core/bodyMerge';
import { buildHeaderLayout, type IHeaderCell } from './core/headerLayout';
import { normalizeColumns } from './core/resolveColumns';
import { useSmartTable } from './core/useSmartTable';
import { exportCsv } from './export/exportCsv';
import { exportXlsx } from './export/exportXlsx';
import SmartTableEmpty from './parts/SmartTableEmpty';
import SmartTableHeaderCell from './parts/SmartTableHeaderCell';
import SmartTablePagination from './parts/SmartTablePagination';
import { SmartTableSelectAllHeader } from './parts/SmartTableSelectCell';
import SmartTableSkeleton from './parts/SmartTableSkeleton';
import SmartTableToolbar from './parts/SmartTableToolbar';
import { bodyCellVariants, bodyRowVariants, headerCellVariants, headerRowVariants, rootVariants, tableWrapVariants } from './smart-table.variants';
import type { ISmartTableProps } from './types';

export type { ISmartTableProps, ISmartTableHandle } from './types';

export default function SmartTable<TRow = Record<string, unknown>, TRaw = unknown>(
	props: ISmartTableProps<TRow, TRaw>,
): React.ReactNode {
	const {
		columns,
		variant = 'card',
		density = 'normal',
		className,
		classNames,
		pageSizeOptions = [10, 20, 30, 50],
		searchable = false,
		searchPlaceholder = '검색...',
		toolbar = true,
		paginated = true,
		sortMode = 'toggle',
		sortIcons,
		sortDisplay = 'hover',
		selectable,
		exportable,
		exporter,
		toolbarStart,
		toolbarEnd,
		bulkActions,
		emptyText,
		renderEmpty,
		onRowClick,
		summary,
		renderRowActions,
		ref,
	} = props;

	const st = useSmartTable<TRow, TRaw>(props);
	const { table, mode, isLoading, isFetching, isError, searchValue, onSearchChange, selectedRows } = st;

	const isSelectable = !!selectable;
	const isExportable = !!exportable;
	const visibleColumnCount = table.getVisibleLeafColumns().length;
	const showToolbar =
		toolbar &&
		(searchable || isExportable || !!toolbarStart || !!toolbarEnd || table.getAllColumns().some((c) => c.getCanHide()) || (!!bulkActions?.length && isSelectable));

	// ── 명령형 핸들 ──────────────────────────────────────────
	useImperativeHandle(
		ref,
		() => ({
			refetch: st.refetch,
			getSelectedRows: () => selectedRows,
			clearSelection: st.clearSelection,
			setKeyword: st.setKeyword,
			goToPage: st.goToPage,
		}),
		[st, selectedRows],
	);

	// ── export (기본 xlsx, format으로 csv 선택) ───────────────
	const handleExport = async (): Promise<void> => {
		if (exporter) {
			exporter(
				table.getRowModel().rows.map((r) => r.original),
				columns,
			);
			return;
		}
		const visibleKeys = table
			.getVisibleLeafColumns()
			.map((c) => c.id)
			.filter((id) => id !== '__select__' && id !== '__actions__');
		// 클라이언트=필터된 전체 행 / 서버=현재 페이지 행
		const exportRows =
			mode === 'client'
				? table.getFilteredRowModel().rows.map((r) => r.original)
				: table.getRowModel().rows.map((r) => r.original);
		const opts = typeof exportable === 'object' ? exportable : {};
		const format = opts.format ?? 'xlsx';
		try {
			if (format === 'csv') {
				exportCsv({ rows: exportRows, columns, visibleKeys, filename: opts.filename });
			} else {
				await exportXlsx({ rows: exportRows, columns, visibleKeys, filename: opts.filename, sheetName: opts.sheetName, summary });
			}
		} catch (err) {
			console.error('[SmartTable] 내보내기 실패', err);
			void $ui.alert('내보내기에 실패했습니다.', { type: 'error' });
		}
	};

	const rows = table.getRowModel().rows;
	const showSkeleton = isLoading;
	const showEmpty = !showSkeleton && rows.length === 0;

	// ── 헤더 레이아웃 (다단계/병합 헤더 + 가시성 반영) ─────────
	const headerLayout = buildHeaderLayout(columns, {
		isVisible: (key) => table.getColumn(key)?.getIsVisible() ?? true,
		selectable: isSelectable,
		hasActions: !!renderRowActions,
	});

	const renderHeaderContent = (cell: IHeaderCell): React.ReactNode => {
		if (cell.kind === 'select') return <SmartTableSelectAllHeader table={table} />;
		if (cell.kind === 'actions') return null;
		if (cell.kind === 'group') {
			const ga = cell.align ?? 'center';
			return (
				<div className={cn('flex items-center', ga === 'right' ? 'justify-end' : ga === 'left' ? 'justify-start' : 'justify-center')}>
					{cell.label}
				</div>
			);
		}
		const column = cell.id ? table.getColumn(cell.id) : undefined;
		return column ? (
			<SmartTableHeaderCell
				column={column}
				title={cell.label}
				align={cell.align}
				sortMode={sortMode}
				sortIcons={sortIcons}
				sortDisplay={sortDisplay}
			/>
		) : (
			cell.label
		);
	};

	// ── 본문 세로 병합(rowspan) 맵 ────────────────────────────
	const leafDefs = normalizeColumns(columns);
	const normByKey = Object.fromEntries(leafDefs.map((c) => [c.key, c]));
	const visibleLeaves = table.getVisibleLeafColumns();
	const mergeColIds = visibleLeaves.filter((c) => normByKey[c.id]?.mergeCells).map((c) => c.id);
	const mergeMap =
		mergeColIds.length > 0
			? computeBodyMergeMap(rows.length, mergeColIds, (ri, cid) => String(rows[ri]?.getValue(cid) ?? ''))
			: null;

	// ── 합계 행 ───────────────────────────────────────────────
	const showSummary = !!summary && !showSkeleton && !showEmpty;
	const summaryLabel = (typeof summary === 'object' ? summary.label : undefined) ?? '합계';
	const aggRows = showSummary
		? (mode === 'client' ? table.getFilteredRowModel().rows : rows).map((r) => r.original)
		: [];
	const firstAggPos = visibleLeaves.findIndex((c) => normByKey[c.id]?.aggregate != null);
	const summaryLabelSpan = firstAggPos <= 0 ? 1 : firstAggPos;

	return (
		<div className={cn(rootVariants({ variant }), classNames?.root, className)}>
			{showToolbar && (
				<SmartTableToolbar
					table={table}
					searchable={searchable}
					searchPlaceholder={searchPlaceholder}
					searchValue={searchValue}
					onSearchChange={onSearchChange}
					exportable={isExportable}
					onExport={() => void handleExport()}
					bulkActions={bulkActions}
					selectedRows={selectedRows}
					onClearSelection={st.clearSelection}
					toolbarStart={toolbarStart}
					toolbarEnd={toolbarEnd}
					className={classNames?.toolbar}
				/>
			)}

			<div className={cn(tableWrapVariants({ variant }), isFetching && 'opacity-70 transition-opacity')}>
				<Table className={classNames?.table}>
					<TableHeader className={classNames?.header}>
						{headerLayout.rows.map((cells, rowIdx) => (
							<TableRow
								key={rowIdx}
								className={headerRowVariants()}
							>
								{cells.map((cell) => (
									<TableHead
										key={`${cell.kind}-${cell.colStart}`}
										colSpan={cell.colSpan > 1 ? cell.colSpan : undefined}
										rowSpan={cell.rowSpan > 1 ? cell.rowSpan : undefined}
										style={cell.width ? { width: cell.width } : undefined}
										className={cn(
											headerCellVariants({ density }),
											cell.kind === 'group' && 'border-b border-border text-center',
											cell.headerClassName,
											classNames?.headerCell,
										)}
									>
										{renderHeaderContent(cell)}
									</TableHead>
								))}
							</TableRow>
						))}
					</TableHeader>

					<TableBody>
						{showSkeleton ? (
							<SmartTableSkeleton
								rows={Math.min(table.getState().pagination.pageSize, 8)}
								colSpan={visibleColumnCount}
							/>
						) : showEmpty ? (
							renderEmpty ? (
								<TableRow className="hover:bg-transparent">
									<TableCell colSpan={visibleColumnCount}>{renderEmpty()}</TableCell>
								</TableRow>
							) : (
								<SmartTableEmpty
									colSpan={visibleColumnCount}
									error={isError}
									emptyText={emptyText}
								/>
							)
						) : (
							rows.map((row, rowIdx) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() ? 'selected' : undefined}
									className={cn(bodyRowVariants(), onRowClick && 'cursor-pointer', classNames?.row)}
									onClick={onRowClick ? () => onRowClick(row.original, row.index) : undefined}
								>
									{row.getVisibleCells().map((cell) => {
										const meta = cell.column.columnDef.meta;
										// 세로 병합: 흡수되는 행은 셀 생략, 시작 행은 rowSpan
										const m = mergeMap?.[cell.column.id]?.[rowIdx];
										if (m && !m.render) return null;
										return (
											<TableCell
												key={cell.id}
												rowSpan={m && m.rowSpan > 1 ? m.rowSpan : undefined}
												style={meta?.width ? { width: meta.width } : undefined}
												className={cn(
													bodyCellVariants({ density, align: meta?.align }),
													m && m.rowSpan > 1 && 'align-middle bg-card',
													meta?.cellClassName,
													classNames?.cell,
												)}
											>
												{flexRender(cell.column.columnDef.cell, cell.getContext())}
											</TableCell>
										);
									})}
								</TableRow>
							))
						)}

						{showSummary && (
							<TableRow className="border-t-2 border-border bg-muted/40 hover:bg-muted/40">
								<TableCell
									colSpan={summaryLabelSpan}
									className={cn(bodyCellVariants({ density }), 'font-semibold text-foreground')}
								>
									{summaryLabel}
								</TableCell>
								{visibleLeaves.slice(summaryLabelSpan).map((col) => {
									const norm = normByKey[col.id];
									const meta = col.columnDef.meta;
									return (
										<TableCell
											key={col.id}
											className={cn(bodyCellVariants({ density, align: meta?.align }), 'font-semibold text-foreground')}
										>
											{norm?.aggregate != null ? computeAggregateNode(norm, aggRows) : null}
										</TableCell>
									);
								})}
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>

			{paginated && (
				<SmartTablePagination
					table={table}
					pageSizeOptions={pageSizeOptions}
					selectable={isSelectable}
					className={classNames?.pagination}
				/>
			)}
		</div>
	);
}
