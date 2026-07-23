import { useState } from 'react';
import { Spinner, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import SectionLoadingOverlay from '@/domains/example/components/ui-components/spinner/SectionLoadingOverlay';
import BrandSpinner from '@/domains/example/components/ui-components/spinner/BrandSpinner';
import BrandMarkIcon from '@/domains/example/components/ui-components/spinner/BrandMarkIcon';
import overlaySource from '@/domains/example/components/ui-components/spinner/SectionLoadingOverlay.tsx?raw';
import overlayCss from '@/domains/example/components/ui-components/spinner/SectionLoadingOverlay.module.css?raw';
import brandSource from '@/domains/example/components/ui-components/spinner/BrandSpinner.tsx?raw';
import brandCss from '@/domains/example/components/ui-components/spinner/BrandSpinner.module.css?raw';
import brandMarkSource from '@/domains/example/components/ui-components/spinner/BrandMarkIcon.tsx?raw';
import spinnerSource from '@/shared/lib/shadcn/ui/spinner.tsx?raw';
import logoImg from '@/assets/images/logo/logo.svg';
import sampleAnimatedImg from '@/domains/example/components/ui-components/spinner/assets/sample-loading.svg';
import { LoaderCircle, RefreshCw, RotateCw } from 'lucide-react';

export default function SpinnerComponent(): React.ReactNode {
	/** 4. 버튼 로딩 상태 데모 */
	const [saving, setSaving] = useState(false);
	/** 6. 영역 로딩 오버레이 데모 */
	const [loading, setLoading] = useState(false);

	const handleSave = () => {
		setSaving(true);
		setTimeout(() => setSaving(false), 1800);
	};

	const handleReload = () => {
		setLoading(true);
		setTimeout(() => setLoading(false), 1800);
	};

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<LoaderCircle className="w-5 h-5 text-sky-600 dark:text-sky-400 animate-spin" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Spinner 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Spinner 컴포넌트 사용 예제입니다. <b>작업이 진행 중임을 알리는 회전 인디케이터</b>로,
						데이터 로딩·저장 등 잠깐의 대기 상태를 표현할 때 씁니다.
					</p>
				</div>
			</div>

			{/* ── 구현 안내 배너 ────────────────────────────────────── */}
			<div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-900/10 p-4 space-y-1.5">
				<p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
					먼저 알아둘 것 — 아주 얇은 컴포넌트입니다
				</p>
				<p className="text-xs text-sky-800/90 dark:text-sky-300/90 leading-relaxed">
					Spinner 는 lucide 의 <code className="font-mono">Loader2Icon</code> 에{' '}
					<code className="font-mono">size-4 animate-spin</code> 만 얹은 <b>SVG 한 줄짜리 컴포넌트</b>입니다. 색은{' '}
					<code className="font-mono">currentColor</code>(글자색)를, 크기는 <code className="font-mono">size-*</code> 를
					따르므로 대부분의 변경은 <code className="font-mono">className</code> 만으로 끝납니다. 회전 속도나 완전히 다른
					모양이 필요할 때만 CSS 를 씁니다(아래 <b>퍼블리셔 가이드</b> 참고).
				</p>
			</div>

			{/* ── 0. import & 기본 사용 ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 사용"
					description="Spinner 컴포넌트만 import 하면 됩니다. 별도 셋업은 필요 없습니다."
				/>
				<CodeBlock
					code={`import { Spinner } from '@axiom/components/ui';

// 그대로 두면 size-4(16px), 글자색(currentColor)으로 회전한다
<Spinner />

// 색·크기는 className 으로 조절
<Spinner className="size-6 text-sky-500" />`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="props 없이 그대로 쓰면 16px 크기로 글자색을 따라 회전합니다."
				/>
				<ExCard
					label="<Spinner />"
					code={`<Spinner />`}
				>
					<Spinner />
				</ExCard>
			</section>

			{/* ── 2. 크기 (size) ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 크기 — size-* 유틸리티"
					description="Tailwind의 size-* (또는 w-* h-*) 클래스로 지름을 조절합니다. 기본은 size-4(16px)입니다."
				/>
				<ExCard
					label="className='size-4 / size-6 / size-8 / size-12'"
					code={`<Spinner className="size-4" />   {/* 16px (기본) */}
<Spinner className="size-6" />   {/* 24px */}
<Spinner className="size-8" />   {/* 32px */}
<Spinner className="size-12" />  {/* 48px */}`}
				>
					<div className="flex items-end gap-6 text-sky-500">
						<div className="flex flex-col items-center gap-1">
							<Spinner className="size-4" />
							<span className="text-[10px] font-mono text-gray-400">size-4</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner className="size-6" />
							<span className="text-[10px] font-mono text-gray-400">size-6</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner className="size-8" />
							<span className="text-[10px] font-mono text-gray-400">size-8</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner className="size-12" />
							<span className="text-[10px] font-mono text-gray-400">size-12</span>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 색상 (color) ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 색상 — text-* (currentColor 상속)"
					description="Spinner는 currentColor로 그려지므로, text-* 색상 클래스로 색을 바꿉니다. 부모의 글자색을 그대로 물려받기도 합니다."
				/>
				<ExCard
					label="className='text-sky-500 / text-emerald-500 / …'"
					code={`<Spinner className="size-6 text-sky-500" />
<Spinner className="size-6 text-emerald-500" />
<Spinner className="size-6 text-amber-500" />
<Spinner className="size-6 text-rose-500" />
<Spinner className="size-6 text-gray-400" />`}
				>
					<div className="flex items-center gap-5">
						<Spinner className="size-6 text-sky-500" />
						<Spinner className="size-6 text-emerald-500" />
						<Spinner className="size-6 text-amber-500" />
						<Spinner className="size-6 text-rose-500" />
						<Spinner className="size-6 text-gray-400" />
					</div>
				</ExCard>
			</section>

			{/* ── 4. 버튼 로딩 상태 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 버튼 로딩 상태"
					description="가장 흔한 사용처. 저장/제출 버튼을 누르면 스피너를 띄우고 버튼을 비활성화합니다."
				/>
				<ExCard
					label="Button + Spinner (로딩 중 disabled)"
					code={`const [saving, setSaving] = useState(false);

<Button disabled={saving} onClick={handleSave}>
  {saving && <Spinner className="mr-2 size-4" />}
  {saving ? '저장 중…' : '저장'}
</Button>`}
				>
					<Button
						disabled={saving}
						onClick={handleSave}
					>
						{saving && <Spinner className="mr-2 size-4" />}
						{saving ? '저장 중…' : '저장'}
					</Button>
				</ExCard>
			</section>

			{/* ── 5. 텍스트와 함께 (인라인) ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 텍스트와 함께 — 인라인 로딩"
					description="문구 옆에 나란히 두어 '무엇을 기다리는 중인지'를 함께 알립니다. currentColor 덕분에 색을 따로 지정하지 않아도 글자색과 맞춰집니다."
				/>
				<ExCard
					label="아이콘 + 텍스트"
					code={`<span className="inline-flex items-center gap-2 text-gray-600">
  <Spinner className="size-4" />
  결제 정보를 확인하고 있어요…
</span>`}
				>
					<span className="inline-flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
						<Spinner className="size-4" />
						결제 정보를 확인하고 있어요…
					</span>
				</ExCard>
			</section>

			{/* ── 6. 영역 로딩 오버레이 (실전) ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 영역 로딩 오버레이"
					description="데이터를 다시 불러오는 동안 해당 영역만 흐리게 덮고 가운데에 스피너를 띄웁니다. SI 프로젝트에서 목록/상세를 새로고칠 때 자주 쓰는 패턴입니다."
				/>
				<ExCard
					label="SectionLoadingOverlay (co-located module.css)"
					code={`const [loading, setLoading] = useState(false);

<SectionLoadingOverlay loading={loading} message="목록을 불러오는 중…">
  <ul>{/* … 실제 콘텐츠 … */}</ul>
</SectionLoadingOverlay>`}
				>
					<div className="w-full space-y-3">
						<Button
							size="sm"
							variant="outline"
							onClick={handleReload}
							disabled={loading}
						>
							{loading ? '불러오는 중…' : '다시 불러오기'}
						</Button>

						<SectionLoadingOverlay
							loading={loading}
							message="거래 내역을 불러오는 중…"
						>
							<ul className="rounded-xl border border-gray-200 dark:border-gray-800 divide-y divide-gray-100 dark:divide-gray-800 overflow-hidden">
								{[
									{ name: '스타벅스 강남점', amount: '-5,600원' },
									{ name: '월급 입금', amount: '+3,200,000원' },
									{ name: 'GS25 역삼점', amount: '-4,300원' },
								].map((row) => (
									<li
										key={row.name}
										className="flex items-center justify-between px-4 py-3 text-sm bg-white dark:bg-gray-900"
									>
										<span className="text-gray-700 dark:text-gray-200">{row.name}</span>
										<span className="font-mono text-gray-500 dark:text-gray-400">{row.amount}</span>
									</li>
								))}
							</ul>
						</SectionLoadingOverlay>
					</div>
				</ExCard>
			</section>

			{/* ── 퍼블리셔 가이드 ──────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="퍼블리셔 가이드 — 스피너 스타일을 어디에서 바꾸나"
					description="이 프로젝트에서 스피너는 스타일 변경이 잦은 컴포넌트입니다. 변경 성격에 따라 위치를 나눕니다."
				/>

				{/* 방법 A */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
							방법 A — 색 · 크기만 바꾼다 → className (CSS 파일 불필요)
						</span>
					</div>
					<div className="p-4 space-y-2">
						<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
							공용 Spinner 는 <code className="font-mono">cn("size-4 animate-spin", className)</code> 구조라, 넘긴{' '}
							<code className="font-mono">className</code> 이 기본값을 덮어씁니다. 색(
							<code className="font-mono">text-*</code>)·크기(<code className="font-mono">size-*</code>)는 여기서
							끝납니다. 사소한 변경에 <code className="font-mono">*.module.css</code> 파일을 만들지 마세요(프로젝트
							스타일 규칙 1번).
						</p>
						<CodeBlock
							code={`<Spinner className="size-6 text-brand-500" />`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>

				{/* 방법 B */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
							방법 B — 속도 · 연출을 바꾼다 → 소비 컴포넌트 옆 co-located module.css
						</span>
					</div>
					<div className="p-4 space-y-2">
						<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
							회전 속도(<code className="font-mono">animate-spin</code> 은 1s 고정)나 배경 블러·페이드 같은 연출은
							className 만으로 안 됩니다. 이때는 <b>스피너를 감싸 쓰는 컴포넌트를 만들고</b>, 스타일을 그{' '}
							<b>컴포넌트 파일 바로 옆</b> <code className="font-mono">*.module.css</code> 에 둡니다(co-location, 스타일
							규칙 2번). 아래 <b>실전 예제 — 영역 로딩 오버레이</b> 가 정확히 이 방식입니다.
						</p>
						<CodeBlock
							code={`/* SectionLoadingOverlay.module.css — 컴포넌트 바로 옆 */
.spinner {
  width: 1.75rem;
  height: 1.75rem;
  color: #0ea5e9;
}
/* 다크 모드는 앱 규칙(.dark)에 맞춘다 */
:global(.dark) .spinner { color: #38bdf8; }`}
							lang="css"
							theme="github-dark"
						/>
					</div>
				</div>

				{/* 방법 C */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
							방법 C — 아예 다른 톤(브랜드 스피너)이면 → 공용 Spinner 를 코어로 감싼 컴포넌트 + module.css
						</span>
					</div>
					<div className="p-4 space-y-3">
						<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
							그라데이션 링·글로우처럼 완전히 다른 톤이 필요해도, <b>회전하는 실제 인디케이터는 공용 Spinner 를 코어로
							그대로 재사용</b>하고 그 위에 브랜드 연출만 감싸는 컴포넌트를 만듭니다. 스타일은 그 옆 module.css 에 두면
							이 프로젝트의 co-location 규칙이 그대로 성립합니다. 아래는 이 방식으로 만든{' '}
							<code className="font-mono">BrandSpinner</code>(공용 Spinner + 그라데이션 헤일로)의 실행 데모와 핵심
							코드입니다. 전체 소스는 맨 아래 <b>실전 예제 — 브랜드 스피너</b> 에 있습니다.
						</p>

						{/* 실행 데모 */}
						<div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-5 flex items-center justify-center gap-8">
							<BrandSpinner size={36} />
							<BrandSpinner size={48} />
							<BrandSpinner
								size={48}
								thickness={7}
							/>
						</div>

						{/* 사용법 — 코어는 공용 Spinner, 껍데기만 커스텀 */}
						<CodeBlock
							code={`// BrandSpinner.tsx — 회전하는 코어는 공용 Spinner 를 그대로 재사용
import { Spinner } from '@axiom/components/ui';
import styles from './BrandSpinner.module.css';

<span className={styles.halo}>
  <Spinner className={styles.core} />   {/* ← scaffold 공용 컴포넌트 */}
</span>

// 사용처
<BrandSpinner size={48} />
<BrandSpinner size={48} thickness={7} />`}
							lang="tsx"
							theme="github-dark"
						/>

						{/* 핵심 CSS — 껍데기(헤일로)만 그리고, 코어 Spinner 는 색·크기만 손본다 */}
						<CodeBlock
							code={`/* BrandSpinner.module.css — 소비 컴포넌트 바로 옆(co-location) */

/* 껍데기: conic-gradient + mask 로 그라데이션 헤일로 링을 그린다 */
.halo {
  --edge: 1.5px;  /* mask 안쪽 경계 feather → 계단현상(자글거림) 방지 */
  display: inline-grid;
  place-items: center;
  width: var(--size);
  height: var(--size);
  border-radius: 9999px;

  /* 양 끝을 투명으로 페이드한 코멧형 → 시작/끝 이음새(seam) 제거 */
  background: conic-gradient(from 90deg,
    rgba(99,102,241,0) 0deg, #0ea5e9 210deg, #6366f1 348deg, rgba(99,102,241,0) 360deg);

  /* 안쪽 경계를 ±--edge 로 feather 해 부드럽게 */
  -webkit-mask: radial-gradient(farthest-side,
    #0000 calc(100% - var(--thickness) - var(--edge)), #000 calc(100% - var(--thickness) + var(--edge)));
          mask: radial-gradient(farthest-side,
    #0000 calc(100% - var(--thickness) - var(--edge)), #000 calc(100% - var(--thickness) + var(--edge)));

  will-change: transform;         /* GPU 합성 힌트 → 회전 떨림 감소 */
  animation: brand-halo 1.6s linear infinite;
}
@keyframes brand-halo { to { transform: rotate(360deg); } }

/* 코어 = 공용 <Spinner/>. '.halo .core' 로 specificity 를 높여
   Tailwind 단일 클래스(size-4 등)보다 확실히 우선하게 한다 */
.halo .core {
  width: 52%;
  height: 52%;
  color: #0369a1;
  filter: drop-shadow(0 0 5px rgba(14, 165, 233, 0.5));
}`}
							lang="css"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 ───────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="SpinnerProps 는 <svg> 속성(React.ComponentProps<'svg'>)에 icon · spin · children 을 더한 형태입니다. 셋 다 생략하면 기존 Loader2 회전 그대로이며, children 을 넘기면 <svg> 대신 <span> 래퍼로 렌더됩니다."
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
									p: 'className',
									t: 'string',
									d: '크기(size-*)·색(text-*) 등 조절. 기본 "size-4 animate-spin" 뒤에 병합되어 덮어쓴다.',
								},
								{
									p: 'icon',
									t: "React.ComponentType<svg props>",
									d: '회전시킬 아이콘 교체(미지정 시 Loader2). lucide 아이콘·커스텀 SVG 컴포넌트를 넘긴다.',
								},
								{
									p: 'spin',
									t: 'boolean',
									d: '회전 여부(기본 true). GIF 등 이미 움직이는 이미지엔 false 로 이중 회전 방지.',
								},
								{
									p: 'children',
									t: 'React.ReactNode',
									d: '<img> 등 임의 콘텐츠 삽입. 넘기면 span 래퍼로 감싸 회전·크기만 담당한다.',
								},
								{
									p: 'aria-label',
									t: 'string',
									d: '스크린리더 라벨. 기본값 "Loading" (role="status" 는 이미 설정됨).',
								},
								{
									p: '...props',
									t: "React.ComponentProps<'svg'>",
									d: 'onClick, style, id 등 표준 속성을 그대로 전달. 기본은 <svg>, children 사용 시 <span> 에 전달된다.',
								},
							].map((row) => (
								<tr
									key={row.p}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400 whitespace-nowrap">
											{row.p}
										</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.t}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.d}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 영역 로딩 오버레이 ─────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 영역 로딩 오버레이 (module.css)"
					description="공용 Spinner 를 그대로 쓰되, 배경 블러·페이드·정렬 같은 오버레이 연출은 컴포넌트 바로 옆 SectionLoadingOverlay.module.css 로 분리(co-location)했습니다. 퍼블리셔는 .tsx 를 건드리지 않고 .module.css 만 수정하면 됩니다. 위 6번 데모가 바로 이 컴포넌트입니다."
				/>

				<SourceTabs
					files={[
						{ filename: 'SectionLoadingOverlay.tsx', code: overlaySource, lang: 'tsx' },
						{ filename: 'SectionLoadingOverlay.module.css', code: overlayCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 브랜드 스피너 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 브랜드 스피너 (공용 Spinner + 커스텀 연출)"
					description="회전하는 코어는 scaffold 공용 <Spinner/> 를 그대로 재사용하고, 그 위에 conic-gradient 그라데이션 헤일로 링과 글로우 연출만 감쌌습니다. 톤앤매너가 통째로 바뀌어도 실제 인디케이터 로직은 공용 컴포넌트에 맡기고, 색·속도·두께 같은 디자인 변경은 모두 BrandSpinner.module.css 에서 이뤄집니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-6 flex items-end justify-center gap-8">
					<div className="flex flex-col items-center gap-2">
						<BrandSpinner size={28} />
						<span className="text-[10px] font-mono text-gray-400">size=28</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<BrandSpinner size={44} />
						<span className="text-[10px] font-mono text-gray-400">size=44</span>
					</div>
					<div className="flex flex-col items-center gap-2">
						<BrandSpinner
							size={60}
							thickness={6}
						/>
						<span className="text-[10px] font-mono text-gray-400">size=60 thickness=6</span>
					</div>
				</div>

				<SourceTabs
					files={[
						{ filename: 'BrandSpinner.tsx', code: brandSource, lang: 'tsx' },
						{ filename: 'BrandSpinner.module.css', code: brandCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 회전 아이콘 교체 (Spinner icon prop) ── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 회전 아이콘 교체 (Spinner 의 icon prop)"
					description="공용 Spinner 를 그대로 쓰면서 '모양'만 바꿉니다. spinner.tsx 에 icon prop 을 더해, 다른 lucide 아이콘이나 직접 만든 SVG 를 끼우면 회전(animate-spin)·크기(size-*)·접근성(role/aria)은 Spinner 가 그대로 담당합니다. 색은 여전히 text-*(currentColor)로 제어됩니다."
				/>

				{/* 데모 1 — 다른 lucide 아이콘으로 교체 */}
				<ExCard
					label="<Spinner icon={...} /> — 다른 lucide 아이콘"
					code={`import { Spinner } from '@axiom/components/ui';
import { LoaderCircle, RefreshCw, RotateCw } from 'lucide-react';

<Spinner className="size-6" />                    {/* 기본 Loader2 */}
<Spinner icon={LoaderCircle} className="size-6" />
<Spinner icon={RefreshCw}   className="size-6" />
<Spinner icon={RotateCw}    className="size-6" />`}
				>
					<div className="flex items-end gap-6 text-sky-500">
						<div className="flex flex-col items-center gap-1">
							<Spinner className="size-6" />
							<span className="text-[10px] font-mono text-gray-400">기본</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={LoaderCircle}
								className="size-6"
							/>
							<span className="text-[10px] font-mono text-gray-400">LoaderCircle</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={RefreshCw}
								className="size-6"
							/>
							<span className="text-[10px] font-mono text-gray-400">RefreshCw</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={RotateCw}
								className="size-6"
							/>
							<span className="text-[10px] font-mono text-gray-400">RotateCw</span>
						</div>
					</div>
				</ExCard>

				{/* 데모 2 — 직접 만든 브랜드 SVG 아이콘 */}
				<ExCard
					label="<Spinner icon={BrandMarkIcon} /> — 커스텀 SVG 아이콘"
					code={`import { Spinner } from '@axiom/components/ui';
import BrandMarkIcon from '…/spinner/BrandMarkIcon';

<Spinner icon={BrandMarkIcon} className="size-8 text-sky-500" />`}
				>
					<div className="flex items-end gap-6 text-sky-500">
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={BrandMarkIcon}
								className="size-6"
							/>
							<span className="text-[10px] font-mono text-gray-400">size-6</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={BrandMarkIcon}
								className="size-8"
							/>
							<span className="text-[10px] font-mono text-gray-400">size-8</span>
						</div>
						<div className="flex flex-col items-center gap-1">
							<Spinner
								icon={BrandMarkIcon}
								className="size-10 text-indigo-500"
							/>
							<span className="text-[10px] font-mono text-gray-400">size-10 · indigo</span>
						</div>
					</div>
				</ExCard>

				{/* icon 은 SVG 컴포넌트용 — 이미지(<img>)는 다음 예제의 children 방식 */}
				<div className="rounded-2xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-900/10 p-4 space-y-1.5">
					<p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
						<code className="font-mono">icon</code> 은 SVG 컴포넌트 전용 — 이미지 파일은 다음 예제로
					</p>
					<p className="text-xs text-sky-800/90 dark:text-sky-300/90 leading-relaxed">
						<code className="font-mono">icon</code> prop 은 <b>SVG 컴포넌트</b>(lucide 아이콘·직접 만든 SVG)를 받습니다.{' '}
						<code className="font-mono">&lt;img&gt;</code> 같은 <b>실제 이미지 파일(GIF·PNG 등)</b>이나, 회전을 켜고
						끄는 방법은 바로 아래 <b>이미지 &amp; 회전 on/off (children · spin)</b> 예제에서 다룹니다.
					</p>
				</div>

			</section>

			{/* ── 기타. 실전 예제 — 이미지 & 회전 on/off (children · spin) ── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 이미지 & 회전 on/off (children · spin)"
					description="아이콘(SVG)뿐 아니라 실제 이미지(<img>)를 children 으로 직접 넣을 수 있고, spin 으로 회전을 켜고 끕니다. 정적 이미지는 Spinner 가 돌려주고(spin 기본 true), 이미 스스로 움직이는 GIF·애니메이션 이미지는 spin={false} 로 이중 회전을 막습니다. 이 경우 Spinner 는 <span> 래퍼로 회전·크기·접근성만 담당합니다."
				/>

				{/* 데모 1 — 이미지 children + spin 토글 */}
				<ExCard
					label="children=<img> + spin 토글"
					code={`import { Spinner } from '@axiom/components/ui';
import logo from '@/assets/images/logo/logo.svg';
import loadingGif from '@/assets/images/loading.gif';

// 1) 정적 이미지(로고 등) → Spinner 가 회전시킨다 (spin 기본 true)
<Spinner className="size-9">
  <img src={logo} alt="" className="size-full object-contain" />
</Spinner>

// 2) 이미 움직이는 GIF·애니메이션 이미지 → 회전 끄기(이중 회전 방지)
<Spinner spin={false} className="size-9">
  <img src={loadingGif} alt="" className="size-full object-contain" />
</Spinner>`}
				>
					<div className="flex items-end gap-10">
						<div className="flex flex-col items-center gap-2">
							<Spinner className="size-9">
								<img
									src={logoImg}
									alt=""
									className="size-full object-contain"
								/>
							</Spinner>
							<span className="text-[10px] font-mono text-gray-400">정적 이미지 · spin(기본)</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<Spinner
								spin={false}
								className="size-9"
							>
								<img
									src={sampleAnimatedImg}
									alt=""
									className="size-full object-contain"
								/>
							</Spinner>
							<span className="text-[10px] font-mono text-gray-400">자체 애니메이션 · spin=false</span>
						</div>
					</div>
				</ExCard>

				{/* 데모 2 — spin 은 아이콘에도 적용된다 */}
				<ExCard
					label="spin 은 icon 방식에도 적용된다"
					code={`<Spinner icon={BrandMarkIcon} className="size-8" />              {/* 회전 */}
<Spinner icon={BrandMarkIcon} spin={false} className="size-8" /> {/* 정지 */}`}
				>
					<div className="flex items-center gap-8 text-sky-500">
						<div className="flex flex-col items-center gap-2">
							<Spinner
								icon={BrandMarkIcon}
								className="size-8"
							/>
							<span className="text-[10px] font-mono text-gray-400">spin(기본)</span>
						</div>
						<div className="flex flex-col items-center gap-2">
							<Spinner
								icon={BrandMarkIcon}
								spin={false}
								className="size-8"
							/>
							<span className="text-[10px] font-mono text-gray-400">spin=false</span>
						</div>
					</div>
				</ExCard>

				{/* 확장된 shared Spinner 소스 + 커스텀 아이콘 소스 */}
				<div className="space-y-2">
					<p className="text-xs text-gray-500 dark:text-gray-400">
						이 예제들을 위해 공용 <code className="font-mono">spinner.tsx</code> 에{' '}
						<code className="font-mono">icon</code> · <code className="font-mono">spin</code> ·{' '}
						<code className="font-mono">children</code> 을 <b>하위호환</b>으로 추가했습니다(모두 생략 시 기존 Loader2
						회전 그대로).
					</p>
					<SourceTabs
						files={[
							{ filename: 'spinner.tsx (shared)', code: spinnerSource, lang: 'tsx' },
							{ filename: 'BrandMarkIcon.tsx', code: brandMarkSource, lang: 'tsx' },
						]}
					/>
				</div>
			</section>
		</div>
	);
}
