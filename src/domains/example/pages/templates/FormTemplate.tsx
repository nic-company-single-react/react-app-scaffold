import { CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import AccountApplyForm from '@/domains/example/components/templates/form/AccountApplyForm';
import formFieldSource from '@/domains/example/components/templates/form/FormField.tsx?raw';
import accountApplyFormSource from '@/domains/example/components/templates/form/AccountApplyForm.tsx?raw';
import { ClipboardCheck } from 'lucide-react';

const VALUES_CODE = `/** 폼이 다루는 값 전체 — 입력요소는 문자열/불리언만 담는다. */
export interface IAccountApplyValues {
  name: string;
  email: string;
  phone: string;
  accountType: string;
  amount: string;      // 화면은 '1,000,000' 같은 표시용 문자열
  memo: string;
  marketing: boolean;
  agree: boolean;
}

/** 필드별 에러 메시지. 값이 없으면 그 필드는 통과한 상태다. */
type TFormErrors = Partial<Record<keyof IAccountApplyValues, string>>;`;

const VALIDATOR_CODE = `/**
 * 각 규칙은 폼 값 "전체"를 받는다.
 * 자기 값만 받게 하면 '비밀번호 확인'처럼 다른 필드를 참조하는 검증에서
 * 결국 시그니처를 고쳐야 하기 때문이다.
 */
const validators: Record<keyof IAccountApplyValues, (values: IAccountApplyValues) => string | undefined> = {
  name: ({ name }) => {
    if (!name.trim()) return '이름을 입력해 주세요.';
    if (name.trim().length < 2) return '2자 이상 입력해 주세요.';
    return undefined;
  },
  amount: ({ amount, accountType }) => {
    const value = Number(amount.replace(/,/g, ''));
    if (!amount) return '금액을 입력해 주세요.';
    if (value < 10_000) return '최소 10,000원 이상 입력해 주세요.';
    // 교차 검증 — 다른 필드 값에 따라 규칙이 달라진다
    if (accountType === 'savings' && value > 5_000_000) return '정기 적금은 월 500만원까지 신청할 수 있습니다.';
    return undefined;
  },
  // …
};

/** 전체 검증 — 제출 시점에 한 번 호출한다. */
function validateAll(values: IAccountApplyValues): TFormErrors {
  const next: TFormErrors = {};
  (Object.keys(validators) as (keyof IAccountApplyValues)[]).forEach((key) => {
    const message = validators[key](values);
    if (message) next[key] = message;
  });
  return next;
}`;

const TIMING_CODE = `const [values, setValues]   = useState(INITIAL_VALUES);
const [errors, setErrors]   = useState<TFormErrors>({});
const [touched, setTouched] = useState<Partial<Record<keyof IAccountApplyValues, boolean>>>({});

// ② change — 이미 에러가 떠 있는 칸만 재검증한다. 고치는 즉시 메시지가 사라진다.
const setValue = <K extends keyof IAccountApplyValues>(key: K, value: IAccountApplyValues[K]) => {
  const next = { ...values, [key]: value };
  setValues(next);
  if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validators[key](next) }));
};

// ① blur — 그 칸을 벗어날 때 처음 검증한다. 여기서부터 touched 로 기록된다.
const handleBlur = (key: keyof IAccountApplyValues) => {
  setTouched((prev) => ({ ...prev, [key]: true }));
  setErrors((prev) => ({ ...prev, [key]: validators[key](values) }));
};`;

const SUBMIT_CODE = `const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  if (submitting) return;                 // 중복 제출 방지 (버튼 disabled 와 이중 방어)

  // ③ submit — 전체 검증
  const nextErrors = validateAll(values);
  setErrors(nextErrors);
  setTouched(Object.fromEntries(FIELD_ORDER.map((key) => [key, true])));

  // 실패한 "첫" 칸으로 포커스를 옮긴다. 긴 폼에서 어디가 틀렸는지 찾는 수고를 없앤다.
  const firstInvalid = FIELD_ORDER.find((key) => nextErrors[key]);
  if (firstInvalid) {
    document.getElementById(firstInvalid)?.focus();
    return;
  }

  setSubmitting(true);
  try {
    // 실제 프로젝트에서는 useApi 의 mutation 을 호출한다.
    // await mutateAsync({ ...values, amount: Number(values.amount.replace(/,/g, '')) });
    await $ui.alert({ type: 'success', title: '신청 완료', message: '계좌 개설 신청이 접수되었습니다.' });
    handleReset();
  } finally {
    setSubmitting(false);                 // 성공/실패와 무관하게 잠금을 반드시 푼다
  }
};`;

const FIELD_USAGE_CODE = `<FormField
  id="email"                        {/* Input 의 id 와 반드시 같아야 한다 */}
  label="이메일"
  required
  error={errors.email}              {/* 값이 있으면 에러 상태로 렌더 */}
  hint="신청 결과를 이 주소로 보내드립니다."
>
  <Input
    id="email"
    value={values.email}
    onChange={(e) => setValue('email', e.target.value)}
    onBlur={() => handleBlur('email')}
    aria-invalid={!!errors.email}          {/* 빨간 테두리·링 자동 적용 */}
    aria-describedby="email-message"       {/* 메시지를 스크린리더에 연결 */}
  />
</FormField>`;

const MUTATION_CODE = `// 이 페이지 데모는 setTimeout 이지만, 실제 저장은 useApi 의 mutation 으로 붙인다.
const { mutateAsync, isPending } = useApi<ApplyResult, IAccountApplyValues>('/api/accounts', {
  method: 'POST',
});

const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
  e.preventDefault();
  // …검증 통과 후
  try {
    await mutateAsync({ ...values, amount: Number(values.amount.replace(/,/g, '')) });
    await $ui.alert({ type: 'success', message: '저장되었습니다.' });
  } catch (error) {
    // 서버가 필드별 오류를 내려주면 그대로 errors 에 흡수시킨다.
    // setErrors((prev) => ({ ...prev, ...toFieldErrors(error) }));
    await $ui.alert({ type: 'error', message: '저장에 실패했습니다.' });
  }
};

// isPending 을 그대로 제출 버튼의 disabled 로 쓰면 submitting state 가 따로 필요 없다.`;

const CHECKLIST = [
	{
		item: 'noValidate',
		desc: '<form noValidate> 로 브라우저 기본 말풍선을 끄고, 메시지를 폼이 직접 그린다. 그래야 디자인·문구가 일관된다.',
	},
	{
		item: 'label ↔ id 연결',
		desc: 'Label htmlFor 와 입력요소 id 를 맞춘다. 라벨을 클릭하면 포커스가 가고, 스크린리더가 무슨 칸인지 읽는다.',
	},
	{
		item: 'aria-invalid',
		desc: '에러일 때 넘기면 빨간 테두리·링이 자동 적용된다. 별도 에러용 className 을 만들 필요가 없다.',
	},
	{
		item: 'aria-describedby',
		desc: '메시지 요소의 id 를 가리켜 보조기기가 "무엇이 틀렸는지"까지 읽게 한다. 에러 메시지에는 role="alert" 를 준다.',
	},
	{
		item: '검증 시점 분리',
		desc: 'blur 전에는 검증하지 않는다. 입력하는 내내 빨간 글씨가 따라다니면 사용자는 폼을 포기한다.',
	},
	{
		item: '중복 제출 방지',
		desc: '제출 중에는 버튼 disabled + 핸들러 첫 줄 early return 으로 이중 방어한다. 더블클릭 한 번에 신청이 두 건 들어간다.',
	},
	{
		item: '첫 오류로 포커스',
		desc: '제출 실패 시 화면 아래 숨은 오류를 사용자가 스크롤해서 찾게 두지 않는다.',
	},
	{
		item: 'finally 로 잠금 해제',
		desc: 'setSubmitting(false) 를 finally 에 둔다. 예외가 나면 버튼이 영원히 잠긴 채로 남는다.',
	},
];

export default function FormTemplate(): React.ReactNode {
	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<ClipboardCheck className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">폼 화면 템플릿</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						입력 → 검증 → 제출까지 갖춘 실무형 폼 한 벌입니다. 새 입력 화면은 이 구조를 복사해 필드만 바꾸세요.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 ───────────────────────────────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					<strong className="font-semibold">폼 라이브러리를 쓰지 않습니다</strong> — 이 스캐폴드에는{' '}
					<code className="font-mono">react-hook-form</code> · <code className="font-mono">zod</code> 가 설치돼 있지
					않습니다. 대부분의 업무 폼은 <code className="font-mono">useState</code> + 검증 함수 맵으로 충분하고, 의존성
					없이 어떤 입력 컴포넌트와도 붙기 때문입니다. 필드가 수십 개로 늘고 배열 필드·동적 스키마가 필요해지는 시점에
					라이브러리 도입을 검토하되, <b>검증 규칙을 한 곳에 모으는 구조</b>는 그대로 가져가면 됩니다.
				</p>
			</div>

			{/* ── 1. 상태 설계 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 상태 설계 — values · errors · touched"
					description="폼 상태는 세 덩어리면 충분합니다. 값(values), 에러 메시지(errors), 사용자가 건드린 적 있는지(touched). touched 가 있어야 '아직 입력도 안 한 칸'에 에러를 띄우지 않을 수 있습니다."
				/>
				<CodeBlock
					code={VALUES_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
					금액·연락처처럼 <b>표시 형식이 있는 값은 문자열로 들고</b> 있다가 제출 직전에 숫자로 바꿉니다. state 에 숫자로
					담으면 <code className="font-mono">1,000,000</code> 같은 입력 중간 상태를 표현할 수 없습니다.
				</p>
			</section>

			{/* ── 2. 검증 규칙 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 검증 규칙은 한 곳에 모은다"
					description="JSX 안에 if 문을 흩뿌리지 않고, 필드명을 키로 하는 validators 맵에 모읍니다. 규칙이 어디 있는지 찾을 필요가 없고, 필드를 추가하면 타입이 규칙 누락을 잡아줍니다."
				/>
				<CodeBlock
					code={VALIDATOR_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
					<code className="font-mono">Record&lt;keyof IAccountApplyValues, …&gt;</code> 로 선언했으므로{' '}
					<b>필드를 추가하고 규칙을 빼먹으면 컴파일 에러</b>가 납니다. 검증이 필요 없는 필드는{' '}
					<code className="font-mono">() =&gt; undefined</code> 를 명시해 "검토했고 규칙이 없다"는 것을 남깁니다.
				</p>
			</section>

			{/* ── 3. 검증 시점 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 언제 검증할 것인가 — blur · change · submit"
					description="검증 시점을 잘못 잡으면 폼 전체가 불쾌해집니다. 타이핑 한 글자마다 빨간 메시지가 뜨는 폼이 대표적입니다. 세 단계로 나눠 처리합니다."
				/>
				<CodeBlock
					code={TIMING_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<div className="grid gap-2 sm:grid-cols-3">
					{[
						{ step: '① blur', title: '첫 검증', desc: '칸을 벗어날 때. 이때부터 touched=true' },
						{ step: '② change', title: '재검증', desc: 'touched 인 칸만. 고치는 즉시 메시지 제거' },
						{ step: '③ submit', title: '전체 검증', desc: '모든 칸 + 첫 오류로 포커스 이동' },
					].map((s) => (
						<div
							key={s.step}
							className="rounded-xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-3.5 space-y-1"
						>
							<p className="text-xs font-semibold text-indigo-600 dark:text-indigo-400">{s.step}</p>
							<p className="text-xs font-medium text-gray-800 dark:text-gray-200">{s.title}</p>
							<p className="text-[11px] leading-relaxed text-gray-500 dark:text-gray-400">{s.desc}</p>
						</div>
					))}
				</div>
			</section>

			{/* ── 4. FormField 래퍼 ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. FormField — 라벨·필수표시·메시지 래퍼"
					description="폼 한 칸마다 반복되는 라벨 연결·필수 표시·에러 메시지 자리를 한 컴포넌트로 묶습니다. 입력요소를 cloneElement 로 조작하지 않고 소비자가 aria 속성을 직접 넘기므로, 어떤 입력 컴포넌트(3rd-party 포함)와도 그대로 붙습니다."
				/>
				<CodeBlock
					code={FIELD_USAGE_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 5. 제출 처리 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 제출 처리 — 중복 방지 · 첫 오류 포커스 · 잠금 해제"
					description="제출 핸들러가 챙겨야 할 것은 검증만이 아닙니다. 더블클릭으로 신청이 두 건 들어가는 사고와, 예외 발생 후 버튼이 영원히 잠기는 사고를 함께 막습니다."
				/>
				<CodeBlock
					code={SUBMIT_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 6. 라이브 데모 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 라이브 데모 — 계좌 개설 신청 폼"
					description="아무것도 입력하지 않고 [신청하기] 를 눌러보세요. 전체 검증이 돌고 첫 오류 칸(이름)으로 포커스가 이동합니다. 이후 한 칸씩 채우면 고치는 즉시 메시지가 사라집니다. '계좌 종류'를 정기 적금으로 두고 금액을 500만원 초과로 넣으면 교차 검증이 걸립니다."
				/>
				<div className="flex justify-center py-2">
					<AccountApplyForm />
				</div>
				<SourceTabs
					files={[
						{ filename: 'AccountApplyForm.tsx', code: accountApplyFormSource, lang: 'tsx' },
						{ filename: 'FormField.tsx', code: formFieldSource, lang: 'tsx' },
					]}
				/>
			</section>

			{/* ── 7. 서버 연동 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 서버에 저장하기 — useApi mutation 으로 교체"
					description="데모의 setTimeout 자리에 useApi 의 mutation 을 끼우면 그대로 실서비스 폼이 됩니다. isPending 을 제출 버튼 disabled 로 쓰면 submitting state 도 따로 둘 필요가 없습니다."
				/>
				<CodeBlock
					code={MUTATION_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 8. 체크리스트 ────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="8. 폼 체크리스트"
					description="새 폼 화면을 만들 때 이 항목들을 확인하세요. 대부분 나중에 QA·접근성 점검에서 되돌아오는 항목들입니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs w-44">
									항목
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									확인 내용
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{CHECKLIST.map((row) => (
								<tr
									key={row.item}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-indigo-700 dark:text-indigo-400">{row.item}</code>
									</td>
									<td className="px-4 py-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
