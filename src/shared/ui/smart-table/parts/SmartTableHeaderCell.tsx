/**
 * 정렬 토글 헤더 셀
 *
 * 정렬 가능한 컬럼은 정렬 UI를, 불가하면 라벨만 렌더합니다.
 * - sortMode='toggle'(기본): 클릭 시 정렬만 토글(오름↔내림↔해제), 상/하 아이콘만 표시
 * - sortMode='menu': 드롭다운(오름/내림/숨기기)
 * 미정렬 컬럼의 정렬 힌트 아이콘은 평소 숨겨졌다가 헤더 호버 시 노출됩니다.
 * 아이콘은 sortIcons로 교체 가능하며, 색상은 전부 시맨틱 토큰을 사용합니다.
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

import type { ISmartTableSortIcons, SmartAlign } from '../types';

export interface ISmartTableHeaderCellProps<TData, TValue> {
	column: Column<TData, TValue>;
	title: string;
	align?: SmartAlign;
	/** 정렬 헤더 동작 방식 (기본 'toggle') */
	sortMode?: 'menu' | 'toggle';
	/** 정렬 아이콘 교체 (오름/내림/미정렬) */
	sortIcons?: ISmartTableSortIcons;
}

export default function SmartTableHeaderCell<TData, TValue>({
	column,
	title,
	align = 'left',
	sortMode = 'toggle',
	sortIcons,
}: ISmartTableHeaderCellProps<TData, TValue>): React.ReactNode {
	const justify = align === 'right' ? 'justify-end' : align === 'center' ? 'justify-center' : 'justify-start';

	if (!column.getCanSort()) {
		return <div className={cn('flex items-center', justify)}>{title}</div>;
	}

	const AscIcon = sortIcons?.asc ?? ArrowUp;
	const DescIcon = sortIcons?.desc ?? ArrowDown;
	const UnsortedIcon = sortIcons?.unsorted ?? ChevronsUpDown;

	const sorted = column.getIsSorted();
	const SortIcon = sorted === 'desc' ? DescIcon : sorted === 'asc' ? AscIcon : UnsortedIcon;
	// 정렬됨: 진하게 항상 표시 / 미정렬: 평소 숨김, 헤더(group) 호버 시 노출
	const iconClassName = cn(
		'size-4',
		sorted ? 'text-foreground' : 'text-muted-foreground/70 opacity-0 transition-opacity group-hover:opacity-100',
	);

	// toggle 모드: 드롭다운 없이 클릭으로 정렬만 토글
	if (sortMode === 'toggle') {
		return (
			<div className={cn('flex items-center', justify)}>
				<Button
					variant="ghost"
					size="sm"
					className="group -ml-2 h-8"
					onClick={column.getToggleSortingHandler()}
				>
					<span>{title}</span>
					<SortIcon className={iconClassName} />
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
						className="group -ml-2 h-8 data-[state=open]:bg-accent"
					>
						<span>{title}</span>
						<SortIcon className={iconClassName} />
					</Button>
				</DropdownMenuTrigger>
				<DropdownMenuContent align="start">
					<DropdownMenuItem onClick={() => column.toggleSorting(false)}>
						<AscIcon className="size-4 text-muted-foreground/70" />
						오름차순
					</DropdownMenuItem>
					<DropdownMenuItem onClick={() => column.toggleSorting(true)}>
						<DescIcon className="size-4 text-muted-foreground/70" />
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
