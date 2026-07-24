import { useState } from 'react';
import { ToggleGroup, ToggleGroupItem } from '@axiom/components/ui';
import { LayoutList, LayoutGrid, Columns3 } from 'lucide-react';
import styles from './ViewModeToggleGroup.module.css';

type ViewMode = 'list' | 'grid' | 'kanban';

const ITEMS: { id: string; title: string; sub: string }[] = [
	{ id: 'PRJ-1042', title: '오픈뱅킹 정산 배치', sub: '진행 중 · 담당 김하늘' },
	{ id: 'PRJ-1043', title: '비대면 실명확인 개선', sub: '검토 · 담당 이도윤' },
	{ id: 'PRJ-1051', title: 'MyData 스코프 확장', sub: '대기 · 담당 박서진' },
	{ id: 'PRJ-1067', title: '이상거래 탐지 룰셋', sub: '진행 중 · 담당 정민' },
];

/**
 * scaffold가 제공하는 ToggleGroup(@axiom/components/ui)을 "그대로 사용"하면서
 * CSS Module로 완전히 다른 세그먼트 컨트롤(pill segmented control)로 재스타일링한 예제.
 *
 * 재스타일링 포인트:
 *   ToggleGroup / ToggleGroupItem 은 내부 요소마다 data-slot 을 노출한다.
 *     - [data-slot="toggle-group"]        : 트랙(래퍼)
 *     - [data-slot="toggle-group-item"]   : 각 세그먼트 버튼
 *     - [data-state="on"]                 : 선택된 세그먼트(radix가 자동 부여)
 *   래퍼(.wrap) 아래에서 이 슬롯들을 선택자로 오버라이드해 Tailwind 기본 스타일을 덮어쓴다.
 *   (SI 프로젝트에서 퍼블리셔가 토글 스타일을 갈아끼우는 실제 방식을 그대로 보여준다.)
 */
export default function ViewModeToggleGroup(): React.ReactNode {
	const [mode, setMode] = useState<ViewMode>('list');

	return (
		<div className={styles.wrap}>
			<div className={styles.bar}>
				<span className={styles.barLabel}>보기 방식</span>

				{/* value / onValueChange 로 제어. 빈 값(선택 해제) 방지를 위해 값이 있을 때만 반영 */}
				<ToggleGroup
					type="single"
					value={mode}
					onValueChange={(v) => v && setMode(v as ViewMode)}
					className={styles.group}
				>
					<ToggleGroupItem
						value="list"
						aria-label="리스트 보기"
						className={styles.item}
					>
						<LayoutList />
						리스트
					</ToggleGroupItem>
					<ToggleGroupItem
						value="grid"
						aria-label="카드 보기"
						className={styles.item}
					>
						<LayoutGrid />
						카드
					</ToggleGroupItem>
					<ToggleGroupItem
						value="kanban"
						aria-label="칸반 보기"
						className={styles.item}
					>
						<Columns3 />
						칸반
					</ToggleGroupItem>
				</ToggleGroup>
			</div>

			{/* 선택된 보기 방식에 따라 미리보기 레이아웃이 바뀐다 */}
			<div className={`${styles.preview} ${styles[mode]}`}>
				{ITEMS.map((it) => (
					<article
						key={it.id}
						className={styles.card}
					>
						<span className={styles.cardId}>{it.id}</span>
						<span className={styles.cardTitle}>{it.title}</span>
						<span className={styles.cardSub}>{it.sub}</span>
					</article>
				))}
			</div>
		</div>
	);
}
