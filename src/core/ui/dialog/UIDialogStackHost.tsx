import { useEffect } from 'react';
import { CLOSE_ANIM_MS } from '@/shared/ui/overlay/overlay-layers';
import { useUIStore } from '../store';
import UIDialogShell from './UIDialogShell';
import { settleDialog } from './dialogController';
import { useDialogStackStore } from './dialogStore';

/**
 * 전역 $ui.dialog 스택을 렌더하는 호스트.
 *
 * `AppProviders` 에서 앱 전체에 단 한 번 마운트되며, 스택의 **모든** 항목을 동시에 렌더한다
 * (alert/confirm 의 FIFO 큐와 달리 중첩이 목적이다).
 */
export default function UIDialogStackHost(): React.ReactNode {
	const stack = useDialogStackStore((s) => s.stack);
	const alertQueueLength = useUIStore((s) => s.queue.length);

	// ── 라우트 변경 시 자동 닫기 ──────────────────────────────────────────
	// pathname 이 바뀔 때만 발동한다. 순수 ?query 변경까지 잡으면 다이얼로그가 스스로
	// 검색 파라미터를 바꾸다 자기 자신을 닫아버린다.
	useEffect(() => {
		return window.$router.subscribe((location) => {
			for (const item of useDialogStackStore.getState().stack) {
				if (item.settled) continue;
				if (item.option.closeOnRouteChange === false) continue;
				if (item.openedPathname === location.pathname) continue;
				// 네비게이션은 이미 확정된 사실이므로 beforeClose 가드를 우회한다.
				settleDialog(item.id, 'route');
			}
		});
	}, []);

	// ── body pointer-events 안전망 ───────────────────────────────────────
	// Radix 는 modal 이 열리면 body 에 pointer-events:none 을 건다. 여러 레이어가 같은 tick 에
	// 열리고 닫히면 복원이 어긋나 "화면 전체 클릭 불가" 가 되는 알려진 엣지케이스가 있다.
	// dialog 스택과 alert 큐가 모두 비면 강제로 되돌린다.
	useEffect(() => {
		if (stack.length > 0 || alertQueueLength > 0) return;
		const timer = setTimeout(() => {
			if (document.body.style.pointerEvents === 'none') {
				document.body.style.pointerEvents = '';
			}
		}, CLOSE_ANIM_MS + 50);
		return () => clearTimeout(timer);
	}, [stack.length, alertQueueLength]);

	if (stack.length === 0) return null;

	const lastIndex = stack.length - 1;

	return (
		<>
			{stack.map((item, index) => (
				<UIDialogShell
					key={item.id}
					item={item}
					depth={index}
					isTop={index === lastIndex}
				/>
			))}
		</>
	);
}
