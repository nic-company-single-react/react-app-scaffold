/// <reference types="vitest/config" />
import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { playwright } from '@vitest/browser-playwright';
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
		// 하나의 Vitest 안에서 "환경이 다른 두 묶음(projects)"을 정의한다.
		//  - unit    : jsdom 에서 실행 (빠름, 대부분의 유닛 테스트)      → *.test.{ts,tsx}
		//  - browser : 진짜 Chromium 에서 실행 (정확함, 필요한 것만)    → *.browser.test.{ts,tsx}
		// 파일 이름 규칙으로 갈라지므로, 브라우저가 꼭 필요한 컴포넌트만
		// 파일명을 *.browser.test.tsx 로 지으면 자동으로 브라우저에서 돈다.
		test: {
			projects: [
				{
					// 상위 vite 설정(plugins, resolve alias 등)을 그대로 상속
					extends: true,
					test: {
						name: 'unit',
						// jsdom: Node에는 없는 document/window를 가짜로 제공해 컴포넌트를 렌더링
						environment: 'jsdom',
						// describe/test/expect 를 import 없이 전역으로 사용 (Jest 처럼)
						globals: true,
						// 각 테스트 전에 자동 실행할 셋업 파일 (jest-dom 매처 등록)
						setupFiles: './src/test/setup.ts',
						// 일반 *.test 만 포함하고, 브라우저 전용(*.browser.test)은 제외
						include: ['src/**/*.test.{ts,tsx}'],
						exclude: ['**/node_modules/**', '**/*.stories.*', 'src/**/*.browser.test.{ts,tsx}'],
					},
				},
				{
					extends: true,
					test: {
						name: 'browser',
						globals: true,
						setupFiles: './src/test/setup.ts',
						// 브라우저 전용 파일만 포함
						include: ['src/**/*.browser.test.{ts,tsx}'],
						exclude: ['**/node_modules/**', '**/*.stories.*'],
						// Playwright 로 실제 Chromium 을 띄워서 실행
						browser: {
							enabled: true,
							provider: playwright(),
							headless: true,
							instances: [{ browser: 'chromium' }],
							// Windows 예약 포트 대역(netsh ...excludedportrange)을 피하려고
							// 브라우저용 내부 서버를 IPv4 + 고정 포트로 지정한다.
							// (기본값이 예약 대역 63252~63351 안의 포트를 잡아 EACCES 가 나는 것을 회피)
							api: { host: '127.0.0.1', port: 5199 },
						},
					},
				},
			],
		},
	};
});
