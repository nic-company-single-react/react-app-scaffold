import { useUIStore } from './store';
import type { IAlertDialogOption, IConfirmDialogOption, IUI } from '@/types/components';

/**
 * 다이얼로그 식별용 UUID v4 를 생성합니다.
 *
 * `crypto.randomUUID()` 는 보안 컨텍스트(https / localhost)에서만 노출되므로,
 * http 로 서빙되는 서버에서는 `getRandomValues()` 기반 폴백을 사용합니다.
 * (`getRandomValues` 는 보안 컨텍스트 제약이 없습니다)
 */
function createId(): string {
	if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
		return crypto.randomUUID();
	}

	const bytes = new Uint8Array(16);
	if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
		crypto.getRandomValues(bytes);
	} else {
		for (let i = 0; i < bytes.length; i += 1) bytes[i] = Math.floor(Math.random() * 256);
	}

	bytes[6] = (bytes[6] & 0x0f) | 0x40; // version 4
	bytes[8] = (bytes[8] & 0x3f) | 0x80; // variant 10

	const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, '0'));
	return `${hex.slice(0, 4).join('')}-${hex.slice(4, 6).join('')}-${hex.slice(6, 8).join('')}-${hex.slice(8, 10).join('')}-${hex.slice(10, 16).join('')}`;
}

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
