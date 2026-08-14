import DialogSkin from '@/shared/ui/overlay/DialogSkin';
import { useDialogFrame } from './useDialogFrame';
import type { IDialogStackItem } from './dialogStore';

export interface IUIDialogShellProps {
	item: IDialogStackItem;
	/** 스택 깊이 (0 = 최하단) */
	depth: number;
	/** 최상단 항목인지 */
	isTop: boolean;
}

/**
 * $ui.dialog 스택 항목 1개를 렌더한다.
 *
 * 동작은 전부 `useDialogFrame` 이 계산하고(core), 그리는 일은 `DialogSkin` 이 한다(shared).
 * 프로젝트 스타일에 맞춰 껍데기를 고칠 때는 `src/shared/ui/overlay/DialogSkin.tsx` 만 열면 된다.
 */
export default function UIDialogShell({ item, depth, isTop }: IUIDialogShellProps): React.ReactNode {
	const frame = useDialogFrame(item, depth, isTop);

	return (
		<DialogSkin
			frame={frame}
			option={item.option}
		/>
	);
}
