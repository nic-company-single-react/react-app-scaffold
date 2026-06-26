/**
 * `?raw`로 불러온 **타입 정의 파일**(예: types/common/index.ts)에서
 * 특정 인터페이스의 함수별 메타데이터를 추출합니다.
 *
 * 단일 출처 = 인터페이스. 설명과 데모 예시값을 한 곳에서 관리합니다.
 *
 * 대상 형식: 인터페이스 메서드 선언 + 바로 위 JSDoc
 *   export interface INumberUtil {
 *     /**
 *      * 설명
 *      * @demo value="예시값" digits="2"
 *      *\/
 *     name(params): ReturnType;
 *   }
 *
 * - 설명(desc): JSDoc 본문에서 `@` 태그가 아닌 줄.
 * - 예시값(example): `@demo name="value"` 태그에서 파라미터별로 추출.
 *   따옴표로 감싸므로 값에 쉼표/공백이 있어도 안전합니다. (예: "$ 1,234.50 원")
 * - 시그니처/타입: 메서드 선언부에서 직접 추출.
 */
export interface IParamDoc {
	/** 파라미터명 */
	name: string;
	/** 타입 표기 (예: "number", "number | string", "unknown") */
	type: string;
	/** `@demo` 예시값 (없으면 빈 문자열) */
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

/* JSDoc(/** ... *\/) 직후의 인터페이스 메서드 선언(`;`로 끝남)을 캡처합니다.
 * 1: JSDoc 본문 / 2: 함수명 / 3: 파라미터 / 4: 반환 타입 */
const DOC_METHOD_RE = /\/\*\*([\s\S]*?)\*\/\s*(\w+)\s*\(([^)]*)\)\s*:\s*([^;]+?)\s*;/g;

/** `@demo name="value"` 형식의 예시값 쌍.
 * 값에 큰따옴표가 포함된 JSON 예시를 위해 작은따옴표 표기도 허용합니다.
 * (예: obj='{"a":1}') */
const DEMO_PAIR_RE = /(\w+)=(?:"([^"]*)"|'([^']*)')/g;

/** `interface <name> { ... }` 의 본문을 중괄호 깊이로 정확히 잘라냅니다. */
function extractInterfaceBody(source: string, interfaceName: string): string {
	const decl = source.indexOf(`interface ${interfaceName}`);
	if (decl === -1) return '';
	const open = source.indexOf('{', decl);
	if (open === -1) return '';

	let depth = 0;
	for (let i = open; i < source.length; i++) {
		if (source[i] === '{') depth++;
		else if (source[i] === '}') {
			depth--;
			if (depth === 0) return source.slice(open + 1, i);
		}
	}
	return '';
}

/** 시그니처 파라미터 문자열을 { name, type } 배열로 분해합니다. (옵셔널 `?`는 이름에서 제거) */
function splitSignatureParams(raw: string): { name: string; type: string }[] {
	const trimmed = raw.trim();
	if (!trimmed) return [];
	return trimmed.split(',').map((seg) => {
		const colon = seg.indexOf(':');
		return {
			name: seg.slice(0, colon).replace('?', '').trim(),
			type: seg.slice(colon + 1).trim(),
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
				// 큰따옴표(2) 또는 작은따옴표(3) 중 매칭된 값을 사용합니다.
					examples[pair[1]] = pair[2] ?? pair[3] ?? '';
			}
		} else if (t && !t.startsWith('@')) {
			descLines.push(t);
		}
	}

	return { desc: descLines.join(' ').trim(), examples };
}

/** 지정한 인터페이스의 메서드 메타데이터를 추출합니다. */
export function parseFunctionDocs(source: string, interfaceName: string): IFunctionDoc[] {
	const body = extractInterfaceBody(source, interfaceName);
	const docs: IFunctionDoc[] = [];
	let match: RegExpExecArray | null;

	DOC_METHOD_RE.lastIndex = 0;
	while ((match = DOC_METHOD_RE.exec(body)) !== null) {
		const [, rawDoc, name, rawParams, rawReturn] = match;
		const { desc, examples } = parseJsDoc(rawDoc);

		const params: IParamDoc[] = splitSignatureParams(rawParams).map((p) => ({
			name: p.name,
			type: p.type,
			example: examples[p.name] ?? '',
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
