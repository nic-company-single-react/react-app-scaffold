import { useState } from 'react';
import { Input, Label, CodeBlock } from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import ProfileFormInput from '@/domains/example/components/ui-components/input/ProfileFormInput';
import profileSource from '@/domains/example/components/ui-components/input/ProfileFormInput.tsx?raw';
import profileCss from '@/domains/example/components/ui-components/input/ProfileFormInput.module.css?raw';
import { TextCursorInput } from 'lucide-react';

export default function InputComponent(): React.ReactNode {
	const [text, setText] = useState('');

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<TextCursorInput className="w-5 h-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Input 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-sky-300/50 bg-sky-100/60 text-sky-800 dark:border-sky-600/40 dark:bg-sky-900/30 dark:text-sky-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Input 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 — 퍼블리셔 스타일 커스터마이징 ─────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					<strong className="font-semibold">퍼블리셔 참고</strong> — <code className="font-mono">Input</code> 은
					표준 <code className="font-mono">&lt;input&gt;</code> 속성을 그대로 받고,{' '}
					<code className="font-mono">className</code> 은 내부 <code className="font-mono">cn()</code> 으로{' '}
					<em>뒤에 병합</em>되어 기본 스타일을 덮어씁니다. 실제 프로젝트에서 스타일을 바꿀 때는{' '}
					<strong className="font-semibold">컴포넌트 코드를 수정하지 말고</strong> Tailwind 유틸리티(6번) 또는 CSS
					Module(맨 아래 실전 예제)로 <code className="font-mono">className</code> 만 넘기세요.
				</p>
			</div>

			{/* ── 1. Basic ─────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="placeholder 만 지정한 가장 기본적인 텍스트 입력입니다."
				/>
				<ExCard
					label="기본 텍스트 입력"
					code={`<Input placeholder="이름을 입력하세요" />`}
				>
					<div className="w-full max-w-sm">
						<Input placeholder="이름을 입력하세요" />
					</div>
				</ExCard>
			</section>

			{/* ── 2. Label 과 함께 ──────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Label 과 함께"
					description="Label 의 htmlFor 와 Input 의 id 를 연결하면 라벨 클릭 시 입력창에 포커스됩니다. (접근성 필수)"
				/>
				<ExCard
					label="Label + Input"
					code={`<div className="grid gap-1.5">
  <Label htmlFor="email">이메일</Label>
  <Input id="email" type="email" placeholder="you@example.com" />
</div>`}
				>
					<div className="grid gap-1.5 w-full max-w-sm">
						<Label htmlFor="email">이메일</Label>
						<Input
							id="email"
							type="email"
							placeholder="you@example.com"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 3. Type 별 ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Type 별 입력"
					description="type 속성으로 이메일 · 비밀번호 · 숫자 · 날짜 등 다양한 입력을 지원합니다. (표준 <input> 그대로)"
				/>
				<ExCard
					label='type="password" / "number" / "date" / "search"'
					code={`<Input type="password" placeholder="비밀번호" />
<Input type="number" placeholder="수량" />
<Input type="date" />
<Input type="search" placeholder="검색어" />`}
				>
					<div className="grid gap-3 w-full max-w-sm">
						<Input
							type="password"
							placeholder="비밀번호"
						/>
						<Input
							type="number"
							placeholder="수량"
						/>
						<Input type="date" />
						<Input
							type="search"
							placeholder="검색어"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 4. File 입력 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. File 입력"
					description='type="file" 도 동일하게 지원하며, 파일 선택 버튼 영역은 별도로 스타일링되어 있습니다.'
				/>
				<ExCard
					label='type="file"'
					code={`<div className="grid gap-1.5">
  <Label htmlFor="attachment">첨부파일</Label>
  <Input id="attachment" type="file" />
</div>`}
				>
					<div className="grid gap-1.5 w-full max-w-sm">
						<Label htmlFor="attachment">첨부파일</Label>
						<Input
							id="attachment"
							type="file"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 5. Disabled / ReadOnly ───────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. Disabled / ReadOnly"
					description="disabled 는 입력·포커스를 모두 막고, readOnly 는 포커스는 되지만 값 수정만 막습니다."
				/>
				<ExCard
					label="disabled / readOnly"
					code={`<Input placeholder="비활성화" disabled />
<Input defaultValue="읽기 전용 값" readOnly />`}
				>
					<div className="grid gap-3 w-full max-w-sm">
						<Input
							placeholder="비활성화"
							disabled
						/>
						<Input
							defaultValue="읽기 전용 값"
							readOnly
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 6. Validation (에러 상태) ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. Validation — 에러 상태"
					description="aria-invalid 속성을 주면 에러 스타일(빨간 테두리·링)이 자동으로 적용됩니다. 접근성에도 유리합니다."
				/>
				<ExCard
					label="aria-invalid"
					code={`<div className="grid gap-1.5">
  <Label htmlFor="pw">비밀번호</Label>
  <Input id="pw" type="password" aria-invalid defaultValue="123" />
  <p className="text-xs text-destructive">8자 이상 입력해야 합니다.</p>
</div>`}
				>
					<div className="grid gap-1.5 w-full max-w-sm">
						<Label htmlFor="pw">비밀번호</Label>
						<Input
							id="pw"
							type="password"
							aria-invalid
							defaultValue="123"
						/>
						<p className="text-xs text-destructive">8자 이상 입력해야 합니다.</p>
					</div>
				</ExCard>
			</section>

			{/* ── 7. className 커스터마이징 ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. className 으로 스타일 변경 (Tailwind)"
					description="className 은 기본 스타일 뒤에 병합되므로 크기·모양·색을 자유롭게 덮어쓸 수 있습니다. 퍼블리셔가 가장 자주 쓰는 방식입니다."
				/>
				<ExCard
					label="크기 · 모양 커스터마이징"
					code={`{/* 큰 사이즈 + 둥근 모서리 */}
<Input placeholder="큰 입력창" className="h-11 rounded-full px-5 text-base" />

{/* 밑줄만 있는 스타일 */}
<Input
  placeholder="밑줄 스타일"
  className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-sky-500"
/>`}
				>
					<div className="grid gap-4 w-full max-w-sm">
						<Input
							placeholder="큰 입력창"
							className="h-11 rounded-full px-5 text-base"
						/>
						<Input
							placeholder="밑줄 스타일"
							className="border-0 border-b rounded-none px-0 focus-visible:ring-0 focus-visible:border-sky-500"
						/>
					</div>
				</ExCard>
			</section>

			{/* ── 8. 인터랙티브 예제 — Controlled ──────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. 인터랙티브 예제 — Controlled"
					description="value / onChange 로 입력값을 외부 state 에서 제어합니다. 글자 수 카운트를 함께 보여줍니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 입력값:{' '}
							<code className="font-mono text-sky-700 dark:text-sky-400">{text || '(비어 있음)'}</code>
						</span>
					</div>
					<div className="p-5 space-y-2">
						<div className="grid gap-1.5 w-full max-w-sm">
							<Label htmlFor="nickname">닉네임 (최대 20자)</Label>
							<Input
								id="nickname"
								value={text}
								maxLength={20}
								onChange={(e) => setText(e.target.value)}
								placeholder="닉네임을 입력하세요"
							/>
							<p className="text-xs text-gray-400 text-right">{text.length} / 20</p>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [text, setText] = useState('');

<Input
  value={text}
  maxLength={20}
  onChange={(e) => setText(e.target.value)}
  placeholder="닉네임을 입력하세요"
/>
<p>{text.length} / 20</p>`}
						/>
					</div>
				</div>
			</section>

			{/* ── Props 요약 테이블 ────────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="Props 요약"
					description="Input 은 표준 <input> 의 모든 속성을 그대로 받습니다. 자주 쓰는 항목만 정리했습니다."
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
								{ prop: 'type', type: 'string', desc: 'text · password · email · number · date · file · search 등' },
								{ prop: 'value / defaultValue', type: 'string', desc: '제어(value) / 비제어(defaultValue) 입력값' },
								{ prop: 'onChange', type: '(e) => void', desc: '값 변경 콜백 (e.target.value 로 접근)' },
								{ prop: 'placeholder', type: 'string', desc: '입력 전 안내 문구' },
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

			{/* ── 기타. 실전 예제 — 프로필 입력 폼 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 프로필 입력 폼 (CSS Module 리스타일)"
					description="제공 Input 컴포넌트는 그대로 두고 *.module.css 로 className 만 덮어써서 전혀 다른 룩앤필(높이 48px · 아이콘 프리픽스 · 에메랄드 포커스 · 에러 상태)을 입혔습니다. 실제 SI 프로젝트에서 퍼블리셔가 Input 스타일을 바꾸는 전형적인 방식이므로, 아래 소스를 그대로 복사해 시작점으로 쓰세요."
				/>

				<div className="flex justify-center py-2">
					<ProfileFormInput />
				</div>

				<SourceTabs
					files={[
						{ filename: 'ProfileFormInput.tsx', code: profileSource, lang: 'tsx' },
						{ filename: 'ProfileFormInput.module.css', code: profileCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
