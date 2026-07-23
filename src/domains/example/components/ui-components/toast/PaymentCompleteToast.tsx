import { CheckCircle2, ChevronRight, X } from 'lucide-react';
import styles from './PaymentCompleteToast.module.css';

export interface IPaymentCompleteToastProps {
	/** 가맹점(결제처) 이름 */
	merchant: string;
	/** 결제 금액(원) */
	amount: number;
	/** 결제 시각 표기(예: '오후 2:31') */
	time?: string;
	/** '상세 보기' 클릭 */
	onDetail?: () => void;
	/** 닫기(X) 클릭 — 보통 toast.dismiss(id) 를 넘긴다 */
	onClose?: () => void;
}

/**
 * "결제 완료" 브랜드 토스트 카드.
 *
 * 핵심: 이 컴포넌트는 sonner의 기본 토스트 골격을 쓰지 않고, `toast.custom(() => <PaymentCompleteToast/>)`
 * 으로 렌더된다. 즉 토스트 내부 DOM 전체를 이 .tsx 가 소유하므로, 스타일도 co-location 규칙 그대로
 * 바로 옆 PaymentCompleteToast.module.css 로 분리했다.
 *
 * 왜 이 방식인가 — sonner의 <Toaster/> 는 앱 전역에 하나만 뜨는 싱글톤이고 토스트 DOM은 body로 portal
 * 되므로, 아코디언/스위치처럼 "페이지 옆 module.css" 로는 특정 페이지 토스트만 다르게 꾸밀 수 없다.
 * 완전히 다른 톤앤매너가 필요하면 toast.custom 으로 콘텐츠를 직접 그리는 이 패턴이 정석이다.
 * 퍼블리셔는 .tsx 는 손대지 않고 이 .module.css 만 수정하면 된다.
 */
export default function PaymentCompleteToast({
	merchant,
	amount,
	time,
	onDetail,
	onClose,
}: IPaymentCompleteToastProps): React.ReactNode {
	return (
		<div
			className={styles.card}
			role="status"
		>
			<span className={styles.icon}>
				<CheckCircle2 size={20} />
			</span>

			<div className={styles.body}>
				<div className={styles.head}>
					<span className={styles.title}>결제가 완료되었어요</span>
					{time && <span className={styles.time}>{time}</span>}
				</div>
				<div className={styles.desc}>
					<span className={styles.merchant}>{merchant}</span>
					<span className={styles.dot}>·</span>
					<span className={styles.amount}>{amount.toLocaleString('ko-KR')}원</span>
				</div>

				<button
					type="button"
					className={styles.detail}
					onClick={onDetail}
				>
					상세 내역 보기
					<ChevronRight size={14} />
				</button>
			</div>

			<button
				type="button"
				className={styles.close}
				onClick={onClose}
				aria-label="닫기"
			>
				<X size={15} />
			</button>
		</div>
	);
}
