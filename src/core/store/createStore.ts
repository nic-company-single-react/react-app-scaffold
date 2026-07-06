import { create, type StateCreator } from 'zustand';
import { persist, devtools, createJSONStorage, type PersistOptions } from 'zustand/middleware';

// ─── 타입 ─────────────────────────────────────────────────────────────────────

/** 액션 정의에 전달되는 set 함수. 부분 상태 또는 갱신 함수를 받는다. */
type SetState<T> = (partial: Partial<T> | ((state: T) => Partial<T>)) => void;

export interface ICreateStoreOptions<TState> {
	/** devtools / persist 를 식별하는 이름 (필수). 스토어마다 고유해야 한다. */
	name: string;
	/**
	 * 새로고침 후에도 상태를 유지할지 여부. 기본은 미유지.
	 * - `true`  : localStorage 에 상태 전체(액션 제외) 저장
	 * - 객체    : storage 선택 및 저장 필드 세부 지정
	 */
	persist?:
		| boolean
		| {
				/** 저장소 선택 (기본: 'local') */
				storage?: 'local' | 'session';
				/** 저장할 필드 선별 (기본: 액션을 제외한 초기 상태 필드 전체) */
				partialize?: (state: TState) => Partial<TState>;
		  };
}

// ─── 팩토리 ───────────────────────────────────────────────────────────────────

/**
 * 스캐폴드 표준 Zustand 스토어 팩토리.
 *
 * 상태와 액션을 분리해서 넘기면 하나의 스토어 훅으로 합쳐 반환한다.
 * - devtools: 개발 환경(`import.meta.env.DEV`)에서만 자동 부착.
 * - persist: `persist: true` 한 줄로 새로고침 유지. 함수(액션)는 저장에서 자동 제외된다.
 *
 * 반환값은 순정 Zustand 훅과 동일하므로, 소비하는 화면 코드는 팩토리 사용 여부와 무관하다.
 * (셀렉터 구독 / `getState()` 명령형 접근 모두 그대로 동작)
 *
 * @param initialState 초기 상태 (여기에 있는 키가 persist 시 저장 대상이 된다)
 * @param createActions 상태를 변경하는 액션 정의. `(set, get) => ({ ... })`
 * @param options `name`(필수) 및 `persist` 설정
 *
 * @example
 * // 서로 다른 도메인이 공유하는 상태 → src/shared/store/ 에 배치
 * export const useSessionStore = createStore(
 *   { selectedCompany: null as Company | null },      // 초기 상태
 *   (set) => ({                                        // 액션
 *     setSelectedCompany: (c: Company | null) => set({ selectedCompany: c }),
 *     reset: () => set({ selectedCompany: null }),
 *   }),
 *   { name: 'session', persist: true },                // 옵션
 * );
 *
 * @example
 * // 화면에서의 소비 (순정 Zustand 와 동일)
 * const company = useSessionStore((s) => s.selectedCompany);
 * const setCompany = useSessionStore((s) => s.setSelectedCompany);
 */
export function createStore<TState extends object, TActions extends object>(
	initialState: TState,
	createActions: (set: SetState<TState>, get: () => TState) => TActions,
	options: ICreateStoreOptions<TState>,
) {
	type Store = TState & TActions;

	// 초기 상태 + 액션을 하나의 스토어 초기화 함수로 합친다.
	// createActions 의 set/get 은 TState 로 좁혀 전달한다.
	// (이렇게 해야 TActions 가 반환값에서 순환 없이 추론된다. 액션끼리 호출이 필요하면
	//  get() 대신 스토어 훅의 getState() 를 직접 쓰면 된다.)
	const initializer: StateCreator<Store, [], []> = (set, get) => ({
		...initialState,
		...createActions(set as SetState<TState>, get as unknown as () => TState),
	});

	// 미들웨어를 단계적으로 씌운다. 각 단계의 mutator 튜플이 달라 타입 합성이 까다로우므로,
	// 조합 과정은 unknown 으로 다루고 create 경계에서 한 번만 단언한다.
	// (반환 훅 자체는 create<Store>() 로 완전한 타입이 보장된다.)
	let creator: unknown = initializer;

	if (options.persist) {
		const p = options.persist === true ? {} : options.persist;
		const stateKeys = Object.keys(initialState) as (keyof TState)[];

		const persistOptions: PersistOptions<Store> = {
			name: options.name,
			storage: createJSONStorage(() => (p.storage === 'session' ? sessionStorage : localStorage)),
			// 기본 partialize: 초기 상태에 존재하던 필드만 저장 → 액션(함수)은 자동 제외된다.
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

	// devtools 는 개발 환경에서만 부착 (프로덕션 번들에서는 건너뛴다)
	if (import.meta.env.DEV) {
		creator = devtools(creator as StateCreator<Store, [], []>, { name: options.name });
	}

	return create<Store>()(creator as StateCreator<Store, [], []>);
}
