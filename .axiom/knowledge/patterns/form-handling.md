---
title: 폼 처리 패턴
tags: [form, 폼, 양식, validation, 유효성, submit, 제출, 폼검증, 입력검증, useState, 검증함수, react-hook-form, zod, 폼라이브러리]
scope: pattern
related: [components/Form.md, patterns/api-call.md, page-templates/form-page.md]
---

# 폼 처리 패턴

> ⚠️ **이 프로젝트는 폼 라이브러리를 쓰지 않습니다.**
> `react-hook-form`·`zod`·`@hookform/resolvers`는 **설치되어 있지 않고**, UI 배럴에
> shadcn `Form` 6종(`Form`·`FormField`·`FormItem`·`FormLabel`·`FormControl`·`FormMessage`)도
> **없습니다.** `useForm`이나 `<FormField>`를 쓰면 화면이 뜨기도 전에 오류가 납니다
> (2026-09-06 실기기에서 오류 18건).
>
> 폼은 **`useState` + 필드별 검증 함수**로 만듭니다. 아래가 그 표준입니다.

## 뼈대 — 상태 넷 + 검증 함수

```tsx
import { useState } from 'react';
import { Button, Input, Label } from '@axiom/components/ui';

/** 폼이 다루는 값 전체. 입력요소는 문자열만 담고, 숫자 변환은 제출 직전에 한다. */
type TCreateUserValues = {
  name: string;
  email: string;
};

/** 필드별 에러 메시지. 값이 없으면 그 필드는 통과한 상태다. */
type TErrors = Partial<Record<keyof TCreateUserValues, string>>;

const INITIAL: TCreateUserValues = { name: '', email: '' };

/** 화면에 놓인 순서. 제출 실패 시 "첫 번째 오류 칸"을 찾는 기준이 된다. */
const FIELD_ORDER: (keyof TCreateUserValues)[] = ['name', 'email'];

/**
 * 필드별 검증 규칙. 각 규칙은 **폼 값 전체**를 받는다 — "비밀번호 확인"처럼 다른 칸을
 * 참조해야 하는 검증이 반드시 생기기 때문이다. 통과하면 undefined, 실패하면 보여줄 메시지.
 */
const validators: Record<
  keyof TCreateUserValues,
  (values: TCreateUserValues) => string | undefined
> = {
  name: ({ name }) => (name.trim() ? undefined : '이름을 입력해 주세요.'),
  email: ({ email }) => {
    if (!email.trim()) return '이메일을 입력해 주세요.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
      ? undefined
      : '이메일 형식이 올바르지 않습니다.';
  },
};
```

상태는 **정확히 넷**이다. 더 만들지도, 줄이지도 않는다.

| 상태 | 무엇을 담나 | 왜 필요한가 |
| --- | --- | --- |
| `values` | 입력값 전체 | 화면에 보여주고 제출할 값 |
| `errors` | 필드별 오류 메시지 | 어떤 칸에 무슨 문구를 띄울지 |
| `touched` | 사용자가 벗어난 적 있는 필드 | **아직 건드리지도 않은 칸에 빨간 글씨를 띄우지 않으려고** |
| `submitting` | 저장 중인지 | 중복 제출을 막고 버튼 문구를 바꾸려고 |

```tsx
const [values, setValues] = useState<TCreateUserValues>(INITIAL);
const [errors, setErrors] = useState<TErrors>({});
const [touched, setTouched] = useState<Partial<Record<keyof TCreateUserValues, boolean>>>({});
const [submitting, setSubmitting] = useState(false);
```

## 검증 시점 셋

검증은 **세 시점**에서만 돈다. 이 셋이 폼의 성격을 정한다.

| 시점 | 무엇을 검증 | 왜 |
| --- | --- | --- |
| **blur** | 그 칸 하나 | 다 치고 나갈 때 알려준다 — 가장 덜 성가시다 |
| **change** | **이미 에러가 떠 있는 칸만** | 고치는 즉시 빨간 글씨를 걷어준다 |
| **submit** | 전체 | 마지막 관문 |

```tsx
/** 값 변경 — 이미 에러가 떠 있는 칸만 재검증해서, 고치는 즉시 메시지를 걷어준다. */
const setValue = (key: keyof TCreateUserValues, value: string): void => {
  const next = { ...values, [key]: value };
  setValues(next);
  if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validators[key](next) }));
};

/** 포커스 이탈 — 이 필드의 검증을 시작한다. */
const handleBlur = (key: keyof TCreateUserValues): void => {
  setTouched((prev) => ({ ...prev, [key]: true }));
  setErrors((prev) => ({ ...prev, [key]: validators[key](values) }));
};
```

> ⚠️ `setValue` 안에서는 `values`가 아니라 방금 만든 **`next`로 검증**해야 한다.
> `setValues`는 즉시 반영되지 않아, `values`로 검증하면 **한 글자 전 값**을 본다.
> 폼에서 가장 자주 나오는 실수다.

## 제출 — 전체 검증 + 첫 오류 칸 포커스

```tsx
const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
  e.preventDefault();
  if (submitting) return; // 중복 제출 방지 (버튼 disabled와 이중 방어)

  const next: TErrors = {};
  FIELD_ORDER.forEach((key) => {
    const message = validators[key](values);
    if (message) next[key] = message;
  });
  setErrors(next);
  setTouched(Object.fromEntries(FIELD_ORDER.map((key) => [key, true])));

  // 실패한 첫 칸으로 포커스를 옮긴다. 긴 폼에서 "어디가 틀렸는지" 찾는 수고를 없앤다.
  const firstInvalid = FIELD_ORDER.find((key) => next[key]);
  if (firstInvalid) {
    document.getElementById(firstInvalid)?.focus();
    return;
  }

  setSubmitting(true);
  // TODO: 저장 API 호출 (아래 "API 연결" 참고)
};
```

> 💡 `document.getElementById(firstInvalid)`가 동작하려면 **입력의 `id`가 필드 키와 같아야** 한다.
> `<Input id="name" …>` ↔ `values.name`. `id`를 `user-name`처럼 다르게 지으면 포커스가 안 간다.

## 필드 하나 그리기

`Label` + 입력 + 오류 문구가 한 묶음이다. 이 묶음을 필드 수만큼 반복한다.

```tsx
<div className="grid gap-1.5">
  <Label htmlFor="name">
    이름 <span className="text-destructive">*</span>
  </Label>
  <Input
    id="name"
    value={values.name}
    onChange={(e) => setValue('name', e.target.value)}
    onBlur={() => handleBlur('name')}
    aria-invalid={!!errors.name}
    aria-describedby="name-message"
    placeholder="이름을 입력하세요"
  />
  {errors.name && (
    <p
      id="name-message"
      role="alert"
      className="text-[11px] text-destructive"
    >
      {errors.name}
    </p>
  )}
</div>
```

`<form>`에는 **`noValidate`**를 준다 — 브라우저 기본 말풍선 대신 폼이 직접 메시지를 그린다.

```tsx
<form onSubmit={handleSubmit} noValidate className="space-y-4">
```

## 입력 컴포넌트별 변경 핸들러

`onChange`가 아닌 것들이 있다. 각 컴포넌트 문서의 API 표를 확인한다.

| 컴포넌트 | 핸들러 |
| --- | --- |
| `Input` · `Textarea` | `onChange={(e) => setValue('key', e.target.value)}` |
| `Select` | `onValueChange={(v) => setValue('key', v)}` |
| `NativeSelect` | `onChange={(e) => setValue('key', e.target.value)}` |
| `Checkbox` · `Switch` | `onCheckedChange={(v) => setValue('key', v === true ? 'Y' : 'N')}` |
| `RadioGroup` | `onValueChange={(v) => setValue('key', v)}` |

## API 연결

성공·실패와 무관하게 **`submitting` 잠금을 반드시 푼다.**

```tsx
setSubmitting(true);
try {
  await save(values);
  $ui.toast('저장했습니다.');
  $router.back();
} catch {
  $ui.alert('저장하지 못했습니다. 잠시 후 다시 시도해 주세요.');
} finally {
  setSubmitting(false);
}
```

> ⚠️ `finally`가 없으면 예상 못 한 오류가 났을 때 `submitting`이 `true`로 남아
> **저장 버튼이 영원히 비활성**이 된다. 사용자는 새로고침 말고 방법이 없다.

## 수정 폼 — 기존 값 채우기

등록 폼과 구조는 같고, **초기값을 서버에서 받아 채우는 것**만 다르다.

```tsx
const { id } = useParams();
const { data } = useApi(`/api/users/${id}`);

useEffect(() => {
  if (data) setValues({ name: data.name, email: data.email ?? '' });
}, [data]);
```

> ⚠️ `?? ''`를 빠뜨리면 서버가 준 `null`이 들어가 **"비제어에서 제어로 바뀌었다"** React 경고가 뜨고
> 이후 값이 반영되지 않는다. 입력에 넣는 값은 항상 문자열이어야 한다.

## 버튼 영역

```tsx
<div className="flex justify-end gap-2 pt-4">
  <Button type="button" variant="outline" onClick={() => $router.back()}>
    취소
  </Button>
  <Button type="submit" disabled={submitting}>
    {submitting ? '저장 중...' : '저장'}
  </Button>
</div>
```

> ⚠️ 취소 버튼에 **`type="button"`**을 꼭 준다. `<form>` 안의 버튼은 기본값이 `type="submit"`이라,
> 빼먹으면 취소를 눌렀는데 폼이 제출된다.

## 자주 하는 실수

| 증상 | 원인 | 고치는 법 |
| --- | --- | --- |
| `Cannot find module 'react-hook-form'` | 이 프로젝트에 폼 라이브러리가 없다 | `useState` + 검증 함수 (이 문서) |
| `FormField` 가 없다는 오류 | UI 배럴에 shadcn `Form` 6종이 없다 | `Label` + `Input` + 오류 `<p>` 조합 |
| 취소를 눌렀는데 저장된다 | 취소 버튼에 `type="button"`이 없다 | `type="button"`을 준다 |
| 한 글자 전 값으로 검증된다 | `setValue` 안에서 `values`로 검증했다 | 방금 만든 `next`로 검증한다 |
| 아직 안 건드린 칸에 빨간 글씨 | `touched` 없이 항상 검증한다 | `touched[key]`일 때만 재검증한다 |
| 저장 버튼이 영원히 비활성 | 오류 뒤 `submitting`을 안 풀었다 | `finally { setSubmitting(false); }` |
| 오류인데 포커스가 안 간다 | 입력 `id`와 필드 키가 다르다 | `id`를 필드 키와 같게 맞춘다 |
| "비제어에서 제어로" 경고 | 서버가 준 `null`을 그대로 넣었다 | `?? ''`로 빈 문자열을 보장한다 |

## 관련 문서

- **폼 화면 전체 골격** — [화면 템플릿 — 폼 화면](../page-templates/form-page.md)
- **없는 것들 정리** — [Form 컴포넌트 — 이 프로젝트에는 없습니다](../components/Form.md)
- **API 호출** — [API 호출 패턴](./api-call.md)
