import { useEffect, useState } from 'react';
import { Skeleton } from '@axiom/components/ui';
import styles from './TransactionListSkeleton.module.css';

/** 로딩이 끝난 뒤 보여줄 실제 거래 한 건 */
interface ITransaction {
	id: string;
	counterparty: string;
	memo: string;
	type: '입금' | '출금';
	amount: number;
	dateTime: string;
}

const TRANSACTIONS: ITransaction[] = [
	{ id: 'tx-1', counterparty: '(주)레드스카이', memo: '급여', type: '입금', amount: 3200000, dateTime: '07.17 09:05' },
	{ id: 'tx-2', counterparty: '김닉', memo: '월세 이체', type: '출금', amount: 850000, dateTime: '07.18 14:32' },
	{ id: 'tx-3', counterparty: '스타벅스 강남점', memo: '체크카드 승인', type: '출금', amount: 12800, dateTime: '07.15 20:14' },
	{ id: 'tx-4', counterparty: '이수취', memo: '경조사비', type: '입금', amount: 100000, dateTime: '07.12 11:47' },
];

function won(value: number): string {
	return value.toLocaleString('ko-KR');
}

/**
 * 거래내역 목록 로딩 스켈레톤 — 예제 목적.
 *
 * scaffold가 제공하는 Skeleton(@axiom/components/ui)을 "그대로 사용"하되,
 * 겉모습(펄스 → 좌우로 흐르는 shimmer, 색/모서리)은 같은 폴더의
 * TransactionListSkeleton.module.css 에서 [data-slot="skeleton"] 선택자로 오버라이드한다.
 *
 * 즉 "제공되는 Skeleton을 재사용하되, 퍼블리셔가 스타일만 프로젝트 톤(청록)으로
 * 갈아끼우는" 패턴의 예시다. 데이터 로딩이 끝나면 실제 목록으로 교체된다.
 */
export default function TransactionListSkeleton(): React.ReactNode {
	const [loading, setLoading] = useState(true);

	// 데모용: 마운트/재실행 시 1.8초간 로딩 상태를 보여준 뒤 실제 데이터로 전환한다.
	useEffect(() => {
		if (!loading) return;
		const t = setTimeout(() => setLoading(false), 1800);
		return () => clearTimeout(t);
	}, [loading]);

	return (
		<div className={styles.wrap}>
			<div className={styles.card}>
				<div className={styles.head}>
					<div className={styles.headTitle}>
						<span className={styles.mark}>NIC</span>
						<span>최근 거래내역</span>
					</div>
					<button
						type="button"
						className={styles.replay}
						onClick={() => setLoading(true)}
						disabled={loading}
					>
						{loading ? '불러오는 중…' : '다시 불러오기'}
					</button>
				</div>

				<ul className={styles.list}>
					{loading
						? // ── 로딩 상태: Skeleton 재사용(스타일만 module.css로 오버라이드) ──
							Array.from({ length: 4 }).map((_, i) => (
								<li
									key={i}
									className={styles.row}
								>
									<Skeleton className={styles.avatar} />
									<div className={styles.rowMain}>
										<Skeleton className={styles.lineTitle} />
										<Skeleton className={styles.lineSub} />
									</div>
									<div className={styles.rowSide}>
										<Skeleton className={styles.lineAmount} />
										<Skeleton className={styles.lineDate} />
									</div>
								</li>
							))
						: // ── 로딩 완료: 실제 거래 목록 ──
							TRANSACTIONS.map((tx) => {
								const isIn = tx.type === '입금';
								return (
									<li
										key={tx.id}
										className={styles.row}
									>
										<span className={`${styles.badge} ${isIn ? styles.badgeIn : styles.badgeOut}`}>{tx.type}</span>
										<div className={styles.rowMain}>
											<span className={styles.counterparty}>{tx.counterparty}</span>
											<span className={styles.memo}>{tx.memo}</span>
										</div>
										<div className={styles.rowSide}>
											<span className={`${styles.amount} ${isIn ? styles.amountIn : styles.amountOut}`}>
												{isIn ? '+' : '-'}
												{won(tx.amount)}원
											</span>
											<span className={styles.date}>{tx.dateTime}</span>
										</div>
									</li>
								);
							})}
				</ul>
			</div>
		</div>
	);
}
