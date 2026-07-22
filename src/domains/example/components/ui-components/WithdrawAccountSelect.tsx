import { useState } from 'react';
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectLabel,
	SelectSeparator,
	SelectTrigger,
	SelectValue,
} from '@axiom/components/ui';
import styles from './WithdrawAccountSelect.module.css';

/** 출금 가능 계좌 한 건 */
interface IAccount {
	value: string;
	group: '입출금 계좌' | '증권/기타';
	name: string;
	no: string;
	balance: number;
	main?: boolean;
	disabled?: boolean;
}

const ACCOUNTS: IAccount[] = [
	{ value: 'a1', group: '입출금 계좌', name: '자유입출금통장', no: '110-234-567890', balance: 3_482_100, main: true },
	{ value: 'a2', group: '입출금 계좌', name: '급여통장', no: '110-998-112233', balance: 1_205_000 },
	{ value: 'a3', group: '입출금 계좌', name: '생활비통장', no: '110-771-004455', balance: 84_300 },
	{ value: 'b1', group: '증권/기타', name: '종합매매계좌', no: '55-1234-5678', balance: 12_900_000 },
	{
		value: 'b2',
		group: '증권/기타',
		name: '청약예금 (출금불가)',
		no: '110-000-778899',
		balance: 2_000_000,
		disabled: true,
	},
];

const TRANSFER_AMOUNT = 350_000;

const won = (n: number) => n.toLocaleString() + '원';

/**
 * scaffold Select 를 은행 이체 화면의 "출금 계좌 선택"으로 재스타일링한 예제.
 *
 * 컴포넌트를 새로 만들지 않았다. @axiom/components/ui 의 Select 계열을 그대로 쓰고,
 * 모양만 WithdrawAccountSelect.module.css 에서 덮어썼다.
 * 퍼블리셔는 이 .module.css 만 수정하면 되고 .tsx 는 손대지 않아도 된다.
 *
 * 이 예제가 보여주는 3가지 실전 포인트
 *  1. SelectContent 는 Portal 로 body 직속에 렌더된다.
 *     → 래퍼 하위 선택자로는 안 잡히므로 className 을 "직접" 넘겨야 한다.
 *  2. SelectItem 의 children 은 전부 ItemText 안에 들어가므로, 항목을 2줄 카드로
 *     만들면 트리거에도 그 2줄이 그대로 복제된다.
 *     → SelectValue 에 children 을 주면 트리거 표시를 따로 그릴 수 있다.
 *  3. 선택 상태/열림 상태는 radix 가 data-state 속성으로 알려준다.
 *     (트리거: data-state="open", 항목: data-state="checked", data-highlighted)
 */
export default function WithdrawAccountSelect(): React.ReactNode {
	const [account, setAccount] = useState<string>('');
	const selected = ACCOUNTS.find((a) => a.value === account);
	const enough = (selected?.balance ?? 0) >= TRANSFER_AMOUNT;

	return (
		<div className={styles.wrap}>
			<div className={styles.sheet}>
				<div className={styles.head}>
					<div className={styles.title}>계좌 이체</div>
					<div className={styles.subtitle}>이체금액 {won(TRANSFER_AMOUNT)} · 출금할 계좌를 선택하세요.</div>
				</div>

				<div className={styles.field}>
					<span className={styles.fieldLabel}>출금 계좌</span>
					<Select
						value={account}
						onValueChange={setAccount}
					>
						<SelectTrigger
							className={styles.trigger}
							aria-label="출금 계좌 선택"
						>
							{/* SelectValue 에 children 을 주면 트리거 표시를 직접 그린다.
							    (children 이 없으면 선택된 항목의 ItemText 가 그대로 복제된다) */}
							<SelectValue placeholder={<span className={styles.valuePlaceholder}>출금 계좌를 선택하세요</span>}>
								<span className={styles.valueBox}>
									<span className={styles.valueName}>{selected?.name}</span>
									<span className={styles.valueSub}>
										{selected?.no} · 잔액 {won(selected?.balance ?? 0)}
									</span>
								</span>
							</SelectValue>
						</SelectTrigger>

						{/* position="popper" → 트리거 바로 아래에 붙는다(기본값 item-aligned 는 선택 항목 위에 겹침) */}
						<SelectContent
							className={styles.content}
							position="popper"
							sideOffset={6}
						>
							{(['입출금 계좌', '증권/기타'] as const).map((group, gi) => (
								<SelectGroup key={group}>
									{gi > 0 && <SelectSeparator className={styles.separator} />}
									<SelectLabel className={styles.groupLabel}>{group}</SelectLabel>
									{ACCOUNTS.filter((a) => a.group === group).map((a) => (
										<SelectItem
											key={a.value}
											value={a.value}
											disabled={a.disabled}
											className={styles.item}
										>
											<span className={styles.itemBody}>
												<span className={styles.itemTop}>
													{a.name}
													{a.main && <span className={styles.itemBadge}>주거래</span>}
												</span>
												<span className={styles.itemSub}>
													{a.no} · 잔액 {won(a.balance)}
												</span>
											</span>
										</SelectItem>
									))}
								</SelectGroup>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className={styles.summary}>
					<span>
						{selected ? (enough ? '이체 후 잔액' : '잔액이 부족합니다') : '계좌를 선택하면 잔액이 표시됩니다'}
					</span>
					<span className={styles.summaryValue}>
						{selected && enough ? won(selected.balance - TRANSFER_AMOUNT) : '-'}
					</span>
				</div>

				<button
					type="button"
					className={styles.submit}
					disabled={!selected || !enough}
				>
					{won(TRANSFER_AMOUNT)} 이체하기
				</button>
			</div>
		</div>
	);
}
