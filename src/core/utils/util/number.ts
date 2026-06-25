import type { INumberUtil } from '@/types/common';

/** 정수부에만 천 단위 콤마를 적용하고 소수부는 그대로 유지합니다. */
function withThousands(num: number): string {
	const [intPart, decimalPart] = String(num).split('.');
	const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
	return decimalPart ? `${withComma}.${decimalPart}` : withComma;
}

/** 소수부 자릿수를 반환합니다. (예: 1.23 -> 2) */
function decimalLength(num: number): number {
	const s = String(num);
	const i = s.indexOf('.');
	return i === -1 ? 0 : s.length - i - 1;
}

/** 소수점을 제거한 정수값으로 변환합니다. (예: 1.23 -> 123, -0.5 -> -5) */
function toIntScale(num: number): number {
	return Number(String(num).replace('.', ''));
}

export const numberUtil: INumberUtil = {
	comma(value: number | string): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		return withThousands(num);
	},

	round(value: number, digits: number = 0): number {
		const factor = 10 ** digits;
		return Math.round(value * factor) / factor;
	},

	clamp(value: number, min: number, max: number): number {
		return Math.min(Math.max(value, min), max);
	},

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

	percent(value: number, digits: number = 1): string {
		if (!Number.isFinite(value)) return '';
		return `${(value * 100).toFixed(digits)}%`;
	},

	floor(value: number, digits: number = 0): number {
		const factor = 10 ** digits;
		return Math.floor(value * factor) / factor;
	},

	ceil(value: number, digits: number = 0): number {
		const factor = 10 ** digits;
		return Math.ceil(value * factor) / factor;
	},

	add(a: number, b: number): number {
		// 두 값을 정수로 끌어올려 더한 뒤 다시 나눠 부동소수점 오차를 제거합니다.
		const factor = 10 ** Math.max(decimalLength(a), decimalLength(b));
		return (Math.round(a * factor) + Math.round(b * factor)) / factor;
	},

	subtract(a: number, b: number): number {
		const factor = 10 ** Math.max(decimalLength(a), decimalLength(b));
		return (Math.round(a * factor) - Math.round(b * factor)) / factor;
	},

	multiply(a: number, b: number): number {
		// 소수점을 제거해 정수끼리 곱한 뒤 전체 소수 자릿수만큼 되돌립니다.
		const scale = decimalLength(a) + decimalLength(b);
		return (toIntScale(a) * toIntScale(b)) / 10 ** scale;
	},

	divide(a: number, b: number): number {
		const da = decimalLength(a);
		const db = decimalLength(b);
		return (toIntScale(a) / toIntScale(b)) * 10 ** (db - da);
	},

	vat(value: number, rate: number = 0.1): number {
		if (!Number.isFinite(value)) return 0;
		// 공급가액 × 세율을 원 단위로 반올림한 세액을 반환합니다.
		return Math.round(value * rate);
	},

	currency(value: number | string, unit: string = '원'): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		return `${withThousands(num)}${unit}`;
	},

	toKorean(value: number | string): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		const n = Math.trunc(Math.abs(num));
		if (n === 0) return '영';

		const digits = ['', '일', '이', '삼', '사', '오', '육', '칠', '팔', '구'];
		const small = ['', '십', '백', '천']; // 일의 자리 ~ 천의 자리
		const big = ['', '만', '억', '조', '경']; // 4자리 묶음 단위

		// 오른쪽부터 4자리씩 묶습니다.
		const str = String(n);
		const groups: string[] = [];
		for (let i = str.length; i > 0; i -= 4) {
			groups.unshift(str.slice(Math.max(0, i - 4), i));
		}

		let result = '';
		groups.forEach((group, gi) => {
			const g = group.padStart(4, '0');
			let part = '';
			for (let i = 0; i < 4; i++) {
				const d = Number(g[i]);
				if (d === 0) continue;
				const pos = 3 - i; // 3:천 2:백 1:십 0:일의 자리
				// 십·백·천 자리의 1은 '일'을 생략합니다. (예: 100 -> "백")
				part += (d === 1 && pos > 0 ? '' : digits[d]) + small[pos];
			}
			if (part) result += part + big[groups.length - 1 - gi];
		});

		return (num < 0 ? '마이너스 ' : '') + result;
	},

	formatFixed(value: number, digits: number): string {
		if (!Number.isFinite(value)) return '';
		// toFixed로 자릿수를 고정한 뒤 정수부에만 콤마를 적용합니다. (소수부 0 유지)
		const fixed = value.toFixed(digits);
		const negative = fixed.startsWith('-');
		const [intPart, decimalPart] = fixed.replace('-', '').split('.');
		const withComma = intPart.replace(/\B(?=(\d{3})+(?!\d))/g, ',');
		const body = decimalPart ? `${withComma}.${decimalPart}` : withComma;
		return negative ? `-${body}` : body;
	},

	abbreviate(value: number | string): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		const sign = num < 0 ? '-' : '';
		const abs = Math.abs(num);
		const units: [number, string][] = [
			[1e12, '조'],
			[1e8, '억'],
			[1e4, '만'],
		];
		for (const [unit, label] of units) {
			if (abs >= unit) {
				// 소수 첫째 자리까지만 표기합니다.
				const v = Math.floor((abs / unit) * 10) / 10;
				return `${sign}${withThousands(v)}${label}`;
			}
		}
		return withThousands(num);
	},

	sign(value: number | string): string {
		const num = typeof value === 'string' ? Number(value) : value;
		if (!Number.isFinite(num)) return '';
		// 음수는 withThousands가 '-'를 유지하므로 양수에만 '+'를 붙입니다.
		return (num > 0 ? '+' : '') + withThousands(num);
	},

	rate(current: number, prev: number): number {
		if (!Number.isFinite(current) || !Number.isFinite(prev) || prev === 0) return 0;
		// 소수 둘째 자리까지 반올림한 증감율(%)을 반환합니다.
		return Math.round(((current - prev) / prev) * 10000) / 100;
	},
};
