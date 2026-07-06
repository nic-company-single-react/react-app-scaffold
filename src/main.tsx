import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/providers/AppProviders.tsx';
import App from './App.tsx';
import './assets/styles/app.css';
import { initApiConfig } from '@/core/api/api-config';
import { initQueryConfig } from '@/core/query';
import { apiConfig, queryConfig } from '@/config';
import { registerWindowUtil } from '@/core/utils/util';
import { registerWindowUI } from '@/core/ui';
import { setupAuthInterceptor, setAccessToken } from '@/shared/auth';

// 전역 $util 유틸리티 등록(window.$util) =============================
registerWindowUtil();

// 전역 $ui 등록(window.$ui : $ui.alert / $ui.confirm) =============================
registerWindowUI();

// 앱에서 REST API 호출용 API 설정 주입(push): src/config/api.config.ts → core(전역 저장: window.__MF_APP_CONFIG__) =====
initApiConfig(apiConfig);

// Query(캐시) 설정 주입(push): src/config/query.config.ts 의 override를 core에 전달 ====================
initQueryConfig(queryConfig);

// JWT access token을 모든 API 요청 헤더에 자동 주입(필요 시 주석제거해서 사용) =============================
const saved = localStorage.getItem(import.meta.env.VITE_LOCALSTORAGE_TOKEN_NAME);
if (saved) setAccessToken(saved);
setupAuthInterceptor();

createRoot(document.getElementById('root')!).render(
	<AppProviders>
		<App />
	</AppProviders>,
);
