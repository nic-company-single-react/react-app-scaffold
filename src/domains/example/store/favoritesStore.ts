import { defineStore } from '@axiom/store';

/**
 * 즐겨찾기 한 항목의 스냅샷.
 * 담는 순간의 표시 정보를 그대로 저장하므로, 사용 페이지는 이 스토어만 읽으면 된다.
 * (별도의 상품 마스터 조회가 필요 없다)
 */
export interface IFavoriteItem {
	id: string;
	name: string;
	emoji: string;
	price: number;
}

/**
 * example 도메인 전용 즐겨찾기 스토어.
 *
 * - 배치: 이 도메인 안에서만 공유하므로 `src/domains/example/store/` 에 둔다.
 *   (다른 도메인에서도 필요해지면 `src/shared/store/` 로 승격)
 * - persist: 새로고침 후에도 담아둔 목록이 유지된다. 액션은 저장에서 자동 제외된다.
 * - 액션은 첫 인자 `state` 로 현재 상태를 받는다. immer 로 감싸므로 직접 변경하면 된다.
 */
export const useFavoritesStore = defineStore({
	name: 'example-favorites',
	persist: true,
	state: { items: [] as IFavoriteItem[] },
	// 각 액션의 첫 인자 state 는 현재 상태(immer draft)이며, defineStore 가 실행 시 자동 주입한다.
	// → 정의는 (state, item) 이지만, 컴포넌트에서 부를 땐 state 없이 toggle(item) 으로 호출한다.
	actions: {
		/** 이미 있으면 제거, 없으면 추가 (하트 토글) */
		toggle: (state, item: IFavoriteItem) => {
			const i = state.items.findIndex((x) => x.id === item.id);
			if (i >= 0) state.items.splice(i, 1);
			else state.items.push(item);
		},
		/** id 로 한 항목 제거 */
		remove: (state, id: string) => {
			state.items = state.items.filter((x) => x.id !== id);
		},
		/** 전체 비우기 */
		clear: (state) => {
			state.items = [];
		},
	},
});
