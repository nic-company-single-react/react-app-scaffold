import { useState } from 'react';
import {
	Button,
	CodeBlock,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import DeleteAccountDialog from '@/domains/example/components/ui-components/dialog/DeleteAccountDialog';
import deleteSource from '@/domains/example/components/ui-components/dialog/DeleteAccountDialog.tsx?raw';
import deleteCss from '@/domains/example/components/ui-components/dialog/DeleteAccountDialog.module.css?raw';
import MemberTableDialog from '@/domains/example/components/ui-components/dialog/MemberTableDialog';
import memberTableSource from '@/domains/example/components/ui-components/dialog/MemberTableDialog.tsx?raw';
import MemberSmartTableDialog from '@/domains/example/components/ui-components/dialog/MemberSmartTableDialog';
import memberSmartTableSource from '@/domains/example/components/ui-components/dialog/MemberSmartTableDialog.tsx?raw';
import { AppWindow } from 'lucide-react';

/** 퍼블리셔 스타일 가이드에 쓰는 data-slot 목록 */
const SLOTS: { slot: string; element: string; desc: string }[] = [
	{ slot: 'dialog-overlay', element: 'DialogOverlay', desc: '딤 배경. 다이얼로그의 형제 노드라 본체 하위 선택자로는 못 잡음' },
	{ slot: 'dialog-content', element: 'DialogContent', desc: '본체(카드). 위치·크기·라운드가 여기 걸려 있음 (Portal로 body에 렌더)' },
	{ slot: 'dialog-header', element: 'DialogHeader', desc: '제목·부제 영역 (기본 세로 배치)' },
	{ slot: 'dialog-title', element: 'DialogTitle', desc: '제목 텍스트' },
	{ slot: 'dialog-description', element: 'DialogDescription', desc: '부제 텍스트' },
	{ slot: 'dialog-footer', element: 'DialogFooter', desc: '하단 버튼 영역 (기본 상단 border + muted 배경)' },
	{ slot: 'dialog-trigger', element: 'DialogTrigger', desc: '다이얼로그를 여는 트리거' },
	{ slot: 'dialog-close', element: 'DialogClose', desc: '다이얼로그를 닫는 버튼(우상단 X 포함)' },
];

export default function DialogComponent(): React.ReactNode {
	// 3. Controlled 예제 상태
	const [open, setOpen] = useState(false);
	const [nickname, setNickname] = useState('홍길동');
	const [draft, setDraft] = useState('홍길동');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<AppWindow className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dialog 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Dialog(모달) 컴포넌트 사용 예제입니다. 내부적으로{' '}
						<code className="text-xs font-mono">radix-ui</code>를 사용하며, 오버레이·포커스 트랩·ESC 닫기를 기본
						지원합니다.
					</p>
				</div>
			</div>

			{/* ── 0. 구성 요소 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 구성 요소 — 복붙용 기본 골격"
					description="Dialog는 Trigger / Content / Header(Title·Description) / Footer(Close) 조합으로 씁니다. Content는 Overlay·Portal을 내부에 포함하므로 직접 쓸 필요가 없습니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<CodeBlock
						code={`import {
  Dialog, DialogTrigger, DialogContent,
  DialogHeader, DialogTitle, DialogDescription,
  DialogFooter, DialogClose,
} from '@axiom/components/ui';

<Dialog>
  <DialogTrigger asChild>
    <Button>열기</Button>
  </DialogTrigger>

  <DialogContent>          {/* Overlay + Portal 포함, 우상단 X 자동 표시 */}
    <DialogHeader>
      <DialogTitle>제목</DialogTitle>
      <DialogDescription>설명</DialogDescription>
    </DialogHeader>

    <div className="text-sm">본문</div>

    <DialogFooter>
      <Button>확인</Button>
      <DialogClose asChild>
        <Button variant="outline">취소</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
					/>
				</div>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="가장 기본적인 형태입니다. 오버레이 클릭 / ESC / 우상단 X / 하단 버튼으로 닫힙니다."
				/>
				<ExCard
					label="기본 사용"
					code={`<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">약관 보기</Button>
  </DialogTrigger>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>서비스 이용약관</DialogTitle>
      <DialogDescription>가입 전 아래 내용을 확인해 주세요.</DialogDescription>
    </DialogHeader>
    <div className="text-sm text-muted-foreground">
      본문 영역입니다.
    </div>
    <DialogFooter>
      <DialogClose asChild>
        <Button>확인</Button>
      </DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">약관 보기</Button>
						</DialogTrigger>
						<DialogContent>
							<DialogHeader>
								<DialogTitle>서비스 이용약관</DialogTitle>
								<DialogDescription>가입 전 아래 내용을 확인해 주세요.</DialogDescription>
							</DialogHeader>
							<div className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
								본 서비스는 관련 법령을 준수하며, 회원의 개인정보를 안전하게 보호합니다. 자세한 내용은 개인정보
								처리방침을 참고하세요.
							</div>
							<DialogFooter>
								<DialogClose asChild>
									<Button>확인</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</ExCard>
			</section>

			{/* ── 2. Footer — Close 버튼 옵션 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Footer / Close 버튼 옵션"
					description="DialogFooter의 showCloseButton 을 켜면 '취소' 성격의 Close 버튼이 자동으로 추가됩니다. DialogContent의 showCloseButton={false} 로 우상단 X를 숨길 수도 있습니다."
				/>
				<ExCard
					label="DialogFooter showCloseButton / DialogContent showCloseButton={false}"
					code={`{/* 우상단 X 없이, 하단에 자동 Close 버튼만 */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">공지 확인</Button>
  </DialogTrigger>
  <DialogContent showCloseButton={false}>
    <DialogHeader>
      <DialogTitle>업데이트 안내</DialogTitle>
      <DialogDescription>새로운 기능이 추가되었습니다.</DialogDescription>
    </DialogHeader>
    <DialogFooter showCloseButton>
      <Button>지금 사용해보기</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">공지 확인</Button>
						</DialogTrigger>
						<DialogContent showCloseButton={false}>
							<DialogHeader>
								<DialogTitle>업데이트 안내</DialogTitle>
								<DialogDescription>새로운 기능이 추가되었습니다.</DialogDescription>
							</DialogHeader>
							<div className="text-sm text-gray-600 dark:text-gray-400">
								이제 대시보드에서 즐겨찾기를 바로 관리할 수 있습니다.
							</div>
							<DialogFooter showCloseButton>
								<Button>지금 사용해보기</Button>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</ExCard>
			</section>

			{/* ── 3. Controlled ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Controlled (외부 상태로 제어)"
					description="open / onOpenChange 로 열림 상태를 직접 제어합니다. 저장 성공 시 닫기, 유효성 검사 실패 시 열림 유지 같은 흐름에 필요합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							open: <code className="font-mono text-sky-700 dark:text-sky-400">{String(open)}</code> / 저장된 닉네임:{' '}
							<code className="font-mono text-sky-700 dark:text-sky-400">{nickname}</code>
						</span>
					</div>
					<div className="p-5 flex flex-wrap items-center gap-3">
						<Button
							onClick={() => {
								setDraft(nickname);
								setOpen(true);
							}}
						>
							닉네임 수정
						</Button>
						<Dialog
							open={open}
							onOpenChange={setOpen}
						>
							<DialogContent>
								<DialogHeader>
									<DialogTitle>닉네임 수정</DialogTitle>
									<DialogDescription>2자 이상 입력해야 저장할 수 있습니다.</DialogDescription>
								</DialogHeader>
								<input
									value={draft}
									onChange={(e) => setDraft(e.target.value)}
									className="w-full rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-3 py-2 text-sm outline-none focus:border-sky-500"
									placeholder="닉네임"
								/>
								<DialogFooter>
									<Button
										disabled={draft.trim().length < 2}
										onClick={() => {
											setNickname(draft.trim());
											setOpen(false);
										}}
									>
										저장
									</Button>
									<Button
										variant="outline"
										onClick={() => setOpen(false)}
									>
										취소
									</Button>
								</DialogFooter>
							</DialogContent>
						</Dialog>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [open, setOpen] = useState(false);
const [nickname, setNickname] = useState('홍길동');
const [draft, setDraft] = useState(nickname);

<Button onClick={() => { setDraft(nickname); setOpen(true); }}>닉네임 수정</Button>

{/* DialogTrigger 없이 open만으로 제어 */}
<Dialog open={open} onOpenChange={setOpen}>
  <DialogContent>
    <DialogHeader>
      <DialogTitle>닉네임 수정</DialogTitle>
    </DialogHeader>
    <input value={draft} onChange={(e) => setDraft(e.target.value)} />
    <DialogFooter>
      <Button
        disabled={draft.trim().length < 2}
        onClick={() => { setNickname(draft.trim()); setOpen(false); }}
      >
        저장
      </Button>
      <Button variant="outline" onClick={() => setOpen(false)}>취소</Button>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 4. 닫힘 제어 (modal / dismiss) ────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 닫힘 제어 — 바깥 클릭 / ESC 막기"
					description="필수 확인처럼 반드시 버튼으로만 닫아야 할 때는 onInteractOutside / onEscapeKeyDown 를 preventDefault 합니다. modal={false} 는 뒷 배경 스크롤·클릭을 허용합니다."
				/>
				<ExCard
					label="onInteractOutside / onEscapeKeyDown preventDefault"
					code={`{/* 바깥 클릭·ESC로 닫히지 않는 다이얼로그 */}
<Dialog>
  <DialogTrigger asChild>
    <Button variant="outline">필수 확인</Button>
  </DialogTrigger>
  <DialogContent
    showCloseButton={false}
    onInteractOutside={(e) => e.preventDefault()}
    onEscapeKeyDown={(e) => e.preventDefault()}
  >
    <DialogHeader>
      <DialogTitle>약관 확인이 필요합니다</DialogTitle>
    </DialogHeader>
    <DialogFooter>
      <DialogClose asChild><Button>확인했습니다</Button></DialogClose>
    </DialogFooter>
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">필수 확인 (바깥/ESC 막기)</Button>
						</DialogTrigger>
						<DialogContent
							showCloseButton={false}
							onInteractOutside={(e) => e.preventDefault()}
							onEscapeKeyDown={(e) => e.preventDefault()}
						>
							<DialogHeader>
								<DialogTitle>약관 확인이 필요합니다</DialogTitle>
								<DialogDescription>바깥 클릭·ESC로는 닫히지 않습니다. 아래 버튼으로만 닫을 수 있습니다.</DialogDescription>
							</DialogHeader>
							<DialogFooter>
								<DialogClose asChild>
									<Button>확인했습니다</Button>
								</DialogClose>
							</DialogFooter>
						</DialogContent>
					</Dialog>
				</ExCard>
			</section>

			{/* ── 5. className 으로 크기 조정 ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. className 으로 크기·모양 조정"
					description="DialogContent에 className을 주면 기본 클래스와 cn()으로 병합됩니다. 기본 폭(sm:max-w-sm)을 덮어쓰거나, 본문만 스크롤되도록 만들 수 있습니다."
				/>
				<ExCard
					label="넓은 다이얼로그 + 본문 스크롤"
					code={`<Dialog>
  <DialogTrigger asChild><Button variant="outline">주문 상세</Button></DialogTrigger>
  <DialogContent className="sm:max-w-xl">
    <DialogHeader>
      <DialogTitle>주문 상세</DialogTitle>
    </DialogHeader>
    {/* 본문만 스크롤되게 max-height + overflow-y-auto */}
    <div className="max-h-[50vh] overflow-y-auto -mx-1 px-1 space-y-2">...</div>
    <DialogFooter showCloseButton />
  </DialogContent>
</Dialog>`}
				>
					<Dialog>
						<DialogTrigger asChild>
							<Button variant="outline">주문 상세 (sm:max-w-xl)</Button>
						</DialogTrigger>
						<DialogContent className="sm:max-w-xl">
							<DialogHeader>
								<DialogTitle>주문 상세</DialogTitle>
								<DialogDescription>본문만 스크롤되고 헤더/푸터는 고정됩니다.</DialogDescription>
							</DialogHeader>
							<div className="max-h-[50vh] overflow-y-auto -mx-1 px-1 space-y-2">
								{Array.from({ length: 20 }, (_, i) => (
									<div
										key={i}
										className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
									>
										주문 항목 #{i + 1} — 수량 1개
									</div>
								))}
							</div>
							<DialogFooter showCloseButton />
						</DialogContent>
					</Dialog>
				</ExCard>
			</section>

			{/* ── 6. Props 요약 테이블 ──────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Dialog(root)는 radix Dialog.Root props를 그대로 받습니다. Content/Footer는 아래 추가 prop을 지원합니다."
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
									component: 'Dialog',
									prop: 'open / onOpenChange',
									type: 'boolean / (open: boolean) => void',
									desc: '제어 모드에서 열림 상태',
								},
								{
									component: 'Dialog',
									prop: 'defaultOpen',
									type: 'boolean',
									desc: '비제어 모드 초기 열림 여부',
								},
								{
									component: 'Dialog',
									prop: 'modal',
									type: 'boolean',
									desc: 'false면 뒷 배경 스크롤·클릭 허용 (기본 true)',
								},
								{
									component: 'DialogContent',
									prop: 'showCloseButton',
									type: 'boolean',
									desc: '우상단 X 닫기 버튼 표시 (기본 true)',
								},
								{
									component: 'DialogContent',
									prop: 'onInteractOutside',
									type: '(e: Event) => void',
									desc: 'preventDefault 시 바깥 클릭으로 닫힘 방지',
								},
								{
									component: 'DialogContent',
									prop: 'onEscapeKeyDown',
									type: '(e: KeyboardEvent) => void',
									desc: 'preventDefault 시 ESC로 닫힘 방지',
								},
								{
									component: 'DialogFooter',
									prop: 'showCloseButton',
									type: 'boolean',
									desc: '하단에 outline "Close" 버튼 자동 추가 (기본 false)',
								},
								{
									component: 'DialogTrigger / DialogClose',
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
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400">{row.component}</code>
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

			{/* ── 7. 퍼블리셔용 스타일 커스터마이징 가이드 ─────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="스타일 커스터마이징 가이드 (퍼블리셔용)"
					description="SI 프로젝트에서 Dialog는 디자인 교체가 잦습니다. dialog.tsx를 고치지 않고도 아래 data-slot 선택자만으로 전면 재스타일이 가능합니다."
				/>

				<div className="rounded-xl border border-sky-300/60 dark:border-sky-700/40 bg-sky-50/60 dark:bg-sky-900/15 px-4 py-3 text-xs leading-relaxed text-sky-900 dark:text-sky-200">
					<strong className="font-bold">⚠️ 가장 중요한 함정 — Portal</strong>
					<br />
					<code className="font-mono">DialogContent</code>는 <code className="font-mono">document.body</code> 아래로 Portal
					렌더됩니다. 따라서 페이지 래퍼 하위 선택자로는 <strong>절대 잡히지 않습니다.</strong> 다이얼로그 스타일은 반드시{' '}
					<code className="font-mono">&lt;DialogContent className=&#123;styles.sheet&#125;&gt;</code> 처럼 본체 자신에게
					클래스를 걸고, 그 클래스를 기점으로 하위 슬롯을 지정하세요.
					<br />
					<br />
					오버레이(<code className="font-mono">dialog-overlay</code>)는 본체의 <em>형제</em> 노드라 본체 클래스 하위로도 못
					잡습니다. 전역 스타일에서 <code className="font-mono">[data-slot=&apos;dialog-overlay&apos;]</code>로 잡거나{' '}
					<code className="font-mono">shared/lib/shadcn/ui/dialog.tsx</code>의 DialogOverlay를 직접 수정하세요.
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">data-slot</th>
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
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400">{s.slot}</code>
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
							code={`/* MyDialog.module.css — 본체(.sheet)를 기점으로 작성한다 */
/* .sheet :global([data-slot='...']) 는 특이도(0,2,0)가 Tailwind 유틸(0,1,0)보다
   높아, 기본 클래스를 확실히 덮어쓴다. */
.sheet {
  background: #fff;
  border-radius: 18px;
  max-width: 26rem;
  padding: 24px;
}

.sheet :global([data-slot='dialog-header'])      { align-items: center; text-align: center; }
.sheet :global([data-slot='dialog-title'])       { font-size: 18px; font-weight: 800; }
.sheet :global([data-slot='dialog-description'])  { font-size: 13px; }

/* 기본 푸터(상단 border + muted 배경 + 음수마진)를 걷어내고 가로 배치로 */
.sheet :global([data-slot='dialog-footer']) {
  margin: 0; padding: 0; border-top: none; background: transparent;
  flex-direction: row; gap: 10px;
}

/* 다크 모드는 앱 규칙대로 */
:global(.dark) .sheet { background: #1c1917; }`}
						/>
					</div>
				</div>
			</section>

			{/* ── 8. $ui.dialog() 예고 안내 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="곧 제공 예정 — $ui.dialog()"
					description="지금 이 페이지의 컴포넌트형 Dialog와 별개로, 명령형(imperative) 호출 방식도 준비 중입니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="p-5 text-sm text-gray-600 dark:text-gray-400 leading-relaxed space-y-2">
						<p>
							컴포넌트형 <code className="font-mono text-sky-700 dark:text-sky-400">&lt;Dialog&gt;</code> 는 JSX 안에 마크업을
							배치하고 상태로 여닫습니다. 반면{' '}
							<code className="font-mono text-sky-700 dark:text-sky-400">$ui.dialog()</code> 는 함수 한 번 호출로 열고{' '}
							<code className="font-mono">await</code> 로 결과를 받는 <b>명령형 API</b>가 될 예정입니다. 같은 UI지만,
							이벤트 핸들러 흐름 안에서 쓰기 편하도록 사용성을 얹은 것이라고 보면 됩니다.
						</p>
						<p className="text-xs text-gray-500 dark:text-gray-400">
							※ 아래 코드는 <b>예정 API 미리보기</b>입니다. 현재 제공되는 <code className="font-mono">$ui</code> 는{' '}
							<code className="font-mono">$ui.alert()</code> / <code className="font-mono">$ui.confirm()</code> 입니다(좌측
							메뉴 참고).
						</p>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`// (예정) 명령형 호출 — JSX 배치 없이 흐름 안에서 바로 사용
const ok = await $ui.dialog({
  title: '정말 삭제할까요?',
  description: '이 작업은 되돌릴 수 없습니다.',
  confirmText: '삭제',
  cancelText: '취소',
});
if (ok) await deleteAccount();`}
						/>
					</div>
				</div>
			</section>

			{/* ── 9. 실전 예제 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 위험 작업 확인(계정 삭제)"
					description="scaffold Dialog를 구조 변경 없이 그대로 쓰면서 *.module.css 의 data-slot 오버라이드만으로 로즈/danger 톤으로 재스타일한 예제입니다. 확인 문구를 정확히 입력해야만 삭제 버튼이 활성화되는 오폭 방지 패턴까지 구현했습니다."
				/>

				<DeleteAccountDialog />

				<SourceTabs
					files={[
						{ filename: 'DeleteAccountDialog.tsx', code: deleteSource, lang: 'tsx' },
						{ filename: 'DeleteAccountDialog.module.css', code: deleteCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 10. 실전 예제 — 테이블 row에서 Dialog 열기 (패턴 A / 기본 Table) ── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 테이블 row에서 Dialog 열기 (패턴 A)"
					description="row마다 Dialog를 만들지 마세요. DialogContent는 Portal로 body 밑에 렌더되므로 row 안에 두는 건 위치상 의미가 없고 인스턴스만 늘어납니다. 정답은 'Dialog는 테이블 바깥에 단 1개, 어떤 row를 열지는 target 상태로 넘기기'입니다. (3번 Controlled 예제의 boolean open을 '선택된 row'로 확장한 것)"
				/>

				<div className="rounded-xl border border-sky-300/60 dark:border-sky-700/40 bg-sky-50/60 dark:bg-sky-900/15 px-4 py-3 text-xs leading-relaxed text-sky-900 dark:text-sky-200">
					<strong className="font-bold">패턴 A 핵심</strong>
					<br />
					<code className="font-mono">const [target, setTarget] = useState&lt;Row | null&gt;(null)</code> — row 버튼은{' '}
					<code className="font-mono">onClick=&#123;() =&gt; setTarget(row)&#125;</code> 로 <b>누구를 열지만</b> 지정하고,
					Dialog는 <code className="font-mono">open=&#123;target !== null&#125;</code> 로 파생시켜 열고 닫을 때{' '}
					<code className="font-mono">setTarget(null)</code> 로 되돌립니다. row가 100개든 Dialog 인스턴스는 1개입니다.
				</div>

				<MemberTableDialog />

				<SourceTabs files={[{ filename: 'MemberTableDialog.tsx', code: memberTableSource, lang: 'tsx' }]} />
			</section>

			{/* ── 11. 실전 예제 — 같은 패턴, SmartTable 판 ─────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 패턴 A (SmartTable 판)"
					description="위와 완전히 동일한 패턴입니다. 테이블 구현만 SmartTable로 바뀌었을 뿐, Dialog는 여전히 바깥에 1개이고 target으로 제어합니다. 차이는 행 버튼을 SmartTable의 renderRowActions 슬롯으로 넘긴다는 것뿐 — 그 안에서 하는 일은 똑같이 setTarget(row)입니다."
				/>

				<MemberSmartTableDialog />

				<SourceTabs files={[{ filename: 'MemberSmartTableDialog.tsx', code: memberSmartTableSource, lang: 'tsx' }]} />
			</section>
		</div>
	);
}
