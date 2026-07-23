import { useState } from 'react';
import { Slider, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import PriceRangeFilter from '@/domains/example/components/ui-components/slider/PriceRangeFilter';
import priceSource from '@/domains/example/components/ui-components/slider/PriceRangeFilter.tsx?raw';
import priceCss from '@/domains/example/components/ui-components/slider/PriceRangeFilter.module.css?raw';
import MediaSettingsCard from '@/domains/example/components/ui-components/slider/MediaSettingsCard';
import mediaSource from '@/domains/example/components/ui-components/slider/MediaSettingsCard.tsx?raw';
import mediaCss from '@/domains/example/components/ui-components/slider/MediaSettingsCard.module.css?raw';
import { SlidersHorizontal } from 'lucide-react';

export default function SliderComponent(): React.ReactNode {
	// 5. 인터랙티브(controlled) — 단일 thumb
	const [volume, setVolume] = useState<number[]>([40]);
	// 6. 인터랙티브(controlled) — range(두 thumb)
	const [range, setRange] = useState<number[]>([25, 75]);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<SlidersHorizontal className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Slider 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Slider 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 퍼블리셔 안내 배너 ──────────────────────────────── */}
			<div className="rounded-xl border border-amber-300/60 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200">
					<b>💡 퍼블리셔 참고</b> — Slider 는 실제 SI 프로젝트에서 디자인 교체가 가장 잦은 컴포넌트입니다(트랙 두께,
					손잡이 크기·색, 채움 그라데이션 등). 컴포넌트 <b>본체(slider.tsx)를 수정하지 말고</b>, 노출된{' '}
					<code className="font-mono">data-slot</code> 선택자(<code className="font-mono">slider-track</code> ·{' '}
					<code className="font-mono">slider-range</code> · <code className="font-mono">slider-thumb</code>)만
					오버라이드하세요. 아래 <b>4번(커스텀 스타일)</b> 과 <b>실전 예제(module.css)</b> 에 그 방법이 정리되어
					있습니다.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Slider 하나로 끝납니다. value 는 항상 배열입니다 — thumb 가 하나면 [n], 범위(range)면 [lo, hi] 처럼 두 개를 넣습니다. 값이 바뀌면 onValueChange 로 배열이 넘어옵니다."
				/>
				<CodeBlock
					code={`import { Slider } from '@axiom/components/ui';

// 단일 thumb — value 는 원소 1개짜리 배열
<Slider defaultValue={[40]} max={100} step={1} />

// 범위(range) — 원소 2개짜리 배열이면 thumb 가 2개
<Slider defaultValue={[25, 75]} max={100} step={1} />`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>value / defaultValue</b> 는 <b>배열</b>입니다. 배열의 길이만큼 thumb 가 생기므로, 원소를 2개 주면 자동으로
					range 슬라이더가 됩니다. <b>min</b>(기본 0) · <b>max</b>(기본 100) · <b>step</b> 으로 범위와 간격을 정합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본"
					description="defaultValue 로 초기 위치만 지정한 가장 단순한 형태입니다(비제어)."
				/>
				<ExCard
					label="defaultValue={[40]}"
					code={`<Slider defaultValue={[40]} max={100} step={1} />`}
				>
					<div className="w-full">
						<Slider
							defaultValue={[40]}
							max={100}
							step={1}
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 2. min / max / step ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. min · max · step"
					description="범위와 이동 간격을 조절합니다. step 을 크게 주면 값이 뚝뚝 끊겨 이동합니다."
				/>
				<ExCard
					label="step=1 (기본) · step=10 · step=25"
					code={`<Slider defaultValue={[50]} min={0} max={100} step={1} />
<Slider defaultValue={[50]} min={0} max={100} step={10} />
<Slider defaultValue={[50]} min={0} max={100} step={25} />`}
				>
					<div className="w-full space-y-6">
						{[
							{ step: 1, label: 'step 1' },
							{ step: 10, label: 'step 10' },
							{ step: 25, label: 'step 25' },
						].map((s) => (
							<div
								key={s.step}
								className="flex items-center gap-3"
							>
								<span className="w-16 shrink-0 text-xs font-mono text-gray-500 dark:text-gray-400">
									{s.label}
								</span>
								<Slider
									defaultValue={[50]}
									min={0}
									max={100}
									step={s.step}
								/>
							</div>
						))}
					</div>
				</ExCard>
			</section>

			{/* ── 3. Range (두 thumb) ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Range — 범위 선택 (thumb 2개)"
					description="defaultValue 에 원소를 2개 주면 thumb 가 2개인 범위 슬라이더가 됩니다. minStepsBetweenThumbs 로 두 thumb 사이 최소 간격을 강제할 수 있습니다."
				/>
				<ExCard
					label="defaultValue={[25, 75]} + minStepsBetweenThumbs={1}"
					code={`<Slider
  defaultValue={[25, 75]}
  max={100}
  step={1}
  minStepsBetweenThumbs={1}
/>`}
				>
					<div className="w-full">
						<Slider
							defaultValue={[25, 75]}
							max={100}
							step={1}
							minStepsBetweenThumbs={1}
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 4. 커스텀 스타일 (data-slot 오버라이드) ──────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 커스텀 스타일 — 재스타일링 핵심"
					description="트랙·채움(range)·손잡이(thumb) 색과 크기는 data-slot 을 겨냥한 arbitrary variant 로 바꿉니다. 컴포넌트를 복제하지 않고도 완전히 다른 룩으로 교체할 수 있습니다."
				/>
				<ExCard
					label="[&_[data-slot=slider-*]] arbitrary variant"
					code={`{/* 채움색(emerald) + 굵은 트랙 + 큰 초록 손잡이 */}
<Slider
  defaultValue={[60]}
  max={100}
  className="[&_[data-slot=slider-track]]:h-2
             [&_[data-slot=slider-track]]:bg-emerald-100
             [&_[data-slot=slider-range]]:bg-emerald-500
             [&_[data-slot=slider-thumb]]:size-5
             [&_[data-slot=slider-thumb]]:border-2
             [&_[data-slot=slider-thumb]]:border-emerald-500"
/>

{/* 그라데이션 채움 */}
<Slider
  defaultValue={[70]}
  max={100}
  className="[&_[data-slot=slider-track]]:h-2
             [&_[data-slot=slider-range]]:bg-gradient-to-r
             [&_[data-slot=slider-range]]:from-violet-500
             [&_[data-slot=slider-range]]:to-fuchsia-500
             [&_[data-slot=slider-thumb]]:border-fuchsia-500"
/>`}
				>
					<div className="w-full space-y-8">
						<Slider
							defaultValue={[60]}
							max={100}
							className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-track]]:bg-emerald-100 dark:[&_[data-slot=slider-track]]:bg-emerald-950/40 [&_[data-slot=slider-range]]:bg-emerald-500 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-emerald-500"
						/>
						<Slider
							defaultValue={[70]}
							max={100}
							className="[&_[data-slot=slider-track]]:h-2 [&_[data-slot=slider-range]]:bg-gradient-to-r [&_[data-slot=slider-range]]:from-violet-500 [&_[data-slot=slider-range]]:to-fuchsia-500 [&_[data-slot=slider-thumb]]:size-5 [&_[data-slot=slider-thumb]]:border-2 [&_[data-slot=slider-thumb]]:border-fuchsia-500"
						/>
					</div>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					트랙·range·thumb 모두 Root 의 <b>자손</b>이므로 자손 결합자(<code className="font-mono">[&amp;_…]</code>,
					언더스코어=공백)를 씁니다. 색·크기가 클래스로 감당 안 될 만큼 복잡하면 아래 실전 예제처럼{' '}
					<b>*.module.css</b> 에서 같은 <code className="font-mono">data-slot</code> 선택자를 쓰면 됩니다.
				</p>
			</section>

			{/* ── 5. Disabled ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Disabled (비활성화)"
					description="disabled prop 을 주면 조작이 막히고 흐리게 표시됩니다."
				/>
				<ExCard
					label="disabled"
					code={`<Slider defaultValue={[50]} max={100} disabled />`}
				>
					<div className="w-full">
						<Slider
							defaultValue={[50]}
							max={100}
							disabled
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 6. 인터랙티브 (Controlled) ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 인터랙티브 예제 — Controlled"
					description="value 를 상태로 두고 onValueChange 로 갱신합니다. value 가 배열이라는 점만 기억하면 됩니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							단일:{' '}
							<code className="font-mono text-violet-700 dark:text-violet-400">{volume[0]}</code> · 범위:{' '}
							<code className="font-mono text-violet-700 dark:text-violet-400">
								[{range[0]}, {range[1]}]
							</code>
						</span>
					</div>
					<div className="p-5 space-y-8">
						<div className="space-y-2">
							<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
								<span>단일 thumb</span>
								<span className="font-mono tabular-nums">{volume[0]}</span>
							</div>
							<Slider
								value={volume}
								onValueChange={setVolume}
								max={100}
								step={1}
							/>
						</div>

						<div className="space-y-2">
							<div className="flex justify-between text-xs text-gray-500 dark:text-gray-400">
								<span>범위(range)</span>
								<span className="font-mono tabular-nums">
									{range[0]} ~ {range[1]}
								</span>
							</div>
							<Slider
								value={range}
								onValueChange={setRange}
								max={100}
								step={1}
								minStepsBetweenThumbs={1}
							/>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [volume, setVolume] = useState([40]);
const [range, setRange] = useState([25, 75]);

// 단일 thumb
<Slider value={volume} onValueChange={setVolume} max={100} />

// 범위 — onValueChange 는 [lo, hi] 배열을 준다
<Slider value={range} onValueChange={setRange} max={100} />`}
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
								{ prop: 'defaultValue', type: 'number[]', desc: '초기 위치(비제어). 배열 길이만큼 thumb 생성' },
								{ prop: 'value', type: 'number[]', desc: '현재 값(제어 모드). onValueChange 와 함께 사용' },
								{ prop: 'onValueChange', type: '(v: number[]) => void', desc: '값이 바뀔 때마다 호출(배열 전달)' },
								{ prop: 'onValueCommit', type: '(v: number[]) => void', desc: '드래그를 놓는 순간 한 번만 호출' },
								{ prop: 'min / max', type: 'number', desc: '최소·최대값 (기본 0 / 100)' },
								{ prop: 'step', type: 'number', desc: '이동 간격 (기본 1)' },
								{ prop: 'minStepsBetweenThumbs', type: 'number', desc: 'range 에서 두 thumb 사이 최소 간격' },
								{ prop: 'orientation', type: '"horizontal" | "vertical"', desc: '방향 (기본 horizontal)' },
								{ prop: 'disabled', type: 'boolean', desc: '비활성화' },
								{ prop: 'className', type: 'string', desc: 'Root 에 적용. data-slot arbitrary variant 로 재스타일링' },
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
						<code className="font-mono text-violet-700 dark:text-violet-400">[data-slot="slider-track"]</code>(레일),{' '}
						<code className="font-mono text-violet-700 dark:text-violet-400">[data-slot="slider-range"]</code>(채움),{' '}
						<code className="font-mono text-violet-700 dark:text-violet-400">[data-slot="slider-thumb"]</code>(손잡이).
						이 세 선택자로 Tailwind arbitrary variant 나 CSS Module 을 통해 자유롭게 재스타일링합니다.
					</p>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 가격 범위 필터 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 가격 범위 필터"
					description="쇼핑몰에서 흔한 range 슬라이더입니다. scaffold Slider 를 그대로 쓰되 *.module.css 로 트랙·채움·손잡이를 다시 칠하고, 위에 가격대별 재고 히스토그램을 겹쳐 선택 구간만 강조했습니다. 두 손잡이를 직접 드래그해 보세요."
				/>

				<PriceRangeFilter />

				<SourceTabs
					files={[
						{ filename: 'PriceRangeFilter.tsx', code: priceSource, lang: 'tsx' },
						{ filename: 'PriceRangeFilter.module.css', code: priceCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 미디어 설정 ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 디스플레이 & 사운드 설정"
					description="볼륨·밝기·대비·색온도를 조절하는 설정 패널. 같은 Slider 를 여러 줄 쌓고, 각 행의 data-tone 을 module.css 의 data-slot 선택자와 조합해 행마다 다른 색으로 칠했습니다. 값 배지가 실시간으로 갱신됩니다."
				/>

				<MediaSettingsCard />

				<SourceTabs
					files={[
						{ filename: 'MediaSettingsCard.tsx', code: mediaSource, lang: 'tsx' },
						{ filename: 'MediaSettingsCard.module.css', code: mediaCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
