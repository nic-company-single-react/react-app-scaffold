import { Link } from 'react-router';
import { Badge } from '@axiom/components/ui';
import { Wrench, Calculator, CalendarDays, Type, ArrowRight } from 'lucide-react';

/* ────────────────────────────────────────────────────────────
 * $util 전역 유틸리티 카테고리 목록
 * ready: 데모 페이지가 준비된 항목만 클릭 가능합니다.
 * ──────────────────────────────────────────────────────────── */
type UtilCategory = {
	key: string;
	name: string;
	access: string;
	icon: React.ComponentType<{ className?: string }>;
	desc: string;
	fns: string[];
	path?: string;
	ready: boolean;
};

const categories: UtilCategory[] = [
	{
		key: 'number',
		name: 'number',
		access: '$util.number',
		icon: Calculator,
		desc: '천 단위 콤마, 반올림, 범위 제한, 숫자 추출, 백분율 변환 등 숫자 가공 함수 모음입니다.',
		fns: ['comma', 'round', 'clamp', 'toNumber', 'percent'],
		path: '/example/utils/number',
		ready: true,
	},
	{
		key: 'date',
		name: 'date',
		access: '$util.date',
		icon: CalendarDays,
		desc: '날짜 포맷팅, 파싱, 일/월 가감, 날짜 차이 계산 등 날짜 관련 함수 모음입니다.',
		fns: ['format', 'now', 'parse', 'addDays', 'addMonths', 'diffDays', 'isValid'],
		ready: false,
	},
	{
		key: 'string',
		name: 'string',
		access: '$util.string',
		icon: Type,
		desc: '공백 검사, 대문자 변환, 말줄임, 패딩, 마스킹 등 문자열 가공 함수 모음입니다.',
		fns: ['isEmpty', 'capitalize', 'truncate', 'padStart', 'removeWhitespace', 'mask'],
		ready: false,
	},
];

function CategoryCard({ cat }: { cat: UtilCategory }) {
	const Icon = cat.icon;

	const inner = (
		<div
			className={`group flex h-full flex-col gap-4 rounded-2xl border bg-white p-5 shadow-sm transition-all dark:bg-gray-900 ${
				cat.ready
					? 'border-gray-200 hover:-translate-y-0.5 hover:border-indigo-300 hover:shadow-md dark:border-gray-800 dark:hover:border-indigo-700'
					: 'cursor-not-allowed border-dashed border-gray-200 opacity-70 dark:border-gray-800'
			}`}
		>
			<div className="flex items-start justify-between">
				<div className="flex size-11 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<Icon className="size-5.5 text-indigo-600 dark:text-indigo-400" />
				</div>
				{cat.ready ? (
					<ArrowRight className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-indigo-500" />
				) : (
					<Badge
						variant="secondary"
						className="text-[10px]"
					>
						준비 중
					</Badge>
				)}
			</div>

			<div className="space-y-1.5">
				<div className="flex items-center gap-2">
					<h2 className="text-lg font-bold text-gray-900 dark:text-white">{cat.name}</h2>
					<code className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
						{cat.access}
					</code>
				</div>
				<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{cat.desc}</p>
			</div>

			<div className="mt-auto flex flex-wrap gap-1.5 pt-1">
				{cat.fns.map((fn) => (
					<span
						key={fn}
						className="rounded-md bg-gray-100 px-1.5 py-0.5 font-mono text-[11px] text-gray-600 dark:bg-gray-800 dark:text-gray-400"
					>
						{fn}
					</span>
				))}
			</div>
		</div>
	);

	if (!cat.ready || !cat.path) {
		return inner;
	}
	return (
		<Link
			to={cat.path}
			className="block"
		>
			{inner}
		</Link>
	);
}

export default function UtilIndex(): React.ReactNode {
	return (
		<div className="max-w-5xl space-y-8 p-6">
			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<Wrench className="size-5 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">유틸리티</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						전역으로 제공되는{' '}
						<code className="rounded border border-indigo-300/50 bg-indigo-100/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
							$util
						</code>{' '}
						함수들을 카테고리별로 모아 직접 실행해 볼 수 있습니다.
					</p>
				</div>
			</div>

			{/* ── 카테고리 카드 그리드 ────────────────────────────── */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
				{categories.map((cat) => (
					<CategoryCard
						key={cat.key}
						cat={cat}
					/>
				))}
			</div>
		</div>
	);
}
