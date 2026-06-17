import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/providers/AppProviders.tsx';
import App from './App.tsx';
import './assets/styles/app.css';
import { initApiConfig } from '@/core/api/api-config';
import { registerWindowUtil } from '@/core/utils/util';
import { registerWindowUI } from '@/core/ui';
//import { setupAuthInterceptor, setAccessToken } from '@/shared/auth';

// 전역 $util 유틸리티 등록(window.$util) =============================
registerWindowUtil();

// 전역 $ui 등록(window.$ui : $ui.alert / $ui.confirm) =============================
registerWindowUI();

// 앱에서 REST API 호출용 API 설정(전역에 저장된 : window.__MF_APP_CONFIG__) =============================
const apiConfig = {
	baseURL: import.meta.env.VITE_EXTERNAL_API_BASE_URL2,
};
initApiConfig(apiConfig);

// JWT access token을 모든 API 요청 헤더에 자동 주입(필요 시 주석제거해서 사용) =============================
//const saved = localStorage.getItem('access_token');
//if (saved) setAccessToken(saved);
//setupAuthInterceptor();

createRoot(document.getElementById('root')!).render(
	<AppProviders>
		<App />
	</AppProviders>,
);
