import { Link } from 'react-router';
import { Button, Badge, Card, CodeBlock } from '@axiom/components/ui';
import heroImg from '@/assets/hero.png';
import {
	ArrowRight,
	BookOpen,
	Boxes,
	Palette,
	Database,
	Route,
	Layers,
	FlaskConical,
	FileCode,
	Component,
	Sparkles,
} from 'lucide-react';

/** GitHub 마크 (lucide v1에서 브랜드 아이콘이 제거되어 인라인 처리) */
function GithubMark(props: React.SVGProps<SVGSVGElement>) {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="currentColor"
			aria-hidden="true"
			{...props}
		>
			<path d="M12 .5C5.73.5.5 5.73.5 12c0 5.08 3.29 9.39 7.86 10.91.58.11.79-.25.79-.56 0-.27-.01-1.16-.02-2.1-3.2.7-3.88-1.36-3.88-1.36-.52-1.33-1.28-1.68-1.28-1.68-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.67 0-1.25.45-2.28 1.18-3.08-.12-.29-.51-1.46.11-3.05 0 0 .96-.31 3.15 1.18a10.95 10.95 0 0 1 5.74 0c2.18-1.49 3.14-1.18 3.14-1.18.62 1.59.23 2.76.11 3.05.74.8 1.18 1.83 1.18 3.08 0 4.4-2.69 5.37-5.25 5.66.41.36.78 1.06.78 2.14 0 1.55-.01 2.8-.01 3.18 0 .31.21.68.8.56A11.51 11.51 0 0 0 23.5 12C23.5 5.73 18.27.5 12 .5z" />
		</svg>
	);
}

/** 가이드 문서 / 저장소 링크 */
const GUIDE_URL = 'http://redsky02122.dothome.co.kr/guide/docs/started/getting-started/overview';
const GITHUB_URL = 'https://github.com/nic-company-single-react/react-app-scaffold.git';
const STORYBOOK_URL = 'http://localhost:6006';

/** 스타터에 기본 탑재된 스택 */
const techStack = [
	{
		icon: FileCode,
		name: 'TypeScript',
		desc: '엄격한 타입 설정과 경로 별칭(@/…)이 구성되어 있습니다.',
	},
	{
		icon: Palette,
		name: 'Tailwind CSS v4',
		desc: 'Design Token 기반 테마와 다크모드가 연동되어 있습니다.',
	},
	{
		icon: Component,
		name: 'shadcn/ui',
		desc: 'Button·Card·Table 등 접근성 컴포넌트가 준비되어 있습니다.',
	},
	{
		icon: Database,
		name: 'TanStack Query',
		desc: 'API 캐싱·동기화와 Devtools가 세팅되어 있습니다.',
	},
	{
		icon: Boxes,
		name: 'Zustand',
		desc: '가벼운 전역 클라이언트 상태 관리가 포함되어 있습니다.',
	},
	{
		icon: Route,
		name: 'React Router v7',
		desc: '도메인 단위 라우팅 구조가 잡혀 있습니다.',
	},
	{
		icon: Layers,
		name: 'Storybook',
		desc: '컴포넌트 문서화와 a11y 검사 애드온이 설치되어 있습니다.',
	},
	{
		icon: FlaskConical,
		name: 'Vitest',
		desc: '브라우저 모드 테스트 환경이 구성되어 있습니다.',
	},
];

/** 바로 둘러볼 수 있는 예제 경로 */
const exploreLinks = [
	{
		to: '/example/ui-components/button',
		icon: Component,
		title: 'UI Components',
		desc: 'Button·Badge·Table 등 컴포넌트 사용 예제',
		external: false,
	},
	{
		to: '/example/use-api',
		icon: Database,
		title: 'API Examples',
		desc: 'useApi 훅으로 데이터를 다루는 패턴',
		external: false,
	},
	{
		to: STORYBOOK_URL,
		icon: Layers,
		title: 'Storybook',
		desc: 'npm run storybook 으로 컴포넌트 문서 보기',
		external: true,
	},
];

const quickStartCode = `# 1. 작업할 폴더에서 저장소 클론
git clone <repository-url> my-app
cd my-app

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행
npm run dev`;

export default function MainIndex(): React.ReactNode {
	return (
		<div className="p-6 space-y-10 max-w-5xl">
			{/* ── Hero ─────────────────────────────────────────────── */}
			<section className="relative overflow-hidden rounded-2xl border border-gray-200 bg-linear-to-br from-brand-50 via-white to-blue-light-50 px-6 py-10 sm:px-10 dark:border-gray-800 dark:from-brand-950/30 dark:via-gray-900 dark:to-brand-900/20">
				<div className="flex flex-col items-start gap-6 sm:flex-row sm:items-center sm:justify-between">
					<div className="max-w-xl space-y-4">
						<Badge
							variant="secondary"
							className="gap-1.5"
						>
							<Sparkles className="size-3" />
							v1 · React 19 + Vite
						</Badge>
						<h1 className="text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl dark:text-white">
							React App Scaffold
						</h1>
						<p className="text-sm leading-relaxed text-gray-600 sm:text-base dark:text-gray-400">
							프로젝트를 곧바로 시작할 수 있도록 라우팅·상태관리·UI 컴포넌트·디자인 토큰·테스트까지 갖춘 React
							스타터입니다. 아래 가이드를 따라 사이트에 맞게 커스터마이징한 뒤 프론트엔드 작업을 시작하세요.
						</p>
						<div className="flex flex-wrap items-center gap-3 pt-1">
							<Button
								size="lg"
								asChild
							>
								<a
									href={GUIDE_URL}
									target="_blank"
									rel="noreferrer"
								>
									<BookOpen /> 시작 가이드 보기
								</a>
							</Button>
							<Button
								size="lg"
								variant="outline"
								asChild
							>
								<a
									href={GITHUB_URL}
									target="_blank"
									rel="noreferrer"
								>
									<GithubMark className="size-4" /> GitHub
								</a>
							</Button>
						</div>
					</div>
					<img
						src={heroImg}
						alt="React App Scaffold"
						className="hidden w-40 shrink-0 drop-shadow-xl sm:block lg:w-52"
					/>
				</div>
			</section>

			{/* ── Quick Start ──────────────────────────────────────── */}
			<section className="space-y-4">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">Quick Start</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						클론 후 세 단계면 로컬 개발 서버가 뜹니다. 기본 포트는{' '}
						<code className="rounded border border-gray-200 bg-gray-100 px-1.5 py-0.5 text-xs font-mono text-gray-700 dark:border-gray-700 dark:bg-gray-800 dark:text-gray-300">
							5173
						</code>{' '}
						입니다.
					</p>
				</div>
				<CodeBlock
					code={quickStartCode}
					lang="bash"
					filename="terminal"
				/>
			</section>

			{/* ── What's included ──────────────────────────────────── */}
			<section className="space-y-4">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">기본 탑재 스택</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						아래 도구들이 이미 설치·설정되어 있어 별도 세팅 없이 바로 사용할 수 있습니다.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
					{techStack.map(({ icon: Icon, name, desc }) => (
						<Card
							key={name}
							size="sm"
							className="gap-2 p-4"
						>
							<div className="flex size-9 items-center justify-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-900/30 dark:text-brand-400">
								<Icon className="size-5" />
							</div>
							<div className="space-y-1">
								<p className="font-medium text-gray-900 dark:text-white">{name}</p>
								<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
							</div>
						</Card>
					))}
				</div>
			</section>

			{/* ── Explore ──────────────────────────────────────────── */}
			<section className="space-y-4">
				<div className="space-y-1">
					<h2 className="text-xl font-semibold text-gray-900 dark:text-white">둘러보기</h2>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						사이드바의 예제들을 살펴보며 컴포넌트와 데이터 패턴을 익혀 보세요.
					</p>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
					{exploreLinks.map(({ to, icon: Icon, title, desc, external }) => {
						const inner = (
							<Card className="group h-full gap-3 p-5 transition-colors hover:ring-brand-400/50 dark:hover:ring-brand-500/40">
								<div className="flex items-center justify-between">
									<div className="flex size-9 items-center justify-center rounded-lg bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-300">
										<Icon className="size-5" />
									</div>
									<ArrowRight className="size-4 text-gray-400 transition-transform group-hover:translate-x-0.5 group-hover:text-brand-500" />
								</div>
								<div className="space-y-1">
									<p className="font-medium text-gray-900 dark:text-white">{title}</p>
									<p className="text-xs leading-relaxed text-gray-500 dark:text-gray-400">{desc}</p>
								</div>
							</Card>
						);
						return external ? (
							<a
								key={title}
								href={to}
								target="_blank"
								rel="noreferrer"
							>
								{inner}
							</a>
						) : (
							<Link
								key={title}
								to={to}
							>
								{inner}
							</Link>
						);
					})}
				</div>
			</section>
		</div>
	);
}
