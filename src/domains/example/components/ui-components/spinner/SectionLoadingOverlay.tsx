import { Spinner } from '@axiom/components/ui';
import styles from './SectionLoadingOverlay.module.css';

export interface ISectionLoadingOverlayProps {
	/** 로딩 중 여부 — true 일 때 오버레이가 콘텐츠 위에 덮인다. */
	loading: boolean;
	/** 스피너 아래에 표시할 안내 문구. */
	message?: string;
	/** 오버레이가 덮을 실제 콘텐츠. */
	children: React.ReactNode;
}

/**
 * 카드/영역 단위 로딩 오버레이.
 *
 * 데이터를 다시 불러오는 동안 영역 전체를 살짝 흐리고 가운데에 스피너를 띄우는,
 * SI 프로젝트에서 가장 자주 쓰는 패턴이다. 스피너 자체는 공용 `Spinner` 를 그대로 쓰고,
 * 배경 블러·페이드·정렬 같은 "오버레이 연출"은 바로 옆 module.css 로 분리했다(co-location).
 * 퍼블리셔는 이 .tsx 를 건드리지 않고 SectionLoadingOverlay.module.css 만 손보면 된다.
 */
export default function SectionLoadingOverlay({
	loading,
	message = '불러오는 중…',
	children,
}: ISectionLoadingOverlayProps): React.ReactNode {
	return (
		<div className={styles.wrap}>
			{children}

			{loading && (
				<div
					className={styles.overlay}
					role="status"
					aria-live="polite"
				>
					<Spinner className={styles.spinner} />
					<span className={styles.message}>{message}</span>
				</div>
			)}
		</div>
	);
}
