/**
 * 앱 설정 통합 입구 (SI가 관리하는 유일한 설정 레이어).
 *
 * 새 설정이 늘면 관심사별 파일(*.config.ts)을 추가하고 여기서 re-export 합니다.
 */
export { queryConfig } from './query.config';
export { apiConfig } from './api.config';
