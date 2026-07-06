import { useMemo } from 'react';
import { Link } from 'react-router';
import { Heart, ArrowRight, Store } from 'lucide-react';
import { Button, Card, Badge } from '@axiom/components/ui';
import { useFavoritesStore, type IFavoriteItem } from '@/domains/example/store/favoritesStore';

/**
 * 데모용 상품 목록 (정적 데이터).
 * 서버 데이터가 아니므로 useApi 대상이 아니고, 화면에서만 쓰는 상수라 모듈 최상단에 둔다.
 */
const PRODUCTS: IFavoriteItem[] = [
	{ id: 'apple', name: '사과', emoji: '🍎', price: 1000 },
	{ id: 'banana', name: '바나나', emoji: '🍌', price: 800 },
	{ id: 'grape', name: '포도', emoji: '🍇', price: 3200 },
	{ id: 'peach', name: '복숭아', emoji: '🍑', price: 2500 },
	{ id: 'melon', name: '멜론', emoji: '🍈', price: 5400 },
	{ id: 'cherry', name: '체리', emoji: '🍒', price: 4800 },
];

/**
 * [저장 페이지] 상품 목록에서 하트를 눌러 즐겨찾기에 담는다.
 * 담는 값은 useFavoritesStore(Zustand) 에 저장되므로, 라우트를 옮겨도 유지된다.
 */
export default function FavoriteCatalog(): React.ReactNode {
	// 필요한 상태·액션을 한 줄로 구조분해. (set 이 일어날 때만 리렌더된다)
	const { items, toggle } = useFavoritesStore();

	// 빠른 조회를 위해 담긴 id 집합으로 변환
	const favoriteIds = useMemo(() => new Set(items.map((i) => i.id)), [items]);

	return (
		<div className="p-6">
			<div className="mx-auto max-w-3xl space-y-8">
				{/* ── 헤더 ─────────────────────────────────────────────── */}
				<div className="space-y-3">
					<div className="flex items-center gap-3">
						<div className="flex size-10 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20">
							<Store className="size-5 text-indigo-600 dark:text-indigo-400" />
						</div>
						<div>
							<h1 className="text-2xl font-bold text-gray-900 dark:text-white">즐겨찾기 담기</h1>
							<p className="text-sm text-gray-500 dark:text-gray-400">
								하트를 눌러 담으면{' '}
								<code className="rounded border border-indigo-300/50 bg-indigo-100/60 px-1.5 py-0.5 font-mono text-xs font-semibold text-indigo-800 dark:border-indigo-600/40 dark:bg-indigo-900/30 dark:text-indigo-300">
									useFavoritesStore
								</code>{' '}
								(Zustand)에 저장됩니다.
							</p>
						</div>
					</div>
				</div>

				{/* ── 담긴 개수 + 즐겨찾기 페이지로 이동 ─────────────────── */}
				<div className="flex items-center justify-between rounded-xl border border-gray-200 bg-gray-50 px-4 py-3 dark:border-gray-800 dark:bg-gray-900/40">
					<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-300">
						<Heart className="size-4 fill-rose-500 text-rose-500" />
						현재 <span className="font-semibold text-gray-900 dark:text-white">{items.length}</span>개 담김
					</div>
					<Button
						size="sm"
						asChild
					>
						<Link to="/example/store/favorites">
							즐겨찾기 보기 <ArrowRight className="size-4" />
						</Link>
					</Button>
				</div>

				{/* ── 상품 그리드 ──────────────────────────────────────── */}
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					{PRODUCTS.map((product) => {
						const isFav = favoriteIds.has(product.id);
						return (
							<Card
								key={product.id}
								size="sm"
								className="flex-row items-center justify-between p-4"
							>
								<div className="flex items-center gap-3">
									<span className="text-2xl">{product.emoji}</span>
									<div>
										<p className="font-medium text-gray-900 dark:text-white">{product.name}</p>
										<p className="text-xs text-gray-500 dark:text-gray-400">
											{product.price.toLocaleString()}원
										</p>
									</div>
								</div>
								<Button
									type="button"
									variant={isFav ? 'secondary' : 'outline'}
									size="icon-sm"
									aria-label={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
									aria-pressed={isFav}
									onClick={() => toggle(product)}
								>
									<Heart className={isFav ? 'fill-rose-500 text-rose-500' : 'text-gray-400'} />
								</Button>
							</Card>
						);
					})}
				</div>

				{/* ── 안내 ─────────────────────────────────────────────── */}
				<div className="rounded-xl border border-dashed border-gray-300 bg-white px-4 py-3 text-xs leading-relaxed text-gray-500 dark:border-gray-700 dark:bg-gray-900/40 dark:text-gray-400">
					담은 값은 스토어에 저장되어 <Badge variant="secondary">즐겨찾기 보기</Badge> 페이지에서 그대로 읽을 수
					있고, <code className="font-mono">persist</code> 설정 덕분에 새로고침해도 유지됩니다.
				</div>
			</div>
		</div>
	);
}
