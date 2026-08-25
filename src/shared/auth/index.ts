/**
 * 인증 모듈의 공개 입구.
 *
 * 화면과 부팅 코드는 **이 파일에 있는 것만** 쓴다. 여기에 없는 것(전략 · 인터셉터 내부 ·
 * 세션 정리 · 토큰 쓰기)은 모듈 내부 사정이라 직접 부르면 안 된다.
 *
 * 동작을 바꾸고 싶으면 코드가 아니라 `src/config/auth.config.ts` 를 고친다.
 * 자세한 사용법은 같은 폴더의 README.md.
 *
 * ── 파일 지도 ──────────────────────────────────────────────────────────────
 *   config/auth.config.ts   설정 · 확장 지점              ← 프로젝트가 고치는 곳
 *   auth-flow.ts            부팅 · 로그인 · 로그아웃 · 갱신 · 정리 · 탭동기화
 *   auth-api.ts             서버 호출 (엔드포인트 · 응답 매핑)
 *   auth-strategies.ts      저장 전략 3벌 + 토큰 보관
 *   auth-interceptor.ts     Bearer 주입 · 401 → 갱신 → 재시도
 *   auth-hooks.ts           useAuth · useLogin · useLogout
 *   auth.store.ts           status · user
 *   ProtectedRoute.tsx      라우트 게이트
 *   dev-probe.ts            콘솔 확인용 (dev 전용)
 */

// ── 화면에서 쓰는 것 ──────────────────────────────────────────────────────────
export { useAuth, useLogin, useLogout } from './auth-hooks';
export type { IUseAuthResult, IUseLoginOptions, IUseLoginResult, IUseLogoutResult } from './auth-hooks';

export { default as ProtectedRoute } from './ProtectedRoute';
export type { IProtectedRouteProps } from './ProtectedRoute';

// ── React 밖에서 인증 동작이 필요할 때 (이벤트 핸들러 · 유틸 등) ───────────────
// 화면 안에서는 위의 훅을 쓰는 편이 낫다. 훅이 pending·에러까지 같이 관리한다.
export { login, logout } from './auth-flow';

// ── 스토어 직접 접근 (고급) ───────────────────────────────────────────────────
// 컴포넌트 밖(모듈 스코프 함수)에서 상태를 읽어야 할 때만 쓴다: useAuthStore.getState()
export { useAuthStore } from './auth.store';
export type { TAuthStatus } from './auth.store';

// ── 부팅 배선 (main.tsx 에서 1회) ─────────────────────────────────────────────
// 인증을 쓰지 않는 프로젝트는 이 셋을 main.tsx 에서 주석 처리한다.
export { bootAuth, setupTabSync } from './auth-flow';
export { setupAuthInterceptor } from './auth-interceptor';

// ── 토큰 읽기 ────────────────────────────────────────────────────────────────
// 파일 다운로드 URL 이나 WebSocket 처럼 axios 를 안 타는 경로에서 필요할 때만.
//
// ⚠️ 쓰기는 일부러 내보내지 않는다. 토큰의 보관 위치는 전략이 단독으로 결정한다.
//    밖에서 직접 쓰면 전략과 어긋나 저장소에 옛 값이 남는다.
//    로그인 · 로그아웃은 login() · logout() 을 쓴다.
export { getAccessToken } from './auth-strategies';
