import { createId } from '../createId';
import { CLOSE_ANIM_MS } from '@/shared/ui/overlay/overlay-layers';
import {
	clearDialogRuntime,
	getDialogItem,
	getDialogRuntime,
	useDialogStackStore,
	type IDialogStackItem,
} from './dialogStore';
import { isLiveProps } from './useLiveProps';
import type {
	IDialogFooterOption,
	IDialogOption,
	IDialogResult,
	TAnyDialogComponent,
	TDialogProps,
	TDialogReason,
} from '@/types/components';

/**
 * $ui.dialog 의 유일한 오케스트레이션 지점.
 *
 * 열기 · 닫기 요청 · 정산(resolve) · 갱신이 모두 여기를 통과합니다.
 * Radix 에게 닫기 결정권을 주지 않고 requestClose() 하나로 일원화해야
 * beforeClose 가드가 무력화되지 않습니다.
 */

/** 닫힘 애니메이션 후 제거를 예약한 타이머. 항목별로 분리해야 중첩 시 엉키지 않는다. */
const removeTimers = new Map<string, ReturnType<typeof setTimeout>>();

/**
 * $ui.dialog 스택 최대 깊이. 초과하면 열지 않고 즉시 undefined 로 정산한다.
 *
 * 디자인 값이 아니라 재귀 폭주 방어 장치다 — 컨텐츠 렌더 중 dialog 를 여는 실수로
 * 무한히 스택이 쌓이는 것을 막는다. 그래서 z-index 토큰이 아니라 여기에 둔다.
 */
export const MAX_STACK_DEPTH = 20;

/** 사용자가 직접 닫으려는 경로 — dismissable:false 로 잠글 수 있다. */
const USER_DISMISS_REASONS: ReadonlySet<TDialogReason> = new Set(['escape', 'overlay', 'close', 'autoDismiss']);

/** 가드(beforeClose)를 건너뛰는 경로 — 이미 확정된 사실이거나 코드가 명시적으로 닫는 경우. */
const GUARD_BYPASS_REASONS: ReadonlySet<TDialogReason> = new Set(['programmatic', 'route', 'error']);

/** 현재 pathname 스냅샷. $router 가 아직 등록 전이면 빈 문자열. */
function currentPathname(): string {
	try {
		return window.$router?.getLocation().pathname ?? '';
	} catch {
		return '';
	}
}

/** 옵션에 기본값을 채웁니다. */
function withDefaults(option: IDialogOption<unknown>): IDialogOption<unknown> {
	return {
		size: 'md',
		scrollable: true,
		showCloseButton: true,
		closeOnEscape: true,
		closeOnOverlayClick: true,
		dismissable: true,
		closeOnRouteChange: true,
		stableCallbacks: true,
		...option,
	};
}

/**
 * 다이얼로그를 열고 스택에 추가합니다.
 * @returns resolve 콜백을 넘겨받을 수 있도록 id 와 정산 함수를 돌려줍니다.
 */
export function openDialog(
	component: TAnyDialogComponent,
	props: TDialogProps,
	rawOption: IDialogOption<unknown>,
	resolve: (value: unknown) => void,
): string {
	const id = rawOption.id ?? createId();
	const { stack } = useDialogStackStore.getState();

	// 재귀 폭주 방어 — 컨텐츠 렌더 중 dialog 를 여는 실수로 무한 스택이 쌓이는 것을 막는다.
	if (stack.length >= MAX_STACK_DEPTH) {
		console.error(
			`[$ui.dialog] 스택 깊이가 상한(${MAX_STACK_DEPTH})에 도달해 열지 않습니다. 컨텐츠 렌더 중 dialog 를 여는 코드가 없는지 확인하세요.`,
		);
		resolve(undefined);
		return id;
	}

	// 같은 id 가 이미 있으면 새로 열지 않고 즉시 정산한다.
	if (stack.some((it) => it.id === id)) {
		console.error(`[$ui.dialog] 이미 열려 있는 id 입니다: ${id}`);
		resolve(undefined);
		return id;
	}

	const item: IDialogStackItem = {
		id,
		component,
		props,
		option: withDefaults(rawOption),
		openedPathname: currentPathname(),
		open: true,
		settled: false,
		pending: false,
		loading: false,
		confirmDisabled: false,
		resolve,
	};

	getDialogRuntime(id); // 런타임 슬롯 미리 생성
	useDialogStackStore.getState().push(item);
	return id;
}

/**
 * Promise 를 정산하고 닫힘 애니메이션 후 스택에서 제거합니다.
 *
 * 불변식:
 * 1. `settled` 플래그로 첫 호출만 유효 — 중복 resolve 를 막는다.
 * 2. **절대 reject 하지 않는다** — 아무도 await 하지 않는 handle 에서 unhandled rejection 이 터지는 것을 막는다.
 * 3. resolve 는 exit 애니메이션보다 **먼저** 한다 — 사용자 코드를 150ms 기다리게 하지 않는다.
 */
export function settleDialog(id: string, reason: TDialogReason, data?: unknown): void {
	const item = getDialogItem(id);
	if (!item || item.settled) return;

	const { patchItem, remove } = useDialogStackStore.getState();
	patchItem(id, { settled: true, open: false, pending: false });

	const confirmed = reason === 'confirm' || reason === 'submit';
	const result: IDialogResult<unknown> = { id, confirmed, reason, data };

	// onClose 가 던져도 정산 자체는 계속되어야 한다.
	try {
		item.option.onClose?.(result);
	} catch (error) {
		console.error('[$ui.dialog] onClose 콜백에서 오류가 발생했습니다.', error);
	}

	item.resolve(data);

	const existing = removeTimers.get(id);
	if (existing) clearTimeout(existing);
	removeTimers.set(
		id,
		setTimeout(() => {
			removeTimers.delete(id);
			clearDialogRuntime(id);
			remove(id);
		}, CLOSE_ANIM_MS),
	);
}

/**
 * 모든 닫기 경로의 단일 진입점.
 *
 * dismissable 검사 → (확인 경로면) 제출 핸들러 → beforeClose 가드 → 정산 순으로 진행합니다.
 */
export async function requestCloseDialog(id: string, reason: TDialogReason, data?: unknown): Promise<void> {
	const item = getDialogItem(id);
	if (!item || item.settled || item.pending) return;

	// dismissable:false 는 가드보다 앞단에서 사용자 닫기를 차단한다.
	// (handle.close() / closeAll() 같은 programmatic 경로는 통과해야 Promise 누수가 없다)
	if (item.option.dismissable === false && USER_DISMISS_REASONS.has(reason)) return;

	const { patchItem } = useDialogStackStore.getState();
	const runtime = getDialogRuntime(id);
	let payload = data;

	patchItem(id, { pending: true });

	try {
		// shell footer '확인' — 컨텐츠가 등록한 제출 핸들러가 결과를 만든다.
		if (reason === 'confirm') {
			if (runtime.submit) {
				patchItem(id, { loading: true });
				const submitted = await runtime.submit();
				patchItem(id, { loading: false });
				// undefined = 검증 실패 → 닫지 않는다.
				if (submitted === undefined) {
					patchItem(id, { pending: false });
					return;
				}
				payload = submitted;
			} else {
				const footer = item.option.footer;
				const footerOption = isFooterOption(footer) ? footer : undefined;
				payload = footerOption?.confirmValue ?? true;
			}
		}

		// beforeClose 가드 — 컨텐츠가 등록한 것(useDialogGuard)이 옵션보다 우선한다.
		if (!GUARD_BYPASS_REASONS.has(reason)) {
			const guard = runtime.guard ?? item.option.beforeClose;
			if (guard) {
				const confirmed = reason === 'confirm' || reason === 'submit';
				const allowed = await guard({ id, confirmed, reason, data: payload });
				if (!allowed) {
					patchItem(id, { pending: false });
					return;
				}
			}
		}
	} catch (error) {
		// 닫히지 않는 모달이 최악이므로 fail-open 한다.
		console.error('[$ui.dialog] 제출/가드 처리 중 오류가 발생했습니다. 다이얼로그를 닫습니다.', error);
		patchItem(id, { loading: false });
	}

	settleDialog(id, reason, payload);
}

/** footer 옵션이 객체 설정인지 판별합니다. (ReactNode / false 와 구분) */
export function isFooterOption(footer: unknown): footer is IDialogFooterOption<unknown> {
	if (footer === false || footer === null || footer === undefined) return false;
	if (typeof footer !== 'object') return false;
	// ReactNode(엘리먼트/배열)는 footer 설정 객체가 아니다.
	if (Array.isArray(footer)) return false;
	if ('$$typeof' in (footer as Record<string, unknown>)) return false;
	return true;
}

/** props 를 얕은 병합으로 갱신합니다. */
export function updateDialogProps(id: string, props: Record<string, unknown>): void {
	const item = getDialogItem(id);
	if (!item || item.settled) return;

	// 살아있는 props 는 페이지 렌더가 원본이다. 여기서 덮어쓰면 다음 렌더에 곧바로 되돌아가므로
	// 조용히 무시하지 않고 알려준다.
	if (isLiveProps(item.props)) {
		console.error('[$ui.dialog] useLiveProps 로 넘긴 props 는 update() 로 바꿀 수 없습니다. 원본 state 를 바꾸세요.');
		return;
	}

	useDialogStackStore.getState().mergeProps(id, props);
}

/** 껍데기 옵션을 얕은 병합으로 갱신합니다. */
export function patchDialogOption(id: string, option: Partial<IDialogOption<unknown>>): void {
	const item = getDialogItem(id);
	if (!item || item.settled) return;
	useDialogStackStore.getState().mergeOption(id, option);
}

/**
 * 항목의 표시 상태(로딩/확인 비활성)를 갱신합니다.
 *
 * 컨텐츠가 렌더 도중 `dialog.setConfirmDisabled(...)` 를 부를 수 있으므로 갱신을 마이크로태스크로
 * 미룬다. (렌더 중 다른 컴포넌트의 상태를 바꾸면 React 가 경고한다) 마이크로태스크는 FIFO 라
 * 호출 순서는 그대로 보존된다.
 */
export function setDialogFlag(id: string, patch: Partial<Pick<IDialogStackItem, 'loading' | 'confirmDisabled'>>): void {
	queueMicrotask(() => {
		const item = getDialogItem(id);
		if (!item || item.settled) return;
		// 값이 같으면 갱신하지 않는다 (불필요한 리렌더 방지)
		if (Object.entries(patch).every(([key, value]) => item[key as keyof IDialogStackItem] === value)) return;
		useDialogStackStore.getState().patchItem(id, patch);
	});
}

/** 열려 있는 모든 dialog 를 닫습니다. (가드 우회, 각각 undefined 로 정산) */
export function closeAllDialogs(reason: TDialogReason = 'programmatic'): void {
	const { stack } = useDialogStackStore.getState();
	// 위에서부터 닫아 스택 순서를 유지한다.
	for (const item of [...stack].reverse()) {
		if (!item.settled) settleDialog(item.id, reason);
	}
}

/** 현재 열려 있는(정산 전) dialog 개수 */
export function countOpenDialogs(): number {
	return useDialogStackStore.getState().stack.filter((it) => !it.settled).length;
}

/** 아직 열려 있는지 */
export function isDialogOpen(id: string): boolean {
	const item = getDialogItem(id);
	return !!item && !item.settled;
}
