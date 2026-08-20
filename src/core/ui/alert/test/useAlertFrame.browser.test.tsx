// [browser] 진짜 Chromium 에서만 확인 가능한 것 — 초기 포커스와 오버레이 클릭 차단.
// jsdom 은 Radix 의 FocusScope / DismissableLayer 를 제대로 재현하지 못한다.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWindowUI } from '@/core/ui';
import { useUIStore } from '@/core/ui/alert/alertStore';
import { UIAlertHost } from '@/core/ui/alert/UIAlertHost';

beforeEach(() => {
	window.$ui = createWindowUI();
	useUIStore.setState({ queue: [] });
});

/** 알림/확인창을 띄우는 트리거 버튼 + 호스트. `onTrigger` 로 트리거가 눌린 횟수를 셀 수 있다. */
function Harness({ onTrigger }: { onTrigger?: () => void }): React.ReactNode {
	return (
		<>
			<button
				type="button"
				onClick={() => {
					onTrigger?.();
					void $ui.alert('알림 본문');
				}}
			>
				알림 열기
			</button>
			<button
				type="button"
				onClick={() => void $ui.confirm('확인 본문')}
			>
				확인창 열기
			</button>
			<UIAlertHost />
		</>
	);
}

/** 현재 포커스된 요소의 data-slot */
function activeSlot(): string | null {
	return document.activeElement?.getAttribute('data-slot') ?? null;
}

test('alert: 열리면 확인 버튼에 초기 포커스가 간다', async () => {
	render(<Harness />);
	await userEvent.click(screen.getByRole('button', { name: '알림 열기' }));
	await waitFor(() => expect(screen.getByText('알림 본문')).toBeInTheDocument());

	await waitFor(() => expect(activeSlot()).toBe('alert-dialog-action'));
});

test('alert: 뜬 직후 Enter 는 트리거 버튼을 다시 누르지 않고 알림을 닫는다', async () => {
	let triggerCount = 0;
	render(<Harness onTrigger={() => (triggerCount += 1)} />);

	await userEvent.click(screen.getByRole('button', { name: '알림 열기' }));
	await waitFor(() => expect(screen.getByText('알림 본문')).toBeInTheDocument());
	expect(triggerCount).toBe(1);

	await userEvent.keyboard('{Enter}');

	// 확인 버튼이 눌려 알림이 닫히고, 트리거가 재실행되지 않아야 한다.
	await waitFor(() => expect(screen.queryByText('알림 본문')).not.toBeInTheDocument());
	expect(triggerCount).toBe(1);

	// 큐 제거는 닫힘 애니메이션(CLOSE_ANIM_MS) 뒤라서 기다린다. 재실행됐다면 여기서 1이 남는다.
	await waitFor(() => expect(useUIStore.getState().queue).toHaveLength(0));
});

test('confirm: 열리면 취소 버튼에 초기 포커스가 간다 (파괴적 동작의 기본값은 취소)', async () => {
	render(<Harness />);
	await userEvent.click(screen.getByRole('button', { name: '확인창 열기' }));
	await waitFor(() => expect(screen.getByText('확인 본문')).toBeInTheDocument());

	await waitFor(() => expect(activeSlot()).toBe('alert-dialog-cancel'));
});

test('confirm: 뜬 직후 Enter 는 취소로 닫힌다 (false)', async () => {
	render(<Harness />);
	let resolved: boolean | undefined;
	void $ui.confirm('확인 본문').then((v) => (resolved = v));

	await waitFor(() => expect(screen.getByText('확인 본문')).toBeInTheDocument());
	await userEvent.keyboard('{Enter}');

	await waitFor(() => expect(resolved).toBe(false));
});

test('딤 배경(오버레이) 클릭으로는 닫히지 않는다', async () => {
	render(<Harness />);
	await userEvent.click(screen.getByRole('button', { name: '알림 열기' }));
	await waitFor(() => expect(screen.getByText('알림 본문')).toBeInTheDocument());

	const overlay = document.querySelector('[data-slot="alert-dialog-overlay"]')!;
	await userEvent.click(overlay);

	expect(screen.getByText('알림 본문')).toBeInTheDocument();
});

test('ESC 로는 닫히고, confirm 은 false 로 정산된다', async () => {
	render(<Harness />);
	let reason: string | undefined;
	let resolved: boolean | undefined;
	void $ui.confirm('확인 본문', { onClose: (r) => (reason = r.reason) }).then((v) => (resolved = v));

	await waitFor(() => expect(screen.getByText('확인 본문')).toBeInTheDocument());
	await userEvent.keyboard('{Escape}');

	await waitFor(() => expect(resolved).toBe(false));
	expect(reason).toBe('escape');
});
