import type { ComponentType } from 'react';
import type { IDialogInjected, TDialogComponent } from '@/types/components';

/**
 * 다이얼로그 컨텐츠 컴포넌트를 정의합니다.
 * (`defineColumns`(smart-table)와 같은 계열의 타입 추론 헬퍼입니다)
 *
 * 두 가지를 해줍니다.
 * 1. **결과 타입 T 를 컴포넌트에 각인**해서, 호출부 `$ui.dialog({ component })` 가
 *    `Promise<T | undefined>` 로 자동 추론되게 합니다.
 * 2. `dialog` prop 을 컴포넌트 시그니처에서 **감춰** 호출부가 넘기지 않아도 되게 합니다.
 *    (실제 주입은 UIDialogShell 이 합니다)
 *
 * @typeParam P 호출부에서 넘길 props (`dialog` 제외)
 * @typeParam T `$ui.dialog` 가 resolve 할 결과 타입
 *
 * @example
 * function MemberPicker({ deptId, dialog }: IMemberPickerProps & IDialogInjected<IMember>) {
 *   return <Button onClick={() => dialog.close(member)}>선택</Button>;
 * }
 * export default defineDialog<IMemberPickerProps, IMember>(MemberPicker);
 *
 * // 호출부 — props 는 타입체크되고 결과는 IMember | undefined 로 추론된다
 * const member = await $ui.dialog({ component: MemberPicker, props: { deptId: 3 } });
 */
export function defineDialog<P extends object = Record<string, never>, T = void>(
	Component: ComponentType<P & IDialogInjected<T>>,
): TDialogComponent<P, T> {
	// 런타임에는 아무것도 하지 않는다. 브랜드는 타입 레벨 팬텀 필드일 뿐이다.
	return Component as unknown as TDialogComponent<P, T>;
}
