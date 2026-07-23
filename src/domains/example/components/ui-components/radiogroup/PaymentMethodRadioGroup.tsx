import { useId, useState } from 'react';
import { RadioGroup, RadioGroupItem, Label } from '@axiom/components/ui';
import { CreditCard, Landmark, Smartphone, Wallet } from 'lucide-react';
import styles from './PaymentMethodRadioGroup.module.css';

/** 결제수단 한 건 */
interface IPayMethod {
	value: string;
	title: string;
	desc: string;
	icon: React.ReactNode;
	fee: number;
	disabled?: boolean;
}

const METHODS: IPayMethod[] = [
	{
		value: 'card',
		title: '신용/체크카드',
		desc: '국내 전 카드사 / 무이자 할부 가능',
		icon: <CreditCard size={18} />,
		fee: 0,
	},
	{ value: 'transfer', title: '실시간 계좌이체', desc: '은행 앱 없이 바로 이체', icon: <Landmark size={18} />, fee: 0 },
	{
		value: 'phone',
		title: '휴대폰 소액결제',
		desc: '통신요금과 함께 청구 (월 한도 적용)',
		icon: <Smartphone size={18} />,
		fee: 300,
	},
	{
		value: 'point',
		title: '포인트 결제',
		desc: '보유 포인트 부족 — 사용할 수 없습니다',
		icon: <Wallet size={18} />,
		fee: 0,
		disabled: true,
	},
];

const AMOUNT = 128_000;

/**
 * scaffold RadioGroup을 "선택 가능한 카드" 형태로 재스타일링한 결제수단 선택 예제.
 *
 * 핵심은 컴포넌트를 새로 만들지 않았다는 점이다. @axiom/components/ui 의
 * RadioGroup / RadioGroupItem / Label 을 그대로 쓰고, 모양만
 * PaymentMethodRadioGroup.module.css 에서 data-slot 선택자로 덮어썼다.
 * 퍼블리셔는 이 .module.css 만 수정하면 되고 .tsx 는 손대지 않아도 된다.
 *
 * 접근성: 카드 전체를 <Label htmlFor>로 감싸 어디를 눌러도 선택된다.
 * 선택 여부는 상태값과 비교해 .optionOn 클래스로 표현한다(라디오 원형 자체의
 * 선택 표시는 radix가 data-state="checked" 로 처리).
 */
export default function PaymentMethodRadioGroup(): React.ReactNode {
	const uid = useId();
	const [method, setMethod] = useState<string>('card');
	const selected = METHODS.find((m) => m.value === method);
	const total = AMOUNT + (selected?.fee ?? 0);

	return (
		<div className={styles.wrap}>
			<div className={styles.sheet}>
				<div className={styles.head}>
					<div className={styles.title}>결제수단 선택</div>
					<div className={styles.subtitle}>
						주문금액 {AMOUNT.toLocaleString()}원 · 결제수단에 따라 수수료가 달라집니다.
					</div>
				</div>

				<RadioGroup
					value={method}
					onValueChange={setMethod}
				>
					{METHODS.map((m) => {
						const id = `${uid}-${m.value}`;
						return (
							<Label
								key={m.value}
								htmlFor={id}
								className={[
									styles.option,
									method === m.value && !m.disabled ? styles.optionOn : '',
									m.disabled ? styles.optionDisabled : '',
								]
									.filter(Boolean)
									.join(' ')}
							>
								<RadioGroupItem
									id={id}
									value={m.value}
									disabled={m.disabled}
								/>
								<span className={styles.optionBody}>
									<span className={styles.optionTitle}>{m.title}</span>
									<span className={styles.optionDesc}>
										{m.desc}
										{m.fee > 0 && ` · 수수료 ${m.fee.toLocaleString()}원`}
									</span>
								</span>
								<span className={styles.optionIcon}>{m.icon}</span>
							</Label>
						);
					})}
				</RadioGroup>

				<div className={styles.summary}>
					<span>
						{selected?.title} · 수수료 {(selected?.fee ?? 0).toLocaleString()}원
					</span>
					<span className={styles.summaryValue}>총 {total.toLocaleString()}원</span>
				</div>
			</div>
		</div>
	);
}
