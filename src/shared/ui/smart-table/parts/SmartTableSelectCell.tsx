/**
 * 전체/행 선택 체크박스
 */
import type { Row, Table } from '@tanstack/react-table';

import { Checkbox } from '@axiom/components/ui';

export interface ISmartTableSelectAllHeaderProps<TData> {
	table: Table<TData>;
}

export function SmartTableSelectAllHeader<TData>({ table }: ISmartTableSelectAllHeaderProps<TData>): React.ReactNode {
	return (
		<Checkbox
			checked={table.getIsAllPageRowsSelected() || (table.getIsSomePageRowsSelected() ? 'indeterminate' : false)}
			onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
			aria-label="전체 선택"
		/>
	);
}

export interface ISmartTableSelectRowCellProps<TData> {
	row: Row<TData>;
}

export function SmartTableSelectRowCell<TData>({ row }: ISmartTableSelectRowCellProps<TData>): React.ReactNode {
	return (
		<Checkbox
			checked={row.getIsSelected()}
			disabled={!row.getCanSelect()}
			onCheckedChange={(value) => row.toggleSelected(!!value)}
			aria-label="행 선택"
			onClick={(e) => e.stopPropagation()}
		/>
	);
}
