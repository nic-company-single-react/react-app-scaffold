/**
 * 인증 타입 — **스캐폴드가 소유한다.**
 *
 * 여기 있는 것은 전부 "인증 모듈이 동작하는 데 필요한 형태"이고, 서버마다 달라지는 값이 아니다.
 * 그래서 스캐폴드를 새 버전으로 다시 반입할 때 **이 파일은 덮어써도 안전하다.**
 *
 * ⚠️ 서버에 맞춰 바뀌는 타입(로그인 자격 증명, 사용자 모양)은 여기 두지 않는다.
 *    그건 SI 소유라 프로젝트가 `src/domains/auth/types.ts` 에 만든다.
 *    (스캐폴드 기본 상태에는 없다 — `plan/jwt인증-공통개발자-적용가이드.md` 2단계에서 만든다)
 *    스캐폴드가 그 형태를 알면 의존 방향이 거꾸로 되어, SI 가 고칠 때마다
 *    스캐폴드 코드의 시그니처가 따라 바뀐다.
 */

/**
 * 저장 전략 프리셋.
 *
 * 서버가 refresh token 을 **어떻게 주는지**에 따라 셋 중 하나를 고른다.
 * 직접 전략을 구현하는 것이 아니라 이름만 고르는 것이다. (스캐폴드가 구현을 갖고 있다)
 *
 * | 값 | 서버가 refresh 를 주는 방법 | access 보관 | 401 을 받으면 |
 * |---|---|---|---|
 * | `cookie`      | Set-Cookie (httpOnly)      | 메모리       | 갱신 → 재시도 |
 * | `storage`     | 응답 body { refreshToken } | localStorage | 갱신 → 재시도 |
 * | `access-only` | 주지 않는다                 | localStorage | 정리 → 로그인 화면 |
 */
export type TAuthStrategy = 'cookie' | 'storage' | 'access-only';

/**
 * 로그인한 사용자 — **스캐폴드는 내용을 모른다.**
 *
 * 서버가 주는 사용자 객체를 그대로 담아 두기만 한다. 필드를 읽는 것은 화면의 일이다.
 * 화면에서는 자기 타입으로 꺼내 쓴다.
 *
 * @example
 * const { user } = useAuth<IAppUser>();   // 프로젝트가 만든 타입
 */
export type TAuthUser = Record<string, unknown>;

/**
 * 세션이 끝난 이유. `authConfig.onSessionEnd` 가 이 값을 받는다.
 *
 * | 값 | 언제 |
 * |---|---|
 * | `logout`    | 사용자가 로그아웃했다 |
 * | `expired`   | 갱신에 최종 실패했다 (세션 만료 · refresh 폐기) |
 * | `other-tab` | 다른 탭에서 로그아웃했다 |
 */
export type TSessionEndReason = 'logout' | 'expired' | 'other-tab';

/** 인증 API 경로. baseURL(.env 의 VITE_API_BASE_URL) 뒤에 붙는다. */
export interface IAuthEndpoints {
	login: string;
	logout: string;
	refresh: string;
	me: string;
}

/**
 * 응답 본문. 서버마다 형태가 달라 느슨하게 둔다.
 * 이 타입 덕분에 SI 가 `(body) => body.data.access_token` 처럼 캐스팅 없이 적을 수 있다.
 */
export type TAuthResponseBody = Record<string, any>;

/**
 * 로그인 · 갱신이 돌려주는 한 번의 인증 결과.
 *
 * 전략은 이것을 받아 자기 방식대로 보관하고(`persist`), 스토어는 `user` 를 담는다.
 */
export interface IAuthSession {
	accessToken: string;
	/** `storage` 전략에서만 값이 있다. `cookie` 는 쿠키에, `access-only` 는 아예 없다. */
	refreshToken?: string;
	/** 서버가 로그인·갱신 응답에 사용자를 안 실어주면 `undefined`. */
	user?: TAuthUser;
}

/**
 * 인증 설정의 형태. 값은 `src/config/auth.config.ts` 가 갖는다.
 *
 * 아래 세 개(`resolveRoles` · `onLoginSuccess` · `onSessionEnd`)가 **확장 지점**이다.
 * 이것들이 있어서 SI 는 `src/shared/auth/**` 를 열지 않고도 동작을 바꿀 수 있다.
 */
export interface AuthConfig {
	strategy: TAuthStrategy;
	endpoints: IAuthEndpoints;

	extractAccessToken: (body: TAuthResponseBody) => string | undefined;
	extractRefreshToken: (body: TAuthResponseBody) => string | undefined;
	extractUser: (body: TAuthResponseBody) => TAuthUser | undefined;

	/** 미인증 상태에서 보낼 **화면 라우트** 경로. `endpoints.login`(API 경로)과 다른 것이다. */
	loginPath: string;

	/** access token 저장소 키. `storage` · `access-only` 전략에서만 쓰인다. */
	tokenStorageKey: string;

	/**
	 * 사용자 객체에서 권한 목록을 꺼낸다. `<ProtectedRoute roles={[...]} />` 가 이 함수를 쓴다.
	 *
	 * 권한 가드를 안 쓰면 없어도 된다. 다만 `roles` 를 지정했는데 이 함수가 없으면
	 * **막는 쪽으로 동작한다**(개발 콘솔에 사유가 찍힌다) — 가드가 조용히 열려 있는 것보다 낫다.
	 */
	resolveRoles?: (user: TAuthUser) => string[];

	/**
	 * 로그인 성공 직후. 권한 조회 · 초기 데이터 로드 등 프로젝트 고유 작업을 여기서 한다.
	 *
	 * 이 시점에 세션은 **이미 확정돼 있다.** 여기서 던지면 에러가 로그인 화면까지 전달되지만
	 * 로그인 자체는 유지된다. 실패를 되돌리고 싶으면 이 안에서 `logout()` 을 부른다.
	 */
	onLoginSuccess?: (session: IAuthSession) => void | Promise<void>;

	/**
	 * 세션이 끝났을 때. **이동과 안내는 여기서 한다.**
	 *
	 * 스캐폴드 로직은 라우터를 모른다. 로그인 화면으로 보낼지, SSO 로그아웃 URL 로 보낼지,
	 * 만료 안내를 띄울지는 프로젝트마다 다르므로 이 콜백으로 넘긴다.
	 */
	onSessionEnd?: (reason: TSessionEndReason) => void;
}
