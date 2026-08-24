import type { ApiLibConfig } from '@/types/api';

/**
 * REST API 설정.
 *
 * baseURL 등 앱이 core에 주입할 API 설정을 여기서 관리합니다.
 * 값은 .env(VITE_*)에서 읽어오며, SI 프로젝트에서 API 접속 정보를 바꿀 때는 이 파일만 수정하세요. (core 불가침)
 * (main.tsx 에서 initApiConfig(apiConfig)로 주입)
 *
 * ⚠️ **설정값의 소유자는 core가 아니라 이 파일입니다.**
 * core(src/core/api/api-client.ts)는 값을 담아두는 그릇일 뿐,
 * baseURL·timeout·withCredentials의 기본값을 갖고 있지 않습니다.
 * 따라서 아래 항목을 지우면 그 설정은 "없는 상태"가 되며, 항목에 따라 조용히 문제가 됩니다.
 * 지워도 되는지는 각 항목의 주석을 확인하세요.
 *
 * 값이 `undefined`인 항목은 core로 넘어가기 전에 걸러지므로(core/api/api-config.ts),
 * 기존 설정을 지우지는 않습니다.
 */

/**
 * .env 값은 문자열이므로 숫자로 변환한다.
 *
 * 미설정·오타·음수는 `undefined`를 돌려주며, 그 경우 아래 `timeout`의 `?? 30000`이 기본값을 채운다.
 */
const parseTimeout = (value: string | undefined): number | undefined => {
	const parsed = Number(value);
	return Number.isFinite(parsed) && parsed > 0 ? parsed : undefined;
};

export const apiConfig: ApiLibConfig = {
	/**
	 * 요청 기준 URL. (.env: VITE_API_BASE_URL)
	 *
	 * 상대 경로('/api')를 넣으면 core가 요청 URL을 만들 때 현재 문서의 origin 기준으로 절대화한다.
	 * 미설정이면 origin 자체를 기준으로 삼으므로(core/api/api-client.ts makeRequestConfig)
	 * 값이 비어도 동작에는 문제가 없다.
	 */
	baseURL: import.meta.env.VITE_API_BASE_URL,

	/**
	 * 요청 타임아웃(ms). (.env: VITE_API_TIMEOUT)
	 *
	 * ⚠️ `?? 30000`을 지우지 말 것. core에는 timeout 기본값이 없고 axios의 초기값은
	 *    `0`(= 무제한)이라, .env가 비거나 오타가 나면 타임아웃이 아예 걸리지 않는다.
	 *    그렇게 되면 응답 없는 요청이 영원히 대기하고 408 처리도 발동하지 않는다.
	 */
	timeout: parseTimeout(import.meta.env.VITE_API_TIMEOUT) ?? 30000,

	/**
	 * 교차 출처(cross-origin) 요청에 쿠키를 함께 보낼지 여부.
	 *
	 * 현재 인증은 Authorization 헤더(JWT) 방식이라 필수는 아니지만,
	 * refresh 토큰을 HttpOnly 쿠키로 쓰는 구성을 대비해 켜 둔다.
	 * 이 항목을 지우면 axios 기본값인 `false`가 된다. (core에는 기본값이 없다)
	 *
	 * ⚠️ 서버가 `Access-Control-Allow-Credentials: true`와 구체적인
	 *    `Access-Control-Allow-Origin`(`*` 불가)을 반환해야 동작한다.
	 *    API 서버가 `*`를 반환한다면 `false`로 내려야 요청이 CORS로 막히지 않는다.
	 */
	withCredentials: true,

	/**
	 * 모든 요청에 공통으로 붙는 헤더. 같은 키는 core 기본 헤더를 덮어쓴다.
	 *
	 * 사이트 공통 헤더가 필요하면 여기에 추가한다. 예) 'Accept-Language': 'ko-KR'
	 * core(createAxiosInstance)가 같은 값을 안전망으로 갖고 있어 지워도 JSON 통신은
	 * 유지되지만, 설정의 소유자를 이 파일로 두기 위해 명시한다.
	 *
	 * ⚠️ Authorization 헤더는 여기가 아니라 요청 인터셉터(src/shared/auth)가 주입한다.
	 */
	headers: {
		'Content-Type': 'application/json',
		Accept: 'application/json',
	},
};
