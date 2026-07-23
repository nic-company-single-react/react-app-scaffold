import { useState } from 'react';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
	Badge,
	Button,
	Checkbox,
} from '@axiom/components/ui';
import styles from './TermsAgreementAccordion.module.css';

/** 약관 한 건 */
interface ITerm {
	id: string;
	required: boolean;
	title: string;
	body: string;
}

const TERMS: ITerm[] = [
	{
		id: 'age',
		required: true,
		title: '만 19세 이상입니다',
		body: '본 서비스는 만 19세 이상의 실명 확인된 고객에 한하여 가입 및 이용이 가능합니다. 만 19세 미만인 경우 법정대리인의 동의 등 별도의 절차가 필요하며, 미성년자의 금융거래는 관련 법령에 따라 제한될 수 있습니다.',
	},
	{
		id: 'service',
		required: true,
		title: '서비스 이용약관 동의',
		body: '본 약관은 회사가 제공하는 전자금융 및 부가 서비스의 이용 조건과 절차, 회사와 이용자의 권리·의무 및 책임 사항을 규정합니다. 이용자는 서비스 이용 전 본 약관의 내용을 충분히 확인하였으며, 회원 가입 시 본 약관에 동의한 것으로 간주됩니다.',
	},
	{
		id: 'privacy',
		required: true,
		title: '개인정보 수집·이용 동의',
		body: '회사는 회원 식별 및 서비스 제공을 위해 성명, 생년월일, 연락처, 계좌정보 등을 수집·이용합니다. 수집한 개인정보는 관련 법령이 정한 기간 동안 보관되며, 목적 달성 후 지체 없이 파기합니다. 동의를 거부할 권리가 있으나, 필수 항목 미동의 시 서비스 가입이 제한됩니다.',
	},
	{
		id: 'finance',
		required: true,
		title: '전자금융거래 이용약관',
		body: '전자적 장치를 통한 자금 이체, 조회, 결제 등 전자금융거래의 처리 절차와 오류 정정, 접근매체의 관리 책임에 관한 사항을 규정합니다. 이용자는 접근매체를 제3자에게 대여·양도하거나 노출해서는 안 되며, 이를 위반하여 발생한 손해에 대해 책임을 부담할 수 있습니다.',
	},
	{
		id: 'marketing',
		required: false,
		title: '마케팅 정보 수신 동의',
		body: '신규 상품, 이벤트, 혜택 안내를 이메일·SMS·앱 푸시 등으로 받아보실 수 있습니다. 본 항목은 선택 사항이며 동의하지 않아도 서비스 이용에는 제한이 없습니다. 동의 후에도 마이페이지에서 언제든지 수신을 철회할 수 있습니다.',
	},
];

/**
 * 약관 동의 화면 — 예제 목적.
 *
 * 거래내역 예제(TransactionDetailAccordion)와 마찬가지로 scaffold가 제공하는
 * Accordion / Checkbox / Button / Badge(@axiom/components/ui)를 "그대로 사용"하되,
 * 겉모습은 같은 폴더의 TermsAgreementAccordion.module.css(CSS Module)로
 * 완전히 다른 톤(인디고 컨센트 UI)으로 data-slot 선택자를 통해 재스타일링한다.
 *
 * 배치 주의: scaffold Checkbox는 내부적으로 <button>이라, 같은 <button>인
 * AccordionTrigger '안'에 넣으면 button 중첩이 된다. 그래서 체크박스는
 * 트리거 '밖'(itemHead 그리드의 형제)에 두어 "체크 = 동의 토글 / 트리거 = 펼침"으로
 * 동작을 분리한다. (별도 stopPropagation 없이 클릭 영역 자체가 분리됨)
 */
export default function TermsAgreementAccordion(): React.ReactNode {
	const [agreed, setAgreed] = useState<Record<string, boolean>>({});

	const toggle = (id: string): void => setAgreed((prev) => ({ ...prev, [id]: !prev[id] }));

	const allChecked = TERMS.every((t) => agreed[t.id]);
	const requiredAllChecked = TERMS.filter((t) => t.required).every((t) => agreed[t.id]);

	const toggleAll = (): void => {
		const next = !allChecked;
		setAgreed(Object.fromEntries(TERMS.map((t) => [t.id, next])));
	};

	return (
		<div className={styles.wrap}>
			<div className={styles.sheet}>
				<div className={styles.head}>
					<h3 className={styles.title}>약관에 동의해 주세요</h3>
					<p className={styles.subtitle}>서비스 가입을 위해 아래 약관 확인이 필요합니다.</p>
				</div>

				{/* 전체 동의 히어로 — scaffold Checkbox 사용(아코디언 외부) */}
				<div className={`${styles.allAgree} ${allChecked ? styles.allAgreeOn : ''}`}>
					<Checkbox
						className={styles.checkLg}
						checked={allChecked}
						onCheckedChange={toggleAll}
						aria-label="전체 동의"
					/>
					<div
						className={styles.allAgreeText}
						role="presentation"
						onClick={toggleAll}
					>
						<span className={styles.allAgreeTitle}>전체 동의</span>
						<span className={styles.allAgreeDesc}>필수 및 선택 약관에 모두 동의합니다.</span>
					</div>
				</div>

				{/* scaffold 제공 Accordion — 스타일만 CSS Module로 오버라이드 */}
				<Accordion
					type="multiple"
					className={styles.list}
				>
					{TERMS.map((t) => {
						const on = !!agreed[t.id];
						return (
							<AccordionItem
								key={t.id}
								value={t.id}
							>
								{/* 체크박스(형제) + 트리거를 그리드로 나란히 둔다 */}
								<div className={styles.itemHead}>
									<Checkbox
										checked={on}
										onCheckedChange={() => toggle(t.id)}
										aria-label={`${t.title} 동의`}
									/>
									<AccordionTrigger>
										<span className={styles.row}>
											<Badge
												variant={t.required ? 'destructive' : 'secondary'}
												className={t.required ? styles.badgeReq : styles.badgeOpt}
											>
												{t.required ? '필수' : '선택'}
											</Badge>
											<span className={styles.rowTitle}>{t.title}</span>
										</span>
									</AccordionTrigger>
								</div>

								<AccordionContent>
									<div className={styles.body}>{t.body}</div>
								</AccordionContent>
							</AccordionItem>
						);
					})}
				</Accordion>

				<div className={styles.footer}>
					<Button
						type="button"
						disabled={!requiredAllChecked}
					>
						{requiredAllChecked ? '동의하고 계속하기' : '필수 약관에 동의해 주세요'}
					</Button>
				</div>
			</div>
		</div>
	);
}
