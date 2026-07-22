import { useState } from 'react';
import {
	Button,
	Drawer,
	DrawerClose,
	DrawerContent,
	DrawerDescription,
	DrawerFooter,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@axiom/components/ui';
import { SlidersHorizontal } from 'lucide-react';
import styles from './OrderFilterDrawer.module.css';

const PERIODS = ['오늘', '1주일', '1개월', '3개월', '직접입력'] as const;
const TYPES = ['입금', '출금', '카드결제', '자동이체', '해외송금'] as const;
const AMOUNTS = ['전체', '1만원 이상', '10만원 이상', '100만원 이상'] as const;

type Period = (typeof PERIODS)[number];
type Amount = (typeof AMOUNTS)[number];

/** 적용 완료된 필터 값 */
interface IAppliedFilter {
	period: Period;
	types: string[];
	amount: Amount;
}

const INITIAL: IAppliedFilter = { period: '1개월', types: [], amount: '전체' };

/**
 * 실전 예제 — 거래내역 필터 바텀시트.
 *
 * scaffold Drawer(@axiom/components/ui)를 구조 변경 없이 그대로 쓰면서,
 * OrderFilterDrawer.module.css 의 data-slot 오버라이드만으로 앰버 톤 모바일 시트로 재스타일했다.
 *
 * 퍼블리셔가 눈여겨볼 점:
 *  - 시트는 Portal(document.body)로 빠지므로 페이지 래퍼(.wrap) 하위 선택자로는 닿지 않는다.
 *    시트 스타일은 DrawerContent 의 className(.sheet)을 기점으로 작성해야 한다.
 *  - 시트가 열려 있는 동안만 "임시 상태(draft)"로 편집하고, [적용]을 눌러야 실제 필터에 반영한다.
 *    (시트를 그냥 닫으면 편집 내용이 버려지는, 실제 앱에서 쓰는 동작)
 */
export default function OrderFilterDrawer(): React.ReactNode {
	const [open, setOpen] = useState(false);
	const [applied, setApplied] = useState<IAppliedFilter>(INITIAL);
	const [draft, setDraft] = useState<IAppliedFilter>(INITIAL);

	/** 시트를 열 때마다 현재 적용값을 draft 로 복사해 편집을 시작한다 */
	const handleOpenChange = (next: boolean) => {
		if (next) setDraft(applied);
		setOpen(next);
	};

	const toggleType = (t: string) => {
		setDraft((prev) => ({
			...prev,
			types: prev.types.includes(t) ? prev.types.filter((v) => v !== t) : [...prev.types, t],
		}));
	};

	const tags = [applied.period, ...applied.types, ...(applied.amount !== '전체' ? [applied.amount] : [])];

	return (
		<div className={styles.wrap}>
			{/* ── 페이지 쪽: 요약 + 트리거 ─────────────────────── */}
			<div className={styles.bar}>
				<div>
					<div className={styles.barTitle}>거래내역</div>
					<div className={styles.barSub}>조건을 선택해 목록을 좁혀보세요.</div>
				</div>

				<Drawer
					open={open}
					onOpenChange={handleOpenChange}
				>
					<DrawerTrigger asChild>
						<Button className={styles.triggerBtn}>
							<SlidersHorizontal className="w-4 h-4" />
							필터
						</Button>
					</DrawerTrigger>

					{/* ── 시트 ─────────────────────────────────── */}
					<DrawerContent className={styles.sheet}>
						<DrawerHeader>
							<DrawerTitle>거래내역 필터</DrawerTitle>
							<DrawerDescription>선택한 조건은 [적용]을 눌러야 반영됩니다.</DrawerDescription>
						</DrawerHeader>

						<div className={styles.body}>
							<div className={styles.group}>
								<div className={styles.groupTitle}>조회 기간</div>
								<div className={styles.chips}>
									{PERIODS.map((p) => (
										<Button
											key={p}
											type="button"
											onClick={() => setDraft((prev) => ({ ...prev, period: p }))}
											className={`${styles.chip} ${draft.period === p ? styles.chipOn : ''}`}
											aria-pressed={draft.period === p}
										>
											{p}
										</Button>
									))}
								</div>
							</div>

							<div className={styles.group}>
								<div className={styles.groupTitle}>거래 유형 (복수 선택)</div>
								<div className={styles.chips}>
									{TYPES.map((t) => (
										<Button
											key={t}
											type="button"
											onClick={() => toggleType(t)}
											className={`${styles.chip} ${draft.types.includes(t) ? styles.chipOn : ''}`}
											aria-pressed={draft.types.includes(t)}
										>
											{t}
										</Button>
									))}
								</div>
							</div>

							<div className={styles.group}>
								<div className={styles.groupTitle}>거래 금액</div>
								<div className={styles.chips}>
									{AMOUNTS.map((a) => (
										<Button
											key={a}
											type="button"
											onClick={() => setDraft((prev) => ({ ...prev, amount: a }))}
											className={`${styles.chip} ${draft.amount === a ? styles.chipOn : ''}`}
											aria-pressed={draft.amount === a}
										>
											{a}
										</Button>
									))}
								</div>
							</div>
						</div>

						<DrawerFooter>
							<Button
								type="button"
								onClick={() => setDraft(INITIAL)}
								className={`${styles.chip} ${styles.ctaGhost}`}
							>
								초기화
							</Button>
							<DrawerClose asChild>
								<Button
									type="button"
									onClick={() => setApplied(draft)}
									className={styles.cta}
								>
									적용하기
								</Button>
							</DrawerClose>
						</DrawerFooter>
					</DrawerContent>
				</Drawer>
			</div>

			{/* ── 적용된 필터 요약 ─────────────────────────────── */}
			<div className={styles.summary}>
				{tags.length === 0 ? (
					<span className={styles.summaryEmpty}>적용된 필터가 없습니다.</span>
				) : (
					tags.map((t) => (
						<span
							key={t}
							className={styles.tag}
						>
							{t}
						</span>
					))
				)}
			</div>
		</div>
	);
}
