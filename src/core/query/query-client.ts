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

// 앱이 밀어넣은 override 저장 (push 방식)
let userQueryConfig: DefaultOptions = {};

// core 기본값 ⊕ 앱 override 키 단위 깊은 병합.
// override에 적힌 키만 덮어쓰고, 나머지는 기본값 유지.
function resolveDefaults(): DefaultOptions {
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
	userQueryConfig = override;
}

export function makeQueryClient(): QueryClient {
	return new QueryClient({ defaultOptions: resolveDefaults() });
}

// SPA면 let에 설정을 저장해도 되지만 MF구조라면 window 전역으로 빼서 저장하는것도 고려 필요.
let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
