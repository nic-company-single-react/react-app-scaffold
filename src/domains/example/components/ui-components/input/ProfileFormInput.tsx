import { useState } from 'react';
import { Input } from '@axiom/components/ui';
import { User, Mail, Phone, CheckCircle2 } from 'lucide-react';
import styles from './ProfileFormInput.module.css';

/**
 * 실전 예제 — 프로필 입력 폼.
 *
 * 제공 `Input`(@axiom/components/ui) 을 **그대로** 쓰되, `className` 에 CSS Module 클래스를
 * 넘겨 shadcn 기본 스타일을 완전히 다른 톤(높이 48px · 아이콘 프리픽스 · 에메랄드 포커스 글로우)으로
 * 덮어쓴다. 실제 SI 프로젝트에서 퍼블리셔가 Input 룩앤필을 바꾸는 전형적인 방식이다.
 *
 * - 아이콘은 `.inputWrap` 로 겹쳐 배치하고, 왼쪽 패딩(`padding-left`)으로 자리를 비운다.
 * - 유효성 검증 실패는 `aria-invalid` 속성으로 표현하고, CSS 에서 `[aria-invalid='true']` 로 스타일링한다.
 */
export default function ProfileFormInput(): React.ReactNode {
	const [name, setName] = useState('');
	const [email, setEmail] = useState('');
	const [phone, setPhone] = useState('');
	const [submitted, setSubmitted] = useState(false);

	// 아주 단순한 유효성 검증(예제용). 제출을 시도한 뒤에만 에러를 노출한다.
	const [touched, setTouched] = useState(false);
	const emailInvalid = touched && email.trim() !== '' && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
	const nameInvalid = touched && name.trim() === '';

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		setTouched(true);
		if (name.trim() === '' || emailInvalid || email.trim() === '') return;
		setSubmitted(true);
	};

	return (
		<form
			className={styles.card}
			onSubmit={handleSubmit}
			noValidate
		>
			<h3 className={styles.title}>프로필 정보 입력</h3>
			<p className={styles.subtitle}>서비스 이용을 위해 기본 정보를 입력해 주세요.</p>

			<div className={styles.fields}>
				{/* 이름 */}
				<div className={styles.field}>
					<label
						className={styles.label}
						htmlFor="profile-name"
					>
						이름
					</label>
					<div className={styles.inputWrap}>
						<Input
							id="profile-name"
							className={styles.input}
							placeholder="홍길동"
							value={name}
							onChange={(e) => setName(e.target.value)}
							aria-invalid={nameInvalid || undefined}
						/>
						<User className={styles.icon} />
					</div>
					{nameInvalid && <span className={styles.errorText}>이름을 입력해 주세요.</span>}
				</div>

				{/* 이메일 */}
				<div className={styles.field}>
					<label
						className={styles.label}
						htmlFor="profile-email"
					>
						이메일
					</label>
					<div className={styles.inputWrap}>
						<Input
							id="profile-email"
							type="email"
							className={styles.input}
							placeholder="you@example.com"
							value={email}
							onChange={(e) => setEmail(e.target.value)}
							aria-invalid={emailInvalid || undefined}
						/>
						<Mail className={styles.icon} />
					</div>
					{emailInvalid && <span className={styles.errorText}>올바른 이메일 형식이 아닙니다.</span>}
				</div>

				{/* 휴대폰 (선택) */}
				<div className={styles.field}>
					<label
						className={styles.label}
						htmlFor="profile-phone"
					>
						휴대폰 <span className="text-gray-400 font-normal">(선택)</span>
					</label>
					<div className={styles.inputWrap}>
						<Input
							id="profile-phone"
							type="tel"
							className={styles.input}
							placeholder="010-0000-0000"
							value={phone}
							onChange={(e) => setPhone(e.target.value)}
						/>
						<Phone className={styles.icon} />
					</div>
				</div>

				<button
					type="submit"
					className={styles.submit}
				>
					저장하기
				</button>
			</div>

			{submitted && (
				<div className={styles.doneBanner}>
					<CheckCircle2 className="w-4 h-4" />
					프로필이 저장되었습니다.
				</div>
			)}
		</form>
	);
}
