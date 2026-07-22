import { useState } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
	Button,
	Badge,
	Input,
	Label,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import ExCard from '@/domains/example/components/ui-components/ExCard';
import ProductCard from '@/domains/example/components/ui-components/ProductCard';
import AccountSummaryCard from '@/domains/example/components/ui-components/AccountSummaryCard';
import SourceTabs from '@/domains/example/components/ui-components/SourceTabs';
import productSource from '@/domains/example/components/ui-components/ProductCard.tsx?raw';
import productCss from '@/domains/example/components/ui-components/ProductCard.module.css?raw';
import accountSource from '@/domains/example/components/ui-components/AccountSummaryCard.tsx?raw';
import accountCss from '@/domains/example/components/ui-components/AccountSummaryCard.module.css?raw';
import { SquareStack } from 'lucide-react';

/** 외부 네트워크 없이 이미지 슬롯을 시연하기 위한 인라인 SVG 그라데이션 */
const DEMO_IMAGE =
	"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='260'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' y1='0' x2='1' y2='1'%3E%3Cstop offset='0' stop-color='%236366f1'/%3E%3Cstop offset='1' stop-color='%2306b6d4'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='600' height='260' fill='url(%23g)'/%3E%3Ctext x='300' y='140' font-family='sans-serif' font-size='26' fill='white' text-anchor='middle'%3ECover Image%3C/text%3E%3C/svg%3E";

const PLANS = [
	{ id: 'starter', name: '스타터', price: '₩9,000', desc: '개인 프로젝트용 기본 플랜' },
	{ id: 'pro', name: '프로', price: '₩29,000', desc: '팀 협업과 고급 분석 포함' },
	{ id: 'enterprise', name: '엔터프라이즈', price: '₩99,000', desc: '전담 지원과 SLA 보장' },
];

export default function CardComponent(): React.ReactNode {
	const [selectedPlan, setSelectedPlan] = useState<string>('pro');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<SquareStack className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Card 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Card 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 0. 구성 요소 한눈에 보기 ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. 구성 요소"
					description="Card는 7개의 하위 컴포넌트로 이루어진 조립형(compound) 컴포넌트입니다. 전부 필수는 아니며 필요한 것만 골라 씁니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<CodeBlock
						code={`import {
  Card,            // 루트 박스 (배경 · 라운드 · 링 · 세로 패딩)
  CardHeader,      // 헤더 영역 (grid — Title/Description/Action 배치)
  CardTitle,       // 제목
  CardDescription, // 보조 설명
  CardAction,      // 헤더 우측 액션 (버튼·뱃지 등) — CardHeader 안에 둔다
  CardContent,     // 본문
  CardFooter,      // 푸터 (상단 보더 + muted 배경, 카드 하단에 붙음)
} from '@axiom/components/ui';`}
					/>
				</div>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본 구조)"
					description="Header + Content + Footer의 가장 일반적인 조합입니다. Footer를 넣으면 Card가 자동으로 하단 패딩을 제거해 푸터가 카드 끝에 붙습니다."
				/>
				<ExCard
					label="Card + Header + Content + Footer"
					code={`<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>월간 리포트</CardTitle>
    <CardDescription>2026년 7월 · 자동 집계</CardDescription>
  </CardHeader>
  <CardContent>
    이번 달 거래 건수는 1,248건으로 전월 대비 12% 증가했습니다.
  </CardContent>
  <CardFooter>
    <Button size="sm">상세 보기</Button>
  </CardFooter>
</Card>`}
				>
					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle>월간 리포트</CardTitle>
							<CardDescription>2026년 7월 · 자동 집계</CardDescription>
						</CardHeader>
						<CardContent>이번 달 거래 건수는 1,248건으로 전월 대비 12% 증가했습니다.</CardContent>
						<CardFooter>
							<Button size="sm">상세 보기</Button>
						</CardFooter>
					</Card>
				</ExCard>
			</section>

			{/* ── 2. size ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title='2. size="sm" (조밀한 카드)'
					description="Card의 유일한 자체 prop입니다. 루트에 data-size가 붙고 하위 슬롯의 패딩·간격·제목 크기가 함께 줄어듭니다. 목록에 여러 장을 촘촘히 배치할 때 사용합니다."
				/>
				<ExCard
					label='size="default" vs size="sm"'
					code={`<Card size="default">...</Card>
<Card size="sm">...</Card>`}
				>
					<Card className="w-56">
						<CardHeader>
							<CardTitle>default</CardTitle>
							<CardDescription>py-4 · px-4 · gap-4</CardDescription>
						</CardHeader>
						<CardContent>기본 크기 카드입니다.</CardContent>
					</Card>
					<Card
						size="sm"
						className="w-56"
					>
						<CardHeader>
							<CardTitle>sm</CardTitle>
							<CardDescription>py-3 · px-3 · gap-3</CardDescription>
						</CardHeader>
						<CardContent>조밀한 크기 카드입니다.</CardContent>
					</Card>
				</ExCard>
			</section>

			{/* ── 3. CardAction ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. CardAction (헤더 우측 액션)"
					description="CardHeader 안에 CardAction이 있으면 헤더가 2열 그리드로 바뀌어, 액션이 제목 오른쪽에 정렬됩니다. 별도 flex 레이아웃을 짤 필요가 없습니다."
				/>
				<ExCard
					label="CardHeader > CardAction"
					code={`<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>결제 수단</CardTitle>
    <CardDescription>기본 카드로 등록됨</CardDescription>
    <CardAction>
      <Badge variant="secondary">기본</Badge>
    </CardAction>
  </CardHeader>
  <CardContent>신한카드 **** 4821 · 유효기간 09/28</CardContent>
</Card>`}
				>
					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle>결제 수단</CardTitle>
							<CardDescription>기본 카드로 등록됨</CardDescription>
							<CardAction>
								<Badge variant="secondary">기본</Badge>
							</CardAction>
						</CardHeader>
						<CardContent>신한카드 **** 4821 · 유효기간 09/28</CardContent>
					</Card>
				</ExCard>
			</section>

			{/* ── 4. 이미지 카드 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 이미지 카드"
					description="Card의 첫 자식이 <img>면 상단 패딩이 자동으로 제거되고 이미지 모서리가 카드 라운드에 맞춰집니다. (마지막 자식이면 하단 모서리)"
				/>
				<ExCard
					label="Card 첫 자식으로 <img>"
					code={`<Card className="w-full max-w-xs">
  <img src={cover} alt="커버 이미지" />
  <CardHeader>
    <CardTitle>디자인 시스템 가이드</CardTitle>
    <CardDescription>업데이트 2026.07.20</CardDescription>
  </CardHeader>
  <CardContent>컴포넌트 사용 규칙과 토큰 정의를 정리했습니다.</CardContent>
</Card>`}
				>
					<Card className="w-full max-w-xs">
						<img
							src={DEMO_IMAGE}
							alt="커버 이미지"
						/>
						<CardHeader>
							<CardTitle>디자인 시스템 가이드</CardTitle>
							<CardDescription>업데이트 2026.07.20</CardDescription>
						</CardHeader>
						<CardContent>컴포넌트 사용 규칙과 토큰 정의를 정리했습니다.</CardContent>
					</Card>
				</ExCard>
			</section>

			{/* ── 5. 폼 카드 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 폼 카드"
					description="가장 자주 쓰는 실무 패턴입니다. Content에 입력 필드를, Footer에 제출/취소 버튼을 배치합니다."
				/>
				<ExCard
					label="로그인 폼"
					code={`<Card className="w-full max-w-sm">
  <CardHeader>
    <CardTitle>로그인</CardTitle>
    <CardDescription>계정 정보를 입력하세요.</CardDescription>
    <CardAction>
      <Button variant="link" size="sm">회원가입</Button>
    </CardAction>
  </CardHeader>
  <CardContent className="space-y-3">
    <div className="space-y-1.5">
      <Label htmlFor="email">이메일</Label>
      <Input id="email" type="email" placeholder="you@example.com" />
    </div>
    <div className="space-y-1.5">
      <Label htmlFor="password">비밀번호</Label>
      <Input id="password" type="password" />
    </div>
  </CardContent>
  <CardFooter className="gap-2">
    <Button className="flex-1">로그인</Button>
    <Button variant="outline" className="flex-1">취소</Button>
  </CardFooter>
</Card>`}
				>
					<Card className="w-full max-w-sm">
						<CardHeader>
							<CardTitle>로그인</CardTitle>
							<CardDescription>계정 정보를 입력하세요.</CardDescription>
							<CardAction>
								<Button
									variant="link"
									size="sm"
								>
									회원가입
								</Button>
							</CardAction>
						</CardHeader>
						<CardContent className="space-y-3">
							<div className="space-y-1.5">
								<Label htmlFor="demo-email">이메일</Label>
								<Input
									id="demo-email"
									type="email"
									placeholder="you@example.com"
								/>
							</div>
							<div className="space-y-1.5">
								<Label htmlFor="demo-password">비밀번호</Label>
								<Input
									id="demo-password"
									type="password"
									placeholder="••••••••"
								/>
							</div>
						</CardContent>
						<CardFooter className="gap-2">
							<Button className="flex-1">로그인</Button>
							<Button
								variant="outline"
								className="flex-1"
							>
								취소
							</Button>
						</CardFooter>
					</Card>
				</ExCard>
			</section>

			{/* ── 6. 통계 카드 그리드 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 통계 카드 그리드"
					description="Card 자체는 폭을 갖지 않으므로, 부모의 grid/flex가 폭을 결정합니다. 대시보드 KPI 영역에서 가장 흔한 형태입니다."
				/>
				<ExCard
					label="grid + size='sm'"
					code={`<div className="grid grid-cols-3 gap-3">
  {stats.map((s) => (
    <Card key={s.label} size="sm">
      <CardHeader>
        <CardDescription>{s.label}</CardDescription>
        <CardTitle className="text-2xl">{s.value}</CardTitle>
      </CardHeader>
      <CardContent className="text-xs text-muted-foreground">
        {s.diff}
      </CardContent>
    </Card>
  ))}
</div>`}
				>
					<div className="grid grid-cols-3 gap-3 w-full">
						{[
							{ label: '총 거래액', value: '₩4.2억', diff: '전월 대비 +12.4%' },
							{ label: '신규 가입', value: '1,248', diff: '전월 대비 +3.1%' },
							{ label: '해지율', value: '0.8%', diff: '전월 대비 -0.2%p' },
						].map((s) => (
							<Card
								key={s.label}
								size="sm"
							>
								<CardHeader>
									<CardDescription>{s.label}</CardDescription>
									<CardTitle className="text-2xl">{s.value}</CardTitle>
								</CardHeader>
								<CardContent className="text-xs text-muted-foreground">{s.diff}</CardContent>
							</Card>
						))}
					</div>
				</ExCard>
			</section>

			{/* ── 7. className 오버라이드 ──────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. className 오버라이드 (Tailwind)"
					description="모든 하위 컴포넌트가 className을 받아 cn()으로 병합합니다. 사소한 변형은 여기서 끝내고, module 파일을 만들지 않습니다."
				/>
				<ExCard
					label="ring / bg / border 변형"
					code={`{/* 강조 카드 — 링 색상과 배경만 바꿈 */}
<Card className="w-56 ring-violet-500/60 bg-violet-50/60 dark:bg-violet-900/15">
  ...
</Card>

{/* 경고 카드 — 좌측 컬러 바 */}
<Card className="w-56 rounded-l-none border-l-4 border-l-amber-500">
  ...
</Card>`}
				>
					<Card className="w-56 ring-violet-500/60 bg-violet-50/60 dark:bg-violet-900/15">
						<CardHeader>
							<CardTitle>강조 카드</CardTitle>
							<CardDescription>ring · bg 변경</CardDescription>
						</CardHeader>
						<CardContent className="text-xs">선택된 항목을 강조할 때 사용합니다.</CardContent>
					</Card>
					<Card className="w-56 rounded-l-none border-l-4 border-l-amber-500">
						<CardHeader>
							<CardTitle>경고 카드</CardTitle>
							<CardDescription>좌측 컬러 바</CardDescription>
						</CardHeader>
						<CardContent className="text-xs">확인이 필요한 항목을 표시합니다.</CardContent>
					</Card>
				</ExCard>
			</section>

			{/* ── 8. 인터랙티브 예제 ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 인터랙티브 예제 — 선택 가능한 카드"
					description="Card는 div이므로 onClick·role·aria-pressed를 직접 붙여 선택 UI로 쓸 수 있습니다. 선택 상태는 className으로 표현합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							선택된 플랜: <code className="font-mono text-violet-700 dark:text-violet-400">{selectedPlan}</code>
						</span>
					</div>
					<div className="p-5 grid grid-cols-3 gap-3">
						{PLANS.map((plan) => {
							const active = selectedPlan === plan.id;
							return (
								<Card
									key={plan.id}
									size="sm"
									role="button"
									tabIndex={0}
									aria-pressed={active}
									onClick={() => setSelectedPlan(plan.id)}
									onKeyDown={(e) => {
										if (e.key === 'Enter' || e.key === ' ') {
											e.preventDefault();
											setSelectedPlan(plan.id);
										}
									}}
									className={`cursor-pointer transition-all outline-none ${
										active
											? 'ring-2 ring-violet-500 bg-violet-50/60 dark:bg-violet-900/15'
											: 'hover:ring-violet-400/60 hover:-translate-y-0.5'
									}`}
								>
									<CardHeader>
										<CardTitle>{plan.name}</CardTitle>
										<CardDescription>{plan.price} / 월</CardDescription>
										{active && (
											<CardAction>
												<Badge>선택</Badge>
											</CardAction>
										)}
									</CardHeader>
									<CardContent className="text-xs text-muted-foreground">{plan.desc}</CardContent>
								</Card>
							);
						})}
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [selectedPlan, setSelectedPlan] = useState('pro');

<Card
  size="sm"
  role="button"
  tabIndex={0}
  aria-pressed={selectedPlan === plan.id}
  onClick={() => setSelectedPlan(plan.id)}
  className={
    selectedPlan === plan.id
      ? 'ring-2 ring-violet-500 bg-violet-50/60'
      : 'hover:ring-violet-400/60 hover:-translate-y-0.5'
  }
>
  <CardHeader>
    <CardTitle>{plan.name}</CardTitle>
    <CardDescription>{plan.price} / 월</CardDescription>
  </CardHeader>
  <CardContent>{plan.desc}</CardContent>
</Card>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 9. 퍼블리셔용 재스타일링 가이드 ──────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. 재스타일링 가이드 (퍼블리셔용)"
					description="Card는 프로젝트마다 디자인이 크게 달라지는 컴포넌트입니다. 아래 3단계 순서로 판단하면 컴포넌트 원본(src/shared/lib/shadcn/ui/card.tsx)을 수정하지 않고도 대부분의 디자인을 소화할 수 있습니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="p-5 space-y-4 text-sm">
						<div>
							<p className="font-semibold text-gray-900 dark:text-white">1단계 — 사소한 변형은 className</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								색·여백·폭 정도의 차이는 Tailwind 유틸리티로 끝냅니다(위 7번 예제). 모든 슬롯이 <code>cn()</code>으로
								className을 병합하므로 뒤에 준 클래스가 이깁니다.
							</p>
						</div>
						<div>
							<p className="font-semibold text-gray-900 dark:text-white">
								2단계 — 톤 전체가 바뀌면 CSS Module + data-slot
							</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								카드 전체 디자인이 완전히 달라지면, 컴포넌트를 감싼 래퍼 아래에서 <code>[data-slot=&quot;card-*&quot;]</code>{' '}
								선택자로 덮어씁니다. 래퍼 + 슬롯 2단계 선택자는 Tailwind 단일 클래스보다 명시도가 높아{' '}
								<code>!important</code> 없이 이깁니다. 아래 10·11번이 이 방식의 실제 사례입니다.
							</p>
						</div>
						<div>
							<p className="font-semibold text-gray-900 dark:text-white">3단계 — 그래도 안 되면 전역 토큰</p>
							<p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
								<code>bg-card</code> / <code>text-card-foreground</code> / <code>bg-muted</code> 등은 전역 테마 변수를
								참조합니다. 앱 전체의 카드 톤을 한 번에 바꾸려면 <code>src/assets/styles/</code>의 토큰을 조정합니다.
							</p>
						</div>
					</div>

					<div className="border-t border-gray-100 dark:border-gray-800 px-4 py-2 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">노출되는 data-slot 목록</span>
					</div>
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									data-slot
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">컴포넌트</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									기본 스타일에서 덮어쓸 지점
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									slot: 'card',
									comp: 'Card',
									desc: 'rounded-xl · bg-card · ring-1 · py-4 · gap-4 · overflow-hidden',
								},
								{ slot: 'card-header', comp: 'CardHeader', desc: 'px-4 · grid · gap-1 (Action 있으면 2열)' },
								{ slot: 'card-title', comp: 'CardTitle', desc: 'text-base · font-medium' },
								{ slot: 'card-description', comp: 'CardDescription', desc: 'text-sm · text-muted-foreground' },
								{ slot: 'card-action', comp: 'CardAction', desc: 'col-start-2 · 우측 상단 정렬' },
								{ slot: 'card-content', comp: 'CardContent', desc: 'px-4' },
								{ slot: 'card-footer', comp: 'CardFooter', desc: 'border-t · bg-muted/50 · p-4' },
							].map((row) => (
								<tr
									key={row.slot}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.slot}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.comp}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>

					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`/* MyCard.module.css — 래퍼(.wrap) 아래에서 슬롯을 덮어쓴다 */
.wrap [data-slot='card'] {
  gap: 0;
  padding: 0;
  border-radius: 14px;
  --tw-ring-shadow: 0 0 #0000;   /* scaffold의 ring-1 무력화 */
  border: 1px solid var(--my-border);
}

.wrap [data-slot='card-header'] { padding: 14px 14px 0; }
.wrap [data-slot='card-title']  { font-size: 14px; font-weight: 700; }
.wrap [data-slot='card-footer'] { background: transparent; border-top: 0; }

/* 다크 모드는 앱 규칙에 맞춰 :global(.dark) 로 처리 */
:global(.dark) .wrap { --my-border: #2a2523; }`}
							lang="css"
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Card만 자체 prop(size)을 가지며, 나머지는 모두 div의 속성을 그대로 받습니다."
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
									component: 'Card',
									prop: 'size',
									type: '"default" | "sm"',
									desc: '카드 전체의 패딩·간격·제목 크기 축소 (기본 "default")',
								},
								{
									component: 'Card',
									prop: 'className',
									type: 'string',
									desc: 'cn()으로 병합되어 기본 클래스를 덮어씀',
								},
								{
									component: 'Card',
									prop: '...props',
									type: 'React.ComponentProps<"div">',
									desc: 'onClick·role·id 등 div 속성 전부 전달 가능',
								},
								{
									component: 'CardHeader',
									prop: 'className',
									type: 'string',
									desc: 'CardAction 유무에 따라 그리드 열이 자동 변경됨',
								},
								{
									component: 'CardTitle',
									prop: 'className',
									type: 'string',
									desc: 'div로 렌더링 — 시맨틱 제목이 필요하면 안에 h2/h3를 넣는다',
								},
								{
									component: 'CardDescription',
									prop: 'className',
									type: 'string',
									desc: 'muted 색상의 보조 텍스트',
								},
								{
									component: 'CardAction',
									prop: 'className',
									type: 'string',
									desc: '반드시 CardHeader의 자식으로 둬야 우측 정렬됨',
								},
								{
									component: 'CardContent',
									prop: 'className',
									type: 'string',
									desc: '본문 영역 (좌우 패딩만 가짐)',
								},
								{
									component: 'CardFooter',
									prop: 'className',
									type: 'string',
									desc: '존재하면 Card의 하단 패딩이 자동 제거됨',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.component}</code>
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

			{/* ── 기타. 실전 예제 — 상품 카드 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 커머스 상품 카드"
					description="제공 Card를 구조 변경 없이 그대로 쓰면서 *.module.css의 data-slot 선택자만으로 톤을 전부 갈아끼운 사례입니다. 찜/장바구니 상태까지 실제로 동작합니다."
				/>

				<ProductCard />

				<SourceTabs
					files={[
						{ filename: 'ProductCard.tsx', code: productSource, lang: 'tsx' },
						{ filename: 'ProductCard.module.css', code: productCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 계좌 요약 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 뱅킹 계좌 요약"
					description="같은 Card로 전혀 다른 UI를 만든 두 번째 사례. 한 화면에 스킨 두 개(.hero / .list)를 공존시키기 위해 카드마다 스킨 클래스를 붙이고 CSS에서 스코프를 좁히는 방법을 보여줍니다."
				/>

				<AccountSummaryCard />

				<SourceTabs
					files={[
						{ filename: 'AccountSummaryCard.tsx', code: accountSource, lang: 'tsx' },
						{ filename: 'AccountSummaryCard.module.css', code: accountCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
