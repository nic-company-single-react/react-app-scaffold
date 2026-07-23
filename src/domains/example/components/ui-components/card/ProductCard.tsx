import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@axiom/components/ui';
import styles from './ProductCard.module.css';

interface IProduct {
	id: string;
	emoji: string;
	name: string;
	brand: string;
	price: number;
	originPrice?: number;
	rating: number;
	reviewCount: number;
	soldOut?: boolean;
}

const PRODUCTS: IProduct[] = [
	{
		id: 'p1',
		emoji: '🎧',
		name: '노이즈 캔슬링 무선 헤드폰 (오버이어)',
		brand: 'SOUNDWAVE',
		price: 189000,
		originPrice: 259000,
		rating: 4.8,
		reviewCount: 1204,
	},
	{
		id: 'p2',
		emoji: '⌚',
		name: '스마트 워치 5세대 44mm 블랙',
		brand: 'TIMEX LAB',
		price: 329000,
		rating: 4.6,
		reviewCount: 863,
	},
	{
		id: 'p3',
		emoji: '⌨️',
		name: '무접점 기계식 키보드 87키 저소음 적축',
		brand: 'KEYCRAFT',
		price: 148000,
		originPrice: 179000,
		rating: 4.9,
		reviewCount: 2317,
	},
	{
		id: 'p4',
		emoji: '🖱️',
		name: '인체공학 버티컬 무선 마우스',
		brand: 'ERGOMOUS',
		price: 59000,
		rating: 4.3,
		reviewCount: 412,
		soldOut: true,
	},
];

const won = (n: number): string => n.toLocaleString('ko-KR');

/**
 * 커머스 상품 카드 목록.
 *
 * scaffold가 제공하는 Card(@axiom/components/ui)를 그대로 사용하되,
 * 스타일은 ProductCard.module.css에서 `[data-slot="card-*"]` 선택자로 전부 덮어썼다.
 * 컴포넌트 구조(JSX)는 건드리지 않고 CSS만으로 톤을 바꾸는 방식이라,
 * 실제 SI 프로젝트에서 퍼블리셔가 디자인을 갈아끼울 때 이 패턴을 그대로 쓰면 된다.
 */
export default function ProductCard(): React.ReactNode {
	const [liked, setLiked] = useState<string[]>(['p1']);
	const [cart, setCart] = useState<string[]>([]);

	const toggleLike = (id: string): void =>
		setLiked((prev) => (prev.includes(id) ? prev.filter((v) => v !== id) : [...prev, id]));

	const addToCart = (id: string): void => setCart((prev) => (prev.includes(id) ? prev : [...prev, id]));

	return (
		<div className={styles.wrap}>
			<div className={styles.grid}>
				{PRODUCTS.map((p) => {
					const discount = p.originPrice ? Math.round((1 - p.price / p.originPrice) * 100) : 0;

					return (
						<Card key={p.id}>
							{/* 썸네일 — Card 안의 임의 영역도 자유롭게 넣을 수 있다 */}
							<div className={styles.thumb}>
								<span aria-hidden>{p.emoji}</span>
								{discount > 0 && !p.soldOut && <span className={styles.ribbon}>{discount}% SALE</span>}
								{p.soldOut && <span className={styles.soldout}>SOLD OUT</span>}
							</div>

							<CardHeader>
								<CardDescription>{p.brand}</CardDescription>
								<CardTitle>{p.name}</CardTitle>
							</CardHeader>

							<CardContent>
								<div className={styles.priceRow}>
									<span className={styles.price}>{won(p.price)}원</span>
									{p.originPrice && <span className={styles.origin}>{won(p.originPrice)}원</span>}
									{discount > 0 && <span className={styles.discount}>{discount}%</span>}
								</div>
								<div className={styles.meta}>
									<span className={styles.star}>★ {p.rating.toFixed(1)}</span>
									<span className={styles.dot}>|</span>
									<span>리뷰 {won(p.reviewCount)}</span>
								</div>
							</CardContent>

							<CardFooter>
								<button
									type="button"
									className={styles.buyBtn}
									disabled={p.soldOut}
									onClick={() => addToCart(p.id)}
								>
									{p.soldOut ? '품절' : cart.includes(p.id) ? '담김 ✓' : '장바구니'}
								</button>
								<button
									type="button"
									aria-label={liked.includes(p.id) ? '찜 해제' : '찜하기'}
									aria-pressed={liked.includes(p.id)}
									className={`${styles.likeBtn} ${liked.includes(p.id) ? styles.likeBtnOn : ''}`}
									onClick={() => toggleLike(p.id)}
								>
									{liked.includes(p.id) ? '♥' : '♡'}
								</button>
							</CardFooter>
						</Card>
					);
				})}
			</div>

			<div className={styles.cartBar}>
				<span>
					장바구니 <span className={styles.cartCount}>{cart.length}</span>개 · 찜{' '}
					<span className={styles.cartCount}>{liked.length}</span>개
				</span>
				<span>Card 컴포넌트는 그대로, 스타일만 CSS Module로 교체했습니다.</span>
			</div>
		</div>
	);
}
