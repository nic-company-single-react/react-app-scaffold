// [브라우저 예제] 파일명이 *.browser.test.tsx 이므로 'browser' 프로젝트에서 실행된다.
// 진짜 Chromium 을 띄워서 렌더링하므로, 실제로 "보이는지(visible)"까지 검증할 수 있다.
import { render } from '@testing-library/react';
import { page } from 'vitest/browser';
import SectionHeader from './SectionHeader';

describe('SectionHeader (browser)', () => {
	it('제목이 실제 브라우저 화면에 보인다', async () => {
		render(<SectionHeader title="브라우저 제목" description="브라우저 설명" />);

		// page.getByText(...) 는 실제 브라우저 DOM 을 조회하는 로케이터.
		// expect.element(...).toBeVisible() 은 요소가 나타날 때까지 자동으로 재시도(retry)하며,
		// jsdom 과 달리 실제 렌더링 기준으로 '보이는지'를 판정한다.
		await expect.element(page.getByText('브라우저 제목')).toBeVisible();
		await expect.element(page.getByText('브라우저 설명')).toBeVisible();
	});
});
