/**
 * JWT Access Token 저장소 (shared)
 *
 * core(api)는 토큰을 알지 못한다. shared가 토큰을 보관하고,
 * setupAuthInterceptor가 요청 시 Authorization 헤더로 주입한다.
 *
 * 기본은 메모리 보관이며, 다른 소스(localStorage 등)를 쓰려면
 * setAccessTokenResolver()로 getter를 교체할 수 있다.
 */

type AccessTokenResolver = () => string | null;

let memoryToken: string | null = null;
let resolver: AccessTokenResolver = () => memoryToken;

/** 메모리에 access token을 저장한다. (로그인 성공 시 호출) */
export function setAccessToken(token: string | null): void {
	memoryToken = token;
}

/** 저장된 access token을 제거한다. (로그아웃 시 호출) */
export function clearAccessToken(): void {
	memoryToken = null;
}

/** 현재 access token을 반환한다. (resolver 경유) */
export function getAccessToken(): string | null {
	return resolver();
}

/**
 * 토큰 조회 방식을 교체한다.
 *
 * @example
 * // localStorage를 토큰 소스로 사용
 * setAccessTokenResolver(() => localStorage.getItem('access_token'));
 */
export function setAccessTokenResolver(fn: AccessTokenResolver): void {
	resolver = fn;
}
