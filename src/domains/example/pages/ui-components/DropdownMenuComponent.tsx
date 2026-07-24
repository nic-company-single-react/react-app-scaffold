import { useState } from 'react';
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuCheckboxItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuShortcut,
	DropdownMenuSub,
	DropdownMenuSubTrigger,
	DropdownMenuSubContent,
	Button,
	CodeBlock,
} from '@axiom/components/ui';
import {
	ChevronDown,
	MousePointerClick,
	User,
	CreditCard,
	Settings,
	Keyboard,
	LogOut,
	ExternalLink,
	LifeBuoy,
	Cloud,
	Mail,
	UserPlus,
	PlusCircle,
	Sparkles,
} from 'lucide-react';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import AccountMenu from '@/domains/example/components/ui-components/dropdown-menu/AccountMenu';
import accountSource from '@/domains/example/components/ui-components/dropdown-menu/AccountMenu.tsx?raw';
import accountCss from '@/domains/example/components/ui-components/dropdown-menu/AccountMenu.module.css?raw';

export default function DropdownMenuComponent(): React.ReactNode {
	// 3. Checkbox 예제용 상태
	const [showStatusBar, setShowStatusBar] = useState(true);
	const [showActivityBar, setShowActivityBar] = useState(false);
	const [showPanel, setShowPanel] = useState(false);
	// 4. Radio 예제용 상태
	const [position, setPosition] = useState('bottom');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<MousePointerClick className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">DropdownMenu 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-indigo-300/50 bg-indigo-100/60 text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
							@axiom/components/ui
						</code>
						에서 제공하는 DropdownMenu 컴포넌트 사용 예제입니다. 버튼을 클릭하면 열리는{' '}
						<b>액션(동작) 목록</b> 메뉴입니다.
					</p>
				</div>
			</div>

			{/* ── 다른 컴포넌트와의 차이 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="언제 쓰나 — Select · Tooltip · Toast 와의 차이"
					description="네 컴포넌트 모두 '떠오르는(팝업) UI'라 헷갈리기 쉽지만, 목적과 트리거 방식이 다릅니다. DropdownMenu는 '무언가를 실행'하는 액션 목록입니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm min-w-160">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">컴포넌트</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">한 줄 목적</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">트리거</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">대표 사용처</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{
										c: 'DropdownMenu',
										accent: 'text-indigo-700 dark:text-indigo-400',
										purpose: '동작(액션) 목록을 띄워 실행 — 선택도 가능',
										trigger: '클릭',
										use: '⋯ 더보기, 계정 메뉴, 행(row) 액션',
									},
									{
										c: 'Select',
										accent: 'text-sky-700 dark:text-sky-400',
										purpose: "여러 옵션 중 하나의 '값'을 고름(폼 입력)",
										trigger: '클릭',
										use: '국가·정렬 기준·카테고리 선택',
									},
									{
										c: 'Tooltip',
										accent: 'text-teal-700 dark:text-teal-400',
										purpose: '요소에 대한 짧은 설명을 잠깐 보여줌',
										trigger: 'hover / focus',
										use: '아이콘 버튼 설명, 말줄임 원문',
									},
									{
										c: 'Toast',
										accent: 'text-amber-700 dark:text-amber-400',
										purpose: '작업 결과를 화면 모서리에 잠깐 알림',
										trigger: '코드가 호출',
										use: '저장 완료, 오류·네트워크 알림',
									},
								].map((row) => (
									<tr
										key={row.c}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5">
											<code className={`text-xs font-mono font-semibold ${row.accent}`}>{row.c}</code>
										</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.purpose}</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.trigger}</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.use}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
						한 줄 정리 — <b>실행</b>이면 DropdownMenu, <b>값 선택(폼)</b>이면 Select, <b>설명</b>이면 Tooltip,{' '}
						<b>알림</b>이면 Toast. DropdownMenu 도 CheckboxItem·RadioItem 으로 선택을 흉내 낼 수 있지만, 폼 값
						입력은 <code className="font-mono">Select</code> 가 접근성·폼 전송 면에서 더 적합합니다.
					</div>
				</div>
			</section>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="DropdownMenu(래퍼) · DropdownMenuTrigger(여는 버튼) · DropdownMenuContent(펼침 패널) · DropdownMenuItem(항목) 이 기본 4형제입니다. Trigger 에 asChild 를 주면 원하는 버튼을 그대로 트리거로 쓸 수 있습니다."
				/>
				<CodeBlock
					code={`import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@axiom/components/ui';

<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">메뉴 열기</Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent>
    <DropdownMenuItem onSelect={() => console.log('편집')}>편집</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => console.log('복제')}>복제</DropdownMenuItem>
    <DropdownMenuItem onSelect={() => console.log('삭제')}>삭제</DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					항목 클릭 처리는 <b>onSelect</b>(또는 안에 있는 요소의 onClick)로 합니다. 항목을 고르면 메뉴는 자동으로
					닫힙니다. 내부적으로 Portal 로 렌더되므로 부모의 <code className="font-mono">overflow: hidden</code> 에
					잘리지 않습니다.
				</p>
			</section>

			{/* ── 1. Basic (Label + Separator + Shortcut) ──────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — Label · Separator · Shortcut"
					description="DropdownMenuLabel(제목) · DropdownMenuSeparator(구분선) · DropdownMenuShortcut(우측 단축키 표시)로 항목을 그룹지어 정돈합니다."
				/>
				<ExCard
					label="Label + Separator + Shortcut + 아이콘"
					code={`<DropdownMenu>
  <DropdownMenuTrigger asChild>
    <Button variant="outline">
      내 계정 <ChevronDown className="ml-1 size-4" />
    </Button>
  </DropdownMenuTrigger>
  <DropdownMenuContent className="w-56">
    <DropdownMenuLabel>내 계정</DropdownMenuLabel>
    <DropdownMenuSeparator />
    <DropdownMenuItem>
      <User /> 프로필
      <DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <CreditCard /> 결제
      <DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
    </DropdownMenuItem>
    <DropdownMenuItem>
      <Settings /> 설정
      <DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
    </DropdownMenuItem>
  </DropdownMenuContent>
</DropdownMenu>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								내 계정 <ChevronDown className="ml-1 size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel>내 계정</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<User /> 프로필
								<DropdownMenuShortcut>⇧⌘P</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<CreditCard /> 결제
								<DropdownMenuShortcut>⌘B</DropdownMenuShortcut>
							</DropdownMenuItem>
							<DropdownMenuItem>
								<Settings /> 설정
								<DropdownMenuShortcut>⌘,</DropdownMenuShortcut>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ExCard>
			</section>

			{/* ── 2. Group + Disabled + Destructive ────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Group · Disabled · Destructive"
					description={
						'DropdownMenuGroup 으로 항목을 묶고, disabled 로 항목을 비활성화합니다. variant="destructive" 는 삭제 등 파괴적 동작을 빨간색으로 강조합니다.'
					}
				/>
				<ExCard
					label='disabled / variant="destructive"'
					code={`<DropdownMenuContent className="w-56">
  <DropdownMenuGroup>
    <DropdownMenuItem>
      <UserPlus /> 팀원 초대
    </DropdownMenuItem>
    <DropdownMenuItem disabled>
      <Mail /> 이메일 발송 (권한 없음)
    </DropdownMenuItem>
  </DropdownMenuGroup>
  <DropdownMenuSeparator />
  <DropdownMenuItem variant="destructive">
    <LogOut /> 계정 삭제
  </DropdownMenuItem>
</DropdownMenuContent>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								팀 설정 <ChevronDown className="ml-1 size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuLabel>팀</DropdownMenuLabel>
							<DropdownMenuSeparator />
							<DropdownMenuGroup>
								<DropdownMenuItem>
									<UserPlus /> 팀원 초대
								</DropdownMenuItem>
								<DropdownMenuItem disabled>
									<Mail /> 이메일 발송 (권한 없음)
								</DropdownMenuItem>
							</DropdownMenuGroup>
							<DropdownMenuSeparator />
							<DropdownMenuItem variant="destructive">
								<LogOut /> 계정 삭제
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ExCard>
			</section>

			{/* ── 3. CheckboxItem (제어) ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. CheckboxItem — 다중 토글 (Controlled)"
					description="DropdownMenuCheckboxItem 은 checked / onCheckedChange 로 여러 옵션을 켜고 끕니다. 보기 옵션 토글처럼 '여러 개를 동시에 켜는' 경우에 씁니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 상태:{' '}
							<code className="font-mono text-indigo-700 dark:text-indigo-400">
								{`StatusBar=${showStatusBar} · ActivityBar=${showActivityBar} · Panel=${showPanel}`}
							</code>
						</span>
					</div>
					<div className="p-5">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									보기 옵션 <ChevronDown className="ml-1 size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>표시할 영역</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuCheckboxItem
									checked={showStatusBar}
									onCheckedChange={setShowStatusBar}
								>
									상태 표시줄
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={showActivityBar}
									onCheckedChange={setShowActivityBar}
								>
									액티비티 바
								</DropdownMenuCheckboxItem>
								<DropdownMenuCheckboxItem
									checked={showPanel}
									onCheckedChange={setShowPanel}
								>
									하단 패널
								</DropdownMenuCheckboxItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [showStatusBar, setShowStatusBar] = useState(true);

<DropdownMenuCheckboxItem
  checked={showStatusBar}
  onCheckedChange={setShowStatusBar}
>
  상태 표시줄
</DropdownMenuCheckboxItem>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 4. RadioGroup (제어) ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. RadioGroup — 단일 선택 (Controlled)"
					description="DropdownMenuRadioGroup + DropdownMenuRadioItem 은 여러 항목 중 하나만 선택합니다. value / onValueChange 로 제어합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							선택된 위치: <code className="font-mono text-indigo-700 dark:text-indigo-400">{position}</code>
						</span>
					</div>
					<div className="p-5">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">
									패널 위치 <ChevronDown className="ml-1 size-4" />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent className="w-56">
								<DropdownMenuLabel>패널 위치</DropdownMenuLabel>
								<DropdownMenuSeparator />
								<DropdownMenuRadioGroup
									value={position}
									onValueChange={setPosition}
								>
									<DropdownMenuRadioItem value="top">위쪽</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="bottom">아래쪽</DropdownMenuRadioItem>
									<DropdownMenuRadioItem value="right">오른쪽</DropdownMenuRadioItem>
								</DropdownMenuRadioGroup>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [position, setPosition] = useState('bottom');

<DropdownMenuRadioGroup value={position} onValueChange={setPosition}>
  <DropdownMenuRadioItem value="top">위쪽</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="bottom">아래쪽</DropdownMenuRadioItem>
  <DropdownMenuRadioItem value="right">오른쪽</DropdownMenuRadioItem>
</DropdownMenuRadioGroup>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 5. Sub Menu (중첩) ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Sub Menu — 하위(중첩) 메뉴"
					description="DropdownMenuSub / SubTrigger / SubContent 로 항목에 마우스를 올리면 옆으로 펼쳐지는 하위 메뉴를 만듭니다."
				/>
				<ExCard
					label="DropdownMenuSub / SubTrigger / SubContent"
					code={`<DropdownMenuSub>
  <DropdownMenuSubTrigger>
    <UserPlus /> 초대하기
  </DropdownMenuSubTrigger>
  <DropdownMenuSubContent>
    <DropdownMenuItem><Mail /> 이메일</DropdownMenuItem>
    <DropdownMenuItem><PlusCircle /> 더 보기…</DropdownMenuItem>
  </DropdownMenuSubContent>
</DropdownMenuSub>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">
								더 보기 <ChevronDown className="ml-1 size-4" />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56">
							<DropdownMenuItem>
								<User /> 프로필
							</DropdownMenuItem>
							<DropdownMenuSub>
								<DropdownMenuSubTrigger>
									<UserPlus /> 초대하기
								</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuItem>
										<Mail /> 이메일
									</DropdownMenuItem>
									<DropdownMenuItem>
										<PlusCircle /> 더 보기…
									</DropdownMenuItem>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
							<DropdownMenuSeparator />
							<DropdownMenuItem>
								<ExternalLink /> GitHub
							</DropdownMenuItem>
							<DropdownMenuItem>
								<LifeBuoy /> 지원
							</DropdownMenuItem>
							<DropdownMenuItem disabled>
								<Cloud /> API (준비 중)
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ExCard>
			</section>

			{/* ── 6. 위치 정렬 (align / side) ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 위치 정렬 — align · side · sideOffset"
					description="DropdownMenuContent 의 align(start/center/end), side(top/bottom/left/right), sideOffset(간격)으로 펼쳐지는 위치를 조정합니다."
				/>
				<ExCard
					label='align="start" · align="end" · side="right"'
					code={`{/* 트리거 왼쪽 끝에 맞춰 아래로 */}
<DropdownMenuContent align="start">…</DropdownMenuContent>

{/* 트리거 오른쪽 끝에 맞춰 아래로 */}
<DropdownMenuContent align="end">…</DropdownMenuContent>

{/* 트리거 오른쪽으로 펼침 */}
<DropdownMenuContent side="right" sideOffset={8}>…</DropdownMenuContent>`}
				>
					<div className="flex flex-wrap gap-3">
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">align="start"</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="start">
								<DropdownMenuItem>항목 A</DropdownMenuItem>
								<DropdownMenuItem>항목 B</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">align="end"</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>항목 A</DropdownMenuItem>
								<DropdownMenuItem>항목 B</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>

						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button variant="outline">side="right"</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent
								side="right"
								sideOffset={8}
							>
								<DropdownMenuItem>항목 A</DropdownMenuItem>
								<DropdownMenuItem>항목 B</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</div>
				</ExCard>
			</section>

			{/* ── 7. 스타일 커스터마이징 ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 스타일 커스터마이징 — 퍼블리셔용"
					description="dropdown-menu 는 실제 SI 프로젝트에서 디자인에 맞춰 재스킨될 가능성이 높습니다. 각 파트는 className 을 받으며, 내부적으로 twMerge(cn)로 병합되므로 Tailwind 유틸리티를 넘기면 기본 클래스를 깔끔하게 덮어씁니다."
				/>
				<ExCard
					label="className 으로 Content · Item 색/모양 덮어쓰기"
					code={`{/* Content: 배경·모서리·그림자 교체 / Item: hover 색 교체 */}
<DropdownMenuContent className="w-56 rounded-2xl border-indigo-200 bg-indigo-50 dark:bg-indigo-950">
  <DropdownMenuItem className="rounded-lg focus:bg-indigo-600 focus:text-white">
    <Sparkles /> 프리미엄 시작
  </DropdownMenuItem>
  <DropdownMenuItem className="rounded-lg focus:bg-indigo-600 focus:text-white">
    <Settings /> 워크스페이스 설정
  </DropdownMenuItem>
</DropdownMenuContent>`}
				>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant="outline">커스텀 스킨</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent className="w-56 rounded-2xl border-indigo-200 bg-indigo-50 dark:border-indigo-800 dark:bg-indigo-950">
							<DropdownMenuLabel className="text-indigo-500 dark:text-indigo-300">프리미엄</DropdownMenuLabel>
							<DropdownMenuItem className="rounded-lg focus:bg-indigo-600 focus:text-white dark:focus:bg-indigo-600">
								<Sparkles /> 프리미엄 시작
							</DropdownMenuItem>
							<DropdownMenuItem className="rounded-lg focus:bg-indigo-600 focus:text-white dark:focus:bg-indigo-600">
								<Settings /> 워크스페이스 설정
							</DropdownMenuItem>
							<DropdownMenuItem className="rounded-lg focus:bg-indigo-600 focus:text-white dark:focus:bg-indigo-600">
								<Keyboard /> 단축키
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					더 크게 재스킨해야 하면(예: 그라디언트 헤더, 완전히 다른 톤) 아래 <b>실전 예제</b>처럼 co-located{' '}
					<code className="font-mono">*.module.css</code> 로 분리합니다.
				</p>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="Props 요약" />
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm min-w-160">
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
										component: 'DropdownMenu',
										prop: 'open / onOpenChange',
										type: 'boolean / (v) => void',
										desc: '열림 상태 제어(선택). 미지정 시 비제어',
									},
									{
										component: 'DropdownMenuTrigger',
										prop: 'asChild',
										type: 'boolean',
										desc: '자식 요소를 그대로 트리거로 사용(Button 등)',
									},
									{
										component: 'DropdownMenuContent',
										prop: 'align',
										type: '"start" | "center" | "end"',
										desc: '트리거 기준 가로 정렬 (기본 center)',
									},
									{
										component: 'DropdownMenuContent',
										prop: 'side / sideOffset',
										type: '"top"|"bottom"|... / number',
										desc: '펼침 방향과 트리거와의 간격(px)',
									},
									{
										component: 'DropdownMenuItem',
										prop: 'onSelect',
										type: '(e) => void',
										desc: '항목 선택 시 호출(선택 후 자동 닫힘)',
									},
									{
										component: 'DropdownMenuItem',
										prop: 'disabled',
										type: 'boolean',
										desc: '항목 비활성화',
									},
									{
										component: 'DropdownMenuItem',
										prop: 'variant',
										type: '"default" | "destructive"',
										desc: '파괴적 동작을 빨간색으로 강조',
									},
									{
										component: 'DropdownMenuItem',
										prop: 'inset',
										type: 'boolean',
										desc: '아이콘 없는 항목의 좌측 들여쓰기 정렬',
									},
									{
										component: 'DropdownMenuCheckboxItem',
										prop: 'checked / onCheckedChange',
										type: 'boolean / (v) => void',
										desc: '체크 상태(다중 토글)',
									},
									{
										component: 'DropdownMenuRadioGroup',
										prop: 'value / onValueChange',
										type: 'string / (v) => void',
										desc: '단일 선택 그룹의 선택 값',
									},
								].map((row, i) => (
									<tr
										key={i}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-indigo-700 dark:text-indigo-400">{row.component}</code>
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
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 계정 메뉴 ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 계정(프로필) 메뉴"
					description="헤더 우측에 흔히 들어가는 계정 메뉴입니다. shadcn dropdown-menu 컴포넌트를 그대로 쓰되, co-located *.module.css 로 그라디언트 헤더·라운드 항목 등 전면 재스킨했습니다. 퍼블리셔가 자사 디자인으로 바꿀 때의 실제 흐름을 보여줍니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm p-6 flex items-center justify-end">
					<AccountMenu />
				</div>

				<SourceTabs
					files={[
						{ filename: 'AccountMenu.tsx', code: accountSource, lang: 'tsx' },
						{ filename: 'AccountMenu.module.css', code: accountCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
