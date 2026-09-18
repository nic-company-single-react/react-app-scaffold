---
title: Input / Label 컴포넌트
tags: [input, 입력, text, 텍스트, label, 라벨, 필드, textfield]
scope: component
---

# Input / Label 컴포넌트

## 임포트

```typescript
import { Input, Label } from '@axiom/components/ui';
```

## 기본 사용 예시

```tsx
import { Input, Label } from '@axiom/components/ui';

// 단순 Input
<Input placeholder="이름을 입력하세요" />

// Label + Input 조합
<div className="space-y-1">
  <Label htmlFor="username">사용자명</Label>
  <Input id="username" placeholder="사용자명" />
</div>

// 타입 지정
<Input type="password" placeholder="비밀번호" />
<Input type="email" placeholder="이메일" />
<Input type="number" placeholder="숫자" />

// 비활성화
<Input disabled value="읽기 전용" />
```

## 폼에서 쓰기 (useState + 검증 함수)

> 이 프로젝트에는 `react-hook-form`이 **없다.** 폼은 `useState`와 검증 함수로 만든다 —
> 자세한 것은 [폼 처리 패턴](../patterns/form-handling.md).

```tsx
import { useState } from 'react';
import { Button, Input, Label } from '@axiom/components/ui';

type TUserValues = { name: string; email: string };

const validators: Record<keyof TUserValues, (v: TUserValues) => string | undefined> = {
  name: ({ name }) => (name.trim() ? undefined : '이름은 필수입니다'),
  email: ({ email }) => (email.includes('@') ? undefined : '이메일 형식이 올바르지 않습니다'),
};

function UserForm() {
  const [values, setValues] = useState<TUserValues>({ name: '', email: '' });
  const [errors, setErrors] = useState<Partial<Record<keyof TUserValues, string>>>({});

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    const next: Partial<Record<keyof TUserValues, string>> = {};
    (Object.keys(validators) as (keyof TUserValues)[]).forEach((k) => {
      const msg = validators[k](values);
      if (msg) next[k] = msg;
    });
    setErrors(next);
    if (Object.keys(next).length > 0) return;
    console.log(values);
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="name">이름</Label>
        <Input
          id="name"
          value={values.name}
          onChange={(e) => setValues({ ...values, name: e.target.value })}
          aria-invalid={!!errors.name}
          placeholder="이름"
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name}</p>}
      </div>
      <div className="space-y-1">
        <Label htmlFor="email">이메일</Label>
        <Input
          id="email"
          type="email"
          value={values.email}
          onChange={(e) => setValues({ ...values, email: e.target.value })}
          aria-invalid={!!errors.email}
          placeholder="이메일"
        />
        {errors.email && <p className="text-sm text-destructive">{errors.email}</p>}
      </div>
      <Button type="submit">저장</Button>
    </form>
  );
}
```

## 검색 Input 패턴

```tsx
import { useState } from 'react';
import { Input } from '@axiom/components/ui';
import { Search } from 'lucide-react';

function SearchBar({ onSearch }: { onSearch: (q: string) => void }) {
  const [value, setValue] = useState('');

  return (
    <div className="relative">
      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
      <Input
        className="pl-9"
        placeholder="검색..."
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onSearch(e.target.value);
        }}
      />
    </div>
  );
}
```
