import { ShieldAlert } from 'lucide-react';
import styles from './SecurityAlertToast.module.css';

export interface ISecurityAlertToastProps {
	/** 접속 위치(예: '서울, 대한민국') */
	location: string;
	/** 접속 기기/브라우저(예: 'Windows · Chrome') */
	device: string;
	/** 접속 시각 표기(예: '방금 전') */
	time?: string;
	/** '내가 맞아요'(승인) 클릭 */
	onApprove?: () => void;
	/** '차단하기' 클릭 */
	onBlock?: () => void;
}

/**
 * "새 기기 로그인 감지" 보안 경고 토스트.
 *
 * PaymentCompleteToast 와 동일한 방식(toast.custom)으로 렌더되지만, SecurityAlertToast.module.css 만
 * 바꿔 위험(레드/앰버) 톤으로 완전히 다르게 입혔고 동작도 다르다 — 자동으로 닫히지 않고(duration: Infinity)
 * 사용자가 '승인' 또는 '차단' 을 눌러야 사라지는 확인형(action) 토스트다.
 *
 * 두 버튼의 실제 처리(토스트 닫기 + 후속 토스트)는 이 카드가 아니라 호출부(페이지)에서 주입한다.
 * 카드는 표현만, 로직은 호출부 — 재사용 컴포넌트의 기본 원칙이다.
 */
export default function SecurityAlertToast({
	location,
	device,
	time,
	onApprove,
	onBlock,
}: ISecurityAlertToastProps): React.ReactNode {
	return (
		<div
			className={styles.card}
			role="alertdialog"
			aria-label="새 기기 로그인 감지"
		>
			<div className={styles.top}>
				<span className={styles.icon}>
					<ShieldAlert size={20} />
				</span>
				<div className={styles.body}>
					<div className={styles.title}>새 기기에서 로그인했어요</div>
					<div className={styles.desc}>본인이 맞는지 확인해 주세요. 모르는 접속이면 즉시 차단하세요.</div>

					<dl className={styles.meta}>
						<div className={styles.metaRow}>
							<dt>위치</dt>
							<dd>{location}</dd>
						</div>
						<div className={styles.metaRow}>
							<dt>기기</dt>
							<dd>{device}</dd>
						</div>
						{time && (
							<div className={styles.metaRow}>
								<dt>시각</dt>
								<dd>{time}</dd>
							</div>
						)}
					</dl>
				</div>
			</div>

			<div className={styles.actions}>
				<button
					type="button"
					className={styles.block}
					onClick={onBlock}
				>
					차단하기
				</button>
				<button
					type="button"
					className={styles.approve}
					onClick={onApprove}
				>
					내가 맞아요
				</button>
			</div>
		</div>
	);
}
