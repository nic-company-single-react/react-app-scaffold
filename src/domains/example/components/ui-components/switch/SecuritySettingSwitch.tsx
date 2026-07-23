import { useId, useState } from 'react';
import { Switch, Label, Button } from '@axiom/components/ui';
import { Globe2, Clock4, Fingerprint, ShieldAlert } from 'lucide-react';
import styles from './SecuritySettingSwitch.module.css';

/** 보안 설정 한 건 */
interface ISecurityItem {
	key: string;
	title: string;
	desc: string;
	icon: React.ReactNode;
	/** 끄면 위험한 항목 — 끈 상태에서 경고를 노출한다 */
	risky?: boolean;
}

const ITEMS: ISecurityItem[] = [
	{
		key: 'overseaIp',
		title: '해외 IP 접속 차단',
		desc: '국내 IP에서만 로그인할 수 있습니다.',
		icon: <Globe2 size={17} />,
		risky: true,
	},
	{
		key: 'delayTransfer',
		title: '지연 이체 서비스',
		desc: '100만원 이상 이체 시 3시간 후에 입금됩니다.',
		icon: <Clock4 size={17} />,
	},
	{
		key: 'bio',
		title: '생체 인증 로그인',
		desc: '지문 · 얼굴 인식으로 로그인합니다.',
		icon: <Fingerprint size={17} />,
	},
];

type TValues = Record<string, boolean>;

const INITIAL: TValues = { overseaIp: true, delayTransfer: false, bio: true };

/**
 * scaffold Switch를 "ON / OFF 글자가 트랙 안에 들어가는 보안 설정 폼"으로
 * 재스타일링한 예제.
 *
 * 여기서도 컴포넌트는 새로 만들지 않았다. @axiom/components/ui 의 Switch / Label /
 * Button 을 그대로 쓰고, 트랙 안의 ON/OFF 글자까지 SecuritySettingSwitch.module.css 의
 * ::before / ::after 가상 요소로 만들었다. .tsx 는 그대로 두고 .module.css 만
 * 바꾸면 전혀 다른 디자인이 된다.
 *
 * 앞의 알림 설정 예제(즉시 저장)와 달리 이쪽은 "저장 버튼을 눌러야 반영"되는 폼이다.
 * 저장 전 값(draft)과 저장된 값(saved)을 나눠 들고 있어 변경 여부(dirty)를 계산한다.
 */
export default function SecuritySettingSwitch(): React.ReactNode {
	const uid = useId();
	const [saved, setSaved] = useState<TValues>(INITIAL);
	const [draft, setDraft] = useState<TValues>(INITIAL);

	const dirty = ITEMS.some((it) => draft[it.key] !== saved[it.key]);
	const warned = ITEMS.filter((it) => it.risky && !draft[it.key]);

	return (
		<div className={styles.wrap}>
			<form
				className={styles.sheet}
				onSubmit={(e) => {
					e.preventDefault();
					setSaved(draft);
				}}
			>
				<div className={styles.head}>
					<div className={styles.title}>보안 설정</div>
					<div className={styles.subtitle}>변경 후 하단의 저장 버튼을 눌러야 반영됩니다.</div>
				</div>

				<ul className={styles.list}>
					{ITEMS.map((it) => {
						const id = `${uid}-${it.key}`;
						const changed = draft[it.key] !== saved[it.key];
						return (
							<li
								key={it.key}
								className={`${styles.row} ${draft[it.key] ? styles.rowOn : ''}`}
							>
								<span className={styles.rowIcon}>{it.icon}</span>
								<span className={styles.rowBody}>
									<span className={styles.rowTitleLine}>
										<Label
											htmlFor={id}
											className={styles.rowTitle}
										>
											{it.title}
										</Label>
										{changed && <span className={styles.badge}>변경됨</span>}
									</span>
									<span className={styles.rowDesc}>{it.desc}</span>
								</span>
								<Switch
									id={id}
									name={it.key}
									checked={draft[it.key]}
									onCheckedChange={(v) => setDraft((prev) => ({ ...prev, [it.key]: v }))}
								/>
							</li>
						);
					})}
				</ul>

				{warned.length > 0 && (
					<div className={styles.warning}>
						<ShieldAlert size={16} />
						<span>
							<b>{warned.map((w) => w.title).join(', ')}</b> 이(가) 꺼져 있습니다. 계정 도용 위험이 높아질 수 있습니다.
						</span>
					</div>
				)}

				<div className={styles.actions}>
					<Button
						type="button"
						variant="outline"
						size="sm"
						disabled={!dirty}
						onClick={() => setDraft(saved)}
					>
						되돌리기
					</Button>
					<Button
						type="submit"
						size="sm"
						disabled={!dirty}
					>
						{dirty ? '변경사항 저장' : '저장됨'}
					</Button>
				</div>
			</form>
		</div>
	);
}
