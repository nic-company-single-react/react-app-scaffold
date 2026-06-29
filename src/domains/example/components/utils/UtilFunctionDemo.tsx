import { useState } from 'react';
import { CodeBlock } from '@axiom/components/ui';
import Field from '@/domains/example/components/utils/Field';
import ResultBox from '@/domains/example/components/utils/ResultBox';
import DemoCard from '@/domains/example/components/utils/DemoCard';
import type { IFunctionDoc } from '@/domains/example/common/utils/parseFunctionDocs';

export interface IUtilFunctionDemoProps {
	/** 파싱된 함수 메타데이터 (시그니처·설명·파라미터 예시값 포함) */
	doc: IFunctionDoc;
	/** 호출 네임스페이스 (예: "$util.number") */
	ns: string;
	/** 실제 구현 객체 (예: $util.number) */
	impl: Record<string, (...args: never[]) => unknown>;
}

/** 타입이 정확히 number면 숫자 인자로 취급합니다. */
const isNumberType = (type: string) => type.trim() === 'number';

/** 'string' 또는 문자열 리터럴 유니온('asc' | 'desc')이면 입력값을 그대로 문자열로 전달합니다. */
const STR_UNION_RE = /^(?:'[^']*'\s*(?:\|\s*'[^']*'\s*)*)$/;
const isRawStringType = (type: string) => {
	const t = type.trim();
	return t === 'string' || STR_UNION_RE.test(t);
};

/**
 * 입력 문자열을 파라미터 타입에 맞는 실제 인자로 변환합니다.
 * - number          → Number()
 * - string/리터럴   → 문자열 그대로
 * - 그 외(객체/배열) → JSON.parse() (실패 시 문자열 그대로)
 */
function toArg(type: string, value: string): unknown {
	if (isNumberType(type)) return Number(value);
	if (isRawStringType(type)) return value;
	try {
		return JSON.parse(value);
	} catch {
		return value;
	}
}

/** 실행 결과를 화면 표기용 문자열로 변환합니다. (Date는 사람이 읽기 쉬운 표기 유지) */
function formatResult(r: unknown): string {
	if (r instanceof Date) return String(r);
	if (typeof r === 'string') return JSON.stringify(r);
	if (r !== null && typeof r === 'object') return JSON.stringify(r);
	return String(r);
}

/**
 * 유틸 함수를 입력값과 함께 실행해보는 **자동 생성** 데모 카드.
 *
 * 입력 필드·placeholder·기본값·시그니처·설명·호출식·결과·코드블록을 모두
 * 타입 정의 JSDoc에서 파싱된 `doc` 하나로 생성합니다. 함수별 수동 JSX가 필요 없습니다.
 * - 인자 변환: number→Number(), string/리터럴→문자열, 객체/배열→JSON.parse.
 * - 결과 표기: Date는 그대로, 문자열·객체·배열은 JSON 표기, 그 외는 String().
 */
export default function UtilFunctionDemo({ doc, ns, impl }: IUtilFunctionDemoProps): React.ReactNode {
	const [values, setValues] = useState<string[]>(() => doc.params.map((p) => p.example));

	const updateAt = (index: number, v: string) => setValues((prev) => prev.map((x, i) => (i === index ? v : x)));

	// 입력값 → 실제 인자
	const args = doc.params.map((p, i) => toArg(p.type, values[i]));

	// 호출식 표기: number/문자열/리터럴은 보기 좋게, 객체·배열은 입력한 JSON 텍스트 그대로
	const display = doc.params
		.map((_, i) => {
			const a = args[i];
			if (typeof a === 'string') return JSON.stringify(a);
			if (typeof a === 'number' || typeof a === 'boolean') return String(a);
			return values[i].trim();
		})
		.join(', ');

	const call = `${ns}.${doc.name}(${display})`;

	let result: string;
	try {
		const fn = impl[doc.name] as unknown as ((...a: unknown[]) => unknown) | undefined;
		result = fn ? formatResult(fn(...args)) : '—';
	} catch {
		result = '—';
	}

	return (
		<DemoCard
			id={doc.id}
			signature={doc.signature}
			description={doc.desc}
		>
			{doc.params.length > 0 && (
				<div
					className="grid gap-3"
					style={{ gridTemplateColumns: `repeat(${Math.min(doc.params.length, 3)}, minmax(0, 1fr))` }}
				>
					{doc.params.map((p, i) => (
						<Field
							key={p.name}
							label={`${p.name} (${p.type})`}
							type={isNumberType(p.type) ? 'number' : 'text'}
							value={values[i]}
							placeholder={p.example}
							onChange={(v) => updateAt(i, v)}
						/>
					))}
				</div>
			)}
			<ResultBox
				call={call}
				result={result}
			/>
			<CodeBlock code={`${call}; // ${result}`} />
		</DemoCard>
	);
}
