import { Spinner } from '@axiom/components/ui';
import styles from './BrandSpinner.module.css';

export interface IBrandSpinnerProps {
	/** 스피너 지름(px). 기본 44. */
	size?: number;
	/** 헤일로 링 두께(px). 기본 4. */
	thickness?: number;
	/** 접근성 라벨. */
	label?: string;
}

/**
 * 공용 Spinner 를 "코어"로 그대로 쓰면서 톤앤매너를 완전히 바꾼 브랜드 스피너.
 *
 * 회전하는 실제 인디케이터는 scaffold 의 공용 `<Spinner/>`(lucide Loader2) 그대로다.
 * 그 위에 그라데이션 헤일로 링 + 글로우 같은 "브랜드 연출"만 바로 옆 module.css 로 입혔다(co-location).
 * 즉 로직/마크업의 핵심은 공용 컴포넌트를 재사용하고, 퍼블리셔가 바꿀 색·속도·연출은 전부
 * BrandSpinner.module.css 안에서만 이뤄진다. .tsx 는 건드릴 일이 거의 없다.
 */
export default function BrandSpinner({
	size = 44,
	thickness = 4,
	label = 'Loading',
}: IBrandSpinnerProps): React.ReactNode {
	return (
		<span
			className={styles.halo}
			role="status"
			aria-label={label}
			style={
				{
					'--size': `${size}px`,
					'--thickness': `${thickness}px`,
				} as React.CSSProperties
			}
		>
			{/* 코어 = scaffold 공용 Spinner. 커스텀은 module.css 가 담당한다. */}
			<Spinner className={styles.core} />
		</span>
	);
}
