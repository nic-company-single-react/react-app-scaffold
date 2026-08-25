import { authConfig } from '@/config';
import { callApi } from '@/core/api';

/**
 * 인증 동작 확인용 개발 프로브 (dev 전용).
 *
 * 콘솔에서 `fetch()` 로 찔러보는 것과 다르다. **core 의 axios 를 거치므로 인터셉터를 탄다.**
 * 그래서 "401 → 자동 갱신 → 재시도"와 "동시 401 다섯 개 → refresh 한 번"을
 * 개발자도구 Network 탭에서 눈으로 볼 수 있다. 목이든 실서버든 똑같이 쓸 수 있다.
 *
 * 운영 번들에는 들어가지 않는다. main.tsx 가 DEV 에서만 동적 import 한다.
 */
interface IAuthDevProbe {
	/** 보호된 요청 1회. 만료 후에 부르면 갱신 → 재시도가 일어난다. */
	me: () => Promise<unknown>;
	/** 보호된 요청 n개를 동시에. Network 에서 refresh 가 **1건**인지 확인한다. */
	burst: (n?: number) => Promise<unknown>;
}

export function registerAuthDevProbe(): void {
	if (!import.meta.env.DEV) return;

	(window as unknown as { __auth: IAuthDevProbe }).__auth = {
		me: () => callApi(authConfig.endpoints.me),
		burst: (n = 5) => Promise.allSettled(Array.from({ length: n }, () => callApi(authConfig.endpoints.me))),
	};
}
