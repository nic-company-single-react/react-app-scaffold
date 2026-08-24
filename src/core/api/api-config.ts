import type { ApiLibConfig } from '@/types/api';

export type { ApiLibConfig };

export const initApiConfig = (config: ApiLibConfig): void => {
	// 앱의 apiConfig설정값이 달라지는 경우가 있어서 전역에 저장하여 하나로 활용.
	window.__MF_APP_CONFIG__ = { ...(window.__MF_APP_CONFIG__ ?? {}), ...config };
};

export const getApiConfig = (): ApiLibConfig => {
	const stored = window.__MF_APP_CONFIG__ ?? {};
	return {
		...stored,
		baseURL: stored.baseURL ?? window.location.origin,
		timeout: stored.timeout ?? 30000,
	};
};
