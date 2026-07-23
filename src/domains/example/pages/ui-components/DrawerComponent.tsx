import { useState } from 'react';
import {
	Button,
	CodeBlock,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import OrderFilterDrawer from '@/domains/example/components/ui-components/drawer/OrderFilterDrawer';
import SnapPointsDrawerDemo from '@/domains/example/components/ui-components/drawer/SnapPointsDrawerDemo';
import filterSource from '@/domains/example/components/ui-components/drawer/OrderFilterDrawer.tsx?raw';
import filterCss from '@/domains/example/components/ui-components/drawer/OrderFilterDrawer.module.css?raw';
import { PanelBottom } from 'lucide-react';

type Direction = 'top' | 'right' | 'bottom' | 'left';

const DIRECTIONS: Direction[] = ['top', 'right', 'bottom', 'left'];

/** 스타일 커스터마이징 가이드에 쓰는 슬롯 목록 */
const SLOTS: { slot: string; element: string; desc: string }[] = [
	{
		slot: 'drawer-overlay',
		element: 'DrawerOverlay',
		desc: '딤 배경. 시트의 형제 노드라 시트 하위 선택자로는 못 잡음',
	},
	{ slot: 'drawer-content', element: 'DrawerContent', desc: '시트 본체. 방향별 위치/크기/라운드가 여기 걸려 있음' },
	{ slot: 'drawer-header', element: 'DrawerHeader', desc: '제목·부제 영역 (bottom/top 방향은 기본 가운데 정렬)' },
	{ slot: 'drawer-title', element: 'DrawerTitle', desc: '제목 텍스트' },
	{ slot: 'drawer-description', element: 'DrawerDescription', desc: '부제 텍스트' },
	{ slot: 'drawer-footer', element: 'DrawerFooter', desc: '하단 버튼 영역 (기본 세로 배치, mt-auto)' },
	{ slot: 'drawer-trigger', element: 'DrawerTrigger', desc: '시트를 여는 트리거' },
	{ slot: 'drawer-close', element: 'DrawerClose', desc: '시트를 닫는 버튼' },
];

export default function DrawerComponent(): React.ReactNode {
	const [controlledOpen, setControlledOpen] = useState(false);
	const [nickname, setNickname] = useState('홍길동');
	const [draftNickname, setDraftNickname] = useState('홍길동');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20">
					<PanelBottom className="w-5 h-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drawer 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-amber-300/50 bg-amber-100/60 text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/30 dark:text-amber-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Drawer(바텀시트/사이드시트) 컴포넌트 사용 예제입니다. 내부적으로{' '}
						<code className="text-xs font-mono">vaul</code>을 사용하며, 드래그로 닫기·스냅 포인트를 지원합니다.
					</p>
				</div>
			</div>

			{/* ── 0. 구조 한눈에 보기 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 구성 요소 — 복붙용 기본 골격"
					description="Drawer는 Trigger / Content / Header(Title·Description) / Footer(Close) 조합으로 씁니다. Content는 Portal로 document.body 아래에 렌더됩니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<CodeBlock
						code={`import {
  Drawer, DrawerTrigger, DrawerContent,
  DrawerHeader, DrawerTitle, DrawerDescription,
  DrawerFooter, DrawerClose,
} from '@axiom/components/ui';

<Drawer>
  <DrawerTrigger asChild>
    <Button>열기</Button>
  </DrawerTrigger>

  <DrawerContent>          {/* Overlay + Portal 포함 (직접 안 써도 됨) */}
    <DrawerHeader>
      <DrawerTitle>제목</DrawerTitle>
      <DrawerDescription>설명</DrawerDescription>
    </DrawerHeader>

    <div className="px-4 pb-4">본문</div>

    <DrawerFooter>
      <Button>확인</Button>
      <DrawerClose asChild>
        <Button variant="outline">취소</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
					/>
				</div>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본 — 바텀시트)"
					description="direction을 지정하지 않으면 bottom이 기본값이며, 상단에 드래그 핸들이 자동으로 표시됩니다. 오버레이 클릭 / 아래로 드래그 / ESC 로 닫힙니다."
				/>
				<ExCard
					label="기본 사용"
					code={`<Drawer>
  <DrawerTrigger asChild>
    <Button variant="outline">바텀시트 열기</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>배송지 변경</DrawerTitle>
      <DrawerDescription>주문에 사용할 배송지를 선택하세요.</DrawerDescription>
    </DrawerHeader>
    <div className="px-4 pb-2 text-sm text-muted-foreground">
      본문 영역입니다.
    </div>
    <DrawerFooter>
      <Button>이 주소로 배송</Button>
      <DrawerClose asChild>
        <Button variant="outline">취소</Button>
      </DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
				>
					<Drawer>
						<DrawerTrigger asChild>
							<Button variant="outline">바텀시트 열기</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>배송지 변경</DrawerTitle>
								<DrawerDescription>주문에 사용할 배송지를 선택하세요.</DrawerDescription>
							</DrawerHeader>
							<div className="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">
								서울특별시 중구 세종대로 110, 3층 (04524)
							</div>
							<DrawerFooter>
								<Button>이 주소로 배송</Button>
								<DrawerClose asChild>
									<Button variant="outline">취소</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</ExCard>
			</section>

			{/* ── 2. direction ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. direction (열리는 방향)"
					description="direction으로 top / right / bottom / left 를 지정합니다. left·right는 데스크톱에서 max-w-sm, 모바일에서 w-3/4 가 기본입니다."
				/>
				<ExCard
					label='direction="top" | "right" | "bottom" | "left"'
					code={`<Drawer direction="right">
  <DrawerTrigger asChild>
    <Button variant="outline">right</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>right 방향</DrawerTitle>
      <DrawerDescription>오른쪽에서 슬라이드인 됩니다.</DrawerDescription>
    </DrawerHeader>
  </DrawerContent>
</Drawer>`}
				>
					{DIRECTIONS.map((d) => (
						<Drawer
							key={d}
							direction={d}
						>
							<DrawerTrigger asChild>
								<Button variant="outline">{d}</Button>
							</DrawerTrigger>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>{d} 방향 Drawer</DrawerTitle>
									<DrawerDescription>
										<code className="font-mono">direction=&quot;{d}&quot;</code> 로 열렸습니다. 같은 방향으로 드래그하면
										닫힙니다.
									</DrawerDescription>
								</DrawerHeader>
								<div className="px-4 pb-2 text-sm text-gray-600 dark:text-gray-400">
									방향에 따라 라운드 처리와 border 위치가 자동으로 바뀝니다.
								</div>
								<DrawerFooter>
									<DrawerClose asChild>
										<Button variant="outline">닫기</Button>
									</DrawerClose>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					))}
				</ExCard>
			</section>

			{/* ── 3. Controlled ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Controlled (외부 상태로 제어)"
					description="open / onOpenChange 로 열림 상태를 직접 제어합니다. 저장 후 닫기, 유효성 검사 실패 시 닫기 취소 같은 흐름에 필요합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							open: <code className="font-mono text-amber-700 dark:text-amber-400">{String(controlledOpen)}</code> /
							저장된 닉네임: <code className="font-mono text-amber-700 dark:text-amber-400">{nickname}</code>
						</span>
					</div>
					<div className="p-5 flex flex-wrap items-center gap-3">
						<Button
							onClick={() => {
								setDraftNickname(nickname);
								setControlledOpen(true);
							}}
						>
							닉네임 수정
						</Button>
						<Drawer
							open={controlledOpen}
							onOpenChange={setControlledOpen}
						>
							<DrawerContent>
								<DrawerHeader>
									<DrawerTitle>닉네임 수정</DrawerTitle>
									<DrawerDescription>2자 이상 입력해야 저장할 수 있습니다.</DrawerDescription>
								</DrawerHeader>
								<div className="px-4 pb-2">
									<input
										value={draftNickname}
										onChange={(e) => setDraftNickname(e.target.value)}
										className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:border-amber-500"
										placeholder="닉네임"
									/>
								</div>
								<DrawerFooter>
									<Button
										disabled={draftNickname.trim().length < 2}
										onClick={() => {
											setNickname(draftNickname.trim());
											setControlledOpen(false);
										}}
									>
										저장
									</Button>
									<Button
										variant="outline"
										onClick={() => setControlledOpen(false)}
									>
										취소
									</Button>
								</DrawerFooter>
							</DrawerContent>
						</Drawer>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [open, setOpen] = useState(false);
const [nickname, setNickname] = useState('홍길동');
const [draft, setDraft] = useState(nickname);

<Button onClick={() => { setDraft(nickname); setOpen(true); }}>닉네임 수정</Button>

{/* DrawerTrigger 없이 open만으로 제어 */}
<Drawer open={open} onOpenChange={setOpen}>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>닉네임 수정</DrawerTitle>
    </DrawerHeader>
    <div className="px-4 pb-2">
      <input value={draft} onChange={(e) => setDraft(e.target.value)} />
    </div>
    <DrawerFooter>
      <Button
        disabled={draft.trim().length < 2}
        onClick={() => { setNickname(draft.trim()); setOpen(false); }}
      >
        저장
      </Button>
      <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 4. snapPoints ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. snapPoints (단계별 높이)"
					description="시트를 여러 단계 높이로 멈추게 합니다. 비율(0~1) 또는 px 문자열을 배열로 넘기고, activeSnapPoint / setActiveSnapPoint 로 현재 단계를 제어할 수 있습니다."
				/>
				<ExCard
					label="snapPoints={[0.35, 0.7, 1]}"
					code={`const [snap, setSnap] = useState<number | string | null>(0.35);

<Drawer
  snapPoints={[0.35, 0.7, 1]}
  activeSnapPoint={snap}
  setActiveSnapPoint={setSnap}
>
  <DrawerTrigger asChild>
    <Button variant="outline">스냅 시트 열기</Button>
  </DrawerTrigger>
  <DrawerContent>
    <DrawerHeader>
      <DrawerTitle>지도 검색 결과</DrawerTitle>
    </DrawerHeader>
    <div className="overflow-y-auto px-4 pb-4">...긴 목록...</div>
  </DrawerContent>
</Drawer>`}
				>
					<SnapPointsDrawerDemo />
				</ExCard>
			</section>

			{/* ── 5. modal / dismissible ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. modal / dismissible (닫힘 제어)"
					description="dismissible={false} 는 오버레이 클릭·드래그·ESC 로 닫히지 않게 합니다(필수 동의처럼 반드시 선택해야 하는 경우). modal={false} 는 뒷 배경 스크롤·클릭을 허용합니다."
				/>
				<ExCard
					label="dismissible={false} / modal={false}"
					code={`{/* 반드시 버튼으로만 닫히는 시트 */}
<Drawer dismissible={false}>
  <DrawerTrigger asChild><Button variant="outline">필수 확인</Button></DrawerTrigger>
  <DrawerContent>
    <DrawerHeader><DrawerTitle>약관 확인이 필요합니다</DrawerTitle></DrawerHeader>
    <DrawerFooter>
      <DrawerClose asChild><Button>확인했습니다</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>

{/* 뒷 배경과 상호작용 가능한 비모달 시트 */}
<Drawer modal={false}>...</Drawer>`}
				>
					<Drawer dismissible={false}>
						<DrawerTrigger asChild>
							<Button variant="outline">dismissible=false</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>약관 확인이 필요합니다</DrawerTitle>
								<DrawerDescription>
									바깥 클릭·드래그·ESC로는 닫히지 않습니다. 아래 버튼으로만 닫을 수 있습니다.
								</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button>확인했습니다</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>

					<Drawer modal={false}>
						<DrawerTrigger asChild>
							<Button variant="outline">modal=false</Button>
						</DrawerTrigger>
						<DrawerContent>
							<DrawerHeader>
								<DrawerTitle>비모달 시트</DrawerTitle>
								<DrawerDescription>시트가 열린 상태에서도 뒤쪽 페이지를 스크롤·클릭할 수 있습니다.</DrawerDescription>
							</DrawerHeader>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button variant="outline">닫기</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</ExCard>
			</section>

			{/* ── 6. className 으로 크기/모양 조정 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. className 으로 크기·모양 조정"
					description="DrawerContent에 className을 주면 기본 클래스와 병합(cn)됩니다. 방향별 기본값(예: right는 sm:max-w-sm)을 덮어쓰려면 더 구체적인 유틸리티를 주면 됩니다."
				/>
				<ExCard
					label="넓은 사이드 시트 + 본문 스크롤"
					code={`<Drawer direction="right">
  <DrawerTrigger asChild><Button variant="outline">넓은 사이드 시트</Button></DrawerTrigger>
  <DrawerContent className="sm:max-w-xl">
    <DrawerHeader>
      <DrawerTitle>주문 상세</DrawerTitle>
    </DrawerHeader>
    {/* 본문만 스크롤되게 flex-1 + overflow-y-auto */}
    <div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">...</div>
    <DrawerFooter>
      <DrawerClose asChild><Button variant="outline">닫기</Button></DrawerClose>
    </DrawerFooter>
  </DrawerContent>
</Drawer>`}
				>
					<Drawer direction="right">
						<DrawerTrigger asChild>
							<Button variant="outline">넓은 사이드 시트 (sm:max-w-xl)</Button>
						</DrawerTrigger>
						<DrawerContent className="sm:max-w-xl">
							<DrawerHeader>
								<DrawerTitle>주문 상세</DrawerTitle>
								<DrawerDescription>본문만 스크롤되고 헤더/푸터는 고정됩니다.</DrawerDescription>
							</DrawerHeader>
							<div className="flex-1 overflow-y-auto px-4 pb-4 space-y-2">
								{Array.from({ length: 20 }, (_, i) => (
									<div
										key={i}
										className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
									>
										주문 항목 #{i + 1} — 수량 1개
									</div>
								))}
							</div>
							<DrawerFooter>
								<DrawerClose asChild>
									<Button variant="outline">닫기</Button>
								</DrawerClose>
							</DrawerFooter>
						</DrawerContent>
					</Drawer>
				</ExCard>
			</section>

			{/* ── 7. Props 요약 테이블 ──────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Drawer(root)는 vaul의 Drawer.Root props를 그대로 받습니다. 나머지 요소는 className을 포함한 일반 div/primitive props를 받습니다."
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
									component: 'Drawer',
									prop: 'direction',
									type: '"top" | "right" | "bottom" | "left"',
									desc: '열리는 방향 (기본 "bottom")',
								},
								{
									component: 'Drawer',
									prop: 'open / onOpenChange',
									type: 'boolean / (open: boolean) => void',
									desc: '제어 모드에서 열림 상태',
								},
								{
									component: 'Drawer',
									prop: 'defaultOpen',
									type: 'boolean',
									desc: '비제어 모드 초기 열림 여부',
								},
								{
									component: 'Drawer',
									prop: 'snapPoints',
									type: '(number | string)[]',
									desc: '단계별 높이. 비율(0~1) 또는 "300px"',
								},
								{
									component: 'Drawer',
									prop: 'activeSnapPoint / setActiveSnapPoint',
									type: 'number | string | null',
									desc: '현재 스냅 단계 제어',
								},
								{
									component: 'Drawer',
									prop: 'modal',
									type: 'boolean',
									desc: 'false면 뒷 배경 스크롤·클릭 허용 (기본 true)',
								},
								{
									component: 'Drawer',
									prop: 'dismissible',
									type: 'boolean',
									desc: 'false면 오버레이 클릭·드래그·ESC로 닫히지 않음 (기본 true)',
								},
								{
									component: 'Drawer',
									prop: 'handleOnly',
									type: 'boolean',
									desc: '드래그 핸들에서만 드래그 허용 (본문 스크롤과 충돌 방지)',
								},
								{
									component: 'Drawer',
									prop: 'shouldScaleBackground',
									type: 'boolean',
									desc: '배경 축소 연출. 배경 래퍼에 [vaul-drawer-wrapper] 속성이 필요',
								},
								{
									component: 'DrawerTrigger / DrawerClose',
									prop: 'asChild',
									type: 'boolean',
									desc: '자식 요소(Button 등)에 동작만 위임',
								},
								{
									component: '공통',
									prop: 'className',
									type: 'string',
									desc: '기본 클래스와 cn()으로 병합됨',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-amber-700 dark:text-amber-400">{row.component}</code>
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

			{/* ── 8. 퍼블리셔용 스타일 커스터마이징 가이드 ─────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="스타일 커스터마이징 가이드 (퍼블리셔용)"
					description="SI 프로젝트에서 Drawer는 디자인 교체가 잦습니다. drawer.tsx를 고치지 않고도 아래 data-slot 선택자만으로 전면 재스타일이 가능합니다."
				/>

				<div className="rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-900/15 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
					<strong className="font-bold">⚠️ 가장 중요한 함정 — Portal</strong>
					<br />
					<code className="font-mono">DrawerContent</code>는 <code className="font-mono">document.body</code> 아래로
					Portal 렌더됩니다. 따라서 페이지 래퍼(예:{' '}
					<code className="font-mono">.wrap :global([data-slot=&apos;drawer-content&apos;])</code>) 하위 선택자로는
					<strong> 절대 잡히지 않습니다.</strong> 시트 스타일은 반드시{' '}
					<code className="font-mono">&lt;DrawerContent className=&#123;styles.sheet&#125;&gt;</code> 처럼 시트 자신에게
					클래스를 걸고, 그 클래스를 기점으로 하위 슬롯을 지정하세요.
					<br />
					<br />
					오버레이(<code className="font-mono">drawer-overlay</code>)는 시트의 <em>형제</em> 노드라 시트 클래스 하위로도
					못 잡습니다. 전역 스타일에서 <code className="font-mono">[data-slot=&apos;drawer-overlay&apos;]</code>로
					잡거나 <code className="font-mono">shared/lib/shadcn/ui/drawer.tsx</code>의 DrawerOverlay를 직접 수정하세요.
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									data-slot
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">요소</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{SLOTS.map((s) => (
								<tr
									key={s.slot}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-amber-700 dark:text-amber-400">{s.slot}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{s.element}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{s.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							lang="css"
							code={`/* MySheet.module.css — 시트 자신(.sheet)을 기점으로 작성한다 */
.sheet {
  background: #fff;
  border-radius: 22px 22px 0 0;
  max-width: 520px;      /* bottom 시트를 가운데 정렬된 카드처럼 */
  margin: 0 auto;
}

/* bottom 방향에서 자동 렌더되는 드래그 핸들(첫 번째 div) */
.sheet > div:first-child { width: 44px; height: 5px; }

.sheet :global([data-slot='drawer-header']) { padding: 14px 20px; text-align: left; }
.sheet :global([data-slot='drawer-title'])  { font-size: 17px; font-weight: 800; }
.sheet :global([data-slot='drawer-footer']) { flex-direction: row; gap: 10px; }

/* 다크 모드는 앱 규칙대로 */
:global(.dark) .sheet { background: #1c1917; }`}
						/>
					</div>
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							방향 감지용 속성 — <code className="font-mono">data-[vaul-drawer-direction=...]</code>
						</span>
					</div>
					<CodeBlock
						lang="css"
						code={`/* vaul이 시트에 방향을 속성으로 노출한다. 방향별 분기 스타일에 사용. */
.sheet[data-vaul-drawer-direction='bottom'] { border-radius: 22px 22px 0 0; }
.sheet[data-vaul-drawer-direction='right']  { border-radius: 22px 0 0 22px; }

/* Tailwind로 쓸 때 */
// <DrawerContent className="data-[vaul-drawer-direction=right]:sm:max-w-xl" />`}
					/>
				</div>
			</section>

			{/* ── 9. 실전 예제 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 거래내역 필터 바텀시트"
					description="scaffold Drawer를 구조 변경 없이 그대로 쓰면서 *.module.css 의 data-slot 오버라이드만으로 앰버 톤 모바일 필터 시트로 재스타일한 예제입니다. 시트에서 고른 값은 '임시(draft)'로만 갖고 있다가 [적용]을 눌러야 반영되는, 실제 앱에서 쓰는 동작까지 구현했습니다."
				/>

				<OrderFilterDrawer />

				<SourceTabs
					files={[
						{ filename: 'OrderFilterDrawer.tsx', code: filterSource, lang: 'tsx' },
						{ filename: 'OrderFilterDrawer.module.css', code: filterCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
