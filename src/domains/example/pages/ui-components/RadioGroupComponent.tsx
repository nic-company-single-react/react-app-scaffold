import { useId, useState } from 'react';
import { RadioGroup, RadioGroupItem, Label, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import PaymentMethodRadioGroup from '@/domains/example/components/ui-components/radiogroup/PaymentMethodRadioGroup';
import SurveyRatingRadioGroup from '@/domains/example/components/ui-components/radiogroup/SurveyRatingRadioGroup';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import paySource from '@/domains/example/components/ui-components/radiogroup/PaymentMethodRadioGroup.tsx?raw';
import payCss from '@/domains/example/components/ui-components/radiogroup/PaymentMethodRadioGroup.module.css?raw';
import surveySource from '@/domains/example/components/ui-components/radiogroup/SurveyRatingRadioGroup.tsx?raw';
import surveyCss from '@/domains/example/components/ui-components/radiogroup/SurveyRatingRadioGroup.module.css?raw';
import { CircleDot } from 'lucide-react';

export default function RadioGroupComponent(): React.ReactNode {
	const uid = useId();
	const [plan, setPlan] = useState<string>('pro');
	const [delivery, setDelivery] = useState<string>('');
	const [submitted, setSubmitted] = useState(false);
	const deliveryInvalid = submitted && delivery === '';

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20">
					<CircleDot className="w-5 h-5 text-teal-600 dark:text-teal-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">RadioGroup 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-teal-300/50 bg-teal-100/60 text-teal-800 dark:border-teal-600/40 dark:bg-teal-900/30 dark:text-teal-300">
							@axiom/components/ui
						</code>
						에서 제공하는 RadioGroup 컴포넌트 사용 예제입니다. 여러 선택지 중 <b>하나만</b> 고르는 입력에 사용합니다.
					</p>
				</div>
			</div>

			{/* ── 0. import ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import"
					description="RadioGroup은 항상 Label과 함께 쓰는 것을 권장합니다. (Label 클릭만으로 선택되고, 스크린리더가 항목 이름을 읽습니다)"
				/>
				<CodeBlock
					code={`import { RadioGroup, RadioGroupItem, Label } from '@axiom/components/ui';`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본 사용"
					description="RadioGroup 안에 RadioGroupItem을 넣고, 각 항목에 고유한 value를 부여합니다. id ↔ htmlFor 로 Label을 연결합니다."
				/>
				<ExCard
					label="RadioGroup + RadioGroupItem + Label"
					code={`<RadioGroup defaultValue="comfortable">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="default" id="r1" />
    <Label htmlFor="r1">기본</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="comfortable" id="r2" />
    <Label htmlFor="r2">넓게</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="compact" id="r3" />
    <Label htmlFor="r3">좁게</Label>
  </div>
</RadioGroup>`}
				>
					<div className="w-full">
						<RadioGroup defaultValue="comfortable">
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="default"
									id={`${uid}-b1`}
								/>
								<Label htmlFor={`${uid}-b1`}>기본</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="comfortable"
									id={`${uid}-b2`}
								/>
								<Label htmlFor={`${uid}-b2`}>넓게</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="compact"
									id={`${uid}-b3`}
								/>
								<Label htmlFor={`${uid}-b3`}>좁게</Label>
							</div>
						</RadioGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 2. 가로 배치 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 가로 배치"
					description="RadioGroup의 기본 스타일은 grid gap-2(세로 나열)입니다. className으로 flex를 주면 가로로 배치됩니다."
				/>
				<ExCard
					label='className="flex flex-wrap gap-6"'
					code={`<RadioGroup defaultValue="all" className="flex flex-wrap gap-6">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="all" id="h1" />
    <Label htmlFor="h1">전체</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="ing" id="h2" />
    <Label htmlFor="h2">진행중</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="done" id="h3" />
    <Label htmlFor="h3">완료</Label>
  </div>
</RadioGroup>`}
				>
					<div className="w-full">
						<RadioGroup
							defaultValue="all"
							className="flex flex-wrap gap-6"
						>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="all"
									id={`${uid}-h1`}
								/>
								<Label htmlFor={`${uid}-h1`}>전체</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="ing"
									id={`${uid}-h2`}
								/>
								<Label htmlFor={`${uid}-h2`}>진행중</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="done"
									id={`${uid}-h3`}
								/>
								<Label htmlFor={`${uid}-h3`}>완료</Label>
							</div>
						</RadioGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 설명문이 있는 항목 ────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 설명문이 있는 항목"
					description="라디오와 텍스트를 상단 정렬(items-start)하고, Label 아래에 보조 설명을 배치합니다."
				/>
				<ExCard
					label="Label + 보조 설명"
					code={`<RadioGroup defaultValue="standard">
  <div className="flex items-start gap-3">
    <RadioGroupItem value="standard" id="d1" className="mt-0.5" />
    <div className="grid gap-0.5">
      <Label htmlFor="d1">일반 배송</Label>
      <p className="text-xs text-gray-500">3~5일 소요 · 무료</p>
    </div>
  </div>
  <div className="flex items-start gap-3">
    <RadioGroupItem value="express" id="d2" className="mt-0.5" />
    <div className="grid gap-0.5">
      <Label htmlFor="d2">빠른 배송</Label>
      <p className="text-xs text-gray-500">1~2일 소요 · 3,000원</p>
    </div>
  </div>
</RadioGroup>`}
				>
					<div className="w-full space-y-0">
						<RadioGroup defaultValue="standard">
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="standard"
									id={`${uid}-d1`}
									className="mt-0.5"
								/>
								<div className="grid gap-0.5">
									<Label htmlFor={`${uid}-d1`}>일반 배송</Label>
									<p className="text-xs text-gray-500 dark:text-gray-400">3~5일 소요 · 무료</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="express"
									id={`${uid}-d2`}
									className="mt-0.5"
								/>
								<div className="grid gap-0.5">
									<Label htmlFor={`${uid}-d2`}>빠른 배송</Label>
									<p className="text-xs text-gray-500 dark:text-gray-400">1~2일 소요 · 3,000원</p>
								</div>
							</div>
							<div className="flex items-start gap-3">
								<RadioGroupItem
									value="pickup"
									id={`${uid}-d3`}
									className="mt-0.5"
								/>
								<div className="grid gap-0.5">
									<Label htmlFor={`${uid}-d3`}>매장 픽업</Label>
									<p className="text-xs text-gray-500 dark:text-gray-400">가까운 매장에서 직접 수령 · 무료</p>
								</div>
							</div>
						</RadioGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 4. Disabled ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. Disabled (비활성화)"
					description="RadioGroupItem에 주면 해당 항목만, RadioGroup에 주면 그룹 전체가 비활성화됩니다."
				/>
				<ExCard
					label="항목 단위 disabled / 그룹 단위 disabled"
					code={`{/* 항목 하나만 비활성화 */}
<RadioGroup defaultValue="basic">
  <div className="flex items-center gap-2">
    <RadioGroupItem value="basic" id="x1" />
    <Label htmlFor="x1">베이직</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="enterprise" id="x2" disabled />
    <Label htmlFor="x2">엔터프라이즈 (문의 필요)</Label>
  </div>
</RadioGroup>

{/* 그룹 전체 비활성화 */}
<RadioGroup defaultValue="a" disabled>
  ...
</RadioGroup>`}
				>
					<div className="w-full grid gap-6 sm:grid-cols-2">
						<div className="space-y-2">
							<p className="text-xs font-medium text-gray-500 dark:text-gray-400">항목 단위</p>
							<RadioGroup defaultValue="basic">
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="basic"
										id={`${uid}-x1`}
									/>
									<Label htmlFor={`${uid}-x1`}>베이직</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="enterprise"
										id={`${uid}-x2`}
										disabled
									/>
									<Label htmlFor={`${uid}-x2`}>엔터프라이즈 (문의 필요)</Label>
								</div>
							</RadioGroup>
						</div>
						<div className="space-y-2">
							<p className="text-xs font-medium text-gray-500 dark:text-gray-400">그룹 단위</p>
							<RadioGroup
								defaultValue="y1"
								disabled
							>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="y1"
										id={`${uid}-y1`}
									/>
									<Label htmlFor={`${uid}-y1`}>읽기 전용 A</Label>
								</div>
								<div className="flex items-center gap-2">
									<RadioGroupItem
										value="y2"
										id={`${uid}-y2`}
									/>
									<Label htmlFor={`${uid}-y2`}>읽기 전용 B</Label>
								</div>
							</RadioGroup>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 5. 유효성 검사 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 유효성 검사 (aria-invalid)"
					description="필수 선택인데 값이 없을 때 RadioGroupItem에 aria-invalid를 주면 destructive(빨강) 링 스타일이 적용됩니다. 아래 '제출' 버튼을 선택 없이 눌러보세요."
				/>
				<ExCard
					label="aria-invalid={hasError}"
					code={`const [delivery, setDelivery] = useState('');
const [submitted, setSubmitted] = useState(false);
const invalid = submitted && delivery === '';

<RadioGroup value={delivery} onValueChange={setDelivery}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="std" id="v1" aria-invalid={invalid} />
    <Label htmlFor="v1">일반 배송</Label>
  </div>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="exp" id="v2" aria-invalid={invalid} />
    <Label htmlFor="v2">빠른 배송</Label>
  </div>
</RadioGroup>
{invalid && <p className="text-xs text-destructive">배송 방법을 선택해 주세요.</p>}`}
				>
					<div className="w-full space-y-3">
						<RadioGroup
							value={delivery}
							onValueChange={setDelivery}
						>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="std"
									id={`${uid}-v1`}
									aria-invalid={deliveryInvalid}
								/>
								<Label htmlFor={`${uid}-v1`}>일반 배송</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="exp"
									id={`${uid}-v2`}
									aria-invalid={deliveryInvalid}
								/>
								<Label htmlFor={`${uid}-v2`}>빠른 배송</Label>
							</div>
						</RadioGroup>
						{deliveryInvalid && <p className="text-xs text-red-600 dark:text-red-400">배송 방법을 선택해 주세요.</p>}
						<div className="flex gap-2">
							<button
								type="button"
								onClick={() => setSubmitted(true)}
								className="px-3 py-1 rounded-lg text-xs font-medium border border-teal-600 bg-teal-600 text-white hover:bg-teal-700 transition-colors"
							>
								제출
							</button>
							<button
								type="button"
								onClick={() => {
									setSubmitted(false);
									setDelivery('');
								}}
								className="px-3 py-1 rounded-lg text-xs font-medium border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-500 hover:border-gray-400 transition-colors"
							>
								초기화
							</button>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 6. 인터랙티브 예제 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 인터랙티브 예제 — Controlled"
					description="value / onValueChange로 선택값을 외부 상태에서 제어합니다. (미지정 시 defaultValue를 쓰는 비제어 모드)"
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 선택값: <code className="font-mono text-teal-700 dark:text-teal-400">{plan || '없음'}</code>
						</span>
					</div>
					<div className="p-5 space-y-3">
						<div className="flex flex-wrap gap-2">
							{['starter', 'pro', 'enterprise'].map((v) => (
								<button
									key={v}
									type="button"
									onClick={() => setPlan(v)}
									className={`px-3 py-1 rounded-lg text-xs font-medium border transition-colors ${
										plan === v
											? 'bg-teal-600 text-white border-teal-600'
											: 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-700 hover:border-teal-400'
									}`}
								>
									{v} 선택
								</button>
							))}
						</div>
						<RadioGroup
							value={plan}
							onValueChange={setPlan}
						>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="starter"
									id={`${uid}-p1`}
								/>
								<Label htmlFor={`${uid}-p1`}>스타터 플랜 ($9/월)</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="pro"
									id={`${uid}-p2`}
								/>
								<Label htmlFor={`${uid}-p2`}>프로 플랜 ($29/월)</Label>
							</div>
							<div className="flex items-center gap-2">
								<RadioGroupItem
									value="enterprise"
									id={`${uid}-p3`}
								/>
								<Label htmlFor={`${uid}-p3`}>엔터프라이즈 플랜 ($99/월)</Label>
							</div>
						</RadioGroup>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [plan, setPlan] = useState('pro');

<RadioGroup value={plan} onValueChange={setPlan}>
  <div className="flex items-center gap-2">
    <RadioGroupItem value="starter" id="p1" />
    <Label htmlFor="p1">스타터 플랜 ($9/월)</Label>
  </div>
  ...
</RadioGroup>`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="RadioGroup / RadioGroupItem 모두 radix-ui 기반이라 위 props 외의 div·button 속성은 그대로 전달됩니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
										컴포넌트
									</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{
										component: 'RadioGroup',
										prop: 'value',
										type: 'string',
										desc: '현재 선택된 항목의 value (제어 모드)',
									},
									{
										component: 'RadioGroup',
										prop: 'defaultValue',
										type: 'string',
										desc: '초기 선택 항목 (비제어 모드)',
									},
									{
										component: 'RadioGroup',
										prop: 'onValueChange',
										type: '(value: string) => void',
										desc: '선택이 바뀔 때 호출되는 콜백',
									},
									{
										component: 'RadioGroup',
										prop: 'name',
										type: 'string',
										desc: 'form 전송 시 사용할 필드명 (미지정 시 자동 생성)',
									},
									{
										component: 'RadioGroup',
										prop: 'required',
										type: 'boolean',
										desc: 'form 제출 시 선택 필수 여부',
									},
									{
										component: 'RadioGroup',
										prop: 'disabled',
										type: 'boolean',
										desc: '그룹 전체 비활성화',
									},
									{
										component: 'RadioGroup',
										prop: 'orientation',
										type: '"horizontal" | "vertical"',
										desc: '키보드 방향키 이동 축 (시각적 배치는 className으로)',
									},
									{
										component: 'RadioGroup',
										prop: 'loop',
										type: 'boolean',
										desc: '방향키 이동이 처음/끝에서 순환할지 (기본 true)',
									},
									{
										component: 'RadioGroupItem',
										prop: 'value',
										type: 'string',
										desc: '항목을 식별하는 고유 값 (필수)',
									},
									{
										component: 'RadioGroupItem',
										prop: 'id',
										type: 'string',
										desc: 'Label의 htmlFor와 연결할 id (접근성상 권장)',
									},
									{
										component: 'RadioGroupItem',
										prop: 'disabled',
										type: 'boolean',
										desc: '해당 항목만 비활성화',
									},
									{
										component: 'RadioGroupItem',
										prop: 'aria-invalid',
										type: 'boolean',
										desc: '유효성 오류 표시 (destructive 링 스타일)',
									},
								].map((row, i) => (
									<tr
										key={i}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-teal-700 dark:text-teal-400">{row.component}</code>
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
				</div>
			</section>

			{/* ── 퍼블리셔 커스터마이징 가이드 ───────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="퍼블리셔 커스터마이징 가이드"
					description="RadioGroup은 프로젝트마다 디자인이 크게 바뀌는 컴포넌트입니다. shadcn 원본(src/shared/lib/shadcn/ui/radio-group.tsx)을 수정하지 말고, 아래 data-slot 후크를 CSS Module에서 덮어쓰세요."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="overflow-x-auto">
						<table className="w-full text-sm">
							<thead>
								<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
										data-slot
									</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
										기본 스타일
									</th>
									<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
										주로 바꾸는 것
									</th>
								</tr>
							</thead>
							<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
								{[
									{
										slot: 'radio-group',
										base: 'grid w-full gap-2',
										change: '배치(세로/가로/그리드), 항목 간격, 트랙 배경',
									},
									{
										slot: 'radio-group-item',
										base: 'size-4 rounded-full border border-input',
										change: '크기, 테두리, 선택 색(브랜드 컬러), 포커스 링, 아예 숨기기',
									},
									{
										slot: 'radio-group-indicator',
										base: 'size-2 rounded-full 안쪽 점',
										change: '점 크기·색, 체크 아이콘으로 교체',
									},
									{
										slot: 'label',
										base: 'flex items-center gap-2 text-sm',
										change: '카드형 클릭 영역, 타이포, 선택 시 배경',
									},
								].map((row, i) => (
									<tr
										key={i}
										className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
									>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-teal-700 dark:text-teal-400">{row.slot}</code>
										</td>
										<td className="px-4 py-2.5">
											<code className="text-xs font-mono text-gray-600 dark:text-gray-400">{row.base}</code>
										</td>
										<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.change}</td>
									</tr>
								))}
							</tbody>
						</table>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							lang="css"
							code={`/* MyRadio.module.css — 컴포넌트(.tsx)는 그대로 두고 모양만 덮어쓴다 */

/* 1) 그룹: 기본 grid → 가로 세그먼트 */
.wrap :global([data-slot='radio-group']) {
	display: flex;
	gap: 6px;
}

/* 2) 라디오 원형: 크기/색 교체.
      선택 상태는 radix가 data-state="checked" (버전에 따라 data-checked)로 노출한다.
      둘 다 걸어두면 버전 업에도 안전하다. */
.wrap :global([data-slot='radio-group-item']) {
	width: 22px;
	height: 22px;
	border: 2px solid #d3dedd;
}
.wrap :global([data-slot='radio-group-item'])[data-state='checked'],
.wrap :global([data-slot='radio-group-item'])[data-checked] {
	border-color: #0d9488;
	background: #0d9488;
}

/* 3) 안쪽 점 */
.wrap :global([data-slot='radio-group-indicator']) > span {
	width: 8px;
	height: 8px;
	background: #fff;
}

/* 4) 다크 모드는 앱 규칙대로 :global(.dark) 로 */
:global(.dark) .wrap {
	--brand: #2dd4bf;
}`}
						/>
					</div>
				</div>

				<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/15 px-4 py-3 space-y-1.5">
					<p className="text-xs font-semibold text-amber-800 dark:text-amber-300">주의사항</p>
					<ul className="list-disc pl-4 space-y-1 text-xs text-amber-800/90 dark:text-amber-200/80">
						<li>
							라디오를 숨길 때 <code className="font-mono">display:none</code> /{' '}
							<code className="font-mono">visibility:hidden</code>은 쓰지 않습니다. 키보드 포커스와 스크린리더가 함께
							사라집니다. 아래 설문 예제처럼 <code className="font-mono">position:absolute + clip-path</code> 로
							시각적으로만 감추세요.
						</li>
						<li>
							Tailwind 유틸리티가 이미 걸려 있으므로 명시도를 확보해야 합니다. 래퍼 클래스(
							<code className="font-mono">.wrap</code>) 아래에서{' '}
							<code className="font-mono">:global([data-slot='...'])</code> 형태로 선택하세요.
						</li>
						<li>
							<code className="font-mono">src/shared/lib/shadcn/ui/radio-group.tsx</code> 원본은 수정하지 않습니다. 다른
							화면 전체가 함께 바뀌고, shadcn 업데이트 시 충돌합니다.
						</li>
					</ul>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 결제수단 선택 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 결제수단 선택 (카드형)"
					description="제공 RadioGroup을 그대로 쓰되 *.module.css 로 '선택 가능한 카드' 형태로 재스타일링했습니다. 카드 전체가 클릭 영역이고, 비활성 항목·수수료 합산까지 실제로 동작합니다."
				/>

				<PaymentMethodRadioGroup />

				<SourceTabs
					files={[
						{ filename: 'PaymentMethodRadioGroup.tsx', code: paySource, lang: 'tsx' },
						{ filename: 'PaymentMethodRadioGroup.module.css', code: payCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 만족도 설문 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 만족도 설문 (세그먼트형)"
					description="바로 위 결제수단 예제와 '똑같은' RadioGroup 컴포넌트인데, *.module.css 만 달리해서 라디오 동그라미가 아예 없는 가로 세그먼트가 되었습니다. 스타일이 얼마나 멀리 갈 수 있는지 보여주는 예제이며, 키보드 ←/→ 이동도 그대로 동작합니다."
				/>

				<SurveyRatingRadioGroup />

				<SourceTabs
					files={[
						{ filename: 'SurveyRatingRadioGroup.tsx', code: surveySource, lang: 'tsx' },
						{ filename: 'SurveyRatingRadioGroup.module.css', code: surveyCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
