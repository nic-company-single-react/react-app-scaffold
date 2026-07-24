import { useState } from 'react';
import {
	InputGroup,
	InputGroupAddon,
	InputGroupButton,
	InputGroupInput,
	InputGroupText,
	InputGroupTextarea,
	Label,
	Input,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import SearchBarInputGroup from '@/domains/example/components/ui-components/input-group/SearchBarInputGroup';
import searchSource from '@/domains/example/components/ui-components/input-group/SearchBarInputGroup.tsx?raw';
import searchCss from '@/domains/example/components/ui-components/input-group/SearchBarInputGroup.module.css?raw';
import { Combine, Search, Mail, Eye, EyeOff, Copy, Check, Send } from 'lucide-react';

export default function InputGroupComponent(): React.ReactNode {
	// 6. 비밀번호 보기 토글
	const [showPw, setShowPw] = useState(false);
	// 7. 복사 버튼
	const [copied, setCopied] = useState(false);
	// 9. textarea 글자 수
	const [memo, setMemo] = useState('');
	// 10. Controlled 검색
	const [keyword, setKeyword] = useState('');

	const handleCopy = () => {
		navigator.clipboard?.writeText('AXIOM-2026-INVITE').catch(() => {});
		setCopied(true);
		window.setTimeout(() => setCopied(false), 1500);
	};

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-teal-50 dark:bg-teal-900/20">
					<Combine className="w-5 h-5 text-teal-600 dark:text-teal-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">InputGroup 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-teal-300/50 bg-teal-100/60 text-teal-800 dark:border-teal-600/40 dark:bg-teal-900/30 dark:text-teal-300">
							@axiom/components/ui
						</code>
						에서 제공하는 InputGroup 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 안내 배너 — 퍼블리셔 스타일 커스터마이징 ─────────────── */}
			<div className="rounded-xl border border-amber-200 dark:border-amber-800/50 bg-amber-50 dark:bg-amber-900/15 px-4 py-3">
				<p className="text-xs leading-relaxed text-amber-800 dark:text-amber-300">
					<strong className="font-semibold">퍼블리셔 참고</strong> — <code className="font-mono">InputGroup</code> 은
					입력창 앞/뒤에 아이콘·텍스트·버튼을 붙이는 <em>조합형</em> 컴포넌트라 실제 SI 프로젝트에서{' '}
					<strong className="font-semibold">스타일 변경이 가장 잦습니다.</strong> 테두리·높이·모서리·포커스 링은 모두{' '}
					<code className="font-mono">InputGroup</code> <u>래퍼</u>에 얹혀 있으므로, 룩앤필을 바꿀 때는{' '}
					<strong className="font-semibold">컴포넌트 코드를 수정하지 말고</strong> 래퍼의{' '}
					<code className="font-mono">className</code>(Tailwind 8번 · CSS Module 맨 아래 실전 예제)만 덮어쓰세요.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="InputGroup(래퍼) 안에 InputGroupInput(입력) 과 InputGroupAddon(부가 영역) 을 조합합니다. Addon 안에는 InputGroupText(텍스트) · InputGroupButton(버튼) · 아이콘을 넣습니다."
				/>
				<CodeBlock
					code={`import {
  InputGroup,
  InputGroupAddon,
  InputGroupInput,
  InputGroupText,
  InputGroupButton,
  InputGroupTextarea,
} from '@axiom/components/ui';

<InputGroup>
  <InputGroupAddon>            {/* 기본 align="inline-start" (앞) */}
    <SearchIcon />
  </InputGroupAddon>
  <InputGroupInput placeholder="검색어" />
  <InputGroupAddon align="inline-end">   {/* 뒤 */}
    <InputGroupButton>검색</InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>InputGroupAddon</b> 의 <b>align</b> 으로 부가 영역의 위치를 정합니다 —{' '}
					<b>"inline-start"</b>(앞, 기본) · <b>"inline-end"</b>(뒤) · <b>"block-start"</b>(위) ·{' '}
					<b>"block-end"</b>(아래, textarea 와 조합). 테두리·포커스·에러·disabled 상태는 개별 입력이 아니라{' '}
					<b>InputGroup 래퍼</b>가 통째로 처리합니다.
				</p>
			</section>

			{/* ── Input vs InputGroup vs Field 비교 ─────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="핵심 — Input vs InputGroup vs Field 차이"
					description="세 컴포넌트는 담당하는 계층이 다릅니다. 언제 무엇을 쓸지부터 정리합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">구분</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">역할(계층)</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">테두리/포커스 소유</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">이 프로젝트</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							<tr>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-blue-700 dark:text-blue-400">Input</code>
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									단일 입력 컨트롤 하나(<code className="font-mono">&lt;input&gt;</code>)
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">input 자신</td>
								<td className="px-4 py-2.5">
									<span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
										<Check className="w-3.5 h-3.5" /> 설치됨
									</span>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-teal-700 dark:text-teal-400">InputGroup</code>
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									입력 + 아이콘·텍스트·버튼을 <b>한 줄(하나의 테두리 안)</b>로 조합
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">InputGroup 래퍼</td>
								<td className="px-4 py-2.5">
									<span className="inline-flex items-center gap-1 text-xs font-medium text-emerald-600 dark:text-emerald-400">
										<Check className="w-3.5 h-3.5" /> 설치됨
									</span>
								</td>
							</tr>
							<tr>
								<td className="px-4 py-2.5">
									<code className="text-xs font-mono text-gray-500 dark:text-gray-500">Field</code>
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">
									폼 <b>한 행</b> 레이아웃 — 라벨 + 컨트롤 + 설명 + 에러 메시지를 묶음
								</td>
								<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">해당 없음(입력 아님)</td>
								<td className="px-4 py-2.5">
									<span className="inline-flex items-center gap-1 text-xs font-medium text-gray-400">미설치</span>
								</td>
							</tr>
						</tbody>
					</table>
				</div>

				<div className="rounded-xl border border-sky-200 dark:border-sky-800/50 bg-sky-50 dark:bg-sky-900/15 px-4 py-3">
					<p className="text-xs leading-relaxed text-sky-800 dark:text-sky-300">
						<strong className="font-semibold">Field 는 이 프로젝트에 설치되어 있지 않습니다.</strong> shadcn 공식
						InputGroup 문서 예제에는 <code className="font-mono">Field / FieldLabel / FieldDescription / FieldError</code>{' '}
						가 자주 함께 나오지만, 그건 <b>입력 컴포넌트가 아니라 라벨·설명·에러를 묶는 폼 레이아웃 래퍼</b>라 InputGroup
						과 직접 관계가 없습니다. 없어도 전혀 문제되지 않으며, 이 프로젝트에서는{' '}
						<b>
							기존 <code className="font-mono">Label</code> + 도움말/에러 텍스트
						</b>{' '}
						조합으로 동일하게 처리합니다(아래 예시).
					</p>
				</div>

				{/* 세 계층을 한눈에 — 같은 이메일 입력을 세 방식으로 */}
				<div className="grid gap-4 sm:grid-cols-3">
					{/* Input */}
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-sm">
						<span className="text-[11px] font-semibold uppercase tracking-wide text-blue-500">Input</span>
						<Input
							type="email"
							placeholder="you@example.com"
						/>
						<p className="text-[11px] text-gray-400">입력창 하나. 아이콘·버튼을 붙일 수 없음.</p>
					</div>
					{/* InputGroup */}
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-2 shadow-sm">
						<span className="text-[11px] font-semibold uppercase tracking-wide text-teal-500">InputGroup</span>
						<InputGroup>
							<InputGroupAddon>
								<Mail />
							</InputGroupAddon>
							<InputGroupInput
								type="email"
								placeholder="you@example.com"
							/>
						</InputGroup>
						<p className="text-[11px] text-gray-400">아이콘 프리픽스를 같은 테두리 안에 조합.</p>
					</div>
					{/* Field 대체 (Label + helper) */}
					<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-4 space-y-1.5 shadow-sm">
						<span className="text-[11px] font-semibold uppercase tracking-wide text-gray-400">
							Field 대체 (Label+text)
						</span>
						<Label htmlFor="cmp-email">이메일</Label>
						<InputGroup>
							<InputGroupAddon>
								<Mail />
							</InputGroupAddon>
							<InputGroupInput
								id="cmp-email"
								type="email"
								placeholder="you@example.com"
							/>
						</InputGroup>
						<p className="text-[11px] text-gray-400">라벨/설명/에러는 Label + 텍스트로 감쌈.</p>
					</div>
				</div>

				<CodeBlock
					code={`{/* Field 컴포넌트 없이 — 기존 Label + InputGroup + 도움말/에러 텍스트 */}
<div className="grid gap-1.5">
  <Label htmlFor="email">이메일</Label>
  <InputGroup>
    <InputGroupAddon><MailIcon /></InputGroupAddon>
    <InputGroupInput id="email" type="email" placeholder="you@example.com" />
  </InputGroup>
  <p className="text-xs text-muted-foreground">회사 이메일을 입력하세요.</p>
  {/* 에러 시 */}
  {/* <p className="text-xs text-destructive">올바른 이메일이 아닙니다.</p> */}
</div>`}
					lang="tsx"
					theme="github-dark"
				/>
			</section>

			{/* ── 1. 아이콘 프리픽스 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. 아이콘 프리픽스 (inline-start)"
					description="가장 흔한 형태. 입력창 앞에 아이콘을 붙입니다. Addon 은 기본 align='inline-start'."
				/>
				<ExCard
					label="Search 아이콘 + 입력"
					code={`<InputGroup>
  <InputGroupAddon>
    <Search />
  </InputGroupAddon>
  <InputGroupInput placeholder="검색어를 입력하세요" />
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupAddon>
								<Search />
							</InputGroupAddon>
							<InputGroupInput placeholder="검색어를 입력하세요" />
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 2. 텍스트 프리픽스/서픽스 ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. 텍스트 프리픽스 · 서픽스 (InputGroupText)"
					description="URL 스킴, 도메인, 단위 등 고정 텍스트를 앞/뒤에 붙일 때 InputGroupText 를 씁니다."
				/>
				<ExCard
					label='align="inline-start" / "inline-end"'
					code={`{/* 앞에 텍스트 */}
<InputGroup>
  <InputGroupAddon>
    <InputGroupText>https://</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput placeholder="example.com" />
</InputGroup>

{/* 뒤에 텍스트 (단위) */}
<InputGroup>
  <InputGroupInput type="number" placeholder="0" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>원</InputGroupText>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="grid gap-3 w-full max-w-sm">
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>https://</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput placeholder="example.com" />
						</InputGroup>
						<InputGroup>
							<InputGroupInput
								type="number"
								placeholder="0"
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>원</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 양쪽 Addon ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 양쪽 Addon (금액 입력)"
					description="앞·뒤 Addon 을 동시에 둘 수 있습니다. 통화 기호(앞) + 통화 코드(뒤) 조합이 대표적입니다."
				/>
				<ExCard
					label="prefix + suffix"
					code={`<InputGroup>
  <InputGroupAddon>
    <InputGroupText>$</InputGroupText>
  </InputGroupAddon>
  <InputGroupInput type="number" placeholder="0.00" />
  <InputGroupAddon align="inline-end">
    <InputGroupText>USD</InputGroupText>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupAddon>
								<InputGroupText>$</InputGroupText>
							</InputGroupAddon>
							<InputGroupInput
								type="number"
								placeholder="0.00"
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupText>USD</InputGroupText>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 4. 버튼 서픽스 ───────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 버튼 서픽스 (InputGroupButton)"
					description="입력창과 붙은 액션 버튼. 검색·적용·구독 등에 씁니다. size 로 크기를 조절합니다."
				/>
				<ExCard
					label="입력 + 버튼"
					code={`<InputGroup>
  <InputGroupInput placeholder="쿠폰 코드" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton variant="default" size="sm">적용</InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupInput placeholder="쿠폰 코드" />
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									variant="default"
									size="sm"
								>
									적용
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 5. 비밀번호 보기 토글 ────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. 아이콘 버튼 — 비밀번호 보기 토글"
					description="size='icon-xs' 로 정사각 아이콘 버튼을 만들고, 클릭으로 type 을 password ↔ text 로 토글합니다."
				/>
				<ExCard
					label='size="icon-xs" 토글 버튼'
					code={`const [show, setShow] = useState(false);

<InputGroup>
  <InputGroupInput
    type={show ? 'text' : 'password'}
    placeholder="비밀번호"
  />
  <InputGroupAddon align="inline-end">
    <InputGroupButton
      size="icon-xs"
      aria-label="비밀번호 표시 전환"
      onClick={() => setShow((v) => !v)}
    >
      {show ? <EyeOff /> : <Eye />}
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupInput
								type={showPw ? 'text' : 'password'}
								placeholder="비밀번호"
								defaultValue="s3cr3t-pass"
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									size="icon-xs"
									aria-label="비밀번호 표시 전환"
									onClick={() => setShowPw((v) => !v)}
								>
									{showPw ? <EyeOff /> : <Eye />}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 6. 복사 버튼 ─────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 읽기 전용 + 복사 버튼"
					description="초대 코드·API 키처럼 읽기 전용 값을 보여주고 한 번에 복사하는 패턴입니다."
				/>
				<ExCard
					label="readOnly + 복사"
					code={`const [copied, setCopied] = useState(false);

<InputGroup>
  <InputGroupInput readOnly value="AXIOM-2026-INVITE" />
  <InputGroupAddon align="inline-end">
    <InputGroupButton
      size="icon-xs"
      aria-label="복사"
      onClick={handleCopy}
    >
      {copied ? <Check /> : <Copy />}
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupInput
								readOnly
								value="AXIOM-2026-INVITE"
							/>
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									size="icon-xs"
									aria-label="복사"
									onClick={handleCopy}
								>
									{copied ? <Check className="text-emerald-500" /> : <Copy />}
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 7. Disabled / Validation ─────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="7. Disabled / Validation (에러 상태)"
					description="상태는 래퍼가 관리합니다 — 안쪽 Input 에 disabled 를 주면 그룹 전체가 흐려지고, aria-invalid 를 주면 그룹 테두리·링이 빨갛게 바뀝니다."
				/>
				<ExCard
					label="disabled / aria-invalid"
					code={`{/* disabled — 그룹 전체가 흐려짐 */}
<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="비활성화" disabled />
</InputGroup>

{/* aria-invalid — 그룹 테두리/링이 destructive 로 */}
<InputGroup>
  <InputGroupAddon><Mail /></InputGroupAddon>
  <InputGroupInput aria-invalid defaultValue="틀린-이메일" />
</InputGroup>`}
				>
					<div className="grid gap-3 w-full max-w-sm">
						<InputGroup>
							<InputGroupAddon>
								<Search />
							</InputGroupAddon>
							<InputGroupInput
								placeholder="비활성화"
								disabled
							/>
						</InputGroup>
						<div className="grid gap-1.5">
							<InputGroup>
								<InputGroupAddon>
									<Mail />
								</InputGroupAddon>
								<InputGroupInput
									aria-invalid
									defaultValue="틀린-이메일"
								/>
							</InputGroup>
							<p className="text-xs text-destructive">올바른 이메일 형식이 아닙니다.</p>
						</div>
					</div>
				</ExCard>
			</section>

			{/* ── 8. className 커스터마이징 (Tailwind) ─────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="8. className 으로 스타일 변경 (Tailwind)"
					description="래퍼(InputGroup)의 className 이 기본 스타일 뒤에 병합되므로 높이·모서리·색을 자유롭게 덮어씁니다. 퍼블리셔가 가장 자주 쓰는 방식입니다."
				/>
				<ExCard
					label="래퍼 className 오버라이드"
					code={`{/* 큰 사이즈 + 알약형 */}
<InputGroup className="h-11 rounded-full px-2">
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput placeholder="둥근 검색 바" />
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup className="h-11 rounded-full px-2">
							<InputGroupAddon>
								<Search />
							</InputGroupAddon>
							<InputGroupInput placeholder="둥근 검색 바" />
							<InputGroupAddon align="inline-end">
								<InputGroupButton
									variant="default"
									size="sm"
									className="rounded-full"
								>
									검색
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 9. Textarea + block Addon ────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="9. Textarea + block Addon (위/아래 배치)"
					description="InputGroupTextarea 와 align='block-end' Addon 을 조합하면, 여러 줄 입력 아래에 글자 수·전송 버튼을 붙일 수 있습니다."
				/>
				<ExCard
					label='InputGroupTextarea + align="block-end"'
					code={`<InputGroup>
  <InputGroupTextarea placeholder="메시지를 입력하세요..." />
  <InputGroupAddon align="block-end">
    <InputGroupText>{memo.length} / 200</InputGroupText>
    <InputGroupButton
      variant="default"
      size="sm"
      className="ml-auto"
    >
      <Send /> 전송
    </InputGroupButton>
  </InputGroupAddon>
</InputGroup>`}
				>
					<div className="w-full max-w-sm">
						<InputGroup>
							<InputGroupTextarea
								placeholder="메시지를 입력하세요..."
								maxLength={200}
								value={memo}
								onChange={(e) => setMemo(e.target.value)}
								rows={3}
							/>
							<InputGroupAddon align="block-end">
								<InputGroupText>{memo.length} / 200</InputGroupText>
								<InputGroupButton
									variant="default"
									size="sm"
									className="ml-auto"
								>
									<Send /> 전송
								</InputGroupButton>
							</InputGroupAddon>
						</InputGroup>
					</div>
				</ExCard>
			</section>

			{/* ── 10. 인터랙티브 — Controlled ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="10. 인터랙티브 예제 — Controlled"
					description="value / onChange 로 입력값을 외부 state 에서 제어하고, 값이 있을 때만 지우기 버튼을 노출합니다."
				/>

				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							현재 검색어:{' '}
							<code className="font-mono text-teal-700 dark:text-teal-400">{keyword || '(비어 있음)'}</code>
						</span>
					</div>
					<div className="p-5">
						<div className="w-full max-w-sm">
							<InputGroup>
								<InputGroupAddon>
									<Search />
								</InputGroupAddon>
								<InputGroupInput
									value={keyword}
									onChange={(e) => setKeyword(e.target.value)}
									placeholder="입력하면 우측에 지우기 버튼이 나타납니다"
								/>
								{keyword && (
									<InputGroupAddon align="inline-end">
										<InputGroupButton
											size="xs"
											onClick={() => setKeyword('')}
										>
											지우기
										</InputGroupButton>
									</InputGroupAddon>
								)}
							</InputGroup>
						</div>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`const [keyword, setKeyword] = useState('');

<InputGroup>
  <InputGroupAddon><Search /></InputGroupAddon>
  <InputGroupInput
    value={keyword}
    onChange={(e) => setKeyword(e.target.value)}
    placeholder="검색어"
  />
  {keyword && (
    <InputGroupAddon align="inline-end">
      <InputGroupButton size="xs" onClick={() => setKeyword('')}>
        지우기
      </InputGroupButton>
    </InputGroupAddon>
  )}
</InputGroup>`}
						/>
					</div>
				</div>
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
								{
									component: 'InputGroup',
									prop: 'className',
									type: 'string',
									desc: '래퍼 스타일(테두리·높이·모서리·포커스) 커스터마이징 — 여기에 얹음',
								},
								{
									component: 'InputGroupAddon',
									prop: 'align',
									type: '"inline-start" | "inline-end" | "block-start" | "block-end"',
									desc: '부가 영역 위치 (앞/뒤/위/아래). 기본 inline-start',
								},
								{
									component: 'InputGroupInput',
									prop: '(input 속성)',
									type: 'React.ComponentProps<"input">',
									desc: '표준 input 속성 그대로 — value·onChange·disabled·aria-invalid 등',
								},
								{
									component: 'InputGroupTextarea',
									prop: '(textarea 속성)',
									type: 'React.ComponentProps<"textarea">',
									desc: '여러 줄 입력. block-start/block-end Addon 과 조합',
								},
								{
									component: 'InputGroupButton',
									prop: 'size',
									type: '"xs" | "sm" | "icon-xs" | "icon-sm"',
									desc: '버튼 크기. 아이콘 전용은 icon-xs/icon-sm',
								},
								{
									component: 'InputGroupButton',
									prop: 'variant',
									type: '"ghost" | "default" | "outline" | ...',
									desc: 'Button 의 variant 그대로. 기본 ghost',
								},
								{
									component: 'InputGroupText',
									prop: 'children',
									type: 'ReactNode',
									desc: '고정 텍스트/단위/아이콘 라벨',
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
			</section>

			{/* ── 기타. 실전 예제 — 통합 검색 바 (CSS Module 리스타일) ── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 통합 검색 바 (CSS Module 리스타일)"
					description="제공 InputGroup 계열을 그대로 쓰고 *.module.css 로 래퍼 className 만 덮어써서 전혀 다른 룩앤필(높이 52px · 알약형 · teal 소프트 글로우 · 키보드 힌트 · 지우기 버튼)을 입혔습니다. 퍼블리셔가 InputGroup 스타일을 바꾸는 전형적인 방식이므로, 아래 소스를 그대로 복사해 시작점으로 쓰세요."
				/>

				<div className="flex justify-center py-2">
					<SearchBarInputGroup />
				</div>

				<SourceTabs
					files={[
						{ filename: 'SearchBarInputGroup.tsx', code: searchSource, lang: 'tsx' },
						{ filename: 'SearchBarInputGroup.module.css', code: searchCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
