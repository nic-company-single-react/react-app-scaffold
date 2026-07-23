import { useMemo, useState } from 'react';
import { Progress } from '@axiom/components/ui';
import styles from './ResourceUsageCard.module.css';

/** 사용량 퍼센트를 임계치 레벨로 변환한다. (70/90 기준) */
function levelOf(percent: number): 'ok' | 'warn' | 'danger' {
	if (percent >= 90) return 'danger';
	if (percent >= 70) return 'warn';
	return 'ok';
}

const LEVEL_TEXT: Record<'ok' | 'warn' | 'danger', string> = {
	ok: '여유',
	warn: '주의',
	danger: '위험',
};

/**
 * 리소스 사용량 카드 (실전 예제)
 *
 * scaffold Progress(@axiom/components/ui)를 그대로 쓰되, 값(임계치)에 따라
 * 막대 색(초록/주황/빨강)이 바뀌는 대시보드형 게이지다.
 * 색 전환은 각 행의 data-level 속성 → module.css 의 data-slot 선택자로 처리한다.
 *
 * 맨 아래 슬라이더로 "스토리지" 값을 바꾸면 임계치에 따라 색이 실시간으로 변한다.
 */
export default function ResourceUsageCard(): React.ReactNode {
	const [storage, setStorage] = useState(58);

	const rows = useMemo(
		() => [
			{ label: '스토리지', used: `${(storage * 5.12).toFixed(0)} GB`, total: '512 GB', percent: storage },
			{ label: '월 트래픽', used: '1.6 TB', total: '2 TB', percent: 82 },
			{ label: 'API 호출', used: '96.2만', total: '100만', percent: 96 },
			{ label: '팀 시트', used: '12명', total: '30명', percent: 40 },
		],
		[storage],
	);

	return (
		<div className={styles.card}>
			<p className={styles.title}>리소스 사용량</p>

			<div className={styles.rows}>
				{rows.map((r) => {
					const level = levelOf(r.percent);
					return (
						<div
							key={r.label}
							className={styles.row}
							data-level={level}
						>
							<div className={styles.rowHead}>
								<span className={styles.label}>
									{r.label}
									<span className={styles.badge}>{LEVEL_TEXT[level]}</span>
								</span>
								<span className={styles.amount}>
									<strong>{r.used}</strong> / {r.total} · {r.percent}%
								</span>
							</div>
							<Progress value={r.percent} />
						</div>
					);
				})}
			</div>

			<div className={styles.control}>
				<label
					className={styles.controlLabel}
					htmlFor="ru-storage"
				>
					스토리지 사용량 조절 — 70% 이상 주황, 90% 이상 빨강으로 전환됩니다.
				</label>
				<input
					id="ru-storage"
					className={styles.slider}
					type="range"
					min={0}
					max={100}
					value={storage}
					onChange={(e) => setStorage(Number(e.target.value))}
				/>
			</div>
		</div>
	);
}
