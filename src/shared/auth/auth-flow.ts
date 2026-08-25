import { authConfig } from '@/config';
import { getQueryClient } from '@/core/query';
import type { IAuthSession, TSessionEndReason } from '@/types/auth';
import { requestLogin, requestLogout } from './auth-api';
import { getAuthStrategy } from './auth-strategies';
import { useAuthStore } from './auth.store';

/**
 * 세션 생애주기 — **인증에서 무슨 일이 언제 일어나는가.**
 *
 * 인증을 처음 파악한다면 `auth.config.ts` 다음으로 이 파일을 읽으면 된다.
 * 위에서 아래로 순서대로다.
 *   1) 세션 정리   clearSession
 *   2) 갱신        refreshSession (single-flight)
 *   3) 부팅 복구   bootAuth
 *   4) 로그인/로그아웃
 *   5) 탭 동기화
 *
 * **이 파일은 라우터를 모른다.** 이동과 안내는 전부 `authConfig.onSessionEnd` 로 넘긴다.
 * 어디로 보낼지는 프로젝트 정책이고, 로직이 전역 라우터에 매이면 이식도 테스트도 막힌다.
 */

// ─────────────────────────────────────────────────────────────────────────────
// 1) 세션 정리
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 세션을 끝낸다. 로그아웃 · 갱신 최종 실패 · 다른 탭의 로그아웃이 전부 이 함수를 쓴다.
 *
 * 정리 셋을 반드시 같이 한다. 하나라도 빠지면 증상이 다르게 나온다.
 *   - 토큰만 지우면    → 화면은 로그인 상태인 채로 모든 요청이 401
 *   - 상태만 바꾸면    → 메모리에 옛 토큰이 남아 다음 요청에 실려 나간다
 *   - 캐시를 안 지우면 → **다음 사용자 화면에 이전 사용자의 데이터가 그대로 보인다**
 *
 * 다른 탭에 알리는 것은 여기서 하지 않는다(로그아웃만 전파한다 — 아래 5번).
 * 신호를 여기서 보내면 신호를 받은 탭이 다시 신호를 보내 반향이 생긴다.
 */
export function clearSession(reason: TSessionEndReason): void {
	getAuthStrategy().clear();
	getQueryClient().clear();
	useAuthStore.getState().setAnonymous();

	// 상태를 다 정리한 **뒤에** 부른다. 콜백이 화면을 옮길 때 이미 비로그인 상태여야 한다.
	authConfig.onSessionEnd?.(reason);
}

// ─────────────────────────────────────────────────────────────────────────────
// 2) 갱신 — single-flight
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 진행 중인 갱신을 담아둔다.
 *
 * 화면 하나가 API 다섯 개를 동시에 쏘면 401 이 다섯 개 온다. 각자 갱신하면 refresh 요청이
 * 다섯 개 나가고, **회전하는 서버에서는 넷이 재사용 감지에 걸려 계정 전체가 폐기된다.**
 *
 * ⚠️ 이 방어는 **탭 단위**다. 탭이 둘 이상이면 동시 갱신을 막을 수 없으므로
 *    서버가 직전 refresh 를 몇 초간 유예해줘야 한다. (README "서버에 요구할 것" 4번)
 */
let inflightRefresh: Promise<IAuthSession> | null = null;

/** 갱신 1회. 동시에 여러 번 불려도 요청은 하나만 나간다. */
export function refreshSession(): Promise<IAuthSession> {
	if (!inflightRefresh) {
		const { setRefreshing, setAuthenticated } = useAuthStore.getState();
		setRefreshing();

		inflightRefresh = getAuthStrategy()
			.refresh()
			.then((session) => {
				setAuthenticated(session.user);
				return session;
			})
			.finally(() => {
				// 성공이든 실패든 비운다. 남겨두면 만료된 결과를 계속 돌려주게 된다.
				inflightRefresh = null;
			});
	}
	return inflightRefresh;
}

// ─────────────────────────────────────────────────────────────────────────────
// 3) 부팅 복구
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 진행 중인 부팅을 담아둔다.
 *
 * `main.tsx` 는 모듈이 한 번만 평가되므로 원래 두 번 불릴 일이 없다. 그래도 담아두는 이유는,
 * 나중에 누군가 이 함수를 컴포넌트에서 부르면 **회전 서버에서 계정이 통째로 폐기되기** 때문이다.
 *
 * 불리언이 아니라 Promise 를 담는다. 두 번째 호출자가 "이미 했다"며 즉시 반환받으면
 * 아직 복구가 안 끝난 상태에서 렌더가 시작된다. Promise 를 돌려주면 같이 기다린다.
 */
let bootPromise: Promise<void> | null = null;

async function runBoot(): Promise<void> {
	// 액션은 스토어가 만들어질 때 한 번 생성되고 교체되지 않으므로, 여기서 꺼내 써도 항상 최신이다.
	const { setRefreshing, setAuthenticated, setAnonymous } = useAuthStore.getState();

	setRefreshing();

	try {
		const session = await getAuthStrategy().loadOnBoot();

		if (session) setAuthenticated(session.user);
		else setAnonymous();
	} catch (error) {
		// loadOnBoot 은 실패를 null 로 접기로 계약돼 있지만, 전략 선택 자체가 던질 수도 있다.
		// **어느 쪽이든 렌더는 반드시 한다.** 여기서 다시 던지면 스플래시에서 영원히 멈춘다.
		if (import.meta.env.DEV) console.error('[auth] 부팅 복구 실패', error);
		setAnonymous();
	}
}

/**
 * 부팅 복구 — 앱 생애 **1회**. `main.tsx` 가 `createRoot()` **전에** await 한다.
 *
 * 렌더를 미루는 동안 `index.html` 의 `#app-splash` 가 그대로 떠 있으므로
 * (그 div 는 `#root` 안에 있고 render 가 통째로 교체한다) 로딩 화면을 따로 만들 필요가 없다.
 *
 * 이 왕복이 없으면 두 가지가 동시에 깨진다.
 *   - 대시보드를 먼저 그리면 → 자식 화면들이 토큰 없이 API 를 쏜다
 *   - 로그인 화면을 먼저 그리면 → 정상 사용자가 새로고침할 때마다 로그인 화면이 번쩍인다
 *
 * 전략에 따라 안에서 하는 일이 다르다(`cookie` 는 갱신 1회, `storage` 계열은 저장소 복원).
 * 이 함수는 그 차이를 모른다.
 */
export function bootAuth(): Promise<void> {
	if (!bootPromise) bootPromise = runBoot();
	return bootPromise;
}

// ─────────────────────────────────────────────────────────────────────────────
// 4) 로그인 · 로그아웃
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 로그인.
 *
 * `credentials` 는 **받은 그대로 요청 body 가 된다.** 스캐폴드는 그 형태를 모른다.
 *   login({ loginId, password })
 *   login({ companyCode, empNo, password, otp })
 *
 * 실패는 **삼키지 않고 그대로 던진다.** 비밀번호를 틀렸을 때 화면이 에러 메시지를
 * 보여줘야 하기 때문이다. (여기서 삼키면 아무 반응이 없다)
 *
 * 화면에서는 보통 `useLogin()` 훅을 쓴다. 훅이 pending·에러 메시지까지 같이 관리한다.
 */
export async function login(credentials: object): Promise<void> {
	const session = await requestLogin(credentials);

	getAuthStrategy().persist(session);
	useAuthStore.getState().setAuthenticated(session.user);

	// 프로젝트 고유의 후속 작업(메뉴 조회 · 프리페치 등). 설정에 없으면 아무 일도 없다.
	await authConfig.onLoginSuccess?.(session);
}

/**
 * 로그아웃.
 *
 * 서버 호출이 **실패해도 클라이언트는 로그아웃한다.** 서버가 죽었을 때 로그아웃 버튼이
 * 안 먹으면 그 화면에서 나갈 방법이 없다. 그래서 정리는 finally 에 둔다.
 *
 * 클라이언트에서 토큰만 지우는 로그아웃은 "내 화면에서 안 보이게 하는 것"이지 로그아웃이 아니다.
 * 그 값을 복사해 둔 사람에게는 아무 일도 일어나지 않는다. 그래서 서버를 먼저 부른다.
 */
export async function logout(): Promise<void> {
	try {
		// cookie 전략은 undefined → 쿠키가 자동으로 실린다.
		await requestLogout(getAuthStrategy().getRefreshToken());
	} catch {
		// 삼킨다. 위 주석 참고.
	} finally {
		clearSession('logout');
		broadcastLogout();
	}
}

// ─────────────────────────────────────────────────────────────────────────────
// 5) 탭 간 동기화
// ─────────────────────────────────────────────────────────────────────────────

/**
 * 한 탭에서 로그아웃해도 다른 탭은 모른다. access 가 메모리에 있으니 그 탭의 토큰은
 * 만료될 때까지 멀쩡히 동작한다.
 *
 * localStorage 에 **토큰이 아니라 신호만** 쓴다. 값에는 의미가 없고,
 * `storage` 이벤트가 **다른 탭에서만** 발생한다는 성질만 쓴다.
 * (BroadcastChannel 이 더 깔끔하지만 구형 WebView 지원이 갈려 쓰지 않았다)
 */
const SYNC_KEY = '__auth_sync__';

/** 다른 탭에 "로그아웃했다"를 알린다. 매번 값이 달라야 이벤트가 발생하므로 타임스탬프를 붙인다. */
function broadcastLogout(): void {
	try {
		localStorage.setItem(SYNC_KEY, `logout:${Date.now()}`);
	} catch {
		// 저장 실패는 무시한다. 동기화가 안 될 뿐 이 탭의 로그아웃은 이미 끝났다.
	}
}

/**
 * 다른 탭의 신호를 받는다. 부팅 시 1회 등록한다.
 *
 * **명시적 로그아웃만 전파한다.** 갱신 실패(`expired`)까지 전파하면 일시적인 네트워크 오류로
 * 한 탭이 실패했을 때 멀쩡한 다른 탭까지 로그아웃된다. 그 탭들도 자기 요청이 401 을 받는
 * 순간 스스로 알게 되므로 손해만 보는 거래다.
 *
 * @returns 해제 함수. 앱이 살아 있는 동안 계속 듣기 때문에 보통 쓸 일은 없다.
 */
export function setupTabSync(): () => void {
	const onStorage = (event: StorageEvent): void => {
		if (event.key !== SYNC_KEY || !event.newValue) return;

		// 이미 비로그인인 탭은 할 일이 없다. (로그인 화면에서 헛되이 이동하지 않게)
		if (useAuthStore.getState().status === 'anonymous') return;

		// 신호를 되쏘지 않는다. 받은 탭이 다시 보내면 탭 수만큼 반향이 생긴다.
		clearSession('other-tab');
	};

	window.addEventListener('storage', onStorage);
	return () => window.removeEventListener('storage', onStorage);
}
