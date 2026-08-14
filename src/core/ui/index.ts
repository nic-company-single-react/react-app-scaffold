import { useUIStore } from './store';
import { createId } from './createId';
import {
	closeAllDialogs,
	countOpenDialogs,
	isDialogOpen,
	openDialog,
	patchDialogOption,
	requestCloseDialog,
	updateDialogProps,
} from './dialog/dialogController';
import type {
	IAlertDialogOption,
	IConfirmDialogOption,
	IDialogApi,
	IDialogControls,
	IDialogOption,
	TAnyDialogComponent,
	TDialogHandle,
	TDialogProps,
	IUI,
} from '@/types/components';

/**
 * 첫 인자(string | option) + 두번째 인자(option)를 단일 옵션으로 병합하고
 * id 가 없으면 자동으로 부여합니다.
 */
function normalize<T extends IAlertDialogOption>(message?: string | T, option?: T): T {
	const base = (typeof message === 'object' ? message : { message }) as T;
	const merged = { ...base, ...option } as T; // 두번째 인자가 우선
	merged.id ??= createId();
	return merged;
}

/**
 * $ui.dialog 를 만듭니다.
 *
 * 반환값은 **진짜 Promise** 에 제어 메서드를 얹은 핸들입니다.
 * `Object.assign` 이므로 await / then / catch / finally 가 그대로 동작합니다.
 */
function createDialogApi(): IDialogApi {
	const dialog = ((option: IDialogOption<unknown> & { component: TAnyDialogComponent; props?: TDialogProps }) => {
		const { component, props, ...rest } = option;

		let settle!: (value: unknown) => void;
		const promise = new Promise<unknown>((resolve) => {
			settle = resolve;
		});

		const id = openDialog(component, props ?? {}, rest, settle);

		const controls: IDialogControls<unknown, Record<string, unknown>> = {
			id,
			update: (next) => updateDialogProps(id, next as Record<string, unknown>),
			patch: (next) => patchDialogOption(id, next),
			// 코드에서 닫는 경로는 항상 beforeClose 를 우회한다.
			// (호출한 쪽이 이미 닫기로 결정했으므로 가드가 막으면 Promise 가 누수된다)
			close: (data) => void requestCloseDialog(id, 'programmatic', data),
			cancel: () => void requestCloseDialog(id, 'programmatic'),
			isOpen: () => isDialogOpen(id),
		};

		return Object.assign(promise, controls) as TDialogHandle<unknown, Record<string, unknown>>;
	}) as IDialogApi;

	dialog.close = (id, reason = 'programmatic') => void requestCloseDialog(id, reason);
	dialog.closeAll = (reason = 'programmatic') => closeAllDialogs(reason);
	dialog.count = () => countOpenDialogs();

	return dialog;
}

/**
 * 전역 $ui 객체를 생성합니다.
 *
 * 각 함수는 다이얼로그를 큐/스택에 넣고, 사용자가 닫을 때 resolve 되는 Promise 를 반환합니다.
 * - alert: Promise<void>
 * - confirm: Promise<boolean> (확인=true, 그 외=false)
 * - dialog: Promise<T | undefined> + 제어 메서드 (취소/ESC/X/배경 = undefined)
 */
export function createWindowUI(): IUI {
	return {
		alert: (message?: string | IAlertDialogOption, option?: IAlertDialogOption) =>
			new Promise<void>((resolve) =>
				useUIStore.getState().enqueue({
					kind: 'alert',
					option: normalize(message, option),
					resolve,
				}),
			),
		confirm: (message?: string | IConfirmDialogOption, option?: IConfirmDialogOption) =>
			new Promise<boolean>((resolve) =>
				useUIStore.getState().enqueue({
					kind: 'confirm',
					option: normalize(message, option),
					resolve,
				}),
			),
		dialog: createDialogApi(),
	};
}

/** 전역 $ui 등록 (window.$ui) */
export function registerWindowUI(): void {
	window.$ui = createWindowUI();
}

/* ── 화면 코드에서 쓰는 공개 표면 ────────────────────────────────────────────
 * $ui 자체는 전역이라 import 가 필요 없습니다.
 *
 * ⚠️ **훅은 여기서 내보내지 않습니다.** 스캐폴드가 제공하는 훅의 창구는 `@axiom/hooks` 하나입니다.
 *   import { defineDialog } from '@/core/ui';
 *   import { useDialog, useDialogSubmit, useLiveProps } from '@axiom/hooks';
 * ------------------------------------------------------------------------- */
export { defineDialog } from './dialog/defineDialog';

/* ── 호스트 (AppProviders 전용) ─────────────────────────────────────────── */
export { UIHosts } from './UIHosts';
export { UIAlertHost } from './UIAlertHost';
export { default as UIDialogStackHost } from './dialog/UIDialogStackHost';
export { AppToaster } from './AppToaster';
