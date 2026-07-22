import { useState } from 'react';
import {
	Card,
	CardHeader,
	CardTitle,
	CardDescription,
	CardAction,
	CardContent,
	CardFooter,
} from '@axiom/components/ui';
import styles from './AccountSummaryCard.module.css';

interface IAccount {
	id: string;
	icon: string;
	name: string;
	no: string;
	balance: number;
}

const MAIN_ACCOUNT = {
	name: 'NIC 주거래 입출금통장',
	no: '110-482-***-921',
	balance: 12_487_300,
	yesterdayDiff: 320_000,
};

const ACCOUNTS: IAccount[] = [
	{ id: 'a1', icon: '💧', name: '수시입출금 통장', no: '110-482-***-921', balance: 12_487_300 },
	{ id: 'a2', icon: '🏦', name: '정기예금 12개월', no: '221-900-***-118', balance: 30_000_000 },
	{ id: 'a3', icon: '🌱', name: '주택청약종합저축', no: '337-051-***-407', balance: 4_200_000 },
	{ id: 'a4', icon: '💳', name: '신용카드 결제계좌', no: '110-482-***-004', balance: -862_450 },
];

const won = (n: number): string => n.toLocaleString('ko-KR');

/**
 * 뱅킹 계좌 요약 카드.
 *
 * ProductCard와 마찬가지로 scaffold Card를 구조 변경 없이 그대로 쓰고,
 * AccountSummaryCard.module.css에서 `[data-slot="card-*"]`만 덮어써 다른 톤을 만들었다.
 * 한 페이지에 서로 다른 두 스킨이 공존할 수 있도록, 카드마다 스킨 클래스(.hero / .list)를
 * className으로 붙이고 CSS에서 `.wrap .hero [data-slot='card-title']` 처럼 스코프를 좁혔다.
 */
export default function AccountSummaryCard(): React.ReactNode {
	const [visible, setVisible] = useState(true);

	return (
		<div className={styles.wrap}>
			{/* ── 대표 계좌 (히어로 스킨) ─────────────────────── */}
			<Card className={styles.hero}>
				<CardHeader>
					<CardTitle>{MAIN_ACCOUNT.name}</CardTitle>
					<CardDescription>{MAIN_ACCOUNT.no}</CardDescription>
					<CardAction>
						<button
							type="button"
							className={styles.eyeBtn}
							onClick={() => setVisible((v) => !v)}
						>
							{visible ? '금액 숨기기' : '금액 보기'}
						</button>
					</CardAction>
				</CardHeader>

				<CardContent>
					<div className={styles.balance}>
						<span className={`${styles.balanceNum} ${visible ? '' : styles.balanceHidden}`}>
							{visible ? won(MAIN_ACCOUNT.balance) : '•••••••'}
						</span>
						<span className={styles.balanceUnit}>원</span>
					</div>
					<div className={styles.subLine}>
						어제보다 {visible ? `+${won(MAIN_ACCOUNT.yesterdayDiff)}원` : '•••'} · 출금가능{' '}
						{visible ? `${won(MAIN_ACCOUNT.balance)}원` : '•••'}
					</div>
				</CardContent>

				<CardFooter>
					<div className={styles.heroActions}>
						{['이체', '거래내역', '계좌관리'].map((label) => (
							<button
								key={label}
								type="button"
								className={styles.heroAction}
							>
								{label}
							</button>
						))}
					</div>
				</CardFooter>
			</Card>

			{/* ── 전체 계좌 목록 (리스트 스킨) ─────────────────── */}
			<Card className={styles.list}>
				<CardHeader>
					<CardTitle>내 계좌 ({ACCOUNTS.length})</CardTitle>
					<CardAction>
						<button
							type="button"
							className={styles.moreBtn}
						>
							전체보기 ›
						</button>
					</CardAction>
				</CardHeader>

				<CardContent>
					{ACCOUNTS.map((a) => (
						<div
							key={a.id}
							className={styles.row}
						>
							<span
								className={styles.rowIcon}
								aria-hidden
							>
								{a.icon}
							</span>
							<div className={styles.rowMain}>
								<div className={styles.rowName}>{a.name}</div>
								<div className={styles.rowNo}>{a.no}</div>
							</div>
							<div className={`${styles.rowAmount} ${a.balance < 0 ? styles.amountOut : styles.amountIn}`}>
								{visible ? `${won(a.balance)}원` : '•••••원'}
							</div>
						</div>
					))}
				</CardContent>

				<CardFooter>
					<span>총 자산 {visible ? `${won(ACCOUNTS.reduce((s, a) => s + a.balance, 0))}원` : '•••••원'}</span>
					<span>기준시각 09:41</span>
				</CardFooter>
			</Card>
		</div>
	);
}
