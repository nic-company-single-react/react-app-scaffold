import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
} from '@axiom/components/ui';
import { ChevronDown, User, CreditCard, Settings, Users, LifeBuoy, LogOut } from 'lucide-react';
import styles from './AccountMenu.module.css';

/**
 * 실전 예제 — 계정(프로필) 드롭다운 메뉴.
 *
 * shadcn 기본 dropdown-menu 컴포넌트를 **그대로 쓰되**, 스타일은 co-located
 * `AccountMenu.module.css` 로 전면 재정의했습니다. 퍼블리셔가 실제 프로젝트에서
 * dropdown-menu 를 자사 디자인에 맞게 재스킨하는 흐름을 보여주는 예제입니다.
 *
 * 포인트
 * - Trigger 는 `asChild` 로 커스텀 아바타 칩 버튼을 그대로 사용한다.
 * - Content / Item / Separator 에 module.css 클래스를 넘겨 기본 톤을 덮어쓴다.
 * - 상단 프로필 헤더는 컴포넌트가 제공하지 않는 순수 커스텀 마크업이다.
 */
export default function AccountMenu(): React.ReactNode {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger asChild>
				<button
					type="button"
					className={styles.trigger}
				>
					<span className={styles.triggerAvatar}>김</span>
					<span className={styles.triggerName}>김개발</span>
					<ChevronDown className={styles.triggerChevron} />
				</button>
			</DropdownMenuTrigger>

			<DropdownMenuContent
				align="end"
				sideOffset={8}
				className={styles.root}
			>
				{/* 상단 프로필 헤더 — 순수 커스텀 마크업 */}
				<div className={styles.header}>
					<div className={styles.avatar}>김</div>
					<div className={styles.userMeta}>
						<div className={styles.userName}>김개발</div>
						<div className={styles.userMail}>dev.kim@example.com</div>
					</div>
					<span className={styles.plan}>PRO</span>
				</div>

				{/* 항목 영역 */}
				<div className={styles.body}>
					<DropdownMenuItem className={styles.item}>
						<User />내 프로필
						<span className={styles.shortcut}>⇧⌘P</span>
					</DropdownMenuItem>
					<DropdownMenuItem className={styles.item}>
						<CreditCard />
						결제 및 구독
					</DropdownMenuItem>
					<DropdownMenuItem className={styles.item}>
						<Users />팀 관리
					</DropdownMenuItem>
					<DropdownMenuItem className={styles.item}>
						<Settings />
						환경 설정
						<span className={styles.shortcut}>⌘,</span>
					</DropdownMenuItem>

					<DropdownMenuSeparator className={styles.separator} />

					<DropdownMenuItem className={styles.item}>
						<LifeBuoy />
						고객 지원
					</DropdownMenuItem>

					<DropdownMenuSeparator className={styles.separator} />

					<DropdownMenuItem className={`${styles.item} ${styles.danger}`}>
						<LogOut />
						로그아웃
						<span className={styles.shortcut}>⇧⌘Q</span>
					</DropdownMenuItem>
				</div>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
