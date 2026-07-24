import { useState } from 'react';
import { Toggle, ToggleGroup, ToggleGroupItem, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import ViewModeToggleGroup from '@/domains/example/components/ui-components/toggle/ViewModeToggleGroup';
import viewModeSource from '@/domains/example/components/ui-components/toggle/ViewModeToggleGroup.tsx?raw';
import viewModeCss from '@/domains/example/components/ui-components/toggle/ViewModeToggleGroup.module.css?raw';
import {
	ToggleLeft,
	Bold,
	Italic,
	Underline,
	Star,
	Bell,
	BellOff,
	Volume2,
	VolumeX,
	AlignLeft,
	AlignCenter,
	AlignRight,
} from 'lucide-react';

export default function ToggleComponent(): React.ReactNode {
	// 1. 기본 제어 예제
	const [bold, setBold] = useState(false);

	// 6. Button 차이 데모
	const [muted, setMuted] = useState(false);

	// 7. ToggleGroup single (텍스트 정렬)
	const [align, setAlign] = useState('left');

	// 8. ToggleGroup multiple (텍스트 서식)
	const [formats, setFormats] = useState<string[]>(['bold']);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<ToggleLeft className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Toggle 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Toggle · ToggleGroup 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Toggle 은 '눌림/안눌림(on/off)' 두 상태를 오가는 버튼입니다. pressed(현재 상태) 와 onPressedChange(변경 콜백)로 제어하며, 상태가 없는 즉시 실행 동작에는 Button 을 쓰세요."
				/>
				<CodeBlock
					code={`import { Toggle } from '@axiom/components/ui';

// 비제어 — 내부 상태로 동작
<Toggle aria-label="굵게">
  <Bold />
</Toggle>

// 제어 — 외부 state 와 동기화
const [on, setOn] = useState(false);

<Toggle pressed={on} onPressedChange={setOn} aria-label="굵게">
  <Bold />
</Toggle>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					눌린 상태는 <b>aria-pressed</b> / <b>data-state="on"</b> 으로 노출되어, 이 속성만으로 스타일을 완전히 바꿀 수
					있습니다. 아이콘만 넣을 때는 접근성을 위해 <b>aria-label</b> 을 반드시 지정하세요.
				</p>
			</section>

			{/* ── 1. Basic (제어) ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 제어(Controlled)"
					description="pressed / onPressedChange 로 눌림 상태를 외부 state 와 연결합니다."
				/>
				<ExCard
					label="pressed / onPressedChange"
					code={`const [bold, setBold] = useState(false);

<Toggle pressed={bold} onPressedChange={setBold} aria-label="굵게">
  <Bold />
  굵게
</Toggle>`}
				>
					<Toggle
						pressed={bold}
						onPressedChange={setBold}
						aria-label="굵게"
					>
						<Bold />
						굵게
					</Toggle>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						현재 상태:{' '}
						<code className="font-mono text-violet-700 dark:text-violet-400">{bold ? 'on' : 'off'}</code>
					</span>
				</ExCard>
			</section>

			{/* ── 2. Variant ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Variant (default / outline)"
					description='variant prop 으로 외곽선 유무를 정합니다. "outline" 은 눌리지 않은 상태에서도 테두리가 보여 자리(affordance)가 뚜렷합니다.'
				/>
				<ExCard
					label='variant="default" | "outline"'
					code={`<Toggle aria-label="굵게"><Bold /></Toggle>
<Toggle variant="outline" aria-label="기울임"><Italic /></Toggle>`}
				>
					<Toggle aria-label="굵게">
						<Bold />
					</Toggle>
					<Toggle
						variant="outline"
						aria-label="기울임"
					>
						<Italic />
					</Toggle>
					<Toggle
						variant="outline"
						aria-label="밑줄"
					>
						<Underline />
						밑줄
					</Toggle>
				</ExCard>
			</section>

			{/* ── 3. Size ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Size (sm / default / lg)"
					description="size prop 으로 크기를 조절합니다."
				/>
				<ExCard
					label='size="sm" | "default" | "lg"'
					code={`<Toggle size="sm" variant="outline" aria-label="즐겨찾기"><Star /></Toggle>
<Toggle size="default" variant="outline" aria-label="즐겨찾기"><Star /></Toggle>
<Toggle size="lg" variant="outline" aria-label="즐겨찾기"><Star /></Toggle>`}
				>
					<Toggle
						size="sm"
						variant="outline"
						aria-label="즐겨찾기 sm"
					>
						<Star />
					</Toggle>
					<Toggle
						size="default"
						variant="outline"
						aria-label="즐겨찾기 default"
					>
						<Star />
					</Toggle>
					<Toggle
						size="lg"
						variant="outline"
						aria-label="즐겨찾기 lg"
					>
						<Star />
					</Toggle>
				</ExCard>
			</section>

			{/* ── 4. 아이콘 + 텍스트 / 상태별 콘텐츠 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 상태에 따라 콘텐츠 바꾸기"
					description="pressed 값에 따라 아이콘·라벨을 바꿔, 켜짐/꺼짐을 한눈에 보여주는 실전 패턴입니다."
				/>
				<ExCard
					label="pressed 로 아이콘/텍스트 전환"
					code={`const [muted, setMuted] = useState(false);

<Toggle
  variant="outline"
  pressed={muted}
  onPressedChange={setMuted}
  aria-label="음소거"
>
  {muted ? <VolumeX /> : <Volume2 />}
  {muted ? '음소거됨' : '소리 켜짐'}
</Toggle>`}
				>
					<Toggle
						variant="outline"
						pressed={muted}
						onPressedChange={setMuted}
						aria-label="음소거"
					>
						{muted ? <VolumeX /> : <Volume2 />}
						{muted ? '음소거됨' : '소리 켜짐'}
					</Toggle>
				</ExCard>
			</section>

			{/* ── 5. Disabled ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Disabled (비활성화)"
					description="disabled prop 으로 상호작용을 막습니다. 눌린 상태를 유지한 채 비활성화할 수도 있습니다."
				/>
				<ExCard
					label="disabled"
					code={`<Toggle disabled variant="outline" aria-label="알림"><BellOff /> 비활성</Toggle>
<Toggle disabled defaultPressed variant="outline" aria-label="알림"><Bell /> 눌림+비활성</Toggle>`}
				>
					<Toggle
						disabled
						variant="outline"
						aria-label="알림 비활성"
					>
						<BellOff />
						비활성
					</Toggle>
					<Toggle
						disabled
						defaultPressed
						variant="outline"
						aria-label="알림 눌림 비활성"
					>
						<Bell />
						눌림 + 비활성
					</Toggle>
				</ExCard>
			</section>

			{/* ── 6. Button 과의 차이 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. Button 컴포넌트와의 차이"
					description="겉모습이 비슷해 혼동하기 쉽지만, 역할이 다릅니다. '상태를 가지느냐'로 구분하세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							같은 "음소거"라도 — 왼쪽 Toggle 은 상태를 유지하고, 오른쪽 Button 은 누를 때마다 실행만 합니다.
						</span>
					</div>
					<div className="p-5 flex flex-wrap items-center gap-6">
						<div className="flex flex-col items-start gap-1.5">
							<Toggle
								variant="outline"
								pressed={muted}
								onPressedChange={setMuted}
								aria-label="음소거 토글"
							>
								{muted ? <VolumeX /> : <Volume2 />}
								Toggle
							</Toggle>
							<span className="text-[11px] text-gray-500 dark:text-gray-400">
								눌림 유지 · <code className="font-mono">aria-pressed</code>
							</span>
						</div>
						<div className="flex flex-col items-start gap-1.5">
							<Button
								variant="outline"
								onClick={() => setMuted((m) => !m)}
							>
								{muted ? <VolumeX /> : <Volume2 />}
								Button
							</Button>
							<span className="text-[11px] text-gray-500 dark:text-gray-400">즉시 실행 · 상태 없음</span>
						</div>
					</div>
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">구분</th>
								<th className="text-left px-4 py-2.5 font-medium text-violet-700 dark:text-violet-400 text-xs">
									Toggle
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-blue-700 dark:text-blue-400 text-xs">Button</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ k: '핵심 성격', t: 'on/off 상태를 가진 스위치형 버튼', b: '누르면 동작이 실행되는 명령형 버튼' },
								{ k: '상태', t: 'pressed / defaultPressed 로 눌림 유지', b: '상태 없음 (매번 onClick 실행)' },
								{ k: '주요 콜백', t: 'onPressedChange(pressed) => void', b: 'onClick(event) => void' },
								{ k: '접근성 속성', t: 'aria-pressed / data-state="on"', b: '일반 button (aria-pressed 없음)' },
								{ k: '대표 사례', t: '굵게·기울임, 알림 on/off, 필터 활성', b: '저장, 삭제, 제출, 페이지 이동' },
								{ k: 'variant', t: 'default / outline (2종)', b: 'default / outline / secondary / ghost / … (다수)' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
										{row.k}
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.t}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.b}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>한 줄 요약</b> — "이 버튼이 <u>켜진 채로 남아있어야 하나?</u>" → 예면 <b>Toggle</b>, 아니오(누르면 끝)면{' '}
					<b>Button</b>.
				</p>
			</section>

			{/* ── 7. ToggleGroup — Single ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. ToggleGroup — Single (ButtonGroup 처럼 묶기)"
					description="Button 을 ButtonGroup 으로 묶듯, Toggle 여러 개를 ToggleGroup 으로 묶어 하나의 세그먼트 컨트롤을 만들 수 있습니다. type='single' 은 라디오처럼 하나만 선택됩니다. (scaffold에 toggle-group 을 새로 추가해 제공합니다.)"
				/>
				<ExCard
					label='ToggleGroup type="single" (텍스트 정렬)'
					code={`import { ToggleGroup, ToggleGroupItem } from '@axiom/components/ui';

const [align, setAlign] = useState('left');

<ToggleGroup
  type="single"
  variant="outline"
  value={align}
  onValueChange={(v) => v && setAlign(v)}
>
  <ToggleGroupItem value="left" aria-label="왼쪽 정렬"><AlignLeft /></ToggleGroupItem>
  <ToggleGroupItem value="center" aria-label="가운데 정렬"><AlignCenter /></ToggleGroupItem>
  <ToggleGroupItem value="right" aria-label="오른쪽 정렬"><AlignRight /></ToggleGroupItem>
</ToggleGroup>`}
				>
					<ToggleGroup
						type="single"
						variant="outline"
						value={align}
						onValueChange={(v) => v && setAlign(v)}
					>
						<ToggleGroupItem
							value="left"
							aria-label="왼쪽 정렬"
						>
							<AlignLeft />
						</ToggleGroupItem>
						<ToggleGroupItem
							value="center"
							aria-label="가운데 정렬"
						>
							<AlignCenter />
						</ToggleGroupItem>
						<ToggleGroupItem
							value="right"
							aria-label="오른쪽 정렬"
						>
							<AlignRight />
						</ToggleGroupItem>
					</ToggleGroup>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						선택: <code className="font-mono text-violet-700 dark:text-violet-400">{align}</code>
					</span>
				</ExCard>
			</section>

			{/* ── 8. ToggleGroup — Multiple ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. ToggleGroup — Multiple (다중 선택)"
					description="type='multiple' 은 체크박스처럼 여러 개를 동시에 켤 수 있습니다. value 는 문자열 배열입니다."
				/>
				<ExCard
					label='ToggleGroup type="multiple" (텍스트 서식)'
					code={`const [formats, setFormats] = useState<string[]>(['bold']);

<ToggleGroup
  type="multiple"
  variant="outline"
  value={formats}
  onValueChange={setFormats}
>
  <ToggleGroupItem value="bold" aria-label="굵게"><Bold /></ToggleGroupItem>
  <ToggleGroupItem value="italic" aria-label="기울임"><Italic /></ToggleGroupItem>
  <ToggleGroupItem value="underline" aria-label="밑줄"><Underline /></ToggleGroupItem>
</ToggleGroup>`}
				>
					<ToggleGroup
						type="multiple"
						variant="outline"
						value={formats}
						onValueChange={setFormats}
					>
						<ToggleGroupItem
							value="bold"
							aria-label="굵게"
						>
							<Bold />
						</ToggleGroupItem>
						<ToggleGroupItem
							value="italic"
							aria-label="기울임"
						>
							<Italic />
						</ToggleGroupItem>
						<ToggleGroupItem
							value="underline"
							aria-label="밑줄"
						>
							<Underline />
						</ToggleGroupItem>
					</ToggleGroup>
					<span className="text-xs text-gray-500 dark:text-gray-400">
						선택: <code className="font-mono text-violet-700 dark:text-violet-400">[{formats.join(', ') || '없음'}]</code>
					</span>
				</ExCard>
			</section>

			{/* ── 9. 스타일 커스터마이징 (퍼블리셔 대비) ──────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. 스타일 커스터마이징 — 퍼블리셔 가이드"
					description="실제 SI 프로젝트에서는 Toggle 의 디자인이 크게 바뀝니다. 아래 3단계 중 프로젝트 상황에 맞는 방식을 고르세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-3 shadow-sm">
					<ol className="space-y-2.5 text-sm text-gray-700 dark:text-gray-300 list-decimal list-inside">
						<li>
							<b>가벼운 변경</b> — <code className="font-mono text-xs">variant</code> /{' '}
							<code className="font-mono text-xs">size</code> prop 조합, 또는{' '}
							<code className="font-mono text-xs">className</code> 에 Tailwind 유틸리티를 덧붙여 색·모서리·크기를 조정.
						</li>
						<li>
							<b>부분 오버라이드</b> — Toggle 은{' '}
							<code className="font-mono text-xs">data-state="on"</code> /{' '}
							<code className="font-mono text-xs">aria-pressed</code> 를, ToggleGroup 은{' '}
							<code className="font-mono text-xs">data-slot="toggle-group-item"</code> 를 노출합니다. 이 속성 선택자로
							눌림 상태 스타일만 갈아끼웁니다.
						</li>
						<li>
							<b>전면 리디자인</b> — 컴포넌트로 추출하고 <b>바로 옆에 *.module.css</b> 를 두어(co-location) 완전히 다른
							디자인을 입힙니다. 아래 실전 예제가 이 방식입니다.
						</li>
					</ol>
				</div>

				<CodeBlock
					code={`// 1) className 으로 살짝 바꾸기 — 눌리면 브랜드 색
<Toggle
  className="data-[state=on]:bg-violet-600 data-[state=on]:text-white rounded-full px-4"
  aria-label="구독"
>
  구독
</Toggle>`}
					lang="tsx"
					theme="github-dark"
				/>

				<ExCard
					label="className 오버라이드 데모"
					code={`<Toggle
  className="data-[state=on]:bg-violet-600 data-[state=on]:text-white rounded-full px-4"
  aria-label="구독"
>
  <Star /> 구독
</Toggle>`}
				>
					<Toggle
						className="data-[state=on]:bg-violet-600 data-[state=on]:text-white rounded-full px-4"
						aria-label="구독"
					>
						<Star />
						구독
					</Toggle>
				</ExCard>

				<div className="pt-2">
					<SectionHeader
						title="실전 예제 — 세그먼트 보기 전환 (전면 리디자인)"
						description="scaffold ToggleGroup 을 그대로 쓰되, *.module.css 로 data-slot 을 오버라이드해 pill 세그먼트 컨트롤로 완전히 재스타일링했습니다. 세그먼트를 누르면 아래 목록 레이아웃(리스트/카드/칸반)이 실제로 바뀝니다. 퍼블리셔가 토글 디자인을 갈아끼우는 실제 방식을 그대로 보여줍니다."
						id="toggle-restyle-demo"
					/>
				</div>

				<ViewModeToggleGroup />

				<SourceTabs
					files={[
						{ filename: 'ViewModeToggleGroup.tsx', code: viewModeSource, lang: 'tsx' },
						{ filename: 'ViewModeToggleGroup.module.css', code: viewModeCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="Props 요약" />
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
								{ c: 'Toggle', p: 'pressed', t: 'boolean', d: '눌림 상태 (제어 모드)' },
								{ c: 'Toggle', p: 'defaultPressed', t: 'boolean', d: '초기 눌림 상태 (비제어 모드)' },
								{ c: 'Toggle', p: 'onPressedChange', t: '(pressed: boolean) => void', d: '눌림 상태 변경 콜백' },
								{ c: 'Toggle', p: 'variant', t: '"default" | "outline"', d: '외곽선 유무' },
								{ c: 'Toggle', p: 'size', t: '"sm" | "default" | "lg"', d: '크기' },
								{ c: 'Toggle', p: 'disabled', t: 'boolean', d: '비활성화' },
								{ c: 'ToggleGroup', p: 'type', t: '"single" | "multiple"', d: '단일/다중 선택 (필수)' },
								{ c: 'ToggleGroup', p: 'value', t: 'string | string[]', d: '선택된 값 (제어). multiple 은 배열' },
								{ c: 'ToggleGroup', p: 'onValueChange', t: '(value) => void', d: '선택 변경 콜백' },
								{ c: 'ToggleGroup', p: 'variant / size', t: 'Toggle 과 동일', d: '하위 Item 에 일괄 적용' },
								{ c: 'ToggleGroupItem', p: 'value', t: 'string', d: '항목 식별 값 (필수)' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.c}</code>
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
		</div>
	);
}
