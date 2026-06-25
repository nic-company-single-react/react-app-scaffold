import { useState } from 'react';
import { Link } from 'react-router';
import { Input, Label, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import { Calculator, ArrowLeft, CornerDownRight } from 'lucide-react';

/* ────────────────────────────────────────────────────────────
 * $util.number 함수 메타데이터
 * 우측 함수 목록 + 좌측 데모 앵커(id) 연결에 함께 사용합니다.
 * ──────────────────────────────────────────────────────────── */
const numberFns = [
	{
		id: 'comma',
		name: 'comma',
		signature: 'comma(value: number | string): string',
		desc: '천 단위 콤마를 추가한 문자열로 변환',
	},
	{
		id: 'round',
		name: 'round',
		signature: 'round(value: number, digits?: number): number',
		desc: '지정한 소수 자릿수로 반올림 (기본 0)',
	},
	{
		id: 'clamp',
		name: 'clamp',
		signature: 'clamp(value: number, min: number, max: number): number',
		desc: '값을 [min, max] 범위로 제한',
	},
	{
		id: 'toNumber',
		name: 'toNumber',
		signature: 'toNumber(value: unknown, fallback?: number): number',
		desc: '문자열에서 숫자만 추출해 number로 변환',
	},
	{
		id: 'percent',
		name: 'percent',
		signature: 'percent(value: number, digits?: number): string',
		desc: '0~1 비율을 백분율 문자열로 변환',
	},
];

/* 작은 라벨 + 인풋 묶음 */
function Field({
	label,
	value,
	onChange,
	type = 'text',
	placeholder,
	className = '',
}: {
	label: string;
	value: string;
	onChange: (v: string) => void;
	type?: string;
	placeholder?: string;
	className?: string;
}) {
	return (
		<div className={`space-y-1.5 ${className}`}>
			<Label className="text-xs text-gray-500 dark:text-gray-400">{label}</Label>
			<Input
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				className="font-mono"
			/>
		</div>
	);
}

/* 실행 결과 출력 박스: 호출식 → 결과 */
function ResultBox({ call, result }: { call: string; result: React.ReactNode }) {
	return (
		<div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-200/70 bg-indigo-50/60 px-3 py-2.5 text-sm dark:border-indigo-800/50 dark:bg-indigo-900/20">
			<CornerDownRight className="size-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
			<code className="font-mono text-xs text-gray-600 dark:text-gray-400">{call}</code>
			<span className="text-gray-400">→</span>
			<code className="font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">{result}</code>
		</div>
	);
}

/* 데모 카드 래퍼 */
function DemoCard({
	id,
	signature,
	description,
	children,
}: {
	id: string;
	signature: string;
	description: string;
	children: React.ReactNode;
}) {
	return (
		<section
			id={id}
			className="scroll-mt-6 space-y-3"
		>
			<SectionHeader
				title={signature}
				description={description}
			/>
			<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
				<div className="space-y-4">{children}</div>
			</div>
		</section>
	);
}

export default function NumberUtil(): React.ReactNode {
	// comma
	const [commaValue, setCommaValue] = useState('1234567.89');
	// round
	const [roundValue, setRoundValue] = useState('3.14159');
	const [roundDigits, setRoundDigits] = useState('2');
	// clamp
	const [clampValue, setClampValue] = useState('15');
	const [clampMin, setClampMin] = useState('0');
	const [clampMax, setClampMax] = useState('10');
	// toNumber
	const [toNumberValue, setToNumberValue] = useState('$ 1,234.50 원');
	const [toNumberFallback, setToNumberFallback] = useState('0');
	// percent
	const [percentValue, setPercentValue] = useState('0.1234');
	const [percentDigits, setPercentDigits] = useState('1');

	const fmt = (v: string | number) => JSON.stringify(v);

	return (
		<div className="p-6">
			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="mb-6 max-w-3xl space-y-3">
				<Link
					to="/example/utils"
					className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
				>
					<ArrowLeft className="size-3.5" />
					유틸리티 목록으로
				</Link>
				<div className="flex items-center gap-3">
					<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
						<Calculator className="size-5 text-indigo-600 dark:text-indigo-400" />
					</div>
					<div>
						<h1 className="text-2xl font-bold text-gray-900 dark:text-white">number 유틸</h1>
						<p className="text-sm text-gray-500 dark:text-gray-400">
							<code className="rounded border border-indigo-300/50 bg-indigo-100/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
								$util.number
							</code>{' '}
							의 숫자 관련 함수들을 직접 입력하며 실행해 볼 수 있습니다.
						</p>
					</div>
				</div>
			</div>

			{/* ── 본문 2단 레이아웃 ───────────────────────────────── */}
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
				{/* 좌측: 인터랙티브 데모 */}
				<div className="max-w-3xl space-y-8">
					{/* comma */}
					<DemoCard
						id="comma"
						signature="comma(value)"
						description="천 단위 콤마를 추가합니다. 정수부에만 콤마가 적용되고 소수부는 유지됩니다."
					>
						<Field
							label="value (number | string)"
							value={commaValue}
							onChange={setCommaValue}
							placeholder="예: 1234567.89"
						/>
						<ResultBox
							call={`$util.number.comma(${fmt(commaValue)})`}
							result={fmt($util.number.comma(commaValue))}
						/>
						<CodeBlock code={`$util.number.comma(${fmt(commaValue)}); // ${fmt($util.number.comma(commaValue))}`} />
					</DemoCard>

					{/* round */}
					<DemoCard
						id="round"
						signature="round(value, digits?)"
						description="지정한 소수 자릿수로 반올림합니다. (기본 0자리)"
					>
						<div className="grid grid-cols-2 gap-3">
							<Field
								label="value (number)"
								type="number"
								value={roundValue}
								onChange={setRoundValue}
							/>
							<Field
								label="digits (number)"
								type="number"
								value={roundDigits}
								onChange={setRoundDigits}
							/>
						</div>
						<ResultBox
							call={`round(${Number(roundValue)}, ${Number(roundDigits)})`}
							result={String($util.number.round(Number(roundValue), Number(roundDigits)))}
						/>
						<CodeBlock
							code={`$util.number.round(${Number(roundValue)}, ${Number(roundDigits)}); // ${$util.number.round(
								Number(roundValue),
								Number(roundDigits),
							)}`}
						/>
					</DemoCard>

					{/* clamp */}
					<DemoCard
						id="clamp"
						signature="clamp(value, min, max)"
						description="값이 min보다 작으면 min, max보다 크면 max로 제한합니다."
					>
						<div className="grid grid-cols-3 gap-3">
							<Field
								label="value"
								type="number"
								value={clampValue}
								onChange={setClampValue}
							/>
							<Field
								label="min"
								type="number"
								value={clampMin}
								onChange={setClampMin}
							/>
							<Field
								label="max"
								type="number"
								value={clampMax}
								onChange={setClampMax}
							/>
						</div>
						<ResultBox
							call={`clamp(${Number(clampValue)}, ${Number(clampMin)}, ${Number(clampMax)})`}
							result={String($util.number.clamp(Number(clampValue), Number(clampMin), Number(clampMax)))}
						/>
						<CodeBlock
							code={`$util.number.clamp(${Number(clampValue)}, ${Number(clampMin)}, ${Number(
								clampMax,
							)}); // ${$util.number.clamp(Number(clampValue), Number(clampMin), Number(clampMax))}`}
						/>
					</DemoCard>

					{/* toNumber */}
					<DemoCard
						id="toNumber"
						signature="toNumber(value, fallback?)"
						description="콤마·통화기호 등이 섞인 문자열에서 숫자만 추출합니다. 변환 실패 시 fallback을 반환합니다."
					>
						<div className="grid grid-cols-[minmax(0,1fr)_120px] gap-3">
							<Field
								label="value (unknown)"
								value={toNumberValue}
								onChange={setToNumberValue}
								placeholder="예: $ 1,234.50 원"
							/>
							<Field
								label="fallback (number)"
								type="number"
								value={toNumberFallback}
								onChange={setToNumberFallback}
							/>
						</div>
						<ResultBox
							call={`toNumber(${fmt(toNumberValue)}, ${Number(toNumberFallback)})`}
							result={String($util.number.toNumber(toNumberValue, Number(toNumberFallback)))}
						/>
						<CodeBlock
							code={`$util.number.toNumber(${fmt(toNumberValue)}, ${Number(
								toNumberFallback,
							)}); // ${$util.number.toNumber(toNumberValue, Number(toNumberFallback))}`}
						/>
					</DemoCard>

					{/* percent */}
					<DemoCard
						id="percent"
						signature="percent(value, digits?)"
						description="0~1 사이의 비율 값을 백분율 문자열로 변환합니다. (기본 소수 1자리)"
					>
						<div className="grid grid-cols-2 gap-3">
							<Field
								label="value (0~1)"
								type="number"
								value={percentValue}
								onChange={setPercentValue}
							/>
							<Field
								label="digits (number)"
								type="number"
								value={percentDigits}
								onChange={setPercentDigits}
							/>
						</div>
						<ResultBox
							call={`percent(${Number(percentValue)}, ${Number(percentDigits)})`}
							result={fmt($util.number.percent(Number(percentValue), Number(percentDigits)))}
						/>
						<CodeBlock
							code={`$util.number.percent(${Number(percentValue)}, ${Number(percentDigits)}); // ${fmt(
								$util.number.percent(Number(percentValue), Number(percentDigits)),
							)}`}
						/>
					</DemoCard>
				</div>

				{/* 우측: 전체 함수 목록 (sticky) */}
				<aside className="hidden lg:block">
					<div className="sticky top-6 space-y-3">
						<p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
							number 함수 목록
						</p>
						<nav className="space-y-1 rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
							{numberFns.map((fn) => (
								<a
									key={fn.id}
									href={`#${fn.id}`}
									className="group block rounded-lg px-3 py-2 transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
								>
									<code className="font-mono text-sm font-semibold text-gray-800 group-hover:text-indigo-700 dark:text-gray-200 dark:group-hover:text-indigo-300">
										{fn.name}
									</code>
									<p className="mt-0.5 text-xs leading-snug text-gray-500 dark:text-gray-400">{fn.desc}</p>
								</a>
							))}
						</nav>
						<p className="px-1 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
							함수명을 누르면 해당 데모로 이동합니다.
						</p>
					</div>
				</aside>
			</div>
		</div>
	);
}
