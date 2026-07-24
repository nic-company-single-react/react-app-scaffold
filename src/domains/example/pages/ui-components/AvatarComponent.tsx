import {
	Avatar,
	AvatarBadge,
	AvatarFallback,
	AvatarGroup,
	AvatarGroupCount,
	AvatarImage,
	CodeBlock,
} from '@axiom/components/ui';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';
import SourceTabs from '@/domains/example/components/ui-components/common/SourceTabs';
import ApprovalLineAvatars from '@/domains/example/components/ui-components/avatar/ApprovalLineAvatars';
import approvalSource from '@/domains/example/components/ui-components/avatar/ApprovalLineAvatars.tsx?raw';
import approvalCss from '@/domains/example/components/ui-components/avatar/ApprovalLineAvatars.module.css?raw';
import { CircleUserRound, User } from 'lucide-react';

/**
 * 오프라인/폐쇄망에서도 항상 렌더되도록, 외부 URL 대신 인라인 SVG(data URI)를 이미지로 쓴다.
 * 실제 프로젝트에서는 이 자리에 서버 프로필 이미지 URL 을 넣으면 된다.
 */
const svgAvatar = (bg: string, label: string): string =>
	`data:image/svg+xml;utf8,${encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" width="96" height="96"><rect width="96" height="96" fill="${bg}"/><text x="50%" y="54%" font-family="sans-serif" font-size="40" fill="white" text-anchor="middle" dominant-baseline="middle">${label}</text></svg>`,
	)}`;

const IMG_KIM = svgAvatar('#7c3aed', '김');
const IMG_LEE = svgAvatar('#0ea5e9', '이');
const IMG_PARK = svgAvatar('#10b981', '박');
const IMG_CHOI = svgAvatar('#f59e0b', '최');

export default function AvatarComponent(): React.ReactNode {
	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<CircleUserRound className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Avatar 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 Avatar 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Avatar(원형 프레임) 안에 AvatarImage(이미지)와 AvatarFallback(이미지 로드 실패 시 대체)을 함께 둡니다. 이미지가 없거나 로드에 실패하면 자동으로 Fallback 이 표시됩니다."
				/>
				<CodeBlock
					code={`import {
  Avatar,
  AvatarImage,
  AvatarFallback,
} from '@axiom/components/ui';

<Avatar>
  <AvatarImage src="/users/kim.png" alt="김닉" />
  <AvatarFallback>김닉</AvatarFallback>
</Avatar>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					<b>AvatarImage</b> 의 <b>src</b> 로 프로필 이미지를 지정하고, 로드 실패에 대비해 항상 <b>AvatarFallback</b>{' '}
					(이니셜 또는 아이콘)을 함께 넣는 것을 권장합니다. 크기는 <b>size</b> prop 으로 조절합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic — 이미지 + Fallback"
					description="이미지가 정상 로드되면 이미지를, 실패하면 Fallback(이니셜)을 보여줍니다."
				/>
				<ExCard
					label="AvatarImage + AvatarFallback"
					code={`<Avatar>
  <AvatarImage src="/users/kim.png" alt="김닉" />
  <AvatarFallback>김닉</AvatarFallback>
</Avatar>`}
				>
					<Avatar>
						<AvatarImage
							src={IMG_KIM}
							alt="김닉"
						/>
						<AvatarFallback>김닉</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarImage
							src={IMG_LEE}
							alt="이수미"
						/>
						<AvatarFallback>이수</AvatarFallback>
					</Avatar>
					<Avatar>
						<AvatarImage
							src={IMG_PARK}
							alt="박결재"
						/>
						<AvatarFallback>박결</AvatarFallback>
					</Avatar>
				</ExCard>
			</section>

			{/* ── 2. Sizes ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Sizes (size prop)"
					description='size prop 으로 크기를 조절합니다 — "sm"(24px) / "default"(32px) / "lg"(40px).'
				/>
				<ExCard
					label='size="sm" | "default" | "lg"'
					code={`<Avatar size="sm">
  <AvatarImage src="/users/kim.png" alt="김닉" />
  <AvatarFallback>김닉</AvatarFallback>
</Avatar>
<Avatar size="default"> ... </Avatar>
<Avatar size="lg"> ... </Avatar>`}
				>
					<Avatar size="sm">
						<AvatarImage
							src={IMG_KIM}
							alt="김닉"
						/>
						<AvatarFallback>김닉</AvatarFallback>
					</Avatar>
					<Avatar size="default">
						<AvatarImage
							src={IMG_KIM}
							alt="김닉"
						/>
						<AvatarFallback>김닉</AvatarFallback>
					</Avatar>
					<Avatar size="lg">
						<AvatarImage
							src={IMG_KIM}
							alt="김닉"
						/>
						<AvatarFallback>김닉</AvatarFallback>
					</Avatar>
				</ExCard>
			</section>

			{/* ── 3. Fallback ──────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. Fallback (이니셜 · 아이콘 · 이미지 실패)"
					description="이미지가 없거나(=AvatarImage 미사용) src 로드가 실패하면 AvatarFallback 이 렌더됩니다. 이니셜뿐 아니라 아이콘도 넣을 수 있습니다."
				/>
				<ExCard
					label="이니셜 / 아이콘 / 깨진 이미지"
					code={`{/* 이니셜 */}
<Avatar>
  <AvatarFallback>김닉</AvatarFallback>
</Avatar>

{/* 아이콘 */}
<Avatar>
  <AvatarFallback>
    <User className="size-4" />
  </AvatarFallback>
</Avatar>

{/* 이미지 로드 실패 → Fallback 자동 노출 */}
<Avatar>
  <AvatarImage src="/broken.png" alt="깨진 이미지" />
  <AvatarFallback>NA</AvatarFallback>
</Avatar>`}
				>
					<Avatar size="lg">
						<AvatarFallback>김닉</AvatarFallback>
					</Avatar>
					<Avatar size="lg">
						<AvatarFallback>
							<User className="size-4" />
						</AvatarFallback>
					</Avatar>
					<Avatar size="lg">
						<AvatarImage
							src="/this-image-does-not-exist.png"
							alt="깨진 이미지"
						/>
						<AvatarFallback>NA</AvatarFallback>
					</Avatar>
				</ExCard>
			</section>

			{/* ── 4. AvatarBadge ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. AvatarBadge (상태 표시)"
					description="Avatar 우하단에 상태 뱃지를 겹쳐 표시합니다. className 으로 색을 바꾸거나 안에 아이콘을 넣을 수 있습니다."
				/>
				<ExCard
					label="온라인 · 자리비움 · 오프라인"
					code={`{/* 온라인(초록 점) */}
<Avatar size="lg">
  <AvatarImage src="/users/kim.png" alt="김닉" />
  <AvatarFallback>김닉</AvatarFallback>
  <AvatarBadge className="bg-emerald-500" />
</Avatar>

{/* 자리비움(노랑 점) */}
<Avatar size="lg">
  ...
  <AvatarBadge className="bg-amber-500" />
</Avatar>

{/* 오프라인(회색 점) */}
<Avatar size="lg">
  ...
  <AvatarBadge className="bg-gray-400" />
</Avatar>`}
				>
					<Avatar size="lg">
						<AvatarImage
							src={IMG_KIM}
							alt="김닉"
						/>
						<AvatarFallback>김닉</AvatarFallback>
						<AvatarBadge className="bg-emerald-500" />
					</Avatar>
					<Avatar size="lg">
						<AvatarImage
							src={IMG_LEE}
							alt="이수미"
						/>
						<AvatarFallback>이수</AvatarFallback>
						<AvatarBadge className="bg-amber-500" />
					</Avatar>
					<Avatar size="lg">
						<AvatarImage
							src={IMG_PARK}
							alt="박결재"
						/>
						<AvatarFallback>박결</AvatarFallback>
						<AvatarBadge className="bg-gray-400" />
					</Avatar>
				</ExCard>
			</section>

			{/* ── 5. AvatarGroup ───────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="5. AvatarGroup · AvatarGroupCount (겹쳐 쌓기)"
					description="여러 사용자를 겹쳐 표시하고, 남은 인원 수를 AvatarGroupCount 로 '+N' 처럼 나타냅니다. 크기는 각 Avatar 의 size 로 지정하면 AvatarGroupCount 까지 함께 맞춰집니다."
				/>
				<ExCard
					label="AvatarGroup + AvatarGroupCount"
					code={`<AvatarGroup>
  <Avatar size="lg">
    <AvatarImage src="/users/kim.png" alt="김닉" />
    <AvatarFallback>김닉</AvatarFallback>
  </Avatar>
  <Avatar size="lg">
    <AvatarImage src="/users/lee.png" alt="이수미" />
    <AvatarFallback>이수</AvatarFallback>
  </Avatar>
  <Avatar size="lg">
    <AvatarImage src="/users/park.png" alt="박결재" />
    <AvatarFallback>박결</AvatarFallback>
  </Avatar>
  <AvatarGroupCount>+5</AvatarGroupCount>
</AvatarGroup>`}
				>
					<AvatarGroup>
						<Avatar size="lg">
							<AvatarImage
								src={IMG_KIM}
								alt="김닉"
							/>
							<AvatarFallback>김닉</AvatarFallback>
						</Avatar>
						<Avatar size="lg">
							<AvatarImage
								src={IMG_LEE}
								alt="이수미"
							/>
							<AvatarFallback>이수</AvatarFallback>
						</Avatar>
						<Avatar size="lg">
							<AvatarImage
								src={IMG_PARK}
								alt="박결재"
							/>
							<AvatarFallback>박결</AvatarFallback>
						</Avatar>
						<Avatar size="lg">
							<AvatarImage
								src={IMG_CHOI}
								alt="최전무"
							/>
							<AvatarFallback>최전</AvatarFallback>
						</Avatar>
						<AvatarGroupCount>+5</AvatarGroupCount>
					</AvatarGroup>
				</ExCard>
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
									component: 'Avatar',
									prop: 'size',
									type: '"sm" | "default" | "lg"',
									desc: '아바타 크기 (24 / 32 / 40px). 기본값 "default"',
								},
								{
									component: 'AvatarImage',
									prop: 'src',
									type: 'string',
									desc: '프로필 이미지 경로 (로드 실패 시 Fallback 노출)',
								},
								{
									component: 'AvatarImage',
									prop: 'alt',
									type: 'string',
									desc: '대체 텍스트(접근성)',
								},
								{
									component: 'AvatarFallback',
									prop: 'children',
									type: 'ReactNode',
									desc: '이미지 미표시 시 대체 콘텐츠 (이니셜·아이콘)',
								},
								{
									component: 'AvatarBadge',
									prop: 'className',
									type: 'string',
									desc: '우하단 상태 뱃지. 색상/아이콘 커스터마이즈',
								},
								{
									component: 'AvatarGroup',
									prop: 'children',
									type: 'ReactNode',
									desc: '겹쳐 쌓을 Avatar 들 (크기는 각 Avatar 의 size 로 지정)',
								},
								{
									component: 'AvatarGroupCount',
									prop: 'children',
									type: 'ReactNode',
									desc: '남은 인원 수 표시 (예: "+5")',
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

			{/* ── 기타. 실전 예제 — 전자결재 결재선 ──────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="기타. 실전 예제 — 전자결재 결재선"
					description="제공 Avatar 를 그대로 쓰되, *.module.css 로 원형을 라운드 사각 타일로 바꾸고 결재 상태별 링/뱃지 색을 입힌 예제입니다. 실제 SI 프로젝트에서 퍼블리셔가 Avatar 스타일을 크게 바꿔야 할 때는 컴포넌트(.tsx)가 아니라 이 CSS Module 한 곳만 수정하면 됩니다 — data-slot 선택자로 각 부위(루트·이미지·fallback·badge·group·count)를 오버라이드합니다."
				/>

				<ApprovalLineAvatars />

				<SourceTabs
					files={[
						{ filename: 'ApprovalLineAvatars.tsx', code: approvalSource, lang: 'tsx' },
						{ filename: 'ApprovalLineAvatars.module.css', code: approvalCss, lang: 'css' },
					]}
				/>
			</section>
		</div>
	);
}
