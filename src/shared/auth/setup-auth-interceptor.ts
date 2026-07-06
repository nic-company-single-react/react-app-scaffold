import { registerRequestInterceptor, registerResponseInterceptor } from '@/core/api';
import { getAccessToken } from './token-store';
// 아래 주석 예시(토큰 영속 저장 / 401 로그아웃)를 활성화할 때 사용합니다.
// import { authConfig } from '@/config';

/** setupAuthInterceptor가 등록한 인터셉터들의 해제용 id 묶음. */
export interface IAuthInterceptorIds {
	/** 요청 인터셉터 id (ejectRequestInterceptor에 사용) */
	requestId: number;
	/** 응답 인터셉터 id (ejectResponseInterceptor에 사용) */
	responseId: number;
}

/**
 * 인증 관련 인터셉터(요청/응답)를 한 번에 등록한다.
 *
 * 앱 부트스트랩(main.tsx)에서 첫 요청 전에 1회만 호출한다.
 *
 * ── 실행 시점 구분 ──
 * - setupAuthInterceptor() 호출(= 인터셉터 등록)은 부팅 시 "한 번"만 일어난다.
 * - 아래 등록된 콜백들은 이후 axios를 거치는 "모든 요청/응답마다" 매번 실행된다.
 *   따라서 토큰은 등록 시점이 아니라 매 요청 순간에 getAccessToken()으로 새로 읽는다.
 *   → 등록 시점에 토큰이 없어도, 요청 시점에 토큰만 있으면 헤더에 주입된다.
 */
export function setupAuthInterceptor(): IAuthInterceptorIds {
	// ── 요청 인터셉터: 모든 요청에 access token을 Authorization 헤더로 자동 주입 ──
	// registerRequestInterceptor 호출 자체는 부팅 시 1회 → 콜백을 axios에 등록만 한다.
	const requestId = registerRequestInterceptor((config) => {
		// 이 콜백 본문은 API 요청을 보낼 때마다 매번 실행된다.
		const token = getAccessToken();
		if (token) {
			config.headers.set('Authorization', `Bearer ${token}`);
		}
		// 토큰이 없으면(예: 로그인 전, /api/auth/login 요청 등) 헤더 없이 그대로 통과시킨다.
		return config;
	});

	// ── 응답 인터셉터: 인증 관련 공통 응답 처리 자리 ──
	// 지금은 통과만 시키는 스캐폴드. 401 자동 로그아웃/리다이렉트, 토큰 갱신(refresh) 등
	// 인증 관련 공통 처리가 생기면 여기에 추가한다.
	const responseId = registerResponseInterceptor(
		// onFulfilled: 정상 응답(2xx)은 매 응답마다 실행.
		(response) => {
			//// 로그인 응답이면 결과 값에서 토큰을 꺼내 저장한다.
			//// config.url은 절대 URL로 변환되어 있으므로 endpoint 포함 여부로 판별한다.
			//if (response.config.url?.includes(LOGIN_ENDPOINT)) {
			//	// ⚠️ 백엔드 응답 구조가 확정되면 아래 토큰 키를 실제 키 하나로 고정할 것.
			//	//    (지금은 흔한 형태들을 방어적으로 탐색한다)
			//	const body = (response.data ?? {}) as Record<string, any>;
			//	const token: string | undefined = body.accessToken ?? body.token ?? body.data?.accessToken ?? body.data?.token;

			//	if (token) {
			//		setAccessToken(token); // 메모리 즉시 갱신 → 다음 요청부터 헤더에 주입
			//		localStorage.setItem(authConfig.tokenStorageKey, token); // 영속 저장(새로고침 유지)
			//	}
			//}
			return response;
		},
		// onRejected: 에러 응답(non-2xx)은 매 에러마다 실행.
		(error) => {
			// 예시) 401이면 토큰 정리 후 로그인 페이지로 보내기 — 필요해지면 주석 해제해서 사용.
			// if (error.response?.status === 401) {
			// 	clearAccessToken();
			// 	localStorage.removeItem(authConfig.tokenStorageKey);
			// 	$router.push(authConfig.loginPath);
			// }

			// 에러 체인을 끊지 않도록 반드시 reject로 다시 던진다.
			// (여기서 그냥 return 하면 에러가 정상 응답처럼 처리되어 호출 측 catch/error가 깨진다.)
			return Promise.reject(error);
		},
	);

	return { requestId, responseId };
}
