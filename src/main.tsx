import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/providers/AppProviders.tsx';
import App from './App.tsx';
import './assets/styles/app.css';
import { initApiConfig } from '@/core/api';
import { initQueryConfig } from '@/core/query';
import { apiConfig, queryConfig } from '@/config';
import { registerWindowUtil } from '@/core/utils/util';
import { registerWindowUI } from '@/core/ui';

// 전역 $util 유틸리티 등록(window.$util) =============================================
registerWindowUtil();
// 전역 $ui 등록(window.$ui : $ui.alert / $ui.confirm / $ui.dialog) ==================
registerWindowUI();
// 앱에서 REST API 호출용 API 설정 주입(push)
// src/config/api.config.ts → core(axios defaults) ==============
initApiConfig(apiConfig);
// Query(캐시) 설정 주입(push)
// src/config/query.config.ts 의 override를 core에 전달 ==============================
initQueryConfig(queryConfig);

createRoot(document.getElementById('root')!).render(
	<AppProviders>
		<App />
	</AppProviders>,
);
