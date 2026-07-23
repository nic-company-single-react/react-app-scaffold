import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
	Label,
	Button,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/SourceTabs';
import WithdrawAccountSelect from '@/domains/example/components/ui-components/WithdrawAccountSelect';
import ProductFilterSelect from '@/domains/example/components/ui-components/ProductFilterSelect';
import withdrawSource from '@/domains/example/components/ui-components/WithdrawAccountSelect.tsx?raw';
import withdrawCss from '@/domains/example/components/ui-components/WithdrawAccountSelect.module.css?raw';
import filterSource from '@/domains/example/components/ui-components/ProductFilterSelect.tsx?raw';
import filterCss from '@/domains/example/components/ui-components/ProductFilterSelect.module.css?raw';
import { ListFilter } from 'lucide-react';

/* ── 공통 데이터 ──────────────────────────────────────── */
const CITIES = [
	{ value: 'seoul', label: '서울' },
	{ value: 'busan', label: '부산' },
	{ value: 'incheon', label: '인천' },
	{ value: 'daegu', label: '대구' },
	{ value: 'gwangju', label: '광주' },
];

/** 스크롤 예제용 — 1월 ~ 12월 */
const MONTHS = Array.from({ length: 12 }, (_, i) => ({ value: String(i + 1), label: i + 1 + '월' }));

export default function SelectComponent(): React.ReactNode {
	const [city, setCity] = useState<string>('');
	const [fruit, setFruit] = useState<string>('');
	const [submitted, setSubmitted] = useState(false);
	const cityInvalid = submitted && city === '';

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<ListFilter className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Select 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Select 컴포넌트 사용 예제입니다. 정해진 목록에서 <b>하나만</b> 고르는 입력에 사용합니다.
					</p>
				</div>
			</div>

			{/* ── Select vs Combobox ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="Select vs Combobox — 무엇을 쓸까?"
					description="둘 다 '목록에서 고르는' UI지만 용도가 다릅니다. 항목이 적고 검색이 필요 없으면 Select, 항목이 많거나 검색·다중선택이 필요하면 Combobox를 쓰세요."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									비교 항목
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-sky-700 dark:text-sky-400 text-xs">Select</th>
								<th className="text-left px-4 py-2.5 font-medium text-violet-700 dark:text-violet-400 text-xs">
									Combobox
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ k: '입력 방식', s: '클릭 · 키보드로 선택만', c: '텍스트 입력(검색) + 선택' },
								{ k: '검색/필터', s: '없음 (첫 글자 점프만 지원)', c: '내장 — 입력값으로 항목 필터링' },
								{ k: '다중 선택', s: '불가 (항상 단일 값)', c: '가능 — Chips 로 여러 값 표시' },
								{ k: '자유 입력', s: '불가 — 목록에 없는 값은 못 넣음', c: '가능 (설정에 따라 새 값 허용)' },
								{ k: '적정 항목 수', s: '~15개 이하', c: '수십~수백 개' },
								{
									k: '대표 사용처',
									s: '성별, 등급, 정렬 기준, 카드사 선택',
									c: '국가/도시, 상품·계좌 검색, 태그 다중선택',
								},
								{ k: '폼 전송', s: 'name prop → hidden native select 자동 생성', c: '직접 상태를 폼에 매핑' },
								{ k: '구현 베이스', s: 'radix-ui Select', c: 'base-ui Combobox' },
							].map((row) => (
								<tr
									key={row.k}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300">{row.k}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.s}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.c}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
						한 줄 요약 — <b>목록이 짧고 고정</b>이면 Select, <b>찾아야 할 만큼 많거나 여러 개</b>를 고르면 Combobox.
						Combobox 예제는 좌측 메뉴 <code className="font-mono">UI Components &gt; Combobox</code> 에 있습니다.
					</div>
				</div>
			</section>

			{/* ── 0. import ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import"
					description="Select는 여러 하위 컴포넌트의 조합입니다. 최소 구성은 Select + SelectTrigger + SelectValue + SelectContent + SelectItem 입니다."
				/>
				<CodeBlock
					code={`import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectGroup,
  SelectLabel,
  SelectItem,
  SelectSeparator,
} from '@axiom/components/ui';`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본 사용"
					description="SelectValue의 placeholder로 선택 전 안내 문구를 지정하고, 각 SelectItem에 고유한 value를 부여합니다."
				/>
				<ExCard
					label="Select + SelectTrigger + SelectContent + SelectItem"
					code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="도시를 선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="seoul">서울</SelectItem>
    <SelectItem value="busan">부산</SelectItem>
    <SelectItem value="incheon">인천</SelectItem>
  </SelectContent>
</Select>`}
				>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="도시를 선택하세요" />
						</SelectTrigger>
						<SelectContent>
							{CITIES.map((c) => (
								<SelectItem
									key={c.value}
									value={c.value}
								>
									{c.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ExCard>
			</section>

			{/* ── 2. defaultValue / Label 연결 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. defaultValue + Label 연결"
					description="defaultValue로 초기 선택값을 지정합니다. 폼에서는 Label의 htmlFor와 SelectTrigger의 id를 연결해 접근성을 확보하세요."
				/>
				<ExCard
					label='defaultValue="busan" / <Label htmlFor>'
					code={`<div className="grid gap-2">
  <Label htmlFor="city">거주 도시</Label>
  <Select defaultValue="busan">
    <SelectTrigger id="city">
      <SelectValue placeholder="도시를 선택하세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="seoul">서울</SelectItem>
      <SelectItem value="busan">부산</SelectItem>
    </SelectContent>
  </Select>
</div>`}
				>
					<div className="grid gap-2">
						<Label htmlFor="ex-city">거주 도시</Label>
						<Select defaultValue="busan">
							<SelectTrigger id="ex-city">
								<SelectValue placeholder="도시를 선택하세요" />
							</SelectTrigger>
							<SelectContent>
								{CITIES.map((c) => (
									<SelectItem
										key={c.value}
										value={c.value}
									>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</ExCard>
			</section>

			{/* ── 3. Group / Label / Separator ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 그룹 — SelectGroup / SelectLabel / SelectSeparator"
					description="항목이 많을 때 카테고리로 묶습니다. SelectLabel은 그룹 제목(선택 불가), SelectSeparator는 구분선입니다."
				/>
				<ExCard
					label="SelectGroup + SelectLabel + SelectSeparator"
					code={`<Select>
  <SelectTrigger>
    <SelectValue placeholder="과일을 선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectGroup>
      <SelectLabel>국산</SelectLabel>
      <SelectItem value="apple">사과</SelectItem>
      <SelectItem value="pear">배</SelectItem>
    </SelectGroup>
    <SelectSeparator />
    <SelectGroup>
      <SelectLabel>수입</SelectLabel>
      <SelectItem value="banana">바나나</SelectItem>
      <SelectItem value="mango">망고</SelectItem>
    </SelectGroup>
  </SelectContent>
</Select>`}
				>
					<Select
						value={fruit}
						onValueChange={setFruit}
					>
						<SelectTrigger>
							<SelectValue placeholder="과일을 선택하세요" />
						</SelectTrigger>
						<SelectContent>
							<SelectGroup>
								<SelectLabel>국산</SelectLabel>
								<SelectItem value="apple">사과</SelectItem>
								<SelectItem value="pear">배</SelectItem>
								<SelectItem value="peach">복숭아</SelectItem>
							</SelectGroup>
							<SelectSeparator />
							<SelectGroup>
								<SelectLabel>수입</SelectLabel>
								<SelectItem value="banana">바나나</SelectItem>
								<SelectItem value="mango">망고</SelectItem>
								<SelectItem value="avocado">아보카도</SelectItem>
							</SelectGroup>
						</SelectContent>
					</Select>
				</ExCard>
			</section>

			{/* ── 4. size / 너비 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. size 와 너비"
					description='SelectTrigger의 size는 "sm"(h-7) / "default"(h-8)를 지원합니다. 트리거는 기본이 w-fit(내용 너비)이므로, 폼에서 전체 너비가 필요하면 className="w-full"을 주세요.'
				/>
				<ExCard
					label='size="sm" / size="default" / className="w-full"'
					code={`<SelectTrigger size="sm">...</SelectTrigger>
<SelectTrigger>...</SelectTrigger>

{/* 폼 필드처럼 꽉 채우기 */}
<SelectTrigger className="w-full">...</SelectTrigger>`}
				>
					<div className="w-full space-y-3">
						<div className="flex flex-wrap items-center gap-3">
							<Select defaultValue="seoul">
								<SelectTrigger size="sm">
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CITIES.map((c) => (
										<SelectItem
											key={c.value}
											value={c.value}
										>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<Select defaultValue="seoul">
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									{CITIES.map((c) => (
										<SelectItem
											key={c.value}
											value={c.value}
										>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
						</div>
						<Select defaultValue="seoul">
							<SelectTrigger className="w-full">
								<SelectValue />
							</SelectTrigger>
							<SelectContent>
								{CITIES.map((c) => (
									<SelectItem
										key={c.value}
										value={c.value}
									>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
					</div>
				</ExCard>
			</section>

			{/* ── 5. Disabled ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Disabled — 전체 / 개별 항목"
					description="Select에 disabled를 주면 전체가, SelectItem에 주면 해당 항목만 비활성화됩니다."
				/>
				<ExCard
					label="Select disabled / SelectItem disabled"
					code={`{/* 전체 비활성화 */}
<Select disabled defaultValue="seoul">
  <SelectTrigger><SelectValue /></SelectTrigger>
  <SelectContent>...</SelectContent>
</Select>

{/* 특정 항목만 비활성화 */}
<SelectItem value="daegu" disabled>대구 (마감)</SelectItem>`}
				>
					<Select
						disabled
						defaultValue="seoul"
					>
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="seoul">서울</SelectItem>
						</SelectContent>
					</Select>
					<Select>
						<SelectTrigger>
							<SelectValue placeholder="지점 선택" />
						</SelectTrigger>
						<SelectContent>
							<SelectItem value="seoul">서울</SelectItem>
							<SelectItem value="busan">부산</SelectItem>
							<SelectItem
								value="daegu"
								disabled
							>
								대구 (마감)
							</SelectItem>
						</SelectContent>
					</Select>
				</ExCard>
			</section>

			{/* ── 6. position ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title='6. position — "item-aligned"(기본) vs "popper"'
					description="item-aligned는 선택된 항목이 트리거 위에 겹쳐 뜨는 네이티브 셀렉트 방식이고, popper는 트리거 아래에 붙는 드롭다운 방식입니다. popper일 때 sideOffset / align 을 함께 쓸 수 있습니다."
				/>
				<ExCard
					label='position="popper" align="start" sideOffset={6}'
					code={`{/* 기본 — 선택 항목이 트리거 위에 정렬 */}
<SelectContent>...</SelectContent>

{/* 트리거 아래에 붙는 일반 드롭다운 */}
<SelectContent position="popper" align="start" sideOffset={6}>
  ...
</SelectContent>`}
				>
					<Select defaultValue="incheon">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{CITIES.map((c) => (
								<SelectItem
									key={c.value}
									value={c.value}
								>
									{c.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
					<Select defaultValue="incheon">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent
							position="popper"
							align="start"
							sideOffset={6}
						>
							{CITIES.map((c) => (
								<SelectItem
									key={c.value}
									value={c.value}
								>
									{c.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ExCard>
			</section>

			{/* ── 7. 긴 목록 스크롤 ─────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 긴 목록 — 스크롤 버튼"
					description="항목이 화면보다 길면 위/아래 스크롤 버튼(SelectScrollUpButton / DownButton)이 자동으로 붙습니다. 목록 높이는 className으로 제한할 수 있습니다."
				/>
				<ExCard
					label='SelectContent className="max-h-56"'
					code={`<SelectContent className="max-h-56">
  {months.map((m) => (
    <SelectItem key={m.value} value={m.value}>{m.label}</SelectItem>
  ))}
</SelectContent>`}
				>
					<Select defaultValue="1">
						<SelectTrigger>
							<SelectValue />
						</SelectTrigger>
						<SelectContent className="max-h-56">
							{MONTHS.map((m) => (
								<SelectItem
									key={m.value}
									value={m.value}
								>
									{m.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</ExCard>
			</section>

			{/* ── 8. Controlled + 유효성 ────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 인터랙티브 예제 — Controlled + 유효성"
					description="value / onValueChange로 외부에서 값을 제어하고, 미선택 상태에서 제출하면 aria-invalid로 에러 스타일을 표시합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 값: <code className="font-mono text-sky-700 dark:text-sky-400">{city || '(없음)'}</code>
						</span>
					</div>
					<div className="p-5 space-y-3">
						<div className="grid gap-2">
							<Label htmlFor="ctl-city">배송 지역 (필수)</Label>
							<Select
								value={city}
								onValueChange={(v) => {
									setCity(v);
									setSubmitted(false);
								}}
							>
								<SelectTrigger
									id="ctl-city"
									className="w-full"
									aria-invalid={cityInvalid}
								>
									<SelectValue placeholder="지역을 선택하세요" />
								</SelectTrigger>
								<SelectContent>
									{CITIES.map((c) => (
										<SelectItem
											key={c.value}
											value={c.value}
										>
											{c.label}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							{cityInvalid && <p className="text-xs text-red-600 dark:text-red-400">배송 지역을 선택해 주세요.</p>}
						</div>
						<div className="flex flex-wrap gap-2">
							<Button
								size="sm"
								onClick={() => setSubmitted(true)}
							>
								제출
							</Button>
							<Button
								size="sm"
								variant="outline"
								onClick={() => {
									setCity('');
									setSubmitted(false);
								}}
							>
								초기화
							</Button>
							<Button
								size="sm"
								variant="ghost"
								onClick={() => setCity('busan')}
							>
								부산으로 설정
							</Button>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [city, setCity] = useState('');
const [submitted, setSubmitted] = useState(false);
const invalid = submitted && city === '';

<Select value={city} onValueChange={setCity}>
  <SelectTrigger className="w-full" aria-invalid={invalid}>
    <SelectValue placeholder="지역을 선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="seoul">서울</SelectItem>
    <SelectItem value="busan">부산</SelectItem>
  </SelectContent>
</Select>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 9. 폼 전송 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. 폼 전송 — name / required"
					description="Select에 name을 주면 내부적으로 숨겨진 native select가 생성되어 FormData로 값이 전송됩니다. 값 초기화는 Select에 key를 바꿔주거나 controlled로 처리하세요."
				/>
				<ExCard
					label="<form> + name prop"
					code={`<form onSubmit={handleSubmit}>
  <Select name="city" required>
    <SelectTrigger className="w-full">
      <SelectValue placeholder="도시를 선택하세요" />
    </SelectTrigger>
    <SelectContent>
      <SelectItem value="seoul">서울</SelectItem>
    </SelectContent>
  </Select>
  <Button type="submit">전송</Button>
</form>

// handleSubmit
const fd = new FormData(e.currentTarget);
console.log(fd.get('city')); // 'seoul'`}
				>
					<form
						className="w-full flex flex-wrap items-center gap-3"
						onSubmit={(e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							alert('전송된 city = ' + String(fd.get('city') ?? ''));
						}}
					>
						<Select name="city">
							<SelectTrigger>
								<SelectValue placeholder="도시를 선택하세요" />
							</SelectTrigger>
							<SelectContent>
								{CITIES.map((c) => (
									<SelectItem
										key={c.value}
										value={c.value}
									>
										{c.label}
									</SelectItem>
								))}
							</SelectContent>
						</Select>
						<Button
							type="submit"
							size="sm"
						>
							전송
						</Button>
					</form>
				</ExCard>
			</section>

			{/* ── 10. 퍼블리셔 가이드 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="10. 퍼블리셔 가이드 — 스타일 오버라이드"
					description="Select는 실제 프로젝트에서 디자인이 가장 많이 바뀌는 컴포넌트입니다. .tsx를 수정하지 말고 data-slot 선택자를 CSS Module에서 덮어쓰세요. 아래 3가지만 알면 됩니다."
				/>

				<div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-900/10 p-4 space-y-3 text-xs text-amber-900 dark:text-amber-200">
					<p>
						<b>① SelectContent는 Portal(body 직속)로 렌더됩니다.</b> 래퍼 하위 선택자(
						<code className="font-mono">.wrap [data-slot=&quot;select-content&quot;]</code>)로는 절대 안 잡힙니다.
						드롭다운 스타일은{' '}
						<code className="font-mono">&lt;SelectContent className=&#123;styles.content&#125;&gt;</code> 처럼 직접
						넘기세요.
					</p>
					<p>
						<b>② 기본 스타일은 Tailwind 유틸리티(명시도 0,1,0)입니다.</b> CSS Module 클래스도 같은 명시도라 선언 순서에
						따라 밀릴 수 있습니다. <code className="font-mono">.trigger.trigger</code> 처럼 클래스를 두 번 겹쳐 명시도를
						올리면 <code className="font-mono">!important</code> 없이 안전하게 이깁니다.
					</p>
					<p>
						<b>③ SelectItem의 children은 전부 ItemText입니다.</b> 항목을 2줄 카드로 만들면 트리거에도 그대로 복제됩니다.
						트리거 표시를 따로 그리려면 <code className="font-mono">&lt;SelectValue&gt;</code>에 children을 주세요.
					</p>
				</div>

				<CodeBlock
					lang="css"
					theme="github-dark"
					code={`/* MySelect.module.css — 오버라이드 가능한 슬롯 목록 */
.trigger.trigger              { /* [data-slot="select-trigger"] */ }
.trigger.trigger[data-state='open']   { /* 열린 상태 */ }
.trigger.trigger[data-placeholder]    { /* 미선택 상태 */ }
.trigger.trigger[aria-invalid='true'] { /* 에러 상태 */ }

.content.content              { /* [data-slot="select-content"] — Portal! className 직접 전달 */ }
.item.item                    { /* [data-slot="select-item"] */ }
.item.item[data-highlighted]  { /* 키보드/마우스 hover */ }
.item.item[data-state='checked'] { /* 선택된 항목 */ }
.item.item[data-disabled]     { /* 비활성 항목 */ }
.groupLabel.groupLabel        { /* [data-slot="select-label"] */ }
.separator.separator          { /* [data-slot="select-separator"] */ }

/* 다크 모드는 앱 규칙(.dark)에 맞춰 */
:global(.dark) .trigger.trigger { }`}
				/>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
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
								{ component: 'Select', prop: 'value', type: 'string', desc: '현재 선택값 (제어 모드)' },
								{
									component: 'Select',
									prop: 'onValueChange',
									type: '(value: string) => void',
									desc: '선택이 바뀔 때 호출',
								},
								{ component: 'Select', prop: 'defaultValue', type: 'string', desc: '초기 선택값 (비제어)' },
								{ component: 'Select', prop: 'disabled', type: 'boolean', desc: '전체 비활성화' },
								{
									component: 'Select',
									prop: 'name',
									type: 'string',
									desc: '폼 전송용 이름 (hidden native select 생성)',
								},
								{ component: 'Select', prop: 'required', type: 'boolean', desc: '폼 필수 값 여부' },
								{
									component: 'Select',
									prop: 'open / onOpenChange',
									type: 'boolean / (open) => void',
									desc: '드롭다운 열림 상태 제어',
								},
								{
									component: 'SelectTrigger',
									prop: 'size',
									type: '"sm" | "default"',
									desc: '높이 (sm: h-7, default: h-8)',
								},
								{
									component: 'SelectTrigger',
									prop: 'className',
									type: 'string',
									desc: '기본이 w-fit이므로 전체 너비는 "w-full" 지정',
								},
								{
									component: 'SelectValue',
									prop: 'placeholder',
									type: 'ReactNode',
									desc: '미선택 상태에 표시할 내용',
								},
								{
									component: 'SelectValue',
									prop: 'children',
									type: 'ReactNode',
									desc: '트리거 표시를 직접 그릴 때 (미지정 시 선택 항목 텍스트 복제)',
								},
								{
									component: 'SelectContent',
									prop: 'position',
									type: '"item-aligned" | "popper"',
									desc: '기본 item-aligned. popper는 트리거 아래 부착',
								},
								{
									component: 'SelectContent',
									prop: 'align / side / sideOffset',
									type: 'string / number',
									desc: 'popper 모드에서의 위치 조정',
								},
								{ component: 'SelectItem', prop: 'value', type: 'string', desc: '항목 값 (필수, 빈 문자열 불가)' },
								{ component: 'SelectItem', prop: 'disabled', type: 'boolean', desc: '해당 항목만 비활성화' },
								{ component: 'SelectGroup', prop: '-', type: '-', desc: 'SelectLabel + SelectItem 묶음' },
								{ component: 'SelectSeparator', prop: '-', type: '-', desc: '그룹 사이 구분선' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-sky-700 dark:text-sky-400">{row.component}</code>
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
				<p className="text-xs text-gray-500 dark:text-gray-400">
					⚠️ <code className="font-mono">SelectItem</code>의 <code className="font-mono">value</code>에 빈 문자열(
					<code className="font-mono">&quot;&quot;</code>)은 사용할 수 없습니다. &quot;전체/선택 안 함&quot; 항목이
					필요하면 <code className="font-mono">value=&quot;all&quot;</code> 같은 실제 값을 쓰세요.
				</p>
			</section>

			{/* ── 기타. 실전 예제 — 출금 계좌 선택 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 계좌 이체(출금 계좌 선택)"
					description="제공 Select를 그대로 쓰되 *.module.css로 2줄 계좌 카드형 UI로 완전히 재스타일링했습니다. Portal 대응(SelectContent에 className 직접 전달), 명시도 확보(.trigger.trigger), 트리거 커스텀 표시(SelectValue children) 3가지 실전 기법이 모두 들어 있습니다."
				/>

				<WithdrawAccountSelect />

				<SourceTabs
					files={[
						{ filename: 'WithdrawAccountSelect.tsx', code: withdrawSource, lang: 'tsx' },
						{ filename: 'WithdrawAccountSelect.module.css', code: withdrawCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 목록 필터 바 ───────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 상품 목록 필터 바"
					description="바로 위 예제와 똑같은 Select를 이번엔 알약(pill) 형태의 필터 바로 입혔습니다. 컴포넌트는 손대지 않고 CSS만 갈아끼워 톤이 완전히 달라지는 것을 보여주는 예제입니다. 값이 선택된 필터는 채워진 pill로 바뀝니다."
				/>

				<ProductFilterSelect />

				<SourceTabs
					files={[
						{ filename: 'ProductFilterSelect.tsx', code: filterSource, lang: 'tsx' },
						{ filename: 'ProductFilterSelect.module.css', code: filterCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
