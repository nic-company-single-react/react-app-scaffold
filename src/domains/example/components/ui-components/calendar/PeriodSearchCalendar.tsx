import { useMemo, useState } from 'react';
import { Calendar } from '@axiom/components/ui';
import { ko } from 'date-fns/locale';
import type { DateRange } from 'react-day-picker';
import styles from './PeriodSearchCalendar.module.css';

/** 조회 기간 프리셋 — 오늘로부터 N일 전 ~ 오늘 */
const PRESETS: { key: string; label: string; days: number }[] = [
	{ key: 'today', label: '오늘', days: 0 },
	{ key: '1w', label: '1주일', days: 7 },
	{ key: '1m', label: '1개월', days: 30 },
	{ key: '3m', label: '3개월', days: 90 },
	{ key: '6m', label: '6개월', days: 180 },
];

/** 조회 가능한 최대 기간(일) */
const MAX_RANGE_DAYS = 184;

const DAY_MS = 24 * 60 * 60 * 1000;

function startOfDay(date: Date): Date {
	const d = new Date(date);
	d.setHours(0, 0, 0, 0);
	return d;
}

function addDays(date: Date, days: number): Date {
	const d = startOfDay(date);
	d.setDate(d.getDate() + days);
	return d;
}

/** 두 날짜 사이의 일수(양끝 포함) */
function countDays(from: Date, to: Date): number {
	return Math.round((startOfDay(to).getTime() - startOfDay(from).getTime()) / DAY_MS) + 1;
}

function formatDot(date?: Date): string {
	if (!date) return '—';
	return date.toLocaleDateString('ko-KR', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\.$/, '');
}

/**
 * 거래내역 조회기간 선택 달력 — 예제 목적.
 *
 * scaffold가 제공하는 Calendar(@axiom/components/ui, shadcn + react-day-picker 기반)를
 * 그대로 사용하고, 기간 선택·키보드 조작·접근성 등 동작은 전부 컴포넌트에 맡긴다.
 * 겉모습만 같은 폴더의 PeriodSearchCalendar.module.css(CSS Module)에서
 * rdp-* 클래스와 data-* 속성 선택자로 오버라이드해 NIC 뱅킹 톤(청록)으로 재스타일링한다.
 *
 * 즉 "제공되는 컴포넌트를 재사용하되 스타일만 다르게 입히는" 패턴의 예시다.
 * 퍼블리셔는 이 .tsx 를 건드리지 않고 .module.css 만 교체하면 된다.
 */
export default function PeriodSearchCalendar(): React.ReactNode {
	// 오늘 이후는 조회할 수 없으므로 기준일을 한 번만 계산해 둔다.
	const today = useMemo(() => startOfDay(new Date()), []);

	const [range, setRange] = useState<DateRange | undefined>({ from: addDays(today, -30), to: today });
	const [activePreset, setActivePreset] = useState<string>('1m');
	const [searched, setSearched] = useState<DateRange | undefined>(undefined);

	const days = range?.from && range?.to ? countDays(range.from, range.to) : 0;
	const tooLong = days > MAX_RANGE_DAYS;
	const canSearch = Boolean(range?.from && range?.to) && !tooLong;

	const handlePreset = (key: string, offset: number) => {
		setActivePreset(key);
		setRange({ from: addDays(today, -offset), to: today });
		setSearched(undefined);
	};

	const handleReset = () => {
		setActivePreset('');
		setRange(undefined);
		setSearched(undefined);
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.card}>
				<div className={styles.brandBar} />

				{/* 헤더 */}
				<div className={styles.head}>
					<div>
						<h3 className={styles.title}>조회기간 선택</h3>
						<p className={styles.subtitle}>최근 {MAX_RANGE_DAYS}일 이내 거래내역을 조회할 수 있습니다.</p>
					</div>
					<span className={styles.accountChip}>급여통장 391-910284-52814</span>
				</div>

				{/* 프리셋 */}
				<div className={styles.presetRow}>
					{PRESETS.map(({ key, label, days: offset }) => (
						<button
							key={key}
							type="button"
							aria-pressed={activePreset === key}
							onClick={() => handlePreset(key, offset)}
							className={`${styles.preset} ${activePreset === key ? styles.presetOn : ''}`}
						>
							{label}
						</button>
					))}
				</div>

				{/* 선택 요약 */}
				<div className={styles.summary}>
					<span className={styles.summaryDate}>{formatDot(range?.from)}</span>
					<span className={styles.summaryTilde}>~</span>
					<span className={styles.summaryDate}>{formatDot(range?.to)}</span>
					{days > 0 && <span className={styles.summaryDays}>{days}일</span>}
				</div>

				{/* scaffold 제공 Calendar — 스타일만 CSS Module 로 오버라이드 */}
				<div className={styles.calendarBox}>
					<Calendar
						mode="range"
						locale={ko}
						numberOfMonths={2}
						selected={range}
						defaultMonth={addDays(today, -30)}
						disabled={{ after: today }}
						onSelect={(next) => {
							setRange(next);
							setActivePreset('');
							setSearched(undefined);
						}}
					/>
				</div>

				{tooLong && (
					<p
						role="alert"
						className={styles.error}
					>
						조회기간은 최대 {MAX_RANGE_DAYS}일까지 지정할 수 있습니다. (현재 {days}일)
					</p>
				)}

				{/* 액션 */}
				<div className={styles.actions}>
					<button
						type="button"
						onClick={handleReset}
						className={styles.btnGhost}
					>
						초기화
					</button>
					<button
						type="button"
						disabled={!canSearch}
						onClick={() => setSearched(range)}
						className={styles.btnPrimary}
					>
						조회하기
					</button>
				</div>

				{/* 조회 결과(더미) */}
				{searched?.from && searched?.to && (
					<div className={styles.result}>
						<span className={styles.resultDot} />
						<span>
							<b>
								{formatDot(searched.from)} ~ {formatDot(searched.to)}
							</b>{' '}
							기간의 거래내역 {countDays(searched.from, searched.to) * 3}건을 조회했습니다.
						</span>
					</div>
				)}
			</div>
		</div>
	);
}
