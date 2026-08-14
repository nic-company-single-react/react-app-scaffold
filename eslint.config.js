// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format
import storybook from "eslint-plugin-storybook";

import js from '@eslint/js';
import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import tseslint from 'typescript-eslint';
import { defineConfig, globalIgnores } from 'eslint/config';
import importPlugin from 'eslint-plugin-import-x';
import react from 'eslint-plugin-react';

import eslintConfigPrettier from 'eslint-config-prettier'; // eslint, prettier 충돌 방지

export default defineConfig([
    globalIgnores(['dist']),
    js.configs.recommended,
    tseslint.configs.recommended,
    reactHooks.configs.flat.recommended,
    reactRefresh.configs.vite,
    eslintConfigPrettier,
    {
		files: ['**/*.{js,ts,jsx,tsx}'],
		plugins: {
			react,
			import: importPlugin,
		},
		languageOptions: {
			ecmaVersion: 2020,
			globals: globals.browser,
		},
		rules: {
			'@typescript-eslint/no-explicit-any': 'off',
			semi: ['error', 'always'],
			'@typescript-eslint/no-empty-object-type': 'off',
			'@typescript-eslint/no-unused-vars': 'warn',
			'jsx-quotes': ['error', 'prefer-double'],
			'react/jsx-max-props-per-line': ['error', { maximum: 1 }],
			'react-hooks/exhaustive-deps': 'off',
			'react-hooks/incompatible-library': 'off',
			'react-hooks/set-state-in-effect': 'off',
			'react/no-unescaped-entities': 'off',
			// defineDialog($ui.dialog 컨텐츠 정의 헬퍼)는 런타임 identity 함수라 Fast Refresh 에 문제가 없다.
			// HOC 로 인식시켜 `export default defineDialog(...)` 패턴을 허용한다.
			'react-refresh/only-export-components': ['error', { allowConstantExport: true, extraHOCs: ['defineDialog'] }],
			'import/no-anonymous-default-export': [
				'warn',
				{
					// export default 할 때 익명 사용 금지 (new 함수만 허용함)
					allowArray: false,
					allowArrowFunction: false,
					allowAnonymousClass: false,
					allowAnonymousFunction: false,
					allowCallExpression: true, // The true value here is for backward compatibility
					allowNew: true,
					allowLiteral: false,
					allowObject: false,
				},
			],
			'no-empty-pattern': 'off',
		},
	},
    ...storybook.configs["flat/recommended"]
]);
