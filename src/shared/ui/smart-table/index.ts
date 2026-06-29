/**
 * SmartTable 모듈 공개 진입점
 *
 * 사용:
 *   import { SmartTable, defineColumns } from '@axiom/components/ui';
 *   // 또는 직접: import SmartTable from '@/shared/ui/smart-table';
 */
export { default as SmartTable } from './SmartTable';
export { defineColumns } from './types';
export { exportCsv } from './export/exportCsv';
export { exportXlsx } from './export/exportXlsx';

export type {
	ISmartTableProps,
	ISmartTableHandle,
	ISmartColumn,
	ISmartColumnGroup,
	ISmartBadgeMap,
	ISmartBulkAction,
	ISmartServerParamMap,
	ISmartTableSlotClassNames,
	SmartColumns,
	SmartColumnDef,
	SmartSelect,
	SmartFormat,
	SmartAlign,
	BadgeVariant,
} from './types';
