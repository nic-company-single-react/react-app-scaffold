import { QueryClient, type DefaultOptions, type QueryClientConfig } from '@tanstack/react-query';

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

export function makeQueryClient(config?: QueryClientConfig): QueryClient {
	const userDefaults = config?.defaultOptions ?? {};
	return new QueryClient({
		...config,
		defaultOptions: {
			...defaultQueryConfig,
			...userDefaults,
			queries: {
				...defaultQueryConfig.queries,
				...userDefaults.queries,       // staleTime만 넘기면 나머지 기본값 유지
			},
			mutations: {
				...defaultQueryConfig.mutations,
				...userDefaults.mutations,
			},
		},
	});
}

let browserQueryClient: QueryClient | undefined = undefined;

export function getQueryClient(config?: QueryClientConfig): QueryClient {
	if (typeof window === 'undefined') {
		return makeQueryClient(config);
	}
	if (!browserQueryClient) browserQueryClient = makeQueryClient(config);
	return browserQueryClient;
}
