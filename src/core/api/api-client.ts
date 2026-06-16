import axios, {
	type AxiosInstance,
	type AxiosRequestConfig,
	type AxiosResponse,
	type AxiosError,
	type InternalAxiosRequestConfig,
} from 'axios';
import type { ApiInstanceConfig, ApiRequestConfig, ApiResponse } from '../types/api-types';
import { getApiConfig } from './api-config';

class BaseAxiosClient {
	private static instance: BaseAxiosClient;
	private axiosInstance: AxiosInstance;

	private constructor(config: ApiInstanceConfig = {}) {
		this.axiosInstance = this.createAxiosInstance(config);
		this.axiosInstance.defaults.withCredentials = true;
		this.axiosInstance.interceptors.request.use(this.requestInterceptor);
		this.axiosInstance.interceptors.response.use(this.responseInterceptor, this.errorInterceptor);
	}

	static getInstance(): BaseAxiosClient {
		if (!BaseAxiosClient.instance) {
			BaseAxiosClient.instance = new BaseAxiosClient();
		}
		return BaseAxiosClient.instance;
	}

	private createAxiosInstance(config: ApiInstanceConfig): AxiosInstance {
		const apiConfig = getApiConfig();
		return axios.create({
			baseURL: config.baseURL || apiConfig.baseURL || '',
			timeout: config.timeout ?? 30000,
			headers: {
				'Content-Type': 'application/json',
				Accept: 'application/json',
				...(config.headers ?? {}),
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
	 * 외부(shared 등)에서 요청 인터셉터를 등록할 수 있는 창구.
	 * core는 등록만 위임하며, 헤더/토큰 등 구체 로직은 호출 측이 소유한다.
	 *
	 * @returns 등록 해제에 사용할 interceptor id
	 */
	registerRequestInterceptor(
		onFulfilled: (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig,
	): number {
		return this.axiosInstance.interceptors.request.use(onFulfilled);
	}

	/** 등록된 요청 인터셉터를 해제한다. */
	ejectRequestInterceptor(id: number): void {
		this.axiosInstance.interceptors.request.eject(id);
	}

	makeRequestConfig(endpoint: string, config: ApiRequestConfig): AxiosRequestConfig {
		const { method = 'GET', params, headers = {}, body, timeout } = config;
		const apiConfig = getApiConfig();

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
			url = new URL(endpoint, absoluteBase);
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
			timeout: timeout ?? 30000,
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
