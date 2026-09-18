---
title: Select 컴포넌트
tags: [select, dropdown, 드롭다운, 선택, combobox, option, 옵션]
scope: component
---

# Select 컴포넌트

## 임포트

```typescript
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@axiom/components/ui';
```

## 기본 사용 예시

```tsx
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@axiom/components/ui';

// 단순 Select
<Select>
  <SelectTrigger className="w-[180px]">
    <SelectValue placeholder="선택하세요" />
  </SelectTrigger>
  <SelectContent>
    <SelectItem value="active">활성</SelectItem>
    <SelectItem value="inactive">비활성</SelectItem>
    <SelectItem value="pending">대기중</SelectItem>
  </SelectContent>
</Select>
```

## 제어 컴포넌트 패턴 (value + onValueChange)

```tsx
import { useState } from 'react';
import {
  Select, SelectContent, SelectItem,
  SelectTrigger, SelectValue,
} from '@axiom/components/ui';
import { Label } from '@axiom/components/ui';

function StatusFilter() {
  const [status, setStatus] = useState<string>('');

  return (
    <div className="space-y-1">
      <Label>상태 필터</Label>
      <Select value={status} onValueChange={setStatus}>
        <SelectTrigger className="w-[200px]">
          <SelectValue placeholder="전체" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">전체</SelectItem>
          <SelectItem value="active">활성</SelectItem>
          <SelectItem value="inactive">비활성</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
```

## 폼에서 쓰기 (useState + 검증 함수)

> 이 프로젝트에는 `react-hook-form`이 **없다**(따라서 `Controller`도 없다).
> `Select`는 `onChange`가 아니라 **`onValueChange`**를 쓴다 — 폼 전체 구조는
> [폼 처리 패턴](../patterns/form-handling.md).

```tsx
import { useState } from 'react';
import {
  Button, Label,
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from '@axiom/components/ui';

function CategoryForm() {
  const [category, setCategory] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    if (!category) {
      setError('카테고리를 선택하세요');
      return;
    }
    setError('');
    console.log({ category });
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div className="space-y-1">
        <Label htmlFor="category">카테고리</Label>
        <Select
          value={category}
          onValueChange={(v) => {
            setCategory(v);
            if (error) setError('');
          }}
        >
          <SelectTrigger id="category" aria-invalid={!!error}>
            <SelectValue placeholder="카테고리 선택" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="A">유형 A</SelectItem>
            <SelectItem value="B">유형 B</SelectItem>
            <SelectItem value="C">유형 C</SelectItem>
          </SelectContent>
        </Select>
        {error && <p className="text-sm text-destructive">{error}</p>}
      </div>
      <Button type="submit">저장</Button>
    </form>
  );
}
```

## 동적 옵션 (API 데이터 연동)

```tsx
const { data: categories } = useApi<{ id: number; name: string }[]>('/api/categories');

<Select>
  <SelectTrigger>
    <SelectValue placeholder="카테고리 선택" />
  </SelectTrigger>
  <SelectContent>
    {categories?.map((cat) => (
      <SelectItem key={cat.id} value={String(cat.id)}>
        {cat.name}
      </SelectItem>
    ))}
  </SelectContent>
</Select>
```
