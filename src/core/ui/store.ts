import { create } from 'zustand';
import type { IAlertDialogOption, IConfirmDialogOption } from '@/types/components';

/**
 * $ui 다이얼로그 큐의 한 항목.
 *
 * alert/confirm 은 정규화된(기본값/ id 가 채워지기 전 원본) 옵션을 그대로 담고,
 * 사용자가 닫을 때 호출할 resolve 콜백을 함께 보관합니다.
 * (resolve 는 직렬화가 필요 없으므로 상태에 보관해도 문제 없습니다.)
 */
export type DialogItem =
	| { kind: 'alert'; option: IAlertDialogOption; resolve: () => void }
	| { kind: 'confirm'; option: IConfirmDialogOption; resolve: (value: boolean) => void };

interface UIState {
	/** FIFO 큐. Host 는 항상 queue[0] 만 렌더링합니다. */
	queue: DialogItem[];
	/** 큐 맨 뒤에 다이얼로그를 추가합니다. */
	enqueue: (item: DialogItem) => void;
	/** 큐 맨 앞 항목을 제거합니다. */
	dequeue: () => void;
}

export const useUIStore = create<UIState>((set) => ({
	queue: [],
	enqueue: (item) => set((state) => ({ queue: [...state.queue, item] })),
	dequeue: () => set((state) => ({ queue: state.queue.slice(1) })),
}));
