/**
 * 전역 오버레이($ui.alert · $ui.confirm · $ui.dialog)의 **껍데기 디자인** 모음.
 *
 * 동작(닫기 경로 · 큐 · 스택 · 가드)은 `src/core/ui` 가 담당하고, 여기에는 마크업과 스타일만 있습니다.
 * SI 프로젝트에서 사이트 스타일을 입힐 때는 이 폴더만 고치면 됩니다.
 *
 * 각 파일 상단에 "자유롭게 바꿔도 되는 것 / 건드리면 안 되는 것"이 적혀 있습니다.
 */

export { default as DialogSkin } from './DialogSkin';
export { default as AlertSkin } from './AlertSkin';
export { default as DialogErrorFallback } from './DialogErrorFallback';
export {
	Z_DIALOG_BASE,
	Z_DIALOG_STEP,
	Z_ALERT,
	Z_TOAST,
	CLOSE_ANIM_MS,
	getDialogZIndex,
} from './overlay-layers';
export type { IDialogSkinProps } from './DialogSkin';
export type { IAlertSkinProps } from './AlertSkin';
