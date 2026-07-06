import { createStore } from '@/core/store/createStore';

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
 * - persist: 새로고침 후에도 담아둔 목록이 유지된다. 액션(함수)은 저장에서 자동 제외된다.
 */
export const useFavoritesStore = createStore(
	{ items: [] as IFavoriteItem[] },
	(set, get) => ({
		/** 이미 있으면 제거, 없으면 추가 (하트 토글) */
		toggle: (item: IFavoriteItem) => {
			const exists = get().items.some((i) => i.id === item.id);
			set({
				items: exists ? get().items.filter((i) => i.id !== item.id) : [...get().items, item],
			});
		},
		/** id 로 한 항목 제거 */
		remove: (id: string) => set((s) => ({ items: s.items.filter((i) => i.id !== id) })),
		/** 전체 비우기 */
		clear: () => set({ items: [] }),
	}),
	{ name: 'example-favorites', persist: true },
);
