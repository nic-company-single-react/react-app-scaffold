import { useState } from 'react';
import {
	Table,
	TableHeader,
	TableBody,
	TableFooter,
	TableHead,
	TableRow,
	TableCell,
	TableCaption,
	Badge,
	Checkbox,
	CodeBlock,
} from '@axiom/components/ui';
import { TableProperties } from 'lucide-react';
import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';
import SectionNav from '@/domains/example/components/ui-components/common/SectionNav';
import ExCard from '@/domains/example/components/ui-components/common/ExCard';

// ── 샘플 데이터 ───────────────────────────────────────────────────────
type Invoice = {
	id: string;
	customer: string;
	method: '카드' | '계좌이체' | '가상계좌';
	status: 'paid' | 'pending' | 'failed';
	amount: number;
};

const invoices: Invoice[] = [
	{ id: 'INV-001', customer: '김철수', method: '카드', status: 'paid', amount: 250000 },
	{ id: 'INV-002', customer: '이영희', method: '계좌이체', status: 'pending', amount: 125000 },
	{ id: 'INV-003', customer: '박민수', method: '가상계좌', status: 'paid', amount: 350000 },
	{ id: 'INV-004', customer: '최지우', method: '카드', status: 'failed', amount: 90000 },
	{ id: 'INV-005', customer: '정해인', method: '계좌이체', status: 'paid', amount: 480000 },
];

const won = (n: number) => n.toLocaleString('ko-KR') + '원';

const statusBadge: Record<Invoice['status'], { label: string; variant: 'default' | 'secondary' | 'destructive' }> = {
	paid: { label: '완료', variant: 'default' },
	pending: { label: '대기', variant: 'secondary' },
	failed: { label: '실패', variant: 'destructive' },
};

export default function TableComponent(): React.ReactNode {
	// 4번 예제(행 선택)용 상태
	const [selected, setSelected] = useState<string[]>(['INV-002']);
	const toggle = (id: string) =>
		setSelected((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

	const total = invoices.reduce((sum, r) => sum + r.amount, 0);

	return (
		<div className="p-6 space-y-8 max-w-3xl">
			{/* ── 오른쪽 바로가기 메뉴 (xl 이상에서만 노출) ───────────── */}
			<SectionNav />

			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<TableProperties className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Table 컴포넌트</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						<code className="text-xs font-mono font-semibold px-1.5 py-0.5 rounded border border-violet-300/50 bg-violet-100/60 text-violet-800 dark:border-violet-600/40 dark:bg-violet-900/30 dark:text-violet-300">
							@axiom/components/ui
						</code>
						에서 제공하는 저수준 Table 컴포넌트 사용 예제입니다.
					</p>
				</div>
			</div>

			{/* ── Table vs SmartTable 안내 배너 ─────────────────────── */}
			<div className="rounded-2xl border border-amber-200 dark:border-amber-800/50 bg-amber-50/60 dark:bg-amber-900/15 p-4 space-y-2">
				<p className="text-sm font-semibold text-amber-900 dark:text-amber-200">
					⚡ Table vs SmartTable — 무엇을 쓸까요?
				</p>
				<p className="text-xs text-amber-800/90 dark:text-amber-200/80 leading-relaxed">
					<b>Table</b>은 HTML <code className="font-mono">&lt;table&gt;</code> 을 감싼 <b>저수준 프리미티브</b>입니다.
					마크업과 스타일을 100% 직접 제어하는 대신, 정렬·검색·페이징·행선택·엑셀 내보내기 같은 기능은 없습니다. 정적이거나
					소량 데이터, 또는 <b>디자인을 완전히 자유롭게 잡아야 하는 화면</b>에 적합합니다.
					<br />
					업무용 대량 데이터 그리드(정렬/검색/페이징/행액션/엑셀 export가 필요하면)는{' '}
					<b>SmartTable</b>을 쓰세요. 자세한 비교는{' '}
					<button
						type="button"
						onClick={() => document.getElementById('section-compare')?.scrollIntoView({ behavior: 'smooth', block: 'start' })}
						className="underline font-medium hover:text-amber-950 dark:hover:text-amber-100"
					>
						아래 5번 비교 표
					</button>
					를 참고하세요.
				</p>
			</div>

			{/* ── 0. import & 기본 구조 ────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="0. import & 기본 구조"
					description="Table(래퍼) 안에 TableHeader/TableBody/TableFooter 를 두고, 각 행은 TableRow, 헤더 셀은 TableHead, 데이터 셀은 TableCell 로 조합합니다. 순수 HTML 테이블 구조와 1:1 대응됩니다."
					id="section-import"
				/>
				<CodeBlock
					code={`import {
  Table,
  TableHeader,
  TableBody,
  TableFooter,
  TableHead,
  TableRow,
  TableCell,
  TableCaption,
} from '@axiom/components/ui';

<Table>
  <TableHeader>
    <TableRow>
      <TableHead>주문번호</TableHead>
      <TableHead>고객</TableHead>
      <TableHead className="text-right">금액</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    <TableRow>
      <TableCell>INV-001</TableCell>
      <TableCell>김철수</TableCell>
      <TableCell className="text-right">250,000원</TableCell>
    </TableRow>
  </TableBody>
</Table>`}
					lang="tsx"
					theme="github-dark"
				/>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					모든 구성요소는 표준 HTML 요소(<code className="font-mono">table</code>/<code className="font-mono">thead</code>/
					<code className="font-mono">tr</code>/<code className="font-mono">th</code>/<code className="font-mono">td</code>)를
					그대로 감싼 것이라, <b>className 으로 자유롭게 스타일을 덮어쓸 수 있습니다.</b> Table 래퍼는 가로 스크롤(
					<code className="font-mono">overflow-x-auto</code>) 컨테이너를 자동으로 포함합니다.
				</p>
			</section>

			{/* ── 1. Basic ─────────────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="1. Basic (기본)"
					description="가장 기본적인 형태. 행에 마우스를 올리면 hover 배경이 자동으로 적용됩니다."
					id="section-basic"
				/>
				<ExCard
					label="Table + TableHeader + TableBody"
					code={`<Table>
  <TableHeader>
    <TableRow>
      <TableHead>주문번호</TableHead>
      <TableHead>고객</TableHead>
      <TableHead>결제수단</TableHead>
      <TableHead className="text-right">금액</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((row) => (
      <TableRow key={row.id}>
        <TableCell className="font-medium">{row.id}</TableCell>
        <TableCell>{row.customer}</TableCell>
        <TableCell>{row.method}</TableCell>
        <TableCell className="text-right">{won(row.amount)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
				>
					<div className="w-full">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>주문번호</TableHead>
									<TableHead>고객</TableHead>
									<TableHead>결제수단</TableHead>
									<TableHead className="text-right">금액</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">{row.id}</TableCell>
										<TableCell>{row.customer}</TableCell>
										<TableCell>{row.method}</TableCell>
										<TableCell className="text-right">{won(row.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</ExCard>
			</section>

			{/* ── 2. Caption + Footer(합계) ─────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="2. Caption · Footer (합계 행)"
					description="TableCaption 으로 표 설명을, TableFooter 로 합계 등 마무리 행을 추가합니다. Footer 는 배경/굵기가 자동으로 강조됩니다."
					id="section-footer"
				/>
				<ExCard
					label="TableCaption + TableFooter"
					code={`<Table>
  <TableCaption>2025년 3월 결제 내역</TableCaption>
  <TableHeader>
    <TableRow>
      <TableHead>주문번호</TableHead>
      <TableHead>고객</TableHead>
      <TableHead className="text-right">금액</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>{/* ...행... */}</TableBody>
  <TableFooter>
    <TableRow>
      <TableCell colSpan={2}>합계</TableCell>
      <TableCell className="text-right">{won(total)}</TableCell>
    </TableRow>
  </TableFooter>
</Table>`}
				>
					<div className="w-full">
						<Table>
							<TableCaption>2025년 3월 결제 내역</TableCaption>
							<TableHeader>
								<TableRow>
									<TableHead>주문번호</TableHead>
									<TableHead>고객</TableHead>
									<TableHead className="text-right">금액</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">{row.id}</TableCell>
										<TableCell>{row.customer}</TableCell>
										<TableCell className="text-right">{won(row.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
							<TableFooter>
								<TableRow>
									<TableCell colSpan={2}>합계</TableCell>
									<TableCell className="text-right">{won(total)}</TableCell>
								</TableRow>
							</TableFooter>
						</Table>
					</div>
				</ExCard>
			</section>

			{/* ── 3. 정렬 + Badge 셀 ────────────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="3. 정렬(align) · Badge 셀"
					description="셀은 자유로운 JSX 를 담을 수 있습니다. className(text-right/text-center)으로 정렬하고, 상태 컬럼에는 Badge 컴포넌트를 넣어 강조합니다."
					id="section-align"
				/>
				<ExCard
					label="text-right / text-center + Badge"
					code={`<TableCell className="text-center">
  <Badge variant={statusBadge[row.status].variant}>
    {statusBadge[row.status].label}
  </Badge>
</TableCell>
<TableCell className="text-right tabular-nums">
  {won(row.amount)}
</TableCell>`}
				>
					<div className="w-full">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead>주문번호</TableHead>
									<TableHead>고객</TableHead>
									<TableHead className="text-center">상태</TableHead>
									<TableHead className="text-right">금액</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((row) => (
									<TableRow key={row.id}>
										<TableCell className="font-medium">{row.id}</TableCell>
										<TableCell>{row.customer}</TableCell>
										<TableCell className="text-center">
											<Badge variant={statusBadge[row.status].variant}>{statusBadge[row.status].label}</Badge>
										</TableCell>
										<TableCell className="text-right tabular-nums">{won(row.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</ExCard>
			</section>

			{/* ── 4. 행 선택 (data-state) ───────────────────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="4. 행 선택 — data-state=selected"
					description="TableRow 에 data-state='selected' 를 주면 선택 강조 배경이 적용됩니다. Table 은 저수준 컴포넌트라 선택 로직은 직접 구현하고, 체크박스는 Scaffold Checkbox 를 사용합니다."
					id="section-select"
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
						<span className="text-xs font-medium text-gray-600 dark:text-gray-400">
							선택된 행:{' '}
							<code className="font-mono text-violet-700 dark:text-violet-400">
								{selected.length ? selected.join(', ') : '없음'}
							</code>
						</span>
					</div>
					<div className="p-5">
						<Table>
							<TableHeader>
								<TableRow>
									<TableHead className="w-10"></TableHead>
									<TableHead>주문번호</TableHead>
									<TableHead>고객</TableHead>
									<TableHead className="text-right">금액</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((row) => {
									const checked = selected.includes(row.id);
									return (
										<TableRow
											key={row.id}
											data-state={checked ? 'selected' : undefined}
											className="cursor-pointer"
											onClick={() => toggle(row.id)}
										>
											<TableCell>
												<Checkbox
													checked={checked}
													onCheckedChange={() => toggle(row.id)}
													// 행 클릭과 중복 토글되지 않도록 셀 클릭 전파를 막는다.
													onClick={(e) => e.stopPropagation()}
													aria-label={`${row.id} 선택`}
												/>
											</TableCell>
											<TableCell className="font-medium">{row.id}</TableCell>
											<TableCell>{row.customer}</TableCell>
											<TableCell className="text-right tabular-nums">{won(row.amount)}</TableCell>
										</TableRow>
									);
								})}
							</TableBody>
						</Table>
					</div>
					<div className="border-t border-gray-100 dark:border-gray-800">
						<CodeBlock
							code={`import { Checkbox } from '@axiom/components/ui';

const [selected, setSelected] = useState<string[]>([]);
const toggle = (id: string) =>
  setSelected((p) => (p.includes(id) ? p.filter((x) => x !== id) : [...p, id]));

<TableRow
  data-state={selected.includes(row.id) ? 'selected' : undefined}
  onClick={() => toggle(row.id)}
  className="cursor-pointer"
>
  <TableCell>
    <Checkbox
      checked={selected.includes(row.id)}
      onCheckedChange={() => toggle(row.id)}
      onClick={(e) => e.stopPropagation()} // 행 클릭과 중복 방지
    />
  </TableCell>
  {/* ...나머지 셀... */}
</TableRow>`}
						/>
					</div>
				</div>
			</section>

			{/* ── 5. Table vs SmartTable 비교 ───────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="5. Table vs SmartTable 비교"
					description="같은 '표'지만 추상화 수준이 다릅니다. 화면 성격에 맞게 고르세요."
					id="section-compare"
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">구분</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									Table (저수준)
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									SmartTable (고수준)
								</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ k: '작성 방식', t: 'JSX 로 행/셀을 직접 조립', s: 'columns 설정 맵(defineColumns) 선언' },
								{ k: '데이터 바인딩', t: '직접 .map() 렌더', s: 'data 배열 또는 endpoint 자동 배선' },
								{ k: '정렬 / 검색 / 페이징', t: '없음 (직접 구현)', s: '내장' },
								{ k: '행 선택 / 행 액션', t: '없음 (직접 구현)', s: '내장 (selectable / renderRowActions)' },
								{ k: '엑셀(xlsx) 내보내기', t: '없음', s: '내장 (exportable)' },
								{ k: '병합 헤더 / 합계 행', t: 'colSpan/rowSpan 수동', s: '설정만으로 자동 (mergeCells / summary)' },
								{ k: '스타일 자유도', t: '최고 — 마크업까지 100% 제어', s: 'variant · density + 시맨틱 토큰 교체' },
								{ k: '적합한 화면', t: '정적/소량, 완전 커스텀 레이아웃', s: '업무 그리드(대량·CRUD 목록)' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors align-top"
								>
									<td className="px-4 py-2.5 text-xs font-medium text-gray-700 dark:text-gray-300 whitespace-nowrap">
										{row.k}
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.t}</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.s}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					👉 한 줄 요약: <b>디자인·마크업을 자유롭게 잡아야 하면 Table</b>, <b>기능이 붙은 업무 그리드가 필요하면 SmartTable</b>.
					SmartTable 예제는{' '}
					<code className="font-mono text-violet-700 dark:text-violet-400">/example/ui-components/smart-table</code> 에서
					확인하세요.
				</p>
			</section>

			{/* ── 6. 퍼블리셔용 — 스타일 커스터마이징 ───────────────── */}
			<section className="space-y-4">
				<SectionHeader
					title="6. 스타일 커스터마이징 (퍼블리셔 가이드)"
					description="실제 SI 프로젝트에서는 Table 의 룩앤필이 프로젝트마다 크게 달라집니다. 모든 구성요소가 className 을 그대로 병합(cn)하므로, 아래처럼 각 파트에 className 을 얹어 자유롭게 재디자인하면 됩니다."
					id="section-style"
				/>
				<ExCard
					label="줄무늬(zebra) + 컬러 헤더 커스텀 예시"
					code={`{/* Table 파트마다 className 을 얹어 완전히 다른 룩으로 재디자인 */}
<Table className="border-separate border-spacing-0">
  <TableHeader>
    <TableRow className="hover:bg-transparent">
      <TableHead className="bg-violet-600 text-white first:rounded-tl-lg">주문번호</TableHead>
      <TableHead className="bg-violet-600 text-white">고객</TableHead>
      <TableHead className="bg-violet-600 text-white text-right last:rounded-tr-lg">금액</TableHead>
    </TableRow>
  </TableHeader>
  <TableBody>
    {invoices.map((row, i) => (
      <TableRow key={row.id} className={i % 2 ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}>
        <TableCell className="font-mono">{row.id}</TableCell>
        <TableCell>{row.customer}</TableCell>
        <TableCell className="text-right tabular-nums">{won(row.amount)}</TableCell>
      </TableRow>
    ))}
  </TableBody>
</Table>`}
				>
					<div className="w-full">
						<Table className="border-separate border-spacing-0">
							<TableHeader>
								<TableRow className="hover:bg-transparent">
									<TableHead className="bg-violet-600 text-white first:rounded-tl-lg">주문번호</TableHead>
									<TableHead className="bg-violet-600 text-white">고객</TableHead>
									<TableHead className="bg-violet-600 text-white text-right last:rounded-tr-lg">금액</TableHead>
								</TableRow>
							</TableHeader>
							<TableBody>
								{invoices.map((row, i) => (
									<TableRow
										key={row.id}
										className={i % 2 ? 'bg-violet-50/50 dark:bg-violet-900/10' : ''}
									>
										<TableCell className="font-mono">{row.id}</TableCell>
										<TableCell>{row.customer}</TableCell>
										<TableCell className="text-right tabular-nums">{won(row.amount)}</TableCell>
									</TableRow>
								))}
							</TableBody>
						</Table>
					</div>
				</ExCard>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					각 파트의 기본 클래스는 <code className="font-mono">cn()</code> 으로 병합되므로, 전달한 className 이{' '}
					<b>뒤에 와서 우선 적용</b>됩니다. 다크 모드는 앱 규칙(<code className="font-mono">.dark</code>)에 맞춰{' '}
					<code className="font-mono">dark:</code> 유틸리티로 대응하세요. 스타일이 커지면 프로젝트 규칙에 따라{' '}
					<code className="font-mono">*.module.css</code> 로 분리하는 것도 가능합니다.
				</p>
			</section>

			{/* ── 구성요소 요약 테이블 ──────────────────────────────── */}
			<section className="space-y-3">
				<SectionHeader
					title="구성요소 요약"
					id="section-parts"
				/>
				<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 overflow-hidden shadow-sm">
					<table className="w-full text-sm">
						<thead>
							<tr className="border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">구성요소</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">
									대응 HTML
								</th>
								<th className="text-left px-4 py-2.5 font-medium text-gray-600 dark:text-gray-400 text-xs">설명</th>
							</tr>
						</thead>
						<tbody className="divide-y divide-gray-100 dark:divide-gray-800">
							{[
								{ c: 'Table', h: '<table>', d: '가로 스크롤 컨테이너로 감싼 표 루트' },
								{ c: 'TableHeader', h: '<thead>', d: '헤더 영역' },
								{ c: 'TableBody', h: '<tbody>', d: '데이터 행 영역' },
								{ c: 'TableFooter', h: '<tfoot>', d: '합계 등 마무리 행 (배경/굵기 강조)' },
								{ c: 'TableRow', h: '<tr>', d: 'hover · data-state=selected 강조 내장' },
								{ c: 'TableHead', h: '<th>', d: '헤더 셀 (좌측 정렬 · 굵기 기본)' },
								{ c: 'TableCell', h: '<td>', d: '데이터 셀' },
								{ c: 'TableCaption', h: '<caption>', d: '표 하단 설명 캡션' },
							].map((row, i) => (
								<tr
									key={i}
									className="hover:bg-gray-50/50 dark:hover:bg-gray-800/30 transition-colors"
								>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-violet-700 dark:text-violet-400">{row.c}</code>
									</td>
									<td className="px-4 py-2.5">
										<code className="text-xs font-mono text-blue-700 dark:text-blue-400">{row.h}</code>
									</td>
									<td className="px-4 py-2.5 text-xs text-gray-600 dark:text-gray-400">{row.d}</td>
								</tr>
							))}
						</tbody>
					</table>
				</div>
				<p className="text-xs text-gray-500 dark:text-gray-400 leading-relaxed">
					모든 구성요소는 대응 HTML 요소의 모든 속성(<code className="font-mono">colSpan</code>,{' '}
					<code className="font-mono">rowSpan</code>, <code className="font-mono">onClick</code> 등)과{' '}
					<code className="font-mono">className</code> 을 그대로 받습니다.
				</p>
			</section>
		</div>
	);
}
