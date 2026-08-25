import { authConfig } from '@/config';
import type { IAuthSession, TAuthUser } from '@/types/auth';
import { requestRefresh } from './auth-api';

/**
 * 저장 전략 — **access·refresh 를 어디에 두고 어떻게 갱신하는가.**
 *
 * 이 파일 하나가 그 답을 전부 갖는다. 순서대로 읽으면 된다.
 *   1) 토큰 보관     메모리 변수 (읽기는 언제나 여기)
 *   2) 전략 계약     IAuthStrategy — 전략이 갈리는 지점 6개
 *   3) cookie        기본 · 권장
 *   4) storage 계열  storage · access-only
 *   5) 선택기        설정의 이름 → 구현
 *
 * ⚠️ **거의 열 일이 없는 파일이다.** 프로젝트가 하는 일은 `auth.config.ts` 에서
 *    `strategy` 이름 하나를 고르는 것뿐이다. 전략을 직접 만들 필요가 없도록
 *    `IAuthStrategy` 를 밖으로 내보내지 않는다 — 내보내는 순간 "만들어도 된다"는 신호가 된다.
 *    **전략은 코드가 아니라 선택지여야 한다.**
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1) 토큰 보관
// ─────────────────────────────────────────────────────────────────────────────

/**
 * access token 은 메모리 변수에 둔다.
 *
 * core(api)는 토큰을 알지 못한다. 여기 담아두면 요청 인터셉터가 매 요청마다 꺼내
 * Authorization 헤더로 붙인다.
 *
 * `storage` 계열도 **읽기는 언제나 메모리다.** 저장소는 persist 에서 쓰고
 * loadOnBoot 에서 부팅 1회만 읽는다. 그래야 저장소에 남은 옛 값이 갱신 결과를 덮어쓰지 않는다.
 */
let memoryToken: string | null = null;

/** 현재 access token. 요청 인터셉터가 매 요청마다 부른다. */
export function getAccessToken(): string | null {
	return memoryToken;
}

/**
 * ⚠️ 전략만 부른다. 밖에서 직접 부르면 저장소와 어긋나 옛 값이 남는다.
 *    로그인·로그아웃은 login() · logout() 을 쓴다. (그래서 index.ts 에서 내보내지 않는다)
 */
function setAccessToken(token: string | null): void {
	memoryToken = token;
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) 전략 계약
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 전략이 갈리는 지점은 아래 여섯 개가 전부다.
 * 그래서 전략이 늘어도 인터셉터 · 게이트 · 스토어 · 화면은 하나도 바뀌지 않는다.
 */
interface IAuthStrategy {
	/**
	 * 갱신을 지원하는가. **401 인터셉터가 전략에게 묻는 유일한 질문이다.**
	 * false 면 갱신을 시도하지 않고 바로 정리 → 로그인 화면. (`access-only`)
	 */
	supportsRefresh: boolean;

	/**
	 * 부팅 시 세션 복구. 렌더 전에 1회 호출된다.
	 * 복구 실패는 **"비로그인"이지 "오류"가 아니다.** throw 하지 않고 null 을 돌려준다.
	 */
	loadOnBoot: () => Promise<IAuthSession | null>;

	/** 로그인 · 갱신 성공 후 보관. **저장 위치는 전략이 단독으로 결정한다.** */
	persist: (session: IAuthSession) => void;

	/** 갱신 요청. 실패는 throw. 동시 호출을 묶는 일(single-flight)은 auth-flow 가 한다. */
	refresh: () => Promise<IAuthSession>;

	/** 로그아웃 · 갱신 최종 실패 시 정리. */
	clear: () => void;

	/** 서버에 보낼 refresh token. `cookie` 는 undefined(브라우저가 싣는다). */
	getRefreshToken: () => string | undefined;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) cookie 전략 (기본 · 권장)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * - access  : **메모리에만** 둔다. 새 탭·다음 방문에 남지 않고, 어차피 곧 만료된다.
 * - refresh : 브라우저가 갖는다. httpOnly 라 JS 가 읽지 못하고 XSS 로도 꺼낼 수 없다.
 *
 * **쿠키를 다루는 코드가 한 줄도 없다.** 브라우저가 알아서 싣고, 필요한 설정은
 * `src/config/api.config.ts` 의 `withCredentials: true` 하나가 전부다.
 * 나머지(HttpOnly · SameSite · Path · Secure)는 서버가 정한다.
 */
const cookieStrategy: IAuthStrategy = {
	supportsRefresh: true,

	persist: (session) => setAccessToken(session.accessToken),

	clear: () => setAccessToken(null),

	// httpOnly 쿠키는 JS 가 못 읽는다. 그게 이 전략의 장점이고, 못 읽어도 문제가 없다.
	getRefreshToken: () => undefined,

	// body 를 보내지 않는다 — 쿠키가 자동으로 실려 간다.
	refresh: async () => {
		const session = await requestRefresh();
		cookieStrategy.persist(session);
		return session;
	},

	/**
	 * 메모리는 비어 있고 쿠키는 살아 있을 수 있다. 갱신 1회로 확인한다.
	 * 실패 원인(쿠키 없음 · 만료 · 서버 다운)을 구분하지 않는다 —
	 * 어느 쪽이든 화면이 할 일은 로그인 화면을 보여주는 것으로 같다.
	 */
	loadOnBoot: async () => {
		try {
			return await cookieStrategy.refresh();
		} catch {
			return null;
		}
	},
};

// ─────────────────────────────────────────────────────────────────────────────
// 4) storage · access-only 전략
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 둘은 **401 을 받았을 때의 행동이 정반대**다(갱신 시도 vs 즉시 로그아웃).
 * 그 차이만 `supportsRefresh` 로 갈리고 나머지는 공유한다.
 *
 * ⚠️ 명백한 하향이다. access 는 짧지만 refresh 는 2주다 — XSS 한 번이 2주짜리 접근권이 된다.
 *    그럼에도 지원하는 이유는, 서버가 쿠키를 안 준다면 프론트 혼자서는 시작조차 못 하기 때문이다.
 *
 * 저장 구조 — .env 의 VITE_LOCALSTORAGE_TOKEN_NAME 하나에서 세 키를 파생시킨다.
 *   <key>          access token
 *   <key>_refresh  refresh token   (access-only 는 안 쓴다)
 *   <key>_user     사용자 JSON     (부팅 복원 때 이름을 되살리려고)
 */

// .env 를 비워둔 프로젝트가 있어(주석에 "미사용 시 공백처리") 키가 빈 문자열이 되지 않게 막는다.
const BASE_KEY = authConfig.tokenStorageKey || 'access_token';
const ACCESS_KEY = BASE_KEY;
const REFRESH_KEY = `${BASE_KEY}_refresh`;
const USER_KEY = `${BASE_KEY}_user`;

const read = (key: string): string | null => {
	try {
		return localStorage.getItem(key);
	} catch {
		return null;
	}
};

const write = (key: string, value: string): void => {
	try {
		localStorage.setItem(key, value);
	} catch {
		// 저장 실패(사파리 프라이빗 등)는 무시한다. 메모리로는 계속 동작한다.
	}
};

const remove = (key: string): void => {
	try {
		localStorage.removeItem(key);
	} catch {
		/* 무시 */
	}
};

const readUser = (): TAuthUser | undefined => {
	const raw = read(USER_KEY);
	if (!raw) return undefined;
	try {
		return JSON.parse(raw) as TAuthUser;
	} catch {
		return undefined;
	}
};

const storagePersist = (session: IAuthSession): void => {
	setAccessToken(session.accessToken);
	write(ACCESS_KEY, session.accessToken);

	// 회전하지 않는 서버는 갱신 응답에 refreshToken 을 안 준다. 그때 옛 값을 지우면 안 된다.
	if (session.refreshToken) write(REFRESH_KEY, session.refreshToken);
	if (session.user) write(USER_KEY, JSON.stringify(session.user));
};

const storageClear = (): void => {
	setAccessToken(null);
	remove(ACCESS_KEY);
	remove(REFRESH_KEY);
	remove(USER_KEY);
};

const storageGetRefreshToken = (): string | undefined => read(REFRESH_KEY) ?? undefined;

/** 갱신. 쿠키와 달리 보관하던 refresh 를 **body 에 실어** 보낸다. */
const storageRefresh = async (): Promise<IAuthSession> => {
	const session = await requestRefresh(storageGetRefreshToken());
	storagePersist(session);
	return session;
};

/**
 * 부팅 복구 — **네트워크를 타지 않는다.**
 *
 * 저장소에 access 가 있으면 그대로 메모리에 되살린다. 만료된 값이어도 상관없다.
 * 첫 요청이 401 을 받고 인터셉터가 갱신해준다. 부팅에서 미리 확인할 이유가 없다.
 */
const storageLoadOnBoot = async (canRefresh: boolean): Promise<IAuthSession | null> => {
	const accessToken = read(ACCESS_KEY);

	if (accessToken) {
		setAccessToken(accessToken);
		return { accessToken, refreshToken: storageGetRefreshToken(), user: readUser() };
	}

	// access 는 없는데 refresh 가 남은 경우(저장소가 부분적으로 지워졌거나 만료 정리된 경우).
	if (canRefresh && storageGetRefreshToken()) {
		try {
			return await storageRefresh();
		} catch {
			storageClear();
			return null;
		}
	}

	return null;
};

const storageStrategy: IAuthStrategy = {
	supportsRefresh: true,
	loadOnBoot: () => storageLoadOnBoot(true),
	persist: storagePersist,
	refresh: storageRefresh,
	clear: storageClear,
	getRefreshToken: storageGetRefreshToken,
};

const accessOnlyStrategy: IAuthStrategy = {
	// ★ 이 한 줄이 401 의 행동을 뒤집는다. 인터셉터가 갱신 없이 바로 정리 → 로그인 화면.
	supportsRefresh: false,
	loadOnBoot: () => storageLoadOnBoot(false),
	persist: storagePersist,
	// supportsRefresh 가 false 라 인터셉터는 부르지 않는다. 그래도 조용히 성공하지 않게 막아둔다.
	refresh: () => Promise.reject(new Error('[auth] access-only 전략은 갱신을 지원하지 않습니다.')),
	clear: storageClear,
	getRefreshToken: () => undefined,
};

// ─────────────────────────────────────────────────────────────────────────────
// 5) 선택기
// ─────────────────────────────────────────────────────────────────────────────

/** 하향 경고는 세션당 한 번만 띄운다. 매 갱신마다 찍히면 콘솔이 못 쓰게 된다. */
let warned = false;

/**
 * `storage` · `access-only` 는 XSS 내성이 낮다.
 *
 * **막지는 않는다** — 서버가 쿠키를 안 준다면 다른 방법이 없다. 다만 "이건 차선책이고 왜 그런지"를
 * 그 구성을 고른 사람이 한 번은 읽게 한다. 운영 빌드에서는 나오지 않는다.
 */
function warnDowngrade(strategy: string): void {
	if (!import.meta.env.DEV || warned) return;
	warned = true;
	console.warn(
		`[auth] strategy: '${strategy}' 는 토큰을 localStorage 에 둡니다. XSS 가 한 번 나면 그대로 노출됩니다.\n` +
			`       서버가 refresh 를 httpOnly 쿠키(Set-Cookie)로 줄 수 있다면 'cookie' 가 안전합니다.\n` +
			`       (src/config/auth.config.ts 의 strategy)`,
	);
}

/**
 * 설정의 이름 → 구현.
 *
 * 여기가 **전략을 아는 유일한 곳**이다. 나머지 코드는 IAuthStrategy 만 본다.
 */
export function getAuthStrategy(): IAuthStrategy {
	switch (authConfig.strategy) {
		case 'cookie':
			return cookieStrategy;

		case 'storage':
			warnDowngrade(authConfig.strategy);
			return storageStrategy;

		case 'access-only':
			warnDowngrade(authConfig.strategy);
			return accessOnlyStrategy;
	}
}
