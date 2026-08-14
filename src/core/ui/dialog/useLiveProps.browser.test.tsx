// [browser] "바탕 페이지의 state 를 dialog 컨텐츠에 실시간으로 흘려보낼 수 있는가" 검증.
//
// 창구는 언제나 $ui.dialog 하나다. 차이는 props 자리에 무엇을 넣느냐뿐이다.
//   (1) 평범한 객체        — 열린 시점 스냅샷 (대부분의 다이얼로그)
//   (2) useLiveProps(...)  — 바탕 페이지의 렌더를 따라가는 살아있는 props
//   (3) handle.update()    — async 흐름에서 명령형으로 밀어넣기
// 그리고 흔히 걸리는 함정(컨텐츠가 props 를 useState 초기값으로 "복사"하면 갱신이 안 보인다)도 함께 못박는다.
import { useEffect, useState } from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWindowUI } from '@/core/ui';
import { useUIStore } from '@/core/ui/store';
import UIDialogStackHost from './UIDialogStackHost';
import { useDialogStackStore } from './dialogStore';
import { closeAllDialogs } from './dialogController';
import { useLiveProps } from './useLiveProps';

interface ITickProps {
	tick: number;
	label: string;
}

/** 평범한 컴포넌트. props 를 그대로 렌더한다 — 상자의 존재를 모른다. */
function TickContent({ tick, label }: ITickProps): React.ReactNode {
	return (
		<p data-testid="tick">
			{label}:{tick}
		</p>
	);
}

/** props 를 useState 초기값으로 복사한다 — 갱신이 화면에 안 보인다(함정). */
function SeededContent({ tick }: ITickProps): React.ReactNode {
	const [copied] = useState(tick);
	return <p data-testid="seeded">{copied}</p>;
}

/**
 * 바탕 페이지 — 매 60ms 증가하는 state 를 살아있는 props 로 넘긴다.
 *
 * ⚠️ modal 다이얼로그가 열려 있는 동안 사용자는 바탕 페이지를 클릭할 수 없다
 *    (Radix 가 바깥 전체를 aria-hidden + 오버레이로 막는다). 그래서 "바탕 state 변경"은
 *    타이머·구독·응답 도착 같은 **비동기 경로**로 들어오는 것이 현실적인 시나리오다.
 */
function TickPage({ Content = TickContent }: { Content?: React.ComponentType<ITickProps> }): React.ReactNode {
	const [tick, setTick] = useState(0);
	const [label, setLabel] = useState('A');

	useEffect(() => {
		const timer = setInterval(() => setTick((n) => n + 1), 60);
		return () => clearInterval(timer);
	}, []);

	// ★ 핵심 — 값만 상자로 감싼다. 여는 방법은 평소와 똑같은 $ui.dialog 다.
	const live = useLiveProps({ tick, label });

	return (
		<>
			<UIDialogStackHost />
			<button
				type="button"
				onClick={() => void window.$ui.dialog({ component: Content, props: live, footer: false })}
			>
				열기
			</button>
			<button
				type="button"
				onClick={() => setLabel('B')}
			>
				라벨변경
			</button>
		</>
	);
}

const readTick = () => Number(screen.getByTestId('tick').textContent!.split(':')[1]);

/** modal 이 열려 있으면 바탕 버튼은 클릭할 수 없으므로 DOM 에서 직접 누른다. */
const clickBehindOverlay = (text: string) => {
	Array.from(document.querySelectorAll('button'))
		.find((b) => b.textContent === text)!
		.click();
};

beforeEach(() => {
	window.$router = {
		getLocation: () => ({ pathname: '/test', search: '', hash: '', state: null, key: 'k' }),
		subscribe: () => () => {},
		createHref: (to: unknown) => String(to),
		push: () => {},
		replace: () => {},
		go: () => {},
	} as unknown as typeof window.$router;

	window.$ui = createWindowUI();
	useDialogStackStore.setState({ stack: [] });
	useUIStore.setState({ queue: [] });
	document.body.style.pointerEvents = '';
});

afterEach(() => {
	closeAllDialogs();
	useDialogStackStore.setState({ stack: [] });
	useUIStore.setState({ queue: [] });
	document.body.style.pointerEvents = '';
});

describe('useLiveProps (browser)', () => {
	it('바탕 state 가 계속 변하면 dialog 컨텐츠도 따라 변한다 (동기화 코드 없음)', async () => {
		const user = userEvent.setup();
		render(<TickPage />);

		await user.click(screen.getByRole('button', { name: '열기' }));
		await screen.findByTestId('tick');

		const first = readTick();
		// 여러 틱이 지나도록 기다린다.
		await waitFor(() => expect(readTick()).toBeGreaterThan(first + 2), { timeout: 3000 });
	});

	it('여러 키를 동시에 넘겨도 각각 최신 값으로 반영된다', async () => {
		const user = userEvent.setup();
		render(<TickPage />);

		await user.click(screen.getByRole('button', { name: '열기' }));
		await waitFor(() => expect(screen.getByTestId('tick')).toHaveTextContent(/^A:/));

		clickBehindOverlay('라벨변경');

		await waitFor(() => expect(screen.getByTestId('tick')).toHaveTextContent(/^B:/));
		// 라벨이 바뀌어도 tick 은 계속 흐른다.
		const at = readTick();
		await waitFor(() => expect(readTick()).toBeGreaterThan(at), { timeout: 3000 });
	});

	it('감싸지 않고 그냥 넘기면 열린 시점 값으로 굳는다 (기본 동작)', async () => {
		render(<UIDialogStackHost />);

		window.$ui.dialog({ component: TickContent, props: { tick: 7, label: 'A' }, footer: false });

		expect(await screen.findByTestId('tick')).toHaveTextContent('A:7');
		await new Promise((resolve) => setTimeout(resolve, 300));
		expect(screen.getByTestId('tick')).toHaveTextContent('A:7');
	});

	it('handle.update() 로 열린 dialog 의 props 를 갱신할 수 있다', async () => {
		render(<UIDialogStackHost />);

		const handle = window.$ui.dialog({ component: TickContent, props: { tick: 0, label: 'A' }, footer: false });
		expect(await screen.findByTestId('tick')).toHaveTextContent('A:0');

		handle.update({ tick: 42 });
		await waitFor(() => expect(screen.getByTestId('tick')).toHaveTextContent('A:42'));
	});

	it('함정 — 컨텐츠가 props 를 useState 초기값으로 복사하면 갱신이 보이지 않는다', async () => {
		const user = userEvent.setup();
		render(<TickPage Content={SeededContent} />);

		await user.click(screen.getByRole('button', { name: '열기' }));
		const seeded = (await screen.findByTestId('seeded')).textContent;

		// props 는 갱신되지만 useState 초기값은 마운트 시점에 한 번만 쓰이므로 화면은 그대로다.
		await new Promise((resolve) => setTimeout(resolve, 400));
		expect(screen.getByTestId('seeded')).toHaveTextContent(seeded!);
	});
});
