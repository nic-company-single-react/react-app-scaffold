/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { resolve } from 'path';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
	const env = loadEnv(mode, process.cwd(), '');
	return {
		base: env.VITE_BASE_URL,
		plugins: [react(), tailwindcss()],
		resolve: {
			alias: {
				'@': resolve(__dirname, './src'),
				'@axiom/components/ui': resolve(__dirname, './src/shared/ui'),
				'@axiom/hooks': resolve(__dirname, './src/core/hooks'),
				'@axiom/store': resolve(__dirname, './src/core/store'),
				'@app-types': resolve(__dirname, './src/types'),
			},
		},
		server: {
			port: Number(env.PORT) || 5173,
			proxy: {
				'/api': {
					target: env.VITE_SERVER_URL,
					changeOrigin: true,
				},
			},
		},
		// 단위테스트(Vitest) 설정
		test: {
			// jsdom: Node에는 없는 document/window를 가짜로 제공해 컴포넌트를 렌더링할 수 있게 함
			environment: 'jsdom',
			// describe/test/expect 를 import 없이 전역으로 사용 (Jest 처럼)
			globals: true,
			// 각 테스트 전에 자동 실행할 셋업 파일 (jest-dom 매처 등록)
			setupFiles: './src/test/setup.ts',
			// Storybook의 *.stories 파일은 단위테스트 대상에서 제외
			exclude: ['**/node_modules/**', '**/*.stories.*'],
		},
	};
});
