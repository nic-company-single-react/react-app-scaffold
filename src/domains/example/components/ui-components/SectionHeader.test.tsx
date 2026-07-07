// [jsdom 예제] 파일명이 *.test.tsx 이므로 'unit' 프로젝트(jsdom)에서 실행된다.
// 가짜 DOM 위에서 렌더링 결과(텍스트/구조)를 빠르게 검증하는 용도.
import { render, screen } from '@testing-library/react';
import SectionHeader from './SectionHeader';

describe('SectionHeader (jsdom)', () => {
	it('title 을 렌더링한다', () => {
		render(<SectionHeader title="섹션 제목" />);
		// jest-dom 매처(toBeInTheDocument)는 src/test/setup.ts 에서 등록됨
		expect(screen.getByText('섹션 제목')).toBeInTheDocument();
	});

	it('description 을 넘기면 함께 렌더링한다', () => {
		render(<SectionHeader title="제목" description="설명 문구" />);
		expect(screen.getByText('설명 문구')).toBeInTheDocument();
	});

	it('description 이 없으면 렌더링하지 않는다', () => {
		render(<SectionHeader title="제목만" />);
		expect(screen.queryByText('설명 문구')).not.toBeInTheDocument();
	});
});
