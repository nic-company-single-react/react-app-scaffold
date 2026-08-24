import type { ApiLibConfig } from '@/types/api';
import BaseAxiosClient from './api-client';

export type { ApiLibConfig };

/**
 * 값이 `undefined`인 키를 제거한다.
 *
 * `src/config/api.config.ts`의 `apiConfig`는 .env가 비어 있어도 키 자체는 항상 존재하고
 * 값만 `undefined`가 된다. 이를 그대로 병합하면 스프레드/`Object.assign`이 `undefined`까지
 * 복사해 **이미 설정된 값을 지워버린다.** 병합 전에 걸러내는 이유다.
 *
 * @param config 걸러낼 API 설정
 * @returns 값이 있는 키만 남은 설정
 */
const omitUndefined = (config: ApiLibConfig): ApiLibConfig =>
	Object.fromEntries(Object.entries(config).filter(([, v]) => v !== undefined));

/**
 * 앱이 소유한 API 설정을 core(axios 인스턴스)에 주입한다.
 *
 * 앱 진입 시 `main.tsx`에서 `src/config/api.config.ts`의 값을 한 번 밀어 넣는다.
 * 설정의 단일 보관처는 axios 인스턴스의 `defaults`이며 별도 전역 변수를 쓰지 않는다.
 *
 * {@link BaseAxiosClient.updateAxiosConfig}가 `Object.assign`으로 병합하므로
 * **전달한 키만 반영되고 나머지 기존 설정은 유지된다.** 런타임에 여러 번 호출해
 * 일부 값만 갱신해도 안전하다.
 *
 * @param config 주입할 API 설정. 값이 `undefined`인 키는 무시된다.
 *
 * @example
 * initApiConfig({ baseURL: '/api', timeout: 5000 });
 * initApiConfig({ timeout: 9000 }); // baseURL은 '/api' 유지
 */
export const initApiConfig = (config: ApiLibConfig): void => {
	BaseAxiosClient.updateAxiosConfig(omitUndefined(config));
};
