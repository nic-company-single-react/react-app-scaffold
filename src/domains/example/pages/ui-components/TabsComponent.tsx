import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import SettingsTabs from '@/domains/example/components/ui-components/tabs/SettingsTabs';
import settingsSource from '@/domains/example/components/ui-components/tabs/SettingsTabs.tsx?raw';
import settingsCss from '@/domains/example/components/ui-components/tabs/SettingsTabs.module.css?raw';
import { AppWindow, User, Bell, CreditCard } from 'lucide-react';

export default function TabsComponent(): React.ReactNode {
	const [tab, setTab] = useState<string>('tab-1');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<AppWindow className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Tabs 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Tabs 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 안내: 퍼블리셔 스타일 변경 ─────────────────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-500/30 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					💡 <b>퍼블리셔 참고</b> — Tabs는 실제 SI 프로젝트에서 디자인에 맞춰 스타일이 크게 바뀌는 컴포넌트입니다.
					<code className="mx-1 font-mono">className</code>으로 간단히 덮어쓰거나(아래 6번), 컴포넌트 로직은 그대로 두고{' '}
					<code className="mx-1 font-mono">*.module.css</code>로 완전히 다른 디자인을 입힐 수 있습니다(아래 8번 실전 예제).
					내부 요소는 <code className="mx-1 font-mono">data-slot</code>(tabs / tabs-list / tabs-trigger / tabs-content),
					활성 탭은 <code className="mx-1 font-mono">data-state="active"</code> 속성을 노출하므로 이를 선택자로 오버라이드합니다.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Tabs(래퍼) · TabsList(탭 묶음) · TabsTrigger(탭 버튼) · TabsContent(패널) 네 가지를 조합합니다. TabsTrigger 와 TabsContent 는 같은 value 로 짝지어집니다."
				/>
				<CodeBlock
					code={`import {
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
} from '@axiom/components/ui';

<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1">계정</TabsTrigger>
    <TabsTrigger value="tab-2">알림</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">계정 패널 내용</TabsContent>
  <TabsContent value="tab-2">알림 패널 내용</TabsContent>
</Tabs>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>value</b> 는 TabsTrigger 와 TabsContent 를 연결하는 키입니다. 같은 value 를 가진 Trigger 를 클릭하면 해당
					Content 가 나타납니다. 초기 선택 탭은 <b>defaultValue</b>(비제어) 또는 <b>value + onValueChange</b>(제어)로
					지정합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="TabsList 안의 TabsTrigger 를 클릭하면 같은 value 를 가진 TabsContent 가 나타납니다."
				/>
				<ExCard
					label="기본 사용법"
					code={`<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1">계정</TabsTrigger>
    <TabsTrigger value="tab-2">비밀번호</TabsTrigger>
    <TabsTrigger value="tab-3">알림</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">계정 정보를 관리합니다.</TabsContent>
  <TabsContent value="tab-2">비밀번호를 변경합니다.</TabsContent>
  <TabsContent value="tab-3">알림 수신 여부를 설정합니다.</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-1">
							<TabsList>
								<TabsTrigger value="tab-1">계정</TabsTrigger>
								<TabsTrigger value="tab-2">비밀번호</TabsTrigger>
								<TabsTrigger value="tab-3">알림</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								계정 정보(이름, 이메일 등)를 이곳에서 관리합니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								비밀번호를 변경하고 2단계 인증을 설정할 수 있습니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								이메일 및 푸시 알림 수신 여부를 설정합니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 2. Line variant ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title='2. Line 스타일 (variant="line")'
					description='TabsList 에 variant="line" 을 주면 배경 없이 활성 탭 하단에 밑줄(언더라인)이 그려집니다.'
				/>
				<ExCard
					label='variant="line"'
					code={`<Tabs defaultValue="tab-1">
  <TabsList variant="line">
    <TabsTrigger value="tab-1">개요</TabsTrigger>
    <TabsTrigger value="tab-2">활동</TabsTrigger>
    <TabsTrigger value="tab-3">설정</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">...</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-1">
							<TabsList variant="line">
								<TabsTrigger value="tab-1">개요</TabsTrigger>
								<TabsTrigger value="tab-2">활동</TabsTrigger>
								<TabsTrigger value="tab-3">설정</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								대시보드 개요를 보여줍니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								최근 활동 내역을 표시합니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								환경 설정을 변경합니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 3. defaultValue ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. defaultValue (기본 선택 탭)"
					description="defaultValue prop 으로 처음에 열려 있을 탭을 지정합니다. (비제어)"
				/>
				<ExCard
					label='defaultValue="tab-2"'
					code={`<Tabs defaultValue="tab-2">
  <TabsList>
    <TabsTrigger value="tab-1">배송</TabsTrigger>
    <TabsTrigger value="tab-2">반품/교환</TabsTrigger>
    <TabsTrigger value="tab-3">A/S</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-2">처음부터 이 탭이 선택되어 있습니다.</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-2">
							<TabsList>
								<TabsTrigger value="tab-1">배송</TabsTrigger>
								<TabsTrigger value="tab-2">반품/교환</TabsTrigger>
								<TabsTrigger value="tab-3">A/S</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								배송은 결제 후 2~3일 이내에 시작됩니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								<b className="text-gray-800 dark:text-gray-200">반품/교환</b> 탭이 기본으로 선택되어 있습니다. 수령
								후 7일 이내 신청 가능합니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								제품 A/S는 고객센터를 통해 접수됩니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 4. Disabled ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. Disabled (비활성 탭)"
					description="TabsTrigger 에 disabled 를 주면 해당 탭을 선택할 수 없습니다."
				/>
				<ExCard
					label="TabsTrigger disabled"
					code={`<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1">무료</TabsTrigger>
    <TabsTrigger value="tab-2" disabled>프리미엄 (준비중)</TabsTrigger>
    <TabsTrigger value="tab-3">엔터프라이즈</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">...</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-1">
							<TabsList>
								<TabsTrigger value="tab-1">무료</TabsTrigger>
								<TabsTrigger
									value="tab-2"
									disabled
								>
									프리미엄 (준비중)
								</TabsTrigger>
								<TabsTrigger value="tab-3">엔터프라이즈</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								무료 플랜 안내입니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								엔터프라이즈 플랜 안내입니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 5. With Icons ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 아이콘 탭"
					description="TabsTrigger 안에 아이콘을 넣으면 자동으로 정렬됩니다. (svg 는 size-4 로 표준화됨)"
				/>
				<ExCard
					label="아이콘 + 라벨"
					code={`<Tabs defaultValue="tab-1">
  <TabsList>
    <TabsTrigger value="tab-1"><User /> 프로필</TabsTrigger>
    <TabsTrigger value="tab-2"><Bell /> 알림</TabsTrigger>
    <TabsTrigger value="tab-3"><CreditCard /> 결제</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">...</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-1">
							<TabsList>
								<TabsTrigger value="tab-1">
									<User /> 프로필
								</TabsTrigger>
								<TabsTrigger value="tab-2">
									<Bell /> 알림
								</TabsTrigger>
								<TabsTrigger value="tab-3">
									<CreditCard /> 결제
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								프로필 정보를 관리합니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								알림 수신 설정을 변경합니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								결제 수단과 청구 내역을 확인합니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 6. className 커스터마이징 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. className 으로 간단 커스터마이징"
					description="Tabs / TabsList / TabsTrigger / TabsContent 모두 className 을 받습니다. Tailwind 유틸리티로 색·크기·모양을 빠르게 덮어쓸 수 있습니다."
				/>
				<ExCard
					label="Tailwind 유틸리티로 재정의"
					code={`<Tabs defaultValue="tab-1">
  <TabsList className="w-full bg-violet-100 dark:bg-violet-900/30">
    <TabsTrigger
      value="tab-1"
      className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
    >
      일간
    </TabsTrigger>
    <TabsTrigger
      value="tab-2"
      className="data-[state=active]:bg-violet-600 data-[state=active]:text-white"
    >
      주간
    </TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">...</TabsContent>
</Tabs>`}
				>
					<div className="w-full">
						<Tabs defaultValue="tab-1">
							<TabsList className="w-full bg-violet-100 dark:bg-violet-900/30">
								<TabsTrigger
									value="tab-1"
									className="data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
								>
									일간
								</TabsTrigger>
								<TabsTrigger
									value="tab-2"
									className="data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
								>
									주간
								</TabsTrigger>
								<TabsTrigger
									value="tab-3"
									className="data-[state=active]:bg-violet-600 data-[state=active]:text-white dark:data-[state=active]:bg-violet-600 dark:data-[state=active]:text-white"
								>
									월간
								</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								일간 통계입니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								주간 통계입니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								월간 통계입니다.
							</TabsContent>
						</Tabs>
					</div>
				</ExCard>
			</section>

			{/* ── 7. 인터랙티브 예제 — Controlled ────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 인터랙티브 예제 — Controlled"
					description="value / onValueChange 로 선택된 탭을 외부에서 제어합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 선택된 탭: <code className="font-mono text-violet-700 dark:text-violet-400">{tab}</code>
						</span>
					</div>
					<div className="p-5 space-y-3">
						<div className="flex flex-wrap gap-2">
							{['tab-1', 'tab-2', 'tab-3'].map((v) => (
								<button
									key={v}
									onClick={() => setTab(v)}
									className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
										tab === v
											? 'bg-violet-600 text-white border-violet-600'
											: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-violet-400'
									}`}
								>
									{v} 선택
								</button>
							))}
						</div>
						<Tabs
							value={tab}
							onValueChange={setTab}
						>
							<TabsList>
								<TabsTrigger value="tab-1">1단계</TabsTrigger>
								<TabsTrigger value="tab-2">2단계</TabsTrigger>
								<TabsTrigger value="tab-3">3단계</TabsTrigger>
							</TabsList>
							<TabsContent
								value="tab-1"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								약관 동의 단계입니다.
							</TabsContent>
							<TabsContent
								value="tab-2"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								정보 입력 단계입니다.
							</TabsContent>
							<TabsContent
								value="tab-3"
								className="pt-3 text-gray-600 dark:text-gray-400"
							>
								가입 완료 단계입니다.
							</TabsContent>
						</Tabs>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [tab, setTab] = useState('tab-1');

<Tabs value={tab} onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="tab-1">1단계</TabsTrigger>
    <TabsTrigger value="tab-2">2단계</TabsTrigger>
    <TabsTrigger value="tab-3">3단계</TabsTrigger>
  </TabsList>
  <TabsContent value="tab-1">약관 동의 단계입니다.</TabsContent>
  <TabsContent value="tab-2">정보 입력 단계입니다.</TabsContent>
  <TabsContent value="tab-3">가입 완료 단계입니다.</TabsContent>
</Tabs>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 8. 실전 예제 — module.css 재스타일링 ───────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 실전 예제 — *.module.css 로 완전 재스타일링 (설정 화면)"
					description="제공 Tabs 를 그대로 쓰되, 컴포넌트 로직은 건드리지 않고 *.module.css 로 좌측 세로 레일 + 우측 카드 형태의 전혀 다른 디자인을 입혔습니다. 퍼블리셔는 이 방식으로 data-slot / data-state 선택자만 오버라이드하면 됩니다."
				/>

				<SettingsTabs />

				<SourceTabs
					files={[
						{ filename: 'SettingsTabs.tsx', code: settingsSource, lang: 'tsx' },
						{ filename: 'SettingsTabs.module.css', code: settingsCss, lang: 'css' },
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
								{
									component: 'Tabs',
									prop: 'defaultValue',
									type: 'string',
									desc: '초기에 선택될 탭의 value (비제어)',
								},
								{
									component: 'Tabs',
									prop: 'value',
									type: 'string',
									desc: '현재 선택된 탭 (제어 모드)',
								},
								{
									component: 'Tabs',
									prop: 'onValueChange',
									type: '(value: string) => void',
									desc: '탭이 바뀔 때 호출되는 콜백',
								},
								{
									component: 'Tabs',
									prop: 'orientation',
									type: '"horizontal" | "vertical"',
									desc: '탭 배치 방향 (기본 horizontal)',
								},
								{
									component: 'TabsList',
									prop: 'variant',
									type: '"default" | "line"',
									desc: '탭 목록 스타일 (default: 배경형 / line: 밑줄형)',
								},
								{
									component: 'TabsTrigger',
									prop: 'value',
									type: 'string',
									desc: '탭을 식별하는 고유 키 (필수, TabsContent 와 매칭)',
								},
								{
									component: 'TabsTrigger',
									prop: 'disabled',
									type: 'boolean',
									desc: '탭 비활성화',
								},
								{
									component: 'TabsContent',
									prop: 'value',
									type: 'string',
									desc: '표시할 탭의 value (TabsTrigger 와 매칭, 필수)',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.component}</code>
									</td>
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
		</div>
	);
}
