import type { DOMRouterOpts } from 'react-router';

/**
 * 라우터 설정.
 *
 * react-router 라우터 생성 옵션(basename, future, dataStrategy 등)을 한곳에서 관리합니다.
 * core(core/router/index.ts)가 createAppRouter(routes, routerConfig) 로 이 객체를 통째로
 * 전달하므로, 앞으로 라우터 옵션이 늘어도 이 파일에 키만 추가하면 됩니다. (core 불가침)
 *
 * ※ hash/browser 선택은 이 옵션이 아니라 factory 선택 축이며, 프로젝트 규칙(CLAUDE.md)상
 *   createHashRouter 로 고정되어 있어 여기서는 다루지 않습니다.
 *
 * SI 프로젝트에서 라우터 동작(배포 경로 등)을 바꿀 때는 이 파일(또는 .env)만 수정하세요.
 */
export type RouterConfig = DOMRouterOpts;

export const routerConfig: RouterConfig = {
	// 라우터 basename (.env 의 VITE_ROUTER_BASENAME). 하위 경로에 배포할 때 사용.
	basename: import.meta.env.VITE_ROUTER_BASENAME,

	// 아래는 필요 시 추가하는 react-router 라우터 옵션 예시입니다.
	// future: { /* v7 future 플래그 등 */ },
	// dataStrategy: async (args) => { /* 커스텀 데이터 로딩 전략 */ },
	// patchRoutesOnNavigation: async ({ path, patch }) => { /* lazy 라우트 주입 */ },
};
