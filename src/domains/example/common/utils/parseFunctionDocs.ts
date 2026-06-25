/**
 * `?raw`로 불러온 유틸 구현 소스(예: number.ts)에서 함수별 메타데이터를 추출합니다.
 *
 * 대상 형식: 객체 메서드 단축구문 + 바로 위 JSDoc
 *   /**
 *    * 설명
 *    * @demo value="예시값" digits="2"
 *    *\/
 *   name(params): ReturnType { ... }
 *
 * - 설명(desc): JSDoc 본문에서 `@` 태그가 아닌 줄.
 * - 예시값(example): `@demo name="value"` 태그에서 파라미터별로 추출.
 *   따옴표로 감싸므로 값에 쉼표/공백이 있어도 안전합니다. (예: "$ 1,234.50 원")
 * - 시그니처/타입: 메서드 선언부에서 직접 추출.
 *
 * 이렇게 하면 데모 페이지의 함수 목록과 입력 placeholder·기본값까지
 * 실제 구현 파일 한 곳에서 완전 자동으로 채울 수 있습니다.
 */
export interface IParamDoc {
	/** 파라미터명 */
	name: string;
	/** 타입 표기 (예: "number", "number | string", "unknown") */
	type: string;
	/** `@demo` 예시값 (없으면 기본값, 그것도 없으면 빈 문자열) */
	example: string;
}

export interface IFunctionDoc {
	/** 앵커/식별자 (함수명과 동일) */
	id: string;
	/** 함수명 */
	name: string;
	/** 화면 표기용 시그니처 (예: "comma(value: number | string): string") */
	signature: string;
	/** JSDoc 본문에서 추출한 설명 */
	desc: string;
	/** 반환 타입 (예: "string", "number") */
	returnType: string;
	/** 파라미터 목록 */
	params: IParamDoc[];
}

/* JSDoc(/** ... *\/) 직후의 메서드 선언을 캡처합니다.
 * 1: JSDoc 본문 / 2: 함수명 / 3: 파라미터 / 4: 반환 타입 */
const DOC_METHOD_RE = /\/\*\*([\s\S]*?)\*\/\s*(\w+)\s*\(([^)]*)\)\s*:\s*([^{;]+?)\s*\{/g;

/** `@demo name="value"` 형식의 예시값 쌍 */
const DEMO_PAIR_RE = /(\w+)="([^"]*)"/g;

/** 시그니처 파라미터 문자열을 { name, type, def } 배열로 분해합니다. */
function splitSignatureParams(raw: string): { name: string; type: string; def?: string }[] {
	const trimmed = raw.trim();
	if (!trimmed) return [];
	return trimmed.split(',').map((seg) => {
		const [decl, def] = seg.split('=').map((s) => s.trim());
		const colon = decl.indexOf(':');
		return {
			name: decl.slice(0, colon).trim(),
			type: decl.slice(colon + 1).trim(),
			def,
		};
	});
}

/** JSDoc 본문에서 설명과 `@demo` 예시값 맵을 추출합니다. */
function parseJsDoc(rawDoc: string): { desc: string; examples: Record<string, string> } {
	const lines = rawDoc.split('\n').map((l) => l.replace(/^\s*\*?\s?/, '').trimEnd());
	const descLines: string[] = [];
	const examples: Record<string, string> = {};

	for (const line of lines) {
		const t = line.trim();
		if (t.startsWith('@demo')) {
			let pair: RegExpExecArray | null;
			DEMO_PAIR_RE.lastIndex = 0;
			while ((pair = DEMO_PAIR_RE.exec(t)) !== null) {
				examples[pair[1]] = pair[2];
			}
		} else if (t && !t.startsWith('@')) {
			descLines.push(t);
		}
	}

	return { desc: descLines.join(' ').trim(), examples };
}

export function parseFunctionDocs(source: string): IFunctionDoc[] {
	const docs: IFunctionDoc[] = [];
	let match: RegExpExecArray | null;

	DOC_METHOD_RE.lastIndex = 0;
	while ((match = DOC_METHOD_RE.exec(source)) !== null) {
		const [, rawDoc, name, rawParams, rawReturn] = match;
		const { desc, examples } = parseJsDoc(rawDoc);

		const params: IParamDoc[] = splitSignatureParams(rawParams).map((p) => ({
			name: p.name,
			type: p.type,
			example: examples[p.name] ?? p.def ?? '',
		}));

		docs.push({
			id: name,
			name,
			signature: `${name}(${rawParams.trim()}): ${rawReturn.trim()}`,
			desc,
			returnType: rawReturn.trim(),
			params,
		});
	}

	return docs;
}
