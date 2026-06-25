import type { IStringUtil } from '@/types/common';

/** 숫자 이외의 문자를 모두 제거합니다. (하이픈/공백 등 구분자 제거) */
function digitsOnly(value: string): string {
	return String(value).replace(/\D/g, '');
}

/** 문자열을 단어 단위로 분해합니다. (camelHump·공백·-·_ 모두 경계로 인식) */
function splitWords(value: string): string[] {
	return String(value)
		.replace(/([a-z0-9])([A-Z])/g, '$1 $2')
		.split(/[\s_-]+/)
		.filter(Boolean);
}

/** 첫 글자만 대문자로, 나머지는 소문자로 만듭니다. */
function upperFirst(word: string): string {
	return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
}

/** 한 문자의 바이트 폭을 반환합니다. (비ASCII는 2byte로 간주) */
function charByte(ch: string): number {
	return (ch.codePointAt(0) ?? 0) > 0x7f ? 2 : 1;
}

/** 초성 19자 (한글 음절 분해용) */
const CHOSUNG = [
	'ㄱ', 'ㄲ', 'ㄴ', 'ㄷ', 'ㄸ', 'ㄹ', 'ㅁ', 'ㅂ', 'ㅃ', 'ㅅ',
	'ㅆ', 'ㅇ', 'ㅈ', 'ㅉ', 'ㅊ', 'ㅋ', 'ㅌ', 'ㅍ', 'ㅎ',
];

const HANGUL_BASE = 0xac00; // '가'
const HANGUL_LAST = 0xd7a3; // '힣'

export const stringUtil: IStringUtil = {
	/* ── 기본 ─────────────────────────────────────────────── */
	isEmpty(value: unknown): boolean {
		if (value === null || value === undefined) return true;
		if (typeof value === 'string') return value.trim().length === 0;
		return false;
	},

	capitalize(value: string): string {
		if (!value) return value;
		return value.charAt(0).toUpperCase() + value.slice(1);
	},

	truncate(value: string, length: number, suffix: string = '...'): string {
		if (value.length <= length) return value;
		return value.slice(0, length) + suffix;
	},

	padStart(value: string | number, length: number, fill: string = '0'): string {
		return String(value).padStart(length, fill);
	},

	padEnd(value: string | number, length: number, fill: string = ' '): string {
		return String(value).padEnd(length, fill);
	},

	removeWhitespace(value: string): string {
		return value.replace(/\s+/g, '');
	},

	trimAll(value: string): string {
		return value.trim().replace(/\s+/g, ' ');
	},

	mask(value: string, start: number, end: number, maskChar: string = '*'): string {
		if (!value) return value;
		const from = Math.max(0, start);
		const to = Math.min(value.length, end);
		if (from >= to) return value;
		return value.slice(0, from) + maskChar.repeat(to - from) + value.slice(to);
	},

	reverse(value: string): string {
		// 서로게이트 페어(이모지 등)가 깨지지 않도록 코드포인트 단위로 뒤집습니다.
		return [...value].reverse().join('');
	},

	replaceAll(value: string, search: string, replacement: string): string {
		if (search === '') return value;
		// split/join으로 정규식 특수문자 이스케이프 없이 전체 치환합니다.
		return value.split(search).join(replacement);
	},

	/* ── 검증 (Validation) ────────────────────────────────── */
	isHangul(value: string): boolean {
		return /^[가-힣]+$/.test(value);
	},

	isEnglish(value: string): boolean {
		return /^[A-Za-z]+$/.test(value);
	},

	isNumeric(value: string): boolean {
		return /^[0-9]+$/.test(value);
	},

	isAlphaNumeric(value: string): boolean {
		return /^[A-Za-z0-9]+$/.test(value);
	},

	isEmail(value: string): boolean {
		return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).trim());
	},

	isMobile(value: string): boolean {
		return /^01[016789]\d{7,8}$/.test(digitsOnly(value));
	},

	isRRN(value: string): boolean {
		const d = digitsOnly(value);
		if (!/^\d{13}$/.test(d)) return false;
		const weights = [2, 3, 4, 5, 6, 7, 8, 9, 2, 3, 4, 5];
		const sum = weights.reduce((acc, w, i) => acc + Number(d[i]) * w, 0);
		const check = (11 - (sum % 11)) % 10;
		return check === Number(d[12]);
	},

	isBizNo(value: string): boolean {
		const d = digitsOnly(value);
		if (!/^\d{10}$/.test(d)) return false;
		const weights = [1, 3, 7, 1, 3, 7, 1, 3, 5];
		let sum = weights.reduce((acc, w, i) => acc + Number(d[i]) * w, 0);
		// 9번째 자리 × 5의 십의 자리를 더합니다. (국세청 검증식)
		sum += Math.floor((Number(d[8]) * 5) / 10);
		const check = (10 - (sum % 10)) % 10;
		return check === Number(d[9]);
	},

	isCorpNo(value: string): boolean {
		const d = digitsOnly(value);
		if (!/^\d{13}$/.test(d)) return false;
		// 앞 12자리에 1·2 가중치를 번갈아 적용합니다.
		let sum = 0;
		for (let i = 0; i < 12; i++) sum += Number(d[i]) * (i % 2 === 0 ? 1 : 2);
		const check = (10 - (sum % 10)) % 10;
		return check === Number(d[12]);
	},

	isCardNo(value: string): boolean {
		const d = digitsOnly(value);
		if (d.length < 12 || d.length > 19) return false;
		// Luhn 알고리즘: 오른쪽부터 한 칸 건너 2배(>9면 -9)한 합이 10의 배수여야 유효합니다.
		let sum = 0;
		let double = false;
		for (let i = d.length - 1; i >= 0; i--) {
			let n = Number(d[i]);
			if (double) {
				n *= 2;
				if (n > 9) n -= 9;
			}
			sum += n;
			double = !double;
		}
		return sum % 10 === 0;
	},

	/* ── 마스킹 (개인정보보호) ────────────────────────────── */
	maskRRN(value: string): string {
		const d = digitsOnly(value);
		if (d.length !== 13) return value;
		// 생년월일(6) + 성별(1)만 노출, 나머지 6자리 마스킹
		return `${d.slice(0, 6)}-${d[6]}${'*'.repeat(6)}`;
	},

	maskName(value: string): string {
		const name = value.trim();
		if (name.length <= 1) return name;
		if (name.length === 2) return `${name[0]}*`;
		return name[0] + '*'.repeat(name.length - 2) + name[name.length - 1];
	},

	maskCardNo(value: string): string {
		const d = digitsOnly(value);
		if (d.length < 12) return value;
		// 앞 4 + 가운데 마스킹 + 뒤 4, 4자리마다 하이픈
		const masked = d.slice(0, 4) + '*'.repeat(d.length - 8) + d.slice(-4);
		return masked.replace(/(.{4})(?=.)/g, '$1-');
	},

	maskAccountNo(value: string): string {
		const d = digitsOnly(value);
		if (d.length < 7) return value;
		// 앞 3·뒤 3자리만 노출
		return d.slice(0, 3) + '*'.repeat(d.length - 6) + d.slice(-3);
	},

	maskMobile(value: string): string {
		const d = digitsOnly(value);
		if (d.length === 11) return `${d.slice(0, 3)}-****-${d.slice(7)}`;
		if (d.length === 10) return `${d.slice(0, 3)}-***-${d.slice(6)}`;
		return value;
	},

	maskEmail(value: string): string {
		const at = value.indexOf('@');
		if (at < 1) return value;
		const id = value.slice(0, at);
		const domain = value.slice(at);
		const visible = Math.min(2, id.length);
		return id.slice(0, visible) + '*'.repeat(Math.max(1, id.length - visible)) + domain;
	},

	/* ── 포맷 (구분자 삽입) ───────────────────────────────── */
	formatMobile(value: string): string {
		const d = digitsOnly(value);
		if (d.length === 11) return d.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
		if (d.length === 10) return d.replace(/(\d{3})(\d{3})(\d{4})/, '$1-$2-$3');
		return value;
	},

	formatBizNo(value: string): string {
		const d = digitsOnly(value);
		if (d.length !== 10) return value;
		return d.replace(/(\d{3})(\d{2})(\d{5})/, '$1-$2-$3');
	},

	formatRRN(value: string): string {
		const d = digitsOnly(value);
		if (d.length !== 13) return value;
		return `${d.slice(0, 6)}-${d.slice(6)}`;
	},

	formatCardNo(value: string): string {
		const d = digitsOnly(value);
		return d.replace(/(.{4})(?=.)/g, '$1-');
	},

	formatBusinessDate(value: string): string {
		const d = digitsOnly(value);
		if (d.length !== 8) return value;
		return `${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6, 8)}`;
	},

	/* ── 변환 (Case) ──────────────────────────────────────── */
	camelCase(value: string): string {
		return splitWords(value)
			.map((w, i) => (i === 0 ? w.toLowerCase() : upperFirst(w)))
			.join('');
	},

	snakeCase(value: string): string {
		return splitWords(value)
			.map((w) => w.toLowerCase())
			.join('_');
	},

	kebabCase(value: string): string {
		return splitWords(value)
			.map((w) => w.toLowerCase())
			.join('-');
	},

	pascalCase(value: string): string {
		return splitWords(value).map(upperFirst).join('');
	},

	/* ── 추출 (Extract) ───────────────────────────────────── */
	onlyNumber(value: string): string {
		return value.replace(/[^0-9]/g, '');
	},

	onlyHangul(value: string): string {
		return value.replace(/[^가-힣ㄱ-ㅎㅏ-ㅣ]/g, '');
	},

	onlyEnglish(value: string): string {
		return value.replace(/[^A-Za-z]/g, '');
	},

	getByteLength(value: string): number {
		let bytes = 0;
		for (const ch of value) bytes += charByte(ch);
		return bytes;
	},

	cutByByte(value: string, byteLength: number, suffix: string = ''): string {
		let bytes = 0;
		let result = '';
		for (const ch of value) {
			const w = charByte(ch);
			if (bytes + w > byteLength) return result + suffix;
			bytes += w;
			result += ch;
		}
		return result;
	},

	/* ── 한글 (Korean) ───────────────────────────────────── */
	getChosung(value: string): string {
		let result = '';
		for (const ch of value) {
			const code = ch.charCodeAt(0);
			if (code >= HANGUL_BASE && code <= HANGUL_LAST) {
				result += CHOSUNG[Math.floor((code - HANGUL_BASE) / 588)];
			} else {
				result += ch;
			}
		}
		return result;
	},

	josa(value: string, josaPair: string): string {
		if (!value) return value;
		const [withBatchim, withoutBatchim = withBatchim] = josaPair.split('/');
		const code = value.charCodeAt(value.length - 1);
		// 마지막 글자가 한글이 아니면 받침 없는 형태로 처리합니다.
		if (code < HANGUL_BASE || code > HANGUL_LAST) return value + withoutBatchim;
		const jong = (code - HANGUL_BASE) % 28;
		// 종성(받침) 인덱스 8 = ㄹ. '으로/로'는 ㄹ받침도 받침 없는 형태('로')를 씁니다.
		const useBatchim = jong !== 0 && !(josaPair.includes('로') && jong === 8);
		return value + (useBatchim ? withBatchim : withoutBatchim);
	},

	/* ── 보안/인코딩 (Security) ──────────────────────────── */
	escapeHtml(value: string): string {
		return value
			.replace(/&/g, '&amp;')
			.replace(/</g, '&lt;')
			.replace(/>/g, '&gt;')
			.replace(/"/g, '&quot;')
			.replace(/'/g, '&#39;');
	},

	unescapeHtml(value: string): string {
		// &amp; 는 중복 복원을 막기 위해 마지막에 처리합니다.
		return value
			.replace(/&lt;/g, '<')
			.replace(/&gt;/g, '>')
			.replace(/&quot;/g, '"')
			.replace(/&#39;/g, "'")
			.replace(/&amp;/g, '&');
	},

	stripTags(value: string): string {
		return value.replace(/<[^>]*>/g, '');
	},

	base64Encode(value: string): string {
		const bytes = new TextEncoder().encode(value);
		let binary = '';
		bytes.forEach((b) => {
			binary += String.fromCharCode(b);
		});
		return btoa(binary);
	},

	base64Decode(value: string): string {
		const binary = atob(value);
		const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
		return new TextDecoder().decode(bytes);
	},
};
