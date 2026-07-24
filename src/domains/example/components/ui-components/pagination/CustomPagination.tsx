import { useState } from 'react';
import {
	Pagination,
	PaginationContent,
	PaginationItem,
	PaginationLink,
	PaginationPrevious,
	PaginationNext,
	PaginationEllipsis,
} from '@axiom/components/ui';
import styles from './CustomPagination.module.css';

/**
 * 퍼블리셔가 pagination 프리미티브에 *.module.css 만 입혀
 * 완전히 다른 룩앤필(각진 카드형 + 브랜드 컬러 액티브)로 만든 예시.
 *
 * 컴포넌트 구조·동작은 기본 예제와 동일하고, 달라진 건 각 조각에 넘긴
 * className 뿐이다. 실제 SI 프로젝트에서는 이 파일 옆의
 * CustomPagination.module.css 만 교체하면 룩앤필이 바뀐다.
 *
 * 페이지 이동은 실제로 동작하도록 useState 로 현재 페이지를 관리한다.
 * (해시 라우터를 쓰므로 <a href> 로 이동하지 않고 onClick 에서 preventDefault 후 상태만 바꾼다.)
 */
export default function CustomPagination(): React.ReactNode {
	const totalPages = 8;
	const [page, setPage] = useState(1);

	const go = (p: number) => (e: React.MouseEvent) => {
		e.preventDefault();
		if (p >= 1 && p <= totalPages) setPage(p);
	};

	// 현재 페이지 주변만 노출하고 멀어지면 … 로 접는 범위 계산
	const pages: (number | 'ellipsis')[] = [];
	for (let p = 1; p <= totalPages; p++) {
		if (p === 1 || p === totalPages || Math.abs(p - page) <= 1) {
			pages.push(p);
		} else if (pages[pages.length - 1] !== 'ellipsis') {
			pages.push('ellipsis');
		}
	}

	return (
		<div className={styles.wrap}>
			<Pagination>
				<PaginationContent className={styles.list}>
					<PaginationItem>
						<PaginationPrevious
							href="#"
							text="이전"
							onClick={go(page - 1)}
							aria-disabled={page === 1}
							className={`${styles.arrow} ${page === 1 ? styles.disabled : ''}`}
						/>
					</PaginationItem>

					{pages.map((p, i) =>
						p === 'ellipsis' ? (
							<PaginationItem key={`e-${i}`}>
								<PaginationEllipsis className={styles.ellipsis} />
							</PaginationItem>
						) : (
							<PaginationItem key={p}>
								<PaginationLink
									href="#"
									isActive={p === page}
									onClick={go(p)}
									className={`${styles.link} ${p === page ? styles.active : ''}`}
								>
									{p}
								</PaginationLink>
							</PaginationItem>
						),
					)}

					<PaginationItem>
						<PaginationNext
							href="#"
							text="다음"
							onClick={go(page + 1)}
							aria-disabled={page === totalPages}
							className={`${styles.arrow} ${page === totalPages ? styles.disabled : ''}`}
						/>
					</PaginationItem>
				</PaginationContent>
			</Pagination>

			<p className={styles.status}>
				전체 {totalPages}페이지 중 <b>{page}</b>페이지
			</p>
		</div>
	);
}
