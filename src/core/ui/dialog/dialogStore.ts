import { create } from 'zustand';
import type { IDialogOption, TAnyDialogComponent, TDialogProps } from '@/types/components';

/**
 * $ui.dialog 스택의 한 항목.
 *
 * ⚠️ 이 스토어는 `@axiom/store` 의 `defineStore` 를 쓰지 않고 순정 zustand `create` 를 씁니다.
 *    `defineStore` 는 immer 기반이고 immer 는 결과를 **auto-freeze** 하는데,
 *    여기에는 컴포넌트 함수 · ReactNode · 사용자 props(Map/Date/클래스 인스턴스 가능) ·
 *    resolve 콜백이 들어가므로 freeze/draft 처리가 위험합니다.
 *    (형제 폴더의 `src/core/ui/alert/alertStore.ts` 가 순정 zustand 를 쓰는 것과 같은 이유입니다)
 */
export interface IDialogStackItem {
	id: string;
	/** 본문으로 렌더할 컴포넌트 */
	component: TAnyDialogComponent;
	/**
	 * 컨텐츠에 넘길 props.
	 *
	 * 평범한 객체면 호출 시점 스냅샷이며 handle.update() 로 갱신합니다.
	 * `useLiveProps` 가 만든 상자면 셸이 구독해 페이지 렌더를 따라갑니다.
	 */
	props: TDialogProps;
	/** 껍데기 옵션 (기본값이 채워진 상태) */
	option: IDialogOption<unknown>;
	/** 열린 시점의 pathname — 라우트 변경 감지에 씁니다. */
	openedPathname: string;
	/** Radix 의 open 상태. 닫힘 애니메이션을 위해 스택 제거와 분리해 관리합니다. */
	open: boolean;
	/** 정산(resolve) 완료 여부. 중복 닫힘 가드. */
	settled: boolean;
	/** 제출/가드 실행 중 여부. 재진입(ESC 연타 등) 차단. */
	pending: boolean;
	/** shell footer 전체 로딩 */
	loading: boolean;
	/** shell footer 확인 버튼만 비활성 */
	confirmDisabled: boolean;
	/** Promise resolve. settle() 이 유일하게 호출합니다. */
	resolve: (value: unknown) => void;
}

interface IDialogStackState {
	/** LIFO 스택. 전 항목을 동시에 렌더합니다(중첩 허용). */
	stack: IDialogStackItem[];
	/** 스택 맨 뒤에 추가 */
	push: (item: IDialogStackItem) => void;
	/** 항목의 임의 필드 갱신 */
	patchItem: (id: string, patch: Partial<IDialogStackItem>) => void;
	/** props 얕은 병합 */
	mergeProps: (id: string, props: Record<string, unknown>) => void;
	/** 옵션 얕은 병합 */
	mergeOption: (id: string, option: Partial<IDialogOption<unknown>>) => void;
	/** 스택에서 제거 */
	remove: (id: string) => void;
}

export const useDialogStackStore = create<IDialogStackState>((set) => ({
	stack: [],
	push: (item) => set((state) => ({ stack: [...state.stack, item] })),
	patchItem: (id, patch) =>
		set((state) => ({
			stack: state.stack.map((it) => (it.id === id ? { ...it, ...patch } : it)),
		})),
	mergeProps: (id, props) =>
		set((state) => ({
			stack: state.stack.map((it) => (it.id === id ? { ...it, props: { ...it.props, ...props } } : it)),
		})),
	mergeOption: (id, option) =>
		set((state) => ({
			stack: state.stack.map((it) => (it.id === id ? { ...it, option: { ...it.option, ...option } } : it)),
		})),
	remove: (id) => set((state) => ({ stack: state.stack.filter((it) => it.id !== id) })),
}));

/** 스택에서 id 로 항목을 찾습니다. (React 밖에서 쓰는 명령형 조회) */
export function getDialogItem(id: string): IDialogStackItem | undefined {
	return useDialogStackStore.getState().stack.find((it) => it.id === id);
}

/**
 * 컨텐츠가 등록하는 런타임 핸들러 모음.
 *
 * 제출/가드 핸들러는 렌더마다 새 클로저가 만들어지므로 스토어(상태)가 아니라
 * 여기 모듈 레벨 Map 에 ref 형태로 보관합니다. useDialogSubmit / useDialogGuard 가
 * 매 렌더마다 최신 함수로 덮어쓰므로 **stale closure 가 생기지 않습니다**.
 */
export interface IDialogRuntime {
	submit: (() => any) | null;
	guard: ((result: any) => boolean | Promise<boolean>) | null;
}

const runtimes = new Map<string, IDialogRuntime>();

/** 항목의 런타임 슬롯을 얻습니다. 없으면 만들어 반환합니다. */
export function getDialogRuntime(id: string): IDialogRuntime {
	let runtime = runtimes.get(id);
	if (!runtime) {
		runtime = { submit: null, guard: null };
		runtimes.set(id, runtime);
	}
	return runtime;
}

/** 항목이 스택에서 사라질 때 런타임 슬롯도 정리합니다. */
export function clearDialogRuntime(id: string): void {
	runtimes.delete(id);
}
