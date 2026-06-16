import BaseAxiosClient from './api-client';
import type { ApiRequestConfig, ApiResponse } from '../types/api-types';

export class ApiError extends Error {
	status: number;
	data?: unknown;

	constructor(status: number, message: string, data?: unknown) {
		super(message);
		this.name = 'ApiError';
		this.status = status;
		this.data = data;
	}
}

export async function callApi<T = unknown>(
	endpoint: string,
	config: ApiRequestConfig = {},
): Promise<ApiResponse<T>> {
	try {
		const reqConfig = BaseAxiosClient.makeRequestConfig(endpoint, config);

		// 토큰 등 인증 헤더는 요청 인터셉터(shared/auth)에서 일괄 주입한다.
		const response = await BaseAxiosClient.request<T>(reqConfig);

		if (!response.success) {
			throw new ApiError(response.statusCode ?? 500, response.error ?? '알 수 없는 오류', response);
		}

		return {
			data: response.data as T,
			statusCode: response.statusCode ?? 200,
			message: (response.data as { message?: string } | undefined)?.message,
		};
	} catch (error) {
		if (error instanceof ApiError) throw error;
		throw new ApiError(500, error instanceof Error ? error.message : '알 수 없는 오류', error);
	}
}
