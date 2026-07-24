import {
	Breadcrumb,
	BreadcrumbList,
	BreadcrumbItem,
	BreadcrumbLink,
	BreadcrumbPage,
	BreadcrumbSeparator,
} from '@axiom/components/ui';
import { Home } from 'lucide-react';
import styles from './CustomBreadcrumb.module.css';

/**
 * 퍼블리셔가 breadcrumb 프리미티브에 *.module.css 만 입혀
 * 완전히 다른 룩앤필(알약형 그라데이션 바 + 슬래시 구분자)로 만든 예시.
 *
 * 컴포넌트 구조는 기본 예제와 동일하고, 달라진 건 각 조각에 넘긴
 * className 뿐이다. 실제 SI 프로젝트에서는 이 파일 옆의
 * CustomBreadcrumb.module.css 만 교체하면 룩앤필이 바뀐다.
 */
export default function CustomBreadcrumb(): React.ReactNode {
	return (
		<Breadcrumb>
			<BreadcrumbList className={styles.bar}>
				<BreadcrumbItem>
					<BreadcrumbLink
						href="#/"
						className={styles.link}
					>
						<Home className="w-3.5 h-3.5" />
						홈
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className={styles.sep}>/</BreadcrumbSeparator>
				<BreadcrumbItem>
					<BreadcrumbLink
						href="#/"
						className={styles.link}
					>
						자산관리
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className={styles.sep}>/</BreadcrumbSeparator>
				<BreadcrumbItem>
					<BreadcrumbLink
						href="#/"
						className={styles.link}
					>
						계좌조회
					</BreadcrumbLink>
				</BreadcrumbItem>
				<BreadcrumbSeparator className={styles.sep}>/</BreadcrumbSeparator>
				<BreadcrumbItem>
					<BreadcrumbPage className={styles.page}>거래내역</BreadcrumbPage>
				</BreadcrumbItem>
			</BreadcrumbList>
		</Breadcrumb>
	);
}
