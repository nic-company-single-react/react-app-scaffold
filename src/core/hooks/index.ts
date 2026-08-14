export { useApi } from './use-api';
export type { IUseApiQueryOptions, IUseApiMutationOptions, UseApiMutationResult } from './use-api';

/* ── $ui.dialog 관련 훅 ──────────────────────────────────────────────────────
 * 구현은 `@/core/ui/dialog` 에 있지만, 화면 코드는 **항상 `@axiom/hooks` 에서** 가져옵니다.
 * (스캐폴드가 제공하는 훅의 창구는 여기 하나입니다)
 * -------------------------------------------------------------------------- */

// 다이얼로그 컨텐츠 안에서 쓰는 훅
export { useDialog, useDialogSafe, useDialogSubmit, useDialogGuard } from '@/core/ui/dialog/useDialog';
// 바탕 페이지의 state 를 $ui.dialog 의 props 로 살아있게 넘길 때 쓰는 훅
export { useLiveProps } from '@/core/ui/dialog/useLiveProps';
