import { Navigate, Outlet, useLocation } from 'react-router';
import { authConfig } from '@/config';
import { useAuth } from './auth-hooks';

export interface IProtectedRouteProps {
	/**
	 * 이 중 **하나라도** 가진 사용자만 통과시킨다. 생략하면 로그인 여부만 본다.
	 *
	 * 사용자 객체에서 권한을 꺼내는 방법은 `authConfig.resolveRoles` 가 정한다.
	 * 그 함수가 없으면 막는 쪽으로 동작한다 — 가드가 조용히 열려 있는 것보다 낫다.
	 */
	roles?: string[];
	/** 권한이 부족할 때 보낼 경로. 기본은 홈. */
	forbiddenPath?: string;
}

/**
 * 라우트 게이트.
 *
 * 부팅 복구(shared/auth/boot-auth)가 createRoot() 전에 끝나 있으므로
 * **여기서 서버에 다시 묻지 않는다.** 스토어의 status 만 본다.
 *
 * @example 로그인만 확인
 * { element: <ProtectedRoute />, children: [...] }
 *
 * @example 권한까지 확인
 * { element: <ProtectedRoute roles={['admin']} />, children: [...] }
 */
export default function ProtectedRoute({ roles, forbiddenPath = '/' }: IProtectedRouteProps): React.ReactNode {
	const { status, hasRole } = useAuth();
	const location = useLocation();

	// `refreshing` 도 통과시킨다.
	// 이 상태는 401 자동 갱신 중이라는 뜻이고, 갱신을 시작했다는 건 직전까지 로그인 상태였다는 뜻이다.
	// 여기서 내보내면 **갱신이 성공해도 사용자는 로그인 화면에 가 있게 된다.**
	// (부팅 중의 refreshing 은 아직 렌더 전이라 여기까지 오지 않는다)
	if (status !== 'authenticated' && status !== 'refreshing') {
		// state.from 은 로그인 성공 후 원래 가려던 곳으로 되돌리는 데 쓴다.
		return (
			<Navigate
				to={authConfig.loginPath}
				state={{ from: location }}
				replace
			/>
		);
	}

	// 로그인은 했지만 권한이 없는 경우. 로그인 화면으로 보내면 "다시 로그인하면 되나?"로 읽혀
	// 사용자가 같은 자리를 맴돈다. 그래서 로그인 화면이 아니라 접근 가능한 곳으로 보낸다.
	if (roles && roles.length > 0 && !hasRole(...roles)) {
		return (
			<Navigate
				to={forbiddenPath}
				replace
			/>
		);
	}

	return <Outlet />;
}
