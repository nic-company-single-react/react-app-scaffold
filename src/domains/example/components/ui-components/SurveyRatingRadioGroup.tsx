import { useId, useState } from 'react';
import { RadioGroup, RadioGroupItem, Label } from '@axiom/components/ui';
import styles from './SurveyRatingRadioGroup.module.css';

const SCORES = [
	{ value: '1', emoji: '😡', label: '매우 불만' },
	{ value: '2', emoji: '🙁', label: '불만' },
	{ value: '3', emoji: '😐', label: '보통' },
	{ value: '4', emoji: '🙂', label: '만족' },
	{ value: '5', emoji: '😍', label: '매우 만족' },
];

/**
 * 같은 scaffold RadioGroup을 라디오 동그라미 없이 가로 세그먼트로 재스타일링한 설문 예제.
 *
 * 앞의 PaymentMethodRadioGroup과 완전히 동일한 컴포넌트를 쓰지만,
 * SurveyRatingRadioGroup.module.css 하나만 다르게 써서 모양이 전혀 달라졌다.
 * RadioGroupItem은 화면에서 숨기되 DOM에 남겨 두어 키보드 화살표 이동과
 * 스크린리더 읽기가 그대로 동작한다(포커스 링은 Label의 :focus-within이 담당).
 */
export default function SurveyRatingRadioGroup(): React.ReactNode {
	const uid = useId();
	const [score, setScore] = useState<string>('');
	const picked = SCORES.find((s) => s.value === score);

	return (
		<div className={styles.wrap}>
			<div className={styles.sheet}>
				<div className={styles.question}>이번 상담 서비스에 얼마나 만족하셨나요?</div>
				<p className={styles.hint}>
					1(매우 불만) ~ 5(매우 만족) 중 하나를 선택해 주세요. 키보드 ←/→ 로도 이동할 수 있습니다.
				</p>

				<RadioGroup
					value={score}
					onValueChange={setScore}
					aria-label="상담 서비스 만족도"
				>
					{SCORES.map((s) => {
						const id = `${uid}-${s.value}`;
						return (
							<Label
								key={s.value}
								htmlFor={id}
								className={`${styles.seg} ${score === s.value ? styles.segOn : ''}`}
							>
								<RadioGroupItem
									id={id}
									value={s.value}
								/>
								<span className={styles.segEmoji}>{s.emoji}</span>
								<span className={styles.segLabel}>{s.label}</span>
							</Label>
						);
					})}
				</RadioGroup>

				<div className={styles.result}>
					선택한 점수:{' '}
					<span className={styles.resultValue}>
						{picked ? `${picked.value}점 — ${picked.label}` : '아직 선택하지 않음'}
					</span>
				</div>
			</div>
		</div>
	);
}
