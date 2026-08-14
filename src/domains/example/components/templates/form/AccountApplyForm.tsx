import { useState } from 'react';
import {
	Button,
	Checkbox,
	Input,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
	Spinner,
	Switch,
	Textarea,
} from '@axiom/components/ui';
import FormField from './FormField';

/** 폼이 다루는 값 전체. 입력요소는 문자열/불리언만 담고, 숫자 변환은 제출 직전에 한다. */
export interface IAccountApplyValues {
	name: string;
	email: string;
	phone: string;
	accountType: string;
	amount: string;
	memo: string;
	marketing: boolean;
	agree: boolean;
}

/** 필드별 에러 메시지. 값이 없으면 그 필드는 통과한 상태다. */
type TFormErrors = Partial<Record<keyof IAccountApplyValues, string>>;

const INITIAL_VALUES: IAccountApplyValues = {
	name: '',
	email: '',
	phone: '',
	accountType: '',
	amount: '',
	memo: '',
	marketing: false,
	agree: false,
};

/** 화면에 놓인 순서. 제출 실패 시 "첫 번째 오류 필드"를 찾는 기준이 된다. */
const FIELD_ORDER: (keyof IAccountApplyValues)[] = ['name', 'email', 'phone', 'accountType', 'amount', 'memo', 'agree'];

const ACCOUNT_TYPES = [
	{ value: 'checking', label: '입출금 통장' },
	{ value: 'savings', label: '정기 적금' },
	{ value: 'housing', label: '주택청약 종합저축' },
];

/**
 * 필드별 검증 규칙.
 *
 * 각 규칙은 **폼 값 전체**를 받는다. 자기 값만 받게 하면 "비밀번호 확인"처럼
 * 다른 필드를 참조해야 하는 검증에서 결국 시그니처를 고쳐야 하기 때문이다.
 * 통과하면 `undefined`, 실패하면 사용자에게 보여줄 메시지를 돌려준다.
 */
const validators: Record<keyof IAccountApplyValues, (values: IAccountApplyValues) => string | undefined> = {
	name: ({ name }) => {
		if (!name.trim()) return '이름을 입력해 주세요.';
		if (name.trim().length < 2) return '2자 이상 입력해 주세요.';
		return undefined;
	},
	email: ({ email }) => {
		if (!email.trim()) return '이메일을 입력해 주세요.';
		if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return '이메일 형식이 올바르지 않습니다.';
		return undefined;
	},
	phone: ({ phone }) => {
		const digits = phone.replace(/\D/g, '');
		if (!digits) return '연락처를 입력해 주세요.';
		if (digits.length < 10 || digits.length > 11) return '10~11자리 숫자로 입력해 주세요.';
		return undefined;
	},
	accountType: ({ accountType }) => (accountType ? undefined : '계좌 종류를 선택해 주세요.'),
	amount: ({ amount, accountType }) => {
		const value = Number(amount.replace(/,/g, ''));
		if (!amount) return '금액을 입력해 주세요.';
		if (Number.isNaN(value)) return '숫자만 입력해 주세요.';
		if (value < 10_000) return '최소 10,000원 이상 입력해 주세요.';
		// 다른 필드를 참조하는 교차 검증 예시 — 적금은 월 납입 한도가 따로 있다.
		if (accountType === 'savings' && value > 5_000_000) return '정기 적금은 월 500만원까지 신청할 수 있습니다.';
		return undefined;
	},
	memo: ({ memo }) => (memo.length > 200 ? '200자 이내로 입력해 주세요.' : undefined),
	marketing: () => undefined,
	agree: ({ agree }) => (agree ? undefined : '약관에 동의해야 신청할 수 있습니다.'),
};

/** 전체 필드를 한 번에 검증한다. 제출 시점에 호출한다. */
function validateAll(values: IAccountApplyValues): TFormErrors {
	const next: TFormErrors = {};
	(Object.keys(validators) as (keyof IAccountApplyValues)[]).forEach((key) => {
		const message = validators[key](values);
		if (message) next[key] = message;
	});
	return next;
}

/** 입력 중인 연락처를 010-1234-5678 형태로 다듬는다. */
function formatPhone(raw: string): string {
	const d = raw.replace(/\D/g, '').slice(0, 11);
	if (d.length < 4) return d;
	if (d.length < 8) return `${d.slice(0, 3)}-${d.slice(3)}`;
	return `${d.slice(0, 3)}-${d.slice(3, d.length - 4)}-${d.slice(d.length - 4)}`;
}

/** 입력 중인 금액에 천 단위 구분자를 넣는다. */
function formatAmount(raw: string): string {
	const digits = raw.replace(/\D/g, '');
	return digits ? Number(digits).toLocaleString() : '';
}

/**
 * 실전 예제 — 계좌 개설 신청 폼.
 *
 * 폼 라이브러리 없이 `useState` 만으로 만든, 이 스캐폴드의 기본 폼 패턴이다.
 * 검증 시점을 세 단계로 나눠 "입력하는 내내 빨간 글씨가 따라다니는" 상황을 피한다.
 *
 *  1. **blur** — 사용자가 그 칸을 벗어날 때 처음 검증한다. (touched 로 기록)
 *  2. **change** — 이미 에러가 떠 있는 칸만 재검증해서, 고치는 즉시 메시지를 걷어준다.
 *  3. **submit** — 전체를 검증하고, 실패하면 첫 번째 오류 칸으로 포커스를 옮긴다.
 */
export default function AccountApplyForm(): React.ReactNode {
	const [values, setValues] = useState<IAccountApplyValues>(INITIAL_VALUES);
	const [errors, setErrors] = useState<TFormErrors>({});
	/** 사용자가 한 번이라도 벗어난(=검증을 시작해도 되는) 필드 */
	const [touched, setTouched] = useState<Partial<Record<keyof IAccountApplyValues, boolean>>>({});
	const [submitting, setSubmitting] = useState(false);

	/** 값 변경 — 이미 에러가 떠 있는 필드는 즉시 재검증한다. */
	const setValue = <K extends keyof IAccountApplyValues>(key: K, value: IAccountApplyValues[K]) => {
		const next = { ...values, [key]: value };
		setValues(next);
		if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validators[key](next) }));
	};

	/** 포커스 이탈 — 이 필드의 검증을 시작한다. */
	const handleBlur = (key: keyof IAccountApplyValues) => {
		setTouched((prev) => ({ ...prev, [key]: true }));
		setErrors((prev) => ({ ...prev, [key]: validators[key](values) }));
	};

	const handleReset = () => {
		setValues(INITIAL_VALUES);
		setErrors({});
		setTouched({});
	};

	const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
		e.preventDefault();
		if (submitting) return; // 중복 제출 방지 (버튼 disabled 와 이중 방어)

		const nextErrors = validateAll(values);
		setErrors(nextErrors);
		setTouched(Object.fromEntries(FIELD_ORDER.map((key) => [key, true])));

		// 실패한 첫 칸으로 포커스를 옮긴다. 긴 폼에서 "어디가 틀렸는지" 찾는 수고를 없앤다.
		const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
		if (firstInvalid) {
			document.getElementById(firstInvalid)?.focus();
			return;
		}

		setSubmitting(true);
		try {
			// 실제 프로젝트에서는 useApi 의 mutation 을 호출한다.
			// const { mutateAsync } = useApi('/api/accounts', { method: 'POST' });
			// await mutateAsync({ ...values, amount: Number(values.amount.replace(/,/g, '')) });
			await new Promise((resolve) => setTimeout(resolve, 800));
			await $ui.alert({ type: 'success', title: '신청 완료', message: '계좌 개설 신청이 접수되었습니다.' });
			handleReset();
		} finally {
			// 성공/실패와 무관하게 잠금을 반드시 푼다.
			setSubmitting(false);
		}
	};

	return (
		<form
			onSubmit={handleSubmit}
			noValidate // 브라우저 기본 말풍선 대신 폼이 직접 메시지를 그린다.
			className="w-full max-w-2xl rounded-2xl border border-gray-200 bg-white p-6 shadow-sm dark:border-gray-800 dark:bg-gray-900"
		>
			<div className="mb-5 space-y-1">
				<h3 className="text-base font-semibold text-gray-900 dark:text-white">계좌 개설 신청</h3>
				<p className="text-xs text-gray-500 dark:text-gray-400">
					<span className="text-destructive">*</span> 표시는 필수 입력 항목입니다.
				</p>
			</div>

			<div className="grid gap-4 sm:grid-cols-2">
				<FormField
					id="name"
					label="이름"
					required
					error={errors.name}
					hint="예금주 본인 명의만 신청할 수 있습니다."
				>
					<Input
						id="name"
						value={values.name}
						onChange={(e) => setValue('name', e.target.value)}
						onBlur={() => handleBlur('name')}
						aria-invalid={!!errors.name}
						aria-describedby="name-message"
						placeholder="홍길동"
					/>
				</FormField>

				<FormField
					id="email"
					label="이메일"
					required
					error={errors.email}
					hint="신청 결과를 이 주소로 보내드립니다."
				>
					<Input
						id="email"
						type="email"
						value={values.email}
						onChange={(e) => setValue('email', e.target.value)}
						onBlur={() => handleBlur('email')}
						aria-invalid={!!errors.email}
						aria-describedby="email-message"
						placeholder="hong@example.com"
					/>
				</FormField>

				<FormField
					id="phone"
					label="연락처"
					required
					error={errors.phone}
					hint="숫자만 입력하면 자동으로 하이픈이 붙습니다."
				>
					<Input
						id="phone"
						inputMode="numeric"
						value={values.phone}
						onChange={(e) => setValue('phone', formatPhone(e.target.value))}
						onBlur={() => handleBlur('phone')}
						aria-invalid={!!errors.phone}
						aria-describedby="phone-message"
						placeholder="010-1234-5678"
					/>
				</FormField>

				<FormField
					id="accountType"
					label="계좌 종류"
					required
					error={errors.accountType}
				>
					<Select
						value={values.accountType}
						onValueChange={(v) => {
							setValue('accountType', v);
							// Select 는 blur 개념이 모호하므로 선택하는 즉시 검증을 시작한다.
							setTouched((prev) => ({ ...prev, accountType: true }));
							setErrors((prev) => ({ ...prev, accountType: undefined }));
						}}
					>
						<SelectTrigger
							id="accountType"
							size="default"
							className="w-full"
							aria-invalid={!!errors.accountType}
							aria-describedby="accountType-message"
						>
							<SelectValue placeholder="선택하세요" />
						</SelectTrigger>
						<SelectContent>
							{ACCOUNT_TYPES.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</FormField>

				<FormField
					id="amount"
					label="입금 금액"
					required
					error={errors.amount}
					hint="최소 10,000원 이상"
					className="sm:col-span-2"
				>
					<div className="relative">
						<Input
							id="amount"
							inputMode="numeric"
							value={values.amount}
							onChange={(e) => setValue('amount', formatAmount(e.target.value))}
							onBlur={() => handleBlur('amount')}
							aria-invalid={!!errors.amount}
							aria-describedby="amount-message"
							placeholder="0"
							className="pr-8 text-right font-mono"
						/>
						<span className="pointer-events-none absolute inset-y-0 right-2.5 flex items-center text-xs text-gray-400">
							원
						</span>
					</div>
				</FormField>

				<FormField
					id="memo"
					label="요청 사항"
					error={errors.memo}
					hint={`선택 입력 · ${values.memo.length}/200자`}
					className="sm:col-span-2"
				>
					<Textarea
						id="memo"
						rows={3}
						maxLength={200}
						value={values.memo}
						onChange={(e) => setValue('memo', e.target.value)}
						onBlur={() => handleBlur('memo')}
						aria-invalid={!!errors.memo}
						aria-describedby="memo-message"
						placeholder="담당자에게 전달할 내용이 있으면 적어주세요."
					/>
				</FormField>
			</div>

			{/* ── 동의 영역 ─────────────────────────────────────────── */}
			<div className="mt-5 space-y-3 rounded-xl border border-gray-100 bg-gray-50/60 p-4 dark:border-gray-800 dark:bg-gray-800/30">
				<div className="flex items-start gap-2.5">
					<Checkbox
						id="agree"
						checked={values.agree}
						onCheckedChange={(checked) => {
							const next = checked === true;
							setValues((prev) => ({ ...prev, agree: next }));
							setTouched((prev) => ({ ...prev, agree: true }));
							setErrors((prev) => ({
								...prev,
								agree: next ? undefined : validators.agree({ ...values, agree: next }),
							}));
						}}
						aria-invalid={!!errors.agree}
						aria-describedby="agree-message"
						className="mt-0.5"
					/>
					<div className="grid gap-1">
						<label
							htmlFor="agree"
							className="cursor-pointer text-xs font-medium text-gray-700 dark:text-gray-300"
						>
							예금자보호법 및 개인정보 수집·이용에 동의합니다.
							<span className="text-destructive">*</span>
						</label>
						{errors.agree && (
							<p
								id="agree-message"
								role="alert"
								className="text-[11px] text-destructive"
							>
								{errors.agree}
							</p>
						)}
					</div>
				</div>

				<div className="flex items-start gap-2.5">
					<Switch
						id="marketing"
						checked={values.marketing}
						onCheckedChange={(checked) => setValue('marketing', checked)}
					/>
					<label
						htmlFor="marketing"
						className="cursor-pointer text-xs text-gray-600 dark:text-gray-400"
					>
						혜택·이벤트 정보 수신에 동의합니다. <span className="text-gray-400">(선택)</span>
					</label>
				</div>
			</div>

			{/* ── 액션 ─────────────────────────────────────────────── */}
			<div className="mt-6 flex items-center justify-end gap-2">
				<Button
					type="button"
					variant="outline"
					onClick={handleReset}
					disabled={submitting}
				>
					초기화
				</Button>
				<Button
					type="submit"
					disabled={submitting}
					className="min-w-28 gap-1.5"
				>
					{submitting && <Spinner className="size-3.5" />}
					{submitting ? '신청 중…' : '신청하기'}
				</Button>
			</div>
		</form>
	);
}
