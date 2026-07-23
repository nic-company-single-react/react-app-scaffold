import { useMemo, useState } from 'react';
import { NativeSelect, NativeSelectOption } from '@axiom/components/ui';
import styles from './GridToolbarNativeSelect.module.css';

const TOTAL = 1284;

const SORTS = [
	{ value: 'recent', label: '최신 등록순' },
	{ value: 'name', label: '이름 오름차순' },
	{ value: 'amount', label: '금액 높은순' },
];

const SIZES = ['10', '20', '50', '100'];

/**
 * 제공 NativeSelect 를 "그리드/목록 하단 툴바"로 재스타일링한 실전 예제.
 *
 * 컴포넌트(.tsx)는 전혀 손대지 않고 *.module.css 만으로 알약(pill) 톤의
 * 셀렉트로 바꿨다. 실제 SI 프로젝트에서 퍼블리셔가 하게 될 작업 형태를 보여준다.
 *
 * 포인트
 *  - className 은 래퍼에 붙으므로, CSS 에서 [data-slot="native-select"] 로 파고들어
 *    실제 셀렉트 박스를 스타일한다. (module.css 주석 참고)
 *  - 네이티브 <select> 라 onChange 의 e.target.value 로 값을 읽고, 폼 전송도 그대로 된다.
 */
export default function GridToolbarNativeSelect(): React.ReactNode {
	const [sort, setSort] = useState('recent');
	const [size, setSize] = useState('20');

	const pageCount = useMemo(() => Math.ceil(TOTAL / Number(size)), [size]);

	return (
		<div className={styles.bar}>
			<span className={styles.total}>
				총 <b>{TOTAL.toLocaleString()}</b>건 · <b>{pageCount}</b>페이지
			</span>

			<span className={styles.spacer} />

			<label className={styles.control}>
				<span className={styles.label}>정렬</span>
				<NativeSelect
					size="sm"
					className={styles.field}
					aria-label="정렬 기준"
					value={sort}
					onChange={(e) => setSort(e.target.value)}
				>
					{SORTS.map((s) => (
						<NativeSelectOption
							key={s.value}
							value={s.value}
						>
							{s.label}
						</NativeSelectOption>
					))}
				</NativeSelect>
			</label>

			<label className={styles.control}>
				<span className={styles.label}>페이지당</span>
				<NativeSelect
					size="sm"
					className={styles.field}
					aria-label="페이지당 표시 개수"
					value={size}
					onChange={(e) => setSize(e.target.value)}
				>
					{SIZES.map((n) => (
						<NativeSelectOption
							key={n}
							value={n}
						>
							{n}개씩
						</NativeSelectOption>
					))}
				</NativeSelect>
			</label>
		</div>
	);
}
