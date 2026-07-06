/**
 * 라우터 설정.
 *
 * basename 등 라우터 조립에 필요한 값을 여기서 관리합니다.
 * 값은 .env(VITE_*)에서 읽어오며, 기존에 core(core/router/index.ts)가 직접 읽던
 * import.meta.env.VITE_ROUTER_BASENAME 을 이 설정 레이어로 옮겼습니다. (core 불가침)
 *
 * SI 프로젝트에서 배포 경로(basename)를 바꿀 때는 이 파일(또는 .env)만 수정하세요.
 */
export interface RouterConfig {
	/** 라우터 basename. 하위 경로에 배포할 때 사용 (.env 의 VITE_ROUTER_BASENAME) */
	basename: string | undefined;
}

export const routerConfig: RouterConfig = {
	basename: import.meta.env.VITE_ROUTER_BASENAME,
};
