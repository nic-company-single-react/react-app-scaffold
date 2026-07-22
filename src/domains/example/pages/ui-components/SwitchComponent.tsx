import { useState } from 'react';
import { Switch, Label, Button, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/SectionHeader';
import ExCard from '@/domains/example/components/ui-components/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/SourceTabs';
import NotificationSettingsSwitch from '@/domains/example/components/ui-components/NotificationSettingsSwitch';
import SecuritySettingSwitch from '@/domains/example/components/ui-components/SecuritySettingSwitch';
import notiSource from '@/domains/example/components/ui-components/NotificationSettingsSwitch.tsx?raw';
import notiCss from '@/domains/example/components/ui-components/NotificationSettingsSwitch.module.css?raw';
import securitySource from '@/domains/example/components/ui-components/SecuritySettingSwitch.tsx?raw';
import securityCss from '@/domains/example/components/ui-components/SecuritySettingSwitch.module.css?raw';
import { ToggleRight } from 'lucide-react';

export default function SwitchComponent(): React.ReactNode {
	/** 6. 인터랙티브(제어) 예제 */
	const [airplane, setAirplane] = useState(false);
	/** 7. 폼 전송 예제 */
	const [submitted, setSubmitted] = useState<string | null>(null);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/20">
					<ToggleRight className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Switch 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-emerald-300/50 bg-emerald-100/60 text-emerald-800 dark:border-emerald-600/40 dark:bg-emerald-900/30 dark:text-emerald-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Switch 컴포넌트 사용 예제입니다. <b>켜짐/꺼짐 두 가지 상태</b>를 즉시 전환하는 입력에
						사용합니다.
					</p>
				</div>
			</div>

			{/* ── Switch vs Checkbox ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="Switch vs Checkbox — 무엇을 쓸까?"
					description="둘 다 on/off 값을 다루지만 쓰임새가 다릅니다. 바꾸는 즉시 반영되는 '설정'이면 Switch, 제출 버튼을 눌러야 반영되는 '선택 항목'이면 Checkbox를 쓰세요."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">비교 항목</th>
								<th className="text-left px-4 py-2.5 font-medium text-emerald-700 dark:text-emerald-400 text-xs">
									Switch
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-violet-700 dark:text-violet-400 text-xs">
									Checkbox
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ k: '의미', s: '기능을 켜다 / 끄다', c: '항목을 고르다 / 동의하다' },
								{ k: '반영 시점', s: '조작 즉시 반영 (저장 버튼 없음)', c: '보통 제출(submit) 시 반영' },
								{ k: '상태 수', s: '2가지 (on / off)', c: '3가지 가능 (on / off / indeterminate)' },
								{ k: '그룹 사용', s: '항목마다 독립 — 그룹 개념 없음', c: '여러 개 묶어 다중 선택' },
								{ k: '대표 사용처', s: '알림 설정, 다크모드, 자동이체 사용 여부', c: '약관 동의, 관심 카테고리, 목록 선택' },
								{ k: '구현 베이스', s: 'radix-ui Switch', c: 'radix-ui Checkbox' },
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
						한 줄 요약 — <b>바꾸는 순간 적용</b>되면 Switch, <b>제출해야 적용</b>되면 Checkbox. Checkbox 예제는 좌측 메뉴{' '}
						<code className="font-mono">UI Components &gt; Checkbox</code> 에 있습니다.
					</div>
				</div>
			</section>

			{/* ── 0. import ────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import"
					description="Switch는 단일 컴포넌트입니다. 설명 텍스트를 붙일 때는 Label을 함께 씁니다."
				/>
				<CodeBlock
					code={`import { Switch, Label } from '@axiom/components/ui';`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="아무 prop 없이 쓰면 꺼진 상태로 시작하는 비제어(uncontrolled) 스위치입니다. defaultChecked로 초기값을 지정합니다."
				/>
				<ExCard
					label="기본 / defaultChecked"
					code={`{/* 꺼진 상태로 시작 */}
<Switch />

{/* 켜진 상태로 시작 (비제어) */}
<Switch defaultChecked />`}
				>
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<Switch />
							<span className="text-xs text-gray-500 dark:text-gray-400">기본(off)</span>
						</div>
						<div className="flex items-center gap-2">
							<Switch defaultChecked />
							<span className="text-xs text-gray-500 dark:text-gray-400">defaultChecked</span>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 2. Label 연결 ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Label과 함께 (권장)"
					description="Switch에 id를, Label에 같은 값의 htmlFor를 주면 라벨 텍스트를 눌러도 토글됩니다. 접근성을 위해 반드시 라벨을 연결하세요."
				/>
				<ExCard
					label="id + htmlFor"
					code={`<div className="flex items-center gap-2">
  <Switch id="wifi" defaultChecked />
  <Label htmlFor="wifi">Wi-Fi 자동 연결</Label>
</div>

{/* 설명문이 필요하면 세로로 배치 */}
<div className="flex items-start gap-3">
  <Switch id="save-data" className="mt-1" />
  <div>
    <Label htmlFor="save-data">데이터 절약 모드</Label>
    <p className="text-xs text-gray-500">이미지를 저화질로 불러옵니다.</p>
  </div>
</div>`}
				>
					<div className="flex flex-col gap-4 w-full">
						<div className="flex items-center gap-2">
							<Switch
								id="wifi"
								defaultChecked
							/>
							<Label htmlFor="wifi">Wi-Fi 자동 연결</Label>
						</div>
						<div className="flex items-start gap-3">
							<Switch
								id="save-data"
								className="mt-1"
							/>
							<div>
								<Label htmlFor="save-data">데이터 절약 모드</Label>
								<p className="text-xs text-gray-500 dark:text-gray-400">이미지를 저화질로 불러옵니다.</p>
							</div>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 3. size ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. size (크기)"
					description='size prop으로 두 가지 크기를 제공합니다. 기본값은 "default"(32×18px)이고, 표 안이나 조밀한 목록에는 "sm"(24×14px)을 씁니다.'
				/>
				<ExCard
					label='size="default" | "sm"'
					code={`<Switch defaultChecked />              {/* size="default" (기본) */}
<Switch size="sm" defaultChecked />    {/* 작은 크기 */}`}
				>
					<div className="flex items-center gap-6">
						<div className="flex items-center gap-2">
							<Switch defaultChecked />
							<span className="text-xs text-gray-500 dark:text-gray-400">default</span>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								size="sm"
								defaultChecked
							/>
							<span className="text-xs text-gray-500 dark:text-gray-400">sm</span>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 4. Disabled ──────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. Disabled (비활성화)"
					description="disabled를 주면 조작할 수 없고 흐리게 표시됩니다. 연결된 Label도 함께 흐려집니다(peer-disabled)."
				/>
				<ExCard
					label="disabled"
					code={`<div className="flex items-center gap-2">
  <Switch id="d1" disabled />
  <Label htmlFor="d1">해외 결제 허용 (권한 없음)</Label>
</div>

<div className="flex items-center gap-2">
  <Switch id="d2" disabled defaultChecked />
  <Label htmlFor="d2">필수 보안 알림 (해제 불가)</Label>
</div>`}
				>
					<div className="flex flex-col gap-3 w-full">
						<div className="flex items-center gap-2">
							<Switch
								id="d1"
								disabled
							/>
							<Label htmlFor="d1">해외 결제 허용 (권한 없음)</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="d2"
								disabled
								defaultChecked
							/>
							<Label htmlFor="d2">필수 보안 알림 (해제 불가)</Label>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 5. className으로 색 바꾸기 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. className으로 색·크기 바꾸기 (간단한 커스터마이징)"
					description="켜짐/꺼짐 색은 data-[state=checked] / data-[state=unchecked] 변형으로 덮어씁니다. 손잡이(thumb)는 자식이라 className이 닿지 않으므로 [&_[data-slot=switch-thumb]] 로 지정합니다."
				/>
				<ExCard
					label="Tailwind 유틸리티 오버라이드"
					code={`{/* 켜졌을 때 색만 바꾸기 */}
<Switch
  defaultChecked
  className="data-[state=checked]:bg-emerald-500"
/>

{/* 꺼졌을 때 색까지 바꾸기 */}
<Switch
  defaultChecked
  className="data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-rose-200"
/>

{/* 크기를 키우려면 트랙과 손잡이(thumb)를 같이 바꾼다.
    - 손잡이는 자식 요소라 [&_[data-slot=switch-thumb]] 로 파고든다
    - 트랙을 키운 만큼 켜짐 위치(translate-x)도 다시 지정해야 한다
    - 크기 관련 기본값은 data-[size=...] 로 걸려 있어 명시도가 높다.
      그래서 뒤에 ! 를 붙여 !important 로 덮어쓴다. */}
<Switch
  defaultChecked
  className="h-6! w-11! data-[state=checked]:bg-indigo-600
    **:data-[slot=switch-thumb]:size-5!
    **:data-[slot=switch-thumb]:data-[state=checked]:translate-x-5.5!
    **:data-[slot=switch-thumb]:data-[state=unchecked]:translate-x-0.5!"
/>`}
				>
					<div className="flex flex-wrap items-center gap-6">
						<div className="flex items-center gap-2">
							<Switch
								defaultChecked
								className="data-[state=checked]:bg-emerald-500"
							/>
							<span className="text-xs text-gray-500 dark:text-gray-400">emerald</span>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								defaultChecked
								className="data-[state=checked]:bg-rose-500 data-[state=unchecked]:bg-rose-200"
							/>
							<span className="text-xs text-gray-500 dark:text-gray-400">rose</span>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								defaultChecked
								className="h-6! w-11! data-[state=checked]:bg-indigo-600 **:data-[slot=switch-thumb]:size-5! **:data-[slot=switch-thumb]:data-[state=checked]:translate-x-5.5! **:data-[slot=switch-thumb]:data-[state=unchecked]:translate-x-0.5!"
							/>
							<span className="text-xs text-gray-500 dark:text-gray-400">큰 사이즈</span>
						</div>
					</div>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					스타일 변경 폭이 이 정도를 넘어간다면(트랙 안 글자, 완전히 다른 톤앤매너 등) className을 길게 늘이지 말고{' '}
					<b>*.module.css로 분리</b>하세요. 아래 <b>퍼블리셔 가이드</b>와 <b>실전 예제</b>가 그 방법입니다.
				</p>
			</section>

			{/* ── 6. 인터랙티브 예제 (Controlled) ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 인터랙티브 예제 — Controlled"
					description="checked / onCheckedChange로 상태를 외부에서 제어합니다. 값을 다른 UI와 연동해야 할 때 사용합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 값:{' '}
							<code className="font-mono text-emerald-700 dark:text-emerald-400">{String(airplane)}</code>
						</span>
					</div>
					<div className="p-5 space-y-4">
						<div className="flex items-center gap-3">
							<Switch
								id="airplane"
								checked={airplane}
								onCheckedChange={setAirplane}
							/>
							<Label htmlFor="airplane">비행기 모드</Label>
						</div>

						<div className="flex flex-wrap gap-2">
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setAirplane(true)}
							>
								켜기
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setAirplane(false)}
							>
								끄기
							</Button>
							<Button
								type="button"
								size="sm"
								variant="outline"
								onClick={() => setAirplane((v) => !v)}
							>
								토글
							</Button>
						</div>

						<div
							className={`rounded-xl px-4 py-3 text-xs transition-colors ${
								airplane
									? 'bg-amber-50 text-amber-800 dark:bg-amber-900/20 dark:text-amber-300'
									: 'bg-gray-50 text-gray-600 dark:bg-gray-800/50 dark:text-gray-400'
							}`}
						>
							{airplane ? '모든 무선 통신이 차단되었습니다.' : '네트워크에 연결되어 있습니다.'}
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [airplane, setAirplane] = useState(false);

<Switch
  id="airplane"
  checked={airplane}
  onCheckedChange={setAirplane}
/>
<Label htmlFor="airplane">비행기 모드</Label>

{/* onCheckedChange는 boolean을 그대로 넘겨준다 */}
<Button onClick={() => setAirplane((v) => !v)}>토글</Button>`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── 7. 폼 전송 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 폼(form) 안에서 사용"
					description="name을 주면 form 전송용 hidden input이 자동으로 만들어집니다. 체크박스와 동일하게 켜져 있을 때만 값이 전송되고, 꺼져 있으면 키 자체가 빠집니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<form
						className="p-5 space-y-4"
						onSubmit={(e) => {
							e.preventDefault();
							const fd = new FormData(e.currentTarget);
							setSubmitted(JSON.stringify(Object.fromEntries(fd.entries()), null, 2));
						}}
					>
						<div className="flex items-center gap-2">
							<Switch
								id="f-marketing"
								name="marketing"
							/>
							<Label htmlFor="f-marketing">마케팅 정보 수신 동의</Label>
						</div>
						<div className="flex items-center gap-2">
							<Switch
								id="f-newsletter"
								name="newsletter"
								value="yes"
								defaultChecked
							/>
							<Label htmlFor="f-newsletter">
								뉴스레터 구독 <span className="text-gray-400">(value=&quot;yes&quot;)</span>
							</Label>
						</div>

						<div className="flex items-center gap-2 pt-1">
							<Button
								type="submit"
								size="sm"
							>
								제출
							</Button>
							{submitted && (
								<span className="text-xs text-gray-500 dark:text-gray-400">아래에 전송된 값이 표시됩니다.</span>
							)}
						</div>

						{submitted && (
							<pre className="rounded-xl bg-gray-50 dark:bg-gray-800/50 px-4 py-3 text-xs font-mono text-gray-700 dark:text-gray-300 overflow-x-auto">
								{submitted}
							</pre>
						)}
					</form>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`<form
  onSubmit={(e) => {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    console.log(Object.fromEntries(fd.entries()));
    // 켜짐 → { marketing: 'on' }  /  꺼짐 → 키 없음
  }}
>
  <Switch id="f-marketing" name="marketing" />
  <Label htmlFor="f-marketing">마케팅 정보 수신 동의</Label>

  {/* value를 주면 'on' 대신 그 값이 전송된다 */}
  <Switch id="f-newsletter" name="newsletter" value="yes" defaultChecked />

  <Button type="submit">제출</Button>
</form>`}
							lang="tsx"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="radix-ui Switch.Root의 props를 그대로 받습니다. size는 scaffold가 추가한 prop입니다."
				/>
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
									prop: 'size',
									type: '"default" | "sm"',
									def: '"default"',
									desc: 'scaffold 확장 — 트랙/손잡이 크기 프리셋',
								},
								{ prop: 'checked', type: 'boolean', def: '—', desc: '켜짐 여부 (제어 모드)' },
								{ prop: 'defaultChecked', type: 'boolean', def: 'false', desc: '초기 켜짐 여부 (비제어 모드)' },
								{
									prop: 'onCheckedChange',
									type: '(checked: boolean) => void',
									def: '—',
									desc: '값이 바뀔 때 호출되는 콜백',
								},
								{ prop: 'disabled', type: 'boolean', def: 'false', desc: '비활성화 — 조작 불가 + 흐리게 표시' },
								{ prop: 'required', type: 'boolean', def: 'false', desc: '폼 제출 시 반드시 켜져 있어야 함' },
								{ prop: 'name', type: 'string', def: '—', desc: '폼 전송용 이름 (hidden input 자동 생성)' },
								{ prop: 'value', type: 'string', def: '"on"', desc: '켜졌을 때 전송되는 값' },
								{ prop: 'id', type: 'string', def: '—', desc: 'Label의 htmlFor와 연결할 식별자' },
								{ prop: 'className', type: 'string', def: '—', desc: '트랙에 적용될 추가 클래스 (cn으로 병합)' },
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
										<code className="text-xs font-mono text-gray-500 dark:text-gray-500">{row.def}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.desc}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── 퍼블리셔 가이드 ──────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="퍼블리셔 가이드 — 스타일을 어디에서 바꾸나"
					description="실제 프로젝트에서 Switch는 디자인이 크게 바뀌는 컴포넌트입니다. shared의 switch.tsx는 수정하지 말고, 아래 훅(data-slot / data-state)만 잡아 *.module.css에서 덮어쓰세요."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">선택자</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">대상</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									기본 스타일 / 비고
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									sel: '[data-slot="switch"]',
									target: '트랙(바깥 알약)',
									note: 'default 32×18.4px / sm 24×14px, rounded-full',
								},
								{
									sel: '[data-slot="switch-thumb"]',
									target: '손잡이(움직이는 원)',
									note: 'default 16px / sm 12px, transition-transform',
								},
								{
									sel: '[data-state="checked"]',
									target: '켜짐 상태 (트랙·손잡이 모두)',
									note: 'radix가 붙이는 상태 속성',
								},
								{ sel: '[data-state="unchecked"]', target: '꺼짐 상태', note: '위와 쌍으로 사용' },
								{ sel: '[data-disabled]', target: '비활성 상태', note: 'disabled일 때만 붙음 (값 없는 속성)' },
								{ sel: '[data-size="sm"]', target: 'size prop 값', note: 'default / sm 를 구분해 스타일 분기' },
								{
									sel: '::after (트랙)',
									target: '터치 영역 확장용 — 사용 중',
									note: '컴포넌트가 이미 쓰고 있으니 건드리지 말고 ::before 를 쓸 것',
								},
							].map((row) => (
								<tr
									key={row.sel}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-emerald-700 dark:text-emerald-400 whitespace-nowrap">
											{row.sel}
										</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-700 dark:text-gray-300">{row.target}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.note}</td>
								</tr>
							))}
						</tbody>
					</table>
					<div className="px-4 py-3 border-t border-gray-100 dark:border-gray-800 bg-amber-50/60 dark:bg-amber-900/10 text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
						⚠ <b>트랙 크기를 바꾸면 손잡이 이동 거리도 반드시 같이 바꿔야 합니다.</b> 기본 컴포넌트는 켜졌을 때{' '}
						<code className="font-mono">translate-x-[calc(100%-2px)]</code> 로 미는데, 트랙/손잡이 크기가 달라지면 이
						값이 맞지 않습니다. 이때 CSS Module에서는 반드시{' '}
						<code className="font-mono">translate: 24px 0</code> 처럼 <b>translate 프로퍼티</b>로 쓰세요. Tailwind v4의{' '}
						<code className="font-mono">translate-x-*</code> 가 <code className="font-mono">transform</code> 이 아닌{' '}
						<code className="font-mono">translate</code> 를 사용하므로,{' '}
						<code className="font-mono">transform: translateX(...)</code> 로 쓰면 덮어쓰기가 아니라{' '}
						<b>두 이동이 합산되어 손잡이가 트랙 밖으로 튀어나갑니다.</b>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`/* MySwitchArea.module.css — 퍼블리셔가 만지는 파일 */

/* 트랙 */
.wrap :global([data-slot='switch']) {
  width: 52px;
  height: 30px;
  background: #d8d4cc;          /* 꺼짐 */
}
.wrap :global([data-slot='switch'])[data-state='checked'] {
  background: #f59e0b;          /* 켜짐 */
}

/* 손잡이 — 트랙을 키웠으니 이동 거리도 다시 지정한다.
   ⚠ transform 이 아니라 translate 프로퍼티로 쓸 것!
     Tailwind v4의 translate-x-* 는 transform 이 아닌 translate 를 쓰므로,
     transform 으로 쓰면 덮어쓰기가 아니라 두 이동이 합산되어 손잡이가 트랙 밖으로 나간다.
   트랙까지 함께 선택해 Tailwind 유틸리티보다 명시도(0,4,0 > 0,3,0)를 확보한다. */
.wrap :global([data-slot='switch-thumb']) {
  width: 26px;
  height: 26px;
  transition: translate 0.2s ease;
}
.wrap :global([data-slot='switch'])[data-state='unchecked'] :global([data-slot='switch-thumb']) {
  translate: 2px 0;
}
.wrap :global([data-slot='switch'])[data-state='checked'] :global([data-slot='switch-thumb']) {
  translate: 24px 0;   /* 52 - 26 - 2 */
}

/* 다크 모드는 앱 규칙(.dark)에 맞춰 :global(.dark) 로 */
:global(.dark) .wrap { --my-off: #3f3a31; }`}
							lang="css"
							theme="github-dark"
						/>
					</div>
				</div>
			</section>

			{/* ── 기타. 실전 예제 — 알림 설정 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 알림 설정 (즉시 저장형)"
					description="설정 화면에서 가장 흔한 패턴. 마스터 스위치를 끄면 하위 항목이 모두 잠깁니다. 제공 Switch를 그대로 쓰되 *.module.css 로 iOS 설정 앱 스타일의 큰 토글로 완전히 재스타일링했습니다. 퍼블리셔는 .tsx 를 건드리지 않고 .module.css 만 수정하면 됩니다."
				/>

				<NotificationSettingsSwitch />

				<SourceTabs
					files={[
						{ filename: 'NotificationSettingsSwitch.tsx', code: notiSource, lang: 'tsx' },
						{ filename: 'NotificationSettingsSwitch.module.css', code: notiCss, lang: 'css' },
					]}
				/>
			</section>

			{/* ── 기타. 실전 예제 — 보안 설정 ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 보안 설정 (저장 버튼형)"
					description="앞선 알림 설정과 똑같은 Switch를 쓰지만, *.module.css 만 바꿔 트랙 안에 ON/OFF 글자가 들어가는 인디고 톤으로 만들었습니다. 동작 면에서도 즉시 저장이 아니라 저장 전 값(draft)과 저장된 값을 나눠 들고 변경 여부 · 되돌리기 · 위험 경고까지 처리합니다."
				/>

				<SecuritySettingSwitch />

				<SourceTabs
					files={[
						{ filename: 'SecuritySettingSwitch.tsx', code: securitySource, lang: 'tsx' },
						{ filename: 'SecuritySettingSwitch.module.css', code: securityCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
