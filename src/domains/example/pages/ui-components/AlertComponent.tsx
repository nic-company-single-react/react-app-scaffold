import { useState } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/ExCard';
import AccountNoticeAlert from '@/domains/example/components/ui-components/AccountNoticeAlert';
import SourceTabs from '@/domains/example/components/ui-components/SourceTabs';
import noticeSource from '@/domains/example/components/ui-components/AccountNoticeAlert.tsx?raw';
import noticeCss from '@/domains/example/components/ui-components/AccountNoticeAlert.module.css?raw';
import { CircleAlert, CircleCheck, Info, Megaphone, RefreshCw, Terminal, TriangleAlert, X } from 'lucide-react';

export default function AlertComponent(): React.ReactNode {
	const [visible, setVisible] = useState(true);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20">
					<Megaphone className="w-5 h-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Alert 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-amber-300/50 bg-amber-100/60 text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/30 dark:text-amber-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Alert 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 주의: $ui.alert 과 혼동 금지 ─────────────────────── */}
			<div className="rounded-2xl border border-rose-200 dark:border-rose-900/60 bg-rose-50/60 dark:bg-rose-950/30 p-4 space-y-2">
				<p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
					⚠️ 이 페이지의 <code className="font-mono">Alert</code> 는 전역{' '}
					<code className="font-mono">$ui.alert()</code> 와 전혀 다른 것입니다.
				</p>
				<ul className="text-xs text-rose-800/90 dark:text-rose-300/80 space-y-1 list-disc pl-4">
					<li>
						<code className="font-mono font-semibold">Alert</code> (이 페이지) — 화면 안에 인라인으로 렌더링되는{' '}
						<b>배너 UI 컴포넌트</b>. 페이지 흐름을 막지 않고, JSX로 직접 배치합니다. import 위치는{' '}
						<code className="font-mono">@axiom/components/ui</code>.
					</li>
					<li>
						<code className="font-mono font-semibold">$ui.alert()</code> — <b>전역 모달 다이얼로그 함수</b>. 화면을
						덮는 팝업을 띄우고 사용자가 닫을 때까지 기다리는 <code className="font-mono">Promise</code> 를 반환합니다.
						import 없이 <code className="font-mono">window.$ui</code> 로 어디서든 호출합니다.
					</li>
				</ul>
				<div className="rounded-lg overflow-hidden border border-rose-200/70 dark:border-rose-900/60">
					<CodeBlock
						code={`// (1) 이 페이지에서 다루는 것 — 인라인 배너 컴포넌트
import { Alert, AlertTitle } from '@axiom/components/ui';

<Alert>
  <AlertTitle>저장되었습니다.</AlertTitle>
</Alert>

// (2) 이 페이지와 무관 — 전역 모달 다이얼로그 (별도 기능)
await $ui.alert('저장되었습니다.');`}
					/>
				</div>
			</div>

			{/* ── 0. Import ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. Import"
					description="Alert는 4개의 하위 컴포넌트로 구성됩니다. 필요한 것만 골라 import 합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<CodeBlock
						code={`import { Alert, AlertTitle, AlertDescription, AlertAction } from '@axiom/components/ui';

// Alert            : 루트 컨테이너 (role="alert")
// AlertTitle       : 제목 한 줄
// AlertDescription : 본문 설명
// AlertAction      : 우측 상단 액션 영역 (닫기/바로가기 버튼 등)`}
					/>
				</div>
			</section>

			{/* ── 1. Basic ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="Alert 안에 AlertTitle과 AlertDescription을 넣는 가장 기본적인 형태입니다."
				/>
				<ExCard
					label="Alert + AlertTitle + AlertDescription"
					code={`<Alert>
  <AlertTitle>변경사항이 저장되었습니다.</AlertTitle>
  <AlertDescription>
    수정한 내용은 즉시 반영되며, 언제든지 되돌릴 수 있습니다.
  </AlertDescription>
</Alert>`}
				>
					<div className="w-full">
						<Alert>
							<AlertTitle>변경사항이 저장되었습니다.</AlertTitle>
							<AlertDescription>수정한 내용은 즉시 반영되며, 언제든지 되돌릴 수 있습니다.</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 2. variant ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. variant (default / destructive)"
					description="기본 제공 variant는 2가지입니다. destructive는 텍스트를 destructive 색상으로 표시합니다."
				/>
				<ExCard
					label='variant="default" | "destructive"'
					code={`<Alert>
  <AlertTitle>기본 알림</AlertTitle>
  <AlertDescription>일반적인 안내 메시지에 사용합니다.</AlertDescription>
</Alert>

<Alert variant="destructive">
  <AlertTitle>결제에 실패했습니다.</AlertTitle>
  <AlertDescription>
    카드 한도를 확인한 뒤 다시 시도해 주세요.
  </AlertDescription>
</Alert>`}
				>
					<div className="w-full space-y-3">
						<Alert>
							<AlertTitle>기본 알림</AlertTitle>
							<AlertDescription>일반적인 안내 메시지에 사용합니다.</AlertDescription>
						</Alert>
						<Alert variant="destructive">
							<AlertTitle>결제에 실패했습니다.</AlertTitle>
							<AlertDescription>카드 한도를 확인한 뒤 다시 시도해 주세요.</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 아이콘 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 아이콘 포함"
					description="Alert의 첫 자식으로 svg(아이콘)를 넣으면 자동으로 2컬럼 그리드가 되어 아이콘이 좌측에 배치됩니다. 크기(size-4)와 색상은 컴포넌트가 알아서 맞춥니다."
				/>
				<ExCard
					label="첫 번째 자식으로 아이콘 배치"
					code={`import { Terminal, TriangleAlert } from 'lucide-react';

<Alert>
  <Terminal />
  <AlertTitle>CLI로도 실행할 수 있습니다.</AlertTitle>
  <AlertDescription>
    터미널에서 <code>npm run build</code> 로 동일한 작업을 수행합니다.
  </AlertDescription>
</Alert>

<Alert variant="destructive">
  <TriangleAlert />
  <AlertTitle>세션이 만료되었습니다.</AlertTitle>
  <AlertDescription>보안을 위해 다시 로그인해 주세요.</AlertDescription>
</Alert>`}
				>
					<div className="w-full space-y-3">
						<Alert>
							<Terminal />
							<AlertTitle>CLI로도 실행할 수 있습니다.</AlertTitle>
							<AlertDescription>
								터미널에서 <code className="font-mono">npm run build</code> 로 동일한 작업을 수행합니다.
							</AlertDescription>
						</Alert>
						<Alert variant="destructive">
							<TriangleAlert />
							<AlertTitle>세션이 만료되었습니다.</AlertTitle>
							<AlertDescription>보안을 위해 다시 로그인해 주세요.</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 4. 제목만 / 설명만 ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 제목만 / 설명만"
					description="AlertTitle, AlertDescription은 모두 선택 사항입니다. 짧은 한 줄 알림은 제목만 써도 됩니다."
				/>
				<ExCard
					label="AlertTitle 단독 / AlertDescription 단독"
					code={`{/* 한 줄 알림 */}
<Alert>
  <Info />
  <AlertTitle>새 버전(v2.4.0)이 배포되었습니다.</AlertTitle>
</Alert>

{/* 설명만 */}
<Alert>
  <AlertDescription>
    입력하신 정보는 암호화되어 안전하게 저장됩니다.
  </AlertDescription>
</Alert>`}
				>
					<div className="w-full space-y-3">
						<Alert>
							<Info />
							<AlertTitle>새 버전(v2.4.0)이 배포되었습니다.</AlertTitle>
						</Alert>
						<Alert>
							<AlertDescription>입력하신 정보는 암호화되어 안전하게 저장됩니다.</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 5. AlertAction ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. AlertAction (우측 액션)"
					description="AlertAction을 넣으면 우측 상단에 절대 배치되고, Alert 본문의 오른쪽 패딩이 자동으로 넓어져 텍스트와 겹치지 않습니다."
				/>
				<ExCard
					label="AlertAction + Button"
					code={`<Alert>
  <CircleAlert />
  <AlertTitle>저장 공간이 90% 찼습니다.</AlertTitle>
  <AlertDescription>
    용량이 가득 차면 새 파일 업로드가 제한됩니다.
  </AlertDescription>
  <AlertAction>
    <Button size="xs" variant="outline">업그레이드</Button>
  </AlertAction>
</Alert>`}
				>
					<div className="w-full">
						<Alert>
							<CircleAlert />
							<AlertTitle>저장 공간이 90% 찼습니다.</AlertTitle>
							<AlertDescription>용량이 가득 차면 새 파일 업로드가 제한됩니다.</AlertDescription>
							<AlertAction>
								<Button
									size="xs"
									variant="outline"
								>
									업그레이드
								</Button>
							</AlertAction>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 6. 링크 / 여러 문단 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 링크 · 여러 문단"
					description="AlertDescription 안의 <a>는 자동으로 밑줄이 적용되고, <p>가 여러 개일 때 마지막 문단을 제외하고 간격이 붙습니다."
				/>
				<ExCard
					label="a 태그 · p 여러 개"
					code={`<Alert>
  <Info />
  <AlertTitle>개인정보 처리방침이 변경되었습니다.</AlertTitle>
  <AlertDescription>
    <p>2026년 8월 1일부터 새로운 방침이 적용됩니다.</p>
    <p>
      자세한 내용은 <a href="#">변경 내역</a>에서 확인하세요.
    </p>
  </AlertDescription>
</Alert>`}
				>
					<div className="w-full">
						<Alert>
							<Info />
							<AlertTitle>개인정보 처리방침이 변경되었습니다.</AlertTitle>
							<AlertDescription>
								<p>2026년 8월 1일부터 새로운 방침이 적용됩니다.</p>
								<p>
									자세한 내용은{' '}
									<a
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										변경 내역
									</a>
									에서 확인하세요.
								</p>
							</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 7. className으로 톤 확장 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. className으로 톤 확장 (success / warning / info)"
					description="기본 variant는 2종뿐이므로, 성공·경고 등 다른 톤이 필요하면 className으로 색을 덧입힙니다. 아이콘 색은 *:[svg]:text-current 규칙 때문에 Alert의 text 색을 따라가므로, 아이콘에 직접 클래스를 주면 됩니다."
				/>
				<ExCard
					label="className 색상 오버라이드"
					code={`{/* success */}
<Alert className="border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40">
  <CircleCheck className="text-emerald-600 dark:text-emerald-400" />
  <AlertTitle className="text-emerald-900 dark:text-emerald-200">
    이체가 완료되었습니다.
  </AlertTitle>
  <AlertDescription className="text-emerald-700 dark:text-emerald-300/80">
    홍길동님께 1,200,000원을 보냈습니다.
  </AlertDescription>
</Alert>

{/* warning */}
<Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
  <TriangleAlert className="text-amber-600 dark:text-amber-400" />
  <AlertTitle className="text-amber-900 dark:text-amber-200">
    비밀번호를 90일 이상 변경하지 않았습니다.
  </AlertTitle>
  <AlertDescription className="text-amber-700 dark:text-amber-300/80">
    보안을 위해 주기적으로 변경해 주세요.
  </AlertDescription>
</Alert>`}
				>
					<div className="w-full space-y-3">
						<Alert className="border-emerald-300 bg-emerald-50 dark:border-emerald-800 dark:bg-emerald-950/40">
							<CircleCheck className="text-emerald-600 dark:text-emerald-400" />
							<AlertTitle className="text-emerald-900 dark:text-emerald-200">이체가 완료되었습니다.</AlertTitle>
							<AlertDescription className="text-emerald-700 dark:text-emerald-300/80">
								홍길동님께 1,200,000원을 보냈습니다.
							</AlertDescription>
						</Alert>
						<Alert className="border-amber-300 bg-amber-50 dark:border-amber-800 dark:bg-amber-950/40">
							<TriangleAlert className="text-amber-600 dark:text-amber-400" />
							<AlertTitle className="text-amber-900 dark:text-amber-200">
								비밀번호를 90일 이상 변경하지 않았습니다.
							</AlertTitle>
							<AlertDescription className="text-amber-700 dark:text-amber-300/80">
								보안을 위해 주기적으로 변경해 주세요.
							</AlertDescription>
						</Alert>
					</div>
				</ExCard>
			</section>

			{/* ── 8. 인터랙티브 예제 — 닫기 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 인터랙티브 예제 — 닫을 수 있는 Alert"
					description="AlertAction에 닫기 버튼을 넣고 state로 표시 여부를 제어하는, 가장 많이 쓰는 패턴입니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 상태: <code className="font-mono text-amber-700 dark:text-amber-400">{String(visible)}</code>
						</span>
					</div>
					<div className="p-5 space-y-3">
						{visible ? (
							<Alert>
								<Info />
								<AlertTitle>브라우저 알림이 꺼져 있습니다.</AlertTitle>
								<AlertDescription>알림을 켜면 거래 발생 시 즉시 안내를 받을 수 있습니다.</AlertDescription>
								<AlertAction>
									<Button
										size="icon-xs"
										variant="ghost"
										aria-label="닫기"
										onClick={() => setVisible(false)}
									>
										<X />
									</Button>
								</AlertAction>
							</Alert>
						) : (
							<p className="text-xs text-gray-500 dark:text-gray-400 py-2">알림이 닫혔습니다.</p>
						)}
						<Button
							size="sm"
							variant="outline"
							onClick={() => setVisible(true)}
							disabled={visible}
						>
							<RefreshCw />
							다시 보기
						</Button>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [visible, setVisible] = useState(true);

{visible && (
  <Alert>
    <Info />
    <AlertTitle>브라우저 알림이 꺼져 있습니다.</AlertTitle>
    <AlertDescription>
      알림을 켜면 거래 발생 시 즉시 안내를 받을 수 있습니다.
    </AlertDescription>
    <AlertAction>
      <Button size="icon-xs" variant="ghost" aria-label="닫기" onClick={() => setVisible(false)}>
        <X />
      </Button>
    </AlertAction>
  </Alert>
)}`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────── */}
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
									component: 'Alert',
									prop: 'variant',
									type: '"default" | "destructive"',
									desc: '알림 톤. 기본값 "default"',
								},
								{
									component: 'Alert',
									prop: 'className',
									type: 'string',
									desc: '색·여백 등 추가 스타일 (톤 확장 시 사용)',
								},
								{
									component: 'Alert',
									prop: '...props',
									type: 'div 속성 전체',
									desc: 'role="alert"가 기본 적용된 div. data-* 등 자유롭게 전달',
								},
								{
									component: 'AlertTitle',
									prop: 'children',
									type: 'ReactNode',
									desc: '제목 텍스트 (한 줄 권장)',
								},
								{
									component: 'AlertDescription',
									prop: 'children',
									type: 'ReactNode',
									desc: '본문. a 태그 밑줄 / p 간격이 자동 적용',
								},
								{
									component: 'AlertAction',
									prop: 'children',
									type: 'ReactNode',
									desc: '우측 상단에 절대 배치되는 액션 영역 (닫기·바로가기 버튼)',
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

			{/* ── 기타. 실전 예제 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 계좌 알림 센터"
					description="제공 Alert를 그대로 쓰되, *.module.css 에서 data-slot 선택자를 오버라이드해 기본 variant 2종을 info / success / warning / danger 4가지 톤으로 확장한 예제입니다. 알림 닫기와 액션 클릭까지 실제로 동작합니다."
				/>

				<AccountNoticeAlert />

				<SourceTabs
					files={[
						{ filename: 'AccountNoticeAlert.tsx', code: noticeSource, lang: 'tsx' },
						{ filename: 'AccountNoticeAlert.module.css', code: noticeCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
