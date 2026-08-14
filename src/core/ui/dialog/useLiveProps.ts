import { useLayoutEffect, useRef } from 'react';
import type { ILivePropsBox, TDialogProps } from '@/types/components';

/**
 * `$ui.dialog` 에 **살아있는 props** 를 넘기기 위한 훅.
 *
 * `$ui.dialog(...)` 는 이벤트 핸들러에서 부르는 명령형 호출이라 `props` 가 열린 시점 값으로 굳는다.
 * React 는 컴포넌트 바깥에 "이 state 가 바뀌었다"를 알려주는 수단이 없으므로, 열려 있는 동안
 * 값을 계속 흘려보내려면 **페이지의 렌더에 올라탄 코드**가 한 줄 필요하다. 그게 이 훅이다.
 *
 * ```tsx
 * const [elapsed, setElapsed] = useState(0);
 * const live = useLiveProps({ elapsed });            // ← 페이지 본문
 *
 * <Button onClick={() => $ui.dialog({ component: Content, props: live })}>열기</Button>
 * ```
 *
 * 컨텐츠 컴포넌트는 이 상자의 존재를 알 필요가 없다. 셸이 구독해서 풀어주므로
 * **평범한 props 를 받는 평범한 컴포넌트**로 그대로 둔다.
 *
 * ```tsx
 * export default function Content({ elapsed }: IContentProps) {
 *   return <p>{elapsed}초</p>;
 * }
 * ```
 *
 * 반응성이 필요 없다면 감싸지 말고 그냥 넘기면 된다 — `props: { initial: '홍길동' }`.
 * 열 때의 값으로 굳는 것이 대부분의 다이얼로그에서는 올바른 동작이다.
 *
 * ⚠️ 컨텐츠가 props 를 `useState(props.x)` 로 **복사**하면 갱신이 화면에 보이지 않는다.
 *    (React 의 초기값은 마운트 때 한 번만 쓰인다) 값을 그대로 렌더하거나 파생시켜 쓸 것.
 */
export function useLiveProps<P extends object>(values: P): ILivePropsBox<P> {
	// 상자는 최초 렌더에 한 번만 만든다. identity 가 고정되어야 구독이 끊기지 않는다.
	const boxRef = useRef<ILiveBox<P> | null>(null);
	const box = (boxRef.current ??= createLiveBox(values));

	// deps 를 주지 않아 매 렌더 커밋마다 실행된다.
	// layout effect 인 이유: 페이지가 그려진 직후 같은 프레임에 다이얼로그도 갱신되어야
	// 두 값이 한 틱 어긋나 보이지 않는다.
	useLayoutEffect(() => {
		box.publish(values);
	});

	return box;
}

/** 평범한 props 객체인지, `useLiveProps` 가 만든 상자인지 판별합니다. */
export function isLiveProps(props: TDialogProps): props is ILivePropsBox {
	return (props as ILivePropsBox).__liveProps === true;
}

/** publish 는 내부 전용 — 공개 타입(ILivePropsBox)에는 노출하지 않는다. */
interface ILiveBox<P extends object> extends ILivePropsBox<P> {
	publish(next: P): void;
}

function createLiveBox<P extends object>(initial: P): ILiveBox<P> {
	const listeners = new Set<() => void>();
	/** 구독자에게 공개된 값. 실제로 바뀔 때만 교체해 identity 를 안정적으로 유지한다. */
	let snapshot = initial;
	/** 함수 identity 까지 포함한 최신 값. 함수형 prop 의 최신 클로저를 꺼낼 때 쓴다. */
	let latest = initial;

	return {
		__liveProps: true,
		subscribe: (listener) => {
			listeners.add(listener);
			return () => listeners.delete(listener);
		},
		getSnapshot: () => snapshot,
		getLatest: () => latest,
		publish: (next) => {
			// 함수는 항상 최신 것을 볼 수 있어야 하므로 비교와 무관하게 갈아둔다.
			latest = next;
			if (!changedIgnoringFunctions(snapshot, next)) return;
			snapshot = next;
			for (const listener of listeners) listener();
		},
	};
}

/**
 * 얕은 비교. **함수 값은 제외**한다.
 *
 * 인라인 화살표 함수는 렌더마다 새 identity 가 되므로, 포함시키면 값이 그대로여도
 * 매 렌더 다이얼로그를 리렌더시키게 된다. 최신 함수는 `getLatest()` 로 따로 흘려보낸다.
 */
function changedIgnoringFunctions(a: object, b: object): boolean {
	const prev = a as Record<string, unknown>;
	const next = b as Record<string, unknown>;
	const keys = new Set([...Object.keys(prev), ...Object.keys(next)]);
	for (const key of keys) {
		if (typeof prev[key] === 'function' || typeof next[key] === 'function') continue;
		if (!Object.is(prev[key], next[key])) return true;
	}
	return false;
}
