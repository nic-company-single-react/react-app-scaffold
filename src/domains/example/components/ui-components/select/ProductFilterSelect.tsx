import { useMemo, useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@axiom/components/ui';
import styles from './ProductFilterSelect.module.css';

/** 필터 한 개(트리거 하나 = Select 하나) */
interface IFilter {
	key: string;
	/** 트리거 앞에 붙는 라벨(예: "정렬 ·") */
	prefix: string;
	placeholder: string;
	options: { value: string; label: string }[];
}

const FILTERS: IFilter[] = [
	{
		key: 'sort',
		prefix: '정렬',
		placeholder: '기본순',
		options: [
			{ value: 'recent', label: '최신순' },
			{ value: 'low', label: '낮은 가격순' },
			{ value: 'high', label: '높은 가격순' },
			{ value: 'review', label: '리뷰 많은순' },
		],
	},
	{
		key: 'category',
		prefix: '카테고리',
		placeholder: '전체',
		options: [
			{ value: 'top', label: '상의' },
			{ value: 'bottom', label: '하의' },
			{ value: 'shoes', label: '신발' },
			{ value: 'acc', label: '액세서리' },
		],
	},
	{
		key: 'price',
		prefix: '가격대',
		placeholder: '전체',
		options: [
			{ value: 'u3', label: '3만원 이하' },
			{ value: '3to7', label: '3~7만원' },
			{ value: '7to15', label: '7~15만원' },
			{ value: 'o15', label: '15만원 이상' },
		],
	},
];

const TOTAL = 1284;

/**
 * 같은 scaffold Select 를 커머스 목록 상단 "필터 바"로 재스타일링한 예제.
 *
 * WithdrawAccountSelect 와 완전히 같은 컴포넌트를 쓰지만 CSS 만 다르다.
 * 값이 선택된 필터는 채워진 pill 로 바뀌는데, Select 자체는 "선택됨"을 트리거에
 * 알려주지 않으므로(placeholder 일 때만 data-placeholder 가 붙는다)
 * 상태값으로 판단해 .triggerOn 클래스를 직접 붙인다.
 */
export default function ProductFilterSelect(): React.ReactNode {
	const [values, setValues] = useState<Record<string, string>>({});
	const activeCount = Object.values(values).filter(Boolean).length;

	/** 필터가 걸릴수록 결과 수가 줄어드는 척하는 더미 계산 */
	const count = useMemo(() => Math.round(TOTAL / Math.pow(2.4, activeCount)), [activeCount]);

	return (
		<div className={styles.bar}>
			<div className={styles.barTop}>
				<span className={styles.barTitle}>상품 목록</span>
				<span className={styles.barCount}>
					총 <b>{count.toLocaleString()}</b>개 {activeCount > 0 && `· 필터 ${activeCount}개 적용중`}
				</span>
			</div>

			<div className={styles.filters}>
				{FILTERS.map((f) => {
					const on = Boolean(values[f.key]);
					return (
						<Select
							key={f.key}
							value={values[f.key] ?? ''}
							onValueChange={(v) => setValues((prev) => ({ ...prev, [f.key]: v }))}
						>
							<SelectTrigger
								size="sm"
								aria-label={f.prefix}
								className={[styles.trigger, on ? styles.triggerOn : ''].filter(Boolean).join(' ')}
							>
								<span className={styles.prefix}>{f.prefix} ·</span>
								<SelectValue placeholder={f.placeholder} />
							</SelectTrigger>
							<SelectContent
								className={styles.content}
								position="popper"
								align="start"
								sideOffset={6}
							>
								{f.options.map((o) => (
									<SelectItem
										key={o.value}
										value={o.value}
										className={styles.item}
									>
										{o.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					);
				})}

				{activeCount > 0 && (
					<button
						type="button"
						className={styles.reset}
						onClick={() => setValues({})}
					>
						필터 초기화
					</button>
				)}
			</div>
		</div>
	);
}
