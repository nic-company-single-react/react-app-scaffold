/**
 * 전역 $ui 타입 정의
 *
 * window.$ui 로 제공되는 전역 UI 헬퍼($ui.alert / $ui.confirm / $ui.dialog)의 타입입니다.
 * $util(@/types/common) / $router(@/types/router)와 동일하게,
 * 구현은 src/core/ui 에 위치합니다.
 */

import type { ComponentType, CSSProperties, ReactNode } from 'react';

/** 다이얼로그 종류별 아이콘·색상 구분 */
export type TUIDialogType = 'success' | 'info' | 'warning' | 'error';

/**
 * 다이얼로그가 닫힌 경로.
 *
 * 앞의 다섯은 alert/confirm 과 공유하고, 뒤쪽은 $ui.dialog 전용입니다.
 * ※ 값을 추가할 때는 이 유니온을 exhaustive 하게 다루는 소비자가 없는지 확인하세요.
 */
export type TDialogReason =
	| 'confirm' // '확인' 버튼
	| 'cancel' // '취소' 버튼 (confirm 전용)
	| 'close' // 우상단 X 버튼
	| 'escape' // ESC 키
	| 'autoDismiss' // 자동 닫힘
	| 'overlay' // 배경(오버레이) 클릭 — $ui.dialog
	| 'submit' // 컨텐츠가 close(data) 로 결과 제출 — $ui.dialog
	| 'programmatic' // handle.close() / $ui.dialog.closeAll() — $ui.dialog
	| 'route' // 라우트 변경으로 자동 닫힘 — $ui.dialog
	| 'error'; // 컨텐츠 렌더/청크 로드 실패 — $ui.dialog

/**
 * 닫힘 시 onClose 로 전달되는 결과.
 *
 * @typeParam T $ui.dialog 의 결과 타입. alert/confirm 은 결과값이 없으므로 기본 never 입니다.
 *              (기본 인자 덕분에 기존 `IDialogResult` 표기는 그대로 유효합니다)
 */
export interface IDialogResult<T = never> {
	/** 다이얼로그 고유값 */
	id: string;
	/** reason 이 'confirm' | 'submit' 인지 여부 */
	confirmed: boolean;
	/** 닫힌 경로 */
	reason: TDialogReason;
	/** $ui.dialog 전용 — 컨텐츠가 넘긴 결과값 */
	data?: T;
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

/* ─────────────────────────────────────────────────────────────────────────────
 * $ui.dialog — 임의의 React 컴포넌트를 모달로 띄우고 결과를 await 로 받는 API
 * ───────────────────────────────────────────────────────────────────────────── */

/** 다이얼로그 폭 프리셋 */
export type TDialogSize = 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full';

/** 닫기 가드 — false 를 반환하면 닫히지 않습니다. */
export type TDialogGuard<T = unknown> = (result: IDialogResult<T>) => boolean | Promise<boolean>;

/**
 * shell footer 의 '확인' 이 호출하는 제출 핸들러.
 * 반환값이 곧 $ui.dialog 의 결과이며, `undefined` 를 반환하면 **닫지 않습니다**(검증 실패).
 */
export type TDialogSubmit<T = unknown> = () => T | undefined | Promise<T | undefined>;

/** shell 이 그리는 기본 푸터 설정 */
export interface IDialogFooterOption<T = unknown> {
	/** 확인 버튼 문구 (기본: '확인') */
	confirmText?: string;
	/** 취소 버튼 문구 (기본: '취소') */
	cancelText?: string;
	/** 취소 버튼 숨김 (기본: false) */
	hideCancel?: boolean;
	/** 확인 버튼 variant (기본: 'default') */
	confirmVariant?: 'default' | 'destructive' | 'outline' | 'secondary' | 'ghost' | 'link';
	/** 제출 핸들러가 등록되지 않았을 때 확인 클릭이 resolve 할 값 (기본: true) */
	confirmValue?: T;
}

/** 컨텐츠와 무관한 다이얼로그 껍데기 옵션 */
export interface IDialogOption<T = unknown> {
	/** 고유 식별자 (미지정 시 자동 생성) */
	id?: string;
	/** 제목. 미지정 시 접근성용 sr-only 타이틀이 자동 삽입됩니다. */
	title?: ReactNode;
	/** 제목 아래 보조 설명 */
	description?: ReactNode;
	/** 폭 프리셋 (기본: 'md') */
	size?: TDialogSize;
	/** 본문에 최대 높이 + 스크롤 적용 (기본: true) */
	scrollable?: boolean;
	/** DialogContent 에 추가할 클래스 */
	className?: string;
	/** Overlay(딤 배경)에 추가할 클래스 */
	overlayClassName?: string;
	/** 본문 래퍼에 추가할 클래스 */
	bodyClassName?: string;
	/** 우상단 X 버튼 표시 (기본: true) */
	showCloseButton?: boolean;
	/** ESC 로 닫기 (기본: true) */
	closeOnEscape?: boolean;
	/** 배경 클릭으로 닫기 (기본: true) */
	closeOnOverlayClick?: boolean;
	/** false 면 ESC · 배경 · X 를 모두 잠급니다 (기본: true). 저장 중 이탈 방지용 마스터 스위치. */
	dismissable?: boolean;
	/** 지정 시 N밀리초(ms) 후 자동 닫기 */
	autoDismiss?: number;
	/** 라우트(pathname) 변경 시 자동으로 닫기 (기본: true) */
	closeOnRouteChange?: boolean;
	/**
	 * 함수형 props 를 안정 identity 프록시로 감싸 stale closure 를 막습니다 (기본: true).
	 * 함수 identity 비교에 의존하는 특수한 경우에만 false 로 끕니다.
	 */
	stableCallbacks?: boolean;
	/**
	 * 하단 푸터. 미지정이면 shell 이 확인/취소를 그립니다.
	 * - `false`     → 컨텐츠가 직접 그림
	 * - `ReactNode` → 그대로 렌더
	 * - 객체        → shell 이 그리되 문구/variant 를 지정
	 */
	footer?: ReactNode | IDialogFooterOption<T> | false;
	/** 닫기 직전 가드. false 반환 시 닫히지 않습니다. (reason 'route' 는 우회) */
	beforeClose?: TDialogGuard<T>;
	/** 닫힘 상세 정보 콜백 (opt-in) */
	onClose?: (result: IDialogResult<T>) => void;
}

/**
 * 본문으로 렌더할 컴포넌트.
 *
 * **평범한 React 컴포넌트**면 됩니다. 다이얼로그 전용으로 감쌀 필요가 없고,
 * 페이지 안에 그대로 박아 써도 똑같이 동작합니다.
 * 제어(닫기·제출·가드)가 필요하면 컴포넌트 안에서 `useDialog()` 를 부르세요.
 */
export type TAnyDialogComponent = ComponentType<any>;

/**
 * `useLiveProps(...)` 가 만드는 **살아있는 props 상자**.
 *
 * `$ui.dialog` 는 명령형 호출이라 `props` 가 열린 시점 스냅샷으로 굳습니다.
 * 열려 있는 동안에도 바탕 페이지의 state 를 따라가야 하면 그 값들을 이 상자로 감싸 넘기고,
 * 셸이 상자를 구독해 **평범한 props 로 풀어서** 컨텐츠에 내려줍니다.
 * → 컨텐츠 컴포넌트는 상자의 존재를 알 필요가 없습니다.
 */
export interface ILivePropsBox<P extends object = Record<string, unknown>> {
	/** 평범한 props 객체와 구분하는 브랜드. */
	readonly __liveProps: true;
	/** 값이 실제로 바뀐 렌더에서만 리스너를 호출합니다. */
	subscribe(listener: () => void): () => void;
	/** useSyncExternalStore 용 스냅샷 — 값이 바뀌기 전까지 identity 가 고정됩니다. */
	getSnapshot(): P;
	/** 항상 최신 객체 — 함수형 prop 을 최신 클로저로 호출할 때 씁니다. */
	getLatest(): P;
}

/** 컨텐츠에 넘길 props — 평범한 객체이거나 `useLiveProps` 가 만든 살아있는 상자. */
export type TDialogProps = Record<string, unknown> | ILivePropsBox;

/** $ui.dialog 옵션 (껍데기 옵션 + component + props) */
export type TDialogCallOption<T, P extends object> = IDialogOption<T> & {
	/**
	 * 본문으로 렌더할 컴포넌트.
	 * 코드분할이 필요하면 `loadable(() => import('...'))` 결과를 넘깁니다.
	 * (함수 컴포넌트와 import 썽크는 런타임에 구분할 수 없으므로 썽크를 직접 넘기면 안 됩니다)
	 */
	component: TAnyDialogComponent;
	/**
	 * 컨텐츠에 넘길 props. 호출 시점 스냅샷이며 이후 갱신은 `handle.update()` 입니다.
	 * 열려 있는 동안 바탕 페이지의 state 를 계속 따라가야 하면 `useLiveProps(...)` 로 감싸 넘깁니다.
	 */
	props?: P | ILivePropsBox<P>;
};

/** $ui.dialog 반환 핸들의 제어부 */
export interface IDialogControls<T = unknown, P = Record<string, unknown>> {
	/** 이 다이얼로그의 id */
	readonly id: string;
	/** 열려 있는 다이얼로그의 props 를 부분 갱신합니다. */
	update(props: Partial<P>): void;
	/** 껍데기 옵션(title / size / dismissable 등)을 부분 갱신합니다. */
	patch(option: Partial<IDialogOption<T>>): void;
	/**
	 * 코드에서 닫습니다. (reason 'programmatic')
	 * 호출한 쪽이 이미 닫기로 결정한 것이므로 `beforeClose` 가드와 `dismissable: false` 를 **우회**합니다.
	 * (가드가 막으면 Promise 가 누수되기 때문입니다)
	 */
	close(data?: T): void;
	/** 결과 없이 닫습니다. close() 와 동일하게 가드를 우회하며 undefined 로 resolve 됩니다. */
	cancel(): void;
	/** 아직 열려 있는지 */
	isOpen(): boolean;
}

/**
 * $ui.dialog 의 반환값.
 * 진짜 Promise 이므로 await / then / catch / finally 가 모두 되고,
 * 동시에 update · close 등 제어 메서드를 갖습니다.
 */
export type TDialogHandle<T = unknown, P = Record<string, unknown>> = Promise<T | undefined> & IDialogControls<T, P>;

/**
 * $ui.dialog — 임의 컴포넌트를 모달로 띄우고 결과를 돌려받습니다.
 *
 * 결과 타입은 **호출부에서 지정**합니다. 컴포넌트를 감싸는 헬퍼는 필요 없습니다.
 *
 * ```ts
 * // 결과를 쓰는 경우 — 타입 인자로 결과 타입을 준다
 * const member = await $ui.dialog<IMember>({ component: MemberPicker, props: { deptId: 3 } });
 * //    ^? IMember | undefined
 *
 * // 결과를 안 쓰는 경우 — 타입 인자를 생략하면 props 타입이 추론되어 update() 가 체크된다
 * const d = $ui.dialog({ component: UploadProgress, props: { percent: 0 } });
 * d.update({ percent: 50 });
 * ```
 *
 * ⚠️ 타입 인자를 명시하면 `P` 는 추론되지 않고 기본값(`Record<string, unknown>`)이 됩니다.
 *    TypeScript 가 타입 인자를 일부만 받아 나머지를 추론해 주지 않기 때문입니다.
 *    결과 타입과 props 타입을 동시에 좁히고 싶으면 두 인자를 모두 적으세요.
 */
export interface IDialogApi {
	<T = unknown, P extends object = Record<string, unknown>>(option: TDialogCallOption<T, P>): TDialogHandle<T, P>;
	/** 특정 id 의 dialog 를 닫습니다. (기본 reason 'programmatic' — beforeClose 를 우회합니다) */
	close(id: string, reason?: TDialogReason): void;
	/** 열려 있는 모든 dialog 를 닫습니다. (beforeClose 우회, 각각 undefined 로 resolve) */
	closeAll(reason?: TDialogReason): void;
	/** 현재 열려 있는 dialog 개수 */
	count(): number;
}

/** 컨텐츠 내부에서 쓰는 제어 API — `useDialog()` 로 얻습니다. */
export interface IDialogApiHandle<T = unknown> {
	/** 이 다이얼로그의 id */
	readonly id: string;
	/** 스택 깊이 (0 = 최하단) */
	readonly depth: number;
	/** 현재 최상단 다이얼로그인지 */
	readonly isTop: boolean;
	/** 결과값과 함께 닫습니다. (data 있으면 reason 'submit', 없으면 'close') */
	close(data?: T): void;
	/** 취소로 닫습니다. (reason 'cancel') */
	cancel(): void;
	setTitle(title: ReactNode): void;
	setDescription(description: ReactNode): void;
	setSize(size: TDialogSize): void;
	/** shell footer 버튼 전체 로딩/비활성 */
	setLoading(loading: boolean): void;
	/** shell footer 확인 버튼만 비활성 */
	setConfirmDisabled(disabled: boolean): void;
	/** ESC · 배경 · X 잠금/해제 */
	setDismissable(dismissable: boolean): void;
	/** 닫기 가드 등록/해제 (useDialogGuard 사용을 권장) */
	setBeforeClose(guard: TDialogGuard<T> | null): void;
	/** shell footer '확인' 제출 핸들러 등록/해제 (useDialogSubmit 사용을 권장) */
	setSubmit(submit: TDialogSubmit<T> | null): void;
	/** 껍데기 옵션 부분 갱신 */
	patch(option: Partial<IDialogOption<T>>): void;
}

/** 전역 $ui 루트 타입 */
export interface IUI {
	alert: TAlertDialog;
	confirm: TConfirmDialog;
	/** 임의 React 컴포넌트를 모달로 띄우고 결과를 await 로 받습니다. */
	dialog: IDialogApi;
}

/* ── core(동작) ↔ shared(모양) 사이의 계약 ──────────────────────────────────────
 * 오버레이의 **동작**은 core 가 전부 계산해 아래 frame 객체로 넘기고,
 * **모양**은 src/shared/ui/overlay 의 스킨 컴포넌트가 담당합니다.
 * 퍼블리셔는 스킨만 고치면 되고, 닫기 경로 배선은 건드릴 일이 없습니다.
 * -------------------------------------------------------------------------- */

/** preventDefault 만 쓰면 되는 최소 이벤트 모양 (Radix 이벤트 타입에 의존하지 않기 위함) */
type TPreventable = { preventDefault: () => void };

/**
 * Radix `<DialogContent>` 에 **통째로 스프레드**해야 하는 동작 props.
 *
 * ⚠️ 스킨에서 이 스프레드를 지우면 ESC · 배경 클릭이 Radix 자체 경로로 닫히면서
 *    `beforeClose` 가드가 **조용히** 우회됩니다. 화면상으로는 멀쩡해 보이므로 발견이 늦습니다.
 */
export interface IDialogContentBehavior {
	/** z-index 는 깊이별로 값이 달라 Tailwind 가 스캔할 수 없으므로 인라인이어야 합니다. */
	style: CSSProperties;
	overlayStyle: CSSProperties;
	/** X 버튼은 reason 을 구분하기 위해 스킨이 직접 그립니다. */
	showCloseButton: false;
	onEscapeKeyDown: (event: TPreventable) => void;
	onPointerDownOutside: (event: TPreventable) => void;
	onFocusOutside: (event: TPreventable) => void;
	onInteractOutside: (event: TPreventable) => void;
	/** description 이 없을 때만 키가 존재합니다 (Radix 경고 억제). */
	'aria-describedby'?: undefined;
}

/** 푸터를 어떻게 그릴지 — 판별은 core 가 끝내고 결과만 넘깁니다. */
export type TDialogFooterPlan =
	| { kind: 'shell'; option: IDialogFooterOption<unknown> }
	| { kind: 'custom'; node: ReactNode }
	| { kind: 'none' };

/** $ui.dialog 한 항목의 동작 묶음 — `useDialogFrame` 이 만들고 스킨이 소비합니다. */
export interface IDialogFrame {
	id: string;
	/** Radix `<Dialog>` 에 스프레드 */
	rootProps: { open: boolean; onOpenChange: (next: boolean) => void };
	/** Radix `<DialogContent>` 에 스프레드 — 위 경고 참고 */
	contentProps: IDialogContentBehavior;
	/** 폭 프리셋 키 — 실제 클래스 매핑은 스킨이 정합니다. */
	size: TDialogSize;
	/** 스택 깊이 (0 = 최하단). 중첩 시 딤 처리를 스킨이 결정할 때 씁니다. */
	depth: number;
	/** 제목/설명 영역을 그릴지 (접근성상 제목 자체는 항상 필요합니다) */
	hasDescription: boolean;
	/** Context · 에러 경계 · Suspense · 라우터 브리지까지 감싼 본문 */
	body: ReactNode;
	footer: TDialogFooterPlan;
	/** footer 버튼 전체 로딩 */
	loading: boolean;
	/** 확인 버튼만 비활성 */
	confirmDisabled: boolean;
	/** X 버튼 (reason 'close') */
	close: () => void;
	/** 취소 버튼 (reason 'cancel') */
	cancel: () => void;
	/** 확인 버튼 (reason 'confirm' — 제출 핸들러/가드를 거칩니다) */
	confirm: () => void;
}

/** $ui.alert / $ui.confirm 의 동작 묶음 — `useAlertFrame` 이 만들고 스킨이 소비합니다. */
export interface IAlertFrame {
	kind: 'alert' | 'confirm';
	option: IConfirmDialogOption;
	rootProps: { open: boolean; onOpenChange: (next: boolean) => void };
	/** Radix `<AlertDialogContent>` 에 스프레드 (z-index 인라인) */
	contentProps: { style: CSSProperties; overlayStyle: CSSProperties };
	/** 아이콘을 표시할지 — type 지정 여부와 icon 옵션으로 core 가 계산합니다. */
	showIcon: boolean;
	/** X 버튼 (reason 'close') */
	close: () => void;
	/** 취소 버튼 (reason 'cancel') */
	cancel: () => void;
	/** 확인 버튼 (reason 'confirm') */
	confirm: () => void;
}
