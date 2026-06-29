/**
 * 툴바: 검색 + 일괄액션 바 + 슬롯 + 컬럼토글 + export
 */
import type { Table } from '@tanstack/react-table';
import { Download, Settings2, Search, X } from 'lucide-react';

import { cn } from '@/shared/utils/cn';
import { Button, Input } from '@axiom/components/ui';
import {
	DropdownMenu,
	DropdownMenuCheckboxItem,
	DropdownMenuContent,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/lib/shadcn/ui/dropdown-menu';

import type { ISmartBulkAction } from '../types';

export interface ISmartTableToolbarProps<TRow> {
	table: Table<TRow>;
	searchable: boolean;
	searchPlaceholder: string;
	searchValue: string;
	onSearchChange: (value: string) => void;
	exportable: boolean;
	onExport: () => void;
	bulkActions?: ISmartBulkAction<TRow>[];
	selectedRows: TRow[];
	onClearSelection: () => void;
	toolbarStart?: React.ReactNode;
	toolbarEnd?: React.ReactNode;
	className?: string;
}

export default function SmartTableToolbar<TRow>({
	table,
	searchable,
	searchPlaceholder,
	searchValue,
	onSearchChange,
	exportable,
	onExport,
	bulkActions,
	selectedRows,
	onClearSelection,
	toolbarStart,
	toolbarEnd,
	className,
}: ISmartTableToolbarProps<TRow>): React.ReactNode {
	const hideableColumns = table.getAllColumns().filter((c) => c.getCanHide());
	const showBulkBar = !!bulkActions?.length && selectedRows.length > 0;

	return (
		<div className={cn('space-y-2', className)}>
			{/* 일괄 액션 바 */}
			{showBulkBar && (
				<div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-accent/50 px-3 py-2">
					<span className="text-sm font-medium text-foreground">
						{selectedRows.length}개 선택됨
					</span>
					<div className="flex flex-wrap items-center gap-1.5">
						{bulkActions!.map((action) => (
							<Button
								key={action.label}
								size="xs"
								variant={action.variant === 'destructive' ? 'destructive' : 'outline'}
								onClick={() => action.onClick(selectedRows)}
							>
								{action.label}
							</Button>
						))}
					</div>
					<Button
						size="xs"
						variant="ghost"
						className="ml-auto"
						onClick={onClearSelection}
					>
						<X className="size-3.5" />
						선택 해제
					</Button>
				</div>
			)}

			{/* 메인 툴바 */}
			<div className="flex flex-wrap items-center gap-2">
				{toolbarStart}

				{searchable && (
					<div className="relative max-w-xs flex-1">
						<Search className="pointer-events-none absolute top-1/2 left-2.5 size-4 -translate-y-1/2 text-muted-foreground" />
						<Input
							value={searchValue}
							onChange={(e) => onSearchChange(e.target.value)}
							placeholder={searchPlaceholder}
							className="h-8 pl-8"
						/>
					</div>
				)}

				<div className="ml-auto flex items-center gap-2">
					{toolbarEnd}

					{exportable && (
						<Button
							variant="outline"
							size="sm"
							className="h-8 gap-1"
							onClick={onExport}
						>
							<Download className="size-4" />
							내보내기
						</Button>
					)}

					{hideableColumns.length > 0 && (
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="sm"
									className="h-8 gap-1"
								>
									<Settings2 className="size-4" />
									컬럼
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								align="end"
								className="w-[180px]"
							>
								<DropdownMenuLabel className="text-xs">컬럼 표시 설정</DropdownMenuLabel>
								<DropdownMenuSeparator />
								{hideableColumns.map((column) => (
									<DropdownMenuCheckboxItem
										key={column.id}
										checked={column.getIsVisible()}
										onCheckedChange={(value) => column.toggleVisibility(!!value)}
									>
										{column.columnDef.meta?.label ?? column.id}
									</DropdownMenuCheckboxItem>
								))}
							</DropdownMenuContent>
						</DropdownMenu>
					)}
				</div>
			</div>
		</div>
	);
}
