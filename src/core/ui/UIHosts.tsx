import UIDialogStackHost from './dialog/UIDialogStackHost';
import { UIAlertHost } from './alert/UIAlertHost';
import { AppToaster } from './toast/AppToaster';

/**
 * 앱 전역 UI 호스트 묶음.
 *
 * `AppProviders` 는 이것 하나만 렌더하면 되므로, 앞으로 호스트가 늘어나도
 * Provider 조립부를 건드릴 필요가 없다.
 *
 * 렌더 순서는 DOM 순서일 뿐 겹침 순서를 결정하지 않는다.
 * 실제 겹침은 z-index 티어가 정한다 → `src/shared/ui/overlay/overlay-layers.ts`
 *   $ui.dialog 스택(100000+) < $ui.alert/confirm(100500) < 토스트(100600)
 */
export function UIHosts(): React.ReactNode {
	return (
		<>
			{/* 전역 $ui.dialog — 임의 컴포넌트를 담는 모달 스택 (중첩 허용) */}
			<UIDialogStackHost />
			{/* 전역 $ui.alert / $ui.confirm — FIFO 큐, 항상 최상단 */}
			<UIAlertHost />
			{/* 전역 토스트 — 어디서든 toast(...) 호출 시 여기로 렌더된다 */}
			<AppToaster />
		</>
	);
}
