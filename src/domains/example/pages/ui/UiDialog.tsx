import { useState } from 'react';
import { Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import NicknameFormDialog from '@/domains/example/components/ui/dialog/NicknameFormDialog';
import MemberPickerDialog from '@/domains/example/components/ui/dialog/MemberPickerDialog';
import UploadProgressDialog from '@/domains/example/components/ui/dialog/UploadProgressDialog';
import InquiryFormDialog from '@/domains/example/components/ui/dialog/InquiryFormDialog';
import MemberAssignCard from '@/domains/example/components/ui/dialog/MemberAssignCard';
import LiveStatusCard from '@/domains/example/components/ui/dialog/LiveStatusCard';
import nicknameSource from '@/domains/example/components/ui/dialog/NicknameFormDialog.tsx?raw';
import pickerSource from '@/domains/example/components/ui/dialog/MemberPickerDialog.tsx?raw';
import progressSource from '@/domains/example/components/ui/dialog/UploadProgressDialog.tsx?raw';
import inquirySource from '@/domains/example/components/ui/dialog/InquiryFormDialog.tsx?raw';
import assignSource from '@/domains/example/components/ui/dialog/MemberAssignCard.tsx?raw';
import liveCardSource from '@/domains/example/components/ui/dialog/LiveStatusCard.tsx?raw';
import liveDialogSource from '@/domains/example/components/ui/dialog/LiveStatusDialog.tsx?raw';
import { MessageSquare } from 'lucide-react';

/** 옵션 요약 테이블 행 */
const OPTION_ROWS: { prop: string; type: string; desc: string }[] = [
	{ prop: 'component', type: 'ComponentType', desc: '본문 컴포넌트 (필수). 지연 로딩은 loadable(...) 결과를 넘긴다' },
	{ prop: 'props', type: 'P', desc: '컨텐츠에 넘길 props — 호출 시점 스냅샷. 이후 갱신은 handle.update()' },
	{ prop: 'title / description', type: 'ReactNode', desc: '헤더. 미지정 시 접근성용 sr-only 제목이 자동 삽입됨' },
	{ prop: 'size', type: "'sm'|'md'|'lg'|'xl'|'2xl'|'full'", desc: "폭 프리셋 (기본: 'md')" },
	{
		prop: 'footer',
		type: 'false | ReactNode | 객체',
		desc: '미지정이면 shell 이 확인/취소를 그림. false 면 컨텐츠가 직접',
	},
	{ prop: 'showCloseButton', type: 'boolean', desc: '우상단 X (기본: true)' },
	{ prop: 'closeOnEscape', type: 'boolean', desc: 'ESC 로 닫기 (기본: true)' },
	{ prop: 'closeOnOverlayClick', type: 'boolean', desc: '배경 클릭으로 닫기 (기본: true)' },
	{ prop: 'dismissable', type: 'boolean', desc: 'false 면 ESC · 배경 · X 를 모두 잠금 (저장 중 이탈 방지)' },
	{ prop: 'scrollable', type: 'boolean', desc: '본문에 최대 높이 + 스크롤 (기본: true)' },
	{ prop: 'autoDismiss', type: 'number', desc: 'N밀리초(ms) 후 자동 닫기' },
	{ prop: 'closeOnRouteChange', type: 'boolean', desc: '라우트(pathname) 변경 시 자동 닫기 (기본: true)' },
	{ prop: 'beforeClose', type: '(result) => boolean | Promise<boolean>', desc: '닫기 가드. false 반환 시 닫히지 않음' },
	{ prop: 'onClose', type: '(result: IDialogResult<T>) => void', desc: '닫힘 상세 콜백 (reason 포함)' },
	{ prop: 'className / overlayClassName / bodyClassName', type: 'string', desc: '본체 · 딤 배경 · 본문 래퍼 클래스' },
];

/** 컨텐츠 쪽 API 요약 */
const CONTENT_API_ROWS: { name: string; type: string; desc: string }[] = [
	{
		name: 'useLiveProps(values)',
		type: 'ILivePropsBox<P>',
		desc: '바탕 페이지 본문에서 값을 감싼다. props 자리에 넣으면 열려 있는 동안 계속 따라간다',
	},
	{ name: 'useDialog<T>()', type: 'IDialogApiHandle<T>', desc: '컨텐츠 안에서 제어 API 획득 (밖이면 throw)' },
	{ name: 'useDialogSafe<T>()', type: 'IDialogApiHandle<T> | null', desc: '다이얼로그 안/밖 겸용 컴포넌트용' },
	{
		name: 'useDialogSubmit<T>(fn)',
		type: '() => T | undefined',
		desc: "shell '확인' 처리. undefined 반환 시 닫지 않음",
	},
	{ name: 'useDialogGuard<T>(fn)', type: '(result) => boolean', desc: '닫기 가드. false 반환 시 닫히지 않음' },
	{ name: 'dialog.close(data)', type: '(data?: T) => void', desc: "결과와 함께 닫기 (reason 'submit')" },
	{ name: 'dialog.cancel()', type: '() => void', desc: "취소로 닫기 (reason 'cancel')" },
	{ name: 'dialog.setConfirmDisabled(b)', type: '(b: boolean) => void', desc: "shell '확인' 버튼 비활성" },
	{ name: 'dialog.setLoading(b)', type: '(b: boolean) => void', desc: 'shell footer 로딩 표시' },
	{ name: 'dialog.setDismissable(b)', type: '(b: boolean) => void', desc: 'ESC · 배경 · X 잠금/해제' },
	{ name: 'defineDialog<P, T>(C)', type: 'TDialogComponent<P, T>', desc: '결과 타입 각인 + dialog prop 주입' },
];

export default function UiDialog(): React.ReactNode {
	// await 결과를 화면에 보여주기 위한 상태
	const [lastResult, setLastResult] = useState<string>('');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 ─────────────────────────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<MessageSquare className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">$ui.dialog</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						임의의 React 컴포넌트를 모달로 띄우고 결과를 <code className="font-mono">await</code> 로 받는 명령형 API
						입니다.
					</p>
				</div>
			</div>

			{/* ── 무엇이 좋아지는가 ────────────────────────────────── */}
			<div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 space-y-2">
				<p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
					💡 컴포넌트형 <code className="font-mono">&lt;Dialog&gt;</code> 와 같은 UI, 다른 사용법
				</p>
				<ul className="text-xs text-indigo-800/90 dark:text-indigo-300/80 space-y-1 list-disc pl-4">
					<li>
						<code className="font-mono">open</code> state · <code className="font-mono">onOpenChange</code> 리셋 ·{' '}
						<code className="font-mono">{'{target && ...}'}</code> 가드가 필요 없습니다.
					</li>
					<li>
						결과를 콜백 prop 으로 역방향 배선하지 않고 <code className="font-mono">await</code> 반환값으로 받습니다.
					</li>
					<li>
						JSX 배치가 없으므로 목록의 행에서 열 때 <b>상태를 부모로 호이스팅할 필요가 없습니다.</b>
					</li>
					<li>
						취소 · ESC · X · 배경 클릭은 모두 <code className="font-mono">undefined</code> 로 resolve 됩니다.
					</li>
				</ul>
				<p className="text-xs text-indigo-800/80 dark:text-indigo-300/70">
					단순 알림/확인은 여전히 <code className="font-mono">$ui.alert</code> /{' '}
					<code className="font-mono">$ui.confirm</code> 이 더 짧습니다. <code className="font-mono">$ui.dialog</code>{' '}
					는<b> 본문이 커스텀 컴포넌트일 때</b> 씁니다.
				</p>
			</div>

			{/* ── 0. 호출 방법 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 호출 방법"
					description="import 없이 전역 $ui.dialog 를 호출합니다. 반환값은 진짜 Promise 이면서 update / close 같은 제어 메서드를 함께 갖는 핸들입니다."
				/>
				<CodeBlock
					code={`// (1) 기본 — shell 이 확인/취소를 그리고, 컨텐츠는 본문만 담당
const nickname = await $ui.dialog({
  component: NicknameFormDialog,
  props: { initial: '홍길동' },
  title: '닉네임 수정',
  footer: { confirmText: '저장' },
});
if (nickname) save(nickname);   // 취소/ESC/X/배경 = undefined

// (2) 컨텐츠가 직접 닫기
const member = await $ui.dialog({
  component: MemberPickerDialog,
  footer: false,
  size: 'lg',
});

// (3) 지연 로딩 — 모듈 최상단에서 loadable 로 감싼다
const HeavyEditor = loadable(() => import('./HeavyEditor'));
await $ui.dialog({ component: HeavyEditor, props: { docId }, size: 'full' });

// (4) 핸들로 제어
const d = $ui.dialog({ component: UploadProgressDialog, props: { percent: 0 } });
d.update({ percent: 50 });
d.close();
await d;`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					⚠️ <code className="font-mono">component</code> 에 <code className="font-mono">{'() => import(...)'}</code>{' '}
					썽크를 직접 넘기면 안 됩니다. 함수 컴포넌트와 런타임에 구분할 수 없기 때문에, 코드분할은{' '}
					<code className="font-mono">loadable(...)</code> (또는 <code className="font-mono">React.lazy</code>) 로 감싼
					결과를 넘깁니다.
				</p>
			</section>

			{/* ── 1. shell footer (기본) ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 기본 — shell 이 확인/취소를 그린다"
					description="컨텐츠는 본문만 그리고, '확인을 눌렀을 때 무엇을 결과로 돌려줄지'만 useDialogSubmit 으로 등록합니다. 핸들러가 undefined 를 반환하면 닫히지 않습니다(검증 실패)."
				/>
				<ExCard
					label="footer 기본값 + useDialogSubmit"
					code={`const nickname = await $ui.dialog({
  component: NicknameFormDialog,
  props: { initial: '홍길동' },
  title: '닉네임 수정',
  description: '2자 이상 입력해야 저장할 수 있습니다.',
  footer: { confirmText: '저장' },
});
setLastResult(nickname ?? '(취소)');

// NicknameFormDialog 내부
useDialogSubmit<string>(() => {
  if (tooShort) return undefined; // 닫지 않음
  return draft.trim();            // 이 값이 await 결과
});`}
				>
					<Button
						type="button"
						onClick={async () => {
							const nickname = await $ui.dialog({
								component: NicknameFormDialog,
								props: { initial: '홍길동' },
								title: '닉네임 수정',
								description: '2자 이상 입력해야 저장할 수 있습니다.',
								footer: { confirmText: '저장' },
							});
							setLastResult(nickname ?? '(취소)');
						}}
					>
						닉네임 수정 열기
					</Button>
					{lastResult && (
						<span className="text-xs text-gray-600 dark:text-gray-400">
							결과 → <code className="font-mono text-indigo-700 dark:text-indigo-400">{lastResult}</code>
						</span>
					)}
				</ExCard>
			</section>

			{/* ── 2. headless ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. footer: false — 컨텐츠가 직접 닫는다"
					description="shell 이 버튼을 그리지 않습니다. 컨텐츠에서 useDialog() 로 얻은 dialog.close(값) 을 호출하면 그 값이 await 결과가 됩니다."
				/>
				<ExCard
					label="footer: false + dialog.close(value)"
					code={`const member = await $ui.dialog({
  component: MemberPickerDialog,
  title: '회원 선택',
  size: 'lg',
  footer: false,
});

// MemberPickerDialog 내부 (defineDialog 로 dialog prop 을 주입받는다)
<Button onClick={() => dialog.close(member)}>선택</Button>`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={async () => {
							const member = await $ui.dialog({
								component: MemberPickerDialog,
								title: '회원 선택',
								size: 'lg',
								footer: false,
							});
							setLastResult(member ? `${member.name} (#${member.id})` : '(취소)');
						}}
					>
						회원 선택 열기
					</Button>
				</ExCard>
			</section>

			{/* ── 3. 중첩 ──────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 중첩 — dialog 위 dialog, 그 위 confirm"
					description="dialog 는 스택이라 여러 겹으로 열립니다. z-index 티어가 분리되어 있어 $ui.alert / $ui.confirm 은 항상 최상단에 뜹니다. ESC 는 최상단 하나만 닫습니다."
				/>
				<ExCard
					label="dialog 안에서 다시 $ui.dialog / $ui.confirm"
					code={`// 1단계
const member = await $ui.dialog({
  component: MemberPickerDialog,
  title: '1단계 — 회원 선택',
  size: 'lg',
  footer: false,
});
if (!member) return;

// 2단계 (1단계가 닫힌 뒤 이어서). 중첩으로 열려면 컨텐츠 안에서 호출하면 된다.
const ok = await $ui.confirm({
  type: 'warning',
  message: \`\${member.name} 님으로 확정할까요?\`,
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={async () => {
							// 바깥 dialog 를 열어둔 채 그 위에 confirm 을 띄워 z-index 티어를 눈으로 확인한다.
							const handle = $ui.dialog({
								component: MemberPickerDialog,
								title: '중첩 확인용 — 열어둔 채로 아래 confirm 이 뜹니다',
								size: 'lg',
								footer: false,
								closeOnEscape: true,
							});
							const ok = await $ui.confirm({
								type: 'info',
								title: '중첩 테스트',
								message: '이 확인창이 뒤의 다이얼로그보다 위에 보이나요? ESC 는 이 창만 닫습니다.',
							});
							setLastResult(ok ? 'confirm=true (dialog 는 그대로 열려 있음)' : 'confirm=false');
							void handle;
						}}
					>
						dialog 위에 confirm 띄우기
					</Button>
				</ExCard>
			</section>

			{/* ── 4. props 갱신 ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. handle.update() — 열려 있는 dialog 의 props 갱신"
					description="명령형 호출이라 props 는 호출 시점 스냅샷입니다. 진행률처럼 바깥에서 계속 밀어넣어야 하는 값은 반환 핸들의 update() 로 갱신합니다. 서버에서 오는 실시간 값이라면 컨텐츠가 react-query/zustand 를 직접 구독하는 편이 낫습니다(호스트가 QueryProvider 안쪽이라 그대로 동작합니다)."
				/>
				<ExCard
					label="handle.update(partialProps)"
					code={`const d = $ui.dialog({
  component: UploadProgressDialog,
  props: { percent: 0, filename: '2026-1분기_정산.xlsx' },
  title: '업로드 중',
  footer: false,
  dismissable: false,        // ESC · 배경 · X 잠금
  showCloseButton: false,
  closeOnRouteChange: false,
});

for (let p = 20; p <= 100; p += 20) {
  await sleep(400);
  d.update({ percent: p });
}
d.close();
await d;`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={async () => {
							const d = $ui.dialog({
								component: UploadProgressDialog,
								props: { percent: 0, filename: '2026-1분기_정산.xlsx' },
								title: '업로드 중',
								footer: false,
								dismissable: false,
								showCloseButton: false,
								closeOnRouteChange: false,
							});
							for (let p = 20; p <= 100; p += 20) {
								await new Promise((resolve) => setTimeout(resolve, 400));
								d.update({ percent: p });
							}
							await new Promise((resolve) => setTimeout(resolve, 300));
							d.close();
							await d;
							await $ui.alert({ type: 'success', message: '업로드가 완료되었습니다.', autoDismiss: 1400 });
						}}
					>
						진행률 다이얼로그 열기
					</Button>
				</ExCard>
			</section>

			{/* ── 4-1. useLiveProps — 살아있는 props ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4-1. useLiveProps — 열려 있는 동안 계속 따라가는 props"
					description="$ui.dialog 는 명령형 호출이라 props 가 열린 시점 값으로 굳습니다. 바탕 페이지의 state 가 다이얼로그에 실시간으로 보여야 한다면, 그 값들을 useLiveProps 로 감싸서 props 자리에 넘깁니다. 여는 방법은 그대로 $ui.dialog 이고, 달라지는 것은 props 에 무엇을 넣느냐 하나뿐입니다."
				/>

				<div className="rounded-2xl border border-emerald-200 dark:border-emerald-900/60 bg-emerald-50/60 dark:bg-emerald-950/20 p-4 space-y-2">
					<p className="text-sm font-semibold text-emerald-900 dark:text-emerald-200">
						✅ 다이얼로그 컨텐츠는 <b>평범한 컴포넌트</b> 그대로입니다
					</p>
					<ul className="text-xs text-emerald-800/90 dark:text-emerald-300/80 space-y-1 list-disc pl-4">
						<li>
							<code className="font-mono">defineDialog</code> 도 <code className="font-mono">useDialog</code> 도 필요
							없습니다. props 를 받아 그리기만 하면 됩니다.
						</li>
						<li>
							컨텐츠는 <code className="font-mono">useLiveProps</code> 의 존재조차 모릅니다. 셸이 풀어서 평범한 props 로
							내려줍니다.
						</li>
						<li>동기화 effect 도, 반복 호출하는 update() 도 없습니다.</li>
					</ul>
					<p className="text-xs text-emerald-800/80 dark:text-emerald-300/70">
						⚠️ 딱 하나의 규칙 — 컨텐츠가 props 를 <code className="font-mono">useState(props.x)</code> 로{' '}
						<b>복사하면 안 됩니다.</b> React 초기값은 마운트 때 한 번만 쓰이므로 갱신이 화면에 보이지 않습니다. 값을
						그대로 렌더하거나 파생시켜 쓰세요.
					</p>
				</div>

				<ExCard
					label="useLiveProps — 값만 감싸서 props 자리에 넘긴다"
					code={`// 1) 컨텐츠는 평범한 컴포넌트
export default function LiveStatusDialog({ elapsed, now, queue }: ILiveStatusDialogProps) {
  return <p>{now} / {elapsed}초 / {queue}건</p>;   // props 를 그대로 렌더
}

// 2) 바탕 페이지 — 평범한 useState
const [elapsed, setElapsed] = useState(0);
useEffect(() => {
  const t = setInterval(() => setElapsed((n) => n + 1), 1000);
  return () => clearInterval(t);
}, []);

const live = useLiveProps({ elapsed, now, queue });   // ← 이 한 줄이 전부

// 3) 여는 방법은 평소와 똑같다
<Button onClick={() => $ui.dialog({
  component: LiveStatusDialog,
  props: live,
  title: '실시간 처리 현황',
  footer: false,
})}>다이얼로그로 보기</Button>`}
				>
					<LiveStatusCard />
				</ExCard>

				<div className="rounded-xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-900/40 px-4 py-3 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
					<strong className="font-bold text-gray-800 dark:text-gray-200">왜 훅이 한 줄 필요한가</strong>
					<br />
					React 는 컴포넌트 바깥에 &ldquo;이 <code className="font-mono">useState</code> 가 바뀌었다&rdquo;를 알려주는
					수단이 없습니다. 클릭 시점에 <code className="font-mono">props: elapsed</code> 로 건네지는 것은 그저 숫자라서,
					나중에 값이 바뀌어도 되짚어 갈 실마리가 없습니다. 그래서 값을 계속 흘려보내려면{' '}
					<b>페이지의 렌더에 올라탄 코드</b>가 한 줄 있어야 하고, 그게 <code className="font-mono">useLiveProps</code>{' '}
					입니다. 스토어·구독·정리는 전부 내부에 숨어 있습니다.
				</div>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">언제</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">무엇을</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							<tr>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									열 때의 값이면 충분하다 <b>(대부분)</b>
								</td>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-blue-700 dark:text-blue-400">$ui.dialog(...)</code>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									열려 있는 동안 바깥 값이 계속 바뀌고 화면에 보여야 한다
								</td>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-blue-700 dark:text-blue-400">props: useLiveProps(...)</code>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									async 흐름 안에서 몇 번만 밀어넣는다 (진행률 등)
								</td>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-blue-700 dark:text-blue-400">handle.update(...)</code>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">서버 데이터가 원본이다</td>
								<td className="px-4 py-2.5">
									<span className="text-xs text-gray-600 dark:text-gray-400">
										id 만 props 로 넘기고 컨텐츠가 <code className="font-mono">useApi</code> 로 직접 구독
									</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="rounded-xl border border-amber-300/60 dark:border-amber-700/40 bg-amber-50/60 dark:bg-amber-900/15 px-4 py-3 text-xs leading-relaxed text-amber-900 dark:text-amber-200">
					<strong className="font-bold">참고 — 모달이 열려 있으면 바탕 페이지는 클릭할 수 없습니다</strong>
					<br />
					Radix 가 바깥 전체를 <code className="font-mono">aria-hidden</code> + 오버레이로 막기 때문입니다(모달의 정상
					동작). 그래서 바탕 state 변경은 <b>타이머 · 구독 · API 응답</b> 같은 비동기 경로로 들어옵니다. 위 예제도
					1초짜리 <code className="font-mono">setInterval</code> 로 값이 바뀝니다.
				</div>
			</section>

			{/* ── 5. beforeClose ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 닫기 가드 — 작성 중이면 한 번 더 묻기"
					description="컨텐츠가 자기 dirty 상태를 알고 있으므로 가드도 컨텐츠가 등록합니다(useDialogGuard). 호출부에서 옵션 beforeClose 로 줄 수도 있으며, 컨텐츠 등록이 우선합니다. 라우트 변경과 코드 닫기(handle.close)는 가드를 우회합니다."
				/>
				<ExCard
					label="useDialogGuard + $ui.confirm"
					code={`// InquiryFormDialog 내부
useDialogGuard<IInquiry>(async (result) => {
  if (!dirty || result.reason === 'submit') return true;
  return $ui.confirm({
    type: 'warning',
    message: '작성 중인 내용이 사라집니다. 닫을까요?',
  });
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={async () => {
							const inquiry = await $ui.dialog({
								component: InquiryFormDialog,
								props: { defaultSubject: '' },
								title: '문의 작성',
								footer: { confirmText: '보내기' },
							});
							setLastResult(inquiry ? `문의 접수: ${inquiry.subject}` : '(취소)');
						}}
					>
						문의 작성 열기
					</Button>
				</ExCard>
			</section>

			{/* ── 6. 옵션 요약 ─────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="6. 옵션 요약" />
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">옵션</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{OPTION_ROWS.map((row) => (
								<tr
									key={row.prop}
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
			</section>

			{/* ── 7. 컨텐츠 쪽 API ─────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="7. 컨텐츠 쪽 API"
					description="다이얼로그 본문 컴포넌트에서 쓰는 훅·헬퍼입니다. 전부 @/core/ui 한 곳에서 가져옵니다."
				/>
				<CodeBlock
					code={`import { defineDialog, useDialog, useDialogSubmit, useDialogGuard } from '@/core/ui';
import type { IDialogInjected } from '@/types/components';

export interface IMemberPickerProps { deptId: number }

function MemberPicker({ deptId, dialog }: IMemberPickerProps & IDialogInjected<IMember>) {
  return <Button onClick={() => dialog.close(member)}>선택</Button>;
}

// P(props)와 T(결과 타입)를 한 번만 선언하면 호출부에서 둘 다 추론된다.
export default defineDialog<IMemberPickerProps, IMember>(MemberPicker);`}
					lang="tsx"
					theme="github-dark"
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">API</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{CONTENT_API_ROWS.map((row) => (
								<tr
									key={row.name}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.name}</code>
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

			{/* ── 8. 주의사항 ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 알아둘 제약"
					description="다이얼로그 컨텐츠는 라우터 트리 바깥에서 렌더됩니다. 대부분의 라우터 훅은 브리지로 동작하지만 일부는 예외입니다."
				/>
				<div className="rounded-2xl border border-amber-200 dark:border-amber-900/60 bg-amber-50/60 dark:bg-amber-950/20 p-4 space-y-2">
					<p className="text-sm font-semibold text-amber-900 dark:text-amber-200">라우터 훅</p>
					<ul className="text-xs text-amber-800/90 dark:text-amber-300/80 space-y-1 list-disc pl-4">
						<li>
							✅ 동작: <code className="font-mono">useLocation</code>, <code className="font-mono">useNavigate</code>,{' '}
							<code className="font-mono">useSearchParams</code>, <code className="font-mono">useHref</code>,{' '}
							<code className="font-mono">&lt;Link&gt;</code>, <code className="font-mono">&lt;NavLink&gt;</code>
						</li>
						<li>
							❌ 미동작: <code className="font-mono">useParams</code> (항상 <code className="font-mono">{'{}'}</code> →{' '}
							<code className="font-mono">$router.getParams()</code> 로 대체)
						</li>
						<li>
							❌ 미동작: 데이터라우터 전용 — <code className="font-mono">useLoaderData</code>,{' '}
							<code className="font-mono">useNavigation</code>, <code className="font-mono">useBlocker</code>,{' '}
							<code className="font-mono">useFetcher</code>, <code className="font-mono">&lt;Form&gt;</code>
						</li>
					</ul>
					<p className="text-xs text-amber-800/80 dark:text-amber-300/70">
						react-query · 테마 · Tooltip 컨텍스트는 정상 동작합니다. 그래서{' '}
						<b>데이터 객체 대신 id 만 props 로 넘기고</b> 컨텐츠 안에서 <code className="font-mono">useApi</code> 로
						조회하는 방식이 권장됩니다 — 스냅샷 문제가 구조적으로 사라집니다.
					</p>
				</div>
			</section>

			{/* ── 실전 예제 ────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="실전 예제 — 담당자 지정"
					description="목록에서 하나를 고르는 전형적인 패턴입니다. 컴포넌트형 Dialog 로 만들면 필요한 open state · JSX 배치 · onSelect 콜백 prop · 닫힘 리셋이 전부 사라지고, 이벤트 핸들러에서 await 한 줄로 끝납니다."
				/>

				<MemberAssignCard />

				<SourceTabs
					files={[
						{ filename: 'MemberAssignCard.tsx', code: assignSource, lang: 'tsx' },
						{ filename: 'MemberPickerDialog.tsx', code: pickerSource, lang: 'tsx' },
						{ filename: 'LiveStatusCard.tsx', code: liveCardSource, lang: 'tsx' },
						{ filename: 'LiveStatusDialog.tsx', code: liveDialogSource, lang: 'tsx' },
						{ filename: 'NicknameFormDialog.tsx', code: nicknameSource, lang: 'tsx' },
						{ filename: 'UploadProgressDialog.tsx', code: progressSource, lang: 'tsx' },
						{ filename: 'InquiryFormDialog.tsx', code: inquirySource, lang: 'tsx' },
					]}
				/>
			</section>
		</div>
	);
}
