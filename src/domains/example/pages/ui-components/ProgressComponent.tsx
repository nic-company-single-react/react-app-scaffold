import { useEffect, useRef, useState } from 'react';
import { Progress, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import UploadProgressCard from '@/domains/example/components/ui-components/progress/UploadProgressCard';
import uploadSource from '@/domains/example/components/ui-components/progress/UploadProgressCard.tsx?raw';
import uploadCss from '@/domains/example/components/ui-components/progress/UploadProgressCard.module.css?raw';
import ResourceUsageCard from '@/domains/example/components/ui-components/progress/ResourceUsageCard';
import resourceSource from '@/domains/example/components/ui-components/progress/ResourceUsageCard.tsx?raw';
import resourceCss from '@/domains/example/components/ui-components/progress/ResourceUsageCard.module.css?raw';
import { Gauge, LoaderCircle } from 'lucide-react';

export default function ProgressComponent(): React.ReactNode {
	// 5. 인터랙티브(controlled) 예제용 상태
	const [value, setValue] = useState(40);
	// 자동 진행(로딩) 시뮬레이션
	const [auto, setAuto] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	useEffect(() => {
		if (!auto) return;
		timerRef.current = setInterval(() => {
			setValue((prev) => {
				if (prev >= 100) {
					setAuto(false);
					return 100;
				}
				return Math.min(100, prev + 4);
			});
		}, 200);
		return () => {
			if (timerRef.current) clearInterval(timerRef.current);
		};
	}, [auto]);

	const clamp = (n: number) => Math.max(0, Math.min(100, n));

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<Gauge className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Progress 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Progress 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 퍼블리셔 안내 배너 ──────────────────────────────── */}
			<div className="rounded-xl border border-amber-300/60 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
					<b>💡 퍼블리셔 참고</b> — Progress 는 실제 SI 프로젝트에서 디자인 교체가 가장 잦은 컴포넌트입니다. 컴포넌트{' '}
					<b>본체(progress.tsx)를 수정하지 말고</b>, 노출된 <code className="font-mono">data-slot</code> 선택자만
					오버라이드하세요. 아래 <b>3번(커스텀 색상)</b> 과 <b>실전 예제(module.css)</b> 에 그 방법이 정리되어
					있습니다.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Progress 하나로 끝납니다. value(0~100) 하나만 넘기면 그만큼 채워진 막대가 됩니다. 내부적으로 트랙(progress)과 인디케이터(progress-indicator) 두 요소로 이루어집니다."
				/>
				<CodeBlock
					code={`import { Progress } from '@axiom/components/ui';

// value: 0 ~ 100 사이의 진행률
<Progress value={60} />`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>value</b> 는 0~100 범위의 숫자입니다. 값을 넘기지 않거나 <b>null</b> 이면 0%(빈 막대)로 표시됩니다. 기본
					높이는 <code className="font-mono">h-1</code>, 트랙 색은 <code className="font-mono">bg-muted</code>,
					채움 색은 <code className="font-mono">bg-primary</code>(테마 색) 입니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본"
					description="value 하나만 넘긴 가장 단순한 형태입니다."
				/>
				<ExCard
					label="value={60}"
					code={`<Progress value={60} />`}
				>
					<div className="w-full">
						<Progress value={60} />
					</div>
				</ExCard>
			</section>

			{/* ── 2. 다양한 값 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 다양한 값"
					description="0%부터 100%까지 값에 따라 채워지는 정도가 달라집니다."
				/>
				<ExCard
					label="value = 0 · 25 · 50 · 75 · 100"
					code={`<Progress value={0} />
<Progress value={25} />
<Progress value={50} />
<Progress value={75} />
<Progress value={100} />`}
				>
					<div className="w-full space-y-4">
						{[0, 25, 50, 75, 100].map((v) => (
							<div
								key={v}
								className="flex items-center gap-3"
							>
								<span className="w-10 shrink-0 text-xs font-mono text-gray-500 dark:text-gray-400 tabular-nums">
									{v}%
								</span>
								<Progress value={v} />
							</div>
						))}
					</div>
				</ExCard>
			</section>

			{/* ── 3. 커스텀 색상 (data-slot 오버라이드) ──────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 커스텀 색상 — 재스타일링 핵심"
					description="트랙 색은 className 으로 바로 덮어쓸 수 있고(twMerge 지원), 채움(인디케이터) 색은 data-slot 을 겨냥한 arbitrary variant 로 바꿉니다. 컴포넌트를 복제하지 않고도 색을 교체할 수 있습니다."
				/>
				<ExCard
					label="트랙 = className / 인디케이터 = [&>[data-slot=progress-indicator]]:bg-*"
					code={`{/* 트랙 색: className 에 bg-* 를 주면 기본 bg-muted 를 덮어씀 */}
{/* 인디케이터 색: data-slot 을 겨냥한 arbitrary variant 사용 */}
<Progress
  value={70}
  className="bg-emerald-100 dark:bg-emerald-950/40
             [&>[data-slot=progress-indicator]]:bg-emerald-500"
/>

<Progress
  value={55}
  className="bg-rose-100 dark:bg-rose-950/40
             [&>[data-slot=progress-indicator]]:bg-rose-500"
/>

{/* 그라데이션도 가능 */}
<Progress
  value={85}
  className="[&>[data-slot=progress-indicator]]:bg-gradient-to-r
             [&>[data-slot=progress-indicator]]:from-violet-500
             [&>[data-slot=progress-indicator]]:to-fuchsia-500"
/>`}
				>
					<div className="w-full space-y-4">
						<Progress
							value={70}
							className="bg-emerald-100 dark:bg-emerald-950/40 [&>[data-slot=progress-indicator]]:bg-emerald-500"
						/>
						<Progress
							value={55}
							className="bg-rose-100 dark:bg-rose-950/40 [&>[data-slot=progress-indicator]]:bg-rose-500"
						/>
						<Progress
							value={85}
							className="[&>[data-slot=progress-indicator]]:bg-gradient-to-r [&>[data-slot=progress-indicator]]:from-violet-500 [&>[data-slot=progress-indicator]]:to-fuchsia-500"
						/>
					</div>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					인디케이터는 트랙(Root)의 <b>직계 자식</b>이라 <code className="font-mono">&gt;</code> 결합자를 쓴
					<code className="font-mono">[&amp;&gt;[data-slot=progress-indicator]]:…</code> 형태가 안전합니다. 이
					선택자는 자손 결합자라 기본 <code className="font-mono">bg-primary</code> 보다 명시도가 높아 항상 적용됩니다.
				</p>
			</section>

			{/* ── 4. 커스텀 높이/두께 ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 커스텀 높이 · 라운드"
					description="기본 높이는 h-1(4px) 입니다. className 으로 h-* 를 주면 두께가 바뀝니다."
				/>
				<ExCard
					label="h-1 (기본) · h-2 · h-3 · h-4"
					code={`<Progress value={65} />              {/* h-1 기본 */}
<Progress value={65} className="h-2" />
<Progress value={65} className="h-3" />
<Progress value={65} className="h-4 rounded-lg" />`}
				>
					<div className="w-full space-y-4">
						<Progress value={65} />
						<Progress
							value={65}
							className="h-2"
						/>
						<Progress
							value={65}
							className="h-3"
						/>
						<Progress
							value={65}
							className="h-4 rounded-lg"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 5. 인터랙티브 (Controlled) ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 인터랙티브 예제 — Controlled"
					description="value 를 상태로 두고 버튼/자동 타이머로 갱신합니다. 실제로는 fetch/XHR 의 progress 이벤트에서 setValue 만 호출하면 됩니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 값: <code className="font-mono text-violet-700 dark:text-violet-400">{value}%</code>
						</span>
					</div>
					<div className="p-5 space-y-4">
						<Progress value={value} />

						<div className="flex flex-wrap gap-2">
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setValue((v) => clamp(v - 10))}
								disabled={auto}
							>
								−10%
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setValue((v) => clamp(v + 10))}
								disabled={auto}
							>
								+10%
							</Button>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								onClick={() => setValue(0)}
								disabled={auto}
							>
								0%
							</Button>
							<Button
								type="button"
								size="sm"
								variant="secondary"
								onClick={() => setValue(100)}
								disabled={auto}
							>
								100%
							</Button>
							<Button
								type="button"
								size="sm"
								onClick={() => {
									setValue(0);
									setAuto(true);
								}}
								disabled={auto}
								className="gap-1.5"
							>
								<LoaderCircle className={`w-3.5 h-3.5 ${auto ? 'animate-spin' : ''}`} />
								{auto ? '진행 중…' : '자동 진행'}
							</Button>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [value, setValue] = useState(40);

<Progress value={value} />
<button onClick={() => setValue((v) => v + 10)}>+10%</button>

// 실제 업로드/다운로드라면:
xhr.upload.onprogress = (e) => {
  setValue(Math.round((e.loaded / e.total) * 100));
};`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 ───────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="Props 요약" />
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
								{ prop: 'value', type: 'number', desc: '진행률 0~100. 없거나 null이면 0%로 처리' },
								{ prop: 'className', type: 'string', desc: '트랙(Root)에 적용. bg-*/h-* 등으로 색·두께 오버라이드(twMerge)' },
								{ prop: '...props', type: 'Radix Progress.Root', desc: 'id, aria-label 등 Radix Root 속성 그대로 전달' },
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
				<div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/50 dark:bg-gray-900/40 px-4 py-3">
					<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
						<b>노출되는 data-slot</b> —{' '}
						<code className="font-mono text-violet-700 dark:text-violet-400">[data-slot="progress"]</code>(트랙),{' '}
						<code className="font-mono text-violet-700 dark:text-violet-400">[data-slot="progress-indicator"]</code>
						(채움). 이 두 선택자로 CSS Module / Tailwind arbitrary variant 를 통해 자유롭게 재스타일링합니다.
					</p>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 업로드 진행률 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 파일 업로드 진행률"
					description="scaffold Progress 를 그대로 쓰되 *.module.css 의 data-slot 선택자로 그라데이션·광택 줄무늬를 입힌 업로드 카드입니다. '업로드 시작'을 누르면 진행률이 실제로 흐릅니다."
				/>

				<UploadProgressCard />

				<SourceTabs
					files={[
						{ filename: 'UploadProgressCard.tsx', code: uploadSource, lang: 'tsx' },
						{ filename: 'UploadProgressCard.module.css', code: uploadCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 리소스 사용량 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 리소스 사용량 게이지"
					description="값(임계치)에 따라 막대 색이 초록/주황/빨강으로 바뀌는 대시보드형 게이지. 각 행의 data-level 속성을 module.css 에서 data-slot 선택자와 조합해 처리합니다. 맨 아래 슬라이더로 색 전환을 직접 확인해 보세요."
				/>

				<ResourceUsageCard />

				<SourceTabs
					files={[
						{ filename: 'ResourceUsageCard.tsx', code: resourceSource, lang: 'tsx' },
						{ filename: 'ResourceUsageCard.module.css', code: resourceCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
