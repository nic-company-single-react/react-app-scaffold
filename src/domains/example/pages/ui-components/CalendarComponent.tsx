import { useMemo, useState } from 'react';
import { Calendar, CodeBlock } from '@axiom/components/ui';
import { ko } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import { CalendarDays, Layers, Paintbrush } from 'lucide-react';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import CalExCard from '@/domains/example/components/ui-components/calendar/CalExCard';
import DateBadge from '@/domains/example/components/ui-components/calendar/DateBadge';
import PresetButton from '@/domains/example/components/ui-components/calendar/PresetButton';
import DatePickerField from '@/domains/example/components/ui-components/calendar/DatePickerField';
import PeriodSearchCalendar from '@/domains/example/components/ui-components/calendar/PeriodSearchCalendar';
import pickerSource from '@/domains/example/components/ui-components/calendar/DatePickerField.tsx?raw';
import periodSource from '@/domains/example/components/ui-components/calendar/PeriodSearchCalendar.tsx?raw';
import periodCss from '@/domains/example/components/ui-components/calendar/PeriodSearchCalendar.module.css?raw';

/* 리렌더마다 새 Date 객체가 생기지 않도록 고정값은 모듈 스코프에 둔다. */
const DROPDOWN_START = new Date(2020, 0);
const DROPDOWN_END = new Date(2030, 11);

/** 프리셋 예제 — 오늘로부터 N일 뒤 */
const PRESETS: { key: string; label: string; days: number }[] = [
	{ key: 'today', label: '오늘', days: 0 },
	{ key: 'tomorrow', label: '내일', days: 1 },
	{ key: '3days', label: '3일 후', days: 3 },
	{ key: '1week', label: '1주일 후', days: 7 },
	{ key: '2weeks', label: '2주일 후', days: 14 },
];

function startOfToday(): Date {
	const d = new Date();
	d.setHours(0, 0, 0, 0);
	return d;
}

function addDays(base: Date, days: number): Date {
	const d = new Date(base);
	d.setDate(d.getDate() + days);
	return d;
}

export default function CalendarComponent(): React.ReactNode {
	const today = useMemo(() => startOfToday(), []);

	/* 각 섹션의 선택 상태 */
	const [basicDate, setBasicDate] = useState<Date | undefined>(today);
	const [multipleDates, setMultipleDates] = useState<Date[] | undefined>([today, addDays(today, 2)]);
	const [range, setRange] = useState<DateRange | undefined>({ from: today, to: addDays(today, 5) });
	const [dropdownDate, setDropdownDate] = useState<Date | undefined>(today);
	const [monthsDate, setMonthsDate] = useState<Date | undefined>(today);
	const [workDate, setWorkDate] = useState<Date | undefined>(undefined);
	const [optionDate, setOptionDate] = useState<Date | undefined>(today);
	const [localeDate, setLocaleDate] = useState<Date | undefined>(today);
	const [holidayDate, setHolidayDate] = useState<Date | undefined>(undefined);
	const [pickerDate, setPickerDate] = useState<Date | undefined>(undefined);
	const [presetDate, setPresetDate] = useState<Date | undefined>(today);
	const [activePreset, setActivePreset] = useState<string>('today');
	const [cssVarRange, setCssVarRange] = useState<DateRange | undefined>({ from: today, to: addDays(today, 4) });
	const [classNamesDate, setClassNamesDate] = useState<Date | undefined>(today);

	/* 주말 비활성화 matcher */
	const isWeekend = useMemo(() => (date: Date) => date.getDay() === 0 || date.getDay() === 6, []);

	/* 오늘 이전 선택 금지 matcher */
	const beforeToday = useMemo(() => ({ before: today }), [today]);

	/* 양력 고정 공휴일 (해가 바뀌어도 동작하도록 올해 기준으로 계산) */
	const holidays = useMemo(() => {
		const y = today.getFullYear();
		return [
			new Date(y, 0, 1), // 신정
			new Date(y, 2, 1), // 삼일절
			new Date(y, 4, 5), // 어린이날
			new Date(y, 5, 6), // 현충일
			new Date(y, 7, 15), // 광복절
			new Date(y, 9, 3), // 개천절
			new Date(y, 9, 9), // 한글날
			new Date(y, 11, 25), // 성탄절
		];
	}, [today]);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20">
					<CalendarDays className="w-5 h-5 text-blue-600 dark:text-blue-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Calendar 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-blue-300/50 bg-blue-100/60 text-blue-800 dark:border-blue-600/40 dark:bg-blue-900/30 dark:text-blue-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Calendar 컴포넌트 사용 예제입니다. (shadcn/ui + react-day-picker v9 기반)
					</p>
				</div>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Calendar 하나로 단일·복수·기간 선택을 모두 처리합니다. mode 로 선택 방식을 정하고, selected / onSelect 로 값을 제어합니다."
				/>
				<CodeBlock
					code={`import { useState } from 'react';
import { Calendar } from '@axiom/components/ui';

const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border"
/>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>mode</b> 에 따라 <b>selected</b> / <b>onSelect</b> 의 타입이 함께 바뀝니다 —{' '}
					<code className="font-mono">single</code> 은 <code className="font-mono">Date</code>,{' '}
					<code className="font-mono">multiple</code> 은 <code className="font-mono">Date[]</code>,{' '}
					<code className="font-mono">range</code> 는 <code className="font-mono">DateRange</code>. 기간 타입은{' '}
					<code className="font-mono">react-day-picker</code> 에서 import 합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 단일 선택"
					description='mode="single" 로 날짜를 하나만 선택합니다. 가장 많이 쓰이는 기본 형태입니다.'
				/>
				<CalExCard
					label='mode="single"'
					code={`const [date, setDate] = useState<Date | undefined>(new Date());

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							selected={basicDate}
							onSelect={setBasicDate}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={basicDate}
							accent
						/>
					</div>
				</CalExCard>
			</section>

			{/* ── 2. Multiple ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 복수 선택 (multiple)"
					description='mode="multiple" 로 여러 날짜를 각각 선택합니다. max 로 선택 개수를 제한할 수 있습니다.'
				/>
				<CalExCard
					label='mode="multiple" max={5}'
					code={`const [dates, setDates] = useState<Date[] | undefined>([]);

<Calendar
  mode="multiple"
  max={5}
  selected={dates}
  onSelect={setDates}
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="multiple"
							max={5}
							selected={multipleDates}
							onSelect={setMultipleDates}
							className="rounded-lg border"
						/>
						<div className="flex flex-wrap justify-center gap-2">
							{multipleDates?.length ? (
								multipleDates.map((d) => (
									<DateBadge
										key={d.toISOString()}
										value={d}
									/>
								))
							) : (
								<DateBadge label="선택된 날짜" />
							)}
						</div>
					</div>
				</CalExCard>
			</section>

			{/* ── 3. Range ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 기간 선택 (range)"
					description='mode="range" 로 시작일과 종료일을 선택합니다. min / max 로 기간의 길이를 제한할 수 있습니다.'
				/>
				<CalExCard
					label='mode="range" numberOfMonths={2}'
					code={`import type { DateRange } from 'react-day-picker';

const [range, setRange] = useState<DateRange | undefined>({
  from: new Date(),
  to: undefined,
});

<Calendar
  mode="range"
  selected={range}
  onSelect={setRange}
  numberOfMonths={2}
  max={30}          // 최대 30일까지만 선택
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="range"
							selected={range}
							onSelect={setRange}
							numberOfMonths={2}
							max={30}
							className="rounded-lg border"
						/>
						<div className="flex flex-wrap justify-center gap-2">
							<DateBadge
								label="시작일"
								value={range?.from}
								accent
							/>
							<DateBadge
								label="종료일"
								value={range?.to}
								accent
							/>
						</div>
					</div>
				</CalExCard>
			</section>

			{/* ── 4. captionLayout ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 월·년 드롭다운 (captionLayout)"
					description='captionLayout="dropdown" 으로 월·연도를 드롭다운에서 바로 고릅니다. 생년월일처럼 먼 날짜를 고를 때 필수입니다. 선택 가능한 범위는 startMonth / endMonth 로 지정합니다.'
				/>
				<CalExCard
					label='captionLayout="dropdown" + startMonth / endMonth'
					code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
  startMonth={new Date(2020, 0)}
  endMonth={new Date(2030, 11)}
  className="rounded-lg border"
/>

// "dropdown-months" — 월만 드롭다운
// "dropdown-years"  — 연도만 드롭다운`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							selected={dropdownDate}
							onSelect={setDropdownDate}
							captionLayout="dropdown"
							startMonth={DROPDOWN_START}
							endMonth={DROPDOWN_END}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={dropdownDate}
						/>
					</div>
				</CalExCard>
			</section>

			{/* ── 5. numberOfMonths ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 여러 달 표시 (numberOfMonths)"
					description="한 화면에 여러 달을 나란히 보여줍니다. 기간 선택과 조합하면 사용성이 크게 좋아집니다."
				/>
				<CalExCard
					label="numberOfMonths={2}"
					code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  numberOfMonths={2}
  className="rounded-lg border"
/>`}
				>
					<Calendar
						mode="single"
						selected={monthsDate}
						onSelect={setMonthsDate}
						numberOfMonths={2}
						className="rounded-lg border"
					/>
				</CalExCard>
			</section>

			{/* ── 6. 날짜 제한 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 날짜 제한 (disabled)"
					description="disabled 에 Matcher 를 넘겨 선택 불가 날짜를 지정합니다. 함수·객체·배열 모두 사용할 수 있습니다."
				/>
				<CalExCard
					label="disabled — 주말 + 오늘 이전 비활성화"
					code={`// ① 함수형 — 주말 비활성화
const isWeekend = (date: Date) =>
  date.getDay() === 0 || date.getDay() === 6;

// ② 객체형 — 오늘 이전 비활성화
const beforeToday = { before: new Date() };

<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  disabled={[isWeekend, beforeToday]}   // 배열로 여러 조건 조합
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							selected={workDate}
							onSelect={setWorkDate}
							disabled={[isWeekend, beforeToday]}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 영업일"
							value={workDate}
						/>
					</div>
				</CalExCard>
				<div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4">
					<p className="text-xs font-semibold text-gray-700 dark:text-gray-300 mb-2">Matcher 종류</p>
					<ul className="space-y-1 text-xs text-gray-600 dark:text-gray-400">
						<li>
							<code className="font-mono text-blue-700 dark:text-blue-400">new Date(2026, 7, 15)</code> — 특정 하루
						</li>
						<li>
							<code className="font-mono text-blue-700 dark:text-blue-400">{`{ from, to }`}</code> — 기간
						</li>
						<li>
							<code className="font-mono text-blue-700 dark:text-blue-400">{`{ before }`}</code> /{' '}
							<code className="font-mono text-blue-700 dark:text-blue-400">{`{ after }`}</code> — 이전 / 이후 전체
						</li>
						<li>
							<code className="font-mono text-blue-700 dark:text-blue-400">{`{ dayOfWeek: [0, 6] }`}</code> — 특정 요일
							(0=일 … 6=토)
						</li>
						<li>
							<code className="font-mono text-blue-700 dark:text-blue-400">{`(date) => boolean`}</code> — 임의 조건
						</li>
						<li>
							위 항목들의 <b>배열</b> — OR 조건으로 조합
						</li>
					</ul>
				</div>
			</section>

			{/* ── 7. 표시 옵션 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 표시 옵션"
					description="바깥 날짜·주 번호·주 시작 요일·고정 주 수 등 달력의 뼈대를 조정하는 옵션들입니다."
				/>
				<CalExCard
					label="showOutsideDays={false} · fixedWeeks"
					code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  showOutsideDays={false}   // 이전/다음 달 날짜 숨김 (기본 true)
  fixedWeeks                // 항상 6주로 고정 → 달마다 높이가 안 흔들림
  className="rounded-lg border"
/>`}
				>
					<Calendar
						mode="single"
						selected={optionDate}
						onSelect={setOptionDate}
						showOutsideDays={false}
						fixedWeeks
						className="rounded-lg border"
					/>
				</CalExCard>
				<CalExCard
					label="showWeekNumber · weekStartsOn={1}"
					code={`<Calendar
  mode="single"
  selected={date}
  onSelect={setDate}
  showWeekNumber      // 왼쪽에 ISO 주 번호 열 추가
  weekStartsOn={1}    // 월요일 시작 (0=일 … 6=토, 기본 0)
  className="rounded-lg border"
/>`}
				>
					<Calendar
						mode="single"
						selected={optionDate}
						onSelect={setOptionDate}
						showWeekNumber
						weekStartsOn={1}
						className="rounded-lg border"
					/>
				</CalExCard>
			</section>

			{/* ── 8. locale ────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 한국어 로케일 (locale)"
					description="date-fns 의 ko 로케일을 넘기면 요일·월 표기가 한국어로 바뀝니다. 국내 SI 프로젝트에서는 사실상 기본값으로 두는 옵션입니다."
				/>
				<CalExCard
					label="locale={ko}"
					code={`import { ko } from 'date-fns/locale';

<Calendar
  mode="single"
  locale={ko}
  selected={date}
  onSelect={setDate}
  captionLayout="dropdown"
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							locale={ko}
							selected={localeDate}
							onSelect={setLocaleDate}
							captionLayout="dropdown"
							startMonth={DROPDOWN_START}
							endMonth={DROPDOWN_END}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={localeDate}
						/>
					</div>
				</CalExCard>
			</section>

			{/* ── 9. modifiers ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. 커스텀 표시 (modifiers)"
					description="modifiers 로 날짜에 이름표를 붙이고, modifiersClassNames 로 그 이름표에 클래스를 입힙니다. 공휴일·마감일·예약된 날 표시에 씁니다."
				/>
				<CalExCard
					label="modifiers — 공휴일 빨간색 표시"
					code={`const holidays = [
  new Date(2026, 0, 1),   // 신정
  new Date(2026, 2, 1),   // 삼일절
  new Date(2026, 4, 5),   // 어린이날
  // ...
];

<Calendar
  mode="single"
  locale={ko}
  selected={date}
  onSelect={setDate}
  modifiers={{ holiday: holidays }}
  modifiersClassNames={{
    holiday: 'text-red-500 dark:text-red-400',
  }}
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							locale={ko}
							selected={holidayDate}
							onSelect={setHolidayDate}
							defaultMonth={holidays[4]}
							modifiers={{ holiday: holidays }}
							modifiersClassNames={{ holiday: 'text-red-500 dark:text-red-400' }}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={holidayDate}
						/>
					</div>
				</CalExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>modifiersClassNames</b> 의 클래스는 날짜 칸(<code className="font-mono">td.rdp-day</code>)에 붙습니다.
					글자색처럼 상속되는 속성은 그대로 먹히지만, 내부 버튼이 직접 지정한 속성(예{' '}
					<code className="font-mono">font-weight</code>)은 덮이지 않습니다. 그런 경우엔 아래 퍼블리셔 가이드의 CSS
					Module 방식을 쓰세요.
				</p>
			</section>

			{/* ── 10. Date Picker ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="10. Date Picker — 버튼 클릭으로 열기"
					description="입력 필드처럼 생긴 트리거를 누르면 달력이 뜨는 형태입니다. scaffold 에는 Popover 가 없어 useRef + 바깥 클릭 감지로 직접 구현했고, 컴포넌트로 분리해 두었습니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">DatePickerField</span>
					</div>
					<div className="p-5 flex flex-col items-center gap-3">
						<DatePickerField
							value={pickerDate}
							onChange={setPickerDate}
							disabled={beforeToday}
						/>
						<DateBadge
							label="선택된 날짜"
							value={pickerDate}
							accent
						/>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`import DatePickerField from '@/domains/example/components/ui-components/calendar/DatePickerField';

const [date, setDate] = useState<Date | undefined>(undefined);

<DatePickerField
  value={date}
  onChange={setDate}
  disabled={{ before: new Date() }}
  placeholder="날짜를 선택하세요"
/>`}
						/>
					</div>
				</div>
				<SourceTabs files={[{ filename: 'DatePickerField.tsx', code: pickerSource, lang: 'tsx' }]} />
			</section>

			{/* ── 11. 프리셋 조합 ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="11. 프리셋 조합"
					description="'오늘 / 내일 / 1주일 후' 같은 버튼으로 날짜를 빠르게 지정합니다. Calendar 는 그대로 두고 버튼이 상태만 바꿔주면 됩니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">PresetButton + Calendar</span>
					</div>
					<div className="p-5 flex flex-col items-center gap-4">
						<div className="flex flex-wrap justify-center gap-2">
							{PRESETS.map(({ key, label, days }) => (
								<PresetButton
									key={key}
									label={label}
									active={activePreset === key}
									onClick={() => {
										setActivePreset(key);
										setPresetDate(addDays(today, days));
									}}
								/>
							))}
						</div>
						<Calendar
							mode="single"
							locale={ko}
							month={presetDate}
							selected={presetDate}
							onSelect={(d) => {
								setPresetDate(d);
								setActivePreset('');
							}}
							onMonthChange={setPresetDate}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={presetDate}
							accent
						/>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const PRESETS = [
  { key: 'today',   label: '오늘',     days: 0  },
  { key: 'tomorrow',label: '내일',     days: 1  },
  { key: '1week',   label: '1주일 후', days: 7  },
];

const addDays = (base: Date, days: number) => {
  const d = new Date(base);
  d.setDate(d.getDate() + days);
  return d;
};

// month / onMonthChange 를 함께 제어해야
// 프리셋으로 다른 달을 고를 때 화면이 그 달로 따라간다.
<Calendar
  mode="single"
  locale={ko}
  month={date}
  selected={date}
  onSelect={setDate}
  onMonthChange={setDate}
  className="rounded-lg border"
/>`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="Props 요약" />
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">기본값</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{
										prop: 'mode',
										type: '"single" | "multiple" | "range"',
										def: '—',
										desc: '선택 방식. selected / onSelect 의 타입을 함께 결정한다',
									},
									{
										prop: 'selected',
										type: 'Date | Date[] | DateRange',
										def: 'undefined',
										desc: '선택된 값 (mode 에 따라 타입이 달라짐)',
									},
									{ prop: 'onSelect', type: '(value) => void', def: '—', desc: '선택이 바뀔 때 호출' },
									{ prop: 'min / max', type: 'number', def: '—', desc: 'multiple: 개수 제한 / range: 기간 일수 제한' },
									{
										prop: 'disabled',
										type: 'Matcher | Matcher[]',
										def: 'undefined',
										desc: '선택 불가 날짜 (6번 섹션 참고)',
									},
									{
										prop: 'captionLayout',
										type: '"label" | "dropdown" | "dropdown-months" | "dropdown-years"',
										def: '"label"',
										desc: '월·년 캡션을 라벨로 볼지 드롭다운으로 볼지',
									},
									{
										prop: 'startMonth / endMonth',
										type: 'Date',
										def: '—',
										desc: '이동 가능한 월의 범위 (드롭다운 목록 범위도 이 값을 따름)',
									},
									{ prop: 'numberOfMonths', type: 'number', def: '1', desc: '한 번에 표시할 달 수' },
									{ prop: 'defaultMonth / month', type: 'Date', def: '—', desc: '처음 보여줄 달 / 제어할 달' },
									{ prop: 'onMonthChange', type: '(month: Date) => void', def: '—', desc: '표시 중인 달이 바뀔 때' },
									{ prop: 'showOutsideDays', type: 'boolean', def: 'true', desc: '이전·다음 달 날짜 표시 여부' },
									{ prop: 'fixedWeeks', type: 'boolean', def: 'false', desc: '항상 6주로 고정해 높이를 일정하게 유지' },
									{ prop: 'showWeekNumber', type: 'boolean', def: 'false', desc: 'ISO 주 번호 열 표시' },
									{ prop: 'weekStartsOn', type: '0 ~ 6', def: '0 (일요일)', desc: '주 시작 요일' },
									{ prop: 'locale', type: 'Locale (date-fns)', def: 'en-US', desc: '언어·요일 표기 로케일' },
									{ prop: 'navLayout', type: '"around" | "after"', def: 'undefined', desc: '이전/다음 버튼 배치' },
									{ prop: 'animate', type: 'boolean', def: 'false', desc: '달 전환 애니메이션' },
									{ prop: 'footer', type: 'ReactNode', def: '—', desc: '달력 하단 영역' },
									{
										prop: 'modifiers / modifiersClassNames',
										type: 'Record<string, Matcher> / Record<string, string>',
										def: '—',
										desc: '날짜에 이름표를 붙이고 클래스를 입힘',
									},
									{
										prop: 'classNames',
										type: 'Partial<ClassNames>',
										def: '—',
										desc: '파트별 클래스 교체 (병합 아님 — 퍼블리셔 가이드 ② 참고)',
									},
									{
										prop: 'className / style',
										type: 'string / CSSProperties',
										def: '—',
										desc: '루트 요소에 직접 적용',
									},
									{
										prop: 'buttonVariant',
										type: 'Button 의 variant',
										def: '"ghost"',
										desc: '이전/다음 버튼에 적용할 scaffold Button 변형',
									},
								].map((row) => (
									<tr
										key={row.prop}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5 whitespace-nowrap">
											<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.prop}</code>
										</td>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.type}</code>
										</td>
										<td className="px-4 py-2.5 whitespace-nowrap">
											<code className="text-xs font-mono text-amber-700 dark:text-amber-400">{row.def}</code>
										</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* ── 퍼블리셔 가이드 도입부 ───────────────────────────── */}
			<div className="flex items-center gap-3 rounded-2xl border border-amber-200 dark:border-amber-800/60 bg-amber-50 dark:bg-amber-900/20 p-4">
				<div className="flex items-center justify-center w-9 h-9 shrink-0 rounded-xl bg-amber-100 dark:bg-amber-900/40">
					<Paintbrush className="w-4 h-4 text-amber-700 dark:text-amber-400" />
				</div>
				<p className="text-xs leading-relaxed text-amber-900 dark:text-amber-200">
					<b>퍼블리셔 가이드</b> — Calendar 는 프로젝트마다 디자인이 가장 많이 바뀌는 컴포넌트입니다. 아래 세 가지
					방법을 <b>바꿀 범위가 좁은 순서</b>로 정리했습니다. 위쪽 방법으로 해결되면 아래로 내려가지 마세요.
				</p>
			</div>

			{/* ── 12. 퍼블리셔 가이드 ① ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="12. 퍼블리셔 가이드 ① — 토큰 & CSS 변수"
					description="색은 전역 테마 토큰을 따라가고, 크기·모서리는 Calendar 가 공개한 CSS 변수 두 개로 조절합니다. 마크업을 전혀 건드리지 않는 가장 안전한 방법입니다."
				/>
				<div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 p-4 space-y-2">
					<p className="text-xs font-semibold text-gray-700 dark:text-gray-300">
						색 — <code className="font-mono">src/assets/styles/themes/theme-*.css</code>
					</p>
					<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
						Calendar 가 쓰는 색은 전부 시맨틱 토큰입니다. 테마 파일에서 아래 값만 바꾸면 달력 색이 함께 바뀝니다 —{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--primary</code> (선택된 날짜),{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--muted</code> (오늘·기간 배경),{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--background</code>,{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--muted-foreground</code> (요일·바깥 날짜),{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--ring</code> (포커스 링),{' '}
						<code className="font-mono text-blue-700 dark:text-blue-400">--radius</code>.
					</p>
				</div>
				<CalExCard
					label="크기·모서리 — --cell-size / --cell-radius"
					code={`// Calendar 루트에 심어둔 공개 변수 2개
//   --cell-size   : 날짜 한 칸의 크기          (기본 1.75rem)
//   --cell-radius : 날짜 "칸(td)"의 모서리     (기본 --radius-md)
//                   → 오늘 표시·기간 밴드의 모양을 결정한다

<Calendar
  mode="range"
  locale={ko}
  selected={range}
  onSelect={setRange}
  style={{
    '--cell-size': '2.75rem',
    '--cell-radius': '9999px',
  } as React.CSSProperties}
  // 날짜 "버튼" 의 모서리는 scaffold Button(rounded-lg)을 따르므로
  // 완전한 원형을 원하면 이 한 줄을 더한다.
  classNames={{ day_button: 'rounded-full' }}
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="range"
							locale={ko}
							selected={cssVarRange}
							onSelect={setCssVarRange}
							style={
								{
									'--cell-size': '2.75rem',
									'--cell-radius': '9999px',
								} as React.CSSProperties
							}
							classNames={{ day_button: 'rounded-full' }}
							className="rounded-lg border"
						/>
						<div className="flex flex-wrap justify-center gap-2">
							<DateBadge
								label="시작일"
								value={cssVarRange?.from}
							/>
							<DateBadge
								label="종료일"
								value={cssVarRange?.to}
							/>
						</div>
					</div>
				</CalExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<code className="font-mono">--cell-radius</code> 는 날짜 <b>칸(td)</b> 에 걸립니다. 오늘 표시나 기간 밴드처럼
					칸 배경으로 그려지는 요소의 모양이 이 값을 따릅니다. 반면 클릭되는 날짜 <b>버튼</b> 의 모서리는 scaffold
					Button 의 <code className="font-mono">rounded-lg</code> 를 그대로 쓰므로, 위 예제처럼{' '}
					<code className="font-mono">day_button</code> 클래스를 한 줄 더해야 원형이 완성됩니다.
				</p>
			</section>

			{/* ── 13. 퍼블리셔 가이드 ② ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="13. 퍼블리셔 가이드 ② — classNames prop"
					description="파트 단위로 Tailwind 클래스를 갈아끼웁니다. 몇 군데만 손볼 때 적합합니다."
				/>
				<div className="rounded-xl border border-red-200 dark:border-red-900/60 bg-red-50 dark:bg-red-900/20 p-4">
					<p className="text-xs text-red-800 dark:text-red-300 leading-relaxed">
						⚠️ <b>주의 — classNames 는 병합이 아니라 교체입니다.</b> 넘긴 키는 scaffold 의 기본 클래스를 통째로
						대체하므로, 레이아웃까지 같이 날아갑니다. 예를 들어 <code className="font-mono">month_caption</code> 을
						덮어쓸 때 <code className="font-mono">px-(--cell-size)</code> 를 빠뜨리면 캡션 글자가 이전/다음 버튼 밑으로
						겹칩니다. <b>색만 더하고 싶다면 이 방법 대신 아래 ③번 CSS Module 을 쓰세요.</b>
					</p>
				</div>
				<CalExCard
					label="classNames — 캡션·요일·오늘 스타일 교체"
					code={`<Calendar
  mode="single"
  locale={ko}
  selected={date}
  onSelect={setDate}
  classNames={{
    // 기존 레이아웃 클래스를 그대로 옮겨 적고 색만 추가한다
    month_caption:
      'flex h-(--cell-size) w-full items-center justify-center ' +
      'px-(--cell-size) text-sm font-bold text-emerald-700 dark:text-emerald-400',
    weekday:
      'flex-1 text-[0.8rem] font-semibold text-emerald-600/70 dark:text-emerald-400/70',
    today:
      'rounded-(--cell-radius) ring-2 ring-emerald-400 dark:ring-emerald-500',
  }}
  className="rounded-lg border"
/>`}
				>
					<div className="flex flex-col items-center gap-3">
						<Calendar
							mode="single"
							locale={ko}
							selected={classNamesDate}
							onSelect={setClassNamesDate}
							classNames={{
								month_caption:
									'flex h-(--cell-size) w-full items-center justify-center px-(--cell-size) text-sm font-bold text-emerald-700 dark:text-emerald-400',
								weekday: 'flex-1 text-[0.8rem] font-semibold text-emerald-600/70 dark:text-emerald-400/70',
								today: 'rounded-(--cell-radius) ring-2 ring-emerald-400 dark:ring-emerald-500',
							}}
							className="rounded-lg border"
						/>
						<DateBadge
							label="선택된 날짜"
							value={classNamesDate}
						/>
					</div>
				</CalExCard>
			</section>

			{/* ── 14. 퍼블리셔 가이드 ③ ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="14. 퍼블리셔 가이드 ③ — CSS Module 전면 재스킨"
					description="디자인이 통째로 달라질 때 쓰는 방법입니다. .tsx 는 손대지 않고 *.module.css 하나만 교체하면 됩니다. 아래 실전 예제가 이 방식으로 만들어졌습니다."
				/>
				<CodeBlock
					code={`/* MyCalendar.module.css — 소비 컴포넌트 바로 옆에 둔다 */

.wrap {
  --brand: #008485;
}

/* 래퍼 + 훅을 2~4단계로 겹쳐 Tailwind 유틸리티보다 명시도를 높인다 */
.wrap :global([data-slot='calendar']) {
  --cell-size: 2.375rem;    /* 공개 변수로 크기부터 잡고 */
  --cell-radius: 8px;
}

.wrap :global(.rdp-day) button {          /* (0,2,1) 기본형 */
  border-radius: var(--cell-radius);
  font-weight: 600;
}

.wrap :global(.rdp-week) :global(.rdp-day):first-child button {
  color: #d0455a;                          /* (0,4,1) 일요일 빨강 */
}

/* ⚠️ 상태 규칙은 요일 규칙과 명시도가 같으므로 반드시 "아래에" 선언한다.
 *    순서가 뒤바뀌면 일요일 빨강이 선택 상태의 흰 글씨를 덮어쓴다. */
.wrap :global(.rdp-week) :global(.rdp-day) button[data-selected-single='true'] {
  background: var(--brand);
  color: #fff;
}

/* 다크 모드는 앱 규칙대로 :global(.dark) 로 처리 */
:global(.dark) .wrap {
  --brand: #38b2a7;
}`}
					lang="css"
					theme="github-dark"
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							DOM 후킹 포인트 — 이 선택자들로 어디든 잡을 수 있습니다
						</span>
					</div>
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">선택자</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">요소</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{ sel: '[data-slot="calendar"] · .rdp-root', el: 'div', desc: '달력 루트. 두 선택자 모두 붙는다' },
									{ sel: '.rdp-months / .rdp-month', el: 'div', desc: '달 컨테이너 (여러 달 표시 시 반복)' },
									{ sel: '.rdp-nav', el: 'nav', desc: '이전/다음 버튼 바 (루트 상단에 absolute)' },
									{ sel: '.rdp-button_previous / .rdp-button_next', el: 'button', desc: '이전 / 다음 달 버튼' },
									{ sel: '.rdp-month_caption / .rdp-caption_label', el: 'div / span', desc: '"2026년 8월" 캡션' },
									{
										sel: '.rdp-dropdowns / .rdp-dropdown',
										el: 'div / select',
										desc: '월·년 드롭다운 (투명하게 겹쳐 있음)',
									},
									{ sel: '.rdp-weekdays / .rdp-weekday', el: 'tr / th', desc: '요일 헤더 줄 / 각 요일 칸' },
									{ sel: '.rdp-week / .rdp-day', el: 'tr / td', desc: '한 주 / 날짜 칸' },
									{ sel: '.rdp-day > button', el: 'button', desc: '실제 클릭되는 날짜 버튼' },
									{ sel: '.rdp-today / .rdp-outside / .rdp-disabled', el: 'td', desc: '오늘 / 바깥 달 / 선택 불가' },
									{
										sel: '.rdp-selected / .rdp-range_start / .rdp-range_middle / .rdp-range_end',
										el: 'td',
										desc: '선택 · 기간 상태',
									},
									{
										sel: 'td[data-selected] · [data-today] · [data-outside] · [data-disabled] · [data-day]',
										el: 'td',
										desc: '클래스 대신 쓸 수 있는 data 속성. data-day 는 ISO 날짜 문자열',
									},
									{
										sel: 'button[data-selected-single] · [data-range-start] · [data-range-middle] · [data-range-end]',
										el: 'button',
										desc: '버튼 쪽 상태. 값이 문자열 "true" 이므로 [data-range-start="true"] 로 잡는다',
									},
									{
										sel: '.rdp-week_number / .rdp-week_number_header',
										el: 'td / th',
										desc: 'showWeekNumber 사용 시 주 번호 열',
									},
								].map((row) => (
									<tr
										key={row.sel}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.sel}</code>
										</td>
										<td className="px-4 py-2.5 whitespace-nowrap">
											<code className="text-xs font-mono text-gray-500 dark:text-gray-500">{row.el}</code>
										</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>

			{/* ── 기타. 실전 예제 ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 거래내역 조회기간 선택"
					description="프리셋 + 기간 선택 + 최대 기간 검증 + 조회까지 실제로 동작하는 화면입니다. scaffold Calendar 를 그대로 쓰되 *.module.css 로 청록 톤에 각진 셀·밴드형 기간 하이라이트까지 전부 다시 입혔습니다. 퍼블리셔는 .tsx 를 열 필요 없이 css 파일만 교체하면 됩니다."
				/>

				<PeriodSearchCalendar />

				<SourceTabs
					files={[
						{ filename: 'PeriodSearchCalendar.tsx', code: periodSource, lang: 'tsx' },
						{ filename: 'PeriodSearchCalendar.module.css', code: periodCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 관련 링크 ────────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="관련 문서" />
				<div className="flex flex-wrap gap-2">
					{[
						{ label: 'shadcn/ui Calendar', href: 'https://ui.shadcn.com/docs/components/calendar' },
						{ label: 'React DayPicker v9', href: 'https://daypicker.dev' },
						{ label: 'DayPicker — Styling', href: 'https://daypicker.dev/docs/styling' },
						{ label: 'date-fns locale', href: 'https://date-fns.org/docs/I18n' },
					].map(({ label, href }) => (
						<a
							key={href}
							href={href}
							target="_blank"
							rel="noreferrer"
							className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-blue-200 dark:border-blue-800 bg-blue-50 dark:bg-blue-900/20 text-xs font-medium text-blue-700 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/40 transition-colors"
						>
							<Layers className="w-3 h-3" />
							{label}
						</a>
					))}
				</div>
			</section>
		</div>
	);
}
