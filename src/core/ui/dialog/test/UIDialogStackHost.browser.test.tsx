// [browser] 진짜 Chromium 에서만 확인 가능한 것들 — 중첩 레이어, ESC 우선순위, body pointer-events 복원.
// jsdom 은 Radix 의 focus trap / DismissableLayer / react-remove-scroll 을 제대로 재현하지 못한다.
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { createWindowUI } from '@/core/ui';
import { useUIStore } from '@/core/ui/alert/alertStore';
import { UIAlertHost } from '@/core/ui/alert/UIAlertHost';
import { Z_ALERT, Z_DIALOG_BASE } from '@/shared/ui/overlay/overlay-layers';
import UIDialogStackHost from '../UIDialogStackHost';
import { useDialogStackStore } from '../dialogStore';
import { closeAllDialogs } from '../dialogController';
import { useDialog } from '../useDialog';

/**
 * 테스트용 호스트 묶음.
 * 실제 앱은 `UIHosts` 를 쓰지만 거기엔 AppToaster(ThemeProvider 필요)가 포함돼 있어,
 * 여기서는 검증 대상인 두 호스트만 띄운다.
 */
function TestHosts(): React.ReactNode {
	return (
		<>
			<UIDialogStackHost />
			<UIAlertHost />
		</>
	);
}

/** 결과를 돌려주는 최소 컨텐츠 */
function PickerContent(): React.ReactNode {
	const dialog = useDialog<string>();
	return (
		<div>
			<p>피커 본문</p>
			<button
				type="button"
				onClick={() => dialog.close('picked')}
			>
				고르기
			</button>
		</div>
	);
}

/** 열려 있는 다이얼로그 본체(DialogContent)의 z-index 를 읽는다. */
function zIndexOf(el: Element): number {
	return Number(getComputedStyle(el).zIndex);
}

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
	// 테스트끼리 오염되지 않게 dialog 스택과 alert 큐를 모두 비운다.
	// (열려 있는 alert 이 남으면 body 의 pointer-events 가 계속 잠긴 채로 다음 테스트에 넘어간다)
	closeAllDialogs();
	useDialogStackStore.setState({ stack: [] });
	useUIStore.setState({ queue: [] });
	document.body.style.pointerEvents = '';
});

describe('$ui.dialog 중첩 동작 (browser)', () => {
	it('컨텐츠를 렌더하고 dialog.close(값) 으로 결과를 돌려준다', async () => {
		const user = userEvent.setup();
		render(<TestHosts />);

		const handle = window.$ui.dialog({ component: PickerContent, title: '회원 선택', footer: false });

		expect(await screen.findByText('피커 본문')).toBeInTheDocument();
		await user.click(screen.getByRole('button', { name: '고르기' }));

		await expect(handle).resolves.toBe('picked');
	});

	it('$ui.confirm 은 열려 있는 dialog 보다 위 레이어에 뜬다', async () => {
		render(<TestHosts />);

		window.$ui.dialog({ component: PickerContent, title: '아래 다이얼로그', footer: false });
		await screen.findByText('피커 본문');

		void window.$ui.confirm({ message: '위에 떠야 합니다' });
		await screen.findByText('위에 떠야 합니다');

		const dialogContent = document.querySelector('[data-slot="dialog-content"]')!;
		const alertContent = document.querySelector('[data-slot="alert-dialog-content"]')!;

		expect(zIndexOf(dialogContent)).toBe(Z_DIALOG_BASE);
		expect(zIndexOf(alertContent)).toBe(Z_ALERT);
		expect(zIndexOf(alertContent)).toBeGreaterThan(zIndexOf(dialogContent));
	});

	it('ESC 는 최상단 레이어 하나만 닫는다', async () => {
		const user = userEvent.setup();
		render(<TestHosts />);

		const dialogHandle = window.$ui.dialog({ component: PickerContent, title: '아래', footer: false });
		await screen.findByText('피커 본문');

		const confirmPromise = window.$ui.confirm({ message: '위' });
		await screen.findByText('위');

		await user.keyboard('{Escape}');

		// confirm 만 닫히고 아래 dialog 는 살아 있어야 한다.
		await expect(confirmPromise).resolves.toBe(false);
		expect(dialogHandle.isOpen()).toBe(true);
		expect(screen.getByText('피커 본문')).toBeInTheDocument();
	});

	it('dialog 를 두 겹 쌓으면 z-index 가 깊이만큼 올라간다', async () => {
		render(<TestHosts />);

		window.$ui.dialog({ component: PickerContent, title: '1층', footer: false });
		window.$ui.dialog({ component: PickerContent, title: '2층', footer: false });

		await waitFor(() => {
			expect(document.querySelectorAll('[data-slot="dialog-content"]')).toHaveLength(2);
		});

		const [first, second] = Array.from(document.querySelectorAll('[data-slot="dialog-content"]'));
		expect(zIndexOf(second)).toBeGreaterThan(zIndexOf(first));
	});

	it('전부 닫으면 body 의 pointer-events 가 복원된다', async () => {
		render(<TestHosts />);

		window.$ui.dialog({ component: PickerContent, title: '1층', footer: false });
		window.$ui.dialog({ component: PickerContent, title: '2층', footer: false });
		await waitFor(() => {
			expect(document.querySelectorAll('[data-slot="dialog-content"]')).toHaveLength(2);
		});

		closeAllDialogs();

		await waitFor(
			() => {
				expect(document.querySelectorAll('[data-slot="dialog-content"]')).toHaveLength(0);
				expect(document.body.style.pointerEvents).not.toBe('none');
			},
			{ timeout: 3000 },
		);
	});

	it('dismissable: false 면 ESC 로 닫히지 않는다', async () => {
		const user = userEvent.setup();
		render(<TestHosts />);

		const handle = window.$ui.dialog({
			component: PickerContent,
			title: '잠금',
			footer: false,
			dismissable: false,
		});
		await screen.findByText('피커 본문');

		await user.keyboard('{Escape}');
		await new Promise((resolve) => setTimeout(resolve, 100));

		expect(handle.isOpen()).toBe(true);

		// 코드 닫기는 통과해야 한다 (Promise 누수 방지)
		handle.close();
		await expect(handle).resolves.toBeUndefined();
	});
});
