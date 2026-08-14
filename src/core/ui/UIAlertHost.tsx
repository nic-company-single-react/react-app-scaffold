import AlertSkin from '@/shared/ui/overlay/AlertSkin';
import { useAlertFrame } from './useAlertFrame';

/**
 * 전역 $ui.alert / $ui.confirm 을 렌더링하는 호스트.
 * AppProviders 에서 앱 전체에 단 한 번 마운트되며, 큐의 맨 앞 항목만 표시한다.
 *
 * 동작은 `useAlertFrame` 이 계산하고(core), 그리는 일은 `AlertSkin` 이 한다(shared).
 * 프로젝트 스타일에 맞춰 껍데기를 고칠 때는 `src/shared/ui/overlay/AlertSkin.tsx` 만 열면 된다.
 *
 * ※ 임의 컨텐츠를 담는 $ui.dialog 는 별도 스택 호스트가 담당한다 → `./dialog/UIDialogStackHost`.
 */
export function UIAlertHost(): React.ReactNode {
	const frame = useAlertFrame();
	if (!frame) return null;

	return <AlertSkin frame={frame} />;
}
