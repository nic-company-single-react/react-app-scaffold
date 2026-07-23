import { useState } from 'react';
import { Slider } from '@axiom/components/ui';
import { Volume2, VolumeX, Sun, Contrast, Thermometer } from 'lucide-react';
import styles from './MediaSettingsCard.module.css';

interface SettingRow {
	key: string;
	label: string;
	icon: React.ReactNode;
	/** 트랙/thumb 색을 결정하는 톤. module.css 의 data-tone 선택자와 매칭된다. */
	tone: 'blue' | 'amber' | 'violet' | 'rose';
	min?: number;
	max?: number;
	step?: number;
}

const ROWS: SettingRow[] = [
	{ key: 'volume', label: '볼륨', icon: <Volume2 />, tone: 'blue' },
	{ key: 'brightness', label: '밝기', icon: <Sun />, tone: 'amber' },
	{ key: 'contrast', label: '대비', icon: <Contrast />, tone: 'violet' },
	{ key: 'warmth', label: '색온도', icon: <Thermometer />, tone: 'rose' },
];

/**
 * 미디어 설정 카드 (실전 예제)
 *
 * scaffold Slider(@axiom/components/ui)를 세로로 여러 개 쌓고, 행마다 다른 톤으로
 * 트랙/레인지/thumb 색을 *.module.css 의 data-tone 선택자로 갈아끼운 설정 패널이다.
 * thumb 를 굵은 원형 핸들로 키우고 값 배지를 실시간으로 갱신한다.
 * → Slider 컴포넌트 본체(slider.tsx)는 전혀 수정하지 않는다.
 */
export default function MediaSettingsCard(): React.ReactNode {
	const [values, setValues] = useState<Record<string, number>>({
		volume: 65,
		brightness: 80,
		contrast: 45,
		warmth: 30,
	});

	return (
		<div className={styles.card}>
			<p className={styles.title}>디스플레이 &amp; 사운드</p>

			<div className={styles.rows}>
				{ROWS.map((row) => {
					const v = values[row.key];
					const muted = row.key === 'volume' && v === 0;
					return (
						<div
							key={row.key}
							className={styles.row}
							data-tone={row.tone}
						>
							<span className={styles.icon}>
								{muted ? <VolumeX /> : row.icon}
							</span>
							<div className={styles.body}>
								<div className={styles.rowHead}>
									<span className={styles.label}>{row.label}</span>
									<span className={styles.badge}>{v}</span>
								</div>
								<Slider
									className={styles.slider}
									min={row.min ?? 0}
									max={row.max ?? 100}
									step={row.step ?? 1}
									value={[v]}
									onValueChange={([nv]) => setValues((prev) => ({ ...prev, [row.key]: nv }))}
									aria-label={row.label}
								/>
							</div>
						</div>
					);
				})}
			</div>
		</div>
	);
}
