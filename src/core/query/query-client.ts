import { QueryClient, type DefaultOptions } from '@tanstack/react-query';
import { queryConfig } from '@/config';

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

// core 기본값 ⊕ SI override(src/config) 키 단위 깊은 병합.
// queryConfig에 적힌 키만 덮어쓰고, 나머지는 기본값 유지.
const mergedDefaults: DefaultOptions = {
	...defaultQueryConfig,
	...queryConfig,
	queries: {
		...defaultQueryConfig.queries,
		...queryConfig.queries,
	},
	mutations: {
		...defaultQueryConfig.mutations,
		...queryConfig.mutations,
	},
};

export function makeQueryClient(): QueryClient {
	return new QueryClient({ defaultOptions: mergedDefaults });
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(): QueryClient {
	if (typeof window === 'undefined') {
		return makeQueryClient();
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient();
	return browserQueryClient;
}
