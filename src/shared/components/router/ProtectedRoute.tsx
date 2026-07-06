// access token 체크를 통해 라우터 이동전 로그인 상태 체크
import { Navigate, Outlet } from 'react-router';
import { authConfig } from '@/config';

// 라우터 페이지 이동 시 token 인증처리 컴포넌트
// token 인증처리 관련 로직은 상황에 따라 변경하여 사용합니다.
const ProtectedRoute = () => {
	const token = localStorage.getItem(authConfig.tokenStorageKey);
	return token ? (
		<Outlet />
	) : (
		<Navigate
			to={authConfig.loginPath}
			replace
		/>
	);
};

export default ProtectedRoute;
