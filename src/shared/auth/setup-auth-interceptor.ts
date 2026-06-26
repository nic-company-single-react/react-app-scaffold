import { registerRequestInterceptor } from '@/core/api';
import { getAccessToken } from './token-store';

/**
 * 모든 API 요청에 JWT access token을 Authorization 헤더로 자동 주입한다.
 *
 * 앱 부트스트랩(main.tsx)에서 첫 요청 전에 1회만 호출한다.
 * 토큰이 없으면 헤더를 붙이지 않는다.
 *
 * ── 실행 시점 구분 ──
 * - setupAuthInterceptor() 호출(= 인터셉터 등록)은 부팅 시 "한 번"만 일어난다.
 * - 아래 등록된 콜백은 이후 axios를 거치는 "모든 요청마다" 매번 실행된다.
 *   따라서 토큰은 등록 시점이 아니라 매 요청 순간에 getAccessToken()으로 새로 읽는다.
 *   → 등록 시점에 토큰이 없어도, 요청 시점에 토큰만 있으면 헤더에 주입된다.
 */
export function setupAuthInterceptor(): number {
	// registerRequestInterceptor 호출 자체는 부팅 시 1회 → 콜백을 axios에 등록만 한다.
	return registerRequestInterceptor((config) => {
		// 이 콜백 본문은 API 요청을 보낼 때마다 매번 실행된다.
		const token = getAccessToken();
		if (token) {
			config.headers.set('Authorization', `Bearer ${token}`);
		}
		// 토큰이 없으면(예: 로그인 전, /api/auth/login 요청 등) 헤더 없이 그대로 통과시킨다.
		return config;
	});
}
