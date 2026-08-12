import { useEffect, useRef, useState } from 'react';
import { Calendar } from '@axiom/components/ui';
import { ko } from 'date-fns/locale';
import { CalendarDays, ChevronDown, X } from 'lucide-react';
import type { Matcher } from 'react-day-picker';

export interface IDatePickerFieldProps {
	/** 선택된 날짜 */
	value?: Date;
	/** 날짜가 바뀔 때 호출 (지우기 시 undefined) */
	onChange: (date: Date | undefined) => void;
	/** 미선택 상태에 표시할 문구 */
	placeholder?: string;
	/** 선택 불가 날짜 (react-day-picker Matcher) */
	disabled?: Matcher | Matcher[];
	/** 선택 후 지우기(×) 버튼 노출 여부 */
	clearable?: boolean;
}

/**
 * 입력 필드처럼 생긴 트리거를 누르면 달력이 열리는 Date Picker.
 *
 * scaffold 에는 Popover 컴포넌트가 없으므로 useRef + 바깥 클릭 감지로 직접 구현한다.
 * 달력 자체는 scaffold Calendar 를 그대로 사용하고, 이 컴포넌트는 열기/닫기와
 * 선택된 값의 표시만 담당한다.
 */
export default function DatePickerField({
	value,
	onChange,
	placeholder = '날짜를 선택하세요',
	disabled,
	clearable = true,
}: IDatePickerFieldProps): React.ReactNode {
	const [open, setOpen] = useState(false);
	const rootRef = useRef<HTMLDivElement>(null);

	// 바깥 클릭 · ESC 로 닫기
	useEffect(() => {
		if (!open) return;

		const handlePointerDown = (e: MouseEvent) => {
			if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
		};
		const handleKeyDown = (e: KeyboardEvent) => {
			if (e.key === 'Escape') setOpen(false);
		};

		document.addEventListener('mousedown', handlePointerDown);
		document.addEventListener('keydown', handleKeyDown);
		return () => {
			document.removeEventListener('mousedown', handlePointerDown);
			document.removeEventListener('keydown', handleKeyDown);
		};
	}, [open]);

	return (
		<div
			ref={rootRef}
			className="relative inline-block"
		>
			{/* 트리거 — 입력 필드처럼 보이는 영역 */}
			<div
				className={[
					'inline-flex h-9 items-center rounded-lg border bg-white pr-2 transition-colors dark:bg-gray-900',
					open
						? 'border-blue-400 ring-2 ring-blue-200 dark:border-blue-500 dark:ring-blue-800'
						: 'border-gray-300 hover:border-gray-400 dark:border-gray-700 dark:hover:border-gray-500',
				].join(' ')}
			>
				<button
					type="button"
					onClick={() => setOpen((v) => !v)}
					aria-haspopup="dialog"
					aria-expanded={open}
					className="flex h-full items-center gap-2 px-3 text-sm font-medium text-gray-700 dark:text-gray-200"
				>
					<CalendarDays className="h-4 w-4 text-gray-500 dark:text-gray-400" />
					<span className={value ? '' : 'text-gray-400 dark:text-gray-500'}>
						{value
							? value.toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })
							: placeholder}
					</span>
				</button>

				{clearable && value ? (
					<button
						type="button"
						aria-label="선택한 날짜 지우기"
						onClick={() => onChange(undefined)}
						className="rounded p-0.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
					>
						<X className="h-3.5 w-3.5" />
					</button>
				) : (
					<ChevronDown
						aria-hidden
						className={`h-3.5 w-3.5 text-gray-400 transition-transform ${open ? 'rotate-180' : ''}`}
					/>
				)}
			</div>

			{/* 달력 팝업 */}
			{open && (
				<div
					role="dialog"
					aria-label="날짜 선택"
					className="animate-in fade-in-0 zoom-in-95 absolute left-0 z-50 mt-1.5 rounded-xl border border-gray-200 bg-white shadow-lg duration-100 dark:border-gray-700 dark:bg-gray-900"
				>
					<Calendar
						mode="single"
						locale={ko}
						selected={value}
						defaultMonth={value}
						disabled={disabled}
						onSelect={(d) => {
							onChange(d);
							setOpen(false);
						}}
						className="p-2"
					/>
				</div>
			)}
		</div>
	);
}
