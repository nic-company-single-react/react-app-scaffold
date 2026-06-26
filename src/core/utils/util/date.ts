import dayjs from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import isBetweenPlugin from 'dayjs/plugin/isBetween';
import relativeTime from 'dayjs/plugin/relativeTime';
import quarterOfYear from 'dayjs/plugin/quarterOfYear';
import weekOfYear from 'dayjs/plugin/weekOfYear';
import isLeapYearPlugin from 'dayjs/plugin/isLeapYear';
import 'dayjs/locale/ko';
import type { IDateUtil, DateInput, DateUnit } from '@/types/common';
import { FIXED_HOLIDAYS, LUNAR_AND_SUBSTITUTE } from '@/shared/utils/date/holidays';

// 포맷 문자열을 이용한 엄격한 파싱 및 부가 기능을 위해 플러그인을 등록합니다.
dayjs.extend(customParseFormat);
dayjs.extend(isBetweenPlugin);
dayjs.extend(relativeTime);
dayjs.extend(quarterOfYear);
dayjs.extend(weekOfYear);
dayjs.extend(isLeapYearPlugin);

const DEFAULT_FORMAT = 'YYYY-MM-DD';
const DEFAULT_DATETIME_FORMAT = 'YYYY-MM-DD HH:mm:ss';

/** 요일 인덱스(0=일) → 한글 요일 */
const WEEKDAY_KO = ['일', '월', '화', '수', '목', '금', '토'];

/* ── 공휴일 레지스트리 ───────────────────────────────────────────────
 * 내장 테이블(holidays.ts)을 기본값으로 시작하고, 서버 영업일 캘린더를
 * setHolidays()로 주입하면 음력/대체공휴일 부분을 덮어쓸 수 있습니다.
 * 고정 양력 공휴일(FIXED_HOLIDAYS)은 항상 적용됩니다.
 * ──────────────────────────────────────────────────────────────── */
let customHolidays: Set<string> | null = null;
const fixedSet = new Set(FIXED_HOLIDAYS);
const defaultLunarSet = new Set(LUNAR_AND_SUBSTITUTE);

/**
 * 서버 등 외부에서 공휴일 목록(YYYY-MM-DD)을 주입합니다.
 * 호출하면 내장 음력/대체공휴일 테이블 대신 이 목록을 사용합니다.
 * (고정 양력 공휴일은 항상 함께 적용됩니다.)
 *
 * @example 부트스트랩 시: setHolidays(await fetchHolidays())
 */
export function setHolidays(dates: string[]): void {
	customHolidays = new Set(dates);
}

/** 현재 적용 중인 음력/대체공휴일 집합을 반환합니다. (디버깅·확인용) */
export function getHolidays(): string[] {
	return [...(customHolidays ?? defaultLunarSet)];
}

/** 해당 날짜가 공휴일(고정 양력 + 음력/대체)인지 내부 판정합니다. */
function isHolidayDate(d: dayjs.Dayjs): boolean {
	if (fixedSet.has(d.format('MM-DD'))) return true;
	const lunar = customHolidays ?? defaultLunarSet;
	return lunar.has(d.format('YYYY-MM-DD'));
}

/** 영업일(주말도 공휴일도 아닌 날) 여부 */
function isBusiness(d: dayjs.Dayjs): boolean {
	const day = d.day();
	if (day === 0 || day === 6) return false;
	return !isHolidayDate(d);
}

export const dateUtil: IDateUtil = {
	/* ── 변환 / 파싱 ─────────────────────────────────────────── */
	format(date: DateInput = new Date(), template: string = DEFAULT_FORMAT): string {
		const d = dayjs(date);
		return d.isValid() ? d.format(template) : '';
	},

	now(template: string = DEFAULT_DATETIME_FORMAT): string {
		return dayjs().format(template);
	},

	parse(value: DateInput, template?: string): Date | null {
		const d = template ? dayjs(value as string, template, true) : dayjs(value);
		return d.isValid() ? d.toDate() : null;
	},

	isValid(value: DateInput): boolean {
		return dayjs(value).isValid();
	},

	/* ── 기본 연산 ───────────────────────────────────────────── */
	addDays(date: DateInput, amount: number): Date {
		return dayjs(date).add(amount, 'day').toDate();
	},

	addMonths(date: DateInput, amount: number): Date {
		return dayjs(date).add(amount, 'month').toDate();
	},

	addYears(date: DateInput, amount: number): Date {
		return dayjs(date).add(amount, 'year').toDate();
	},

	add(date: DateInput, amount: number, unit: DateUnit): Date {
		return dayjs(date).add(amount, unit).toDate();
	},

	diffDays(a: DateInput, b: DateInput): number {
		return dayjs(a).startOf('day').diff(dayjs(b).startOf('day'), 'day');
	},

	diffMonths(a: DateInput, b: DateInput): number {
		return dayjs(a).diff(dayjs(b), 'month');
	},

	diffYears(a: DateInput, b: DateInput): number {
		return dayjs(a).diff(dayjs(b), 'year');
	},

	/* ── 시작 / 끝 경계 ──────────────────────────────────────── */
	startOf(date: DateInput, unit: DateUnit): Date {
		return dayjs(date).startOf(unit).toDate();
	},

	endOf(date: DateInput, unit: DateUnit): Date {
		return dayjs(date).endOf(unit).toDate();
	},

	firstDayOfMonth(date: DateInput): Date {
		return dayjs(date).startOf('month').toDate();
	},

	lastDayOfMonth(date: DateInput): Date {
		return dayjs(date).endOf('month').toDate();
	},

	daysInMonth(date: DateInput): number {
		return dayjs(date).daysInMonth();
	},

	/* ── 비교 / 판별 ─────────────────────────────────────────── */
	isBefore(a: DateInput, b: DateInput): boolean {
		return dayjs(a).isBefore(dayjs(b));
	},

	isAfter(a: DateInput, b: DateInput): boolean {
		return dayjs(a).isAfter(dayjs(b));
	},

	isSame(a: DateInput, b: DateInput, unit: DateUnit = 'day'): boolean {
		return dayjs(a).isSame(dayjs(b), unit);
	},

	isBetween(date: DateInput, start: DateInput, end: DateInput): boolean {
		// 양 끝 경계를 포함합니다('[]'). 일 단위로 비교합니다.
		return dayjs(date).isBetween(dayjs(start), dayjs(end), 'day', '[]');
	},

	isToday(date: DateInput): boolean {
		return dayjs(date).isSame(dayjs(), 'day');
	},

	isPast(date: DateInput): boolean {
		return dayjs(date).isBefore(dayjs());
	},

	isFuture(date: DateInput): boolean {
		return dayjs(date).isAfter(dayjs());
	},

	min(a: DateInput, b: DateInput): Date {
		const da = dayjs(a);
		const db = dayjs(b);
		return (da.isBefore(db) ? da : db).toDate();
	},

	max(a: DateInput, b: DateInput): Date {
		const da = dayjs(a);
		const db = dayjs(b);
		return (da.isAfter(db) ? da : db).toDate();
	},

	/* ── 영업일 (Business Day) ───────────────────────────────── */
	isWeekend(date: DateInput): boolean {
		const day = dayjs(date).day();
		return day === 0 || day === 6;
	},

	isHoliday(date: DateInput): boolean {
		return isHolidayDate(dayjs(date));
	},

	isBusinessDay(date: DateInput): boolean {
		return isBusiness(dayjs(date));
	},

	addBusinessDays(date: DateInput, amount: number): Date {
		let d = dayjs(date);
		const step = amount >= 0 ? 1 : -1;
		let remaining = Math.abs(amount);
		while (remaining > 0) {
			d = d.add(step, 'day');
			if (isBusiness(d)) remaining--;
		}
		return d.toDate();
	},

	diffBusinessDays(a: DateInput, b: DateInput): number {
		// a - b: b 다음 날부터 a까지의 영업일 수를 셉니다. (부호 유지)
		let start = dayjs(b).startOf('day');
		const end = dayjs(a).startOf('day');
		if (start.isSame(end)) return 0;
		const sign = end.isAfter(start) ? 1 : -1;
		let count = 0;
		while (!start.isSame(end)) {
			start = start.add(sign, 'day');
			if (isBusiness(start)) count += sign;
		}
		return count;
	},

	nextBusinessDay(date: DateInput): Date {
		let d = dayjs(date).add(1, 'day');
		while (!isBusiness(d)) d = d.add(1, 'day');
		return d.toDate();
	},

	prevBusinessDay(date: DateInput): Date {
		let d = dayjs(date).subtract(1, 'day');
		while (!isBusiness(d)) d = d.subtract(1, 'day');
		return d.toDate();
	},

	/* ── 표시 / 포맷 ─────────────────────────────────────────── */
	formatKorean(date: DateInput): string {
		const d = dayjs(date);
		return d.isValid() ? `${d.year()}년 ${d.month() + 1}월 ${d.date()}일` : '';
	},

	dayOfWeek(date: DateInput): string {
		const d = dayjs(date);
		return d.isValid() ? WEEKDAY_KO[d.day()] : '';
	},

	fromNow(date: DateInput): string {
		const d = dayjs(date);
		return d.isValid() ? d.locale('ko').fromNow() : '';
	},

	getQuarter(date: DateInput): number {
		return dayjs(date).quarter();
	},

	weekOfYear(date: DateInput): number {
		return dayjs(date).week();
	},

	toBusinessDate(date: DateInput): string {
		const d = dayjs(date);
		return d.isValid() ? d.format('YYYYMMDD') : '';
	},

	/* ── 기타 실무 ───────────────────────────────────────────── */
	age(birth: DateInput): number {
		const b = dayjs(birth);
		if (!b.isValid()) return 0;
		// 생일이 지났는지 보정한 만 나이입니다.
		return dayjs().diff(b, 'year');
	},

	isLeapYear(date: DateInput): boolean {
		return dayjs(date).isLeapYear();
	},

	range(start: DateInput, end: DateInput): Date[] {
		let cur = dayjs(start).startOf('day');
		const last = dayjs(end).startOf('day');
		if (!cur.isValid() || !last.isValid() || cur.isAfter(last)) return [];
		const result: Date[] = [];
		while (!cur.isAfter(last)) {
			result.push(cur.toDate());
			cur = cur.add(1, 'day');
		}
		return result;
	},
};
