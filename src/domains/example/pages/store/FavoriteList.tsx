import { Link } from 'react-router';
import { Heart, HeartOff, ArrowLeft, Trash2, X } from 'lucide-react';
import { Button, Card } from '@axiom/components/ui';
import { useFavoritesStore } from '@/domains/example/store/favoritesStore';

/**
 * [사용 페이지] 다른 페이지(담기 페이지)에서 저장한 즐겨찾기를 스토어에서 읽어 보여준다.
 * 이 페이지는 상품 마스터를 몰라도 되고, 오직 useFavoritesStore 만 구독한다.
 */
export default function FavoriteList(): React.ReactNode {
	// 필요한 상태·액션을 한 줄로 구조분해. (set 이 일어날 때만 리렌더된다)
	const { items, remove, clear } = useFavoritesStore();

	const total = items.reduce((sum, i) => sum + i.price, 0);

	return (
		<div className="p-6">
			<div className="mx-auto max-w-3xl space-y-8">
				{/* ── 헤더 ─────────────────────────────────────────────── */}
				<div className="space-y-3">
					<Link
						to="/example/store/catalog"
						className="inline-flex items-center gap-1 text-xs text-gray-500 transition-colors hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
					>
						<ArrowLeft className="size-3.5" />
						담기 페이지로
					</Link>
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-rose-50 dark:bg-rose-900/20">
							<Heart className="size-5 fill-rose-500 text-rose-500" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">즐겨찾기 목록</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								담기 페이지에서 저장한 값을{' '}
								<code className="rounded border border-rose-300/50 bg-rose-100/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-rose-800 dark:border-rose-600/40 dark:bg-rose-900/30 dark:text-rose-300">
									useFavoritesStore
								</code>{' '}
								에서 읽어옵니다.
							</p>
						</div>
					</div>
				</div>

				{items.length === 0 ? (
					/* ── 비어 있을 때 ─────────────────────────────────── */
					<div className="rounded-2xl border border-dashed border-gray-300 bg-gray-50 px-6 py-12 text-center dark:border-gray-700 dark:bg-gray-900/40">
						<HeartOff className="mx-auto size-6 text-gray-400 dark:text-gray-500" />
						<p className="mt-3 text-sm text-gray-500 dark:text-gray-400">아직 담은 즐겨찾기가 없습니다.</p>
						<Button
							size="sm"
							variant="outline"
							className="mt-4"
							asChild
						>
							<Link to="/example/store/catalog">담으러 가기</Link>
						</Button>
					</div>
				) : (
					<>
						{/* ── 목록 ─────────────────────────────────────────── */}
						<div className="space-y-2">
							{items.map((item) => (
								<Card
									key={item.id}
									size="sm"
									className="flex-row items-center justify-between p-4"
								>
									<div className="flex items-center gap-3">
										<span className="text-2xl">{item.emoji}</span>
										<div>
											<p className="font-medium text-gray-900 dark:text-white">{item.name}</p>
											<p className="text-xs text-gray-500 dark:text-gray-400">
												{item.price.toLocaleString()}원
											</p>
										</div>
									</div>
									<Button
										type="button"
										variant="ghost"
										size="icon-sm"
										aria-label={`${item.name} 제거`}
										onClick={() => remove(item.id)}
									>
										<X className="text-gray-400" />
									</Button>
								</Card>
							))}
						</div>

						{/* ── 합계 + 전체 비우기 ───────────────────────────── */}
						<div className="flex items-center justify-between border-t border-gray-200 pt-4 dark:border-gray-800">
							<p className="text-sm text-gray-600 dark:text-gray-300">
								합계{' '}
								<span className="font-semibold text-gray-900 dark:text-white">
									{total.toLocaleString()}원
								</span>{' '}
								<span className="text-gray-400">({items.length}개)</span>
							</p>
							<Button
								type="button"
								variant="destructive"
								size="sm"
								onClick={clear}
							>
								<Trash2 className="size-4" /> 전체 비우기
							</Button>
						</div>
					</>
				)}

				{/* ── 안내 ─────────────────────────────────────────────── */}
				<div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-xs leading-relaxed text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
					이 페이지는 담기 페이지와 <span className="font-semibold">같은 스토어</span>를 공유합니다. 새로고침 후
					다시 들어와도 <code className="font-mono">persist</code> 덕분에 목록이 그대로 남아 있습니다.
				</div>
			</div>
		</div>
	);
}
