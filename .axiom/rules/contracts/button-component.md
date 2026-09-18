---
id: button-component
kind: contract
axiomSchema: 1
title: "버튼은 <Button> 컴포넌트 (@axiom/components/ui)"
requiresPatchMode: true
---
- 버튼은 raw `<button>` 대신 scaffold의 `<Button>`(@axiom/components/ui)을 사용하세요 — 디자인토큰·다크모드·포커스링이 적용된 표준 버튼입니다. import: `import { Button } from '@axiom/components/ui';`
  · variant: `default`(주요) | `secondary` | `outline` | `ghost` | `destructive`(삭제·위험) | `link`, size: `xs` | `sm` | `default`(기본) | `lg`, 아이콘 전용 `icon` | `icon-xs` | `icon-sm` | `icon-lg`. `onClick`·`type`·`disabled` 등 표준 `<button>` 속성을 그대로 받습니다.
- ⛔ 기존 `<button>`을 `<Button>`으로 **변경**할 때는 반드시 **아래 둘을 함께** 출력하세요 (하나라도 빠지면 화면이 바뀌지 않습니다):
  1) import 추가: `import { Button } from '@axiom/components/ui';`
  2) **JSX 태그 자체 교체**: `<button …>…</button>` → `<Button …>…</Button>` (여는·닫는 태그 모두). 기존 `onClick`·이벤트·자식(children)은 그대로 유지하고, Tailwind 색/모양 className(`bg-blue-500 text-white rounded` 등)은 가능하면 `variant`로 대체하세요(대응이 불명확하면 className 유지).
  · ⚠ **import만 추가하고 JSX의 `<button>`을 그대로 두지 마세요** — import는 실제로 `<Button>`이 쓰일 때만 의미가 있습니다.
