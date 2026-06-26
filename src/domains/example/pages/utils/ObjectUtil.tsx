import { useMemo, useState } from 'react';
import { Link } from 'react-router';
import { Braces, ArrowLeft, TriangleAlert, Search, X } from 'lucide-react';

// 자동 생성 데모 카드
import UtilFunctionDemo from '@/domains/example/components/utils/UtilFunctionDemo';

// 타입 정의 파일(단일 출처)을 그대로 읽어 함수 목록을 자동 생성
import typeSource from '@/types/common/index.ts?raw';
import { parseFunctionDocs } from '@/domains/example/common/utils/parseFunctionDocs';

/* ────────────────────────────────────────────────────────────
 * $util.object 함수 목록
 * IObjectUtil 인터페이스(설명 + @demo 예시값 + 시그니처)에서 완전 자동으로 추출합니다.
 * 객체/배열 인자는 JSON 문자열로 입력합니다. (데모 카드가 JSON.parse 합니다)
 * ──────────────────────────────────────────────────────────── */
const NS = '$util.object';
const objectFns = parseFunctionDocs(typeSource, 'IObjectUtil');

export default function ObjectUtil(): React.ReactNode {
	const scrollToFn = (id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	};

	/* ── 목록 ↔ 실제 구현 동기화 검사 ─────────────────────────── */
	const documented = objectFns.map((f) => f.name);
	const implemented = Object.keys($util.object);
	const missing = implemented.filter((name) => !documented.includes(name));
	const stale = documented.filter((name) => !implemented.includes(name));
	const hasMismatch = missing.length > 0 || stale.length > 0;

	/* ── 검색 ──────────────────────────────────────────────────── */
	const [query, setQuery] = useState('');
	const filteredFns = useMemo(() => {
		const q = query.trim().toLowerCase();
		if (!q) return objectFns;
		return objectFns.filter(
			(fn) =>
				fn.name.toLowerCase().includes(q) ||
				fn.desc.toLowerCase().includes(q) ||
				fn.signature.toLowerCase().includes(q),
		);
	}, [query]);
	const noResult = filteredFns.length === 0;

	return (
		<div className="p-6">
			<div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_260px]">
				{/* 좌측: 헤더 + 검색 + 인터랙티브 데모 */}
				<div className="max-w-3xl space-y-8">
					<div className="space-y-3">
						<Link
							to="/example/utils"
							className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
						>
							<ArrowLeft className="size-3.5" />
							유틸리티 목록으로
						</Link>
						<div className="flex items-center gap-3">
							<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
								<Braces className="size-5 text-indigo-600 dark:text-indigo-400" />
							</div>
							<div>
								<h1 className="text-2xl font-bold text-gray-900 dark:text-white">object 유틸</h1>
								<p className="text-sm text-gray-500 dark:text-gray-400">
									<code className="rounded border border-indigo-300/50 bg-indigo-100/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
										$util.object
									</code>{' '}
									의 객체 가공 함수들을 직접 실행해 볼 수 있습니다. (객체/배열은 JSON으로 입력)
								</p>
							</div>
						</div>
					</div>
					<div className="relative">
						<Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-gray-400 dark:text-gray-500" />
						<input
							type="text"
							value={query}
							onChange={(e) => setQuery(e.target.value)}
							placeholder="함수명 또는 설명으로 검색 (예: 병합)"
							className="w-full rounded-xl border border-gray-200 bg-white py-2.5 pl-9 pr-9 text-sm text-gray-900 shadow-sm transition-colors placeholder:text-gray-400 focus:border-indigo-400 focus:outline-none focus:ring-2 focus:ring-indigo-100 dark:border-gray-800 dark:bg-gray-900 dark:text-white dark:placeholder:text-gray-500 dark:focus:ring-indigo-900/40"
						/>
						{query && (
							<button
								type="button"
								onClick={() => setQuery('')}
								aria-label="검색어 지우기"
								className="absolute right-2.5 top-1/2 -translate-y-1/2 rounded-md p-1 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 dark:hover:bg-gray-800 dark:hover:text-gray-300"
							>
								<X className="size-4" />
							</button>
						)}
					</div>

					{noResult ? (
						<div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
							<Search className="mx-auto size-6 text-gray-400 dark:text-gray-500" />
							<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">
								<code className="font-mono font-semibold text-gray-700 dark:text-gray-300">{query}</code>
								에 해당하는 함수가 없습니다.
							</p>
						</div>
					) : (
						filteredFns.map((doc) => (
							<UtilFunctionDemo
								key={doc.id}
								doc={doc}
								ns={NS}
								impl={$util.object as unknown as Record<string, (...args: never[]) => unknown>}
							/>
						))
					)}
				</div>

				{/* 우측: 전체 함수 목록 (sticky) */}
				<aside className="hidden lg:block">
					<div className="sticky top-24 flex max-h-[calc(100vh-7rem)] flex-col space-y-3">
						<p className="px-1 text-xs font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
							object 함수 목록
						</p>

						{hasMismatch && (
							<div className="space-y-1.5 rounded-xl border border-amber-300 bg-amber-50 p-3 dark:border-amber-700/60 dark:bg-amber-900/20">
								<div className="flex items-center gap-1.5 text-xs font-semibold text-amber-700 dark:text-amber-400">
									<TriangleAlert className="size-3.5" />
									구현과 목록이 다릅니다
								</div>
								{missing.length > 0 && (
									<p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-300/90">
										데모 누락: <code className="font-mono font-semibold">{missing.join(', ')}</code> — $util.object에는
										있지만 목록에 없습니다. (JSDoc 누락 가능)
									</p>
								)}
								{stale.length > 0 && (
									<p className="text-[11px] leading-relaxed text-amber-700 dark:text-amber-300/90">
										오래된 항목: <code className="font-mono font-semibold">{stale.join(', ')}</code> — 목록에는 있지만
										구현에서 사라졌습니다. 제거해 주세요.
									</p>
								)}
							</div>
						)}

						<nav className="min-h-0 flex-1 space-y-1 overflow-y-auto rounded-2xl border border-gray-200 bg-white p-2 shadow-sm dark:border-gray-800 dark:bg-gray-900">
							{noResult && (
								<p className="px-3 py-2 text-xs text-gray-400 dark:text-gray-500">검색 결과가 없습니다.</p>
							)}
							{filteredFns.map((fn) => {
								const isStale = stale.includes(fn.name);
								return (
									<button
										key={fn.id}
										type="button"
										onClick={() => scrollToFn(fn.id)}
										className="group block w-full rounded-lg px-3 py-2 text-left transition-colors hover:bg-indigo-50 dark:hover:bg-indigo-900/20"
									>
										<span className="flex items-center gap-1.5">
											<code className="font-mono text-sm font-semibold text-gray-800 group-hover:text-indigo-700 dark:text-gray-200 dark:group-hover:text-indigo-300">
												{fn.name}
											</code>
											{isStale && (
												<span className="rounded bg-amber-100 px-1 py-0.5 text-[10px] font-medium text-amber-700 dark:bg-amber-900/40 dark:text-amber-400">
													구현 없음
												</span>
											)}
										</span>
										<p className="mt-0.5 text-xs leading-snug text-gray-500 dark:text-gray-400">{fn.desc}</p>
									</button>
								);
							})}
						</nav>
						<p className="px-1 text-[11px] leading-relaxed text-gray-400 dark:text-gray-500">
							{query
								? `검색 결과 ${filteredFns.length} / ${objectFns.length}개`
								: '함수명을 누르면 해당 데모로 이동합니다.'}
						</p>
					</div>
				</aside>
			</div>
		</div>
	);
}
