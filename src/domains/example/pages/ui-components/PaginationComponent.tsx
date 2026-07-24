import { useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import CustomPagination from '@/domains/example/components/ui-components/pagination/CustomPagination';
import customSource from '@/domains/example/components/ui-components/pagination/CustomPagination.tsx?raw';
import customCss from '@/domains/example/components/ui-components/pagination/CustomPagination.module.css?raw';
import { GalleryHorizontalEnd, Info } from 'lucide-react';

/**
 * 현재 페이지 주변만 노출하고 멀어진 구간은 'ellipsis'(…) 로 접는 범위를 만든다.
 * 컴포넌트가 아닌 순수 헬퍼 함수이므로 페이지 파일 안에 두어도 된다.
 */
function buildPageRange(current: number, total: number, sibling = 1): (number | 'ellipsis')[] {
	const range: (number | 'ellipsis')[] = [];
	for (let p = 1; p <= total; p++) {
		if (p === 1 || p === total || Math.abs(p - current) <= sibling) {
			range.push(p);
		} else if (range[range.length - 1] !== 'ellipsis') {
			range.push('ellipsis');
		}
	}
	return range;
}

export default function PaginationComponent(): React.ReactNode {
	// 4. 인터랙티브 예제용 상태
	const totalPages = 10;
	const [page, setPage] = useState(1);

	const goTo = (p: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		if (p >= 1 && p <= totalPages) setPage(p);
	};

	const pageRange = buildPageRange(page, totalPages);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<GalleryHorizontalEnd className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Pagination 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Pagination(페이지 이동) 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 퍼블리셔 안내 콜아웃 ────────────────────────────── */}
			<div className="flex gap-3 rounded-xl border border-amber-300/60 bg-amber-50/70 dark:border-amber-500/30 dark:bg-amber-900/15 p-4">
				<Info className="w-5 h-5 shrink-0 text-amber-600 dark:text-amber-400 mt-0.5" />
				<div className="text-xs leading-relaxed text-amber-900 dark:text-amber-200 space-y-1">
					<p className="font-semibold">퍼블리셔 참고 — 이 컴포넌트는 "구조와 동작"을 제공합니다.</p>
					<p>
						Pagination 은 페이지 목록·이전/다음·생략(…) 의 마크업 골격만 제공하고, 어느 페이지가 활성인지·클릭 시 무엇을 할지는
						사용하는 쪽에서 정합니다. 색·모양은 실제 프로젝트마다 크게 달라지므로, 각 조각은{' '}
						<code className="font-mono">data-slot</code> 속성(예 <code className="font-mono">[data-slot="pagination-link"]</code>)을
						갖고 있어 전역 CSS 로 한 번에 타겟팅하거나 <code className="font-mono">className</code> 으로 개별로 덮어쓸 수 있습니다.
						아래 <b>5. 퍼블리셔 커스터마이징</b> 섹션에 <code className="font-mono">*.module.css</code> 로 완전히 리스타일한 실전
						예제가 있습니다.
					</p>
				</div>
			</div>

			{/* ── 라우팅 주의 콜아웃 ──────────────────────────────── */}
			<div className="rounded-lg border border-blue-200/60 bg-blue-50/60 dark:border-blue-500/25 dark:bg-blue-900/15 px-3 py-2 text-xs text-blue-800 dark:text-blue-200 leading-relaxed">
				<b>중요</b> — <code className="font-mono">PaginationLink</code> 는 내부적으로 <code className="font-mono">&lt;a href&gt;</code>{' '}
				를 렌더합니다. 이 앱은 <code className="font-mono">createHashRouter</code> 를 사용하므로, 링크에{' '}
				<code className="font-mono">href="#"</code> 를 그대로 두면 해시 라우트가 깨집니다. 아래 예제처럼{' '}
				<code className="font-mono">onClick</code> 에서 <code className="font-mono">e.preventDefault()</code> 로 기본 이동을 막고
				상태(현재 페이지)만 바꾸거나, <code className="font-mono">asChild</code> 로 react-router 의{' '}
				<code className="font-mono">Link</code> 에 위임하세요.
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Pagination(래퍼 nav) > PaginationContent(ul) 안에 PaginationItem(li) 들을 넣고, 그 안에 이동 링크(PaginationLink) · 이전/다음(PaginationPrevious / PaginationNext) · 생략(PaginationEllipsis) 을 조합합니다."
				/>
				<CodeBlock
					code={`import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from '@axiom/components/ui';

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					현재 페이지는 <b>PaginationLink</b> 에 <b>isActive</b> 를 주어 표시합니다(<code className="font-mono">outline</code> 변형으로
					바뀌고 <code className="font-mono">aria-current="page"</code> 가 자동으로 붙습니다). <b>PaginationPrevious / PaginationNext</b>{' '}
					는 <b>text</b> prop 으로 라벨을 바꿀 수 있고, 좁은 화면에서는 라벨이 숨겨지고 아이콘만 남습니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본"
					description="가장 기본적인 형태. 현재 페이지에 isActive 를 주고, 앞뒤로 이전/다음 버튼을 둡니다."
				/>
				<ExCard
					label="기본 pagination"
					code={`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>2</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">3</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
				>
					<div className="w-full">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										isActive
										onClick={(e) => e.preventDefault()}
									>
										2
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										3
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</ExCard>
			</section>

			{/* ── 2. Ellipsis ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 생략(Ellipsis) — 페이지가 많을 때"
					description="페이지 수가 많아 모두 나열하기 어려울 때, 중간 구간을 PaginationEllipsis(…) 로 접어 처음/현재 주변/끝만 보여줍니다."
				/>
				<ExCard
					label="PaginationEllipsis"
					code={`<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious href="#" />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">1</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">4</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#" isActive>5</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">6</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationEllipsis />
    </PaginationItem>
    <PaginationItem>
      <PaginationLink href="#">20</PaginationLink>
    </PaginationItem>
    <PaginationItem>
      <PaginationNext href="#" />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
				>
					<div className="w-full">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										4
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										isActive
										onClick={(e) => e.preventDefault()}
									>
										5
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										6
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationEllipsis />
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										20
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href="#"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 라벨 커스터마이징 ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 이전/다음 라벨 커스터마이징 (text prop)"
					description="PaginationPrevious / PaginationNext 는 text prop 으로 라벨 문구를 바꿉니다. 라벨을 지우면(빈 문자열) 아이콘만 남는 콤팩트한 형태가 됩니다."
				/>
				<ExCard
					label='text="이전" / text="다음" · 아이콘만'
					code={`{/* 한글 라벨 */}
<PaginationPrevious href="#" text="이전" />
<PaginationNext href="#" text="다음" />

{/* 라벨 없이 아이콘만 */}
<PaginationPrevious href="#" text="" />
<PaginationNext href="#" text="" />`}
				>
					<div className="w-full flex flex-col gap-4">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										text="이전"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										isActive
										onClick={(e) => e.preventDefault()}
									>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										2
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href="#"
										text="다음"
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>

						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										text=""
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										isActive
										onClick={(e) => e.preventDefault()}
									>
										1
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationLink
										href="#"
										onClick={(e) => e.preventDefault()}
									>
										2
									</PaginationLink>
								</PaginationItem>
								<PaginationItem>
									<PaginationNext
										href="#"
										text=""
										onClick={(e) => e.preventDefault()}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
				</ExCard>
			</section>

			{/* ── 4. 인터랙티브 예제 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 인터랙티브 예제 — 실제 동작"
					description="useState 로 현재 페이지를 관리하고, 현재 페이지 주변만 노출하도록 범위를 계산합니다. 이 패턴이 실제 목록/테이블 페이지네이션의 기본형입니다. 버튼을 눌러 직접 이동해 보세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							전체 {totalPages}페이지 중 현재:{' '}
							<code className="font-mono text-violet-700 dark:text-violet-400">{page}</code> 페이지
						</span>
					</div>
					<div className="p-5">
						<Pagination>
							<PaginationContent>
								<PaginationItem>
									<PaginationPrevious
										href="#"
										text="이전"
										onClick={goTo(page - 1)}
										aria-disabled={page === 1}
										className={page === 1 ? 'pointer-events-none opacity-50' : ''}
									/>
								</PaginationItem>

								{pageRange.map((p, i) =>
									p === 'ellipsis' ? (
										<PaginationItem key={`ellipsis-${i}`}>
											<PaginationEllipsis />
										</PaginationItem>
									) : (
										<PaginationItem key={p}>
											<PaginationLink
												href="#"
												isActive={p === page}
												onClick={goTo(p)}
											>
												{p}
											</PaginationLink>
										</PaginationItem>
									),
								)}

								<PaginationItem>
									<PaginationNext
										href="#"
										text="다음"
										onClick={goTo(page + 1)}
										aria-disabled={page === totalPages}
										className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
									/>
								</PaginationItem>
							</PaginationContent>
						</Pagination>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`// 현재 페이지 주변만 노출하고 멀어지면 …(ellipsis) 로 접는 범위 계산
function buildPageRange(current, total, sibling = 1) {
  const range = [];
  for (let p = 1; p <= total; p++) {
    if (p === 1 || p === total || Math.abs(p - current) <= sibling) {
      range.push(p);
    } else if (range[range.length - 1] !== 'ellipsis') {
      range.push('ellipsis');
    }
  }
  return range;
}

const totalPages = 10;
const [page, setPage] = useState(1);

const goTo = (p) => (e) => {
  e.preventDefault();               // 해시 라우터가 깨지지 않도록 기본 이동 차단
  if (p >= 1 && p <= totalPages) setPage(p);
};

<Pagination>
  <PaginationContent>
    <PaginationItem>
      <PaginationPrevious
        href="#"
        text="이전"
        onClick={goTo(page - 1)}
        aria-disabled={page === 1}
        className={page === 1 ? 'pointer-events-none opacity-50' : ''}
      />
    </PaginationItem>

    {buildPageRange(page, totalPages).map((p, i) =>
      p === 'ellipsis' ? (
        <PaginationItem key={\`ellipsis-\${i}\`}>
          <PaginationEllipsis />
        </PaginationItem>
      ) : (
        <PaginationItem key={p}>
          <PaginationLink href="#" isActive={p === page} onClick={goTo(p)}>
            {p}
          </PaginationLink>
        </PaginationItem>
      ),
    )}

    <PaginationItem>
      <PaginationNext
        href="#"
        text="다음"
        onClick={goTo(page + 1)}
        aria-disabled={page === totalPages}
        className={page === totalPages ? 'pointer-events-none opacity-50' : ''}
      />
    </PaginationItem>
  </PaginationContent>
</Pagination>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 5. 퍼블리셔 커스터마이징 (실전 예제) ────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 퍼블리셔 커스터마이징 — 실전 예제"
					description="같은 프리미티브에 *.module.css 만 입혀 완전히 다른 룩앤필(각진 카드형 + 브랜드 그라데이션 액티브)로 만든 예제입니다. 구조·동작은 그대로 두고 className 만 넘겼습니다. 실제 SI 프로젝트에서는 이렇게 CSS Module 파일만 교체해 디자인을 바꿉니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-6 shadow-sm">
					<CustomPagination />
				</div>

				<SourceTabs
					files={[
						{ filename: 'CustomPagination.tsx', code: customSource, lang: 'tsx' },
						{ filename: 'CustomPagination.module.css', code: customCss, lang: 'css' },
					]}
				/>

				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					전역 CSS 에서 <code className="font-mono">[data-slot="pagination-link"]</code> 같은 셀렉터로 한 번에 스타일을 잡을 수도
					있습니다. 다만 스코프가 확실한 <code className="font-mono">*.module.css</code> + <code className="font-mono">className</code>{' '}
					방식이 다른 화면에 영향이 없어 안전합니다.
				</p>
			</section>

			{/* ── 구성 요소 요약 테이블 ─────────────────────────────── */}
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
								{ c: 'Pagination', tag: '<nav>', prop: 'className', desc: '전체 래퍼. role="navigation", aria-label="pagination" 포함' },
								{ c: 'PaginationContent', tag: '<ul>', prop: 'className', desc: '항목들을 담는 가로 목록(flex)' },
								{ c: 'PaginationItem', tag: '<li>', prop: 'className', desc: '개별 항목 래퍼' },
								{
									c: 'PaginationLink',
									tag: '<a> (Button)',
									prop: 'isActive, size, href',
									desc: '페이지 번호 링크. isActive 로 현재 페이지 표시(aria-current 자동)',
								},
								{
									c: 'PaginationPrevious',
									tag: '<a> (Button)',
									prop: 'text, href',
									desc: '이전 페이지. text 로 라벨 변경(기본 "Previous")',
								},
								{
									c: 'PaginationNext',
									tag: '<a> (Button)',
									prop: 'text, href',
									desc: '다음 페이지. text 로 라벨 변경(기본 "Next")',
								},
								{
									c: 'PaginationEllipsis',
									tag: '<span>',
									prop: 'className',
									desc: '생략(…) 표시. 페이지가 많아 중간을 접을 때',
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
