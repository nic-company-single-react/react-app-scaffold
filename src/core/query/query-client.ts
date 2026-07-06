import { QueryClient, type DefaultOptions } from '@tanstack/react-query';

// 기본값의 단일 출처 (core 소유)
const defaultQueryConfig: DefaultOptions = {
	queries: {
		retry: 0,
		refetchOnWindowFocus: true,
		refetchOnReconnect: true,
		staleTime: 0,
		gcTime: 0,
	},
	mutations: {
		retry: 0,
	},
};

// 앱이 밀어넣은 override 읽기 (전역 저장: api 설정과 저장 위치 통일).
// MF 구조에서 원격 번들이 각자 모듈 인스턴스를 가져도 설정은 window 하나로 공유.
function getUserQueryConfig(): DefaultOptions {
	return (typeof window !== 'undefined' ? window.__MF_QUERY_CONFIG__ : undefined) ?? {};
}

// core 기본값 ⊕ 앱 override 키 단위 깊은 병합.
// override에 적힌 키만 덮어쓰고, 나머지는 기본값 유지.
function resolveDefaults(): DefaultOptions {
	const userQueryConfig = getUserQueryConfig();
	return {
		...defaultQueryConfig,
		...userQueryConfig,
		queries: {
			...defaultQueryConfig.queries,
			...userQueryConfig.queries,
		},
		mutations: {
			...defaultQueryConfig.mutations,
			...userQueryConfig.mutations,
		},
	};
}

/**
 * 앱 부팅 시 1회 호출해 Query 설정 override를 주입한다.
 * 첫 getQueryClient() 호출 전에 실행돼야 한다. (main.tsx에서 호출)
 */
export function initQueryConfig(override: DefaultOptions): void {
	window.__MF_QUERY_CONFIG__ = override;
}

export function makeQueryClient(): QueryClient {
	return new QueryClient({ defaultOptions: resolveDefaults() });
}

// QueryClient 인스턴스도 window 전역에 싱글톤으로 보관(api/query 설정과 저장 위치 통일).
// MF 구조에서 원격 번들이 각자 query-client 모듈을 번들링해도 QueryClient는 한 페이지에 하나만 공유됨.
// devtools 인식용 전역(__TANSTACK_QUERY_CLIENT__)과 동일 인스턴스이므로 그 키를 그대로 싱글톤 저장소로 재사용.
export function getQueryClient(): QueryClient {
	if (typeof window === 'undefined') {
		// 서버(SSR)에서는 요청마다 새 client — 전역 공유 금지.
		return makeQueryClient();
	}
	if (!window.__TANSTACK_QUERY_CLIENT__) {
		window.__TANSTACK_QUERY_CLIENT__ = makeQueryClient();
	}
	return window.__TANSTACK_QUERY_CLIENT__;
}
