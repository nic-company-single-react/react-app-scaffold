import { useEffect, useState } from 'react';
import { Skeleton, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import TransactionListSkeleton from '@/domains/example/components/ui-components/skeleton/TransactionListSkeleton';
import listSource from '@/domains/example/components/ui-components/skeleton/TransactionListSkeleton.tsx?raw';
import listCss from '@/domains/example/components/ui-components/skeleton/TransactionListSkeleton.module.css?raw';
import { LayoutTemplate } from 'lucide-react';

export default function SkeletonComponent(): React.ReactNode {
	// 6. 인터랙티브 — 로딩 상태 토글용
	const [loading, setLoading] = useState(true);

	useEffect(() => {
		if (!loading) return;
		const t = setTimeout(() => setLoading(false), 2000);
		return () => clearTimeout(t);
	}, [loading]);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-100 dark:bg-slate-800/50">
					<LayoutTemplate className="w-5 h-5 text-slate-600 dark:text-slate-300" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Skeleton 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-slate-300/60 bg-slate-100 text-slate-700 dark:border-slate-600/40 dark:bg-slate-800/40 dark:text-slate-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Skeleton 컴포넌트 사용 예제입니다. 데이터를 불러오는 동안 콘텐츠의 자리를 미리 잡아 주는 로딩
						플레이스홀더입니다.
					</p>
				</div>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description={
						'Skeleton은 그 자체로 하나의 회색 블록입니다. 별도의 prop 없이 className 만으로 크기·모양·색을 정합니다. ' +
						'실제 콘텐츠와 같은 크기/형태로 블록들을 배치해 로딩 중 레이아웃이 흔들리지 않게 하는 것이 핵심입니다.'
					}
				/>
				<CodeBlock
					code={`import { Skeleton } from '@axiom/components/ui';

// 한 줄짜리 텍스트 자리
<Skeleton className="h-4 w-48" />

// 아바타(원형)
<Skeleton className="h-12 w-12 rounded-full" />`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					내부 구현은 <b>animate-pulse rounded-md bg-muted</b> 클래스를 가진 <b>&lt;div&gt;</b> 하나가 전부입니다. 그래서{' '}
					<b>className</b> 으로 넘긴 유틸리티가 그대로 병합되어 크기(<code>h-*, w-*</code>)·모양(<code>rounded-*</code>)·색(
					<code>bg-*</code>)을 자유롭게 덮어쓸 수 있습니다. <code>div</code> 표준 속성(<code>style</code>,{' '}
					<code>onClick</code> 등)도 그대로 전달됩니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본"
					description="높이(h-*)와 너비(w-*)만 지정하면 가장 단순한 막대형 스켈레톤이 됩니다."
				/>
				<ExCard
					label="단일 블록"
					code={`<Skeleton className="h-4 w-[250px]" />`}
				>
					<Skeleton className="h-4 w-[250px]" />
				</ExCard>
			</section>

			{/* ── 2. 다양한 형태 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 다양한 형태 — 모양은 className 으로"
					description="원형(rounded-full)·정사각형·둥근 사각형 등 자리에 들어갈 실제 요소의 모양에 맞춰 className 으로 조절합니다."
				/>
				<ExCard
					label="rounded-full / rounded-xl / rounded-none"
					code={`{/* 원형 — 아바타/아이콘 자리 */}
<Skeleton className="h-14 w-14 rounded-full" />

{/* 둥근 사각형 — 썸네일/버튼 자리 */}
<Skeleton className="h-14 w-14 rounded-xl" />

{/* 넓은 배너/이미지 자리 */}
<Skeleton className="h-14 w-40 rounded-md" />`}
				>
					<Skeleton className="h-14 w-14 rounded-full" />
					<Skeleton className="h-14 w-14 rounded-xl" />
					<Skeleton className="h-14 w-40 rounded-md" />
				</ExCard>
			</section>

			{/* ── 3. 텍스트 블록 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 텍스트 블록 — 여러 줄 문단"
					description="줄을 여러 개 쌓고 마지막 줄의 너비를 줄이면 실제 문단처럼 보입니다. space-y-* 로 줄 간격을 줍니다."
				/>
				<ExCard
					label="제목 + 문단 3줄"
					code={`<div className="space-y-3 w-full">
  <Skeleton className="h-5 w-1/3" />       {/* 제목 */}
  <Skeleton className="h-3 w-full" />
  <Skeleton className="h-3 w-full" />
  <Skeleton className="h-3 w-4/5" />        {/* 마지막 줄은 짧게 */}
</div>`}
				>
					<div className="space-y-3 w-full">
						<Skeleton className="h-5 w-1/3" />
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-full" />
						<Skeleton className="h-3 w-4/5" />
					</div>
				</ExCard>
			</section>

			{/* ── 4. 카드 스켈레톤 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 카드 스켈레톤 — 조각 조합"
					description="아바타(원형) + 텍스트 줄들을 flex 로 배치하면 프로필/카드 로딩 자리가 됩니다. 실제 카드와 동일한 레이아웃으로 맞추는 것이 포인트입니다."
				/>
				<ExCard
					label="아바타 + 2줄"
					code={`<div className="flex items-center gap-4 w-full">
  <Skeleton className="h-12 w-12 rounded-full" />
  <div className="space-y-2 flex-1">
    <Skeleton className="h-4 w-1/2" />
    <Skeleton className="h-3 w-3/4" />
  </div>
</div>`}
				>
					<div className="flex items-center gap-4 w-full">
						<Skeleton className="h-12 w-12 rounded-full" />
						<div className="space-y-2 flex-1">
							<Skeleton className="h-4 w-1/2" />
							<Skeleton className="h-3 w-3/4" />
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 5. 리스트/테이블 로우 반복 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 리스트 — 반복 렌더링"
					description="목록/테이블 로딩은 같은 로우 스켈레톤을 Array.from 등으로 N번 반복해 만듭니다. 실제로 보여줄 행 개수와 비슷하게 맞춥니다."
				/>
				<ExCard
					label="Array.from 으로 5행 반복"
					code={`<div className="w-full space-y-4">
  {Array.from({ length: 5 }).map((_, i) => (
    <div key={i} className="flex items-center gap-4">
      <Skeleton className="h-10 w-10 rounded-full" />
      <Skeleton className="h-4 flex-1" />
      <Skeleton className="h-4 w-16" />
    </div>
  ))}
</div>`}
				>
					<div className="w-full space-y-4">
						{Array.from({ length: 5 }).map((_, i) => (
							<div
								key={i}
								className="flex items-center gap-4"
							>
								<Skeleton className="h-10 w-10 rounded-full" />
								<Skeleton className="h-4 flex-1" />
								<Skeleton className="h-4 w-16" />
							</div>
						))}
					</div>
				</ExCard>
			</section>

			{/* ── 6. 인터랙티브 — 로딩 상태 토글 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 인터랙티브 — 로딩 → 실제 콘텐츠 전환"
					description="실전에서 가장 흔한 패턴입니다. isLoading 값에 따라 스켈레톤과 실제 콘텐츠를 조건부로 렌더링합니다. 같은 크기로 맞추면 전환 시 레이아웃이 튀지 않습니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 flex items-center justify-between gap-3">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							상태:{' '}
							<code className="font-mono text-slate-700 dark:text-slate-300">{loading ? 'loading' : 'loaded'}</code>
						</span>
						<button
							type="button"
							onClick={() => setLoading(true)}
							disabled={loading}
							className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:border-slate-400 disabled:opacity-50 disabled:cursor-default transition-colors"
						>
							{loading ? '불러오는 중…' : '다시 불러오기'}
						</button>
					</div>
					<div className="p-5">
						{loading ? (
							<div className="flex items-center gap-4">
								<Skeleton className="h-16 w-16 rounded-2xl" />
								<div className="space-y-2 flex-1">
									<Skeleton className="h-4 w-2/5" />
									<Skeleton className="h-3 w-4/5" />
									<Skeleton className="h-3 w-1/3" />
								</div>
							</div>
						) : (
							<div className="flex items-center gap-4">
								<div className="grid place-items-center h-16 w-16 rounded-2xl bg-slate-800 text-white text-lg font-bold">
									NIC
								</div>
								<div className="space-y-1 flex-1 min-w-0">
									<p className="text-sm font-bold text-gray-900 dark:text-white">레드스카이 개발팀</p>
									<p className="text-xs text-gray-500 dark:text-gray-400">
										폐쇄망 금융권 프론트엔드 스캐폴드 · 12명
									</p>
									<p className="text-xs text-slate-600 dark:text-slate-400">team@redsky.dev</p>
								</div>
							</div>
						)}
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [isLoading, setIsLoading] = useState(true);

return isLoading ? (
  <div className="flex items-center gap-4">
    <Skeleton className="h-16 w-16 rounded-2xl" />
    <div className="space-y-2 flex-1">
      <Skeleton className="h-4 w-2/5" />
      <Skeleton className="h-3 w-4/5" />
      <Skeleton className="h-3 w-1/3" />
    </div>
  </div>
) : (
  <ProfileCard {...data} />   // 실제 콘텐츠
);`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Skeleton은 전용 prop이 없습니다. div 의 표준 속성을 그대로 받으며, 모양은 전적으로 className 으로 제어합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									prop: 'className',
									type: 'string',
									desc: '크기(h-*, w-*)·모양(rounded-*)·색(bg-*)을 지정. 기본 클래스와 병합됩니다.',
								},
								{
									prop: '...props',
									type: 'React.ComponentProps<"div">',
									desc: 'style, onClick, data-* 등 div 표준 속성을 그대로 전달합니다.',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.prop}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.type}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 거래내역 로딩 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 거래내역 로딩 + 스타일 교체"
					description={
						'제공 Skeleton을 그대로 쓰되, 기본 "펄스(깜빡임)"를 *.module.css 에서 "좌→우로 흐르는 shimmer"로 갈아끼운 예제입니다. ' +
						'퍼블리셔가 실제 SI 투입 시 스켈레톤 톤앤매너(애니메이션·색·모서리)를 바꾸는 경우, [data-slot="skeleton"] 선택자를 담은 이 CSS 파일 하나만 손대면 됩니다. ' +
						'“다시 불러오기”로 로딩 상태를 다시 볼 수 있습니다.'
					}
				/>

				<TransactionListSkeleton />

				<SourceTabs
					files={[
						{ filename: 'TransactionListSkeleton.tsx', code: listSource, lang: 'tsx' },
						{ filename: 'TransactionListSkeleton.module.css', code: listCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
