import { useRef } from 'react';
import Autoplay from 'embla-carousel-autoplay';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import CarouselDemoCard from '@/domains/example/components/ui-components/carousel/CarouselDemoCard';
import ApiCarouselDemo from '@/domains/example/components/ui-components/carousel/ApiCarouselDemo';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from '@axiom/components/ui';
import { GalleryHorizontal } from 'lucide-react';

const SLIDE_COLORS = [
	'bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-300',
	'bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-300',
	'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-300',
	'bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-300',
	'bg-rose-100 dark:bg-rose-900/30 text-rose-600 dark:text-rose-300',
];

export default function CarouselComponent(): React.ReactNode {
	const autoplayPlugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/20">
					<GalleryHorizontal className="w-5 h-5 text-blue-600 dark:text-blue-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Carousel 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-blue-300/50 bg-blue-100/60 text-blue-800 dark:border-blue-600/40 dark:bg-blue-900/30 dark:text-blue-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Embla 기반 Carousel 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 1. 기본 사용법 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 기본 사용법"
					description="Carousel · CarouselContent · CarouselItem · CarouselPrevious · CarouselNext를 조합해 슬라이드를 구성합니다."
				/>
				<CarouselDemoCard
					label="기본 슬라이드 (5개 아이템)"
					code={`import {
  Carousel, CarouselContent, CarouselItem,
  CarouselPrevious, CarouselNext,
} from "@axiom/components/ui";

<Carousel>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}
				>
					<Carousel>
						<CarouselContent>
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem key={i}>
									<div className={`flex items-center justify-center h-32 rounded-xl text-4xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
			</section>

			{/* ── 2. 크기 ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 크기 (Sizes)"
					description="CarouselItem의 basis 클래스로 한 화면에 보이는 슬라이드 수를 조절합니다."
				/>
				<CarouselDemoCard
					label="basis-1/3 — 한 번에 3개씩 표시"
					code={`<Carousel>
  <CarouselContent>
    <CarouselItem className="basis-1/3">...</CarouselItem>
    <CarouselItem className="basis-1/3">...</CarouselItem>
  </CarouselContent>
</Carousel>`}
				>
					<Carousel>
						<CarouselContent>
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem
									key={i}
									className="basis-1/3"
								>
									<div className={`flex items-center justify-center h-24 rounded-xl text-2xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
				<CarouselDemoCard
					label="md:basis-1/2 lg:basis-1/3 — 반응형 크기"
					code={`<CarouselItem className="md:basis-1/2 lg:basis-1/3">...</CarouselItem>`}
				>
					<Carousel>
						<CarouselContent>
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem
									key={i}
									className="md:basis-1/2 lg:basis-1/3"
								>
									<div className={`flex items-center justify-center h-24 rounded-xl text-2xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
			</section>

			{/* ── 3. 간격 ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 간격 (Spacing)"
					description="CarouselContent에 -ml-[VALUE], CarouselItem에 pl-[VALUE]를 사용해 슬라이드 간 간격을 조정합니다."
				/>
				<CarouselDemoCard
					label="-ml-4 / pl-4 조합 (basis-1/2)"
					code={`<Carousel>
  <CarouselContent className="-ml-4">
    <CarouselItem className="pl-4 basis-1/2">...</CarouselItem>
    <CarouselItem className="pl-4 basis-1/2">...</CarouselItem>
  </CarouselContent>
</Carousel>`}
				>
					<Carousel>
						<CarouselContent className="-ml-4">
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem
									key={i}
									className="pl-4 basis-1/2"
								>
									<div className={`flex items-center justify-center h-28 rounded-xl text-3xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
			</section>

			{/* ── 4. 방향 ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 방향 (Orientation)"
					description={
						'orientation="vertical"로 세로 방향 캐러셀을 만듭니다. 상하 버튼 여백(-top-12 / -bottom-12)을 고려한 패딩이 필요합니다.'
					}
				/>
				<CarouselDemoCard
					label='orientation="vertical"'
					contentClassName="p-5 px-16 py-14"
					code={`<Carousel orientation="vertical" className="h-48 w-full">
  <CarouselContent className="-mt-4 h-48">
    <CarouselItem className="pt-4 basis-1/3">...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}
				>
					<div className="flex justify-center">
						<Carousel
							orientation="vertical"
							className="h-48 w-full max-w-sm"
						>
							<CarouselContent className="-mt-4 h-48">
								{SLIDE_COLORS.map((color, i) => (
									<CarouselItem
										key={i}
										className="pt-4 basis-1/3"
									>
										<div className={`flex items-center justify-center h-full rounded-xl text-2xl font-bold ${color}`}>
											{i + 1}
										</div>
									</CarouselItem>
								))}
							</CarouselContent>
							<CarouselPrevious />
							<CarouselNext />
						</Carousel>
					</div>
				</CarouselDemoCard>
			</section>

			{/* ── 5. 옵션 ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 옵션 (opts)"
					description="opts prop으로 Embla Carousel의 loop, align 등 다양한 옵션을 설정합니다."
				/>
				<CarouselDemoCard
					label='loop: true · align: "start"'
					code={`<Carousel
  opts={{
    loop: true,
    align: "start",
  }}
>
  <CarouselContent>
    <CarouselItem className="basis-1/2">...</CarouselItem>
  </CarouselContent>
</Carousel>`}
				>
					<Carousel opts={{ loop: true, align: 'start' }}>
						<CarouselContent>
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem
									key={i}
									className="basis-1/2"
								>
									<div className={`flex items-center justify-center h-28 rounded-xl text-3xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
			</section>

			{/* ── 6. API 활용 ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. API 활용 (setApi)"
					description="setApi prop으로 Carousel API 인스턴스를 받아 현재 슬라이드 위치 등을 동적으로 파악합니다."
				/>
				<ApiCarouselDemo />
			</section>

			{/* ── 7. 자동재생 플러그인 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 자동재생 플러그인 (Autoplay)"
					description="embla-carousel-autoplay 플러그인으로 자동 슬라이드 전환을 구현합니다. 클릭하면 자동재생이 정지됩니다."
				/>
				<CarouselDemoCard
					label="2초 간격 자동재생 · loop: true · stopOnInteraction: true"
					code={`import Autoplay from "embla-carousel-autoplay";

// 렌더링 간 안정적인 인스턴스 유지를 위해 useRef 사용
const plugin = useRef(Autoplay({ delay: 2000, stopOnInteraction: true }));

// loop: true가 없으면 마지막 슬라이드에서 처음으로 "되감기"되어
// 역방향 애니메이션이 보인다. loop을 켜면 앞 방향으로 자연스럽게 순환한다.
<Carousel opts={{ loop: true }} plugins={[plugin.current]}>
  <CarouselContent>
    <CarouselItem>...</CarouselItem>
  </CarouselContent>
  <CarouselPrevious />
  <CarouselNext />
</Carousel>`}
				>
					<Carousel
						opts={{ loop: true }}
						plugins={[autoplayPlugin.current]}
					>
						<CarouselContent>
							{SLIDE_COLORS.map((color, i) => (
								<CarouselItem key={i}>
									<div className={`flex items-center justify-center h-32 rounded-xl text-4xl font-bold ${color}`}>
										{i + 1}
									</div>
								</CarouselItem>
							))}
						</CarouselContent>
						<CarouselPrevious />
						<CarouselNext />
					</Carousel>
				</CarouselDemoCard>
			</section>

			{/* ── Props 요약 테이블 ─────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader title="Props 요약" />
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">기본값</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									prop: 'opts',
									type: 'EmblaOptionsType',
									def: '—',
									desc: 'Embla Carousel 옵션 (아래 “opts 세부 옵션” 표 참고)',
								},
								{
									prop: 'plugins',
									type: 'EmblaPluginType[]',
									def: '—',
									desc: 'Embla 플러그인 배열 (Autoplay 등)',
								},
								{
									prop: 'orientation',
									type: '"horizontal" | "vertical"',
									def: '"horizontal"',
									desc: '슬라이드 스크롤 방향',
								},
								{
									prop: 'setApi',
									type: '(api: CarouselApi) => void',
									def: '—',
									desc: 'API 인스턴스를 받아 외부에서 제어할 때 사용',
								},
								{
									prop: 'className',
									type: 'string',
									def: '—',
									desc: '추가 Tailwind 클래스',
								},
								{
									prop: 'CarouselItem · basis-*',
									type: 'Tailwind class',
									def: '"basis-full"',
									desc: '한 화면에 표시할 슬라이드 수 조절 (1/2, 1/3 등)',
								},
							].map((row) => (
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
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-amber-700 dark:text-amber-400">{row.def}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── opts 세부 옵션 테이블 ─────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="opts 세부 옵션 (EmblaOptionsType)"
					description="opts에 넘길 수 있는 Embla 옵션 전체 목록입니다. axis · direction은 Carousel의 orientation prop이 대신 설정하므로 직접 넣지 않는 것을 권장합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm min-w-2xl">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">옵션</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">기본값</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{
										prop: 'loop',
										type: 'boolean',
										def: 'false',
										desc: '무한 순환. 마지막 → 첫 슬라이드로 되감기 없이 같은 방향으로 이어진다. Autoplay와 함께 쓸 때 특히 유용.',
									},
									{
										prop: 'align',
										type: '"start" | "center" | "end" | (vp, sz) => number',
										def: '"center"',
										desc: '뷰포트 안에서 슬라이드를 정렬할 기준 위치.',
									},
									{
										prop: 'slidesToScroll',
										type: 'number | "auto"',
										def: '1',
										desc: '한 번에 이동할 슬라이드 개수. "auto"는 뷰포트에 들어가는 만큼 그룹으로 이동.',
									},
									{
										prop: 'startIndex',
										type: 'number',
										def: '0',
										desc: '최초 렌더 시 시작 슬라이드 인덱스.',
									},
									{
										prop: 'containScroll',
										type: 'false | "trimSnaps" | "keepSnaps"',
										def: '"trimSnaps"',
										desc: '앞뒤 여백이 생기지 않도록 스크롤을 가둔다. trimSnaps는 여백을 만드는 스냅을 제거, keepSnaps는 스냅을 유지. loop: true면 무시됨.',
									},
									{
										prop: 'duration',
										type: 'number',
										def: '25',
										desc: '전환 애니메이션 속도(값이 클수록 느림). ms가 아닌 Embla 자체 단위.',
									},
									{
										prop: 'dragFree',
										type: 'boolean',
										def: 'false',
										desc: 'true면 스냅 없이 관성으로 자유롭게 스크롤된다.',
									},
									{
										prop: 'dragThreshold',
										type: 'number',
										def: '10',
										desc: '드래그로 인식하기까지 필요한 이동 거리(px).',
									},
									{
										prop: 'watchDrag',
										type: 'boolean | (api, evt) => boolean',
										def: 'true',
										desc: 'false면 드래그 조작을 비활성화(버튼·API로만 이동).',
									},
									{
										prop: 'skipSnaps',
										type: 'boolean',
										def: 'false',
										desc: '빠르게 드래그할 때 중간 스냅을 건너뛰도록 허용.',
									},
									{
										prop: 'inViewThreshold',
										type: 'number (0~1)',
										def: '0',
										desc: '슬라이드를 “보이는 상태”로 판단할 노출 비율. slidesInView 계산에 사용.',
									},
									{
										prop: 'breakpoints',
										type: '{ [mediaQuery]: EmblaOptionsType }',
										def: '{}',
										desc: '미디어쿼리별 옵션 오버라이드. 예: { "(min-width: 768px)": { align: "start" } }',
									},
									{
										prop: 'active',
										type: 'boolean',
										def: 'true',
										desc: 'false면 캐러셀을 비활성화(정적 목록처럼 동작). breakpoints와 조합해 특정 화면에서만 끌 때 사용.',
									},
									{
										prop: 'watchResize',
										type: 'boolean | (api, entries) => boolean',
										def: 'true',
										desc: '컨테이너·슬라이드 크기 변화를 감지해 자동 재초기화.',
									},
									{
										prop: 'watchSlides',
										type: 'boolean | (api, mutations) => boolean',
										def: 'true',
										desc: '슬라이드 DOM 추가/삭제를 감지해 자동 재초기화.',
									},
									{
										prop: 'axis',
										type: '"x" | "y"',
										def: '"x"',
										desc: '스크롤 축. shadcn Carousel에서는 orientation prop이 설정하므로 직접 지정하지 않는다.',
									},
									{
										prop: 'direction',
										type: '"ltr" | "rtl"',
										def: '"ltr"',
										desc: '콘텐츠 진행 방향. RTL 레이아웃 지원용.',
									},
								].map((row) => (
									<tr
										key={row.prop}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
									>
										<td className="px-4 py-2.5 whitespace-nowrap">
											<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.prop}</code>
										</td>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.type}</code>
										</td>
										<td className="px-4 py-2.5 whitespace-nowrap">
											<code className="text-xs font-mono text-amber-700 dark:text-amber-400">{row.def}</code>
										</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
				</div>
			</section>
		</div>
	);
}
