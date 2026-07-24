import { useState } from 'react';
import { Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import SaveNoticeCard from '@/domains/example/components/ui/alert/SaveNoticeCard';
import saveNoticeSource from '@/domains/example/components/ui/alert/SaveNoticeCard.tsx?raw';
import type { IDialogResult } from '@/types/components';
import { Bell } from 'lucide-react';

export default function UiAlert(): React.ReactNode {
	// onClose 콜백 예제에서 마지막 닫힘 결과를 표시하기 위한 상태
	const [lastResult, setLastResult] = useState<IDialogResult | null>(null);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<Bell className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">$ui.alert</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						전역{' '}
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							window.$ui
						</code>
						가 제공하는 알림 다이얼로그 API 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 주의: Alert 컴포넌트와 혼동 금지 ─────────────────── */}
			<div className="rounded-2xl border border-sky-200 dark:border-sky-900/60 bg-sky-50/60 dark:bg-sky-950/30 p-4 space-y-2">
				<p className="text-sm font-semibold text-sky-900 dark:text-sky-200">
					💡 <code className="font-mono">$ui.alert()</code> 는 <code className="font-mono">&lt;Alert&gt;</code> 컴포넌트와
					다릅니다.
				</p>
				<ul className="text-xs text-sky-800/90 dark:text-sky-300/80 space-y-1 list-disc pl-4">
					<li>
						<code className="font-mono font-semibold">$ui.alert()</code> (이 페이지) — 화면을 덮는 <b>전역 모달 함수</b>.
						import 없이 어디서든 호출하고 <code className="font-mono">Promise&lt;void&gt;</code> 를 반환합니다.
					</li>
					<li>
						<code className="font-mono font-semibold">&lt;Alert&gt;</code> — 화면 안에 그리는 <b>인라인 배너 컴포넌트</b>. UI
						Components 메뉴의 Alert 페이지에서 다룹니다.
					</li>
				</ul>
			</div>

			{/* ── 0. 호출 방법 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 호출 방법"
					description="$ui 는 앱 전역에 등록된 객체입니다. import 가 필요 없고 컴포넌트 밖(이벤트 핸들러·유틸 함수 등)에서도 그대로 호출할 수 있습니다. 각 호출은 다이얼로그가 닫힐 때 resolve 되는 Promise 를 돌려줍니다."
				/>
				<CodeBlock
					code={`// import 불필요 — window.$ui 로 전역 등록되어 있음

// (1) 문자열 한 줄
$ui.alert('저장되었습니다.');

// (2) 옵션 객체
$ui.alert({ type: 'success', title: '완료', message: '처리했습니다.' });

// (3) 메시지 + 옵션 (두번째 인자가 우선 병합됨)
$ui.alert('삭제했습니다.', { type: 'success', autoDismiss: 1500 });

// (4) Promise — 닫힐 때까지 기다렸다가 이어서 처리
await $ui.alert('먼저 확인하세요.');
doNext();`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					첫 인자는 <b>문자열</b> 또는 <b>옵션 객체</b>로 오버로드됩니다. 두 인자를 함께 주면 두번째(옵션 객체)가 우선
					병합되고, <b>id</b> 를 지정하지 않으면 자동으로 부여됩니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 문자열 한 줄"
					description="가장 단순한 형태. 문자열만 넘기면 기본 제목('알림')과 함께 표시됩니다."
				/>
				<ExCard
					label="$ui.alert(message)"
					code={`<Button onClick={() => $ui.alert('저장되었습니다.')}>
  기본 알림
</Button>`}
				>
					<Button
						type="button"
						onClick={() => void $ui.alert('저장되었습니다.')}
					>
						기본 알림 열기
					</Button>
				</ExCard>
			</section>

			{/* ── 2. type ──────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. type — 상태별 아이콘 · 색상"
					description="type 을 지정하면 그에 맞는 아이콘·색상·기본 제목이 자동 적용됩니다(success / info / warning / error). type 을 주면 아이콘도 자동으로 표시됩니다."
				/>
				<ExCard
					label="type: 'success' | 'info' | 'warning' | 'error'"
					code={`$ui.alert({ type: 'success', message: '결제가 완료되었습니다.' });
$ui.alert({ type: 'info',    message: '새 버전이 준비되었습니다.' });
$ui.alert({ type: 'warning', message: '저장 공간이 부족합니다.' });
$ui.alert({ type: 'error',   message: '요청을 처리하지 못했습니다.' });`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() => void $ui.alert({ type: 'success', message: '결제가 완료되었습니다.' })}
					>
						success
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => void $ui.alert({ type: 'info', message: '새 버전이 준비되었습니다.' })}
					>
						info
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => void $ui.alert({ type: 'warning', message: '저장 공간이 부족합니다.' })}
					>
						warning
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={() => void $ui.alert({ type: 'error', message: '요청을 처리하지 못했습니다.' })}
					>
						error
					</Button>
				</ExCard>
			</section>

			{/* ── 3. title / message ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. title / message — 제목 직접 지정"
					description="title 을 주면 type 기본 제목 대신 원하는 제목을 씁니다. type 없이도 title·message 만으로 사용할 수 있습니다."
				/>
				<ExCard
					label="title + message"
					code={`$ui.alert({
  title: '이용 안내',
  message: '오늘 밤 2시부터 4시까지 점검이 예정되어 있습니다.',
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							void $ui.alert({
								title: '이용 안내',
								message: '오늘 밤 2시부터 4시까지 점검이 예정되어 있습니다.',
							})
						}
					>
						제목 지정 알림
					</Button>
				</ExCard>
			</section>

			{/* ── 4. close 버튼 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. close — 우상단 X 버튼"
					description="close: true 로 다이얼로그 우상단에 닫기(X) 버튼을 노출합니다(기본은 숨김)."
				/>
				<ExCard
					label="close: true"
					code={`$ui.alert({
  type: 'info',
  title: '공지',
  message: '우상단 X 로도 닫을 수 있습니다.',
  close: true,
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							void $ui.alert({
								type: 'info',
								title: '공지',
								message: '우상단 X 로도 닫을 수 있습니다.',
								close: true,
							})
						}
					>
						X 버튼 알림
					</Button>
				</ExCard>
			</section>

			{/* ── 5. autoDismiss ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. autoDismiss — 자동 닫힘"
					description="autoDismiss(ms) 를 주면 지정한 시간이 지난 뒤 다이얼로그가 스스로 닫힙니다. 토스트처럼 가볍게 알릴 때 유용합니다."
				/>
				<ExCard
					label="autoDismiss: 1500"
					code={`$ui.alert({
  type: 'success',
  message: '복사되었습니다.',
  autoDismiss: 1500, // 1.5초 후 자동 닫힘
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() => void $ui.alert({ type: 'success', message: '복사되었습니다.', autoDismiss: 1500 })}
					>
						1.5초 후 자동 닫힘
					</Button>
				</ExCard>
			</section>

			{/* ── 6. confirmText ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. confirmText — 버튼 문구 변경"
					description="확인 버튼의 문구를 바꿉니다(기본: '확인')."
				/>
				<ExCard
					label="confirmText: '알겠습니다'"
					code={`$ui.alert({
  type: 'info',
  message: '약관이 업데이트되었습니다.',
  confirmText: '알겠습니다',
});`}
				>
					<Button
						type="button"
						variant="outline"
						onClick={() =>
							void $ui.alert({ type: 'info', message: '약관이 업데이트되었습니다.', confirmText: '알겠습니다' })
						}
					>
						버튼 문구 변경
					</Button>
				</ExCard>
			</section>

			{/* ── 7. await 흐름 제어 ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. await — 닫힘까지 기다렸다 이어서 처리"
					description="alert 는 Promise<void> 를 반환합니다. 사용자가 다이얼로그를 닫을 때 resolve 되므로, await 뒤에 후속 로직을 이어 쓸 수 있습니다."
				/>
				<ExCard
					label="await $ui.alert(...) → 다음 알림"
					code={`const handleFlow = async () => {
  await $ui.alert({ type: 'info', message: '1단계: 확인을 눌러 계속하세요.' });
  await $ui.alert({ type: 'success', message: '2단계: 이어서 처리되었습니다.' });
};`}
				>
					<Button
						type="button"
						onClick={async () => {
							await $ui.alert({ type: 'info', message: '1단계: 확인을 눌러 계속하세요.' });
							await $ui.alert({ type: 'success', message: '2단계: 이어서 처리되었습니다.' });
						}}
					>
						연속 알림 실행
					</Button>
				</ExCard>
			</section>

			{/* ── 8. onClose 콜백 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. onClose — 닫힘 경로 상세 콜백"
					description="어떤 경로로 닫혔는지(reason: confirm / close / escape / autoDismiss)를 콜백으로 받습니다. close·autoDismiss 옵션과 함께 쓰면 사용자의 반응을 구분할 수 있습니다."
				/>
				<ExCard
					label="onClose: (result) => ..."
					code={`$ui.alert({
  type: 'info',
  title: '피드백',
  message: '확인/X/ESC/자동닫힘 중 무엇으로 닫혔는지 콜백으로 받습니다.',
  close: true,
  autoDismiss: 4000,
  onClose: (result) => {
    // result: { id, confirmed, reason }
    console.log(result.reason);
  },
});`}
				>
					<div className="flex flex-wrap items-center gap-3">
						<Button
							type="button"
							variant="outline"
							onClick={() =>
								void $ui.alert({
									type: 'info',
									title: '피드백',
									message: '확인 / X / ESC / 4초 자동닫힘 중 하나로 닫아보세요.',
									close: true,
									autoDismiss: 4000,
									onClose: (result) => setLastResult(result),
								})
							}
						>
							onClose 테스트
						</Button>
						{lastResult && (
							<span className="text-xs text-gray-600 dark:text-gray-400">
								마지막 닫힘 →{' '}
								<code className="font-mono text-sky-700 dark:text-sky-400">reason: {lastResult.reason}</code>
								{', '}
								<code className="font-mono text-sky-700 dark:text-sky-400">
									confirmed: {String(lastResult.confirmed)}
								</code>
							</span>
						)}
					</div>
				</ExCard>
			</section>

			{/* ── 옵션 요약 테이블 ─────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="옵션 요약 (IAlertDialogOption)" />
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
								{ prop: 'type', type: "'success' | 'info' | 'warning' | 'error'", desc: '아이콘·색상·기본 제목' },
								{ prop: 'title', type: 'string', desc: '제목 (기본: type별 기본 제목)' },
								{ prop: 'message', type: 'string', desc: '본문 (옵션 객체로 넘길 때)' },
								{ prop: 'icon', type: 'boolean', desc: '아이콘 강제 표시/숨김 (기본: type 있으면 표시)' },
								{ prop: 'close', type: 'boolean', desc: '우상단 X 버튼 표시 (기본: false)' },
								{ prop: 'autoDismiss', type: 'number', desc: 'N밀리초(ms) 후 자동 닫기' },
								{ prop: 'confirmText', type: 'string', desc: "확인 버튼 문구 (기본: '확인')" },
								{ prop: 'onClose', type: '(result: IDialogResult) => void', desc: '닫힘 경로 상세 콜백' },
								{ prop: 'id', type: 'string', desc: '고유 식별자 (미지정 시 자동 생성)' },
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
					title="실전 예제 — 설정 저장 후 완료 알림"
					description="설정을 저장하는 모의 API 흐름. 저장이 끝나면 success 타입 알림을 autoDismiss 로 잠깐 띄웠다가 닫습니다. await 로 저장→알림 순서를 자연스럽게 이어붙였습니다."
				/>

				<SaveNoticeCard />

				<SourceTabs files={[{ filename: 'SaveNoticeCard.tsx', code: saveNoticeSource, lang: 'tsx' }]} />
			</section>
		</div>
	);
}
