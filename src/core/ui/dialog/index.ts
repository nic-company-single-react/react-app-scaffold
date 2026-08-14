/**
 * $ui.dialog 내부 모듈 배럴.
 *
 * 화면 코드는 `@/core/ui` 배럴에서 가져다 쓰세요. (여기는 core 내부용)
 */

export { default as UIDialogStackHost } from './UIDialogStackHost';
export { default as UIDialogShell } from './UIDialogShell';
export { default as DialogRouterBridge } from './DialogRouterBridge';
export { defineDialog } from './defineDialog';
export { DialogContext } from './DialogContext';
export { useDialog, useDialogSafe, useDialogSubmit, useDialogGuard } from './useDialog';
export { useLiveProps, isLiveProps } from './useLiveProps';
export {
	openDialog,
	requestCloseDialog,
	settleDialog,
	updateDialogProps,
	patchDialogOption,
	closeAllDialogs,
	countOpenDialogs,
	isDialogOpen,
} from './dialogController';
export { useDialogStackStore, getDialogItem } from './dialogStore';
export type { IDialogStackItem } from './dialogStore';
