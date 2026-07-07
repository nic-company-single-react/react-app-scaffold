// 모든 UI 컴포넌트를 한 곳에서 관리하기 위한 통합 허브 파일
import loadable from '@loadable/component';

// ── 가벼운 것: 그대로 static export ─────────────────────────
export * from '../lib/shadcn/ui';

// 타입 헬퍼(defineColumns)와 타입은 가벼우니 static 유지
// defineColumns는 ./smart-table 배럴이 아니라 ./smart-table/types에서 가져오세요.
// ./smart-table(index)는 SmartTable 컴포넌트까지 static으로 끌고 오므로, 그러면 다시 무거운 코드가 배럴 청크로 딸려옵니다.
// types 파일에서 직접 뽑아야 분리가 유지됩니다.
export { defineColumns } from './smart-table/types';
export type { ISmartTableProps, ISmartTableHandle, ISmartColumn, SmartColumns, SmartFormat } from './smart-table';

// ── 무거운 것: 배럴 안에서 동적 import로 분리 ──────────────────
// 표면은 동일하지만, 실제 코드는 별도 청크로 빠지고 렌더될 때만 로드됨
// loadable은 제네릭(<TRow, TRaw>)을 지워버리므로, 원본 컴포넌트 타입으로 캐스팅해 제네릭을 복원한다.
export const SmartTable = loadable(
	() => import('./smart-table/SmartTable'),
) as unknown as typeof import('./smart-table/SmartTable').default;
export const CodeBlock = loadable(() => import('../components/ui/codeblock').then((m) => ({ default: m.CodeBlock })));
