import { createAppRouter } from './app-common-router.ts';
import { registerWindowRouter } from '@/core/utils/router';
import routes from '@/shared/router';
import { routerConfig } from '@/config';

const router = createAppRouter(routes, {
	// 라우터 설정은 src/config/router.config.ts 에서 관리합니다. (basename ← .env VITE_ROUTER_BASENAME)
	basename: routerConfig.basename,
});

// window.$router를 전역 변수로 등록
registerWindowRouter(router);

export * from './app-common-router.ts';
export default router;
