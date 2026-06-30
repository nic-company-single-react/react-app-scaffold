/**
 * 클라이언트/서버 모드를 통합하는 핵심 훅
 *
 * - 클라이언트 모드: tanstack의 sorted/filtered/pagination row model로 로컬 처리
 * - 서버 모드: manual* + pageCount 주입, 정렬/검색/페이지 변경을 useServerData로 위임
 * SmartTable.tsx는 모드를 모른 채 반환된 table 인스턴스만 렌더합니다.
 */
import { useEffect, useMemo, useRef, useState } from 'react';
import {
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type ColumnFiltersState,
	type PaginationState,
	type SortingState,
	type Updater,
	type VisibilityState,
} from '@tanstack/react-table';

import { buildColumnDefs, normalizeColumns } from './resolveColumns';
import { useServerData } from './useServerData';
import type { ISmartTableProps } from '../types';

function applyUpdater<T>(updater: Updater<T>, old: T): T {
	return typeof updater === 'function' ? (updater as (o: T) => T)(old) : updater;
}

export function useSmartTable<TRow, TRaw>(props: ISmartTableProps<TRow, TRaw>) {
	const {
		columns,
		data,
		endpoint,
		select,
		paramMap,
		params,
		method,
		rowKey,
		selectable,
		onSelectionChange,
		pageSize = 10,
		searchKeys,
		renderRowActions,
		paginated = true,
	} = props;

	const mode: 'client' | 'server' = endpoint ? 'server' : 'client';
	const isSelectable = !!selectable;

	const normalized = useMemo(() => normalizeColumns(columns), [columns]);
	const columnDefs = useMemo(
		() => buildColumnDefs(normalized, { selectable: isSelectable, renderRowActions }),
		[normalized, isSelectable, renderRowActions],
	);

	// 서버 데이터 (클라이언트 모드에선 enabled:false로 비활성)
	const server = useServerData<TRaw, TRow>({
		enabled: mode === 'server',
		endpoint: endpoint ?? '',
		method,
		fixedParams: params,
		paramMap,
		pageSize,
		select,
	});

	// ── 공통 테이블 상태 ──────────────────────────────────────
	const [rowSelection, setRowSelection] = useState<Record<string, boolean>>({});
	const [columnVisibility, setColumnVisibility] = useState<VisibilityState>(() => {
		const v: VisibilityState = {};
		for (const c of normalized) if (c.hidden) v[c.key] = false;
		return v;
	});

	// ── 클라이언트 전용 상태 ─────────────────────────────────
	const [clientSorting, setClientSorting] = useState<SortingState>([]);
	const [columnFilters] = useState<ColumnFiltersState>([]);
	const [clientPagination, setClientPagination] = useState<PaginationState>({ pageIndex: 0, pageSize });
	const [searchValue, setSearchValue] = useState('');

	const getRowId = useMemo(
		() => (row: TRow, index: number): string => {
			if (typeof rowKey === 'function') return rowKey(row);
			const key = (rowKey as string | undefined) ?? 'id';
			const v = (row as Record<string, unknown>)[key];
			return v !== undefined && v !== null ? String(v) : String(index);
		},
		[rowKey],
	);

	const tableData = mode === 'server' ? server.rows : data ?? [];

	const table = useReactTable<TRow>({
		data: tableData,
		columns: columnDefs,
		getRowId,
		getCoreRowModel: getCoreRowModel(),
		enableRowSelection: isSelectable,
		enableMultiRowSelection: selectable !== 'single',
		onRowSelectionChange: setRowSelection,
		onColumnVisibilityChange: setColumnVisibility,

		...(mode === 'client'
			? {
					getSortedRowModel: getSortedRowModel(),
					getFilteredRowModel: getFilteredRowModel(),
					// paginated=false면 페이지네이션 row model을 빼서 전체 행을 한 번에 노출
					...(paginated ? { getPaginationRowModel: getPaginationRowModel() } : {}),
					onSortingChange: setClientSorting,
					onPaginationChange: setClientPagination,
					onGlobalFilterChange: setSearchValue,
					globalFilterFn: (row, _columnId, filterValue) => {
						const q = String(filterValue).toLowerCase();
						if (!q) return true;
						const keys = (searchKeys as string[] | undefined) ?? Object.keys(row.original as object);
						return keys.some((k) =>
							String((row.original as Record<string, unknown>)[k] ?? '')
								.toLowerCase()
								.includes(q),
						);
					},
					state: {
						rowSelection,
						columnVisibility,
						columnFilters,
						sorting: clientSorting,
						pagination: clientPagination,
						globalFilter: searchValue,
					},
				}
			: {
					manualPagination: true,
					manualSorting: true,
					manualFiltering: true,
					pageCount: Math.max(1, Math.ceil(server.total / server.size)),
					onSortingChange: (updater) => {
						const next = applyUpdater(updater, server.sorting);
						server.setSorting(next);
						server.setPage(0);
					},
					onPaginationChange: (updater) => {
						const old: PaginationState = { pageIndex: server.page, pageSize: server.size };
						const next = applyUpdater(updater, old);
						if (next.pageSize !== old.pageSize) {
							server.setSize(next.pageSize);
							server.setPage(0);
						} else {
							server.setPage(next.pageIndex);
						}
					},
					state: {
						rowSelection,
						columnVisibility,
						sorting: server.sorting,
						pagination: { pageIndex: server.page, pageSize: server.size },
					},
				}),
	});

	// 선택 변경 콜백
	const selectedRows = table.getSelectedRowModel().rows.map((r) => r.original);
	const lastSelectionRef = useRef<string>('');
	useEffect(() => {
		const sig = Object.keys(rowSelection).sort().join(',');
		if (sig === lastSelectionRef.current) return;
		lastSelectionRef.current = sig;
		onSelectionChange?.(selectedRows);
	}, [rowSelection]);

	const onSearchChange = (value: string): void => {
		setSearchValue(value);
		if (mode === 'server') server.setKeyword(value);
	};

	return {
		table,
		mode,
		normalized,
		isLoading: mode === 'server' ? server.isLoading : !!props.loading,
		isFetching: mode === 'server' ? server.isFetching : false,
		isError: mode === 'server' ? server.isError : false,
		searchValue,
		onSearchChange,
		selectedRows,
		refetch: () => {
			if (mode === 'server') server.refetch();
		},
		clearSelection: () => table.resetRowSelection(),
		goToPage: (pageIndex: number) => table.setPageIndex(pageIndex),
		setKeyword: onSearchChange,
	};
}
