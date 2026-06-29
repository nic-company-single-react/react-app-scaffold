/**
 * format 문자열 DSL → $util 함수 매핑 레지스트리
 *
 * 컬럼의 `format` 값을 받아 전역 $util.number/date/string 으로 위임합니다.
 * $util은 main.tsx의 registerWindowUtil()로 등록되며, 렌더 시점엔 항상 존재합니다.
 */
import type { SmartFormat } from '../types';

/** 값이 비었는지 (null/undefined/빈문자열) */
function isBlank(value: unknown): boolean {
	return value === null || value === undefined || value === '';
}

/**
 * format 문자열을 적용해 표시용 문자열을 반환합니다.
 * 알 수 없는 format이거나 값이 비면 안전하게 원본/빈값으로 폴백합니다.
 */
export function formatValue(format: SmartFormat | undefined, value: unknown): string {
	if (isBlank(value)) return '';
	if (!format) return String(value);

	// 콜론 인자 분리 (date:YYYY.MM.DD, mask:1-2)
	const [name, arg] = splitFormat(format);

	try {
		switch (name) {
			case 'money':
				return $util.number.currency(value as number | string, '원');
			case 'number':
				return $util.number.comma(value as number | string);
			case 'percent':
				return $util.number.percent($util.number.toNumber(value));
			case 'abbreviate':
				return $util.number.abbreviate(value as number | string);

			case 'date':
				return arg ? $util.date.format(value as string, arg) : $util.date.format(value as string);
			case 'datetime':
				return $util.date.format(value as string, 'YYYY-MM-DD HH:mm:ss');
			case 'fromNow':
				return $util.date.fromNow(value as string);

			case 'phone':
				return $util.string.formatMobile(String(value));
			case 'rrn':
				return $util.string.formatRRN(String(value));
			case 'bizno':
				return $util.string.formatBizNo(String(value));
			case 'cardno':
				return $util.string.formatCardNo(String(value));
			case 'businessDate':
				return $util.string.formatBusinessDate(String(value));

			case 'maskName':
				return $util.string.maskName(String(value));
			case 'maskMobile':
				return $util.string.maskMobile(String(value));
			case 'maskRRN':
				return $util.string.maskRRN(String(value));
			case 'mask': {
				const [start, end] = (arg ?? '').split('-').map((n) => Number(n));
				if (Number.isNaN(start) || Number.isNaN(end)) return String(value);
				return $util.string.mask(String(value), start, end);
			}

			default:
				return String(value);
		}
	} catch {
		// $util 호출 실패(예: 잘못된 날짜) 시 원본 표시
		return String(value);
	}
}

/** 'date:YYYY-MM-DD' → ['date', 'YYYY-MM-DD'] / 'money' → ['money', undefined] */
function splitFormat(format: string): [string, string | undefined] {
	const idx = format.indexOf(':');
	if (idx === -1) return [format, undefined];
	return [format.slice(0, idx), format.slice(idx + 1)];
}
