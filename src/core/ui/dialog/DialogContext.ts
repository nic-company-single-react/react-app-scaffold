import { createContext } from 'react';
import type { IDialogApiHandle } from '@/types/components';

/**
 * 열려 있는 $ui.dialog 한 건의 제어 API 를 컨텐츠 트리에 내려주는 컨텍스트.
 *
 * UIDialogShell 이 항목마다 Provider 를 씌우고, 컨텐츠는 useDialog() 로 꺼내 씁니다.
 * defineDialog 로 감싼 컴포넌트는 이 값을 `dialog` prop 으로도 자동 주입받습니다.
 */
export const DialogContext = createContext<IDialogApiHandle<any> | null>(null);
