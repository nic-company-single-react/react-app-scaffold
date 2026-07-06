import { createAppRouter } from './app-common-router.ts';
import { registerWindowRouter } from '@/core/utils/router';
import routes from '@/shared/router';
import { routerConfig } from '@/config';

// 라우터 옵션(basename 등)은 src/config/router.config.ts 에서 통합 관리합니다. (core 불가침)
const router = createAppRouter(routes, routerConfig);

// window.$router를 전역 변수로 등록
registerWindowRouter(router);

export * from './app-common-router.ts';
export default router;
