import { useState } from 'react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@axiom/components/ui';
import { Bold, Italic, Underline, Link2, List, Image, Code2, type LucideIcon } from 'lucide-react';
import styles from './ToolbarTooltip.module.css';

/** 툴바 버튼 한 개 정의 */
interface ITool {
	key: string;
	label: string;
	icon: LucideIcon;
	/** 단축키 조각들 — kbd 로 렌더된다 */
	keys: string[];
	/** 켜짐/꺼짐 토글되는 버튼인지 */
	toggle?: boolean;
}

const TOOLS: ITool[] = [
	{ key: 'bold', label: '굵게', icon: Bold, keys: ['Ctrl', 'B'], toggle: true },
	{ key: 'italic', label: '기울임', icon: Italic, keys: ['Ctrl', 'I'], toggle: true },
	{ key: 'underline', label: '밑줄', icon: Underline, keys: ['Ctrl', 'U'], toggle: true },
	{ key: 'link', label: '링크 삽입', icon: Link2, keys: ['Ctrl', 'K'] },
	{ key: 'list', label: '목록', icon: List, keys: ['Ctrl', 'Shift', '8'] },
	{ key: 'image', label: '이미지', icon: Image, keys: ['Ctrl', 'Shift', 'I'] },
	{ key: 'code', label: '코드 블록', icon: Code2, keys: ['Ctrl', 'E'] },
];

/**
 * scaffold Tooltip 을 "에디터 툴바 + 단축키 안내" 패턴으로 재스타일링한 실전 예제.
 *
 * 앞선 FormHelpTooltip 과 똑같은 @axiom/components/ui Tooltip 을 쓰지만,
 * ToolbarTooltip.module.css 만 바꿔 완전히 다른 톤(다크 글래스 + kbd 칩)으로 만들었다.
 * 즉 "말풍선 스타일은 소비처마다 .module.css 로 갈아끼운다"는 것을 보여준다.
 *
 * TooltipContent 는 Portal 로 렌더되므로, 여기서도 styles.tip 를 className 으로 직접 넘긴다.
 */
export default function ToolbarTooltip(): React.ReactNode {
	const [active, setActive] = useState<Record<string, boolean>>({ bold: true });

	return (
		// 툴바는 반응이 빨라야 하므로 지연을 짧게 준다.
		<TooltipProvider delayDuration={120}>
			<div className={styles.wrap}>
				<div className={styles.toolbar}>
					{TOOLS.map((t) => {
						const Icon = t.icon;
						const on = t.toggle && active[t.key];
						return (
							<Tooltip key={t.key}>
								<TooltipTrigger asChild>
									<button
										type="button"
										aria-label={t.label}
										aria-pressed={t.toggle ? Boolean(on) : undefined}
										className={`${styles.toolBtn} ${on ? styles.toolBtnOn : ''}`}
										onClick={() => t.toggle && setActive((p) => ({ ...p, [t.key]: !p[t.key] }))}
									>
										<Icon size={17} />
									</button>
								</TooltipTrigger>
								<TooltipContent
									className={styles.tip}
									side="bottom"
									sideOffset={8}
								>
									<span className={styles.tipLabel}>{t.label}</span>
									<span className={styles.kbdGroup}>
										{t.keys.map((k) => (
											<kbd
												key={k}
												className={styles.kbd}
											>
												{k}
											</kbd>
										))}
									</span>
								</TooltipContent>
							</Tooltip>
						);
					})}
				</div>
				<div className={styles.caption}>버튼에 마우스를 올리면 이름과 단축키가 표시됩니다. 굵게·기울임·밑줄은 토글됩니다.</div>
			</div>
		</TooltipProvider>
	);
}
