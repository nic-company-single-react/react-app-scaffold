import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipTrigger, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import FormHelpTooltip from '@/domains/example/components/ui-components/tooltip/FormHelpTooltip';
import ToolbarTooltip from '@/domains/example/components/ui-components/tooltip/ToolbarTooltip';
import formSource from '@/domains/example/components/ui-components/tooltip/FormHelpTooltip.tsx?raw';
import formCss from '@/domains/example/components/ui-components/tooltip/FormHelpTooltip.module.css?raw';
import toolbarSource from '@/domains/example/components/ui-components/tooltip/ToolbarTooltip.tsx?raw';
import toolbarCss from '@/domains/example/components/ui-components/tooltip/ToolbarTooltip.module.css?raw';
import { MessageSquareText, Info } from 'lucide-react';

export default function TooltipComponent(): React.ReactNode {
	/** 8. 제어(controlled) 예제 */
	const [open, setOpen] = useState(false);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<MessageSquareText className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tooltip 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Tooltip 컴포넌트 사용 예제입니다. <b>요소에 마우스를 올리거나 포커스</b>했을 때 보조 설명을
						띄우는 데 사용합니다.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 (Provider 필수) ────────────────────────── */}
			<div className="flex items-start gap-2.5 rounded-xl border border-sky-200 dark:border-sky-900/40 bg-sky-50/60 dark:bg-sky-900/15 px-4 py-3">
				<Info className="w-4 h-4 mt-0.5 shrink-0 text-sky-600 dark:text-sky-400" />
				<p className="text-xs leading-relaxed text-sky-900 dark:text-sky-200">
					Tooltip 은 반드시 <code className="font-mono font-semibold">TooltipProvider</code> 하위에서만 동작합니다. 이
					프로젝트는 이미 <code className="font-mono font-semibold">src/core/providers/AppProviders.tsx</code> 최상단에{' '}
					<b>한 번만</b> 감싸두었으므로,{' '}
					<b>각 페이지에서는 Provider 없이 Tooltip · TooltipTrigger · TooltipContent 만 바로 쓰면 됩니다.</b> (지연
					타이밍을 앱 전체가 공유해야 해서 Provider 는 최상위 1개가 정석입니다)
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Tooltip(래퍼) · TooltipTrigger(대상) · TooltipContent(말풍선) 세 가지를 조합합니다. Provider 는 최상위(AppProviders)에 이미 있으므로 페이지에서는 생략합니다."
				/>
				<CodeBlock
					code={`import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@axiom/components/ui';

// TooltipProvider 는 AppProviders.tsx 최상단에 이미 있음 → 페이지에선 생략
<Tooltip>
  <TooltipTrigger asChild>
    <Button>마우스를 올려보세요</Button>
  </TooltipTrigger>
  <TooltipContent>도움말 내용</TooltipContent>
</Tooltip>

/* ─ 앱 최상위(core/providers/AppProviders.tsx)에는 이렇게 한 번만 ─
<TooltipProvider delayDuration={200}>
  <App />
</TooltipProvider> */`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>asChild</b> 는 TooltipTrigger 가 자체 버튼을 만들지 않고 자식 요소(여기선 Button)를 그대로 트리거로 삼게
					합니다. 버튼 안에 버튼이 중첩되는 문제를 막아주므로 거의 항상 함께 씁니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="가장 단순한 형태. 트리거에 마우스를 올리거나 키보드로 포커스하면 말풍선이 뜹니다."
				/>
				<ExCard
					label="기본 사용"
					code={`<Tooltip>
  <TooltipTrigger asChild>
    <Button variant="outline">Hover me</Button>
  </TooltipTrigger>
  <TooltipContent>계좌 잔액을 새로고침합니다</TooltipContent>
</Tooltip>`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">Hover me</Button>
						</TooltipTrigger>
						<TooltipContent>계좌 잔액을 새로고침합니다</TooltipContent>
					</Tooltip>

					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">텍스트도 가능</Button>
						</TooltipTrigger>
						<TooltipContent>어떤 요소든 트리거가 될 수 있습니다</TooltipContent>
					</Tooltip>
				</ExCard>
			</section>

			{/* ── 2. side (뜨는 방향) ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. side (뜨는 방향)"
					description='TooltipContent 의 side 로 말풍선이 뜨는 방향을 정합니다. "top"(기본) · "right" · "bottom" · "left".'
				/>
				<ExCard
					label='side="top" | "right" | "bottom" | "left"'
					code={`<TooltipContent side="top">위쪽 (기본)</TooltipContent>
<TooltipContent side="right">오른쪽</TooltipContent>
<TooltipContent side="bottom">아래쪽</TooltipContent>
<TooltipContent side="left">왼쪽</TooltipContent>`}
				>
					{(['top', 'right', 'bottom', 'left'] as const).map((side) => (
						<Tooltip key={side}>
							<TooltipTrigger asChild>
								<Button variant="outline">{side}</Button>
							</TooltipTrigger>
							<TooltipContent side={side}>{side} 방향으로 뜹니다</TooltipContent>
						</Tooltip>
					))}
				</ExCard>
			</section>

			{/* ── 3. align (정렬) ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. align (정렬)"
					description='side 와 수직인 축에서의 정렬입니다. "center"(기본) · "start" · "end". 트리거보다 긴 말풍선을 한쪽으로 붙일 때 씁니다.'
				/>
				<ExCard
					label='align="start" | "center" | "end"'
					code={`<TooltipContent align="start">시작점에 정렬</TooltipContent>
<TooltipContent align="center">가운데 정렬(기본)</TooltipContent>
<TooltipContent align="end">끝점에 정렬</TooltipContent>`}
				>
					{(['start', 'center', 'end'] as const).map((align) => (
						<Tooltip key={align}>
							<TooltipTrigger asChild>
								<Button variant="outline">align: {align}</Button>
							</TooltipTrigger>
							<TooltipContent
								side="bottom"
								align={align}
							>
								이 말풍선은 {align} 기준으로 정렬됩니다
							</TooltipContent>
						</Tooltip>
					))}
				</ExCard>
			</section>

			{/* ── 4. sideOffset (간격) ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. sideOffset (트리거와의 간격)"
					description="트리거와 말풍선 사이 거리(px)입니다. 기본값 0. 화살표가 있으므로 살짝 띄우면(4~8px) 자연스럽습니다."
				/>
				<ExCard
					label="sideOffset={0} vs {10}"
					code={`<TooltipContent sideOffset={0}>딱 붙음 (기본)</TooltipContent>
<TooltipContent sideOffset={10}>10px 띄움</TooltipContent>`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">offset 0</Button>
						</TooltipTrigger>
						<TooltipContent sideOffset={0}>딱 붙어 있습니다</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">offset 10</Button>
						</TooltipTrigger>
						<TooltipContent sideOffset={10}>10px 떨어져 있습니다</TooltipContent>
					</Tooltip>
				</ExCard>
			</section>

			{/* ── 5. delayDuration (지연) ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. delayDuration (뜨기까지 지연)"
					description="마우스를 올린 뒤 말풍선이 뜨기까지의 지연(ms)입니다. Provider 에 기본값을 주고, 개별 Tooltip 에서 덮어쓸 수 있습니다. (이 페이지 Provider 기본값은 200ms)"
				/>
				<ExCard
					label="delayDuration 개별 지정"
					code={`{/* 즉시 */}
<Tooltip delayDuration={0}>...</Tooltip>

{/* 0.7초 뒤 */}
<Tooltip delayDuration={700}>...</Tooltip>`}
				>
					<Tooltip delayDuration={0}>
						<TooltipTrigger asChild>
							<Button variant="outline">즉시 (0ms)</Button>
						</TooltipTrigger>
						<TooltipContent>바로 떴습니다</TooltipContent>
					</Tooltip>
					<Tooltip delayDuration={700}>
						<TooltipTrigger asChild>
							<Button variant="outline">느리게 (700ms)</Button>
						</TooltipTrigger>
						<TooltipContent>0.7초 기다렸습니다</TooltipContent>
					</Tooltip>
				</ExCard>
			</section>

			{/* ── 6. Rich content (풍부한 내용) ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. Rich content (여러 줄 · 아이콘)"
					description="TooltipContent 안에는 텍스트뿐 아니라 임의의 JSX 를 넣을 수 있습니다. 다만 툴팁은 '보조 설명'용이므로 링크·버튼 같은 상호작용 요소는 넣지 마세요(그럴 땐 Popover 를 씁니다)."
				/>
				<ExCard
					label="아이콘 + 제목 + 설명"
					code={`<TooltipContent className="max-w-[220px]">
  <div className="flex items-center gap-1.5 font-semibold">
    <Info className="w-3.5 h-3.5" />
    OTP 인증
  </div>
  <p className="mt-1 text-background/80">
    등록된 휴대폰으로 전송된 6자리 숫자를 입력하세요.
  </p>
</TooltipContent>`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">인증 안내</Button>
						</TooltipTrigger>
						<TooltipContent className="max-w-[220px]">
							<div className="flex flex-col gap-1">
								<span className="flex items-center gap-1.5 font-semibold">
									<Info className="w-3.5 h-3.5" />
									OTP 인증
								</span>
								<span className="text-background/80 leading-relaxed">
									등록된 휴대폰으로 전송된 6자리 숫자를 입력하세요. 유효시간은 3분입니다.
								</span>
							</div>
						</TooltipContent>
					</Tooltip>
				</ExCard>
			</section>

			{/* ── 7. className 으로 간단 커스터마이징 ───────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. className 으로 색·너비 바꾸기 (간단한 커스터마이징)"
					description="TooltipContent 에 className 을 주면 Tailwind 로 배경·글자색·최대너비를 바꿀 수 있습니다. 단, 화살표 svg 는 radix 가 위치지정용 <span> 으로 감싸므로 직계 자식([&>svg])이 아니라 자손([&_svg]) 선택자로 잡아야 하고, 배경색·fill 을 함께 바꿔야 색이 맞습니다."
				/>
				<ExCard
					label="배경색 · 최대너비 오버라이드"
					code={`{/* 파란 말풍선 — 화살표 svg 까지 같이 칠한다.
    ⚠ 화살표 svg 는 radix 가 <span> 으로 감싸므로 [&>svg](직계)가 아니라 [&_svg](자손)로 잡는다.
    본문에 아이콘 svg 가 있으면 그것까지 물드니 주의(그럴 땐 module.css 로 정밀 타겟). */}
<TooltipContent className="bg-sky-600 text-white [&_svg]:bg-sky-600! [&_svg]:fill-sky-600!">
  파란색 툴팁
</TooltipContent>

{/* 좁게 묶어 여러 줄로 */}
<TooltipContent className="max-w-[140px] text-center">
  좁은 폭에서 자동 줄바꿈되는 긴 안내 문구입니다.
</TooltipContent>`}
				>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">파란 툴팁</Button>
						</TooltipTrigger>
						<TooltipContent className="bg-sky-600 text-white [&_svg]:bg-sky-600! [&_svg]:fill-sky-600!">
							파란색으로 바꾼 툴팁
						</TooltipContent>
					</Tooltip>
					<Tooltip>
						<TooltipTrigger asChild>
							<Button variant="outline">좁은 툴팁</Button>
						</TooltipTrigger>
						<TooltipContent className="max-w-[140px] text-center">
							좁은 폭에서 자동 줄바꿈되는 긴 안내 문구입니다.
						</TooltipContent>
					</Tooltip>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					이 정도를 넘어 <b>완전히 다른 톤앤매너</b>(카드형·글래스·kbd 칩 등)로 가야 한다면 className 을 길게 늘이지
					말고 <b>*.module.css 로 분리</b>하세요. 아래 <b>퍼블리셔 가이드</b>와 <b>실전 예제</b>가 그 방법입니다.
				</p>
			</section>

			{/* ── 8. Controlled (제어) ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 인터랙티브 예제 — Controlled"
					description="open / onOpenChange 로 툴팁의 열림 상태를 외부에서 제어합니다. 특정 동작 후 안내를 강제로 띄우는 등의 시나리오에 씁니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 상태: <code className="font-mono text-sky-700 dark:text-sky-400">{open ? 'open' : 'closed'}</code>
						</span>
					</div>
					<div className="p-5 flex flex-wrap items-center gap-3">
						<Tooltip
							open={open}
							onOpenChange={setOpen}
						>
							<TooltipTrigger asChild>
								<Button variant="outline">제어되는 트리거</Button>
							</TooltipTrigger>
							<TooltipContent side="bottom">외부 state 로 열려 있습니다</TooltipContent>
						</Tooltip>

						<Button
							size="sm"
							onClick={() => setOpen((v) => !v)}
						>
							{open ? '닫기' : '열기'}
						</Button>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [open, setOpen] = useState(false);

<Tooltip open={open} onOpenChange={setOpen}>
  <TooltipTrigger asChild>
    <Button variant="outline">제어되는 트리거</Button>
  </TooltipTrigger>
  <TooltipContent side="bottom">외부 state 로 열려 있습니다</TooltipContent>
</Tooltip>

<Button onClick={() => setOpen((v) => !v)}>토글</Button>`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="radix-ui Tooltip 의 props 를 그대로 받습니다. 아래는 자주 쓰는 것만 추렸습니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">컴포넌트</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									c: 'TooltipProvider',
									p: 'delayDuration',
									t: 'number',
									d: '하위 모든 Tooltip 의 기본 지연(ms). 기본 0',
								},
								{
									c: 'TooltipProvider',
									p: 'skipDelayDuration',
									t: 'number',
									d: '이 시간 안에 다른 툴팁으로 옮기면 지연 없이 즉시 표시(기본 300)',
								},
								{ c: 'Tooltip', p: 'open', t: 'boolean', d: '열림 여부 (제어 모드)' },
								{ c: 'Tooltip', p: 'defaultOpen', t: 'boolean', d: '초기 열림 여부 (비제어)' },
								{
									c: 'Tooltip',
									p: 'onOpenChange',
									t: '(open: boolean) => void',
									d: '열림 상태가 바뀔 때 호출',
								},
								{ c: 'Tooltip', p: 'delayDuration', t: 'number', d: 'Provider 값을 개별로 덮어씀' },
								{
									c: 'TooltipTrigger',
									p: 'asChild',
									t: 'boolean',
									d: '자식 요소를 트리거로 사용(버튼 중첩 방지) — 사실상 필수',
								},
								{
									c: 'TooltipContent',
									p: 'side',
									t: '"top" | "right" | "bottom" | "left"',
									d: '뜨는 방향 (기본 "top")',
								},
								{
									c: 'TooltipContent',
									p: 'align',
									t: '"start" | "center" | "end"',
									d: '교차축 정렬 (기본 "center")',
								},
								{ c: 'TooltipContent', p: 'sideOffset', t: 'number', d: '트리거와의 간격 px (기본 0)' },
								{ c: 'TooltipContent', p: 'className', t: 'string', d: '말풍선에 적용될 추가 클래스 (cn 병합)' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400 whitespace-nowrap">{row.c}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.p}</code>
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

			{/* ── 퍼블리셔 가이드 ──────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="퍼블리셔 가이드 — 스타일을 어디에서 바꾸나"
					description="실제 프로젝트에서 Tooltip 은 디자인이 크게 바뀌는 컴포넌트입니다. shared 의 tooltip.tsx 는 수정하지 말고, 아래 훅(data-slot / data-side / data-state)만 잡아 스타일을 덮어쓰세요."
				/>

				{/* Portal 경고 배너 — 이 페이지에서 가장 중요한 내용 */}
				<div className="rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/70 dark:bg-amber-900/15 px-4 py-3.5 space-y-2">
					<p className="text-xs font-semibold text-amber-900 dark:text-amber-300">
						⚠ 가장 중요 — TooltipContent 는 Portal 로 <code className="font-mono">document.body</code> 에 렌더됩니다.
					</p>
					<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
						즉 소비 컴포넌트의 <code className="font-mono">.wrap :global([data-slot='tooltip-content'])</code> 같은{' '}
						<b>조상 스코프 선택자로는 말풍선에 스타일이 닿지 않습니다</b>(포털된 요소는 .wrap 의 자식이 아니니까요).
						Switch·Accordion 처럼 <code className="font-mono">.wrap :global(...)</code> 로 감싸면 안 됩니다.
					</p>
					<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-200/90">
						✅ 해결:{' '}
						<b>
							module.css 클래스를 TooltipContent 의 <code className="font-mono">className</code> 으로 직접 전달
						</b>
						하세요. CSS Module 은 클래스명을 해시로 바꿀 뿐이라, 그 요소가 body 어디에 있든 규칙이 적용됩니다. 기본
						Tailwind 유틸리티(<code className="font-mono">bg-foreground</code> 등, 명시도 0,1,0)를 이기려면{' '}
						<code className="font-mono">.tip:global([data-slot='tooltip-content'])</code> 처럼 data-slot 을 함께 걸어
						명시도를 0,2,0 으로 올립니다. 그리고 함정이 하나 더 있습니다 — CSS 변수(커스텀 프로퍼티)도 포털 경계를 못
						넘습니다. 말풍선 색을 소비 래퍼(.card / .wrap)에 --my-bg 로 정의하면 body 로 포털된 말풍선에서 그 변수가
						undefined 가 되어 background/fill 이 통째로 무효화됩니다(화살표가 검게 남는 대표 원인). 그래서 말풍선이 쓰는
						변수는 반드시 포털되는 요소인 .tip 자체에 정의해야 합니다.
					</p>
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">선택자</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">대상</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									기본 스타일 / 비고
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									sel: '[data-slot="tooltip-content"]',
									target: '말풍선 본체',
									note: 'bg-foreground, text-background, px-3 py-1.5, rounded-md, text-xs, max-w-xs — className 으로 덮어씀',
								},
								{
									sel: 'svg (자손 — span 안)',
									target: '화살표(Arrow)',
									note: 'data-slot 없음. radix 가 span 으로 감싸므로 직계(>)가 아닌 자손( ) 선택자로 잡는다. bg-foreground/fill-foreground(검정) → background·fill 둘 다 변경',
								},
								{
									sel: '[data-slot="tooltip-trigger"]',
									target: '트리거',
									note: '보통 asChild 로 자식 요소가 대체하므로 직접 스타일링할 일은 적음',
								},
								{
									sel: '[data-side="top|right|bottom|left"]',
									target: '뜨는 방향',
									note: 'radix 가 붙임. 방향별로 진입 애니메이션 분기에 사용',
								},
								{
									sel: '[data-state="delayed-open"]',
									target: '표시된 상태',
									note: 'closed / delayed-open / instant-open. 트리거(? 아이콘) 강조에도 활용',
								},
							].map((row) => (
								<tr
									key={row.sel}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400 whitespace-nowrap">
											{row.sel}
										</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300">{row.target}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.note}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`/* MyTooltipArea.module.css — 퍼블리셔가 만지는 파일 */

/* ① module.css 클래스를 TooltipContent 의 className 으로 직접 넘긴다
      <TooltipContent className={styles.tip}> ...
   ② data-slot 을 함께 걸어 Tailwind 기본값(0,1,0)보다 명시도를 높인다(0,2,0) */
.tip:global([data-slot='tooltip-content']) {
  display: block;                 /* 기본 inline-flex 덮기 */
  max-width: 260px;
  padding: 12px 14px;
  border-radius: 12px;
  background: #ffffff;            /* 검정 → 밝은 카드 */
  color: #0f172a;
  border: 1px solid #e2e8f0;
  box-shadow: 0 12px 32px -12px rgba(15, 23, 42, 0.4);
}

/* ③ 화살표: radix 가 svg 를 <span> 으로 감싸므로 직계(>)가 아니라 자손( ) 으로 잡는다.
      배경색과 맞춰 background(다이아몬드 박스)와 fill(폴리곤) 둘 다 칠한다. */
.tip:global([data-slot='tooltip-content']) svg {
  background: #ffffff !important;
  fill: #ffffff !important;
}

/* ④ 다크 모드: .dark 는 html(최상위)에 붙고, 말풍선은 body 로 포털되어도
      여전히 html.dark 의 자손이므로 :global(.dark) 가 정상 동작한다. */
:global(.dark) .tip:global([data-slot='tooltip-content']) {
  background: #0f1729;
  color: #e2e8f0;
  border-color: #24324a;
}`}
							lang="css"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── 실전 예제 1 — 폼 도움말 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="실전 예제 — 폼 항목 도움말 (밝은 카드형)"
					description="금융권 폼에서 가장 흔한 패턴. 항목 옆 물음표(?)에 마우스를 올리면 상세 안내가 뜹니다. 제공 Tooltip 을 그대로 쓰되 *.module.css 로 검정 말풍선을 밝은 카드형으로 완전히 재스타일링했습니다. 퍼블리셔는 .tsx 를 건드리지 않고 .module.css 만 수정하면 됩니다."
				/>

				<FormHelpTooltip />

				<SourceTabs
					files={[
						{ filename: 'FormHelpTooltip.tsx', code: formSource, lang: 'tsx' },
						{ filename: 'FormHelpTooltip.module.css', code: formCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 실전 예제 2 — 아이콘 툴바 ────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="실전 예제 — 에디터 툴바 + 단축키 (다크 글래스형)"
					description="앞선 폼 도움말과 똑같은 Tooltip 을 쓰지만, *.module.css 만 바꿔 전혀 다른 다크 톤 + 단축키(kbd) 칩 스타일로 만들었습니다. 말풍선 디자인은 소비처마다 .module.css 로 갈아끼우면 된다는 것을 보여줍니다."
				/>

				<ToolbarTooltip />

				<SourceTabs
					files={[
						{ filename: 'ToolbarTooltip.tsx', code: toolbarSource, lang: 'tsx' },
						{ filename: 'ToolbarTooltip.module.css', code: toolbarCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
