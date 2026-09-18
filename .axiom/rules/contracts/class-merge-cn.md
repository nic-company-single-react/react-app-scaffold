---
id: class-merge-cn
kind: contract
axiomSchema: 1
title: "className 병합 (cn)"
---
- 조건부·동적·외부주입(className prop) 클래스를 합칠 때는 `cn()`을 쓰세요: `import { cn } from '@/shared/utils/cn';` → `className={cn('rounded border', disabled && 'opacity-50', className)}`.
- ⛔ 템플릿리터럴/문자열 `+`로 클래스를 손수 잇지 마세요 — `cn()`은 `clsx`+`tailwind-merge`로 Tailwind 충돌(`px-2`↔`px-4`)을 마지막 값으로 정리합니다(정적 문자열만이면 그대로 두어도 됩니다).
