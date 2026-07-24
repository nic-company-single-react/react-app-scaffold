import { useState } from 'react';
import { Textarea, Label, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import FeedbackForm from '@/domains/example/components/ui-components/textarea/FeedbackForm';
import feedbackSource from '@/domains/example/components/ui-components/textarea/FeedbackForm.tsx?raw';
import feedbackCss from '@/domains/example/components/ui-components/textarea/FeedbackForm.module.css?raw';
import { NotepadText } from 'lucide-react';

export default function TextareaComponent(): React.ReactNode {
	const [text, setText] = useState('');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20">
					<NotepadText className="w-5 h-5 text-teal-600 dark:text-teal-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Textarea 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-teal-300/50 bg-teal-100/60 text-teal-800 dark:border-teal-600/40 dark:bg-teal-900/30 dark:text-teal-300">
							@axiom/components/ui
						</code>
						에서 제공하는 여러 줄 텍스트 입력(Textarea) 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 — 퍼블리셔 스타일 커스터마이징 ─────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					<strong className="font-semibold">퍼블리셔 참고</strong> — <code className="font-mono">Textarea</code> 는
					표준 <code className="font-mono">&lt;textarea&gt;</code> 속성을 그대로 받고,{' '}
					<code className="font-mono">className</code> 은 내부 <code className="font-mono">cn()</code> 으로{' '}
					<em>뒤에 병합</em>되어 기본 스타일을 덮어씁니다. 실제 프로젝트에서는{' '}
					<strong className="font-semibold">컴포넌트 코드를 수정하지 말고</strong> Tailwind 유틸리티(6번) 또는 CSS
					Module(맨 아래 실전 예제)로 <code className="font-mono">className</code> 만 넘겨 리스타일하세요. Textarea 는
					스타일 변경 빈도가 특히 높은 컴포넌트입니다.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Textarea 하나만 import 하면 됩니다. 표준 <textarea> 를 감싼 단일 컴포넌트로, 별도 하위 컴포넌트가 없습니다."
				/>
				<CodeBlock
					code={`import { Textarea } from '@axiom/components/ui';

<Textarea placeholder="내용을 입력하세요" />`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>value / onChange</b>(제어) 또는 <b>defaultValue</b>(비제어)로 값을 다루며,{' '}
					<b>rows · maxLength · placeholder · disabled · readOnly</b> 등 표준 <code>&lt;textarea&gt;</code> 속성을 그대로
					지원합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="placeholder 만 지정한 가장 기본적인 여러 줄 입력입니다. 기본 최소 높이는 4줄 정도(min-h-16)입니다."
				/>
				<ExCard
					label="기본 텍스트 영역"
					code={`<Textarea placeholder="내용을 입력하세요" />`}
				>
					<div className="w-full max-w-md">
						<Textarea placeholder="내용을 입력하세요" />
					</div>
				</ExCard>
			</section>

			{/* ── 2. Label 과 함께 ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Label 과 함께"
					description="Label 의 htmlFor 와 Textarea 의 id 를 연결하면 라벨 클릭 시 입력창에 포커스됩니다. (접근성 필수)"
				/>
				<ExCard
					label="Label + Textarea"
					code={`<div className="grid gap-1.5">
  <Label htmlFor="bio">자기소개</Label>
  <Textarea id="bio" placeholder="간단한 자기소개를 작성해 주세요" />
</div>`}
				>
					<div className="grid gap-1.5 w-full max-w-md">
						<Label htmlFor="bio">자기소개</Label>
						<Textarea
							id="bio"
							placeholder="간단한 자기소개를 작성해 주세요"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 3. rows / 자동 높이 ──────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. rows 와 자동 높이 (field-sizing)"
					description="rows 로 초기 높이를 지정합니다. 이 컴포넌트는 field-sizing-content 가 기본 적용되어 있어, 입력 내용이 늘어나면 스크롤바 대신 높이가 자동으로 확장됩니다. (일반 <textarea> 와의 큰 차이점)"
				/>
				<ExCard
					label="rows 지정 + 내용에 따라 자동 확장"
					code={`{/* rows 로 초기 높이 지정 */}
<Textarea rows={6} placeholder="6줄 높이로 시작합니다" />

{/* 입력을 늘리면 높이가 자동으로 늘어납니다 (field-sizing-content) */}
<Textarea placeholder="여기에 여러 줄을 입력해 보세요 — 높이가 따라 늘어납니다" />`}
				>
					<div className="grid gap-3 w-full max-w-md">
						<Textarea
							rows={6}
							placeholder="6줄 높이로 시작합니다"
						/>
						<Textarea placeholder="여기에 여러 줄을 입력해 보세요 — 높이가 따라 늘어납니다" />
					</div>
				</ExCard>
			</section>

			{/* ── 4. Disabled / ReadOnly ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. Disabled / ReadOnly"
					description="disabled 는 입력·포커스를 모두 막고, readOnly 는 포커스는 되지만 값 수정만 막습니다."
				/>
				<ExCard
					label="disabled / readOnly"
					code={`<Textarea placeholder="비활성화" disabled />
<Textarea defaultValue="읽기 전용 내용입니다." readOnly />`}
				>
					<div className="grid gap-3 w-full max-w-md">
						<Textarea
							placeholder="비활성화"
							disabled
						/>
						<Textarea
							defaultValue="읽기 전용 내용입니다."
							readOnly
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 5. Validation (에러 상태) ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Validation — 에러 상태"
					description="aria-invalid 속성을 주면 에러 스타일(빨간 테두리·링)이 자동으로 적용됩니다. 접근성에도 유리합니다."
				/>
				<ExCard
					label="aria-invalid"
					code={`<div className="grid gap-1.5">
  <Label htmlFor="reason">사유</Label>
  <Textarea id="reason" aria-invalid defaultValue="너무 짧음" />
  <p className="text-xs text-destructive">10자 이상 입력해야 합니다.</p>
</div>`}
				>
					<div className="grid gap-1.5 w-full max-w-md">
						<Label htmlFor="reason">사유</Label>
						<Textarea
							id="reason"
							aria-invalid
							defaultValue="너무 짧음"
						/>
						<p className="text-xs text-destructive">10자 이상 입력해야 합니다.</p>
					</div>
				</ExCard>
			</section>

			{/* ── 6. className 커스터마이징 ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. className 으로 스타일 변경 (Tailwind)"
					description="className 은 기본 스타일 뒤에 병합되므로 높이·모양·색·리사이즈 동작을 자유롭게 덮어쓸 수 있습니다. 퍼블리셔가 가장 자주 쓰는 방식입니다."
				/>
				<ExCard
					label="고정 높이 · 리사이즈 · 모양 커스터마이징"
					code={`{/* 고정 높이 + 세로 리사이즈만 허용 */}
<Textarea
  placeholder="고정 높이 (리사이즈 세로만)"
  className="min-h-32 resize-y field-sizing-fixed"
/>

{/* 리사이즈 완전 비활성 + 둥근 모서리 + 강조 포커스 */}
<Textarea
  placeholder="리사이즈 불가 · 라운드 · 티일 포커스"
  className="resize-none rounded-2xl focus-visible:border-teal-500 focus-visible:ring-teal-500/30"
/>`}
				>
					<div className="grid gap-4 w-full max-w-md">
						<Textarea
							placeholder="고정 높이 (리사이즈 세로만)"
							className="min-h-32 resize-y field-sizing-fixed"
						/>
						<Textarea
							placeholder="리사이즈 불가 · 라운드 · 티일 포커스"
							className="resize-none rounded-2xl focus-visible:border-teal-500 focus-visible:ring-teal-500/30"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 7. 인터랙티브 예제 — Controlled + 글자 수 ──────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. 인터랙티브 예제 — Controlled + 글자 수"
					description="value / onChange 로 입력값을 외부 state 에서 제어하고, maxLength 와 글자 수 카운터를 함께 보여줍니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							입력한 글자 수:{' '}
							<code className="font-mono text-teal-700 dark:text-teal-400">{text.length}</code>
						</span>
					</div>
					<div className="p-5 space-y-2">
						<div className="grid gap-1.5 w-full max-w-md">
							<Label htmlFor="memo">메모 (최대 100자)</Label>
							<Textarea
								id="memo"
								value={text}
								maxLength={100}
								onChange={(e) => setText(e.target.value)}
								placeholder="메모를 입력하세요"
							/>
							<p className="text-xs text-gray-400 text-right">{text.length} / 100</p>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [text, setText] = useState('');

<Textarea
  value={text}
  maxLength={100}
  onChange={(e) => setText(e.target.value)}
  placeholder="메모를 입력하세요"
/>
<p>{text.length} / 100</p>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 8. 일반 textarea 태그와의 차이점 ───────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 일반 <textarea> 태그와의 차이점"
					description="아래 두 입력창은 완전히 동일한 속성(placeholder)을 가지지만 기본 룩앤필이 다릅니다. 제공 Textarea 는 디자인 토큰·포커스 링·다크 모드·자동 높이를 내장하고 있습니다."
				/>

				{/* 라이브 비교 */}
				<div className="grid gap-4 sm:grid-cols-2">
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2 shadow-sm">
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-teal-700 dark:text-teal-400">
							<span className="h-1.5 w-1.5 rounded-full bg-teal-500" />
							제공 &lt;Textarea /&gt;
						</span>
						<Textarea placeholder="포커스해 보세요 — 링/라운드/다크모드 내장" />
					</div>
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 space-y-2 shadow-sm">
						<span className="inline-flex items-center gap-1.5 text-xs font-semibold text-gray-500 dark:text-gray-400">
							<span className="h-1.5 w-1.5 rounded-full bg-gray-400" />
							일반 &lt;textarea&gt;
						</span>
						<textarea
							placeholder="포커스해 보세요 — 브라우저 기본 스타일"
							className="w-full"
						/>
					</div>
				</div>

				{/* 차이점 테이블 */}
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">구분</th>
								<th className="text-left px-4 py-2.5 font-medium text-teal-700 dark:text-teal-400 text-xs">
									제공 &lt;Textarea /&gt;
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									일반 &lt;textarea&gt;
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{
									aspect: '기본 스타일',
									provided: '라운드 · 테두리 · 패딩 · 폰트 크기 내장',
									native: '브라우저 기본(각진 회색 테두리)',
								},
								{
									aspect: '높이 동작',
									provided: 'field-sizing-content — 내용에 맞춰 자동 확장 (min-h-16)',
									native: 'rows 로 고정, 초과 시 내부 스크롤',
								},
								{
									aspect: '포커스',
									provided: 'focus-visible 링(ring-ring/50) 자동',
									native: '브라우저 기본 아웃라인',
								},
								{
									aspect: '에러 상태',
									provided: 'aria-invalid 로 빨간 테두리·링 자동',
									native: '직접 CSS 작성 필요',
								},
								{
									aspect: '다크 모드',
									provided: '내장(dark:bg-input/30 등)',
									native: '직접 처리 필요',
								},
								{
									aspect: 'Disabled',
									provided: '흐림·커서 스타일 포함',
									native: '브라우저 기본',
								},
								{
									aspect: '공통점',
									provided: 'rows · maxLength · placeholder · value/onChange 등 표준 속성 그대로 사용',
									native: '동일 (Textarea 는 <textarea> 를 그대로 감쌈)',
								},
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
										{row.aspect}
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.provided}</td>
									<td className="px-4 py-2.5 text-xs text-gray-500 dark:text-gray-500">{row.native}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Textarea 는 표준 <textarea> 의 모든 속성을 그대로 받습니다. 자주 쓰는 항목만 정리했습니다."
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">Prop</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">타입</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ prop: 'value / defaultValue', type: 'string', desc: '제어(value) / 비제어(defaultValue) 입력값' },
								{ prop: 'onChange', type: '(e) => void', desc: '값 변경 콜백 (e.target.value 로 접근)' },
								{ prop: 'placeholder', type: 'string', desc: '입력 전 안내 문구' },
								{ prop: 'rows', type: 'number', desc: '초기 표시 줄 수(초기 높이)' },
								{ prop: 'maxLength', type: 'number', desc: '최대 입력 글자 수 제한' },
								{ prop: 'disabled', type: 'boolean', desc: '입력·포커스 모두 비활성화' },
								{ prop: 'readOnly', type: 'boolean', desc: '포커스는 되지만 값 수정 불가' },
								{ prop: 'aria-invalid', type: 'boolean', desc: '에러 상태 스타일(빨간 테두리·링) 적용' },
								{ prop: 'className', type: 'string', desc: '기본 스타일 뒤에 병합 — 스타일 커스터마이징' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
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

			{/* ── 기타. 실전 예제 — 피드백 폼 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 피드백 폼 (CSS Module 리스타일)"
					description="제공 Textarea 컴포넌트는 그대로 두고 *.module.css 로 className 만 덮어써서 전혀 다른 룩앤필(고정 높이 · 티일 포커스 · 수동 리사이즈 · 에러 상태 · 글자 수 카운터)을 입혔습니다. 실제 SI 프로젝트에서 퍼블리셔가 Textarea 스타일을 바꾸는 전형적인 방식이므로, 아래 소스를 그대로 복사해 시작점으로 쓰세요."
				/>

				<div className="flex justify-center py-2">
					<FeedbackForm />
				</div>

				<SourceTabs
					files={[
						{ filename: 'FeedbackForm.tsx', code: feedbackSource, lang: 'tsx' },
						{ filename: 'FeedbackForm.module.css', code: feedbackCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
