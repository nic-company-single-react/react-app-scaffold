import { Fragment } from 'react';
import { Avatar, AvatarBadge, AvatarFallback, AvatarGroup, AvatarGroupCount, AvatarImage } from '@axiom/components/ui';
import { Check, Clock, X } from 'lucide-react';
import styles from './ApprovalLineAvatars.module.css';

type ApprovalStatus = 'approved' | 'pending' | 'rejected' | 'current';

interface IApprovalStep {
	id: string;
	role: string; // 기안 / 검토 / 승인
	name: string;
	dept: string;
	initials: string;
	img?: string; // 프로필 이미지(없으면 이니셜 fallback)
	status: ApprovalStatus;
}

const STATUS_LABEL: Record<ApprovalStatus, string> = {
	approved: '승인',
	pending: '대기',
	rejected: '반려',
	current: '진행중',
};

/** 상태별 뱃지 아이콘 (없으면 뱃지 점만 노출) */
function StatusIcon({ status }: { status: ApprovalStatus }): React.ReactNode {
	if (status === 'approved') return <Check strokeWidth={3} />;
	if (status === 'rejected') return <X strokeWidth={3} />;
	if (status === 'pending' || status === 'current') return <Clock strokeWidth={3} />;
	return null;
}

const STEPS: IApprovalStep[] = [
	{ id: 's1', role: '기안', name: '김닉', dept: '디지털개발팀', initials: '김닉', status: 'approved' },
	{ id: 's2', role: '검토', name: '이수미', dept: '개발2파트', initials: '이수', status: 'approved' },
	{ id: 's3', role: '승인', name: '박결재', dept: '팀장', initials: '박결', status: 'current' },
	{ id: 's4', role: '전결', name: '최전무', dept: '본부장', initials: '최전', status: 'pending' },
];

/** 참조자(하단 겹치는 아바타 그룹) */
const REFERENCES = [
	{ id: 'r1', initials: 'HR' },
	{ id: 'r2', initials: '감사' },
	{ id: 'r3', initials: '재무' },
];

/**
 * 전자결재 결재선 — 예제 목적.
 *
 * scaffold가 제공하는 Avatar(@axiom/components/ui, shadcn/radix 기반)를 그대로 사용하고,
 * 이미지 로드 실패 시 fallback, 상태 뱃지(AvatarBadge), 참조자 그룹(AvatarGroup)까지
 * 컴포넌트 기능은 전부 그대로 쓴다.
 *
 * 겉모습(원형 → 라운드 사각 타일, 상태별 링/뱃지 색)은 같은 폴더의
 * ApprovalLineAvatars.module.css 에서 data-slot 선택자로 오버라이드했다.
 * 즉 "제공되는 컴포넌트를 재사용하되 스타일만 다르게 입히는" 패턴의 예시이며,
 * 실제 SI 프로젝트에서 퍼블리셔가 손대는 지점이 바로 이 CSS Module 파일이다.
 */
export default function ApprovalLineAvatars(): React.ReactNode {
	return (
		<div className={styles.board}>
			<div className={styles.head}>
				<span className={styles.title}>지출결의서 결재선</span>
				<span className={styles.docNo}>DOC-2026-000842</span>
			</div>

			<div className={styles.flow}>
				{STEPS.map((step, i) => (
					<Fragment key={step.id}>
						{i > 0 && (
							<div
								className={styles.connector}
								aria-hidden
							/>
						)}
						<div className={styles.step}>
							<span className={styles.roleTag}>{step.role}</span>

							<div
								className={styles.avatarWrap}
								data-status={step.status}
							>
								<Avatar>
									{step.img && (
										<AvatarImage
											src={step.img}
											alt={step.name}
										/>
									)}
									<AvatarFallback>{step.initials}</AvatarFallback>
									<AvatarBadge>
										<StatusIcon status={step.status} />
									</AvatarBadge>
								</Avatar>
							</div>

							<div>
								<div className={styles.name}>{step.name}</div>
								<div className={styles.dept}>{step.dept}</div>
							</div>
							<span className={styles.statusChip}>{STATUS_LABEL[step.status]}</span>
						</div>
					</Fragment>
				))}
			</div>

			<div className={styles.foot}>
				<span className={styles.footLabel}>참조</span>
				<AvatarGroup className={styles.refGroup}>
					{REFERENCES.map((ref) => (
						<Avatar key={ref.id}>
							<AvatarFallback>{ref.initials}</AvatarFallback>
						</Avatar>
					))}
					<AvatarGroupCount>+2</AvatarGroupCount>
				</AvatarGroup>
			</div>
		</div>
	);
}
