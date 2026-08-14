import { CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import AppErrorBoundary from '@/domains/example/components/templates/error/AppErrorBoundary';
import CrashDemo from '@/domains/example/components/templates/error/CrashDemo';
import NotFoundView from '@/domains/example/components/templates/error/NotFoundView';
import errorStateViewSource from '@/domains/example/components/templates/error/ErrorStateView.tsx?raw';
import notFoundViewSource from '@/domains/example/components/templates/error/NotFoundView.tsx?raw';
import routeErrorViewSource from '@/domains/example/components/templates/error/RouteErrorView.tsx?raw';
import appErrorBoundarySource from '@/domains/example/components/templates/error/AppErrorBoundary.tsx?raw';
import { ShieldAlert } from 'lucide-react';

const LAYERS = [
	{
		layer: '① 없는 주소',
		where: '라우터 path: "*"',
		catches: '어떤 라우트에도 매칭되지 않은 경로',
		file: 'NotFoundView.tsx',
	},
	{
		layer: '② 라우트 에러',
		where: '라우터 errorElement',
		catches: 'loader · action · 라우트 컴포넌트 렌더 중 던져진 에러',
		file: 'RouteErrorView.tsx',
	},
	{
		layer: '③ 렌더 에러',
		where: '<AppErrorBoundary>',
		catches: '화면 일부(위젯·표·차트) 렌더 중 던져진 에러',
		file: 'AppErrorBoundary.tsx',
	},
	{
		layer: '④ 통신 에러',
		where: 'useApi 반환값',
		catches: 'API 응답 실패 — 에러가 아니라 "상태"로 다룬다',
		file: 'isError / error / refetch',
	},
	{
		layer: '⑤ 핸들러 에러',
		where: 'try / catch',
		catches: '이벤트 핸들러 · setTimeout · async 콜백 — 경계가 잡지 못한다',
		file: '$ui.alert',
	},
];

const CURRENT_ROUTER_CODE = `// src/shared/router/index.tsx — 현재 상태
{
  path: '*',
  element: <RootLayout />,   // ← children 이 없어 Outlet 자리가 비어 있다.
},                           //   오타 주소로 들어오면 헤더·사이드바만 뜨고 본문은 백지다.`;

const WIRED_ROUTER_CODE = `// src/shared/router/index.tsx — 404 화면 연결
import NotFoundView from '@/shared/components/error/NotFoundView';

{
  path: '*',
  element: <RootLayout />,
  // RootLayout 의 <Outlet /> 자리에 404 본문이 들어간다.
  // 레이아웃 안에 두면 헤더·사이드바가 유지돼 사용자가 바로 다른 메뉴로 이동할 수 있다.
  children: [{ index: true, element: <NotFoundView /> }],
},`;

const ERROR_ELEMENT_CODE = `// src/shared/router/index.tsx — 라우트 에러 화면 연결
import RouteErrorView from '@/shared/components/error/RouteErrorView';

const routes: TAppRoute[] = [
  {
    path: '/',
    element: <RootLayout />,
    errorElement: <RouteErrorView />,   // ← 이 아래 라우트에서 던져진 에러를 여기서 받는다
    children: MainRouter,
  },
  {
    path: '/example',
    element: <RootLayout />,
    errorElement: <RouteErrorView />,   // 도메인별로 다른 에러 화면을 줄 수도 있다
    children: ExampleRouter,
  },
];

// errorElement 를 지정한 라우트가 하나도 없으면 React Router 의 기본 에러 화면
// (흰 배경에 스택이 그대로 노출되는 개발자용 화면)이 사용자에게 그대로 보인다.`;

const ROUTE_ERROR_CODE = `export default function RouteErrorView(): React.ReactNode {
  const error = useRouteError();

  // 1) 라우터가 만든 응답 에러 — 상태 코드로 분기한다.
  if (isRouteErrorResponse(error)) {
    if (error.status === 404) return <NotFoundView />;
    const title = error.status === 401 || error.status === 403
      ? '접근 권한이 없습니다'
      : '요청을 처리하지 못했습니다';
    return <ErrorStateView code={String(error.status)} title={title} /* … */ />;
  }

  // 2) 그 외 — 코드에서 던져진 일반 Error.
  //    사용자에게는 같은 문구를 주고, 원인은 개발 모드에서만 노출한다.
  return <ErrorStateView title="문제가 발생했습니다" detail={/* … */} /* … */ />;
}`;

const BOUNDARY_CODE = `// 화면 전체가 아니라 "터질 수 있는 부분"만 감싼다.
// 위젯 하나가 터져도 나머지 화면은 그대로 살아 있다.
<AppErrorBoundary
  resetKey={location.pathname}                       // 경로가 바뀌면 자동으로 에러 해제
  onError={(error, info) => reportToSentry(error, info)}
>
  <SalesWidget />
</AppErrorBoundary>

// fallback 으로 화면을 직접 그릴 수도 있다.
<AppErrorBoundary
  fallback={(error, reset) => (
    <div>
      <p>{error.message}</p>
      <Button onClick={reset}>다시 시도</Button>
    </div>
  )}
>
  <SalesWidget />
</AppErrorBoundary>`;

const BOUNDARY_CLASS_CODE = `// 에러 경계는 클래스로만 만들 수 있다.
// getDerivedStateFromError / componentDidCatch 에 대응하는 훅이 아직 없다.
export default class AppErrorBoundary extends Component<IAppErrorBoundaryProps, IAppErrorBoundaryState> {
  state: IAppErrorBoundaryState = { error: null };

  /** 렌더 중 에러가 나면 state 를 갱신해 다음 렌더에서 fallback 을 그린다. */
  static getDerivedStateFromError(error: Error): IAppErrorBoundaryState {
    return { error };
  }

  /** 화면 갱신과 무관한 부수효과(로깅·리포팅)는 여기서 한다. */
  componentDidCatch(error: Error, info: ErrorInfo): void {
    this.props.onError?.(error, info);
  }

  /** resetKey(보통 현재 경로)가 바뀌면 에러 상태를 자동으로 푼다. */
  componentDidUpdate(prevProps: IAppErrorBoundaryProps): void {
    if (this.state.error && prevProps.resetKey !== this.props.resetKey) this.reset();
  }
}`;

const API_ERROR_CODE = `// API 실패는 "예외"가 아니라 "상태"다. throw 하지 말고 화면 분기로 다룬다.
const { data, isLoading, isError, error, refetch } = useApi<Order[]>('/api/orders');

if (isLoading) return <TransactionListSkeleton />;

if (isError) {
  return (
    <ErrorStateView
      title="목록을 불러오지 못했습니다"
      description="네트워크 상태를 확인한 뒤 다시 시도해 주세요."
      detail={error.message}
      actions={<Button onClick={() => refetch()}>다시 시도</Button>}
    />
  );
}

// 참고 — TanStack Query 의 에러는 기본적으로 에러 경계로 올라가지 않는다.
// 굳이 경계에서 받고 싶다면 queryOptions 에 throwOnError 를 켠다.
const { data } = useApi<Order[]>('/api/orders', {
  queryOptions: { throwOnError: true },
});`;

const HANDLER_ERROR_CODE = `// 에러 경계는 "렌더 중" 에러만 잡는다.
// 이벤트 핸들러 · setTimeout · async 콜백에서 던져진 에러는 렌더 경로가 아니라 그대로 흘러나간다.
const handleDelete = async () => {
  const ok = await $ui.confirm('정말 삭제하시겠습니까?');
  if (!ok) return;

  try {
    await mutateAsync(id);
    await $ui.alert({ type: 'success', message: '삭제되었습니다.' });
  } catch (error) {
    // 사용자에게는 조치할 수 있는 문구를, 콘솔에는 원인을 남긴다.
    console.error(error);
    await $ui.alert({ type: 'error', message: '삭제하지 못했습니다. 잠시 후 다시 시도해 주세요.' });
  }
};`;

const CHECKLIST = [
	{
		item: '스택 노출 금지',
		desc: '에러 메시지·스택은 import.meta.env.DEV 로 감싼다. 운영 화면에 흘리면 내부 구조와 경로가 그대로 드러난다.',
	},
	{
		item: '다음 행동 제시',
		desc: '"오류가 발생했습니다"로 끝내지 않는다. 새로고침·홈으로·다시 시도 중 최소 하나는 반드시 준다.',
	},
	{
		item: '레이아웃 유지',
		desc: '404·에러 화면을 RootLayout 안에 둔다. 헤더·사이드바가 살아 있어야 사용자가 다른 메뉴로 빠져나간다.',
	},
	{
		item: 'resetKey',
		desc: '경계에 현재 경로를 넘긴다. 없으면 사용자가 메뉴를 눌러 이동해도 에러 화면에 갇힌다.',
	},
	{
		item: '경계의 범위',
		desc: '앱 전체를 하나로 감싸면 위젯 하나 때문에 전 화면이 죽는다. 터질 수 있는 영역 단위로 잘게 감싼다.',
	},
	{
		item: '통신 에러는 상태로',
		desc: 'API 실패를 throw 로 올리지 말고 isError 분기로 다룬다. 그래야 refetch 로 그 자리에서 복구할 수 있다.',
	},
	{
		item: '핸들러는 try/catch',
		desc: '이벤트 핸들러·async 콜백은 경계가 잡지 못한다. 직접 잡아 $ui.alert 로 사용자에게 알린다.',
	},
	{
		item: '리포팅 연결',
		desc: 'onError 를 비워두지 않는다. 사용자가 본 에러를 개발자가 모르면 고칠 수 없다.',
	},
];

export default function ErrorTemplate(): React.ReactNode {
	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-rose-50 dark:bg-rose-900/20">
					<ShieldAlert className="w-5 h-5 text-rose-600 dark:text-rose-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">에러 처리 &amp; 404</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						없는 주소 · 라우트 에러 · 렌더 에러 · 통신 에러를 각각 어디서 잡고 무엇을 보여줄지 정리한 템플릿입니다.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 ───────────────────────────────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					<strong className="font-semibold">아직 앱에 연결돼 있지 않습니다</strong> — 이 페이지의 컴포넌트들은 예제
					도메인 안에 있고, <code className="font-mono">src/shared/router/index.tsx</code> 는 그대로입니다. 지금
					존재하지 않는 주소로 들어가면 <b>헤더·사이드바만 뜨고 본문은 백지</b>입니다. 아래 2·3번의 연결 코드를 적용하면
					그때부터 동작합니다. 실제로 쓸 때는 컴포넌트를 <code className="font-mono">src/shared/components/error/</code>{' '}
					로 옮기세요. 예제 도메인은 개발 참고용이라 프로젝트 정리 시 통째로 지워지는 자리입니다.
				</p>
			</div>

			{/* ── 1. 에러는 어디서 잡히나 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 에러는 다섯 층에서 잡힌다"
					description="'에러 처리'는 한 곳에서 끝나지 않습니다. 어디서 발생한 에러인지에 따라 잡히는 자리가 다르고, 한 층이 다른 층을 대신해 주지 않습니다. 특히 ⑤는 어떤 경계도 잡아주지 않는다는 점을 기억하세요."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs w-28">
									계층
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs w-40">
									잡는 자리
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">대상</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{LAYERS.map((row) => (
								<tr
									key={row.layer}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5 text-xs font-medium whitespace-nowrap text-gray-700 dark:text-gray-300">
										{row.layer}
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-rose-700 dark:text-rose-400">{row.where}</code>
									</td>
									<td className="px-4 py-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">
										{row.catches}
										<span className="ml-1.5 font-mono text-[10px] text-gray-400 dark:text-gray-500">{row.file}</span>
									</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── 2. 404 ───────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 없는 주소 — 404 화면"
					description="사용자는 오타나 만료된 링크로 이 화면에 닿습니다. '없다'고만 말하고 끝내면 사용자는 브라우저 뒤로가기 말고 할 수 있는 게 없습니다. 다음에 갈 곳을 반드시 함께 주세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							NotFoundView 미리보기 — 버튼은 실제로 동작합니다 (이 페이지를 벗어납니다)
						</span>
					</div>
					<NotFoundView className="min-h-80" />
				</div>

				<CodeBlock
					code={CURRENT_ROUTER_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<CodeBlock
					code={WIRED_ROUTER_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 3. 라우트 에러 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 라우트 에러 — errorElement"
					description="라우트를 렌더하는 도중 던져진 에러는 errorElement 가 받습니다. 지정하지 않으면 React Router 의 기본 에러 화면(흰 배경에 스택이 그대로 보이는 개발자용 화면)이 사용자에게 그대로 노출됩니다."
				/>
				<CodeBlock
					code={ERROR_ELEMENT_CODE}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">
					에러는 두 종류로 나뉩니다. <code className="font-mono">isRouteErrorResponse</code> 가 참이면 라우터가 만든
					HTTP 형태의 응답 에러(404 · 401 · 500)이므로 <b>상태 코드별로 문구를 다르게</b> 줍니다. 아니면 코드에서 던져진
					일반 <code className="font-mono">Error</code> 이므로 사용자에게는 같은 문구를 주고 원인은 개발 모드에서만
					노출합니다.
				</p>
				<CodeBlock
					code={ROUTE_ERROR_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 4. 렌더 에러 (라이브) ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 렌더 에러 — AppErrorBoundary (라이브 데모)"
					description="errorElement 는 라우트 단위라 화면 전체가 대체됩니다. 화면 일부만 격리하고 싶을 때는 그 부분만 경계로 감쌉니다. 아래 왼쪽 위젯에서 에러를 일으켜 보세요. 오른쪽 위젯과 이 페이지 나머지는 그대로 살아 있습니다."
				/>

				<div className="grid gap-3 sm:grid-cols-2">
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
						<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
							<span className="text-xs font-medium text-gray-600 dark:text-gray-400">경계로 감싼 위젯</span>
						</div>
						<AppErrorBoundary onError={(error) => console.warn('[demo] 경계가 에러를 잡았습니다:', error.message)}>
							<CrashDemo />
						</AppErrorBoundary>
					</div>

					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
						<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
							<span className="text-xs font-medium text-gray-600 dark:text-gray-400">옆 위젯 (영향 없음)</span>
						</div>
						<div className="flex min-h-40 items-center justify-center px-6 py-8 text-center">
							<p className="text-xs text-gray-500 dark:text-gray-400">
								왼쪽이 터져도 이 영역은 계속 정상 렌더됩니다. 경계를 잘게 나눠 감싸는 이유입니다.
							</p>
						</div>
					</div>
				</div>

				<CodeBlock
					code={BOUNDARY_CODE}
					lang="tsx"
					theme="github-dark"
				/>

				<div className="rounded-xl border border-rose-200 dark:border-rose-800/50 bg-rose-50 dark:bg-rose-900/15 px-4 py-3">
					<p className="text-xs leading-relaxed text-rose-800 dark:text-rose-300">
						<strong className="font-semibold">에러 경계만은 클래스 컴포넌트입니다</strong> — 이 프로젝트의 컴포넌트는
						모두 <code className="font-mono">export default function</code> 으로 작성하지만, 에러 경계는{' '}
						<code className="font-mono">getDerivedStateFromError</code> ·{' '}
						<code className="font-mono">componentDidCatch</code> 에 대응하는 훅이 아직 없어 클래스로만 만들 수 있습니다.
						한 번 만들어 두고 계속 재사용하면 되는 파일이라 실무에서 문제가 되지 않습니다.
					</p>
				</div>

				<CodeBlock
					code={BOUNDARY_CLASS_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 5. 통신 에러 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 통신 에러 — 예외가 아니라 상태로 다룬다"
					description="API 실패를 throw 로 올려 경계에서 받으면 화면 전체가 대체되고, 사용자는 그 자리에서 다시 시도할 방법을 잃습니다. isError 분기로 다뤄야 refetch 버튼을 같은 자리에 놓을 수 있습니다."
				/>
				<CodeBlock
					code={API_ERROR_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 6. 핸들러 에러 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 이벤트 핸들러 에러 — 경계가 잡지 못한다"
					description="가장 자주 놓치는 지점입니다. 에러 경계는 '렌더 중' 에러만 잡습니다. onClick·setTimeout·async 콜백에서 던져진 에러는 렌더 경로가 아니므로 아무도 잡지 않고 콘솔로 흘러나갑니다. 사용자는 버튼을 눌렀는데 아무 일도 일어나지 않는 화면을 보게 됩니다."
				/>
				<CodeBlock
					code={HANDLER_ERROR_CODE}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 7. 소스 코드 ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 소스 코드"
					description="네 파일을 src/shared/components/error/ 로 복사하면 그대로 쓸 수 있습니다. 표현(ErrorStateView) 하나에 상황별 컴포넌트 셋이 얹힌 구조라, 디자인을 바꿀 때 고칠 파일은 ErrorStateView 하나뿐입니다."
				/>
				<SourceTabs
					files={[
						{ filename: 'ErrorStateView.tsx', code: errorStateViewSource, lang: 'tsx' },
						{ filename: 'NotFoundView.tsx', code: notFoundViewSource, lang: 'tsx' },
						{ filename: 'RouteErrorView.tsx', code: routeErrorViewSource, lang: 'tsx' },
						{ filename: 'AppErrorBoundary.tsx', code: appErrorBoundarySource, lang: 'tsx' },
					]}
				/>
			</section>

			{/* ── 8. 체크리스트 ────────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="8. 에러 처리 체크리스트"
					description="대부분 사고가 난 뒤에야 확인하게 되는 항목들입니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs w-40">
									항목
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									확인 내용
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{CHECKLIST.map((row) => (
								<tr
									key={row.item}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-rose-700 dark:text-rose-400">{row.item}</code>
									</td>
									<td className="px-4 py-2.5 text-xs leading-relaxed text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>
		</div>
	);
}
