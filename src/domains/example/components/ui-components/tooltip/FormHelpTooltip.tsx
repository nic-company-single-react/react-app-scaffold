import { useId } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger, Label, Input } from '@axiom/components/ui';
import { CircleHelp } from 'lucide-react';
import styles from './FormHelpTooltip.module.css';

/** 입력 항목 한 줄에 붙는 도움말 정의 */
interface IFieldHelp {
	key: string;
	label: string;
	placeholder: string;
	/** 도움말 말풍선 제목 */
	tipTitle: string;
	/** 도움말 말풍선 본문(여러 줄 가능) */
	tipDesc: string;
}

const FIELDS: IFieldHelp[] = [
	{
		key: 'limit',
		label: '1회 이체 한도',
		placeholder: '예: 10,000,000',
		tipTitle: '이체 한도란?',
		tipDesc: '보안등급에 따라 1회 최대 1,000만원까지 설정할 수 있습니다. 한도를 높이려면 추가 인증(OTP)이 필요합니다.',
	},
	{
		key: 'cms',
		label: 'CMS 출금일',
		placeholder: '예: 매월 25일',
		tipTitle: '출금일 안내',
		tipDesc: '지정한 날짜가 휴일인 경우 다음 영업일에 출금됩니다. 잔액이 부족하면 3영업일간 재출금을 시도합니다.',
	},
	{
		key: 'memo',
		label: '받는 분 통장 표시',
		placeholder: '최대 7자',
		tipTitle: '통장 표시 문구',
		tipDesc: '상대방 통장 거래내역에 남길 문구입니다. 미입력 시 내 이름이 그대로 표시됩니다.',
	},
];

/**
 * scaffold Tooltip 을 "폼 항목 도움말(? 아이콘)" 패턴으로 재스타일링한 실전 예제.
 *
 * 핵심은 컴포넌트를 새로 만들지 않았다는 점이다. @axiom/components/ui 의
 * Tooltip / TooltipContent / TooltipTrigger 를 그대로 쓰고, 말풍선 모양만
 * FormHelpTooltip.module.css 에서 덮어썼다.
 *
 * ⚠ TooltipContent 는 Portal 로 document.body 에 렌더되므로, 이 컴포넌트의
 *   .card 안에 있는 :global() 스코프로는 스타일이 닿지 않는다.
 *   그래서 module.css 클래스(styles.tip)를 TooltipContent 의 className 으로
 *   "직접 전달"한다. 퍼블리셔는 이 .module.css 만 수정하면 된다.
 */
export default function FormHelpTooltip(): React.ReactNode {
	const uid = useId();

	return (
		// 이 컴포넌트만 복사해도 동작하도록 자체 Provider 를 둔다(중첩 Provider 허용).
		<TooltipProvider delayDuration={150}>
			<div className={styles.card}>
				<div className={styles.head}>
					<div className={styles.title}>자동이체 등록</div>
					<div className={styles.subtitle}>각 항목의 물음표에 마우스를 올리면 상세 안내가 표시됩니다.</div>
				</div>

				<div className={styles.list}>
					{FIELDS.map((f) => {
						const id = `${uid}-${f.key}`;
						return (
							<div
								key={f.key}
								className={styles.field}
							>
								<div className={styles.labelRow}>
									<Label
										htmlFor={id}
										className={styles.label}
									>
										{f.label}
									</Label>

									<Tooltip>
										<TooltipTrigger asChild>
											{/* type="button" 으로 폼 제출을 막는다 */}
											<button
												type="button"
												className={styles.help}
												aria-label={`${f.label} 도움말`}
											>
												<CircleHelp size={15} />
											</button>
										</TooltipTrigger>
										<TooltipContent
											className={styles.tip}
											side="top"
											align="start"
											sideOffset={6}
										>
											<div className={styles.tipTitle}>{f.tipTitle}</div>
											<p className={styles.tipDesc}>{f.tipDesc}</p>
										</TooltipContent>
									</Tooltip>
								</div>

								<Input
									id={id}
									placeholder={f.placeholder}
								/>
							</div>
						);
					})}
				</div>

				<div className={styles.footnote}>등록 후 최초 1회 출금까지 영업일 기준 2~3일이 소요됩니다.</div>
			</div>
		</TooltipProvider>
	);
}
