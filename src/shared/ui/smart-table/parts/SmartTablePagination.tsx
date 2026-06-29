/**
 * 페이지네이션
 *
 * 클라이언트/서버 모드 공통. 서버 모드에서도 useReactTable의 manualPagination +
 * pageCount 주입 덕분에 table API(getPageCount/setPageIndex 등)를 그대로 사용합니다.
 */
import type { Table } from '@tanstack/react-table';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';

import { cn } from '@/shared/utils/cn';
import { Button } from '@axiom/components/ui';

export interface ISmartTablePaginationProps<TData> {
	table: Table<TData>;
	pageSizeOptions: number[];
	/** 선택 기능 사용 시 선택 행 수 표시 */
	selectable: boolean;
	className?: string;
}

export default function SmartTablePagination<TData>({
	table,
	pageSizeOptions,
	selectable,
	className,
}: ISmartTablePaginationProps<TData>): React.ReactNode {
	const pageCount = table.getPageCount();

	return (
		<div className={cn('flex flex-col gap-3 px-1 py-2 sm:flex-row sm:items-center sm:justify-between', className)}>
			<div className="text-sm text-muted-foreground">
				{selectable ? (
					<>
						<span className="font-medium text-foreground">
							{table.getFilteredSelectedRowModel().rows.length}
						</span>
						{' / '}
						{table.getFilteredRowModel().rows.length}개 행 선택됨
					</>
				) : (
					<>
						총 <span className="font-medium text-foreground">{table.getRowCount()}</span>개
					</>
				)}
			</div>

			<div className="flex flex-wrap items-center gap-4">
				<div className="flex items-center gap-2">
					<p className="text-sm font-medium whitespace-nowrap">페이지당 행 수</p>
					<select
						value={table.getState().pagination.pageSize}
						onChange={(e) => table.setPageSize(Number(e.target.value))}
						className="h-8 cursor-pointer rounded-md border border-input bg-transparent px-2 py-1 text-sm outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
					>
						{pageSizeOptions.map((size) => (
							<option
								key={size}
								value={size}
							>
								{size}
							</option>
						))}
					</select>
				</div>

				<div className="flex min-w-[80px] items-center justify-center gap-2 text-sm font-medium">
					{table.getState().pagination.pageIndex + 1} / {pageCount || 1} 페이지
				</div>

				<div className="flex items-center gap-1">
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 sm:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
						title="첫 페이지"
					>
						<span className="sr-only">첫 페이지</span>
						<ChevronsLeft className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
						title="이전 페이지"
					>
						<span className="sr-only">이전 페이지</span>
						<ChevronLeft className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="size-8"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
						title="다음 페이지"
					>
						<span className="sr-only">다음 페이지</span>
						<ChevronRight className="size-4" />
					</Button>
					<Button
						variant="outline"
						size="icon"
						className="hidden size-8 sm:flex"
						onClick={() => table.setPageIndex(pageCount - 1)}
						disabled={!table.getCanNextPage()}
						title="마지막 페이지"
					>
						<span className="sr-only">마지막 페이지</span>
						<ChevronsRight className="size-4" />
					</Button>
				</div>
			</div>
		</div>
	);
}
