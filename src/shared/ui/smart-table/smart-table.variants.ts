/**
 * SmartTable cva variants
 *
 * 모든 색상은 시맨틱 토큰(bg-muted, border-border, text-foreground 등)만 사용합니다.
 * 사이트별 룩은 themes/theme-[project].css 의 CSS 변수 교체만으로 바뀝니다.
 * (하드코딩된 bg-gray-50 등을 쓰지 않는 이유)
 */
import { cva, type VariantProps } from 'class-variance-authority';

/** 루트 컨테이너 */
export const rootVariants = cva('w-full space-y-3', {
	variants: {
		variant: {
			card: '',
			minimal: '',
			bordered: '',
		},
	},
	defaultVariants: { variant: 'card' },
});

/** 테이블을 감싸는 표 영역 */
export const tableWrapVariants = cva('w-full overflow-x-auto', {
	variants: {
		variant: {
			card: 'rounded-lg border border-border bg-card shadow-sm',
			minimal: '',
			bordered: 'rounded-md border border-border',
		},
	},
	defaultVariants: { variant: 'card' },
});

/** 헤더 행 */
export const headerRowVariants = cva('bg-muted/50 hover:bg-muted/50');

/** 헤더 셀 */
export const headerCellVariants = cva('text-xs font-semibold text-muted-foreground', {
	variants: {
		density: {
			compact: 'h-8',
			normal: 'h-10',
			loose: 'h-12',
		},
	},
	defaultVariants: { density: 'normal' },
});

/** 본문 행 */
export const bodyRowVariants = cva(
	'border-b border-border transition-colors hover:bg-muted/50 data-[state=selected]:bg-accent',
);

/** 본문 셀 */
export const bodyCellVariants = cva('text-sm text-foreground align-middle', {
	variants: {
		density: {
			compact: 'py-1.5',
			normal: 'py-2.5',
			loose: 'py-3.5',
		},
		align: {
			left: 'text-left',
			center: 'text-center',
			right: 'text-right tabular-nums',
		},
	},
	defaultVariants: { density: 'normal', align: 'left' },
});

export type SmartTableVariant = NonNullable<VariantProps<typeof rootVariants>['variant']>;
export type SmartTableDensity = NonNullable<VariantProps<typeof bodyCellVariants>['density']>;
