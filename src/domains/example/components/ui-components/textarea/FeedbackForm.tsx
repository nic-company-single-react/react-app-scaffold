import { useState } from 'react';
import { Textarea } from '@axiom/components/ui';
import { CheckCircle2 } from 'lucide-react';
import styles from './FeedbackForm.module.css';

const CATEGORIES = ['서비스 개선', '버그 신고', '문의', '기타'] as const;
const MAX_LENGTH = 300;

/**
 * 실전 예제 — 고객 피드백 폼.
 *
 * 제공 `Textarea`(@axiom/components/ui) 를 **그대로** 쓰되, `className` 에 CSS Module 클래스를
 * 넘겨 shadcn 기본 스타일을 완전히 다른 톤(고정 높이 140px · 티일 포커스 글로우 · 수동 리사이즈)으로
 * 덮어쓴다. 실제 SI 프로젝트에서 퍼블리셔가 Textarea 룩앤필을 바꾸는 전형적인 방식이다.
 *
 * - 기본 컴포넌트의 `field-sizing-content`(자동 높이) 를 CSS 에서 `field-sizing: fixed` 로 되돌리고
 *   `resize: vertical` 로 사용자가 직접 높이를 조절하도록 바꿨다.
 * - 유효성 검증 실패는 `aria-invalid` 속성으로 표현하고, CSS 에서 `[aria-invalid='true']` 로 스타일링한다.
 * - 글자 수 카운터로 남은 입력 가능 글자를 실시간으로 보여준다.
 */
export default function FeedbackForm(): React.ReactNode {
	const [category, setCategory] = useState<string>(CATEGORIES[0]);
	const [message, setMessage] = useState('');
	const [touched, setTouched] = useState(false);
	const [submitted, setSubmitted] = useState(false);

	const trimmed = message.trim();
	const tooShort = trimmed.length > 0 && trimmed.length < 10;
	const isEmpty = trimmed.length === 0;
	const over = message.length > MAX_LENGTH;
	const invalid = touched && (isEmpty || tooShort || over);

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);
		if (isEmpty || tooShort || over) return;
		setSubmitted(true);
	};

	return (
		<form
			className={styles.card}
			onSubmit={handleSubmit}
			noValidate
		>
			<h3 className={styles.title}>피드백 보내기</h3>
			<p className={styles.subtitle}>서비스를 개선할 수 있도록 의견을 들려주세요.</p>

			<div className={styles.fields}>
				{/* 카테고리 */}
				<div className={styles.field}>
					<span className={styles.label}>분류</span>
					<div className={styles.chips}>
						{CATEGORIES.map((c) => (
							<button
								key={c}
								type="button"
								className={`${styles.chip} ${category === c ? styles.chipActive : ''}`}
								onClick={() => setCategory(c)}
							>
								{c}
							</button>
						))}
					</div>
				</div>

				{/* 내용 */}
				<div className={styles.field}>
					<label
						className={styles.label}
						htmlFor="feedback-message"
					>
						내용
					</label>
					<Textarea
						id="feedback-message"
						className={styles.textarea}
						placeholder="어떤 점이 좋았거나 불편했는지 자유롭게 작성해 주세요. (최소 10자)"
						value={message}
						maxLength={MAX_LENGTH + 20}
						onChange={(e) => setMessage(e.target.value)}
						onBlur={() => setTouched(true)}
						aria-invalid={invalid || undefined}
					/>
					<div className={styles.meta}>
						{invalid && (
							<span className={styles.errorText}>
								{isEmpty ? '내용을 입력해 주세요.' : tooShort ? '10자 이상 입력해 주세요.' : '입력 가능한 글자 수를 초과했습니다.'}
							</span>
						)}
						<span className={`${styles.counter} ${over ? styles.counterOver : ''}`}>
							{message.length} / {MAX_LENGTH}
						</span>
					</div>
				</div>

				<button
					type="submit"
					className={styles.submit}
				>
					피드백 제출
				</button>
			</div>

			{submitted && (
				<div className={styles.doneBanner}>
					<CheckCircle2 className="w-4 h-4" />
					{category} 피드백이 접수되었습니다. 감사합니다!
				</div>
			)}
		</form>
	);
}
