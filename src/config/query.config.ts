import type { DefaultOptions } from '@tanstack/react-query';

/**
 * Query(캐시) 설정 override.
 *
 * 바꿀 키만 적으면 core 기본값을 덮어씁니다. 비워두면 core 기본값 그대로 사용.
 * (기본값 원본: core/query/query-client.ts 의 defaultQueryConfig)
 *
 * SI 프로젝트에서 캐시 정책을 바꿀 때는 이 파일만 수정하세요. (core 불가침)
 * 입력 예시 
 * queries: {
			retry: 0,
			refetchOnWindowFocus: true,
			refetchOnReconnect: true,
			staleTime: 0,
			gcTime: 0,
		},
		mutations: {
			retry: 0,
		},
 */
export const queryConfig: DefaultOptions = {
	queries: {
		// 예: staleTime: 5 * 60 * 1000,
	},
};
