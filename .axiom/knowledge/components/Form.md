---
title: Form 컴포넌트 — 이 프로젝트에는 없습니다
tags: [form, 폼, 양식, submit, 제출, react-hook-form, reacthookform, hookform, zod, zodresolver, validation, 유효성, formfield, formitem, formlabel, formmessage, formcontrol, useform]
scope: component
related: [patterns/form-handling.md, page-templates/form-page.md]
---

# Form 컴포넌트 — **이 프로젝트에는 없습니다**

> **결론부터**: `react-app-scaffold`에는 shadcn/ui `Form` 6종(`Form`·`FormField`·`FormItem`·
> `FormLabel`·`FormControl`·`FormMessage`)이 **없고**, `react-hook-form`·`zod`·`@hookform/resolvers`도
> **설치되어 있지 않습니다.**
>
> 폼은 **`useState` + 검증 함수**로 만듭니다. 방법은 [폼 처리 패턴](../patterns/form-handling.md)에 있습니다.

## 쓰면 어떻게 되나

아래 코드는 **화면이 뜨기도 전에 오류가 납니다.**

```tsx
// ❌ 전부 없는 것들 — 이렇게 쓰면 안 됩니다
import { useForm } from 'react-hook-form';                    // 패키지 없음
import { zodResolver } from '@hookform/resolvers/zod';        // 패키지 없음
import { z } from 'zod';                                      // 패키지 없음
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage }
  from '@axiom/components/ui';                                // 배럴에 없음
```

2026-09-06 실기기에서 이 조합으로 폼 골격을 찍었다가 **생성 즉시 오류 18건**이 났습니다.
그래서 폼 라이브러리를 쓰지 않기로 정했습니다.

## 대신 무엇을 쓰나

배럴(`@axiom/components/ui`)에 **실재하는 것**만 씁니다.

| 필요한 것 | 이 프로젝트에서 |
| --- | --- |
| 폼 컨테이너 | 표준 `<form onSubmit={...} noValidate>` |
| 라벨 | `Label` (`htmlFor`로 입력 `id`와 짝) |
| 입력 | `Input` · `Textarea` · `Select` · `NativeSelect` · `Checkbox` · `Switch` · `RadioGroup` |
| 오류 메시지 | 직접 그리는 `<p className="text-sm text-destructive">` |
| 검증 | `useState` + 필드별 검증 함수 (라이브러리 없음) |
| 버튼 | `Button` (취소는 **`type="button"`**) |

## 최소 예제

```tsx
import { useState } from 'react';
import { Button, Input, Label } from '@axiom/components/ui';

type TValues = { name: string; email: string };

const validators: Record<keyof TValues, (v: TValues) => string | undefined> = {
  name: ({ name }) => (name.trim() ? undefined : '이름을 입력해 주세요.'),
  email: ({ email }) => (email.includes('@') ? undefined : '이메일 형식이 올바르지 않습니다.'),
};

export default function CreateUserForm() {
  const [values, setValues] = useState<TValues>({ name: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof TValues, string>>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const next: Partial<Record<keyof TValues, string>> = {};
    (Object.keys(validators) as (keyof TValues)[]).forEach((k) => {
      const msg = validators[k](values);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    // TODO: 저장 API 호출
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="grid gap-1.5">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          aria-invalid={!!errors.name}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <Button type="submit">저장</Button>
    </form>
  );
}
```

## 더 자세한 것

- **표준 폼 화면 전체** — [화면 템플릿 — 폼 화면](../page-templates/form-page.md)
- **검증 시점(blur·change·submit)·첫 오류 칸 포커스** — [폼 처리 패턴](../patterns/form-handling.md)
- **입력 컴포넌트 각각의 prop** — `.axiom/guide/components/ui/` 의 `input-component.md` · `label-component.md` 등
