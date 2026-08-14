import { useContext, useEffect, useLayoutEffect } from 'react';
import { DialogContext } from './DialogContext';
import { getDialogRuntime } from './dialogStore';
import type { IDialogApiHandle, TDialogGuard, TDialogSubmit } from '@/types/components';

/**
 * 다이얼로그 컨텐츠 안에서 제어 API 를 얻습니다.
 *
 * 다이얼로그 밖에서 호출하면 즉시 throw 합니다. 안/밖 겸용 컴포넌트라면 useDialogSafe 를 쓰세요.
 *
 * @example
 * const dialog = useDialog<IMember>();
 * <Button onClick={() => dialog.close(member)}>선택</Button>
 */
export function useDialog<T = unknown>(): IDialogApiHandle<T> {
	const api = useContext(DialogContext);
	if (!api) {
		throw new Error(
			'[useDialog] $ui.dialog 로 열린 컨텐츠 안에서만 사용할 수 있습니다. 다이얼로그 밖에서도 쓰는 컴포넌트라면 useDialogSafe() 를 쓰세요.',
		);
	}
	return api as IDialogApiHandle<T>;
}

/** useDialog 의 안전 버전. 다이얼로그 밖이면 null 을 반환합니다. */
export function useDialogSafe<T = unknown>(): IDialogApiHandle<T> | null {
	return useContext(DialogContext) as IDialogApiHandle<T> | null;
}

/**
 * shell footer 의 '확인' 이 호출할 제출 핸들러를 등록합니다.
 *
 * 반환값이 곧 `$ui.dialog` 의 결과이며, `undefined` 를 반환하면 **닫지 않습니다**(검증 실패).
 * 매 렌더마다 최신 함수로 교체되므로 stale closure 가 생기지 않습니다.
 *
 * @example
 * useDialogSubmit<string>(() => {
 *   if (draft.trim().length < 2) return undefined; // 닫지 않음
 *   return draft.trim();
 * });
 */
export function useDialogSubmit<T = unknown>(submit: TDialogSubmit<T>): void {
	const { id } = useDialog<T>();

	// 렌더 커밋마다 최신 클로저로 덮어쓴다.
	useLayoutEffect(() => {
		getDialogRuntime(id).submit = submit;
	});

	// 언마운트 시 해제 (id 가 바뀌는 일은 없지만 방어적으로)
	useEffect(() => {
		return () => {
			const runtime = getDialogRuntime(id);
			runtime.submit = null;
		};
	}, [id]);
}

/**
 * 닫기 가드를 등록합니다. `false` 를 반환하면 닫히지 않습니다.
 *
 * 컨텐츠가 등록한 가드가 `$ui.dialog` 옵션의 `beforeClose` 보다 우선합니다.
 * 라우트 변경(`reason: 'route'`)과 코드 닫기(`programmatic`)는 가드를 우회합니다.
 *
 * @example
 * useDialogGuard<IAccount>(async (r) => {
 *   if (!dirty || r.reason === 'submit') return true;
 *   return $ui.confirm({ type: 'warning', message: '저장하지 않은 변경사항이 있습니다. 닫을까요?' });
 * });
 */
export function useDialogGuard<T = unknown>(guard: TDialogGuard<T>): void {
	const { id } = useDialog<T>();

	useLayoutEffect(() => {
		getDialogRuntime(id).guard = guard as TDialogGuard<unknown>;
	});

	useEffect(() => {
		return () => {
			const runtime = getDialogRuntime(id);
			runtime.guard = null;
		};
	}, [id]);
}
