import { useUIStore } from './alert/alertStore';
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
	TDialogCallOption,
	TDialogHandle,
	IUI,
} from '@/types/components';

/* ── 폴더 구성 ────────────────────────────────────────────────────────────────
 * 전역 UI 는 **분야(전역 컴포넌트) 단위로 폴더**를 나눈다. 새 전역 컴포넌트가
 * 늘어나도 같은 규칙으로 폴더 하나만 추가하면 된다.
 *
 *   core/ui/index.ts   ← $ui 조립 + 호스트 re-export. **유일한 공개 표면**
 *   core/ui/UIHosts    ← 호스트 묶음 (AppProviders 가 이것 하나만 렌더)
 *   core/ui/createId   ← 분야에 속하지 않는 공용 leaf
 *   core/ui/alert/     ← $ui.alert + $ui.confirm (confirm 은 alert 의 kind 변종)
 *   core/ui/dialog/    ← $ui.dialog 스택
 *   core/ui/toast/     ← 전역 토스트 호스트
 *
 * 규칙 두 가지:
 *   1. 분야 폴더 안에 barrel(index.ts) 을 두지 않는다. 공개 표면은 이 파일 하나다.
 *   2. 파일명 접두사는 유지한다(`alert/alertStore.ts`). 폴더가 구분해 주더라도
 *      에디터 탭 제목은 파일명뿐이라 `store.ts` 가 여럿이면 구분되지 않는다.
 *
 * 모양(스킨)은 core 가 아니라 `src/shared/ui/overlay/*Skin.tsx` 가 담당한다.
 * ------------------------------------------------------------------------- */

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
	const dialog = ((option: TDialogCallOption<unknown, Record<string, unknown>>) => {
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

/* ── 화면 코드에서 쓰는 공개 관련 ────────────────────────────────────────────
 * $ui와 관련된 alert, confirm, dialog 에서 사용하는 훅의 창구는 `@axiom/hooks` 입니다.
 * $ui 자체는 전역이라 import 가 필요 없습니다.
 *
 *   import { useDialog, useDialogSubmit, useDialogGuard, useLiveProps } from '@axiom/hooks';
 * ------------------------------------------------------------------------- */

/* ── 호스트 (AppProviders 전용) ─────────────────────────────────────────── */
export { UIHosts } from './UIHosts';
export { UIAlertHost } from './alert/UIAlertHost';
export { default as UIDialogStackHost } from './dialog/UIDialogStackHost';
export { AppToaster } from './toast/AppToaster';
