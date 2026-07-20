import type { DataRouter, To, NavigateOptions, Location } from 'react-router';
import type { IRouter, TAppRoute } from '@/types/router';

/**
 * DataRouter 인스턴스를 감싸 전역 `$router` 로 노출할 객체를 만든다.
 *
 * 각 메서드의 상세 설명·사용 예시는 반환 타입 {@link IRouter} 의 JSDoc 참고.
 * `getXxx()` 계열은 비-반응형 스냅샷이라 호출 시점의 최신 값을 돌려준다.
 */
export function createWindowRouter(router: DataRouter): IRouter {
	return {
		/** 지정 경로로 이동 (히스토리 push). */
		push(to: To, options?: NavigateOptions) {
			router.navigate(to, options);
		},
		/** 현재 항목을 교체하며 이동 (히스토리 replace). */
		replace(to: To, options?: NavigateOptions) {
			router.navigate(to, { ...options, replace: true });
		},
		/** 한 칸 뒤로 이동. */
		back() {
			router.navigate(-1);
		},
		/** 한 칸 앞으로 이동. */
		forward() {
			router.navigate(1);
		},
		/** 히스토리에서 delta 칸 이동 (음수=뒤로, 양수=앞으로). */
		go(delta: number) {
			router.navigate(delta);
		},
		/** 현재 위치(Location) 스냅샷 반환. */
		getLocation() {
			return router.state.location;
		},
		/** 이동 시 넘긴 state 값 반환 (없으면 null). */
		getState() {
			return router.state.location.state ?? null;
		},
		/** 현재 URL 쿼리스트링을 URLSearchParams 로 파싱해 반환. */
		getSearchParams() {
			return new URLSearchParams(router.state.location.search);
		},
		/** 현재 매치된 라우트의 경로 파라미터 반환 (없으면 빈 객체). */
		getParams() {
			return router.state.matches.at(-1)?.params ?? {};
		},
		/** 현재 매치된 leaf 라우트의 name 반환 (없으면 undefined). */
		getRouteName() {
			const last = router.state.matches.at(-1);
			return (last?.route as TAppRoute | undefined)?.name;
		},
		/**
		 * 라우트 변경을 구독. 이동 시마다 새 Location 으로 cb 호출.
		 * @returns 구독 해제 함수.
		 */
		subscribe(cb: (location: Location) => void) {
			// router.subscribe 콜백은 (state, opts) 를 받으므로 location 만 뽑아 전달한다.
			return router.subscribe((state) => cb(state.location));
		},
		/**
		 * 이동 없이 링크 문자열(href)만 생성. 해시 라우터라 '...#/foo' 형태.
		 * DataRouter.createHref 는 런타임상 To 를 그대로 받으므로 타입만 캐스팅한다.
		 */
		createHref(to: To) {
			return (router.createHref as (to: To) => string)(to);
		},
	};
}

// 전역 $router 등록
export function registerWindowRouter(router: DataRouter): void {
	window.$router = createWindowRouter(router);
}
