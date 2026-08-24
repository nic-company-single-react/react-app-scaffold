import type { ApiLibConfig } from '@/types/api';

/**
 * REST API 설정.
 *
 * baseURL 등 앱이 core에 주입할 API 설정을 여기서 관리합니다.
 * 값은 .env(VITE_*)에서 읽어오며, SI 프로젝트에서 API 접속 정보를 바꿀 때는 이 파일만 수정하세요. (core 불가침)
 * (main.tsx 에서 initApiConfig(apiConfig)로 주입)
 */

/** .env 값은 문자열이므로 숫자로 변환한다. 미설정·오타·음수는 undefined로 흘려 core 기본값에 맡긴다. */
const parseTimeout = (value: string | undefined): number | undefined => {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const apiConfig: ApiLibConfig = {
	baseURL: import.meta.env.VITE_API_BASE_URL,
	timeout: parseTimeout(import.meta.env.VITE_API_TIMEOUT),
};
