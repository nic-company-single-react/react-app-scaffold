// [jsdom] $ui.dialog 컨트롤러의 "정산(settle) 불변식" 검증.
//
// 여기서 지키려는 것은 단 하나 — **Promise 는 정확히 한 번 반드시 resolve 된다.**
// 이게 깨지면 `await $ui.dialog(...)` 가 영원히 멈추거나(누수), 결과가 두 번 확정된다.
import { createWindowUI } from '@/core/ui';
import { CLOSE_ANIM_MS } from '@/shared/ui/overlay/overlay-layers';
import { getDialogRuntime, useDialogStackStore } from '../dialogStore';
import { MAX_STACK_DEPTH, closeAllDialogs, requestCloseDialog, settleDialog } from '../dialogController';
import type { IDialogResult, IUI } from '@/types/components';

/** 테스트용 더미 컨텐츠 (렌더되지 않는다 — 호스트를 마운트하지 않으므로) */
function DummyContent(): null {
	return null;
}

/** CLOSE_ANIM_MS 만큼 기다려 스택 제거까지 끝낸다. */
const flushRemoval = () => new Promise((resolve) => setTimeout(resolve, CLOSE_ANIM_MS + 20));

let ui: IUI;

beforeEach(() => {
	// $router 는 컨트롤러가 pathname 스냅샷을 찍을 때만 쓴다.
	window.$router = {
		getLocation: () => ({ pathname: '/test', search: '', hash: '', state: null, key: 'k' }),
		subscribe: () => () => {},
	} as unknown as typeof window.$router;

	ui = createWindowUI();
	window.$ui = ui;
	useDialogStackStore.setState({ stack: [] });
});

describe('$ui.dialog 정산 불변식 (jsdom)', () => {
	it('열면 스택에 쌓이고 count() 에 반영된다', () => {
		ui.dialog({ component: DummyContent });
		expect(ui.dialog.count()).toBe(1);
		expect(useDialogStackStore.getState().stack).toHaveLength(1);
	});

	it('닫으면 undefined 로 resolve 되고 애니메이션 후 스택에서 빠진다', async () => {
		const handle = ui.dialog({ component: DummyContent });
		void requestCloseDialog(handle.id, 'escape');

		await expect(handle).resolves.toBeUndefined();

		await flushRemoval();
		expect(useDialogStackStore.getState().stack).toHaveLength(0);
	});

	it('여러 경로로 중복 닫아도 resolve 는 한 번만 일어난다', async () => {
		let settleCount = 0;
		const handle = ui.dialog({
			component: DummyContent,
			onClose: () => {
				settleCount += 1;
			},
		});

		// 버튼 · ESC · 배경 · 코드 닫기가 연달아 들어오는 상황
		await requestCloseDialog(handle.id, 'cancel');
		await requestCloseDialog(handle.id, 'escape');
		await requestCloseDialog(handle.id, 'overlay');
		settleDialog(handle.id, 'programmatic');

		await expect(handle).resolves.toBeUndefined();
		expect(settleCount).toBe(1);
	});

	it('컨텐츠가 넘긴 결과값으로 resolve 된다', async () => {
		const handle = ui.dialog({ component: DummyContent });
		void requestCloseDialog(handle.id, 'submit', { id: 7, name: '김철수' });

		await expect(handle).resolves.toEqual({ id: 7, name: '김철수' });
	});

	it('beforeClose 가 false 를 반환하면 닫히지 않는다', async () => {
		let allow = false;
		const handle = ui.dialog({ component: DummyContent, beforeClose: () => allow });

		await requestCloseDialog(handle.id, 'cancel');
		expect(handle.isOpen()).toBe(true);

		allow = true;
		await requestCloseDialog(handle.id, 'cancel');
		expect(handle.isOpen()).toBe(false);
		await expect(handle).resolves.toBeUndefined();
	});

	it('beforeClose 가 throw 해도 fail-open 으로 닫힌다 (닫히지 않는 모달 방지)', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});
		const handle = ui.dialog({
			component: DummyContent,
			beforeClose: () => {
				throw new Error('가드 폭발');
			},
		});

		await requestCloseDialog(handle.id, 'cancel');
		await expect(handle).resolves.toBeUndefined();
		spy.mockRestore();
	});

	it('handle.close() 는 beforeClose 와 dismissable:false 를 우회한다 (Promise 누수 방지)', async () => {
		const handle = ui.dialog({
			component: DummyContent,
			dismissable: false,
			beforeClose: () => false,
		});

		// 사용자 경로는 잠겨 있다
		await requestCloseDialog(handle.id, 'escape');
		expect(handle.isOpen()).toBe(true);

		// 코드 닫기는 통과해야 한다
		handle.close();
		await expect(handle).resolves.toBeUndefined();
	});

	it('제출 핸들러가 undefined 를 반환하면 닫지 않는다', async () => {
		const handle = ui.dialog({ component: DummyContent });
		let valid = false;
		getDialogRuntime(handle.id).submit = () => (valid ? 'ok' : undefined);

		await requestCloseDialog(handle.id, 'confirm');
		expect(handle.isOpen()).toBe(true);

		valid = true;
		await requestCloseDialog(handle.id, 'confirm');
		await expect(handle).resolves.toBe('ok');
	});

	it('제출 핸들러가 없으면 확인은 footer.confirmValue(기본 true)로 resolve 된다', async () => {
		const a = ui.dialog({ component: DummyContent });
		await requestCloseDialog(a.id, 'confirm');
		await expect(a).resolves.toBe(true);

		const b = ui.dialog({ component: DummyContent, footer: { confirmValue: 'saved' } });
		await requestCloseDialog(b.id, 'confirm');
		await expect(b).resolves.toBe('saved');
	});

	it('closeAll() 은 열린 전부를 undefined 로 정산한다', async () => {
		const a = ui.dialog({ component: DummyContent });
		const b = ui.dialog({ component: DummyContent });
		const c = ui.dialog({ component: DummyContent, beforeClose: () => false });

		closeAllDialogs();

		await expect(Promise.all([a, b, c])).resolves.toEqual([undefined, undefined, undefined]);
		expect(ui.dialog.count()).toBe(0);
	});

	it('라우트 닫기(reason: route)는 가드를 우회하고 onClose 에 reason 을 전달한다', async () => {
		let received: IDialogResult<unknown> | null = null;
		const handle = ui.dialog({
			component: DummyContent,
			beforeClose: () => false,
			onClose: (result) => {
				received = result;
			},
		});

		// UIDialogStackHost 의 라우트 구독이 하는 일과 동일하다.
		settleDialog(handle.id, 'route');

		await expect(handle).resolves.toBeUndefined();
		expect(received).toMatchObject({ reason: 'route', confirmed: false });
	});

	it('컨텐츠 렌더 실패(reason: error)도 정산된다', async () => {
		const handle = ui.dialog({ component: DummyContent });
		// DialogErrorBoundary 가 하는 일과 동일하다.
		settleDialog(handle.id, 'error');
		await expect(handle).resolves.toBeUndefined();
	});

	it('스택 깊이 상한을 넘으면 열지 않고 즉시 정산한다', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const opened = Array.from({ length: MAX_STACK_DEPTH }, () => ui.dialog({ component: DummyContent }));
		expect(ui.dialog.count()).toBe(MAX_STACK_DEPTH);

		const overflow = ui.dialog({ component: DummyContent });
		await expect(overflow).resolves.toBeUndefined();
		expect(ui.dialog.count()).toBe(MAX_STACK_DEPTH);

		closeAllDialogs();
		await Promise.all(opened);
		spy.mockRestore();
	});

	it('중복 id 로 열면 새로 쌓지 않고 즉시 정산한다', async () => {
		const spy = vi.spyOn(console, 'error').mockImplementation(() => {});

		const first = ui.dialog({ component: DummyContent, id: 'dup' });
		const second = ui.dialog({ component: DummyContent, id: 'dup' });

		await expect(second).resolves.toBeUndefined();
		expect(ui.dialog.count()).toBe(1);
		expect(first.isOpen()).toBe(true);

		spy.mockRestore();
	});

	it('update() 는 props 를 얕은 병합한다', () => {
		const handle = ui.dialog({
			component: DummyContent as never,
			props: { percent: 0, filename: 'a.xlsx' },
		} as never);

		handle.update({ percent: 60 });

		const item = useDialogStackStore.getState().stack.find((it) => it.id === handle.id);
		expect(item?.props).toEqual({ percent: 60, filename: 'a.xlsx' });
	});

	it('정산 후에는 update() 가 무시된다', async () => {
		const handle = ui.dialog({ component: DummyContent as never, props: { percent: 0 } } as never);
		handle.close();
		await handle;

		handle.update({ percent: 99 });
		const item = useDialogStackStore.getState().stack.find((it) => it.id === handle.id);
		expect(item?.props).toEqual({ percent: 0 });
	});

	it('반환 핸들은 진짜 Promise 라 then/finally 가 동작한다', async () => {
		const handle = ui.dialog({ component: DummyContent });
		const seen: string[] = [];

		const chained = handle.then(() => seen.push('then')).finally(() => seen.push('finally'));
		void requestCloseDialog(handle.id, 'cancel');
		await chained;

		expect(seen).toEqual(['then', 'finally']);
	});
});
