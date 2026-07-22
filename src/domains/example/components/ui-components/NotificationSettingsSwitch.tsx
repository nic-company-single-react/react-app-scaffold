import { useId, useState } from 'react';
import { Switch, Label } from '@axiom/components/ui';
import { BellRing, MessageSquareText, Mail, Smartphone } from 'lucide-react';
import styles from './NotificationSettingsSwitch.module.css';

/** 알림 설정 한 줄 */
interface INotiItem {
	key: string;
	title: string;
	desc: string;
	icon: React.ReactNode;
	/** 마스터 스위치(전체 알림)가 꺼지면 함께 잠기는 항목인지 */
	child?: boolean;
	disabled?: boolean;
}

const ITEMS: INotiItem[] = [
	{
		key: 'push',
		title: '앱 푸시 알림',
		desc: '입출금 · 결제 승인 내역을 실시간으로 받습니다.',
		icon: <Smartphone size={17} />,
		child: true,
	},
	{
		key: 'sms',
		title: 'SMS 알림',
		desc: '건당 20원의 통신 요금이 부과될 수 있습니다.',
		icon: <MessageSquareText size={17} />,
		child: true,
	},
	{
		key: 'email',
		title: '이메일 리포트',
		desc: '매월 1일 지난달 지출 리포트를 보내드립니다.',
		icon: <Mail size={17} />,
		child: true,
	},
	{
		key: 'marketing',
		title: '마케팅 정보 수신',
		desc: '약관 개정 전까지 변경할 수 없습니다.',
		icon: <BellRing size={17} />,
		child: true,
		disabled: true,
	},
];

/**
 * scaffold Switch를 "설정 리스트(iOS 설정 앱 스타일)"로 재스타일링한 알림 설정 예제.
 *
 * 핵심은 컴포넌트를 새로 만들지 않았다는 점이다. @axiom/components/ui 의
 * Switch / Label 을 그대로 쓰고, 모양만 NotificationSettingsSwitch.module.css 에서
 * data-slot 선택자로 덮어썼다.
 * 퍼블리셔는 이 .module.css 만 수정하면 되고 .tsx 는 손대지 않아도 된다.
 *
 * 동작: 맨 위 마스터 스위치를 끄면 하위 항목이 모두 잠긴다(disabled).
 * 마스터의 checked 값은 하위 값들로부터 파생하지 않고 별도 상태로 둔다 —
 * 껐다 다시 켰을 때 사용자가 켜뒀던 개별 설정이 그대로 복원되어야 하기 때문이다.
 */
export default function NotificationSettingsSwitch(): React.ReactNode {
	const uid = useId();
	const [master, setMaster] = useState(true);
	const [values, setValues] = useState<Record<string, boolean>>({
		push: true,
		sms: false,
		email: true,
		marketing: false,
	});

	const onCount = master ? ITEMS.filter((it) => values[it.key]).length : 0;

	return (
		<div className={styles.wrap}>
			<div className={styles.sheet}>
				<div className={styles.head}>
					<div className={styles.title}>알림 설정</div>
					<div className={styles.subtitle}>
						{master ? `${ITEMS.length}개 중 ${onCount}개 사용 중` : '전체 알림이 꺼져 있습니다'}
					</div>
				</div>

				{/* 마스터 스위치 — 강조된 배너 형태 */}
				<div className={`${styles.master} ${master ? styles.masterOn : ''}`}>
					<span className={styles.masterIcon}>
						<BellRing size={18} />
					</span>
					<span className={styles.masterBody}>
						<Label
							htmlFor={`${uid}-master`}
							className={styles.masterTitle}
						>
							전체 알림
						</Label>
						<span className={styles.masterDesc}>끄면 아래 알림이 모두 잠깁니다.</span>
					</span>
					<Switch
						id={`${uid}-master`}
						checked={master}
						onCheckedChange={setMaster}
					/>
				</div>

				{/* 개별 항목 리스트 */}
				<ul className={styles.list}>
					{ITEMS.map((it) => {
						const id = `${uid}-${it.key}`;
						const locked = !master || it.disabled;
						return (
							<li
								key={it.key}
								className={`${styles.row} ${locked ? styles.rowLocked : ''}`}
							>
								<span className={styles.rowIcon}>{it.icon}</span>
								<span className={styles.rowBody}>
									<Label
										htmlFor={id}
										className={styles.rowTitle}
									>
										{it.title}
									</Label>
									<span className={styles.rowDesc}>{it.desc}</span>
								</span>
								<Switch
									id={id}
									checked={master && values[it.key]}
									disabled={locked}
									onCheckedChange={(v) => setValues((prev) => ({ ...prev, [it.key]: v }))}
								/>
							</li>
						);
					})}
				</ul>

				<div className={styles.footnote}>변경 사항은 즉시 저장됩니다.</div>
			</div>
		</div>
	);
}
