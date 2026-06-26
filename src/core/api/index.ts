import BaseAxiosClient from './api-client';

export { callApi, ApiError } from './api';
export { initApiConfig, getApiConfig } from './api-config';

/** 요청 인터셉터 등록 창구 (구체 로직은 shared가 소유) */
export const registerRequestInterceptor = BaseAxiosClient.registerRequestInterceptor.bind(BaseAxiosClient);
/** 요청 인터셉터 해제 */
export const ejectRequestInterceptor = BaseAxiosClient.ejectRequestInterceptor.bind(BaseAxiosClient);
/** 응답 인터셉터 등록 창구 (구체 로직은 shared가 소유) */
export const registerResponseInterceptor = BaseAxiosClient.registerResponseInterceptor.bind(BaseAxiosClient);
/** 응답 인터셉터 해제 */
export const ejectResponseInterceptor = BaseAxiosClient.ejectResponseInterceptor.bind(BaseAxiosClient);
