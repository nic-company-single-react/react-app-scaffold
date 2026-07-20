import type { RouteObject, To, NavigateOptions, Location, Params } from 'react-router';
export type TAppRoute = RouteObject & {
	name?: string;
};

/**
 * 전역 `$router` 객체의 타입.
 *
 * `createHashRouter()` 로 만든 DataRouter 인스턴스를 감싸, React 컴포넌트 밖
 * (이벤트 핸들러 · 유틸 · API 인터셉터 등)에서도 훅 없이 라우팅을 다룰 수 있게 한다.
 *
 * @remarks
 * `getXxx()` 계열은 **비-반응형 스냅샷**이다. 호출하는 순간의 최신 값을 돌려주지만,
 * 값을 변수에 저장해두면 이후 이동에는 갱신되지 않는다. 필요할 때마다 다시 호출할 것.
 * 마운트된 컴포넌트가 URL 변화에 자동 리렌더돼야 한다면 `useLocation()` 등의 훅을 쓴다.
 */
export interface IRouter {
	/**
	 * 지정한 경로로 이동한다. (히스토리 스택에 새 항목을 push)
	 * @param to 이동할 경로. 문자열 또는 `{ pathname, search, hash }` 부분 객체.
	 * @param options `state` 전달 등 네비게이션 옵션.
	 * @example $router.push('/account/usage-history', { state: { accountNo: '123' } });
	 */
	push(to: To, options?: NavigateOptions): void;
	/**
	 * 현재 항목을 교체하며 이동한다. (히스토리 스택에 새 항목을 쌓지 않음 → 뒤로가기 시 현재 화면으로 안 돌아옴)
	 * @param to 이동할 경로.
	 * @param options 네비게이션 옵션. (`replace: true` 가 자동 적용됨)
	 */
	replace(to: To, options?: NavigateOptions): void;
	/** 히스토리에서 한 칸 뒤로 이동한다. (브라우저 뒤로가기와 동일) */
	back(): void;
	/** 히스토리에서 한 칸 앞으로 이동한다. (브라우저 앞으로가기와 동일) */
	forward(): void;
	/**
	 * 히스토리에서 `delta` 칸만큼 이동한다. 음수는 뒤로, 양수는 앞으로.
	 * @param delta 이동할 칸 수. 예: `-2` 는 두 칸 뒤로.
	 */
	go(delta: number): void;
	/**
	 * 현재 위치(Location) 스냅샷을 반환한다.
	 * @returns `{ pathname, search, hash, state, key }`
	 * @example const { pathname, search } = $router.getLocation();
	 */
	getLocation(): Location;
	/**
	 * 이동 시 `push`/`replace` 로 넘긴 `state` 값을 반환한다. 없으면 `null`.
	 * @typeParam T 기대하는 state 형태.
	 * @example const accountNo = $router.getState<{ accountNo: string }>()?.accountNo;
	 */
	getState<T = unknown>(): T | null;
	/**
	 * 현재 URL의 쿼리스트링을 `URLSearchParams` 로 파싱해 반환한다.
	 * @example const id = $router.getSearchParams().get('id'); // ?id=... 값
	 */
	getSearchParams(): URLSearchParams;
	/**
	 * 현재 매치된 라우트의 경로 파라미터를 반환한다. (`useParams()` 의 비-훅 버전)
	 * @example const id = $router.getParams().id; // /user/:id 의 값
	 */
	getParams(): Params;
	/**
	 * 현재 매치된 라우트(가장 안쪽 leaf)의 `name` 을 반환한다. 지정 안 됐으면 `undefined`.
	 * @remarks 라우트 정의에 `name` 을 붙인 이 프로젝트 전용 필드를 읽는다. (로깅/화면 식별에 유용)
	 */
	getRouteName(): string | undefined;
	/**
	 * 라우트가 바뀔 때마다 콜백을 실행한다. (push 방식 — 이동 이벤트 구독)
	 *
	 * 페이지뷰 분석 전송, 네비게이션 로깅, 전역 모달 닫기, 문서 타이틀 동기화 등
	 * "이동하는 순간" 부수효과를 컴포넌트 밖에서 실행할 때 쓴다.
	 * @param cb 새 Location 을 인자로 받는 콜백.
	 * @returns 구독 해제 함수. 더 이상 필요 없으면 호출한다.
	 * @example
	 * const off = $router.subscribe((loc) => sendPageview(loc.pathname));
	 * // ...
	 * off(); // 해제
	 */
	subscribe(cb: (location: Location) => void): () => void;
	/**
	 * 이동하지 않고, 지정한 경로에 대한 링크 문자열(href)만 생성한다.
	 *
	 * 링크 복사, 새 창 열기(`window.open`), 공유/딥링크 등 URL 문자열이 필요할 때 쓴다.
	 * 해시 라우터이므로 결과는 `...#/foo` 형태가 된다.
	 * @param to 링크로 만들 경로.
	 * @returns href 문자열.
	 * @example const href = $router.createHref('/report'); // '...#/report'
	 */
	createHref(to: To): string;
}

export type TCustomRoute = RouteObject & {
	name?: string;
};
