import { create, type StateCreator } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, devtools, createJSONStorage, type PersistOptions } from 'zustand/middleware';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

/** 액션 정의 형태: 첫 인자로 상태(state)를 받고, 그 뒤에 원하는 인자를 받는다. */
type StateAction<TState> = (state: TState, ...args: never[]) => unknown;

/** 노출용 액션 타입: 첫 인자(state)를 벗겨낸다. (컴포넌트는 state 없이 호출) */
type PublicAction<F> = F extends (state: never, ...args: infer P) => infer R ? (...args: P) => R : never;
type PublicActions<A> = { [K in keyof A]: PublicAction<A[K]> };

export interface IDefineStoreConfig<TState, TActions> {
	/** devtools / persist 를 식별하는 이름 (필수). 스토어마다 고유해야 한다. */
	name: string;
	/** 초기 상태. 여기에 있는 키가 persist 시 저장 대상이 된다. */
	state: TState;
	/**
	 * 액션 모음.
	 * - 각 액션의 **첫 인자 `state` 로 현재 상태**를 받는다. immer 로 감싸므로 **직접 변경**하면 된다.
	 *   (`state.items.push(x)`, `state.items = state.items.filter(...)` — 불변 스프레드 불필요)
	 * - `this` 를 쓰지 않으므로 화살표 함수/메서드 어느 쪽으로 써도 된다.
	 * - 컴포넌트에서 호출할 때는 첫 인자 `state` 가 자동 주입되므로 **나머지 인자만** 넘긴다.
	 *   (예: 정의는 `add(state, x)`, 호출은 `add(x)`)
	 * - 액션 안에서 다른 액션 호출이 필요하면 `useXxxStore.getState().다른액션()`.
	 */
	actions: TActions;
	/**
	 * 새로고침 후에도 상태를 유지할지 여부. 기본은 미유지.
	 * - `true`  : localStorage 에 상태 전체(액션 제외) 저장
	 * - 객체    : storage 선택 및 저장 필드 세부 지정
	 */
	persist?:
		| boolean
		| {
				storage?: 'local' | 'session';
				partialize?: (state: TState) => Partial<TState>;
		  };
}

// ─── 팩토리 ───────────────────────────────────────────────────────────────────

/**
 * 스캐폴드 표준 Zustand 스토어 팩토리 (작성 편의 우선, `this` 없음).
 *
 * `state` 와 `actions` 를 객체로 선언하면 하나의 스토어 훅으로 합쳐 반환한다.
 * - set/get 을 직접 다루지 않는다. 액션의 첫 인자 `state` 로 상태를 직접 바꾼다(immer).
 * - devtools: 개발 환경에서만 자동 부착. persist: `persist: true` 한 줄.
 * - 반환값은 순정 Zustand 훅과 동일 → 소비는 `const { … } = useXxxStore()`.
 *
 * @example
 * export const useFavoritesStore = defineStore({
 *   name: 'example-favorites',
 *   persist: true,
 *   state: { items: [] as IFavoriteItem[] },
 *   actions: {
 *     toggle: (state, item: IFavoriteItem) => {
 *       const i = state.items.findIndex((x) => x.id === item.id);
 *       if (i >= 0) state.items.splice(i, 1);
 *       else state.items.push(item);
 *     },
 *     remove: (state, id: string) => {
 *       state.items = state.items.filter((x) => x.id !== id);
 *     },
 *     clear: (state) => { state.items = []; },
 *   },
 * });
 *
 * // 소비: 첫 인자 state 는 자동 주입되므로 나머지 인자만 넘긴다.
 * const { items, toggle } = useFavoritesStore();
 * toggle(item);
 */
export function defineStore<TState extends object, TActions extends Record<string, StateAction<TState>>>(
	config: IDefineStoreConfig<TState, TActions>,
) {
	type Store = TState & PublicActions<TActions>;

	// immer 초기화 함수: 각 액션을 감싸 첫 인자(state)에 draft 를 주입한다.
	// 사용자가 작성한 액션은 draft 를 직접 변경(mutate)하고, immer 가 불변 업데이트로 바꿔준다.
	const initializer = immer<Store>((set) => {
		const boundActions: Record<string, (...args: unknown[]) => void> = {};
		for (const key of Object.keys(config.actions)) {
			const action = config.actions[key] as (state: unknown, ...args: unknown[]) => unknown;
			boundActions[key] = (...args: unknown[]) =>
				set((draft) => {
					action(draft, ...args);
				});
		}
		return { ...config.state, ...boundActions } as unknown as Store;
	});

	// 미들웨어를 단계적으로 씌운다. 각 단계의 mutator 튜플이 달라 타입 합성이 까다로우므로,
	// 조합 과정은 unknown 으로 다루고 create 경계에서 한 번만 단언한다.
	let creator: unknown = initializer;

	if (config.persist) {
		const p = config.persist === true ? {} : config.persist;
		const stateKeys = Object.keys(config.state) as (keyof TState)[];

		const persistOptions: PersistOptions<Store> = {
			name: config.name,
			storage: createJSONStorage(() => (p.storage === 'session' ? sessionStorage : localStorage)),
			// 기본 partialize: state 에 있던 필드만 저장 → 액션(함수)은 자동 제외된다.
			partialize: (state) =>
				(p.partialize
					? p.partialize(state as unknown as TState)
					: stateKeys.reduce<Partial<TState>>((acc, key) => {
							acc[key] = (state as unknown as TState)[key];
							return acc;
						}, {})) as unknown as Store,
		};

		creator = persist(creator as StateCreator<Store, [], []>, persistOptions);
	}

	if (import.meta.env.DEV) {
		creator = devtools(creator as StateCreator<Store, [], []>, { name: config.name });
	}

	return create<Store>()(creator as StateCreator<Store, [], []>);
}
