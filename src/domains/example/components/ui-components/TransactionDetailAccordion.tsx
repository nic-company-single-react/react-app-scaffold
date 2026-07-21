import { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import styles from './TransactionDetailAccordion.module.css';

/** 거래 한 건의 상세 데이터 */
interface ITransaction {
	id: string;
	month: string; // 예: '07'
	day: string; // 예: '18'
	dateTime: string; // 거래일시
	counterparty: string; // 상대방(수취인/입금자)
	memo: string; // 적요
	type: '입금' | '출금';
	amount: number; // 거래금액
	afterBalance: number; // 거래후 잔액
	fee: number; // 수수료
	bankAccount: string; // 상대 은행/계좌
	channel: string; // 거래 채널
	approvalNo: string; // 승인/거래번호
}

const TRANSACTIONS: ITransaction[] = [
	{
		id: 'tx-1',
		month: '07',
		day: '18',
		dateTime: '2026.07.18 14:32:07',
		counterparty: '김하나',
		memo: '월세 이체',
		type: '출금',
		amount: 850000,
		afterBalance: 3241500,
		fee: 500,
		bankAccount: '하나은행 391-91****-52814',
		channel: '스마트폰뱅킹',
		approvalNo: 'A20260718143207',
	},
	{
		id: 'tx-2',
		month: '07',
		day: '17',
		dateTime: '2026.07.17 09:05:41',
		counterparty: '(주)레드스카이',
		memo: '급여',
		type: '입금',
		amount: 3200000,
		afterBalance: 4092000,
		fee: 0,
		bankAccount: '국민은행 8140-01-****-338',
		channel: '펌뱅킹',
		approvalNo: 'B20260717090541',
	},
	{
		id: 'tx-3',
		month: '07',
		day: '15',
		dateTime: '2026.07.15 20:14:55',
		counterparty: '스타벅스 강남점',
		memo: '체크카드 승인',
		type: '출금',
		amount: 12800,
		afterBalance: 892000,
		fee: 0,
		bankAccount: '하나체크카드 4012-****-****-7791',
		channel: '카드결제',
		approvalNo: 'C20260715201455',
	},
	{
		id: 'tx-4',
		month: '07',
		day: '12',
		dateTime: '2026.07.12 11:47:23',
		counterparty: '이수취',
		memo: '경조사비',
		type: '입금',
		amount: 100000,
		afterBalance: 904800,
		fee: 0,
		bankAccount: '신한은행 110-***-****21',
		channel: '인터넷뱅킹',
		approvalNo: 'D20260712114723',
	},
];

function won(value: number): string {
	return value.toLocaleString('ko-KR');
}

/**
 * 거래내역 상세 아코디언 — 하나은행 연금 페이지 톤(청록 브랜드)을 참조한 전용 디자인.
 * 스타일은 컴포넌트와 같은 이름·같은 폴더의 TransactionDetailAccordion.module.css(CSS Module)로 co-location.
 * 리스트에서 한 건을 펼치면 상세(수취인, 수수료, 거래후 잔액, 승인번호 등)가 열리는
 * 마스터-디테일 패턴이며, 한 번에 하나의 항목만 펼쳐진다.
 */
export default function TransactionDetailAccordion(): React.ReactNode {
	const [openId, setOpenId] = useState<string>('tx-1');

	return (
		<div className={styles.wrap}>
			<div className={styles.card}>
				<div className={styles.brandBar} />

				{/* 계좌 요약 헤더 */}
				<div className={styles.accountHead}>
					<div className={styles.accountInfo}>
						<div className={styles.accountMark}>HANA</div>
						<div>
							<div className={styles.accountAlias}>급여통장</div>
							<div className={styles.accountNo}>하나은행 391-910284-52814</div>
						</div>
					</div>
					<div className={styles.balanceBox}>
						<div className={styles.balanceLabel}>출금가능금액</div>
						<div className={styles.balanceValue}>
							3,241,500<small>원</small>
						</div>
					</div>
				</div>

				{/* 거래 리스트 */}
				<ul className={styles.list}>
					{TRANSACTIONS.map((tx) => {
						const isOpen = openId === tx.id;
						const isIn = tx.type === '입금';
						return (
							<li
								key={tx.id}
								className={styles.item}
							>
								<button
									type="button"
									className={styles.trigger}
									aria-expanded={isOpen}
									onClick={() => setOpenId((prev) => (prev === tx.id ? '' : tx.id))}
								>
									<span className={styles.dateBadge}>
										<span className={styles.m}>{tx.month}월</span>
										<span className={styles.d}>{tx.day}</span>
									</span>

									<span className={styles.summary}>
										<span className={styles.counterparty}>{tx.counterparty}</span>
										<span className={styles.memo}>{tx.memo}</span>
									</span>

									<span className={styles.amountBox}>
										<span className={`${styles.amount} ${isIn ? styles.amountIn : styles.amountOut}`}>
											{isIn ? '+' : '-'}
											{won(tx.amount)}원
										</span>
										<span className={styles.afterBalance}>잔액 {won(tx.afterBalance)}원</span>
									</span>

									<ChevronDown
										className={`${styles.chevron} ${isOpen ? styles.chevronOpen : ''}`}
										size={18}
										aria-hidden
									/>
								</button>

								{/* 상세 패널 */}
								<div className={`${styles.panel} ${isOpen ? styles.panelOpen : ''}`}>
									<div className={styles.panelInner}>
										<div className={styles.detail}>
											<div className={styles.detailGrid}>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>거래구분</span>
													<span className={styles.tag}>{tx.type}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>거래일시</span>
													<span className={styles.fieldValue}>{tx.dateTime}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>{isIn ? '입금자' : '수취인'}</span>
													<span className={styles.fieldValue}>{tx.counterparty}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>적요</span>
													<span className={styles.fieldValue}>{tx.memo}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>{isIn ? '보낸 계좌' : '받는 계좌'}</span>
													<span className={styles.fieldValue}>{tx.bankAccount}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>거래채널</span>
													<span className={styles.fieldValue}>{tx.channel}</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>수수료</span>
													<span className={styles.fieldValue}>{won(tx.fee)}원</span>
												</div>
												<div className={styles.field}>
													<span className={styles.fieldLabel}>거래후 잔액</span>
													<span className={styles.fieldValue}>{won(tx.afterBalance)}원</span>
												</div>
												<div className={`${styles.field} ${styles.fieldFull}`}>
													<span className={styles.fieldLabel}>승인번호</span>
													<span className={styles.fieldValue}>{tx.approvalNo}</span>
												</div>
											</div>
										</div>
									</div>
								</div>
							</li>
						);
					})}
				</ul>
			</div>
		</div>
	);
}
