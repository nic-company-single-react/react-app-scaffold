/**
 * 다이얼로그 식별용 UUID v4 를 생성합니다.
 *
 * `crypto.randomUUID()` 는 보안 컨텍스트(https / localhost)에서만 노출되므로,
 * http 로 서빙되는 서버에서는 `getRandomValues()` 기반 폴백을 사용합니다.
 * (`getRandomValues` 는 보안 컨텍스트 제약이 없습니다)
 *
 * $ui.alert / $ui.confirm / $ui.dialog 가 공유하므로 별도 모듈로 분리했습니다.
 * (core/ui/index.ts 와 core/ui/dialog/* 가 서로를 import 하면 순환참조가 생깁니다)
 * 특정 분야(alert/dialog/toast)에 속하지 않는 공용 leaf 라서 최상위에 둡니다.
 */
export function createId(): string {
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
