import { useState } from 'react';
import {
	Button,
	ButtonGroup,
	ButtonGroupSeparator,
	ButtonGroupText,
	CodeBlock,
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
	Input,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import {
	AlignCenter,
	AlignLeft,
	AlignRight,
	Bold,
	ChevronDown,
	Copy,
	Group,
	Italic,
	Minus,
	Plus,
	Save,
	Search,
	Trash2,
	Underline,
} from 'lucide-react';

export default function ButtonGroupComponent(): React.ReactNode {
	const [align, setAlign] = useState<'left' | 'center' | 'right'>('left');
	const [period, setPeriod] = useState<string>('1M');
	const [count, setCount] = useState<number>(1);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<Group className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">ButtonGroup 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 ButtonGroup 컴포넌트 사용 예제입니다. 여러 버튼·입력을 하나의 덩어리로 붙여 배치합니다.
					</p>
				</div>
			</div>

			{/* ── import 안내 ──────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Import"
					description="모든 컴포넌트는 통합 배럴에서 가져옵니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
					<CodeBlock
						code={`import {
  Button,
  ButtonGroup,
  ButtonGroupSeparator,
  ButtonGroupText,
} from '@axiom/components/ui';`}
					/>
				</div>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="ButtonGroup 안에 Button을 나열하면 가운데 모서리와 겹치는 테두리가 자동으로 정리되어 하나의 덩어리로 붙습니다."
				/>
				<ExCard
					label="ButtonGroup + Button"
					code={`<ButtonGroup>
  <Button variant="outline">이전</Button>
  <Button variant="outline">현재</Button>
  <Button variant="outline">다음</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">이전</Button>
						<Button variant="outline">현재</Button>
						<Button variant="outline">다음</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 2. orientation ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. orientation (방향)"
					description='기본값은 "horizontal"이며, "vertical"을 주면 세로로 쌓입니다. 세로일 때는 위/아래 모서리와 테두리가 정리됩니다.'
				/>
				<ExCard
					label='orientation="horizontal" | "vertical"'
					code={`{/* 가로 (기본값) */}
<ButtonGroup>
  <Button variant="outline">복사</Button>
  <Button variant="outline">붙여넣기</Button>
  <Button variant="outline">삭제</Button>
</ButtonGroup>

{/* 세로 */}
<ButtonGroup orientation="vertical">
  <Button variant="outline">복사</Button>
  <Button variant="outline">붙여넣기</Button>
  <Button variant="outline">삭제</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">복사</Button>
						<Button variant="outline">붙여넣기</Button>
						<Button variant="outline">삭제</Button>
					</ButtonGroup>
					<ButtonGroup orientation="vertical">
						<Button variant="outline">복사</Button>
						<Button variant="outline">붙여넣기</Button>
						<Button variant="outline">삭제</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 3. variant ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Button variant 조합"
					description="ButtonGroup은 레이아웃만 담당합니다. 색은 각 Button의 variant를 그대로 씁니다. 한 그룹 안에서는 같은 variant로 통일해야 테두리가 자연스럽습니다."
				/>
				<ExCard
					label="variant별 그룹"
					code={`<ButtonGroup>
  <Button variant="outline">Outline</Button>
  <Button variant="outline">Outline</Button>
</ButtonGroup>

<ButtonGroup>
  <Button variant="secondary">Secondary</Button>
  <Button variant="secondary">Secondary</Button>
</ButtonGroup>

<ButtonGroup>
  <Button>Default</Button>
  <Button>Default</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">Outline</Button>
						<Button variant="outline">Outline</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button variant="secondary">Secondary</Button>
						<Button variant="secondary">Secondary</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button>Default</Button>
						<Button>Default</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 4. size ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. Button size"
					description="크기 역시 Button의 size prop으로 조절합니다. 그룹 안에서는 모든 버튼에 같은 size를 주세요."
				/>
				<ExCard
					label='size="xs" | "sm" | "default" | "lg"'
					code={`<ButtonGroup>
  <Button variant="outline" size="xs">XS</Button>
  <Button variant="outline" size="xs">XS</Button>
</ButtonGroup>

<ButtonGroup>
  <Button variant="outline" size="sm">SM</Button>
  <Button variant="outline" size="sm">SM</Button>
</ButtonGroup>

<ButtonGroup>
  <Button variant="outline" size="lg">LG</Button>
  <Button variant="outline" size="lg">LG</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button
							variant="outline"
							size="xs"
						>
							XS
						</Button>
						<Button
							variant="outline"
							size="xs"
						>
							XS
						</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button
							variant="outline"
							size="sm"
						>
							SM
						</Button>
						<Button
							variant="outline"
							size="sm"
						>
							SM
						</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button variant="outline">Default</Button>
						<Button variant="outline">Default</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button
							variant="outline"
							size="lg"
						>
							LG
						</Button>
						<Button
							variant="outline"
							size="lg"
						>
							LG
						</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 5. 아이콘 툴바 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 아이콘 툴바"
					description='size="icon" 계열을 쓰면 정사각형 아이콘 버튼 툴바가 됩니다. 아이콘만 있는 버튼에는 반드시 aria-label을 넣어주세요.'
				/>
				<ExCard
					label='size="icon-sm" + aria-label'
					code={`<ButtonGroup>
  <Button variant="outline" size="icon-sm" aria-label="굵게">
    <Bold />
  </Button>
  <Button variant="outline" size="icon-sm" aria-label="기울임">
    <Italic />
  </Button>
  <Button variant="outline" size="icon-sm" aria-label="밑줄">
    <Underline />
  </Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="굵게"
						>
							<Bold />
						</Button>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="기울임"
						>
							<Italic />
						</Button>
						<Button
							variant="outline"
							size="icon-sm"
							aria-label="밑줄"
						>
							<Underline />
						</Button>
					</ButtonGroup>
					<ButtonGroup>
						<Button
							variant="outline"
							size="icon"
							aria-label="복사"
						>
							<Copy />
						</Button>
						<Button
							variant="outline"
							size="icon"
							aria-label="저장"
						>
							<Save />
						</Button>
						<Button
							variant="outline"
							size="icon"
							aria-label="삭제"
						>
							<Trash2 />
						</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 6. ButtonGroupText ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. ButtonGroupText (라벨 · 단위 붙이기)"
					description="버튼이 아닌 정적인 텍스트/아이콘을 그룹에 끼워 넣을 때 씁니다. Input 앞뒤에 붙이면 접두/접미(prefix/suffix) 입력이 됩니다."
				/>
				<ExCard
					label="ButtonGroupText + Input"
					code={`{/* 접두 라벨 */}
<ButtonGroup>
  <ButtonGroupText>https://</ButtonGroupText>
  <Input placeholder="example.com" />
</ButtonGroup>

{/* 접미 단위 */}
<ButtonGroup>
  <Input placeholder="0" />
  <ButtonGroupText>원</ButtonGroupText>
</ButtonGroup>

{/* 아이콘 + 텍스트 + 버튼 */}
<ButtonGroup>
  <ButtonGroupText>
    <Search />
    검색
  </ButtonGroupText>
  <Input placeholder="키워드 입력" />
  <Button variant="outline">조회</Button>
</ButtonGroup>`}
				>
					<div className="w-full space-y-3">
						<ButtonGroup className="w-full">
							<ButtonGroupText>https://</ButtonGroupText>
							<Input placeholder="example.com" />
						</ButtonGroup>
						<ButtonGroup className="w-full">
							<Input placeholder="0" />
							<ButtonGroupText>원</ButtonGroupText>
						</ButtonGroup>
						<ButtonGroup className="w-full">
							<ButtonGroupText>
								<Search />
								검색
							</ButtonGroupText>
							<Input placeholder="키워드 입력" />
							<Button variant="outline">조회</Button>
						</ButtonGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 7. ButtonGroupSeparator ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. ButtonGroupSeparator (구분선)"
					description='테두리가 없는 variant(default·secondary 등)에서 버튼 사이 경계를 만들어 줍니다. orientation은 그룹 방향과 반대로 자동 처리되지만, 세로 그룹에서는 orientation="horizontal"을 명시합니다.'
				/>
				<ExCard
					label="ButtonGroupSeparator"
					code={`<ButtonGroup>
  <Button>저장</Button>
  <ButtonGroupSeparator />
  <Button>저장 후 계속</Button>
</ButtonGroup>

<ButtonGroup orientation="vertical">
  <Button variant="secondary">위로</Button>
  <ButtonGroupSeparator orientation="horizontal" />
  <Button variant="secondary">아래로</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button>저장</Button>
						<ButtonGroupSeparator />
						<Button>저장 후 계속</Button>
					</ButtonGroup>
					<ButtonGroup orientation="vertical">
						<Button variant="secondary">위로</Button>
						<ButtonGroupSeparator orientation="horizontal" />
						<Button variant="secondary">아래로</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 8. 중첩 그룹 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 중첩 (그룹 안의 그룹)"
					description="ButtonGroup 안에 ButtonGroup을 넣으면 각 덩어리는 붙어 있고, 덩어리 사이에는 간격(gap-2)이 자동으로 생깁니다. 툴바를 기능 단위로 묶을 때 유용합니다."
				/>
				<ExCard
					label="ButtonGroup > ButtonGroup"
					code={`<ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="icon-sm" aria-label="굵게"><Bold /></Button>
    <Button variant="outline" size="icon-sm" aria-label="기울임"><Italic /></Button>
    <Button variant="outline" size="icon-sm" aria-label="밑줄"><Underline /></Button>
  </ButtonGroup>
  <ButtonGroup>
    <Button variant="outline" size="icon-sm" aria-label="왼쪽 정렬"><AlignLeft /></Button>
    <Button variant="outline" size="icon-sm" aria-label="가운데 정렬"><AlignCenter /></Button>
    <Button variant="outline" size="icon-sm" aria-label="오른쪽 정렬"><AlignRight /></Button>
  </ButtonGroup>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<ButtonGroup>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="굵게"
							>
								<Bold />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="기울임"
							>
								<Italic />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="밑줄"
							>
								<Underline />
							</Button>
						</ButtonGroup>
						<ButtonGroup>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="왼쪽 정렬"
							>
								<AlignLeft />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="가운데 정렬"
							>
								<AlignCenter />
							</Button>
							<Button
								variant="outline"
								size="icon-sm"
								aria-label="오른쪽 정렬"
							>
								<AlignRight />
							</Button>
						</ButtonGroup>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 9. Split Button ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. Split Button (드롭다운 조합)"
					description="주 동작 버튼 + 부가 메뉴 버튼 패턴. DropdownMenu와 조합해 만듭니다."
				/>
				<ExCard
					label="ButtonGroup + DropdownMenu"
					code={`<ButtonGroup>
  <Button>저장</Button>
  <DropdownMenu>
    <DropdownMenuTrigger asChild>
      <Button size="icon" aria-label="저장 옵션 더보기">
        <ChevronDown />
      </Button>
    </DropdownMenuTrigger>
    <DropdownMenuContent align="end">
      <DropdownMenuItem>다른 이름으로 저장</DropdownMenuItem>
      <DropdownMenuItem>사본 저장</DropdownMenuItem>
      <DropdownMenuItem>템플릿으로 저장</DropdownMenuItem>
    </DropdownMenuContent>
  </DropdownMenu>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button>저장</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									size="icon"
									aria-label="저장 옵션 더보기"
								>
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>다른 이름으로 저장</DropdownMenuItem>
								<DropdownMenuItem>사본 저장</DropdownMenuItem>
								<DropdownMenuItem>템플릿으로 저장</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</ButtonGroup>
					<ButtonGroup>
						<Button variant="outline">내보내기</Button>
						<DropdownMenu>
							<DropdownMenuTrigger asChild>
								<Button
									variant="outline"
									size="icon"
									aria-label="내보내기 형식 선택"
								>
									<ChevronDown />
								</Button>
							</DropdownMenuTrigger>
							<DropdownMenuContent align="end">
								<DropdownMenuItem>CSV로 내보내기</DropdownMenuItem>
								<DropdownMenuItem>Excel로 내보내기</DropdownMenuItem>
								<DropdownMenuItem>PDF로 내보내기</DropdownMenuItem>
							</DropdownMenuContent>
						</DropdownMenu>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 10. Disabled ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="10. Disabled (부분 비활성화)"
					description="그룹 자체에는 disabled prop이 없습니다. 개별 Button에 disabled를 주세요."
				/>
				<ExCard
					label="Button disabled"
					code={`<ButtonGroup>
  <Button variant="outline">이전</Button>
  <Button variant="outline" disabled>다음</Button>
</ButtonGroup>`}
				>
					<ButtonGroup>
						<Button variant="outline">이전</Button>
						<Button
							variant="outline"
							disabled
						>
							다음
						</Button>
					</ButtonGroup>
				</ExCard>
			</section>

			{/* ── 11. 인터랙티브 예제 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="11. 인터랙티브 예제 — 세그먼트 컨트롤 / 수량 스테퍼"
					description="선택 상태를 useState로 관리해 세그먼트 컨트롤(라디오 버튼 대체)이나 수량 조절 스테퍼로 활용합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							정렬: <code className="font-mono text-violet-700 dark:text-violet-400">{align}</code>
							{' / '}기간: <code className="font-mono text-violet-700 dark:text-violet-400">{period}</code>
							{' / '}수량: <code className="font-mono text-violet-700 dark:text-violet-400">{count}</code>
						</span>
					</div>
					<div className="p-5 space-y-5">
						{/* 정렬 세그먼트 */}
						<div className="space-y-2">
							<p className="text-xs text-gray-500 dark:text-gray-400">아이콘 세그먼트 컨트롤</p>
							<ButtonGroup>
								{(
									[
										{ value: 'left', icon: <AlignLeft />, label: '왼쪽 정렬' },
										{ value: 'center', icon: <AlignCenter />, label: '가운데 정렬' },
										{ value: 'right', icon: <AlignRight />, label: '오른쪽 정렬' },
									] as const
								).map((item) => (
									<Button
										key={item.value}
										variant={align === item.value ? 'default' : 'outline'}
										size="icon"
										aria-label={item.label}
										aria-pressed={align === item.value}
										onClick={() => setAlign(item.value)}
									>
										{item.icon}
									</Button>
								))}
							</ButtonGroup>
						</div>

						{/* 기간 세그먼트 */}
						<div className="space-y-2">
							<p className="text-xs text-gray-500 dark:text-gray-400">기간 선택 세그먼트 컨트롤</p>
							<ButtonGroup>
								{['1D', '1W', '1M', '3M', '1Y'].map((p) => (
									<Button
										key={p}
										variant={period === p ? 'default' : 'outline'}
										size="sm"
										aria-pressed={period === p}
										onClick={() => setPeriod(p)}
									>
										{p}
									</Button>
								))}
							</ButtonGroup>
						</div>

						{/* 수량 스테퍼 */}
						<div className="space-y-2">
							<p className="text-xs text-gray-500 dark:text-gray-400">수량 스테퍼</p>
							<ButtonGroup>
								<Button
									variant="outline"
									size="icon"
									aria-label="수량 감소"
									disabled={count <= 1}
									onClick={() => setCount((c) => Math.max(1, c - 1))}
								>
									<Minus />
								</Button>
								<ButtonGroupText className="min-w-14 justify-center tabular-nums">{count}</ButtonGroupText>
								<Button
									variant="outline"
									size="icon"
									aria-label="수량 증가"
									onClick={() => setCount((c) => c + 1)}
								>
									<Plus />
								</Button>
							</ButtonGroup>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [period, setPeriod] = useState('1M');
const [count, setCount] = useState(1);

{/* 세그먼트 컨트롤 — 선택된 항목만 variant를 바꾼다 */}
<ButtonGroup>
  {['1D', '1W', '1M', '3M', '1Y'].map((p) => (
    <Button
      key={p}
      variant={period === p ? 'default' : 'outline'}
      size="sm"
      aria-pressed={period === p}
      onClick={() => setPeriod(p)}
    >
      {p}
    </Button>
  ))}
</ButtonGroup>

{/* 수량 스테퍼 — 가운데는 ButtonGroupText */}
<ButtonGroup>
  <Button
    variant="outline"
    size="icon"
    aria-label="수량 감소"
    disabled={count <= 1}
    onClick={() => setCount((c) => Math.max(1, c - 1))}
  >
    <Minus />
  </Button>
  <ButtonGroupText className="min-w-14 justify-center tabular-nums">
    {count}
  </ButtonGroupText>
  <Button
    variant="outline"
    size="icon"
    aria-label="수량 증가"
    onClick={() => setCount((c) => c + 1)}
  >
    <Plus />
  </Button>
</ButtonGroup>`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="ButtonGroup 계열은 레이아웃 전용입니다. 색/크기는 내부 Button의 variant·size로 제어합니다."
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
									component: 'ButtonGroup',
									prop: 'orientation',
									type: '"horizontal" | "vertical"',
									desc: '배치 방향 (기본값 "horizontal")',
								},
								{
									component: 'ButtonGroup',
									prop: 'className',
									type: 'string',
									desc: '추가 클래스. 기본은 w-fit이라 꽉 채우려면 w-full을 준다',
								},
								{
									component: 'ButtonGroup',
									prop: '...div props',
									type: "React.ComponentProps<'div'>",
									desc: 'div의 모든 속성 전달 가능 (role="group"은 내부에서 지정됨)',
								},
								{
									component: 'ButtonGroupText',
									prop: 'asChild',
									type: 'boolean',
									desc: 'true면 자식 엘리먼트에 스타일을 병합 (예: <label>로 렌더)',
								},
								{
									component: 'ButtonGroupText',
									prop: 'className',
									type: 'string',
									desc: '라벨 영역 스타일 조정 (너비·정렬 등)',
								},
								{
									component: 'ButtonGroupSeparator',
									prop: 'orientation',
									type: '"horizontal" | "vertical"',
									desc: '구분선 방향 (기본값 "vertical"). 세로 그룹에서는 "horizontal"로 지정',
								},
								{
									component: 'Button',
									prop: 'variant',
									type: '"default" | "outline" | "secondary" | "ghost" | ...',
									desc: '그룹 내 버튼 색상. 한 그룹 안에서는 통일 권장',
								},
								{
									component: 'Button',
									prop: 'size',
									type: '"xs" | "sm" | "default" | "lg" | "icon" | ...',
									desc: '그룹 내 버튼 크기. 한 그룹 안에서는 통일 권장',
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
