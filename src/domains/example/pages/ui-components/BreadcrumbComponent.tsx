import { Link } from 'react-router';
import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
	BreadcrumbEllipsis,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import CustomBreadcrumb from '@/domains/example/components/ui-components/breadcrumb/CustomBreadcrumb';
import customSource from '@/domains/example/components/ui-components/breadcrumb/CustomBreadcrumb.tsx?raw';
import customCss from '@/domains/example/components/ui-components/breadcrumb/CustomBreadcrumb.module.css?raw';
import { Milestone, Home, Slash, Info } from 'lucide-react';

export default function BreadcrumbComponent(): React.ReactNode {
	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<Milestone className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Breadcrumb 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Breadcrumb(경로 탐색) 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 퍼블리셔 안내 콜아웃 ────────────────────────────── */}
			<div className="flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-900/15 p-4">
				<Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
				<div className="text-xs leading-relaxed text-amber-900 dark:text-amber-200 space-y-1">
					<p className="font-semibold">퍼블리셔 참고 — 이 컴포넌트는 "구조만" 제공합니다.</p>
					<p>
						Breadcrumb 은 색·간격 등 스타일이 거의 없는 프리미티브라, 실제 프로젝트에서는 스타일을 새로 입히는 경우가
						많습니다. 각 조각은 <code className="font-mono">data-slot</code> 속성(예{' '}
						<code className="font-mono">[data-slot="breadcrumb-link"]</code>)을 갖고 있어 전역 CSS 로 한 번에 타겟팅하거나,
						<code className="font-mono">className</code> 을 넘겨 개별로 덮어쓸 수 있습니다. 아래{' '}
						<b>6. 퍼블리셔 커스터마이징</b> 섹션에 <code className="font-mono">*.module.css</code> 로 완전히 리스타일한 실전
						예제가 있습니다.
					</p>
				</div>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Breadcrumb(래퍼 nav) > BreadcrumbList(ol) > BreadcrumbItem(li) 안에 이동 가능한 BreadcrumbLink 또는 현재 위치를 나타내는 BreadcrumbPage 를 넣고, 항목 사이에 BreadcrumbSeparator 를 둡니다."
				/>
				<CodeBlock
					code={`import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
  BreadcrumbEllipsis,
} from '@axiom/components/ui';

<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#/">홈</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>현재 페이지</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					이동 가능한 상위 경로는 <b>BreadcrumbLink</b>, 사용자가 지금 보고 있는(이동 불가) 마지막 항목은{' '}
					<b>BreadcrumbPage</b> 로 씁니다. BreadcrumbPage 에는 <code className="font-mono">aria-current="page"</code> 가
					자동으로 붙습니다. <b>BreadcrumbSeparator</b> 는 비우면 기본 <b>›</b>(ChevronRight) 아이콘을, children 을 주면 그
					내용을 구분자로 씁니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본"
					description="상위 경로는 BreadcrumbLink, 마지막(현재) 항목은 BreadcrumbPage. 구분자는 기본 아이콘을 사용합니다."
				/>
				<ExCard
					label="기본 breadcrumb"
					code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#/">홈</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#/example/ui-components/button">
        UI Components
      </BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>Breadcrumb</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
				>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#/">홈</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="#/example/ui-components/button">UI Components</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</ExCard>
			</section>

			{/* ── 2. Custom Separator ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 구분자 커스터마이징"
					description="BreadcrumbSeparator 의 children 으로 원하는 구분자를 넣습니다. 텍스트(/), 다른 아이콘 등 무엇이든 가능합니다."
				/>
				<ExCard
					label="Slash 아이콘 / 텍스트 구분자"
					code={`{/* 아이콘 구분자 */}
<BreadcrumbSeparator>
  <Slash />
</BreadcrumbSeparator>

{/* 텍스트 구분자 */}
<BreadcrumbSeparator>·</BreadcrumbSeparator>`}
				>
					<div className="flex flex-col gap-3">
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="#/">홈</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>
									<Slash />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbLink href="#/">상품</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>
									<Slash />
								</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbPage>전자제품</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
						<Breadcrumb>
							<BreadcrumbList>
								<BreadcrumbItem>
									<BreadcrumbLink href="#/">홈</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>·</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbLink href="#/">상품</BreadcrumbLink>
								</BreadcrumbItem>
								<BreadcrumbSeparator>·</BreadcrumbSeparator>
								<BreadcrumbItem>
									<BreadcrumbPage>전자제품</BreadcrumbPage>
								</BreadcrumbItem>
							</BreadcrumbList>
						</Breadcrumb>
					</div>
				</ExCard>
			</section>

			{/* ── 3. With Icon ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 아이콘 포함"
					description="BreadcrumbLink / BreadcrumbPage 안에 아이콘을 함께 넣어 시각적 힌트를 줍니다. (예: 홈 아이콘)"
				/>
				<ExCard
					label="Home 아이콘 + 텍스트"
					code={`<BreadcrumbItem>
  <BreadcrumbLink href="#/" className="flex items-center gap-1.5">
    <Home className="w-4 h-4" />
    홈
  </BreadcrumbLink>
</BreadcrumbItem>`}
				>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink
									href="#/"
									className="flex items-center gap-1.5"
								>
									<Home className="w-4 h-4" />
									홈
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="#/">설정</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>프로필</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</ExCard>
			</section>

			{/* ── 4. Ellipsis ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 생략(Ellipsis) — 경로가 길 때"
					description="경로가 깊어 모두 표시하기 어려울 때, 중간 항목을 BreadcrumbEllipsis(…) 로 접어 처음과 끝만 보여줍니다."
				/>
				<ExCard
					label="BreadcrumbEllipsis"
					code={`<Breadcrumb>
  <BreadcrumbList>
    <BreadcrumbItem>
      <BreadcrumbLink href="#/">홈</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbEllipsis />
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbLink href="#/">문서</BreadcrumbLink>
    </BreadcrumbItem>
    <BreadcrumbSeparator />
    <BreadcrumbItem>
      <BreadcrumbPage>현재 문서</BreadcrumbPage>
    </BreadcrumbItem>
  </BreadcrumbList>
</Breadcrumb>`}
				>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink href="#/">홈</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbEllipsis />
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink href="#/">문서</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>현재 문서</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</ExCard>
			</section>

			{/* ── 5. Router 연동 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 라우터 연동 — asChild + React Router Link"
					description="BreadcrumbLink 는 기본적으로 <a> 를 렌더합니다. asChild 를 주면 자식 엘리먼트(예: react-router 의 Link)에 스타일만 위임해, SPA 라우팅(새로고침 없는 이동)을 그대로 사용할 수 있습니다."
				/>
				<div className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-500/25 dark:bg-blue-900/15 px-3 py-2 text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
					이 앱은 <code className="font-mono">createHashRouter</code> 를 사용하므로 순수 <code className="font-mono">&lt;a&gt;</code>{' '}
					대신 <code className="font-mono">Link</code>(<code className="font-mono">to</code>) 로 이동하는 것을 권장합니다.
				</div>
				<ExCard
					label="asChild + <Link to>"
					code={`import { Link } from 'react-router';

<BreadcrumbItem>
  <BreadcrumbLink asChild>
    <Link to="/example/ui-components/button">버튼</Link>
  </BreadcrumbLink>
</BreadcrumbItem>`}
				>
					<Breadcrumb>
						<BreadcrumbList>
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/">홈</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbLink asChild>
									<Link to="/example/ui-components/button">버튼</Link>
								</BreadcrumbLink>
							</BreadcrumbItem>
							<BreadcrumbSeparator />
							<BreadcrumbItem>
								<BreadcrumbPage>Breadcrumb</BreadcrumbPage>
							</BreadcrumbItem>
						</BreadcrumbList>
					</Breadcrumb>
				</ExCard>
			</section>

			{/* ── 6. 퍼블리셔 커스터마이징 (실전 예제) ────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 퍼블리셔 커스터마이징 — 실전 예제"
					description="같은 프리미티브에 *.module.css 만 입혀 완전히 다른 룩앤필(알약형 그라데이션 바 + 슬래시 구분자)로 만든 예제입니다. 구조는 그대로 두고 className 만 넘겼습니다. 실제 SI 프로젝트에서는 이렇게 CSS Module 파일만 교체해 디자인을 바꿉니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm">
					<CustomBreadcrumb />
				</div>

				<SourceTabs
					files={[
						{ filename: 'CustomBreadcrumb.tsx', code: customSource, lang: 'tsx' },
						{ filename: 'CustomBreadcrumb.module.css', code: customCss, lang: 'css' },
					]}
				/>

				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					전역 CSS 에서 <code className="font-mono">[data-slot="breadcrumb-link"]</code> 같은 셀렉터로 한 번에 스타일을 잡을
					수도 있습니다. 다만 스코프가 확실한 <code className="font-mono">*.module.css</code> + <code className="font-mono">className</code>{' '}
					방식이 다른 화면에 영향이 없어 안전합니다.
				</p>
			</section>

			{/* ── Props / 구성요소 요약 테이블 ─────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="구성 요소 요약" />
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">컴포넌트</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">렌더 태그</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">주요 prop</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ c: 'Breadcrumb', tag: '<nav>', prop: 'className', desc: '전체 래퍼. aria-label="breadcrumb" 포함' },
								{ c: 'BreadcrumbList', tag: '<ol>', prop: 'className', desc: '항목들을 담는 정렬 목록(가로 flex)' },
								{ c: 'BreadcrumbItem', tag: '<li>', prop: 'className', desc: '개별 항목 래퍼' },
								{
									c: 'BreadcrumbLink',
									tag: '<a> / asChild',
									prop: 'asChild, href',
									desc: '이동 가능한 상위 경로. asChild 로 Link 등에 위임 가능',
								},
								{
									c: 'BreadcrumbPage',
									tag: '<span>',
									prop: 'className',
									desc: '현재 위치(이동 불가). aria-current="page" 자동',
								},
								{
									c: 'BreadcrumbSeparator',
									tag: '<li>',
									prop: 'children',
									desc: '항목 구분자. 비우면 기본 › 아이콘',
								},
								{
									c: 'BreadcrumbEllipsis',
									tag: '<span>',
									prop: 'className',
									desc: '생략(…) 표시. 경로가 길 때 중간 접기',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.c}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.tag}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.prop}</code>
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
