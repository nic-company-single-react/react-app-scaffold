import type { AuthConfig } from '@/types/auth';

/**
 * 인증(auth) 설정 — **이 프로젝트(SI)가 소유하는 파일이다.**
 *
 * 서버에 맞춰 이 파일을 고치면 인증이 붙는다. `src/shared/auth/**` 안쪽은 열지 않는다.
 * 스캐폴드를 새 버전으로 반입해도 이 파일은 덮어쓰지 않는다.
 *
 * ⚠️ **스캐폴드 기본 상태에서 인증은 배선돼 있지 않다.** 이 파일의 값은 자리를 잡아둔
 *    기본값이고, 아직 아무도 읽지 않는다. 로그인 화면 · 라우트 게이트 · 부팅 배선을
 *    붙이는 절차는 `plan/jwt인증-공통개발자-적용가이드.md` 에 있다.
 *    (이 파일을 지우면 `src/shared/auth/**` 가 컴파일되지 않는다 — 값만 비우고 파일은 둔다)
 *
 * 아래 셋이 **확장 지점**이다. 동작을 바꾸고 싶으면 shared/auth 를 고치는 대신 여기를 쓴다.
 *   resolveRoles     권한 가드가 사용자에서 권한을 꺼내는 방법
 *   onLoginSuccess   로그인 성공 직후 할 일
 *   onSessionEnd     세션이 끝났을 때의 이동·안내
 *
 * core 는 인증을 모른다. 여기서 정한 값을 shared/auth 가 읽어 동작한다. (core 불가침)
 */

/**
 * 로그인 화면 경로. 아래 `loginPath` 와 `onSessionEnd` 두 곳에서 쓰므로 상수로 뺀다.
 * (객체 리터럴 안에서는 자기 자신의 다른 필드를 참조할 수 없다)
 */
const LOGIN_PATH = '/auth/login';

export const authConfig: AuthConfig = {
	/**
	 * 저장 전략. 서버 담당에게 이것만 물어보면 정해진다.
	 *
	 *   "로그인하면 refresh token 을 어떻게 주시나요?"
	 *
	 *     "Set-Cookie 로 내려줍니다 (httpOnly)"         → 'cookie'       ← 권장
	 *     "응답 body 에 refreshToken 으로 넣어드립니다"  → 'storage'
	 *     "refresh 는 없고 access 만 있습니다"           → 'access-only'
	 *
	 * `cookie` 가 가능한지부터 묻는다. 가능한데 안 쓰는 것과 불가능해서 못 쓰는 것은 다르다.
	 * 나머지 둘은 XSS 내성이 낮아, 고르면 개발 콘솔에 경고가 한 번 뜬다. (막지는 않는다)
	 */
	strategy: 'cookie',

	/**
	 * 인증 API 경로. baseURL(.env: VITE_API_BASE_URL) 뒤에 붙는다.
	 * 예) VITE_API_BASE_URL=/api + '/auth/login' → POST /api/auth/login
	 */
	endpoints: {
		login: '/auth/login',
		logout: '/auth/logout',
		refresh: '/auth/refresh',
		me: '/auth/me',
	},

	/**
	 * 응답에서 값을 꺼내는 함수. 서버 응답 키에 맞춰 고친다.
	 * 예) (body) => body.data.access_token
	 *
	 * ⚠️ `body.accessToken ?? body.token ?? …` 식으로 여러 키를 탐색하지 말 것.
	 *    서버가 응답을 바꿔도 조용히 다른 키를 집어 동작하는 척하고, 그때 나는 버그는
	 *    원인을 찾기 어렵다. **한 줄 적게 하려다 하루를 쓴다.**
	 *
	 * 요청 body 의 필드 구성은 여기가 아니라 프로젝트가 만드는 `ILoginCredentials` 가 정한다.
	 * login() 이 받은 객체를 그대로 보낸다. (가이드 2단계)
	 */
	extractAccessToken: (body) => body.accessToken,
	/** `storage` 전략에서만 쓰인다. `cookie` · `access-only` 에서는 호출되지 않는다. */
	extractRefreshToken: (body) => body.refreshToken,
	extractUser: (body) => body.user,

	/**
	 * 미인증 상태에서 보낼 **라우트** 경로. (HashRouter 라 실제 주소는 /#/auth/login)
	 *
	 * ⚠️ 위의 `endpoints.login` 과 **다른 것이다.** 이름이 비슷해 반드시 헷갈린다.
	 *    - endpoints.login : 서버 API 경로   (POST /api/auth/login)
	 *    - loginPath       : 화면 라우트 경로 (/#/auth/login)
	 *
	 * ⚠️ 이 경로의 화면은 **아직 없다.** 가이드 3단계에서 만들고 라우터에 등록한다.
	 *    만들기 전에 게이트만 켜면 로그인 화면 대신 404 로 튕긴다.
	 */
	loginPath: LOGIN_PATH,

	/**
	 * access token 저장소 키. (.env: VITE_LOCALSTORAGE_TOKEN_NAME)
	 *
	 * `storage` · `access-only` 전략에서만 쓰인다.
	 * `cookie` 전략에서는 access 가 메모리에만 있으므로 **쓰이지 않는다.**
	 * 지금 안 쓴다고 지우지 말 것 — 전략을 바꾸는 순간 되살려야 하고,
	 * 그 사이 각자 키를 하드코딩하게 된다.
	 */
	tokenStorageKey: import.meta.env.VITE_LOCALSTORAGE_TOKEN_NAME,

	// ── 확장 지점 ────────────────────────────────────────────────────────────

	/**
	 * 사용자에서 권한 목록을 꺼낸다. `<ProtectedRoute roles={['admin']} />` 가 쓴다.
	 *
	 * 서버가 배열로 준다면: (user) => (user.roles as string[]) ?? []
	 * 권한 가드를 안 쓰면 이 항목을 지워도 된다.
	 */
	resolveRoles: (user) => (user.role ? [String(user.role)] : []),

	/**
	 * 로그인 성공 직후. 이 시점에 토큰·상태는 이미 확정돼 있다.
	 *
	 * 프로젝트 고유의 후속 작업을 여기서 한다.
	 *   예) 메뉴·권한 조회, 최근 접속 기록 전송, 초기 마스터 데이터 프리페치
	 *
	 * 기본은 아무것도 하지 않는다. 필요 없으면 지운다.
	 */
	// onLoginSuccess: async (session) => {
	// 	await prefetchMenus(session);
	// },

	/**
	 * 세션이 끝났을 때. **이동과 안내를 여기서 한다.**
	 *
	 * shared/auth 는 라우터를 모른다. 그래서 이 콜백이 없으면 상태만 바뀌고 화면은 그대로다.
	 * (보호된 라우트에 있었다면 ProtectedRoute 가 알아서 내보내므로 그 경우엔 문제없다)
	 *
	 * 바꿔 쓰는 예)
	 *   - 만료 안내:  if (reason === 'expired') window.$ui?.alert('세션이 만료되었습니다.');
	 *   - SSO 로그아웃: window.location.href = 'https://sso.example.com/logout';
	 *   - 랜딩으로:   window.$router?.replace('/');
	 */
	onSessionEnd: () => {
		// push 가 아니라 replace 다. 뒤로가기로 로그아웃 직전 화면에 돌아가지 못하게 한다.
		window.$router?.replace(LOGIN_PATH);
	},
};
