import { useState } from 'react';
import { Slider } from '@axiom/components/ui';
import styles from './PriceRangeFilter.module.css';

/** 상품 가격대별 재고 수(막대그래프용 더미 히스토그램). 0 ~ 50만원을 20구간으로 나눈 값. */
const HISTOGRAM = [4, 9, 15, 22, 31, 42, 55, 63, 58, 47, 39, 33, 28, 21, 17, 12, 9, 6, 4, 2];

const MIN = 0;
const MAX = 500_000;
const STEP = 10_000;

const won = (n: number) => n.toLocaleString('ko-KR') + '원';

/**
 * 가격 범위 필터 (실전 예제)
 *
 * scaffold Slider(@axiom/components/ui)를 두 개의 thumb(range)로 쓰되,
 * 트랙/레인지/thumb 를 *.module.css 의 data-slot 선택자로 전부 다시 칠했다.
 * 슬라이더 위에는 가격대별 재고 히스토그램을 겹쳐, 선택 구간만 강조한다.
 * → Slider 컴포넌트 본체(slider.tsx)는 전혀 수정하지 않는다.
 */
export default function PriceRangeFilter(): React.ReactNode {
	const [range, setRange] = useState<[number, number]>([120_000, 340_000]);
	const [lo, hi] = range;

	// 히스토그램 각 막대가 선택 구간 안에 드는지 판단한다.
	const bucket = (MAX - MIN) / HISTOGRAM.length;

	return (
		<div className={styles.card}>
			<div className={styles.head}>
				<span className={styles.title}>가격</span>
				<span className={styles.value}>
					{won(lo)} <span className={styles.tilde}>–</span> {won(hi)}
				</span>
			</div>

			{/* 히스토그램 — 선택 구간만 진하게 */}
			<div className={styles.histogram}>
				{HISTOGRAM.map((h, i) => {
					const bucketStart = MIN + i * bucket;
					const active = bucketStart >= lo - bucket && bucketStart <= hi;
					return (
						<span
							key={i}
							className={styles.bar}
							data-active={active}
							style={{ height: `${(h / 63) * 100}%` }}
						/>
					);
				})}
			</div>

			<Slider
				className={styles.slider}
				min={MIN}
				max={MAX}
				step={STEP}
				value={range}
				onValueChange={(v) => setRange([v[0], v[1]] as [number, number])}
				minStepsBetweenThumbs={1}
				aria-label="가격 범위"
			/>

			<div className={styles.scale}>
				<span>{won(MIN)}</span>
				<span>{won(MAX)}</span>
			</div>

			<button
				type="button"
				className={styles.reset}
				onClick={() => setRange([MIN, MAX])}
			>
				가격 초기화
			</button>
		</div>
	);
}
