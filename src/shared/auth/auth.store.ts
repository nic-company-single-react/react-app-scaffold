import { defineStore } from '@axiom/store';
import type { TAuthUser } from '@/types/auth';

/**
 * 인증 상태.
 *
 * | 값 | 뜻 | 언제 |
 * |---|---|---|
 * | `idle`          | 아직 아무것도 안 했다 | 부팅 직후. 인증을 끈 프로젝트는 계속 여기 머문다 |
 * | `refreshing`    | 갱신 중              | 부팅 복구 · 401 자동 갱신 |
 * | `authenticated` | 로그인됨             | access 를 갖고 있다 |
 * | `anonymous`     | 비로그인             | 갱신 실패 · 로그아웃 |
 */
export type TAuthStatus = 'idle' | 'refreshing' | 'authenticated' | 'anonymous';

/**
 * 인증 상태 스토어 (앱 전역 1개).
 *
 * 로그인 · 로그아웃 · 부팅 복구 · 401 인터셉터가 **같은 상태**를 본다.
 *
 * - 컴포넌트에서:  `const status = useAuthStore((s) => s.status);`
 * - 모듈 함수에서: `useAuthStore.getState().setAnonymous();`
 *   (인터셉터·전략처럼 React 밖에서 도는 코드가 이 경로를 쓴다)
 *
 * ⚠️ **persist 를 켜지 않는다.** 상태를 저장소에 남기면 새로고침 직후
 *    토큰은 없는데 status 만 `authenticated` 인 순간이 생기고, 그 사이 자식 화면들이
 *    토큰 없이 API 를 쏜다. 새로고침 유지는 저장소가 아니라 **부팅 갱신(S7)이** 담당한다.
 *    상태는 토큰을 따라가야지 토큰보다 오래 살면 안 된다.
 */
export const useAuthStore = defineStore({
	name: 'auth',
	state: {
		status: 'idle' as TAuthStatus,
		user: null as TAuthUser | null,
	},
	// 액션의 첫 인자 state 는 defineStore 가 자동 주입한다(immer draft).
	// → 정의는 (state, user) 지만 호출은 setAuthenticated(user) 다.
	actions: {
		/** 갱신 시작. 부팅 복구와 401 자동 갱신이 부른다. */
		setRefreshing: (state) => {
			state.status = 'refreshing';
		},

		/** 로그인 · 갱신 성공. */
		setAuthenticated: (state, user?: TAuthUser | null) => {
			state.status = 'authenticated';
			// 갱신 응답에 사용자가 없는 서버도 있다(extractUser 가 undefined 를 돌려준다).
			// 그때 기존 값을 지우면 화면에 떠 있던 사용자 이름이 갑자기 사라진다.
			// **있을 때만** 덮어쓴다.
			if (user) state.user = user;
		},

		/** 로그아웃 · 갱신 최종 실패. 사용자 정보까지 지운다. */
		setAnonymous: (state) => {
			state.status = 'anonymous';
			state.user = null;
		},
	},
});
