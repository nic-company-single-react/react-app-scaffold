/**
 * 전역 $util 타입 정의
 *
 * window.$util 로 제공되는 기본 유틸리티 함수들의 타입입니다.
 * $router(@/types/router)와 동일하게, 구현은 src/core/utils/util 에 위치합니다.
 */

/** 날짜 유틸 - $util.date */
export interface IDateUtil {
	/** 날짜를 지정한 포맷 문자열로 변환합니다. (기본: YYYY-MM-DD) */
	format(date?: DateInput, template?: string): string;
	/** 현재 시각을 지정한 포맷으로 반환합니다. (기본: YYYY-MM-DD HH:mm:ss) */
	now(template?: string): string;
	/** 문자열/숫자/Date를 Date 객체로 파싱합니다. 유효하지 않으면 null을 반환합니다. */
	parse(value: DateInput, template?: string): Date | null;
	/** 날짜에 일(day)을 더합니다. (음수 가능) */
	addDays(date: DateInput, amount: number): Date;
	/** 날짜에 월(month)을 더합니다. (음수 가능) */
	addMonths(date: DateInput, amount: number): Date;
	/** 두 날짜 간의 일(day) 차이를 반환합니다. (a - b) */
	diffDays(a: DateInput, b: DateInput): number;
	/** 유효한 날짜 값인지 확인합니다. */
	isValid(value: DateInput): boolean;
}

/** 숫자 유틸 - $util.number
 *  설명과 데모 예시값(@demo)의 단일 출처입니다. 데모 페이지는 이 인터페이스를 파싱합니다. */
export interface INumberUtil {
	/**
	 * 천 단위 콤마를 추가한 문자열로 변환합니다. (예: 1234567 -> "1,234,567")
	 * @demo value="1234567.89"
	 */
	comma(value: number | string): string;
	/**
	 * 지정한 소수 자릿수로 반올림합니다. (기본: 0)
	 * @demo value="3.14159" digits="2"
	 */
	round(value: number, digits?: number): number;
	/**
	 * 값을 [min, max] 범위로 제한합니다.
	 * @demo value="15" min="0" max="10"
	 */
	clamp(value: number, min: number, max: number): number;
	/**
	 * 문자열에서 숫자만 추출하여 number로 변환합니다. 실패 시 fallback을 반환합니다.
	 * @demo value="$ 1,234.50 원" fallback="0"
	 */
	toNumber(value: unknown, fallback?: number): number;
	/**
	 * 0~1 비율을 백분율 문자열로 변환합니다. (예: 0.123 -> "12.3%")
	 * @demo value="0.1234" digits="1"
	 */
	percent(value: number, digits?: number): string;
	/**
	 * 지정한 소수 자릿수로 버림(절사)합니다. (기본: 0) — 이자·수수료의 원 단위 절사에 사용합니다.
	 * @demo value="12345.678" digits="0"
	 */
	floor(value: number, digits?: number): number;
	/**
	 * 지정한 소수 자릿수로 올림(절상)합니다. (기본: 0)
	 * @demo value="12345.001" digits="0"
	 */
	ceil(value: number, digits?: number): number;
	/**
	 * 부동소수점 오차 없이 두 수를 더합니다. (예: 0.1 + 0.2 -> 0.3)
	 * @demo a="0.1" b="0.2"
	 */
	add(a: number, b: number): number;
	/**
	 * 부동소수점 오차 없이 두 수를 뺍니다. (예: 0.3 - 0.1 -> 0.2)
	 * @demo a="0.3" b="0.1"
	 */
	subtract(a: number, b: number): number;
	/**
	 * 부동소수점 오차 없이 두 수를 곱합니다. (예: 0.1 * 3 -> 0.3)
	 * @demo a="0.1" b="3"
	 */
	multiply(a: number, b: number): number;
	/**
	 * 부동소수점 오차 없이 두 수를 나눕니다. (예: 0.3 / 0.1 -> 3)
	 * @demo a="0.3" b="0.1"
	 */
	divide(a: number, b: number): number;
	/**
	 * 공급가액에 대한 부가가치세액을 계산합니다. (기본 세율 10%, 원 단위 반올림)
	 * @demo value="10000" rate="0.1"
	 */
	vat(value: number, rate?: number): number;
	/**
	 * 천 단위 콤마를 붙이고 단위를 덧붙여 통화 문자열로 변환합니다. (기본 단위 "원")
	 * @demo value="1234567" unit="원"
	 */
	currency(value: number | string, unit?: string): string;
	/**
	 * 숫자를 한글 금액 표기로 변환합니다. (예: 12345678 -> "천이백삼십사만오천육백칠십팔")
	 * @demo value="12345678"
	 */
	toKorean(value: number | string): string;
	/**
	 * 천 단위 콤마와 함께 소수 자릿수를 고정합니다. (예: 1234.5, 2 -> "1,234.50")
	 * @demo value="1234.5" digits="2"
	 */
	formatFixed(value: number, digits: number): string;
	/**
	 * 만/억/조 단위로 축약 표기합니다. (예: 12345678 -> "1,234.5만")
	 * @demo value="12345678"
	 */
	abbreviate(value: number | string): string;
	/**
	 * 부호(+/-)를 붙인 콤마 문자열로 변환합니다. 등락 표시에 사용합니다. (예: 1200 -> "+1,200")
	 * @demo value="1200"
	 */
	sign(value: number | string): string;
	/**
	 * 이전값 대비 증감율(%)을 계산합니다. (예: 120, 100 -> 20)
	 * @demo current="120" prev="100"
	 */
	rate(current: number, prev: number): number;
}

/** 문자열 유틸 - $util.string */
export interface IStringUtil {
	/** null/undefined/공백 문자열 여부를 확인합니다. */
	isEmpty(value: unknown): boolean;
	/** 첫 글자를 대문자로 변환합니다. */
	capitalize(value: string): string;
	/** 지정 길이를 초과하면 잘라내고 말줄임표(suffix)를 붙입니다. */
	truncate(value: string, length: number, suffix?: string): string;
	/** 지정 길이만큼 문자(기본 '0')로 앞을 채웁니다. */
	padStart(value: string | number, length: number, fill?: string): string;
	/** 모든 공백을 제거합니다. */
	removeWhitespace(value: string): string;
	/** 일부 문자를 마스킹 문자로 가립니다. (start~end 인덱스 구간) */
	mask(value: string, start: number, end: number, maskChar?: string): string;
}

/** 전역 $util 루트 타입 */
export interface IUtils {
	date: IDateUtil;
	number: INumberUtil;
	string: IStringUtil;
}

/** date 유틸이 허용하는 입력 타입 */
export type DateInput = Date | string | number;
