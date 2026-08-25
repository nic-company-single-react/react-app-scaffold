import axios, { type AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { authConfig } from '@/config';
import { registerRequestInterceptor, registerResponseInterceptor } from '@/core/api';
import { clearSession, refreshSession } from './auth-flow';
import { getAccessToken, getAuthStrategy } from './auth-strategies';

/** setupAuthInterceptor가 등록한 인터셉터들의 해제용 id 묶음. */
export interface IAuthInterceptorIds {
	requestId: number;
	responseId: number;
}

/** 재시도 1회를 표시하려고 axios 설정에 얹는 플래그. */
type TRetriableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

/**
 * 401 이 와도 **갱신하면 안 되는** 엔드포인트.
 *
 * me 는 여기 없다 — 보통의 보호된 요청이라 401 이면 갱신하는 게 맞다.
 */
const NON_RETRYABLE = [authConfig.endpoints.login, authConfig.endpoints.refresh, authConfig.endpoints.logout];

const isNonRetryable = (url?: string): boolean => !!url && NON_RETRYABLE.some((e) => url.includes(e));

/**
 * 인증 인터셉터(요청/응답)를 한 번에 등록한다. 부팅 시 1회.
 *
 * 등록은 한 번이지만 아래 콜백들은 **모든 요청/응답마다** 실행된다.
 * 그래서 토큰은 등록 시점이 아니라 매 요청 순간에 getAccessToken()으로 새로 읽는다.
 */
export function setupAuthInterceptor(): IAuthInterceptorIds {
	// ── 요청: access token 을 Authorization 헤더로 주입 ──
	const requestId = registerRequestInterceptor((config) => {
		const token = getAccessToken();
		if (token) config.headers.set('Authorization', `Bearer ${token}`);
		return config;
	});

	// ── 응답: 401 → 갱신 → 재시도 ──
	const responseId = registerResponseInterceptor(
		(response) => response,

		async (error: AxiosError) => {
			const config = error.config as TRetriableConfig | undefined;

			// 1. 401 이 아니면 인증의 일이 아니다.
			if (error.response?.status !== 401 || !config) return Promise.reject(error);

			// 2. ★ 인증 엔드포인트 자신의 401 은 갱신 대상이 아니다.
			//    이 줄을 빠뜨리면 두 가지가 깨진다.
			//      - 로그인 401(비밀번호 틀림)이 갱신 시도로 바뀌어, 에러 메시지 대신 화면이 튄다
			//      - refresh 자신의 401 이 다시 refresh 를 부른다 → 무한 루프
			if (isNonRetryable(config.url)) return Promise.reject(error);

			// 3. 이미 한 번 재시도한 요청. 두 번은 안 한다.
			if (config._retry) return Promise.reject(error);

			// 4. ★ 인터셉터가 전략을 아는 유일한 지점.
			//    "갱신할 수 있는가"만 묻는다. 어떻게 갱신하는지는 전략이 안다.
			if (!getAuthStrategy().supportsRefresh) {
				clearSession('expired');
				return Promise.reject(error);
			}

			// 5. 갱신(single-flight) → 재시도.
			try {
				const session = await refreshSession();

				config._retry = true;
				config.headers.set('Authorization', `Bearer ${session.accessToken}`);

				// core 의 axios 인스턴스에는 닿을 수 없으므로(core 불가침) 맨 axios 로 보낸다.
				// config.url 은 makeRequestConfig 가 이미 절대 URL 로 만들어 뒀다.
				// 맨 axios 는 인터셉터를 타지 않는다 — 그게 오히려 이득이다.
				// 재시도가 또 401 이어도 갱신 루프에 들어가지 않는다. 대신 Authorization 을
				// 위에서 손으로 붙여야 했다.
				return await axios(config);
			} catch {
				// 갱신 실패 = 세션이 끝났다. 게이트가 이 상태를 보고 로그인 화면으로 보낸다.
				clearSession('expired');
				return Promise.reject(error);
			}
		},
	);

	return { requestId, responseId };
}
