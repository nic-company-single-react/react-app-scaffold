/**
 * 정렬 토글 헤더 셀
 *
 * 정렬 가능한 컬럼은 정렬 UI를, 불가하면 라벨만 렌더합니다.
 * - sortMode='toggle'(기본): 클릭 시 정렬만 토글(오름↔내림↔해제), 상/하 아이콘만 표시
 * - sortMode='menu': 드롭다운(오름/내림/숨기기)
 * 색상은 전부 시맨틱 토큰을 사용합니다.
 */
import type { Column } from '@tanstack/react-table';
import { ArrowDown, ArrowUp, ChevronsUpDown, EyeOff } from 'lucide-react';

import { cn } from '@/shared/utils/cn';
import { Button } from '@axiom/components/ui';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from '@/shared/lib/shadcn/ui/dropdown-menu';

import type { SmartAlign } from '../types';

export interface ISmartTableHeaderCellProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
	align?: SmartAlign;
	/** 정렬 헤더 동작 방식 (기본 'toggle') */
	sortMode?: 'menu' | 'toggle';
}

export default function SmartTableHeaderCell<TData, TValue>({
	column,
	title,
	align = 'left',
	sortMode = 'toggle',
}: ISmartTableHeaderCellProps<TData, TValue>): React.ReactNode {
	const justify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

	if (!column.getCanSort()) {
		return <div className={cn('flex items-center', justify)}>{title}</div>;
	}

	const sorted = column.getIsSorted();
	const SortIcon = sorted === 'desc' ? ArrowDown : sorted === 'asc' ? ArrowUp : ChevronsUpDown;

	// toggle 모드: 드롭다운 없이 클릭으로 정렬만 토글
	if (sortMode === 'toggle') {
		return (
			<div className={cn('flex items-center', justify)}>
				<Button
					variant="ghost"
					size="sm"
					className="-ml-2 h-8"
					onClick={column.getToggleSortingHandler()}
				>
					<span>{title}</span>
					<SortIcon className={cn('size-4', sorted ? 'text-foreground' : 'text-muted-foreground/70')} />
				</Button>
			</div>
		);
	}

	return (
		<div className={cn('flex items-center', justify)}>
			<DropdownMenu>
				<DropdownMenuTrigger asChild>
					<Button
						variant="ghost"
						size="sm"
						className="-ml-2 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						{column.getIsSorted() === 'desc' ? (
							<ArrowDown className="size-4" />
						) : column.getIsSorted() === 'asc' ? (
							<ArrowUp className="size-4" />
						) : (
							<ChevronsUpDown className="size-4" />
						)}
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<ArrowUp className="size-4 text-muted-foreground/70" />
						오름차순
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<ArrowDown className="size-4 text-muted-foreground/70" />
						내림차순
					</DropdownMenuItem>
					{column.getCanHide() && (
						<>
							<DropdownMenuSeparator />
							<DropdownMenuItem onClick={() => column.toggleVisibility(false)}>
								<EyeOff className="size-4 text-muted-foreground/70" />
								컬럼 숨기기
							</DropdownMenuItem>
						</>
					)}
				</DropdownMenuContent>
			</DropdownMenu>
		</div>
	);
}
