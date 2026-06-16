import { registerRequestInterceptor } from '@/core/api';
import { getAccessToken } from './token-store';

/**
 * 모든 API 요청에 JWT access token을 Authorization 헤더로 자동 주입한다.
 *
 * 앱 부트스트랩(main.tsx)에서 첫 요청 전에 1회만 호출한다.
 * 토큰이 없으면 헤더를 붙이지 않는다.
 */
export function setupAuthInterceptor(): number {
	return registerRequestInterceptor((config) => {
		const token = getAccessToken();
		if (token) {
			config.headers.set('Authorization', `Bearer ${token}`);
		}
		return config;
	});
}
