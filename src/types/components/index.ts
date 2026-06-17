/**
 * 전역 $ui 타입 정의
 *
 * window.$ui 로 제공되는 전역 UI 헬퍼($ui.alert / $ui.confirm)의 타입입니다.
 * $util(@/types/common) / $router(@/types/router)와 동일하게,
 * 구현은 src/core/ui 에 위치합니다.
 */

/** 다이얼로그 종류별 아이콘·색상 구분 */
export type TUIDialogType = 'success' | 'info' | 'warning' | 'error';

/** 다이얼로그가 닫힌 경로 */
export type TDialogReason =
	| 'confirm' // '확인' 버튼
	| 'cancel' // '취소' 버튼 (confirm 전용)
	| 'close' // 우상단 X 버튼
	| 'escape' // ESC 키
	| 'autoDismiss'; // 자동 닫힘

/** 닫힘 시 onClose 로 전달되는 결과 */
export interface IDialogResult {
	/** 다이얼로그 고유값 */
	id: string;
	/** reason === 'confirm' 여부 */
	confirmed: boolean;
	/** 닫힌 경로 */
	reason: TDialogReason;
}

/** $ui.alert 옵션 */
export interface IAlertDialogOption {
	/** 고유 식별자 (미지정 시 자동 생성) */
	id?: string;
	/** 아이콘/색상 (지정 시 해당 아이콘이 표시됨) */
	type?: TUIDialogType;
	/**
	 * 아이콘 표시 여부.
	 * 미지정 시 기본은 숨김이며, `type` 을 지정하면 자동으로 표시됩니다.
	 * `icon: true`(type 없이 강제 표시) / `icon: false`(type 있어도 강제 숨김)로 덮어쓸 수 있습니다.
	 */
	icon?: boolean;
	/** 우상단 X(닫기) 버튼 표시 여부 (기본: false) */
	close?: boolean;
	/** 본문 (첫 인자가 옵션객체일 때 사용) */
	message?: string;
	/** 제목 (기본: type별 기본 제목) */
	title?: string;
	/** 지정 시 N밀리초(ms) 후 자동 닫기 */
	autoDismiss?: number;
	/** 확인 버튼 문구 (기본: '확인') */
	confirmText?: string;
	/** 닫힘 상세 정보 콜백 (opt-in) */
	onClose?: (result: IDialogResult) => void;
}

/** $ui.confirm 옵션 */
export interface IConfirmDialogOption extends IAlertDialogOption {
	/** 취소 버튼 문구 (기본: '취소') */
	cancelText?: string;
}

/**
 * $ui.alert - 알림 다이얼로그를 띄웁니다.
 * 첫 인자는 문자열 메시지 또는 옵션객체로 오버로드됩니다.
 */
export type TAlertDialog = (
	message?: string | IAlertDialogOption,
	option?: IAlertDialogOption,
) => Promise<void>;

/**
 * $ui.confirm - 확인/취소 다이얼로그를 띄웁니다.
 * 확인 시 true, 그 외(취소/X/ESC/autoDismiss) false 로 resolve 됩니다.
 */
export type TConfirmDialog = (
	message?: string | IConfirmDialogOption,
	option?: IConfirmDialogOption,
) => Promise<boolean>;

/** 전역 $ui 루트 타입 */
export interface IUI {
	alert: TAlertDialog;
	confirm: TConfirmDialog;
}
