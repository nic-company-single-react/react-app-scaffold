import { useState } from 'react';
import { NativeSelect, NativeSelectOption, NativeSelectOptGroup, Label, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import GridToolbarNativeSelect from '@/domains/example/components/ui-components/native-select/GridToolbarNativeSelect';
import gridSource from '@/domains/example/components/ui-components/native-select/GridToolbarNativeSelect.tsx?raw';
import gridCss from '@/domains/example/components/ui-components/native-select/GridToolbarNativeSelect.module.css?raw';
import { SquareChevronDown } from 'lucide-react';

/* ── 공통 데이터 ──────────────────────────────────────── */
const CITIES = [
	{ value: 'seoul', label: '서울' },
	{ value: 'busan', label: '부산' },
	{ value: 'incheon', label: '인천' },
	{ value: 'daegu', label: '대구' },
	{ value: 'gwangju', label: '광주' },
];

export default function NativeSelectComponent(): React.ReactNode {
	const [city, setCity] = useState<string>('');
	const [submitted, setSubmitted] = useState(false);
	const cityInvalid = submitted && city === '';

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20">
					<SquareChevronDown className="w-5 h-5 text-teal-600 dark:text-teal-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">NativeSelect 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-teal-300/50 bg-teal-100/60 text-teal-800 dark:border-teal-600/40 dark:bg-teal-900/30 dark:text-teal-300">
							@axiom/components/ui
						</code>
						에서 제공하는 NativeSelect 컴포넌트 사용 예제입니다. 브라우저 기본 <code className="font-mono">&lt;select&gt;</code>{' '}
						요소를 얇게 감싼 컴포넌트로, OS 네이티브 드롭다운을 그대로 사용합니다.
					</p>
				</div>
			</div>

			{/* ── NativeSelect vs Select ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="NativeSelect vs Select — 무엇을 쓸까?"
					description="둘 다 '목록에서 하나를 고르는' UI지만 동작 원리가 완전히 다릅니다. NativeSelect는 브라우저 기본 <select>라 드롭다운을 OS가 그리고, Select(radix)는 드롭다운까지 React가 직접 그립니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">비교 항목</th>
								<th className="text-left px-4 py-2.5 font-medium text-teal-700 dark:text-teal-400 text-xs">NativeSelect</th>
								<th className="text-left px-4 py-2.5 font-medium text-sky-700 dark:text-sky-400 text-xs">Select (radix)</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ k: '구현 베이스', n: '브라우저 기본 <select>', s: 'radix-ui Select (커스텀 렌더)' },
								{ k: '드롭다운 렌더링', n: 'OS/브라우저가 그림', s: 'React가 Portal로 그림' },
								{ k: '드롭다운(펼침) 스타일', n: '거의 불가 — OS 종속', s: '완전 커스텀 가능' },
								{ k: '옵션에 아이콘·2줄·체크마크', n: '불가 (텍스트만)', s: '가능' },
								{ k: '모바일 UX', n: 'OS 네이티브 피커(휠) — 매우 익숙', s: '커스텀 목록(작은 화면 설계 필요)' },
								{ k: '접근성', n: '브라우저 기본 제공(무료)', s: 'radix가 ARIA 직접 구현' },
								{ k: '값 변경 핸들러', n: 'onChange (e.target.value)', s: 'onValueChange (value)' },
								{ k: '폼 전송', n: '그냥 <select name> — 기본 동작', s: 'name → hidden select 자동 생성' },
								{ k: 'placeholder', n: '<option value="" disabled> 로 흉내', s: 'SelectValue placeholder prop' },
								{ k: '열림 상태 제어(open)', n: '불가', s: '가능 (open / onOpenChange)' },
								{ k: '번들 무게', n: '매우 가벼움', s: 'radix 의존성 포함' },
							].map((row) => (
								<tr
									key={row.k}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300">{row.k}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.n}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.s}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 text-xs text-gray-600 dark:text-gray-400">
						한 줄 요약 — 드롭다운 <b>안</b>을 커스텀할 필요가 없고 특히 <b>모바일 네이티브 피커</b>가 좋으면 NativeSelect,
						옵션에 아이콘/2줄/그룹 스타일 등 <b>드롭다운 자체를 꾸며야</b> 하면 Select. Select 예제는 좌측 메뉴{' '}
						<code className="font-mono">UI Components &gt; Select</code> 에 있습니다.
					</div>
				</div>
			</section>

			{/* ── 0. import ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import"
					description="NativeSelect(래퍼) 하나만으로도 동작합니다. 옵션은 표준 <option>을 써도 되지만, 다크 모드 색 보정이 들어간 NativeSelectOption / NativeSelectOptGroup 을 쓰는 것을 권장합니다."
				/>
				<CodeBlock
					code={`import {
  NativeSelect,
  NativeSelectOption,
  NativeSelectOptGroup,
} from '@axiom/components/ui';

<NativeSelect defaultValue="seoul">
  <NativeSelectOption value="seoul">서울</NativeSelectOption>
  <NativeSelectOption value="busan">부산</NativeSelectOption>
</NativeSelect>`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic + placeholder ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 기본 사용 & placeholder"
					description='네이티브 <select>는 placeholder가 따로 없습니다. value=""인 disabled 옵션을 맨 위에 두고 defaultValue=""로 두면 안내 문구처럼 보입니다.'
				/>
				<ExCard
					label='placeholder 흉내 — <option value="" disabled>'
					code={`<NativeSelect defaultValue="">
  <NativeSelectOption value="" disabled>
    도시를 선택하세요
  </NativeSelectOption>
  <NativeSelectOption value="seoul">서울</NativeSelectOption>
  <NativeSelectOption value="busan">부산</NativeSelectOption>
  <NativeSelectOption value="incheon">인천</NativeSelectOption>
</NativeSelect>`}
				>
					<NativeSelect defaultValue="">
						<NativeSelectOption
							value=""
							disabled
						>
							도시를 선택하세요
						</NativeSelectOption>
						{CITIES.map((c) => (
							<NativeSelectOption
								key={c.value}
								value={c.value}
							>
								{c.label}
							</NativeSelectOption>
						))}
					</NativeSelect>
				</ExCard>
			</section>

			{/* ── 2. defaultValue + Label 연결 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. defaultValue + Label 연결"
					description="defaultValue로 초기 선택값을 지정합니다. Label의 htmlFor와 NativeSelect의 id를 연결하면 라벨 클릭 시 셀렉트가 열립니다(접근성)."
				/>
				<ExCard
					label='defaultValue="busan" / <Label htmlFor>'
					code={`<div className="grid gap-2">
  <Label htmlFor="city">거주 도시</Label>
  <NativeSelect id="city" defaultValue="busan">
    <NativeSelectOption value="seoul">서울</NativeSelectOption>
    <NativeSelectOption value="busan">부산</NativeSelectOption>
  </NativeSelect>
</div>`}
				>
					<div className="grid gap-2">
						<Label htmlFor="ns-city">거주 도시</Label>
						<NativeSelect
							id="ns-city"
							defaultValue="busan"
						>
							{CITIES.map((c) => (
								<NativeSelectOption
									key={c.value}
									value={c.value}
								>
									{c.label}
								</NativeSelectOption>
							))}
						</NativeSelect>
					</div>
				</ExCard>
			</section>

			{/* ── 3. optgroup ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 그룹 — NativeSelectOptGroup"
					description="항목이 많을 때 label 속성을 가진 NativeSelectOptGroup으로 묶습니다. 네이티브 <optgroup>이라 브라우저가 회색 소제목으로 그려줍니다."
				/>
				<ExCard
					label="NativeSelectOptGroup label"
					code={`<NativeSelect defaultValue="apple">
  <NativeSelectOptGroup label="국산">
    <NativeSelectOption value="apple">사과</NativeSelectOption>
    <NativeSelectOption value="pear">배</NativeSelectOption>
  </NativeSelectOptGroup>
  <NativeSelectOptGroup label="수입">
    <NativeSelectOption value="banana">바나나</NativeSelectOption>
    <NativeSelectOption value="mango">망고</NativeSelectOption>
  </NativeSelectOptGroup>
</NativeSelect>`}
				>
					<NativeSelect defaultValue="apple">
						<NativeSelectOptGroup label="국산">
							<NativeSelectOption value="apple">사과</NativeSelectOption>
							<NativeSelectOption value="pear">배</NativeSelectOption>
							<NativeSelectOption value="peach">복숭아</NativeSelectOption>
						</NativeSelectOptGroup>
						<NativeSelectOptGroup label="수입">
							<NativeSelectOption value="banana">바나나</NativeSelectOption>
							<NativeSelectOption value="mango">망고</NativeSelectOption>
							<NativeSelectOption value="avocado">아보카도</NativeSelectOption>
						</NativeSelectOptGroup>
					</NativeSelect>
				</ExCard>
			</section>

			{/* ── 4. size / 너비 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. size 와 너비"
					description='size는 "sm"(h-7) / "default"(h-8)를 지원합니다. 래퍼가 기본 w-fit(내용 너비)이므로, 폼에서 전체 너비가 필요하면 className="w-full"을 주세요. (className은 래퍼에 적용됩니다)'
				/>
				<ExCard
					label='size="sm" / size="default" / className="w-full"'
					code={`<NativeSelect size="sm" defaultValue="seoul">...</NativeSelect>
<NativeSelect defaultValue="seoul">...</NativeSelect>

{/* 폼 필드처럼 꽉 채우기 — className 은 래퍼로 감 */}
<NativeSelect className="w-full" defaultValue="seoul">...</NativeSelect>`}
				>
					<div className="w-full space-y-3">
						<div className="flex flex-wrap items-center gap-3">
							<NativeSelect
								size="sm"
								defaultValue="seoul"
							>
								{CITIES.map((c) => (
									<NativeSelectOption
										key={c.value}
										value={c.value}
									>
										{c.label}
									</NativeSelectOption>
								))}
							</NativeSelect>
							<NativeSelect defaultValue="seoul">
								{CITIES.map((c) => (
									<NativeSelectOption
										key={c.value}
										value={c.value}
									>
										{c.label}
									</NativeSelectOption>
								))}
							</NativeSelect>
						</div>
						<NativeSelect
							className="w-full"
							defaultValue="seoul"
						>
							{CITIES.map((c) => (
								<NativeSelectOption
									key={c.value}
									value={c.value}
								>
									{c.label}
								</NativeSelectOption>
							))}
						</NativeSelect>
					</div>
				</ExCard>
			</section>

			{/* ── 5. Disabled ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Disabled — 전체 / 개별 항목"
					description="NativeSelect에 disabled를 주면 전체가(래퍼가 흐려짐), NativeSelectOption에 주면 해당 항목만 비활성화됩니다."
				/>
				<ExCard
					label="NativeSelect disabled / NativeSelectOption disabled"
					code={`{/* 전체 비활성화 */}
<NativeSelect disabled defaultValue="seoul">...</NativeSelect>

{/* 특정 항목만 비활성화 */}
<NativeSelectOption value="daegu" disabled>대구 (마감)</NativeSelectOption>`}
				>
					<NativeSelect
						disabled
						defaultValue="seoul"
					>
						<NativeSelectOption value="seoul">서울</NativeSelectOption>
					</NativeSelect>
					<NativeSelect defaultValue="seoul">
						<NativeSelectOption value="seoul">서울</NativeSelectOption>
						<NativeSelectOption value="busan">부산</NativeSelectOption>
						<NativeSelectOption
							value="daegu"
							disabled
						>
							대구 (마감)
						</NativeSelectOption>
					</NativeSelect>
				</ExCard>
			</section>

			{/* ── 6. Controlled + 유효성 ────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 인터랙티브 예제 — Controlled + 유효성"
					description="네이티브 <select>는 value / onChange로 제어합니다(Select의 onValueChange와 다름). 미선택 상태에서 제출하면 aria-invalid로 에러 스타일을 표시합니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 값: <code className="font-mono text-teal-700 dark:text-teal-400">{city || '(없음)'}</code>
						</span>
					</div>
					<div className="p-5 space-y-3">
						<div className="grid gap-2">
							<Label htmlFor="ctl-ns-city">배송 지역 (필수)</Label>
							<NativeSelect
								id="ctl-ns-city"
								className="w-full"
								aria-invalid={cityInvalid}
								value={city}
								onChange={(e) => {
									setCity(e.target.value);
									setSubmitted(false);
								}}
							>
								<option
									value=""
									disabled
								>
									지역을 선택하세요
								</option>
								{CITIES.map((c) => (
									<NativeSelectOption
										key={c.value}
										value={c.value}
									>
										{c.label}
									</NativeSelectOption>
								))}
							</NativeSelect>
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

<NativeSelect
  className="w-full"
  aria-invalid={invalid}
  value={city}
  onChange={(e) => setCity(e.target.value)}
>
  <option value="" disabled>지역을 선택하세요</option>
  <NativeSelectOption value="seoul">서울</NativeSelectOption>
  <NativeSelectOption value="busan">부산</NativeSelectOption>
</NativeSelect>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 7. 폼 전송 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 폼 전송 — name / required"
					description="네이티브 <select>이므로 name만 주면 FormData로 값이 그대로 전송됩니다. Select처럼 hidden select를 따로 만들 필요가 없습니다."
				/>
				<ExCard
					label="<form> + name prop"
					code={`<form onSubmit={handleSubmit}>
  <NativeSelect name="city" required defaultValue="">
    <option value="" disabled>도시를 선택하세요</option>
    <NativeSelectOption value="seoul">서울</NativeSelectOption>
  </NativeSelect>
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
						<NativeSelect
							name="city"
							required
							defaultValue=""
						>
							<option
								value=""
								disabled
							>
								도시를 선택하세요
							</option>
							{CITIES.map((c) => (
								<NativeSelectOption
									key={c.value}
									value={c.value}
								>
									{c.label}
								</NativeSelectOption>
							))}
						</NativeSelect>
						<Button
							type="submit"
							size="sm"
						>
							전송
						</Button>
					</form>
				</ExCard>
			</section>

			{/* ── 8. 퍼블리셔 가이드 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 퍼블리셔 가이드 — 스타일 오버라이드"
					description="NativeSelect는 실제 SI 프로젝트에서 디자인이 가장 많이 바뀌는 컴포넌트입니다. .tsx는 건드리지 말고 CSS Module에서 data-slot 선택자를 덮어쓰세요. 아래 3가지만 알면 됩니다."
				/>

				<div className="rounded-2xl border border-amber-200 dark:border-amber-900/50 bg-amber-50/60 dark:bg-amber-900/10 p-4 space-y-3 text-xs text-amber-900 dark:text-amber-200">
					<p>
						<b>① className은 셀렉트가 아니라 "래퍼"에 붙습니다.</b> NativeSelect 에 준 className 은{' '}
						<code className="font-mono">[data-slot=&quot;native-select-wrapper&quot;]</code> 로 갑니다. 실제 셀렉트 박스는
						그 안의 <code className="font-mono">[data-slot=&quot;native-select&quot;]</code> 라, 자손 선택자(
						<code className="font-mono">.field [data-slot=&quot;native-select&quot;]</code>)로 파고들어 스타일합니다.
					</p>
					<p>
						<b>② 펼쳐진 드롭다운 목록은 OS가 그려서 못 바꿉니다.</b> 여기서 바꾸는 건 "닫힌 셀렉트 박스"의 모양(테두리·높이·라운드·색·화살표)입니다.
						옵션 목록의 폰트·배경을 픽셀 단위로 맞춰야 한다면 그건 NativeSelect가 아니라 <b>Select(radix)</b>를 써야 하는 신호입니다.
					</p>
					<p>
						<b>③ 화살표는 이미 커스텀 아이콘입니다.</b> 컴포넌트가 <code className="font-mono">appearance-none</code> 으로 OS 화살표를 숨기고{' '}
						<code className="font-mono">[data-slot=&quot;native-select-icon&quot;]</code> 로 ChevronDown 을 얹었습니다. 위치·색을 이 슬롯으로 조정하세요.
					</p>
				</div>

				<CodeBlock
					lang="css"
					theme="github-dark"
					code={`/* MyField.module.css — className={styles.field} 를 NativeSelect 에 전달 */

/* 셀렉트 박스 (className 은 래퍼로 가므로 자손으로 파고든다) */
.field [data-slot="native-select"]                    { /* 테두리·높이·라운드·색 */ }
.field [data-slot="native-select"]:hover              { }
.field [data-slot="native-select"]:focus-visible      { /* 포커스 링 */ }
.field [data-slot="native-select"][aria-invalid="true"] { /* 에러 상태 */ }

/* 화살표 아이콘 */
.field [data-slot="native-select-icon"]               { /* 위치·색 */ }

/* 다크 모드는 앱 규칙(.dark)에 맞춰 */
:global(.dark) .field [data-slot="native-select"]     { }

/* ⚠️ Tailwind 기본 클래스(명시도 0,1,0)를 이기려면
   (클래스 + 속성) 조합이면 (0,2,0) 이상이라 !important 없이 이깁니다. */`}
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
								{ component: 'NativeSelect', prop: 'size', type: '"sm" | "default"', desc: '높이 (sm: h-7, default: h-8)' },
								{
									component: 'NativeSelect',
									prop: 'value / onChange',
									type: 'string / (e) => void',
									desc: '제어 모드. e.target.value 로 값을 읽음',
								},
								{ component: 'NativeSelect', prop: 'defaultValue', type: 'string', desc: '초기 선택값 (비제어)' },
								{ component: 'NativeSelect', prop: 'disabled', type: 'boolean', desc: '전체 비활성화 (래퍼가 흐려짐)' },
								{ component: 'NativeSelect', prop: 'name', type: 'string', desc: '폼 전송용 이름 (네이티브라 그대로 전송)' },
								{ component: 'NativeSelect', prop: 'required', type: 'boolean', desc: '폼 필수 값 여부' },
								{
									component: 'NativeSelect',
									prop: 'className',
									type: 'string',
									desc: '⚠️ 래퍼(div)에 적용. 셀렉트 박스는 data-slot 선택자로',
								},
								{
									component: 'NativeSelect',
									prop: '...select props',
									type: 'HTML select 속성',
									desc: 'multiple, autoFocus 등 표준 select 속성 그대로',
								},
								{ component: 'NativeSelectOption', prop: 'value', type: 'string', desc: '항목 값. placeholder는 value=""' },
								{ component: 'NativeSelectOption', prop: 'disabled', type: 'boolean', desc: '해당 항목만 비활성화' },
								{ component: 'NativeSelectOptGroup', prop: 'label', type: 'string', desc: '그룹 소제목 (선택 불가)' },
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
				<p className="text-xs text-gray-500 dark:text-gray-400">
					💡 <code className="font-mono">NativeSelectOption</code> 대신 표준{' '}
					<code className="font-mono">&lt;option&gt;</code> 도 그대로 쓸 수 있습니다. 다만 다크 모드에서 옵션 배경색이 어색할 수 있어,
					색 보정(<code className="font-mono">bg-[Canvas] text-[CanvasText]</code>)이 들어간{' '}
					<code className="font-mono">NativeSelectOption</code> 사용을 권장합니다.
				</p>
			</section>

			{/* ── 기타. 실전 예제 — 그리드 툴바 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 목록 하단 그리드 툴바"
					description="제공 NativeSelect를 손대지 않고 *.module.css 만으로 알약(pill) 톤의 툴바 셀렉트로 재스타일링했습니다. className이 래퍼로 가는 점을 감안해 [data-slot=&quot;native-select&quot;]로 파고들어 셀렉트 박스를 스타일하는, 실제 퍼블리셔 작업 형태를 그대로 보여줍니다."
				/>

				<GridToolbarNativeSelect />

				<SourceTabs
					files={[
						{ filename: 'GridToolbarNativeSelect.tsx', code: gridSource, lang: 'tsx' },
						{ filename: 'GridToolbarNativeSelect.module.css', code: gridCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
