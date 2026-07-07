// 모든 테스트 실행 전에 자동으로 불러오는 파일 (vite.config.ts의 test.setupFiles에 등록).
// @testing-library/jest-dom 을 import 하면 toBeInTheDocument() 같은
// DOM 전용 매처(matcher)가 expect()에 추가된다.
import '@testing-library/jest-dom';
