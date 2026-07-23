import { Tabs, TabsContent, TabsList, TabsTrigger } from '@axiom/components/ui';
import { UserRound, BellRing, CreditCard, ShieldCheck, Check } from 'lucide-react';
import styles from './SettingsTabs.module.css';

/**
 * 실전 예제 — scaffold가 제공하는 Tabs(@axiom/components/ui)를 "그대로 사용"하면서
 * CSS Module로 완전히 다른 스타일(좌측 세로 레일 + 우측 콘텐츠 카드)을 입힌 설정 화면.
 *
 * 재스타일링 포인트: Tabs 내부 요소는 data-slot / data-state 속성을 노출한다.
 *   - [data-slot="tabs"]          : 루트
 *   - [data-slot="tabs-list"]     : 트리거 묶음(여기선 좌측 레일)
 *   - [data-slot="tabs-trigger"]  : 각 탭 버튼 (활성 시 data-state="active")
 *   - [data-slot="tabs-content"]  : 각 탭 패널
 * SettingsTabs.module.css 의 .wrap 아래에서 이 슬롯들을 선택해 오버라이드하므로,
 * 컴포넌트 로직은 건드리지 않고 스타일만 프로젝트 톤에 맞춰 교체할 수 있다.
 */
export default function SettingsTabs(): React.ReactNode {
	return (
		<Tabs
			orientation="vertical"
			defaultValue="account"
			className={styles.wrap}
		>
			<TabsList className={styles.rail}>
				<span className={styles.railTitle}>설정</span>
				<TabsTrigger
					value="account"
					className={styles.tab}
				>
					<UserRound className={styles.tabIcon} />
					<span className={styles.tabLabel}>
						계정
						<em className={styles.tabDesc}>프로필 · 이메일</em>
					</span>
				</TabsTrigger>
				<TabsTrigger
					value="notifications"
					className={styles.tab}
				>
					<BellRing className={styles.tabIcon} />
					<span className={styles.tabLabel}>
						알림
						<em className={styles.tabDesc}>메일 · 푸시</em>
					</span>
				</TabsTrigger>
				<TabsTrigger
					value="billing"
					className={styles.tab}
				>
					<CreditCard className={styles.tabIcon} />
					<span className={styles.tabLabel}>
						결제
						<em className={styles.tabDesc}>플랜 · 청구</em>
					</span>
				</TabsTrigger>
			</TabsList>

			<div className={styles.panel}>
				<TabsContent
					value="account"
					className={styles.content}
				>
					<h3 className={styles.contentTitle}>계정 정보</h3>
					<p className={styles.contentDesc}>프로필에 표시되는 기본 정보입니다.</p>
					<label className={styles.field}>
						<span className={styles.fieldLabel}>이름</span>
						<input
							className={styles.input}
							defaultValue="김대리"
						/>
					</label>
					<label className={styles.field}>
						<span className={styles.fieldLabel}>이메일</span>
						<input
							className={styles.input}
							defaultValue="daeri.kim@example.com"
						/>
					</label>
					<button
						type="button"
						className={styles.primaryBtn}
					>
						<Check className={styles.btnIcon} />
						변경사항 저장
					</button>
				</TabsContent>

				<TabsContent
					value="notifications"
					className={styles.content}
				>
					<h3 className={styles.contentTitle}>알림 설정</h3>
					<p className={styles.contentDesc}>어떤 알림을 받을지 선택하세요.</p>
					<ul className={styles.toggleList}>
						{[
							{ label: '이메일 요약', desc: '매주 활동 리포트를 이메일로 받습니다.', on: true },
							{ label: '푸시 알림', desc: '중요한 이벤트를 실시간으로 알립니다.', on: true },
							{ label: '마케팅 소식', desc: '신규 기능과 프로모션 소식을 받습니다.', on: false },
						].map((t) => (
							<li
								key={t.label}
								className={styles.toggleRow}
							>
								<div>
									<p className={styles.toggleLabel}>{t.label}</p>
									<p className={styles.toggleDesc}>{t.desc}</p>
								</div>
								<span
									className={styles.toggle}
									data-on={t.on ? '' : undefined}
								>
									<span className={styles.toggleDot} />
								</span>
							</li>
						))}
					</ul>
				</TabsContent>

				<TabsContent
					value="billing"
					className={styles.content}
				>
					<h3 className={styles.contentTitle}>결제 및 플랜</h3>
					<p className={styles.contentDesc}>현재 이용 중인 요금제입니다.</p>
					<div className={styles.planCard}>
						<div className={styles.planHead}>
							<ShieldCheck className={styles.planIcon} />
							<div>
								<p className={styles.planName}>Pro 플랜</p>
								<p className={styles.planPrice}>₩29,000 / 월</p>
							</div>
							<span className={styles.planBadge}>이용중</span>
						</div>
						<ul className={styles.planFeatures}>
							<li>
								<Check className={styles.featIcon} />
								무제한 프로젝트
							</li>
							<li>
								<Check className={styles.featIcon} />
								우선 기술 지원
							</li>
							<li>
								<Check className={styles.featIcon} />
								고급 분석 리포트
							</li>
						</ul>
						<button
							type="button"
							className={styles.ghostBtn}
						>
							플랜 변경
						</button>
					</div>
				</TabsContent>
			</div>
		</Tabs>
	);
}
