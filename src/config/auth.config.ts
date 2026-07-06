/**
 * 인증(auth) 설정.
 *
 * access token 저장 키, 로그인 경로 등 인증 관련 값을 여기서 단일 관리합니다.
 * 기존에는 main.tsx / ProtectedRoute / setup-auth-interceptor 등 여러 곳에서
 * import.meta.env.VITE_LOCALSTORAGE_TOKEN_NAME 을 각각 직접 읽었는데, 이 파일 하나로 모았습니다.
 *
 * SI 프로젝트에서 인증 정책을 바꿀 때는 이 파일(또는 .env)만 수정하세요. (core 불가침)
 */
export interface AuthConfig {
	/** access token을 저장/조회할 localStorage 키 이름 (.env 의 VITE_LOCALSTORAGE_TOKEN_NAME) */
	tokenStorageKey: string;
	/** 미인증(토큰 없음) 상태에서 이동시킬 로그인 경로 */
	loginPath: string;
}

export const authConfig: AuthConfig = {
	tokenStorageKey: import.meta.env.VITE_LOCALSTORAGE_TOKEN_NAME,
	loginPath: '/auth/login',
};
