import { useCallback, useState } from 'react';
import { authConfig } from '@/config';
import { ApiError } from '@/core/api';
import type { TAuthUser } from '@/types/auth';
import { login, logout as logoutAction } from './auth-flow';
import type { TAuthStatus } from './auth.store';
import { useAuthStore } from './auth.store';

/**
 * 화면이 쓰는 훅 셋 — **인증에서 화면이 알아야 할 전부.**
 *
 *   useAuth()    지금 누가 로그인해 있는가
 *   useLogin()   로그인 폼
 *   useLogout()  로그아웃 버튼
 *
 * 마크업은 전부 프로젝트 것이다. 이 훅들은 화면이 매번 다시 만들게 되는 것
 * (pending 관리 · 서버 에러 메시지 꺼내기 · 상태 구독)만 맡는다.
 *
 * `shared/auth` 에서 React 에 의존하는 파일은 여기 하나다. 나머지는 순수 로직이다.
 */

// ─────────────────────────────────────────────────────────────────────────────
// useAuth — 상태 읽기
// ─────────────────────────────────────────────────────────────────────────────

export interface IUseAuthResult<TUser> {
	/** `idle` · `refreshing` · `authenticated` · `anonymous` */
	status: TAuthStatus;
	/** 로그인한 사용자. 비로그인이면 null. */
	user: TUser | null;
	isAuthenticated: boolean;
	/** 갱신 중(부팅 복구 · 401 자동 갱신). 화면을 내보내면 안 되는 구간이다. */
	isRefreshing: boolean;
	/** 하나라도 가지고 있으면 true. `authConfig.resolveRoles` 가 권한을 꺼내는 방법을 정한다. */
	hasRole: (...roles: string[]) => boolean;
}

/**
 * 인증 상태를 읽는다.
 *
 * 사용자 타입은 프로젝트가 정한다. 스캐폴드는 사용자 객체의 내용을 모른다.
 *
 * @example
 * const { user, isAuthenticated } = useAuth<IAppUser>();
 * {isAuthenticated && <span>{user?.name}</span>}
 *
 * @example 권한에 따라 메뉴 감추기
 * const { hasRole } = useAuth();
 * {hasRole('admin') && <AdminMenu />}
 */
export function useAuth<TUser = TAuthUser>(): IUseAuthResult<TUser> {
	// 필드별로 구독한다. 통째로 구독하면 status 만 바뀌어도 user 를 그리는 화면이 리렌더된다.
	const status = useAuthStore((s) => s.status);
	const rawUser = useAuthStore((s) => s.user);

	const hasRole = useCallback(
		(...roles: string[]): boolean => {
			if (!rawUser || roles.length === 0) return false;

			if (!authConfig.resolveRoles) {
				if (import.meta.env.DEV) {
					console.error(
						'[auth] hasRole() 을 썼지만 authConfig.resolveRoles 가 없습니다. ' +
							'src/config/auth.config.ts 에 사용자에서 권한을 꺼내는 방법을 지정하세요.',
					);
				}
				return false;
			}

			const owned = authConfig.resolveRoles(rawUser);
			return roles.some((role) => owned.includes(role));
		},
		[rawUser],
	);

	return {
		status,
		user: rawUser as TUser | null,
		isAuthenticated: status === 'authenticated',
		isRefreshing: status === 'refreshing',
		hasRole,
	};
}

// ─────────────────────────────────────────────────────────────────────────────
// useLogin — 로그인 폼
// ─────────────────────────────────────────────────────────────────────────────

export interface IUseLoginOptions {
	/** 서버가 메시지를 안 줬을 때 보여줄 문구. */
	fallbackMessage?: string;
}

export interface IUseLoginResult {
	/** 자격 증명을 그대로 서버에 보낸다. 성공하면 true. */
	submit: (credentials: object) => Promise<boolean>;
	/** 요청 중. 성공 후에는 화면이 곧 바뀌므로 **true 로 유지된다**(이중 제출 방지). */
	pending: boolean;
	/** 실패 메시지. 서버가 준 message 를 그대로 쓴다. */
	error: string | null;
	/** 에러·진행 상태를 초기화한다. */
	reset: () => void;
}

/**
 * 로그인 폼용 훅.
 *
 * 성공 후 어디로 갈지는 **화면이 정한다.** 보통은 스토어의 status 를 보고 페이지가
 * `<Navigate>` 하면 되므로(예: LoginIndex) 여기서 이동시키지 않는다.
 *
 * @example
 * const { submit, pending, error } = useLogin();
 *
 * const onSubmit = async (e: FormEvent) => {
 *   e.preventDefault();
 *   await submit({ loginId, password });   // 필드 구성은 프로젝트가 정한다
 * };
 */
export function useLogin(options: IUseLoginOptions = {}): IUseLoginResult {
	const { fallbackMessage = '로그인에 실패했습니다.' } = options;

	const [pending, setPending] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const submit = useCallback(
		async (credentials: object): Promise<boolean> => {
			setError(null);
			setPending(true);

			try {
				await login(credentials);
				// 성공 시 pending 을 되돌리지 않는다. 곧 화면이 바뀌므로 버튼이 잠겨 있는 편이 낫다.
				return true;
			} catch (err) {
				// core 가 서버 응답의 message 를 ApiError.message 로 옮겨준다.
				setError(err instanceof ApiError ? err.message : fallbackMessage);
				setPending(false);
				return false;
			}
		},
		[fallbackMessage],
	);

	const reset = useCallback((): void => {
		setError(null);
		setPending(false);
	}, []);

	return { submit, pending, error, reset };
}

// ─────────────────────────────────────────────────────────────────────────────
// useLogout — 로그아웃 버튼
// ─────────────────────────────────────────────────────────────────────────────

export interface IUseLogoutResult {
	/** 서버에 알리고 로컬 세션을 정리한다. **실패해도 던지지 않는다.** */
	logout: () => Promise<void>;
	/** 요청 중. 성공 후에는 화면이 바뀌므로 true 로 유지된다. */
	pending: boolean;
}

/**
 * 로그아웃 훅.
 *
 * 어디로 이동할지는 `authConfig.onSessionEnd` 가 정한다. 이 훅은 진행 상태만 관리한다.
 *
 * @example
 * const { logout, pending } = useLogout();
 * <button onClick={logout} disabled={pending}>로그아웃</button>
 */
export function useLogout(): IUseLogoutResult {
	const [pending, setPending] = useState(false);

	const doLogout = useCallback(async (): Promise<void> => {
		setPending(true);
		// logoutAction 은 서버 호출이 실패해도 던지지 않는다. 화면은 항상 로그아웃된다.
		await logoutAction();
	}, []);

	return { logout: doLogout, pending };
}
