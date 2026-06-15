import StyleDictionary from 'style-dictionary';

// Tailwind v4 @theme 블록 (primitive 토큰용)
StyleDictionary.registerFormat({
	name: 'css/tailwind-v4-theme',
	format: ({ dictionary }) => {
		const vars = dictionary.allTokens.map((t) => `  ${t.name}: ${t.$value ?? t.value};`).join('\n');
		return `/* AUTO-GENERATED — do not edit manually */\n@theme {\n${vars}\n}\n`;
	},
});

// CSS :root 블록 (시맨틱 라이트용)
StyleDictionary.registerFormat({
	name: 'css/semantic-root',
	format: ({ dictionary }) => {
		const vars = dictionary.allTokens.map((t) => `  ${t.name}: ${t.$value ?? t.value};`).join('\n');
		return `/* AUTO-GENERATED — do not edit manually */\n:root {\n${vars}\n}\n`;
	},
});

// CSS .dark 블록 (시맨틱 다크용)
StyleDictionary.registerFormat({
	name: 'css/semantic-dark',
	format: ({ dictionary }) => {
		const vars = dictionary.allTokens.map((t) => `  ${t.name}: ${t.$value ?? t.value};`).join('\n');
		return `/* AUTO-GENERATED — do not edit manually */\n.dark {\n${vars}\n}\n`;
	},
});

// token path → CSS 변수명: color.brand.500 → --color-brand-500
StyleDictionary.registerTransform({
	name: 'name/css/kebab',
	type: 'name',
	transform: (token) => '--' + token.path.join('-').toLowerCase().replace(/_/g, '-'),
});

// style-dictionary v5는 `source`를 config 최상위에서만 읽습니다(플랫폼 내부 source는 무시됨).
// 또한 light/dark는 동일한 토큰 경로(color.brand.primary 등)를 다른 값으로 정의하므로
// 한 source로 합치면 충돌이 납니다. 따라서 테마별로 별도 인스턴스를 만들어 빌드합니다.
const BUILD_PATH = 'src/assets/styles/tokens/';

// Primitive(@theme {}) + TypeScript 타입선언 — source: primitive만
const primitive = new StyleDictionary({
	usesDtcg: true,
	source: ['src/design-tokens/primitive/**/*.json'],
	platforms: {
		css: {
			transforms: ['name/css/kebab'],
			buildPath: BUILD_PATH,
			files: [{ destination: 'primitive.css', format: 'css/tailwind-v4-theme' }],
		},
		ts: {
			// CSS의 '--' kebab 이름은 TS 식별자로 부적합 → camelCase 사용 (colorBrand400 형태)
			transforms: ['name/camel'],
			buildPath: 'src/design-tokens/',
			files: [{ destination: 'types.d.ts', format: 'typescript/es6-declarations' }],
		},
	},
});

// Semantic light(:root {}) — source: primitive + light, 출력은 semantic/light 토큰만
const light = new StyleDictionary({
	usesDtcg: true,
	source: ['src/design-tokens/primitive/**/*.json', 'src/design-tokens/semantic/light.json'],
	platforms: {
		css: {
			transforms: ['name/css/kebab'],
			buildPath: BUILD_PATH,
			files: [
				{
					destination: 'theme-light.css',
					format: 'css/semantic-root',
					filter: (t) => t.filePath.includes('semantic/light'),
				},
			],
		},
	},
});

// Semantic dark(.dark {}) — source: primitive + dark, 출력은 semantic/dark 토큰만
const dark = new StyleDictionary({
	usesDtcg: true,
	source: ['src/design-tokens/primitive/**/*.json', 'src/design-tokens/semantic/dark.json'],
	platforms: {
		css: {
			transforms: ['name/css/kebab'],
			buildPath: BUILD_PATH,
			files: [
				{
					destination: 'theme-dark.css',
					format: 'css/semantic-dark',
					filter: (t) => t.filePath.includes('semantic/dark'),
				},
			],
		},
	},
});

await primitive.buildAllPlatforms();
await light.buildAllPlatforms();
await dark.buildAllPlatforms();
