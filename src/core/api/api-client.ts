import axios, {
	type AxiosInstance,
	type AxiosDefaults,
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
	type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiInstanceConfig, ApiRequestConfig, ApiResponse } from '../types/api-types';
import type { ApiLibConfig } from '@/types/api';

class BaseAxiosClient {
	private static instance: BaseAxiosClient;
	private axiosInstance: AxiosInstance;

	private constructor(config: ApiInstanceConfig = {}) {
		this.axiosInstance = this.createAxiosInstance(config);
		this.axiosInstance.interceptors.request.use(this.requestInterceptor);
		this.axiosInstance.interceptors.response.use(this.responseInterceptor, this.errorInterceptor);
	}

	static getInstance(): BaseAxiosClient {
		if (!BaseAxiosClient.instance) {
			BaseAxiosClient.instance = new BaseAxiosClient();
		}
		return BaseAxiosClient.instance;
	}

	/**
	 * axios 인스턴스를 만든다.
	 *
	 * API 설정값의 소유자는 core가 아니라 앱(`src/config/api.config.ts`)이다.
	 * 그래서 baseURL·timeout·withCredentials의 기본값은 여기에 두지 않는다.
	 * 실제 값은 `initApiConfig()` → {@link updateAxiosConfig} 경로로 주입된다.
	 *
	 * 헤더만 예외적으로 기본값을 둔다. 앱이 아무것도 주입하지 않아도 JSON 통신이
	 * 성립하도록 남겨둔 최소 안전망이다. (이게 없으면 axios가 문자열 body를
	 * `application/x-www-form-urlencoded`로 판단한다.) 앱이 같은 키를 주면 덮어쓰인다.
	 *
	 * ⚠️ 헤더는 반드시 `common`에 넣는다. `defaults.headers` 최상위에 평면으로 두면
	 * `common`보다 우선순위가 높아져 앱이 같은 키를 덮어쓸 수 없게 된다.
	 */
	private createAxiosInstance(config: ApiInstanceConfig): AxiosInstance {
		const { headers, ...rest } = config;

		return axios.create({
			...rest,
			headers: {
				common: {
					'Content-Type': 'application/json',
					Accept: 'application/json',
					...(headers ?? {}),
				},
			},
		});
	}

	private requestInterceptor(requestConfig: InternalAxiosRequestConfig): InternalAxiosRequestConfig {
		return requestConfig;
	}

	private responseInterceptor(response: AxiosResponse): AxiosResponse {
		return response;
	}

	private errorInterceptor(error: AxiosError): Promise<never> {
		return Promise.reject(error);
	}

	/**
	 * API 설정을 axios 인스턴스 defaults에 반영한다.
	 *
	 * 이미 생성된 싱글턴 인스턴스의 기본값을 런타임에 덮어쓰므로,
	 * 호출 이후 발생하는 모든 요청에 변경된 설정이 적용된다.
	 * 전달한 키만 병합되며, 넘기지 않은 기존 defaults는 유지된다.
	 *
	 * ⚠️ `headers`는 나머지 키와 분리해 `defaults.headers.common`에 병합한다.
	 * `defaults.headers`는 `common`/`get`/`post`… 로 나뉜 구조라 통째로 대입하면
	 * 그 구조가 통째로 날아가 axios가 헤더를 조립하지 못한다.
	 *
	 * @param config 반영할 API 설정
	 * @param config.baseURL 요청 기준 URL
	 * @param config.timeout 요청 타임아웃(ms)
	 * @param config.withCredentials 교차 출처 요청에 쿠키를 함께 보낼지 여부
	 * @param config.headers 모든 요청에 공통으로 붙일 헤더(기존 헤더 위에 병합)
	 */
	updateAxiosConfig(config: ApiLibConfig): void {
		const { headers, ...rest } = config;

		Object.assign(this.axiosInstance.defaults, rest);

		if (headers) {
			Object.assign(this.axiosInstance.defaults.headers.common, headers);
		}
	}

	/**
	 * 현재 axios 인스턴스에 적용된 기본 설정을 반환한다.
	 *
	 * 반환 타입은 `AxiosRequestConfig`가 아니라 `AxiosDefaults`다.
	 * axios의 defaults는 headers가 `HeadersDefaults`(common/get/post…로 분리된 구조)라
	 * `AxiosRequestConfig`와 호환되지 않는다.
	 *
	 * ⚠️ 내부 defaults 객체의 참조를 그대로 돌려주므로 반환값을 변경하면
	 * 인스턴스 설정이 바뀐다. 설정 변경은 {@link updateAxiosConfig}를 사용한다.
	 *
	 * @returns axios 인스턴스의 defaults
	 */
	getAxiosConfig(): AxiosDefaults {
		return this.axiosInstance.defaults;
	}

	/**
	 * 외부(shared 등)에서 요청 인터셉터를 등록할 수 있는 창구.
	 * core는 등록만 위임하며, 헤더/토큰 등 구체 로직은 호출 측이 소유한다.
	 *
	 * @returns 등록 해제에 사용할 interceptor id
	 */
	registerRequestInterceptor(onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig): number {
		return this.axiosInstance.interceptors.request.use(onFulfilled);
	}

	/** 등록된 요청 인터셉터를 해제한다. */
	ejectRequestInterceptor(id: number): void {
		this.axiosInstance.interceptors.request.eject(id);
	}

	/**
	 * 외부(shared 등)에서 응답 인터셉터를 등록할 수 있는 창구.
	 * core는 등록만 위임하며, 401 처리/리다이렉트 등 구체 로직은 호출 측이 소유한다.
	 *
	 * @param onFulfilled 정상 응답(2xx) 가공 콜백
	 * @param onRejected  에러 응답(non-2xx) 처리 콜백. reject를 이어가려면 Promise.reject(error)를 반환한다.
	 * @returns 등록 해제에 사용할 interceptor id
	 */
	registerResponseInterceptor(
		onFulfilled?: (response: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>,
		onRejected?: (error: AxiosError) => unknown,
	): number {
		return this.axiosInstance.interceptors.response.use(onFulfilled, onRejected);
	}

	/** 등록된 응답 인터셉터를 해제한다. */
	ejectResponseInterceptor(id: number): void {
		this.axiosInstance.interceptors.response.eject(id);
	}

	makeRequestConfig(endpoint: string, config: ApiRequestConfig): AxiosRequestConfig {
		const { method = 'GET', params, headers = {}, body, timeout } = config;
		const apiConfig = this.getAxiosConfig();

		let url: URL;
		const isAbsoluteUrl = /^https?:\/\//.test(endpoint);

		if (isAbsoluteUrl) {
			url = new URL(endpoint);
		} else if (!apiConfig.baseURL) {
			url = new URL(endpoint, window.location.origin);
		} else {
			// baseURL이 상대 경로(예: /api)인 경우 window.location.origin 기준으로 절대 URL 변환
			const absoluteBase = /^https?:\/\//.test(apiConfig.baseURL)
				? apiConfig.baseURL
				: new URL(apiConfig.baseURL, window.location.origin).href;
			// ⚠️ new URL(endpoint, absoluteBase) 를 쓰지 않는다.
			//    endpoint 가 '/' 로 시작하면 절대 경로로 해석되어 base 의 경로가 통째로 버려진다.
			//      new URL('/auth/login', 'http://host/api')  →  'http://host/auth/login'
			//    baseURL 에 경로 접두어(/api, /gateway)를 두는 구성이 404 로만 드러나며 조용히 깨진다.
			//    axios 의 baseURL 동작(문자열 결합)과 같게 맞춘다.
			url = new URL(`${absoluteBase.replace(/\/+$/, '')}/${endpoint.replace(/^\/+/, '')}`);
		}

		if (method.toUpperCase() === 'GET' && params) {
			Object.entries(params).forEach(([key, value]) => {
				if (value !== undefined && value !== null) {
					url.searchParams.append(key, String(value));
				}
			});
		}

		const requestConfig: AxiosRequestConfig = {
			method,
			url: url.toString(),
			headers,
			timeout: timeout ?? apiConfig.timeout,
		};

		if (['POST', 'PUT', 'PATCH', 'DELETE'].includes(method.toUpperCase()) && body) {
			requestConfig.data = JSON.stringify(body);
		}

		return requestConfig;
	}

	async request<T>(config: AxiosRequestConfig): Promise<ApiResponse<T>> {
		try {
			const response = await this.axiosInstance.request<T>(config);

			return {
				success: true,
				data: response.data,
				statusCode: response.status,
			};
		} catch (error) {
			if (axios.isAxiosError(error)) {
				const axiosError = error as AxiosError<{ message?: string; error?: string }>;

				if (axiosError.code === 'ECONNABORTED') {
					return { success: false, error: '요청 시간이 초과되었습니다', statusCode: 408 };
				}

				return {
					success: false,
					error:
						axiosError.response?.data?.message ||
						axiosError.response?.data?.error ||
						axiosError.message ||
						'API 요청 실패',
					statusCode: axiosError.response?.status ?? 500,
				};
			}

			return { success: false, error: '알 수 없는 오류가 발생했습니다', statusCode: 500 };
		}
	}
}

export default BaseAxiosClient.getInstance();
