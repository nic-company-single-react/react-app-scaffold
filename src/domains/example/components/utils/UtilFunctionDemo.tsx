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

/** 타입이 정확히 number면 숫자 인자로 취급합니다. (그 외는 문자열로 전달) */
const isNumberType = (type: string) => type.trim() === 'number';

/**
 * 스칼라 유틸 함수를 입력값과 함께 실행해보는 **자동 생성** 데모 카드.
 *
 * 입력 필드·placeholder·기본값·시그니처·설명·호출식·결과·코드블록을 모두
 * 구현 파일 JSDoc에서 파싱된 `doc` 하나로 생성합니다. 함수별 수동 JSX가 필요 없습니다.
 * - 인자 변환: 파라미터 타입이 number면 `Number()`, 아니면 입력 문자열 그대로.
 * - 결과 표기: 반환 타입이 string이면 따옴표 표기(JSON.stringify), 그 외는 String().
 */
export default function UtilFunctionDemo({ doc, ns, impl }: IUtilFunctionDemoProps): React.ReactNode {
	const [values, setValues] = useState<string[]>(() => doc.params.map((p) => p.example));

	const updateAt = (index: number, v: string) => setValues((prev) => prev.map((x, i) => (i === index ? v : x)));

	// 입력값 → 실제 인자 + 표기용 문자열
	const args: (string | number)[] = doc.params.map((p, i) => (isNumberType(p.type) ? Number(values[i]) : values[i]));
	const display = doc.params
		.map((p, i) => (isNumberType(p.type) ? String(Number(values[i])) : JSON.stringify(values[i])))
		.join(', ');

	const call = `${ns}.${doc.name}(${display})`;

	let result: string;
	try {
		const fn = impl[doc.name] as unknown as ((...a: (string | number)[]) => unknown) | undefined;
		const r = fn ? fn(...args) : undefined;
		result = doc.returnType === 'string' ? JSON.stringify(r) : String(r);
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
