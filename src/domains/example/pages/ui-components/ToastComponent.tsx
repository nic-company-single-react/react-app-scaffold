import { useState } from 'react';
import { toast, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import PaymentCompleteToast from '@/domains/example/components/ui-components/toast/PaymentCompleteToast';
import SecurityAlertToast from '@/domains/example/components/ui-components/toast/SecurityAlertToast';
import paymentSource from '@/domains/example/components/ui-components/toast/PaymentCompleteToast.tsx?raw';
import paymentCss from '@/domains/example/components/ui-components/toast/PaymentCompleteToast.module.css?raw';
import securitySource from '@/domains/example/components/ui-components/toast/SecurityAlertToast.tsx?raw';
import securityCss from '@/domains/example/components/ui-components/toast/SecurityAlertToast.module.css?raw';
import { Bell } from 'lucide-react';

/** 인터랙티브 플레이그라운드에서 고를 토스트 종류 */
type ToastKind = 'default' | 'success' | 'error' | 'warning' | 'info';
/** 인터랙티브 플레이그라운드에서 고를 노출 위치 */
type ToastPosition = 'top-left' | 'top-center' | 'top-right' | 'bottom-left' | 'bottom-center' | 'bottom-right';

export default function ToastComponent(): React.ReactNode {
	/** 7. 플레이그라운드 상태 */
	const [kind, setKind] = useState<ToastKind>('success');
	const [position, setPosition] = useState<ToastPosition>('bottom-right');
	const [withDesc, setWithDesc] = useState(true);

	/** 5. promise 예제용 가짜 비동기 작업 (85% 성공) */
	const fakeUpload = () =>
		new Promise<{ name: string }>((resolve, reject) => {
			setTimeout(() => {
				if (Math.random() > 0.15) resolve({ name: 'settlement-2026-07.xlsx' });
				else reject(new Error('네트워크 오류'));
			}, 1800);
		});

	/** 7. 플레이그라운드 실행 */
	const firePlayground = () => {
		const opts = {
			position,
			description: withDesc ? '설정한 옵션이 그대로 반영됩니다.' : undefined,
		};
		const message =
			kind === 'default'
				? '기본 토스트입니다.'
				: kind === 'success'
					? '성공적으로 처리되었습니다.'
					: kind === 'error'
						? '처리 중 오류가 발생했습니다.'
						: kind === 'warning'
							? '입력값을 다시 확인해 주세요.'
							: '새로운 업데이트가 있습니다.';

		if (kind === 'default') toast(message, opts);
		else toast[kind](message, opts);
	};

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-amber-50 dark:bg-amber-900/20">
					<Bell className="w-5 h-5 text-amber-600 dark:text-amber-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Toast 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-amber-300/50 bg-amber-100/60 text-amber-800 dark:border-amber-600/40 dark:bg-amber-900/30 dark:text-amber-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Toast 사용 예제입니다. <b>화면 위에 잠깐 떠올랐다 사라지는 알림</b>으로, 작업 결과를 흐름을
						끊지 않고 알릴 때 씁니다.
					</p>
				</div>
			</div>

			{/* ── 설치/셋업 안내 배너 ───────────────────────────────── */}
			<div className="rounded-2xl border border-amber-200 dark:border-amber-900/40 bg-amber-50/60 dark:bg-amber-900/10 p-4 space-y-1.5">
				<p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
					먼저 알아둘 것 — Toaster는 이미 켜져 있습니다
				</p>
				<p className="text-xs text-amber-800/90 dark:text-amber-300/90 leading-relaxed">
					다른 컴포넌트와 달리 토스트는 <b>화면에 그려주는 호스트(&lt;Toaster /&gt;)가 앱에 딱 한 번</b> 떠 있어야
					동작합니다. 이 scaffold는 <code className="font-mono">AppProviders</code> 에 이미 전역으로 마운트해 두었으니,
					여러분은 어느 화면에서든 <code className="font-mono">toast(...)</code> 만 호출하면 됩니다. (직접 셋업하는
					방법은 아래 <b>0. import & 셋업</b> 참고)
				</p>
			</div>

			{/* ── 0. import & 셋업 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 셋업"
					description="호출용 toast 함수만 import 하면 됩니다. Toaster 마운트는 앱 전역에 1회만 — 이 프로젝트는 이미 되어 있습니다."
				/>
				<CodeBlock
					code={`// 어느 화면에서든 — 호출 함수만 가져오면 끝
import { toast } from '@axiom/components/ui';

toast('저장되었습니다.');

// ─────────────────────────────────────────────
// 참고) 앱 전역 셋업 (이 scaffold는 AppProviders에 이미 되어 있음)
//   src/core/providers/AppProviders.tsx
import { Toaster } from '@axiom/components/ui';

<Toaster />   // 앱 트리 최상단 근처에 딱 한 번만`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="toast()에 문자열만 넘기면 기본 토스트가 뜹니다. 버튼을 눌러 실제로 확인해 보세요."
				/>
				<ExCard
					label="toast(message)"
					code={`toast('링크가 클립보드에 복사되었습니다.');`}
				>
					<Button
						size="sm"
						variant="outline"
						onClick={() => toast('링크가 클립보드에 복사되었습니다.')}
					>
						기본 토스트 띄우기
					</Button>
				</ExCard>
			</section>

			{/* ── 2. 종류(변형) ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 종류 — success / error / warning / info / loading"
					description="상태별 헬퍼를 쓰면 종류에 맞는 아이콘이 자동으로 붙습니다. 아이콘 세트는 shared의 sonner.tsx에서 정의되어 있습니다(lucide)."
				/>
				<ExCard
					label="toast.success / error / warning / info / loading"
					code={`toast.success('결제가 완료되었습니다.');
toast.error('결제에 실패했습니다.');
toast.warning('잔액이 부족합니다.');
toast.info('새 버전이 배포되었습니다.');

// loading은 보통 수동으로 닫거나(promise로 대체) id로 갱신한다
const id = toast.loading('업로드 중…');
// …작업 완료 후
toast.success('업로드 완료', { id });`}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast.success('결제가 완료되었습니다.')}
						>
							success
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast.error('결제에 실패했습니다.')}
						>
							error
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast.warning('잔액이 부족합니다.')}
						>
							warning
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast.info('새 버전이 배포되었습니다.')}
						>
							info
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => {
								const id = toast.loading('업로드 중…');
								setTimeout(() => toast.success('업로드 완료', { id }), 1600);
							}}
						>
							loading → success
						</Button>
					</div>
				</ExCard>
			</section>

			{/* ── 3. description ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. description (부가 설명)"
					description="제목 아래에 한 줄 설명을 덧붙입니다. 제목은 짧게, 자세한 내용은 description으로 분리하세요."
				/>
				<ExCard
					label="{ description }"
					code={`toast.success('이체가 완료되었습니다.', {
  description: '홍길동님께 30,000원을 보냈어요. · 오후 2:31',
});`}
				>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							toast.success('이체가 완료되었습니다.', {
								description: '홍길동님께 30,000원을 보냈어요. · 오후 2:31',
							})
						}
					>
						설명 있는 토스트
					</Button>
				</ExCard>
			</section>

			{/* ── 4. action / cancel ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. action · cancel 버튼"
					description="토스트 안에 버튼을 넣어 '실행 취소' 같은 후속 동작을 제공합니다. 되돌릴 수 있는 작업(삭제 등)에 특히 유용합니다."
				/>
				<ExCard
					label="{ action, cancel }"
					code={`toast('메일을 휴지통으로 옮겼습니다.', {
  action: {
    label: '실행 취소',
    onClick: () => toast.success('복구했습니다.'),
  },
  cancel: {
    label: '닫기',
    onClick: () => {},
  },
});`}
				>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							toast('메일을 휴지통으로 옮겼습니다.', {
								action: {
									label: '실행 취소',
									onClick: () => toast.success('복구했습니다.'),
								},
								cancel: {
									label: '닫기',
									onClick: () => {},
								},
							})
						}
					>
						실행 취소 토스트
					</Button>
				</ExCard>
			</section>

			{/* ── 5. promise ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. toast.promise (비동기 진행 표시)"
					description="Promise 하나를 넘기면 로딩 → 성공/실패까지 토스트가 알아서 전환됩니다. API 호출 결과를 알릴 때 가장 자주 씁니다."
				/>
				<ExCard
					label="toast.promise(promise, { loading, success, error })"
					code={`toast.promise(uploadFile(), {
  loading: '정산 파일 업로드 중…',
  success: (data) => \`\${data.name} 업로드 완료\`,
  error: '업로드 실패 — 잠시 후 다시 시도해 주세요.',
});`}
				>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							toast.promise(fakeUpload(), {
								loading: '정산 파일 업로드 중…',
								success: (data) => `${data.name} 업로드 완료`,
								error: '업로드 실패 — 잠시 후 다시 시도해 주세요.',
							})
						}
					>
						업로드 시뮬레이션 (85% 성공)
					</Button>
				</ExCard>
			</section>

			{/* ── 6. 위치 · 지속시간 · 수동 닫기 ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 위치 · 지속시간 · 수동 닫기"
					description="position으로 노출 위치를, duration으로 유지 시간을(Infinity면 자동으로 안 닫힘), toast.dismiss로 수동 닫기를 제어합니다."
				/>
				<ExCard
					label="{ position, duration } · toast.dismiss()"
					code={`// 위치 지정 (개별 토스트)
toast('상단 중앙에 표시', { position: 'top-center' });

// 오래 유지 (10초) / 자동으로 안 닫힘
toast('10초간 유지', { duration: 10000 });
toast.warning('직접 닫아야 사라짐', { duration: Infinity });

// 수동 닫기 — id를 잡아 닫거나, 전체 닫기
const id = toast.loading('처리 중…');
toast.dismiss(id);   // 특정 토스트
toast.dismiss();     // 떠 있는 모든 토스트`}
				>
					<div className="flex flex-wrap gap-2">
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast('상단 중앙에 표시', { position: 'top-center' })}
						>
							top-center
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => toast('10초간 유지됩니다.', { duration: 10000 })}
						>
							duration 10s
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() =>
								toast.warning('직접 닫기 전까지 사라지지 않습니다.', {
									duration: Infinity,
								})
							}
						>
							자동 닫힘 없음
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => toast.dismiss()}
						>
							전체 닫기
						</Button>
					</div>
				</ExCard>
			</section>

			{/* ── 7. 인터랙티브 플레이그라운드 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 인터랙티브 플레이그라운드"
					description="종류 · 위치 · 설명 유무를 골라 실제로 띄워보고, 아래 코드로 바로 복사하세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="p-5 space-y-4">
						{/* 종류 선택 */}
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">종류</span>
							<div className="flex flex-wrap gap-2">
								{(['default', 'success', 'error', 'warning', 'info'] as ToastKind[]).map((k) => (
									<button
										key={k}
										onClick={() => setKind(k)}
										className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
											kind === k
												? 'bg-amber-500 text-white border-amber-500'
												: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-amber-400'
										}`}
									>
										{k}
									</button>
								))}
							</div>
						</div>

						{/* 위치 선택 */}
						<div className="space-y-1.5">
							<span className="text-xs font-medium text-gray-500 dark:text-gray-400">위치</span>
							<div className="flex flex-wrap gap-2">
								{(
									[
										'top-left',
										'top-center',
										'top-right',
										'bottom-left',
										'bottom-center',
										'bottom-right',
									] as ToastPosition[]
								).map((p) => (
									<button
										key={p}
										onClick={() => setPosition(p)}
										className={`px-3 py-1 rounded-lg text-xs font-mono border transition-colors ${
											position === p
												? 'bg-gray-900 text-white border-gray-900 dark:bg-gray-100 dark:text-gray-900 dark:border-gray-100'
												: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-gray-400'
										}`}
									>
										{p}
									</button>
								))}
							</div>
						</div>

						{/* 설명 유무 */}
						<label className="flex items-center gap-2 text-xs font-medium text-gray-600 dark:text-gray-300 cursor-pointer select-none">
							<input
								type="checkbox"
								checked={withDesc}
								onChange={(e) => setWithDesc(e.target.checked)}
								className="h-3.5 w-3.5 rounded border-gray-300 dark:border-gray-600 accent-amber-500"
							/>
							description 포함
						</label>

						<Button
							size="sm"
							onClick={firePlayground}
						>
							이 설정으로 띄우기
						</Button>
					</div>

					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`toast${kind === 'default' ? '' : `.${kind}`}('${
								kind === 'default'
									? '기본 토스트입니다.'
									: kind === 'success'
										? '성공적으로 처리되었습니다.'
										: kind === 'error'
											? '처리 중 오류가 발생했습니다.'
											: kind === 'warning'
												? '입력값을 다시 확인해 주세요.'
												: '새로운 업데이트가 있습니다.'
							}', {
  position: '${position}',${withDesc ? "\n  description: '설정한 옵션이 그대로 반영됩니다.'," : ''}
});`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── API 요약: 메서드 ─────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="API 요약 — 메서드"
					description="toast는 함수이자 네임스페이스입니다. 모든 메서드는 토스트 id(string | number)를 반환하며, 이 id로 갱신·닫기를 할 수 있습니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">메서드</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ m: 'toast(msg, opts?)', d: '기본 토스트' },
								{ m: 'toast.success / error / warning / info(msg, opts?)', d: '상태별 토스트(아이콘 자동)' },
								{ m: 'toast.loading(msg, opts?)', d: '로딩 토스트 — 보통 id 갱신 또는 promise로 대체' },
								{ m: 'toast.promise(promise, { loading, success, error })', d: '비동기 진행/결과 자동 전환' },
								{ m: 'toast.custom(jsx, opts?)', d: '콘텐츠 전체를 직접 그리는 커스텀 토스트' },
								{ m: 'toast.dismiss(id?)', d: 'id 지정 시 해당 토스트, 생략 시 전체 닫기' },
							].map((row) => (
								<tr
									key={row.m}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400 whitespace-nowrap">
											{row.m}
										</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.d}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── API 요약: 옵션 ───────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="API 요약 — 옵션 (두 번째 인자)"
					description="모든 toast.* 메서드의 두 번째 인자로 넘기는 옵션들입니다."
				/>
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
								{ p: 'description', t: 'ReactNode', d: '제목 아래 부가 설명' },
								{ p: 'duration', t: 'number', d: '유지(ms). 기본 4000, Infinity면 자동으로 안 닫힘' },
								{ p: 'position', t: "'top-left' | 'top-center' | …", d: '노출 위치(개별 지정)' },
								{ p: 'action', t: '{ label, onClick }', d: '오른쪽 실행 버튼' },
								{ p: 'cancel', t: '{ label, onClick }', d: '취소 버튼' },
								{ p: 'closeButton', t: 'boolean', d: '닫기(X) 버튼 표시' },
								{ p: 'icon', t: 'ReactNode', d: '아이콘 커스텀(기본 아이콘 대체)' },
								{ p: 'id', t: 'string | number', d: '같은 id로 다시 호출하면 갱신(로딩→완료)' },
								{ p: 'onDismiss / onAutoClose', t: '(toast) => void', d: '닫힘/자동닫힘 콜백' },
							].map((row) => (
								<tr
									key={row.p}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
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

			{/* ── 퍼블리셔 가이드 ──────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="퍼블리셔 가이드 — 토스트 스타일을 어디에서 바꾸나"
					description="토스트는 다른 컴포넌트와 스타일 변경 방식이 다릅니다. 반드시 먼저 읽어주세요."
				/>

				{/* 왜 다른가 */}
				<div className="rounded-2xl border border-rose-200 dark:border-rose-900/40 bg-rose-50/50 dark:bg-rose-900/10 p-4 space-y-1.5">
					<p className="text-sm font-semibold text-rose-900 dark:text-rose-200">
						⚠ 아코디언·스위치처럼 “페이지 옆 *.module.css” 로는 못 바꿉니다
					</p>
					<p className="text-xs text-rose-800/90 dark:text-rose-300/90 leading-relaxed">
						토스트는 <b>앱 전역에 하나뿐인 &lt;Toaster/&gt; 싱글톤</b>이 화면 밖(body)으로 <b>portal</b> 해서 그립니다.
						그래서 특정 페이지에만 스코프되는 CSS Module로는 “이 화면의 토스트만” 다르게 만들 수 없습니다. 방법은 아래
						두 갈래입니다.
					</p>
				</div>

				{/* 방법 A */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
							방법 A — 기본 토스트를 “전역”으로 손보기 (색·간격·라운드 등 가벼운 변경)
						</span>
					</div>
					<div className="p-4 space-y-3">
						<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
							sonner의 기본 토스트는 CSS 변수와 data-* 훅을 노출합니다. shared의{' '}
							<code className="font-mono">sonner.tsx</code> 가 모든 토스트에{' '}
							<code className="font-mono">.cn-toast</code> 클래스를 붙여두었으니, <b>전역 CSS</b>(예:{' '}
							<code className="font-mono">src/assets/styles/</code> 아래 파일)에서 이 훅들을 잡아 덮어쓰면 됩니다.
							페이지 옆 module.css 가 아니라 전역이라는 점만 주의하세요.
						</p>
						<div className="overflow-x-auto">
							<table className="w-full text-sm">
								<thead>
									<tr className="border-y border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
										<th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400 text-xs">
											훅(선택자/변수)
										</th>
										<th className="text-left px-3 py-2 font-medium text-gray-600 dark:text-gray-400 text-xs">대상</th>
									</tr>
								</thead>
								<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
									{[
										{ s: '.cn-toast', t: 'sonner.tsx가 모든 토스트에 부여한 공용 클래스' },
										{ s: '[data-sonner-toast]', t: '개별 토스트 박스' },
										{ s: '[data-type="success|error|…"]', t: '종류별 분기' },
										{ s: '[data-title] / [data-description]', t: '제목 / 설명 영역' },
										{ s: '[data-icon] / [data-button]', t: '아이콘 / 액션 버튼' },
										{
											s: '--normal-bg / --normal-text / --normal-border',
											t: '기본 배경/글자/테두리(sonner.tsx가 앱 토큰에 연결)',
										},
										{ s: '--border-radius', t: '토스트 모서리 둥글기(= var(--radius))' },
									].map((row) => (
										<tr key={row.s}>
											<td className="px-3 py-2">
												<code className="text-xs font-mono text-amber-700 dark:text-amber-400 whitespace-nowrap">
													{row.s}
												</code>
											</td>
											<td className="px-3 py-2 text-xs text-gray-600 dark:text-gray-400">{row.t}</td>
										</tr>
									))}
								</tbody>
							</table>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`/* src/assets/styles/…/toast.css — 전역(‌NOT module.css)
   sonner가 body로 portal 하므로 전역 CSS로 잡는다. */

/* 모든 토스트 공통 — sonner.tsx가 붙인 .cn-toast 클래스 */
.cn-toast {
  border-radius: 14px;
  box-shadow: 0 12px 30px -12px rgba(0, 0, 0, 0.25);
  font-weight: 500;
}

/* 성공만 톤 바꾸기 */
[data-sonner-toast][data-type='success'] {
  --normal-bg: #ecfdf5;
  --normal-text: #065f46;
  --normal-border: #a7f3d0;
}

/* 다크 모드는 앱 규칙(.dark)에 맞춰 */
:global(.dark) [data-sonner-toast][data-type='success'] {
  --normal-bg: #052e26;
  --normal-text: #6ee7b7;
  --normal-border: #134e4a;
}

/* 색을 종류별로 확 넣고 싶으면 Toaster에 richColors 옵션도 고려 */
/* <Toaster richColors /> */`}
							lang="css"
							theme="github-dark"
						/>
					</div>
				</div>

				{/* 방법 B */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2.5 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-semibold text-gray-700 dark:text-gray-300">
							방법 B — 완전히 다른 디자인이면 toast.custom + co-located module.css (권장)
						</span>
					</div>
					<div className="p-4 space-y-2">
						<p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
							톤앤매너가 통째로 바뀌는 브랜드 토스트라면, sonner 기본 골격을 억지로 덮어쓰지 말고{' '}
							<code className="font-mono">toast.custom(() =&gt; &lt;MyToast/&gt;)</code> 로{' '}
							<b>콘텐츠 DOM을 직접 소유</b>하세요. 그러면 그 컴포넌트 바로 옆에{' '}
							<code className="font-mono">*.module.css</code> 를 두는{' '}
							<b>이 프로젝트의 co-location 규칙이 그대로 성립</b>합니다(포털 안에서도 컴포넌트가 붙인 className 은 정상
							동작). 아래 <b>실전 예제</b> 두 개가 정확히 이 방식입니다.
						</p>
						<CodeBlock
							code={`import { toast } from '@axiom/components/ui';
import PaymentCompleteToast from '…/toast/PaymentCompleteToast';

toast.custom((id) => (
  <PaymentCompleteToast
    merchant="스타벅스 강남점"
    amount={5600}
    onClose={() => toast.dismiss(id)}
  />
));`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 결제 완료 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 결제 완료 토스트 (toast.custom)"
					description="toast.custom 으로 콘텐츠를 직접 그린 브랜드 토스트입니다. 스타일은 컴포넌트 바로 옆 PaymentCompleteToast.module.css 로 분리(co-location)했고, 퍼블리셔는 .tsx 를 건드리지 않고 .module.css 만 수정하면 됩니다. 아래는 실제로 뜨는 카드의 미리보기입니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-6 flex flex-col items-center gap-4">
					<PaymentCompleteToast
						merchant="스타벅스 강남점"
						amount={5600}
						time="오후 2:31"
						onDetail={() => toast.info('상세 내역 화면으로 이동합니다.')}
						onClose={() => {}}
					/>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							toast.custom(
								(id) => (
									<PaymentCompleteToast
										merchant="스타벅스 강남점"
										amount={5600}
										time="오후 2:31"
										onDetail={() => {
											toast.dismiss(id);
											toast.info('상세 내역 화면으로 이동합니다.');
										}}
										onClose={() => toast.dismiss(id)}
									/>
								),
								{ duration: 6000 },
							)
						}
					>
						실제 토스트로 띄우기
					</Button>
				</div>

				<SourceTabs
					files={[
						{ filename: 'PaymentCompleteToast.tsx', code: paymentSource, lang: 'tsx' },
						{ filename: 'PaymentCompleteToast.module.css', code: paymentCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 보안 경고 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 보안 경고 토스트 (확인형)"
					description="앞선 결제 완료와 똑같은 toast.custom 방식이지만 SecurityAlertToast.module.css 만 바꿔 위험(레드) 톤으로 완전히 다르게 입혔고, 자동으로 닫히지 않고(duration: Infinity) 사용자가 '차단' 또는 '승인'을 눌러야 사라집니다. 버튼의 후속 처리는 카드가 아니라 호출부(페이지)에서 주입합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-gray-50/60 dark:bg-gray-800/30 p-6 flex flex-col items-center gap-4">
					<SecurityAlertToast
						location="서울, 대한민국"
						device="Windows · Chrome"
						time="방금 전"
						onApprove={() => {}}
						onBlock={() => {}}
					/>
					<Button
						size="sm"
						variant="outline"
						onClick={() =>
							toast.custom(
								(id) => (
									<SecurityAlertToast
										location="서울, 대한민국"
										device="Windows · Chrome"
										time="방금 전"
										onApprove={() => {
											toast.dismiss(id);
											toast.success('이 기기를 신뢰 기기로 등록했어요.');
										}}
										onBlock={() => {
											toast.dismiss(id);
											toast.error('접속을 차단하고 비밀번호 변경을 안내했어요.');
										}}
									/>
								),
								{ duration: Infinity },
							)
						}
					>
						실제 토스트로 띄우기
					</Button>
				</div>

				<SourceTabs
					files={[
						{ filename: 'SecurityAlertToast.tsx', code: securitySource, lang: 'tsx' },
						{ filename: 'SecurityAlertToast.module.css', code: securityCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
