import type { DefaultOptions } from '@tanstack/react-query';

/**
 * Query(캐시) 설정 override.
 *
 * 여기에 적은 키만 core 기본값(defaultQueryConfig)을 덮어씁니다.
 * 적지 않은 키는 core 기본값을 그대로 사용합니다.
 *
 * SI 프로젝트에서 캐시 정책을 바꿀 때는 이 파일만 수정하세요. (core 불가침)
 */
export const queryConfig: DefaultOptions = {
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
