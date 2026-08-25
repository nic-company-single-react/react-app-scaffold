import { authConfig } from '@/config';
import { ApiError, callApi } from '@/core/api';
import type { IAuthSession, TAuthResponseBody, TAuthUser } from '@/types/auth';

/**
 * 인증 엔드포인트 호출만 담당한다. **상태를 바꾸지 않는다.**
 *
 * 토큰을 어디에 보관할지(전략), 스토어를 어떻게 갱신할지는 이 파일의 관심사가 아니다.
 * 여기는 "서버에 묻고 응답을 IAuthSession 으로 번역하는" 층이다.
 *
 * 경로와 응답 키 매핑은 전부 src/config/auth.config.ts 가 갖는다.
 */

/**
 * 응답 본문 → 세션.
 *
 * 200 인데 accessToken 을 못 꺼냈다면 그건 서버 오류가 아니라 **설정이 응답과 안 맞는 것**이다.
 * 조용히 넘어가면 "로그인은 성공했는데 그 뒤 모든 요청이 401" 이라는, 원인을 찾기 어려운
 * 증상이 된다. 어디를 고쳐야 하는지까지 적어서 즉시 터뜨린다.
 */
const toSession = (body: TAuthResponseBody, endpoint: string): IAuthSession => {
	const accessToken = authConfig.extractAccessToken(body);

	if (!accessToken) {
		throw new ApiError(
			500,
			`${endpoint} 응답에서 accessToken 을 꺼내지 못했습니다. ` +
				`src/config/auth.config.ts 의 extractAccessToken 이 서버 응답과 맞는지 확인하세요.`,
			body,
		);
	}

	return {
		accessToken,
		refreshToken: authConfig.extractRefreshToken(body),
		user: authConfig.extractUser(body),
	};
};

/**
 * ① 로그인. 실패(비밀번호 틀림)는 ApiError(401) 로 던져진다.
 *
 * `credentials` 를 `object` 로 받는 이유 — **스캐폴드는 로그인에 무엇이 필요한지 몰라야 한다.**
 * 서버에 따라 `{ loginId, password }` 일 수도, `{ companyCode, empNo, password, otp }` 일 수도 있다.
 * 형태를 여기서 고정하면 필드가 하나만 달라도 SI 가 이 파일을 열게 된다.
 * 받은 객체를 그대로 body 로 보내므로, **요청 스펙은 호출 측의 타입이 정한다.**
 * (그 타입은 프로젝트가 src/domains/auth/types.ts 에 만드는 ILoginCredentials 다.
 *  스캐폴드 기본 상태에는 없다 — plan/jwt인증-공통개발자-적용가이드.md 참고)
 */
export async function requestLogin(credentials: object): Promise<IAuthSession> {
	const res = await callApi<TAuthResponseBody>(authConfig.endpoints.login, {
		method: 'POST',
		// 스프레드와 캐스팅은 스타일이 아니라 필수다. interface 에는 암묵적 인덱스 시그니처가 없어
		// Record<string, unknown>(ApiRequestConfig.body) 에 직접 넣지 못한다.
		body: { ...credentials } as Record<string, unknown>,
	});
	return toSession(res.data ?? {}, authConfig.endpoints.login);
}

/**
 * ③④ 갱신.
 *
 * `refreshToken` 을 넘길지 말지가 전략이 갈리는 유일한 지점이다.
 * - `cookie`  : 넘기지 않는다. 브라우저가 쿠키를 자동으로 싣는다.
 * - `storage` : 보관하던 값을 넘긴다.
 */
export async function requestRefresh(refreshToken?: string): Promise<IAuthSession> {
	const res = await callApi<TAuthResponseBody>(authConfig.endpoints.refresh, {
		method: 'POST',
		...(refreshToken ? { body: { refreshToken } } : {}),
	});
	return toSession(res.data ?? {}, authConfig.endpoints.refresh);
}

/**
 * ⑤ 로그아웃.
 *
 * 여기서는 실패를 삼키지 않고 그대로 던진다. "서버가 죽어도 클라이언트는 로그아웃한다"는
 * 판단은 흐름(auth-actions)이 내릴 일이지 호출 층이 미리 정할 일이 아니다.
 */
export async function requestLogout(refreshToken?: string): Promise<void> {
	await callApi(authConfig.endpoints.logout, {
		method: 'POST',
		...(refreshToken ? { body: { refreshToken } } : {}),
	});
}

/** 현재 사용자 조회. 로그인 응답에 user 가 없는 서버를 위한 보조 경로이자, 화면이 쓰는 조회. */
export async function requestMe(): Promise<TAuthUser | undefined> {
	const res = await callApi<TAuthResponseBody>(authConfig.endpoints.me);
	return authConfig.extractUser(res.data ?? {});
}
