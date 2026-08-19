import { createContext } from 'react';
import type { IDialogApiHandle } from '@/types/components';

/**
 * 열려 있는 $ui.dialog 한 건의 제어 API 를 컨텐츠 트리에 내려주는 컨텍스트.
 *
 * DialogBody 가 항목마다 Provider 를 씌우고, 컨텐츠는 useDialog() 로 꺼내 씁니다.
 * 컨텐츠가 평범한 컴포넌트여도 되는 이유가 이것입니다 — props 주입이 아니라 컨텍스트로 내려갑니다.
 */
export const DialogContext = createContext<IDialogApiHandle<any> | null>(null);
