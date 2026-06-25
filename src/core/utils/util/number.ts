import type { INumberUtil } from '@/types/common';

export const numberUtil: INumberUtil = {
	/**
	 * 천 단위 콤마를 추가한 문자열로 변환합니다. (예: 1234567 -> "1,234,567")
	 * @demo value="1234567.89"
	 */
	comma(value: number | string): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		// 정수부에만 천 단위 콤마를 적용하고 소수부는 그대로 유지합니다.
		const [intPart, decimalPart] = String(num).split('.');
		const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		return decimalPart ? `${withComma}.${decimalPart}` : withComma;
	},

	/**
	 * 지정한 소수 자릿수로 반올림합니다. (기본: 0)
	 * @demo value="3.14159" digits="2"
	 */
	round(value: number, digits: number = 0): number {
		const factor = 10 ** digits;
		return Math.round(value * factor) / factor;
	},

	/**
	 * 값을 [min, max] 범위로 제한합니다.
	 * @demo value="15" min="0" max="10"
	 */
	clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	},

	/**
	 * 문자열에서 숫자만 추출하여 number로 변환합니다. 실패 시 fallback을 반환합니다.
	 * @demo value="$ 1,234.50 원" fallback="0"
	 */
	toNumber(value: unknown, fallback: number = 0): number {
		if (typeof value === 'number') return Number.isFinite(value) ? value : fallback;
		if (typeof value === 'string') {
			// 숫자, 부호, 소수점만 남기고 제거합니다. (콤마/통화기호 등 제거)
			const cleaned = value.replace(/[^0-9.-]/g, '');
			const num = Number(cleaned);
			return Number.isFinite(num) && cleaned !== '' ? num : fallback;
		}
		return fallback;
	},

	/**
	 * 0~1 비율을 백분율 문자열로 변환합니다. (예: 0.123 -> "12.3%")
	 * @demo value="0.1234" digits="1"
	 */
	percent(value: number, digits: number = 1): string {
		if (!Number.isFinite(value)) return '';
		return `${(value * 100).toFixed(digits)}%`;
	},
};
