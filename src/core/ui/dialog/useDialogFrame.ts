import { createElement, useCallback, useEffect, useMemo, useRef, useSyncExternalStore } from 'react';
import { getDialogZIndex } from '@/shared/ui/overlay/overlay-layers';
import DialogBody from './DialogBody';
import { isFooterOption, patchDialogOption, requestCloseDialog, setDialogFlag } from './dialogController';
import { getDialogRuntime, type IDialogStackItem } from './dialogStore';
import { isLiveProps } from './useLiveProps';
import type {
	IDialogApiHandle,
	IDialogContentBehavior,
	IDialogFooterOption,
	IDialogFrame,
	IDialogOption,
	ILivePropsBox,
	TDialogFooterPlan,
	TDialogGuard,
	TDialogProps,
	TDialogSubmit,
} from '@/types/components';

/**
 * $ui.dialog 항목 1개의 **동작**을 전부 계산해 스킨에 넘길 frame 을 만든다.
 *
 * 여기가 이 기능의 심장이다. 모양(마크업·클래스)은 `src/shared/ui/overlay/DialogSkin` 이 담당하고,
 * 이 훅은 그 스킨이 스프레드하기만 하면 되는 형태로 배선을 완성해 준다.
 *
 * 지켜지는 불변식:
 *  1. Radix 에게 닫기 결정권을 주지 않는다. ESC · 배경 클릭 · 외부 인터랙션을 전부 preventDefault 하고
 *     `requestCloseDialog()` 한 곳으로 모아야 `beforeClose` 가드가 무력화되지 않는다.
 *  2. 컨텐츠 렌더 실패는 반드시 정산된다(에러 경계). 아니면 `await $ui.dialog(...)` 가 영원히 멈춘다.
 *  3. 함수형 prop 은 고정 identity 프록시로 감싸 stale closure 를 막는다.
 */
export function useDialogFrame(item: IDialogStackItem, depth: number, isTop: boolean): IDialogFrame {
	const { id, option } = item;
	const Content = item.component;

	// depth/isTop 은 자주 바뀌지만 api identity 는 고정되어야 하므로 ref 로 우회한다.
	const depthRef = useRef(depth);
	const isTopRef = useRef(isTop);
	depthRef.current = depth;
	isTopRef.current = isTop;

	// useLiveProps 로 넘어온 상자면 구독해서 바탕 페이지의 렌더를 따라간다.
	// 평범한 객체면 그대로 쓴다 (열린 시점 스냅샷 + handle.update()).
	const live = isLiveProps(item.props) ? item.props : null;
	const resolvedProps = useResolvedProps(item.props, live);

	// props 의 최신 값을 꺼내는 getter — stableCallbacks 프록시가 여기서 최신 함수를 찾는다.
	// 함수 identity 만 바뀐 렌더는 리렌더를 유발하지 않으므로, 구독한 스냅샷이 아니라
	// 상자의 최신 값을 **호출 시점에** 읽어야 stale closure 가 생기지 않는다.
	const latestPropsRef = useRef<() => Record<string, unknown>>(() => resolvedProps);
	latestPropsRef.current = live ? () => live.getLatest() : () => resolvedProps;

	/** 컨텐츠에 내려줄 제어 API. id 당 1회만 만들어 identity 를 고정한다. */
	const api = useMemo<IDialogApiHandle<unknown>>(() => {
		return {
			id,
			get depth() {
				return depthRef.current;
			},
			get isTop() {
				return isTopRef.current;
			},
			close: (data?: unknown) => void requestCloseDialog(id, data === undefined ? 'close' : 'submit', data),
			cancel: () => void requestCloseDialog(id, 'cancel'),
			setTitle: (title) => patchDialogOption(id, { title }),
			setDescription: (description) => patchDialogOption(id, { description }),
			setSize: (size) => patchDialogOption(id, { size }),
			setLoading: (loading) => setDialogFlag(id, { loading }),
			setConfirmDisabled: (confirmDisabled) => setDialogFlag(id, { confirmDisabled }),
			setDismissable: (dismissable) => patchDialogOption(id, { dismissable }),
			setBeforeClose: (guard) => {
				getDialogRuntime(id).guard = guard as TDialogGuard<unknown> | null;
			},
			setSubmit: (submit) => {
				getDialogRuntime(id).submit = submit as TDialogSubmit<unknown> | null;
			},
			patch: (next) => patchDialogOption(id, next),
		};
	}, [id]);

	/**
	 * 함수형 prop 을 고정 identity 래퍼로 치환한다.
	 * update() 로 콜백을 갈아끼워도 컨텐츠 쪽 deps 가 흔들리지 않고, 항상 최신 클로저가 호출된다.
	 */
	const wrappersRef = useRef(new Map<string, (...args: unknown[]) => unknown>());
	const contentProps = useMemo(() => {
		if (option.stableCallbacks === false) return resolvedProps;

		const next: Record<string, unknown> = {};
		for (const [key, value] of Object.entries(resolvedProps)) {
			if (typeof value !== 'function') {
				next[key] = value;
				continue;
			}
			let wrapper = wrappersRef.current.get(key);
			if (!wrapper) {
				wrapper = (...args: unknown[]) => {
					const fn = latestPropsRef.current()[key];
					return typeof fn === 'function' ? (fn as (...a: unknown[]) => unknown)(...args) : undefined;
				};
				wrappersRef.current.set(key, wrapper);
			}
			next[key] = wrapper;
		}
		return next;
	}, [resolvedProps, option.stableCallbacks]);

	// autoDismiss — 지정 시 N ms 후 자동 닫기
	useEffect(() => {
		const ms = option.autoDismiss;
		if (!ms) return;
		const timer = setTimeout(() => void requestCloseDialog(id, 'autoDismiss'), ms);
		return () => clearTimeout(timer);
	}, [id, option.autoDismiss]);

	const zIndexStyle = { zIndex: getDialogZIndex(depth) };
	const hasDescription = option.description !== undefined && option.description !== null;

	// ── 스킨이 <DialogContent> 에 통째로 스프레드할 동작 props ──────────────
	// 이 묶음을 지우면 Radix 가 스스로 닫으면서 beforeClose 가드가 조용히 우회된다.
	const contentBehavior: IDialogContentBehavior = {
		style: zIndexStyle,
		overlayStyle: zIndexStyle,
		// X 버튼은 reason 을 'close' 로 구분해야 하므로 스킨이 직접 그린다.
		showCloseButton: false,
		onEscapeKeyDown: (e) => {
			e.preventDefault();
			if (option.closeOnEscape !== false) void requestCloseDialog(id, 'escape');
		},
		onPointerDownOutside: (e) => {
			e.preventDefault();
			if (option.closeOnOverlayClick !== false) void requestCloseDialog(id, 'overlay');
		},
		onFocusOutside: (e) => e.preventDefault(),
		onInteractOutside: (e) => e.preventDefault(),
		// Description 이 없을 때만 aria-describedby 를 명시적으로 지워 Radix 경고를 끈다.
		// (키 자체를 넘기지 않으면 Radix 가 기본 descriptionId 를 붙이고 "없다"고 경고한다)
		...(hasDescription ? {} : { 'aria-describedby': undefined }),
	};

	return {
		id,
		rootProps: {
			open: item.open,
			onOpenChange: (next) => {
				// 위 핸들러들이 전부 preventDefault 하므로 여기는 도달하지 않는 게 정상이다.
				// 혹시 다른 경로로 닫히려 하면 마지막 안전망으로 받는다.
				if (!next) void requestCloseDialog(id, 'close');
			},
		},
		contentProps: contentBehavior,
		size: option.size ?? 'md',
		depth,
		hasDescription,
		body: createElement(DialogBody, { id, api, component: Content, props: contentProps }),
		footer: planFooter(option.footer),
		loading: item.loading,
		confirmDisabled: item.confirmDisabled,
		close: () => void requestCloseDialog(id, 'close'),
		cancel: () => void requestCloseDialog(id, 'cancel'),
		confirm: () => void requestCloseDialog(id, 'confirm'),
	};
}

/** 살아있는 상자가 아닐 때 useSyncExternalStore 에 물릴 빈 구독. */
const NO_SUBSCRIPTION = () => () => {};

/**
 * 컨텐츠에 실제로 내려줄 props 를 확정한다.
 *
 * `useLiveProps` 상자면 구독해서 바탕 페이지의 렌더를 따라가고, 평범한 객체면 그대로 돌려준다.
 * 훅은 조건부로 부를 수 없으므로 두 경로를 하나의 `useSyncExternalStore` 로 합쳤다.
 */
function useResolvedProps(props: TDialogProps, live: ILivePropsBox | null): Record<string, unknown> {
	const subscribe = useCallback((onChange: () => void) => (live ? live.subscribe(onChange) : NO_SUBSCRIPTION()), [live]);
	const getSnapshot = useCallback(() => (live ? live.getSnapshot() : (props as Record<string, unknown>)), [live, props]);
	return useSyncExternalStore(subscribe, getSnapshot);
}

/** footer 옵션을 스킨이 switch 하나로 처리할 수 있는 형태로 정리한다. */
function planFooter(footer: IDialogOption<unknown>['footer']): TDialogFooterPlan {
	// 미지정이거나 설정 객체면 shell 이 확인/취소를 그린다.
	if (footer === undefined || isFooterOption(footer)) {
		return { kind: 'shell', option: (isFooterOption(footer) ? footer : {}) as IDialogFooterOption<unknown> };
	}
	// false 면 컨텐츠가 직접 그린다 — 푸터 영역 자체를 없앤다.
	if (footer === false) return { kind: 'none' };
	// 그 외 ReactNode 는 그대로 렌더한다.
	return { kind: 'custom', node: footer };
}
