import { dateUtil } from './date';
import { numberUtil } from './number';
import { stringUtil } from './string';
import { financeUtil } from './finance';
import { objectUtil } from './object';
import { arrayUtil } from './array';
import type { IUtils } from '@/types/common';

export function createWindowUtil(): IUtils {
	return {
		date: dateUtil,
		number: numberUtil,
		string: stringUtil,
		finance: financeUtil,
		object: objectUtil,
		array: arrayUtil,
	};
}

// 전역 $util 등록
export function registerWindowUtil(): void {
	window.$util = createWindowUtil();
}

export { dateUtil, numberUtil, stringUtil, financeUtil, objectUtil, arrayUtil };

// 공휴일(영업일 계산) 설정 — 부트스트랩에서 서버 영업일 캘린더를 주입할 때 사용합니다.
// (부수효과 함수라 $util.date에는 올리지 않고 별도 export 합니다.)
export { setHolidays, getHolidays } from './date';
