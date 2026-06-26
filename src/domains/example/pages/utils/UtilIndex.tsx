import { Link } from 'react-router';
import { Badge } from '@axiom/components/ui';
import { Wrench, Calculator, CalendarDays, Type, Landmark, Braces, ListTree, ArrowRight } from 'lucide-react';
import { createWindowUtil } from '@/core/utils/util';

/* ────────────────────────────────────────────────────────────
 * $util 전역 유틸리티 카테고리 목록
 *
 * 카테고리와 fns(함수 이름) 목록은 실제 구현(createWindowUtil)에서
 * 자동으로 추출합니다. 따라서 util 함수를 추가/삭제하면 이 화면에도
 * 그대로 반영됩니다.
 *
 * 아이콘·설명·데모 경로처럼 구현에서 알 수 없는 표현용 정보만 아래
 * META에서 카테고리별로 지정합니다. (path가 있으면 데모 준비 완료로 간주)
 * ──────────────────────────────────────────────────────────── */
type CategoryMeta = {
	icon: React.ComponentType<{ className?: string }>;
	desc: string;
	path?: string;
};

const CATEGORY_META: Record<string, CategoryMeta> = {
	number: {
		icon: Calculator,
		desc: '천 단위 콤마, 반올림, 범위 제한, 숫자 추출, 백분율 변환 등 숫자 가공 함수 모음입니다.',
		path: '/example/utils/number',
	},
	date: {
		icon: CalendarDays,
		desc: '날짜 포맷팅·파싱, 일/월/년 가감, 영업일(T+2) 계산, 기간 검증, 만 나이, 한글/전문 표기 등 금융권 날짜 함수 모음입니다.',
		path: '/example/utils/date',
	},
	string: {
		icon: Type,
		desc: '검증, 마스킹, 포맷, 케이스 변환, 한글 처리, 바이트 계산 등 금융권 문자열 가공 함수 모음입니다.',
		path: '/example/utils/string',
	},
	finance: {
		icon: Landmark,
		desc: '단리·복리 이자, 원리금균등상환 스케줄, 만기 수령액, 환율 변환, 금액 분할 등 금융 계산 함수 모음입니다.',
		path: '/example/utils/finance',
	},
	object: {
		icon: Braces,
		desc: 'cleanEmpty, pick/omit, 경로 get/set, deepClone/deepEqual, merge 등 객체 가공 함수 모음입니다.',
		path: '/example/utils/object',
	},
	array: {
		icon: ListTree,
		desc: 'groupBy, sortBy, sum/sumBy, uniq, chunk, 평면↔트리 변환 등 목록 집계 함수 모음입니다.',
		path: '/example/utils/array',
	},
};

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

/** 실제 util 구현 객체에서 카테고리/함수 목록을 자동 생성합니다. */
const categories: UtilCategory[] = Object.entries(createWindowUtil())
	.map(([key, util]): UtilCategory => {
		const meta = CATEGORY_META[key];
		return {
			key,
			name: key,
			access: `$util.${key}`,
			icon: meta?.icon ?? Wrench,
			desc: meta?.desc ?? '',
			// 구현 객체의 메서드 이름을 그대로 노출
			fns: Object.keys(util as Record<string, unknown>),
			path: meta?.path,
			ready: Boolean(meta?.path),
		};
	})
	// 데모가 준비된(ready) 카테고리를 앞에 배치
	.sort((a, b) => Number(b.ready) - Number(a.ready));

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
