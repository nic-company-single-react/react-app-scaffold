import { useUIStore } from './store';
import type { IAlertDialogOption, IConfirmDialogOption, IUI } from '@/types/components';

/**
 * 첫 인자(string | option) + 두번째 인자(option)를 단일 옵션으로 병합하고
 * id 가 없으면 자동으로 부여합니다.
 */
function normalize<T extends IAlertDialogOption>(message?: string | T, option?: T): T {
	const base = (typeof message === 'object' ? message : { message }) as T;
	const merged = { ...base, ...option } as T; // 두번째 인자가 우선
	merged.id ??= crypto.randomUUID();
	return merged;
}

/**
 * 전역 $ui 객체를 생성합니다.
 *
 * 각 함수는 다이얼로그를 큐에 넣고, 사용자가 닫을 때 resolve 되는 Promise 를 반환합니다.
 * - alert: Promise<void>
 * - confirm: Promise<boolean> (확인=true, 그 외=false)
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
	};
}

/** 전역 $ui 등록 (window.$ui) */
export function registerWindowUI(): void {
	window.$ui = createWindowUI();
}
