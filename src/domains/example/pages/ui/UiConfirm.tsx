import { useState } from 'react';
import { Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import DeleteConfirmCard from '@/domains/example/components/ui/confirm/DeleteConfirmCard';
import deleteConfirmSource from '@/domains/example/components/ui/confirm/DeleteConfirmCard.tsx?raw';
import { MessageSquareText } from 'lucide-react';

export default function UiConfirm(): React.ReactNode {
	// await 분기 예제에서 사용자의 선택 결과를 표시하기 위한 상태
	const [choice, setChoice] = useState<string>('');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
					<MessageSquareText className="w-5 h-5 text-indigo-600 dark:text-indigo-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">$ui.confirm</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						전역{' '}
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-indigo-300/50 bg-indigo-100/60 text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
							window.$ui
						</code>
						가 제공하는 확인/취소 다이얼로그 API 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 주의: alert 와의 차이 ────────────────────────────── */}
			<div className="rounded-2xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50/60 dark:bg-indigo-950/30 p-4 space-y-2">
				<p className="text-sm font-semibold text-indigo-900 dark:text-indigo-200">
					💡 <code className="font-mono">$ui.confirm()</code> 는 <code className="font-mono">Promise&lt;boolean&gt;</code>{' '}
					을 반환합니다.
				</p>
				<ul className="text-xs text-indigo-800/90 dark:text-indigo-300/80 space-y-1 list-disc pl-4">
					<li>
						<b>확인</b> 버튼 → <code className="font-mono">true</code>
					</li>
					<li>
						<b>취소 · X · ESC · autoDismiss</b> → <code className="font-mono">false</code>
					</li>
				</ul>
				<p className="text-xs text-indigo-800/80 dark:text-indigo-300/70">
					<code className="font-mono">$ui.alert</code>(단순 알림, <code className="font-mono">Promise&lt;void&gt;</code>)의
					옵션을 모두 포함하고, 취소 버튼 문구(<code className="font-mono">cancelText</code>)가 추가됩니다.
				</p>
			</div>

			{/* ── 0. 호출 방법 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 호출 방법"
					description="import 없이 전역 $ui.confirm 을 호출합니다. 반환값(boolean)을 await 로 받아 분기하는 것이 기본 패턴입니다."
				/>
				<CodeBlock
					code={`// (1) 문자열 한 줄
const ok = await $ui.confirm('정말 진행할까요?');

// (2) 옵션 객체 + 분기
if (await $ui.confirm({ type: 'warning', message: '변경 내용을 저장할까요?' })) {
  save();
}

// (3) 메시지 + 옵션
const ok2 = await $ui.confirm('삭제할까요?', {
  type: 'error',
  confirmText: '삭제',
  cancelText: '취소',
});`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					첫 인자는 <b>문자열</b> 또는 <b>옵션 객체</b>로 오버로드됩니다. 확인 시 <b>true</b>, 그 외의 모든 닫힘(취소/X/ESC)
					은 <b>false</b> 로 resolve 됩니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 확인/취소"
					description="문자열만 넘기면 확인·취소 두 버튼이 있는 기본 확인창이 뜹니다."
				/>
				<ExCard
					label="await $ui.confirm(message)"
					code={`<Button onClick={async () => {
  const ok = await $ui.confirm('정말 진행할까요?');
  setChoice(ok ? '확인' : '취소');
}}>
  기본 확인창
</Button>`}
				>
					<div className="flex flex-wrap items-center gap-3">
						<Button
							type="button"
							onClick={async () => {
								const ok = await $ui.confirm('정말 진행할까요?');
								setChoice(ok ? '확인(true)' : '취소(false)');
							}}
						>
							기본 확인창 열기
						</Button>
						{choice && (
							<span className="text-xs text-gray-600 dark:text-gray-400">
								결과 → <code className="font-mono text-indigo-700 dark:text-indigo-400">{choice}</code>
							</span>
						)}
					</div>
				</ExCard>
			</section>

			{/* ── 2. confirmText / cancelText ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. confirmText / cancelText — 버튼 문구"
					description="확인·취소 버튼의 문구를 각각 지정합니다(기본: '확인' / '취소')."
				/>
				<ExCard
					label="confirmText · cancelText"
					code={`await $ui.confirm({
  type: 'warning',
  title: '로그아웃',
  message: '지금 로그아웃할까요?',
  confirmText: '로그아웃',
  cancelText: '계속 사용',
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							void $ui.confirm({
								type: 'warning',
								title: '로그아웃',
								message: '지금 로그아웃할까요?',
								confirmText: '로그아웃',
								cancelText: '계속 사용',
							})
						}
					>
						버튼 문구 지정
					</Button>
				</ExCard>
			</section>

			{/* ── 3. type ──────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. type — 위험한 작업 강조"
					description="alert 와 동일하게 type 으로 아이콘·색상을 지정합니다. 되돌릴 수 없는 작업은 error/warning 으로 시각적 경고를 줍니다."
				/>
				<ExCard
					label="type: 'error' | 'warning'"
					code={`await $ui.confirm({
  type: 'error',
  title: '계정 삭제',
  message: '계정을 영구 삭제합니다. 계속할까요?',
  confirmText: '영구 삭제',
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							void $ui.confirm({
								type: 'error',
								title: '계정 삭제',
								message: '계정을 영구 삭제합니다. 계속할까요?',
								confirmText: '영구 삭제',
							})
						}
					>
						위험 작업 확인
					</Button>
				</ExCard>
			</section>

			{/* ── 4. await 분기 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. await — 결과로 분기하기"
					description="반환된 boolean 으로 확인/취소 흐름을 나눕니다. 확인 후 후속 알림(alert)을 이어 붙이는 것도 자연스럽습니다."
				/>
				<ExCard
					label="if (await $ui.confirm(...)) { ... }"
					code={`const ok = await $ui.confirm({
  type: 'warning',
  message: '변경 내용을 저장할까요?',
  confirmText: '저장',
});
if (ok) {
  await $ui.alert({ type: 'success', message: '저장되었습니다.', autoDismiss: 1400 });
} else {
  await $ui.alert('저장을 취소했습니다.');
}`}
				>
					<Button
						type="button"
						onClick={async () => {
							const ok = await $ui.confirm({
								type: 'warning',
								message: '변경 내용을 저장할까요?',
								confirmText: '저장',
							});
							if (ok) {
								await $ui.alert({ type: 'success', message: '저장되었습니다.', autoDismiss: 1400 });
							} else {
								await $ui.alert('저장을 취소했습니다.');
							}
						}}
					>
						저장 확인 → 결과 알림
					</Button>
				</ExCard>
			</section>

			{/* ── 옵션 요약 테이블 ─────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="옵션 요약 (IConfirmDialogOption)" />
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
							{[
								{ prop: 'confirmText', type: 'string', desc: "확인 버튼 문구 (기본: '확인')" },
								{ prop: 'cancelText', type: 'string', desc: "취소 버튼 문구 (기본: '취소') — confirm 전용" },
								{ prop: 'type', type: "'success' | 'info' | 'warning' | 'error'", desc: '아이콘·색상·기본 제목' },
								{ prop: 'title', type: 'string', desc: '제목 (기본: type별 기본 제목)' },
								{ prop: 'message', type: 'string', desc: '본문 (옵션 객체로 넘길 때)' },
								{ prop: 'close', type: 'boolean', desc: '우상단 X 버튼 표시 (기본: false, 닫으면 false)' },
								{ prop: 'autoDismiss', type: 'number', desc: 'N밀리초(ms) 후 자동 닫기(false 로 resolve)' },
								{ prop: 'onClose', type: '(result: IDialogResult) => void', desc: '닫힘 경로 상세 콜백(reason 포함)' },
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
			</section>

			{/* ── 실전 예제 ────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="실전 예제 — 삭제 전 확인"
					description="목록에서 파일을 삭제하기 전 error 타입 confirm 으로 되돌릴 수 없음을 알립니다. 확인하면 실제로 목록에서 제거하고 완료 알림을 띄웁니다. 취소하면 아무 일도 일어나지 않습니다."
				/>

				<DeleteConfirmCard />

				<SourceTabs files={[{ filename: 'DeleteConfirmCard.tsx', code: deleteConfirmSource, lang: 'tsx' }]} />
			</section>
		</div>
	);
}
