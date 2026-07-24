import { useState } from 'react';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@axiom/components/ui';
import { Search, X, CornerDownLeft } from 'lucide-react';
import styles from './SearchBarInputGroup.module.css';

/**
 * 실전 예제 — 통합 검색 바.
 *
 * 제공 `InputGroup` 계열(@axiom/components/ui) 을 **그대로** 쓰되, `className` 에 CSS Module 클래스를
 * 넘겨 shadcn 기본 스타일(높이 32px · 각진 사각 · 얇은 테두리)을 전혀 다른 톤
 * (높이 52px · 알약형 · 소프트 포커스 글로우 · 키보드 힌트)으로 덮어쓴다.
 *
 * 실제 SI 프로젝트에서 퍼블리셔가 InputGroup 룩앤필을 바꾸는 전형적인 방식이다.
 * - `InputGroup` 래퍼 자체에 `className={styles.group}` 를 주면 테두리·높이·모서리·포커스 링이 통째로 바뀐다.
 * - Addon/Button/Input 각각에도 CSS Module 클래스를 넘겨 색·간격을 맞춘다.
 * - 입력값이 있을 때만 우측에 지우기 버튼을 노출하고, Esc 로도 비운다.
 */
export default function SearchBarInputGroup(): React.ReactNode {
	const [query, setQuery] = useState('');

	const clear = () => setQuery('');

	return (
		<div className={styles.wrap}>
			<InputGroup className={styles.group}>
				<InputGroupAddon className={styles.leadIcon}>
					<Search />
				</InputGroupAddon>

				<InputGroupInput
					className={styles.input}
					placeholder="주문번호, 상품명, 고객명으로 검색"
					value={query}
					onChange={(e) => setQuery(e.target.value)}
					onKeyDown={(e) => {
						if (e.key === 'Escape') clear();
					}}
				/>

				<InputGroupAddon
					align="inline-end"
					className={styles.tail}
				>
					{query ? (
						<InputGroupButton
							size="icon-xs"
							className={styles.clearBtn}
							aria-label="검색어 지우기"
							onClick={clear}
						>
							<X />
						</InputGroupButton>
					) : (
						<InputGroupText className={styles.kbd}>
							<kbd>
								<CornerDownLeft />
								Enter
							</kbd>
						</InputGroupText>
					)}
				</InputGroupAddon>
			</InputGroup>

			<p className={styles.hint}>
				{query ? (
					<>
						<b>“{query}”</b> 검색 준비됨 — Enter 로 검색, Esc 로 지우기
					</>
				) : (
					'검색어를 입력해 보세요. 스타일은 CSS Module 로만 덮어썼습니다.'
				)}
			</p>
		</div>
	);
}
