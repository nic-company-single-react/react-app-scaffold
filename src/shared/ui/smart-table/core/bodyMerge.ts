/**
 * 본문 세로 병합(rowspan) 계산
 *
 * 현재 표시 중인 행들에서, 지정 컬럼의 "연속 동일 값"을 묶어 rowspan 정보를 만듭니다.
 * 왼쪽(더 높은 우선순위) 병합 컬럼의 경계를 상속해 그룹이 교차 병합되지 않습니다.
 * 화면 렌더와 엑셀 export가 이 동일 결과를 공유합니다.
 */
export interface IMergeInfo {
	/** 이 행에서 셀을 렌더할지 (false면 위 셀의 rowspan에 흡수) */
	render: boolean;
	/** render=true일 때의 세로 병합 행 수 */
	rowSpan: number;
}

/**
 * @param rowCount 표시 행 수
 * @param mergeColIds 병합 대상 컬럼 id (화면상 좌→우 = 우선순위 높음→낮음)
 * @param valueAt (행 인덱스, 컬럼 id) → 비교용 문자열 값
 */
export function computeBodyMergeMap(
	rowCount: number,
	mergeColIds: string[],
	valueAt: (rowIdx: number, colId: string) => string,
): Record<string, IMergeInfo[]> {
	const result: Record<string, IMergeInfo[]> = {};
	// 왼쪽 컬럼들에서 누적된 그룹 경계 (해당 행 앞에서 끊김)
	const boundary = new Array<boolean>(rowCount).fill(false);

	for (const colId of mergeColIds) {
		const infos = new Array<IMergeInfo>(rowCount);
		let i = 0;
		while (i < rowCount) {
			const v = valueAt(i, colId);
			let j = i + 1;
			while (j < rowCount && !boundary[j] && valueAt(j, colId) === v) j++;
			infos[i] = { render: true, rowSpan: j - i };
			for (let k = i + 1; k < j; k++) infos[k] = { render: false, rowSpan: 0 };
			i = j;
		}
		result[colId] = infos;

		// 이 컬럼의 값 변화 지점을 경계로 추가 → 오른쪽 컬럼이 상속
		for (let r = 1; r < rowCount; r++) {
			if (valueAt(r, colId) !== valueAt(r - 1, colId)) boundary[r] = true;
		}
	}

	return result;
}
