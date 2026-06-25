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

/** 문자열 유틸 - $util.string
 *  설명과 데모 예시값(@demo)의 단일 출처입니다. 데모 페이지는 이 인터페이스를 파싱합니다. */
export interface IStringUtil {
	/* ── 기본 ─────────────────────────────────────────────── */
	/**
	 * null/undefined/공백 문자열 여부를 확인합니다.
	 * @demo value="   "
	 */
	isEmpty(value: unknown): boolean;
	/**
	 * 첫 글자를 대문자로 변환합니다.
	 * @demo value="hello"
	 */
	capitalize(value: string): string;
	/**
	 * 지정 길이를 초과하면 잘라내고 말줄임표(suffix)를 붙입니다.
	 * @demo value="안녕하세요 반갑습니다" length="5" suffix="..."
	 */
	truncate(value: string, length: number, suffix?: string): string;
	/**
	 * 지정 길이만큼 문자(기본 '0')로 앞을 채웁니다.
	 * @demo value="7" length="5" fill="0"
	 */
	padStart(value: string | number, length: number, fill?: string): string;
	/**
	 * 지정 길이만큼 문자(기본 ' ')로 뒤를 채웁니다.
	 * @demo value="7" length="5" fill="0"
	 */
	padEnd(value: string | number, length: number, fill?: string): string;
	/**
	 * 모든 공백을 제거합니다.
	 * @demo value="a b  c"
	 */
	removeWhitespace(value: string): string;
	/**
	 * 앞뒤 공백을 제거하고 내부 연속 공백을 하나로 합칩니다.
	 * @demo value="  hello   world  "
	 */
	trimAll(value: string): string;
	/**
	 * 일부 문자를 마스킹 문자로 가립니다. (start~end 인덱스 구간)
	 * @demo value="홍길동" start="1" end="2" maskChar="*"
	 */
	mask(value: string, start: number, end: number, maskChar?: string): string;
	/**
	 * 문자열을 뒤집습니다. (예: "abc" -> "cba")
	 * @demo value="abcde"
	 */
	reverse(value: string): string;
	/**
	 * 대상 문자열의 모든 일치 부분을 치환합니다.
	 * @demo value="a-b-c" search="-" replacement="/"
	 */
	replaceAll(value: string, search: string, replacement: string): string;

	/* ── 검증 (Validation) ────────────────────────────────── */
	/**
	 * 모든 문자가 한글(가-힣)인지 확인합니다. (빈 문자열은 false)
	 * @demo value="홍길동"
	 */
	isHangul(value: string): boolean;
	/**
	 * 모든 문자가 영문 알파벳인지 확인합니다.
	 * @demo value="Hello"
	 */
	isEnglish(value: string): boolean;
	/**
	 * 모든 문자가 숫자(0-9)인지 확인합니다.
	 * @demo value="012345"
	 */
	isNumeric(value: string): boolean;
	/**
	 * 모든 문자가 영문 또는 숫자인지 확인합니다.
	 * @demo value="abc123"
	 */
	isAlphaNumeric(value: string): boolean;
	/**
	 * 이메일 형식이 올바른지 확인합니다.
	 * @demo value="user@example.com"
	 */
	isEmail(value: string): boolean;
	/**
	 * 휴대폰번호 형식(010 등)인지 확인합니다. 하이픈 유무는 무관합니다.
	 * @demo value="010-1234-5678"
	 */
	isMobile(value: string): boolean;
	/**
	 * 주민등록번호 13자리의 형식과 체크섬을 검증합니다. 하이픈 유무는 무관합니다.
	 * @demo value="960101-1234561"
	 */
	isRRN(value: string): boolean;
	/**
	 * 사업자등록번호 10자리의 형식과 체크섬을 검증합니다. 하이픈 유무는 무관합니다.
	 * @demo value="123-45-67891"
	 */
	isBizNo(value: string): boolean;
	/**
	 * 법인등록번호 13자리의 형식과 체크섬을 검증합니다. 하이픈 유무는 무관합니다.
	 * @demo value="110111-1234569"
	 */
	isCorpNo(value: string): boolean;
	/**
	 * 카드번호의 Luhn 체크섬을 검증합니다. 공백/하이픈 유무는 무관합니다.
	 * @demo value="4111-1111-1111-1111"
	 */
	isCardNo(value: string): boolean;

	/* ── 마스킹 (개인정보보호) ────────────────────────────── */
	/**
	 * 주민등록번호 뒷자리 중 성별 제외 6자리를 가립니다. (예: "960101-1******")
	 * @demo value="960101-1234561"
	 */
	maskRRN(value: string): string;
	/**
	 * 이름 가운데 글자를 가립니다. (2글자는 뒷 글자, 예: "홍*동", "김*")
	 * @demo value="홍길동"
	 */
	maskName(value: string): string;
	/**
	 * 카드번호 가운데 자리를 가립니다. (예: "1234-****-****-5678")
	 * @demo value="1234567812345678"
	 */
	maskCardNo(value: string): string;
	/**
	 * 계좌번호 가운데를 가리고 앞 3·뒤 3자리만 남깁니다.
	 * @demo value="110-1234-567890"
	 */
	maskAccountNo(value: string): string;
	/**
	 * 휴대폰번호 가운데 자리를 가립니다. (예: "010-****-5678")
	 * @demo value="010-1234-5678"
	 */
	maskMobile(value: string): string;
	/**
	 * 이메일 아이디의 일부를 가립니다. (예: "ab****@example.com")
	 * @demo value="abcdef@example.com"
	 */
	maskEmail(value: string): string;

	/* ── 포맷 (구분자 삽입) ───────────────────────────────── */
	/**
	 * 숫자만 남겨 휴대폰번호 하이픈 형식으로 변환합니다. (예: "01012345678" -> "010-1234-5678")
	 * @demo value="01012345678"
	 */
	formatMobile(value: string): string;
	/**
	 * 숫자만 남겨 사업자등록번호 형식으로 변환합니다. (예: "1234567890" -> "123-45-67890")
	 * @demo value="1234567890"
	 */
	formatBizNo(value: string): string;
	/**
	 * 숫자만 남겨 주민등록번호 형식으로 변환합니다. (예: "9601011234561" -> "960101-1234561")
	 * @demo value="9601011234561"
	 */
	formatRRN(value: string): string;
	/**
	 * 숫자만 남겨 4자리마다 하이픈을 넣은 카드번호 형식으로 변환합니다.
	 * @demo value="1234567812345678"
	 */
	formatCardNo(value: string): string;
	/**
	 * 8자리 숫자 날짜를 하이픈 형식으로 변환합니다. (예: "20260625" -> "2026-06-25")
	 * @demo value="20260625"
	 */
	formatBusinessDate(value: string): string;

	/* ── 변환 (Case) ──────────────────────────────────────── */
	/**
	 * 공백/하이픈/언더스코어 구분을 camelCase로 변환합니다. (예: "user_name" -> "userName")
	 * @demo value="user_name"
	 */
	camelCase(value: string): string;
	/**
	 * snake_case로 변환합니다. (예: "userName" -> "user_name")
	 * @demo value="userName"
	 */
	snakeCase(value: string): string;
	/**
	 * kebab-case로 변환합니다. (예: "userName" -> "user-name")
	 * @demo value="userName"
	 */
	kebabCase(value: string): string;
	/**
	 * PascalCase로 변환합니다. (예: "user_name" -> "UserName")
	 * @demo value="user_name"
	 */
	pascalCase(value: string): string;

	/* ── 추출 (Extract) ───────────────────────────────────── */
	/**
	 * 숫자만 추출합니다. (예: "총 1,234원" -> "1234")
	 * @demo value="총 1,234,567원"
	 */
	onlyNumber(value: string): string;
	/**
	 * 한글만 추출합니다.
	 * @demo value="abc홍길동123"
	 */
	onlyHangul(value: string): string;
	/**
	 * 영문 알파벳만 추출합니다.
	 * @demo value="abc홍길동123"
	 */
	onlyEnglish(value: string): string;
	/**
	 * 바이트 길이를 계산합니다. (한글 등 비ASCII는 2byte — 레거시 전문 길이 검증)
	 * @demo value="가나다ABC"
	 */
	getByteLength(value: string): number;
	/**
	 * 지정 바이트 길이로 자릅니다. (한글 2byte 기준, 잘리면 suffix 부착)
	 * @demo value="가나다라마바사" byteLength="8" suffix="..."
	 */
	cutByByte(value: string, byteLength: number, suffix?: string): string;

	/* ── 한글 (Korean) ───────────────────────────────────── */
	/**
	 * 한글 문자열에서 초성을 추출합니다. (예: "홍길동" -> "ㅎㄱㄷ")
	 * @demo value="홍길동"
	 */
	getChosung(value: string): string;
	/**
	 * 단어의 받침 유무에 따라 알맞은 조사를 붙입니다. (예: "사과", "을/를" -> "사과를")
	 * @demo value="사과" josaPair="을/를"
	 */
	josa(value: string, josaPair: string): string;

	/* ── 보안/인코딩 (Security) ──────────────────────────── */
	/**
	 * HTML 특수문자를 엔티티로 이스케이프합니다. (XSS 방지)
	 * @demo value="<b>Tom & Jerry</b>"
	 */
	escapeHtml(value: string): string;
	/**
	 * HTML 엔티티를 원래 문자로 복원합니다.
	 * @demo value="&lt;b&gt;Tom &amp; Jerry&lt;/b&gt;"
	 */
	unescapeHtml(value: string): string;
	/**
	 * 모든 HTML 태그를 제거합니다. (예: "<b>hi</b>" -> "hi")
	 * @demo value="<p>안녕 <b>세상</b></p>"
	 */
	stripTags(value: string): string;
	/**
	 * 문자열을 Base64로 인코딩합니다. (UTF-8)
	 * @demo value="안녕하세요"
	 */
	base64Encode(value: string): string;
	/**
	 * Base64 문자열을 디코딩합니다. (UTF-8)
	 * @demo value="SGVsbG8="
	 */
	base64Decode(value: string): string;
}

/** 전역 $util 루트 타입 */
export interface IUtils {
	date: IDateUtil;
	number: INumberUtil;
	string: IStringUtil;
}

/** date 유틸이 허용하는 입력 타입 */
export type DateInput = Date | string | number;
