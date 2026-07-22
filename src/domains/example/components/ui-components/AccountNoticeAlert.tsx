import { useState } from 'react';
import { Alert, AlertAction, AlertDescription, AlertTitle, Button } from '@axiom/components/ui';
import { CircleAlert, CircleCheck, Info, ShieldAlert, X } from 'lucide-react';
import styles from './AccountNoticeAlert.module.css';

/** 알림 톤(= 실무에서 흔히 쓰는 4단계) */
type TNoticeTone = 'info' | 'success' | 'warning' | 'danger';

interface INotice {
	id: string;
	tone: TNoticeTone;
	title: string;
	description: string;
	/** 우측 액션 버튼 라벨(없으면 액션 미표시) */
	actionLabel?: string;
}

const TONE_ICON: Record<TNoticeTone, React.ReactNode> = {
	info: <Info />,
	success: <CircleCheck />,
	warning: <CircleAlert />,
	danger: <ShieldAlert />,
};

const INITIAL_NOTICES: INotice[] = [
	{
		id: 'n1',
		tone: 'danger',
		title: '해외 IP에서 로그인이 감지되었습니다',
		description: '2026-07-21 23:41 · 싱가포르(203.0.113.24). 본인이 아니라면 즉시 비밀번호를 변경하세요.',
		actionLabel: '조치',
	},
	{
		id: 'n2',
		tone: 'warning',
		title: '공동인증서 만료 12일 전',
		description: '만료 후에는 이체·조회 서비스 이용이 제한됩니다. 미리 갱신해 주세요.',
		actionLabel: '갱신',
	},
	{
		id: 'n3',
		tone: 'success',
		title: '자동이체 등록이 완료되었습니다',
		description: '매월 25일 · 월세 850,000원 · 국민 123-45-6789 계좌에서 출금됩니다.',
	},
	{
		id: 'n4',
		tone: 'info',
		title: '7월 26일(일) 02:00~06:00 시스템 점검',
		description: '점검 시간 동안 인터넷뱅킹 및 모바일뱅킹 이용이 일시 중단됩니다.',
		actionLabel: '자세히',
	},
];

/**
 * 실전 예제 — 계좌 알림 센터.
 *
 * scaffold가 제공하는 Alert / AlertTitle / AlertDescription / AlertAction(@axiom/components/ui)을
 * 그대로 사용하되, *.module.css 에서 data-slot 선택자를 오버라이드해 기본(default/destructive)
 * 2가지 variant를 넘어 info / success / warning / danger 4가지 톤으로 확장한 패턴이다.
 *
 * 닫기(dismiss)와 액션 클릭까지 실제로 동작한다.
 */
export default function AccountNoticeAlert(): React.ReactNode {
	const [notices, setNotices] = useState<INotice[]>(INITIAL_NOTICES);
	const [lastAction, setLastAction] = useState<string>('');

	const dismiss = (id: string) => setNotices((prev) => prev.filter((n) => n.id !== id));

	return (
		<div className={styles.wrap}>
			<div className={styles.head}>
				<span className={styles.headTitle}>알림 센터</span>
				<span className={styles.headCount}>{notices.length}건</span>
			</div>

			<div className={styles.list}>
				{notices.length === 0 && <p className={styles.empty}>확인하지 않은 알림이 없습니다.</p>}

				{notices.map((n) => (
					<Alert
						key={n.id}
						data-tone={n.tone}
						className={styles.notice}
					>
						{TONE_ICON[n.tone]}
						<AlertTitle>{n.title}</AlertTitle>
						<AlertDescription>{n.description}</AlertDescription>
						<AlertAction className={styles.action}>
							{n.actionLabel && (
								<Button
									type="button"
									size="xs"
									variant="ghost"
									onClick={() => setLastAction(`${n.title} → ${n.actionLabel}`)}
								>
									{n.actionLabel}
								</Button>
							)}
							<Button
								type="button"
								size="icon-xs"
								variant="ghost"
								aria-label="알림 닫기"
								onClick={() => dismiss(n.id)}
							>
								<X />
							</Button>
						</AlertAction>
					</Alert>
				))}
			</div>

			<div className={styles.foot}>
				<span className={styles.footLog}>{lastAction ? `최근 액션: ${lastAction}` : '액션 버튼을 눌러보세요.'}</span>
				<Button
					type="button"
					size="sm"
					variant="outline"
					onClick={() => {
						setNotices(INITIAL_NOTICES);
						setLastAction('');
					}}
				>
					초기화
				</Button>
			</div>
		</div>
	);
}
