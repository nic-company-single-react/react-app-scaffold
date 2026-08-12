export interface IDateBadgeProps {
	/** 배지 왼쪽에 표시할 항목명 (예: '선택된 날짜'). 생략하면 날짜만 표시한다. */
	label?: string;
	/** 표시할 날짜. undefined 면 '—' 로 표시된다. */
	value?: Date;
	/** 브랜드 색으로 강조할지 여부 */
	accent?: boolean;
}

/** 예제에서 선택 결과를 눈으로 확인하기 위한 표시용 배지. */
export default function DateBadge({ label, value, accent = false }: IDateBadgeProps): React.ReactNode {
	return (
		<span
			className={[
				'inline-flex items-center gap-1.5 rounded-xl border px-3 py-1.5 text-xs',
				accent
					? 'border-blue-200 bg-blue-50 dark:border-blue-800 dark:bg-blue-900/20'
					: 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800',
			].join(' ')}
		>
			{label && (
				<span className={accent ? 'text-blue-500 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}>
					{label}
				</span>
			)}
			<span
				className={[
					'font-mono font-semibold tabular-nums',
					accent ? 'text-blue-700 dark:text-blue-300' : 'text-gray-700 dark:text-gray-300',
				].join(' ')}
			>
				{value ? value.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }) : '—'}
			</span>
		</span>
	);
}
