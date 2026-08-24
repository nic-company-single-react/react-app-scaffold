/**
 * 앱(`src/config/api.config.ts`)이 core에 주입하는 API 설정.
 *
 * 설정값의 소유자는 앱이다. core는 헤더를 제외하면 기본값을 갖고 있지 않으므로,
 * 값을 주지 않은 키는 axios 자체 기본값으로 남는다는 점에 주의한다.
 */
export type ApiLibConfig = {
	/**
	 * 요청 기준 URL.
	 *
	 * 미설정 시 core가 현재 문서의 origin을 기준으로 요청 URL을 만든다.
	 */
	baseURL?: string;
	/**
	 * 요청 타임아웃(ms).
	 *
	 * ⚠️ 미설정 시 axios 기본값인 `0`(= 무제한)이 된다. core에 기본값이 없으므로
	 *    앱이 반드시 값을 주어야 타임아웃이 걸린다.
	 */
	timeout?: number;
	/**
	 * 교차 출처 요청에 쿠키·인증 헤더를 함께 보낼지 여부. 미설정 시 axios 기본값 `false`.
	 *
	 * 켜려면 서버가 `Access-Control-Allow-Credentials: true`와
	 * 구체적인 `Access-Control-Allow-Origin`(`*` 불가)을 반환해야 한다.
	 */
	withCredentials?: boolean;
	/**
	 * 모든 요청에 공통으로 붙일 헤더. core 기본 헤더 위에 병합되며 같은 키는 덮어쓴다.
	 *
	 * core가 안전망으로 갖고 있는 유일한 기본값:
	 * `Content-Type: application/json`, `Accept: application/json`
	 */
	headers?: Record<string, string>;
};
