---
title: 화면 템플릿 — 폼 화면
tags: [page-template, 페이지템플릿, 폼화면, form-page, formpage, 폼, form, 등록, 수정, 입력, 저장, 취소, validation, 유효성, 폼검증, react-hook-form, zod, 폼라이브러리]
scope: page-template
status: base-only
---

# 화면 템플릿 — 폼 화면 (Form Page)

> **운영 규칙**
> - **섹션 A**: scaffold 공통 기본 구조. react-app-scaffold 확정 전까지 `base-only` 유지.
> - **섹션 B**: 초안 / 검토 중 변형 패턴. 실전에서 확인 후 섹션 A로 이동.
> - **섹션 C**: SI 프로젝트 투입 시 추가. axiom-ai "프로젝트 설정 > 레이아웃 패턴 > 폼 화면" 필드와 연동.

> ⚠️ **폼 라이브러리를 쓰지 않는다.** `react-hook-form`·`zod`·`@hookform/resolvers`는 **설치되어 있지 않고**,
> UI 배럴에 shadcn `Form` 6종(`Form`·`FormField`·`FormItem`·`FormLabel`·`FormControl`·`FormMessage`)도 **없다.**
> `useForm`이나 `<FormField>`를 쓰면 화면이 뜨기도 전에 오류가 난다(2026-09-06 실기기 오류 18건).
> 폼은 **`useState` + 필드별 검증 함수**로 만든다 — 아래 React 변환 예시가 그 표준이다.

---

## 섹션 A — Scaffold 공통 구조

### 구조 개요

```
페이지 루트 (p-6 space-y-6 max-w-2xl)
├── 페이지 제목 (h1)
└── 폼 카드 (Card > CardContent)
    └── <form onSubmit noValidate>        ← 표준 form. 폼 라이브러리 없음
        ├── 필드 묶음 (Label + 입력 + 오류 <p>) × 필드 수
        └── 하단 버튼 영역 (flex justify-end) ← 취소 / 저장
```

상태는 **정확히 넷**이다.

| 상태 | 무엇을 담나 | 왜 필요한가 |
| --- | --- | --- |
| `values` | 입력값 전체 | 화면에 보여주고 제출할 값 |
| `errors` | 필드별 오류 메시지 | 어떤 칸에 무슨 문구를 띄울지 |
| `touched` | 사용자가 벗어난 적 있는 필드 | 아직 건드리지도 않은 칸에 빨간 글씨를 띄우지 않으려고 |
| `submitting` | 저장 중인지 | 중복 제출을 막고 버튼 문구를 바꾸려고 |

검증은 **세 시점**에서만 돈다 — **blur**(그 칸 하나) · **change**(이미 에러가 뜬 칸만) · **submit**(전체).
제출에 실패하면 `FIELD_ORDER` 순서로 **첫 오류 칸에 포커스**를 옮긴다.

---

### 퍼블 HTML 예시

```html
<div class="form-wrap">

  <h2 class="page-title">사용자 등록</h2>

  <div class="card-wrap">
    <div class="card-body">
      <form id="userForm">

        <div class="form-group">
          <label class="form-label" for="userName">
            이름 <span class="required">*</span>
          </label>
          <input class="form-control" id="userName" type="text" placeholder="이름을 입력하세요" />
          <span class="invalid-feedback">이름은 필수 입력입니다.</span>
        </div>

        <div class="form-group">
          <label class="form-label" for="userEmail">이메일</label>
          <input class="form-control" id="userEmail" type="email" placeholder="이메일을 입력하세요" />
          <span class="invalid-feedback">올바른 이메일 형식이 아닙니다.</span>
        </div>

        <div class="form-group">
          <label class="form-label">부서</label>
          <select class="form-select" id="department">
            <option value="">선택하세요</option>
            <option value="1">개발팀</option>
            <option value="2">기획팀</option>
          </select>
        </div>

        <div class="form-group">
          <label class="form-label">비고</label>
          <textarea class="form-control" rows="4" placeholder="비고를 입력하세요"></textarea>
        </div>

        <div class="btn-area btn-area--right">
          <button type="button" class="btn btn-outline">취소</button>
          <button type="submit" class="btn btn-primary">저장</button>
        </div>

      </form>
    </div>
  </div>

</div>
```

---

### React 변환 예시

> ⚠️ 화면 이동은 전역 `$router`를 쓴다(import 불필요) — `useNavigate()`는 scaffold에서 금지된다. 경로는 `/{도메인}/{라우트}` 절대 경로다.
> ⚠️ import는 **배럴 하나(`@axiom/components/ui`)**에서만 가져온다. 개별 경로 import는 쓰지 않는다.

```tsx
import { useState } from 'react';
import { Button, Card, CardContent, Input, Label, Textarea } from '@axiom/components/ui';

/** 폼이 다루는 값 전체. 입력요소는 문자열만 담고, 숫자 변환은 제출 직전에 한다. */
type TUserFormValues = {
  name: string;
  email: string;
  notes: string;
};

/** 필드별 에러 메시지. 값이 없으면 그 필드는 통과한 상태다. */
type TErrors = Partial<Record<keyof TUserFormValues, string>>;

const INITIAL: TUserFormValues = { name: '', email: '', notes: '' };

/** 화면에 놓인 순서. 제출 실패 시 "첫 번째 오류 칸"을 찾는 기준이 된다. */
const FIELD_ORDER: (keyof TUserFormValues)[] = ['name', 'email', 'notes'];

/**
 * 필드별 검증 규칙 — 실제 스펙의 요청 필드로 교체한다.
 * 각 규칙은 **폼 값 전체**를 받는다. 자기 값만 받게 하면 "비밀번호 확인"처럼 다른 칸을 참조해야 하는
 * 검증에서 결국 시그니처를 고쳐야 한다. 통과하면 undefined, 실패하면 보여줄 메시지를 돌려준다.
 */
const validators: Record<keyof TUserFormValues, (values: TUserFormValues) => string | undefined> = {
  name: ({ name }) => (name.trim() ? undefined : '이름을 입력해 주세요.'),
  email: ({ email }) => {
    if (!email.trim()) return '이메일을 입력해 주세요.';
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) ? undefined : '이메일 형식이 올바르지 않습니다.';
  },
  notes: ({ notes }) => (notes.length > 200 ? '200자 이내로 입력해 주세요.' : undefined),
};

export default function UserFormPage(): React.ReactNode {
  const [values, setValues] = useState<TUserFormValues>(INITIAL);
  const [errors, setErrors] = useState<TErrors>({});
  /** 사용자가 한 번이라도 벗어난(=검증을 시작해도 되는) 필드 */
  const [touched, setTouched] = useState<Partial<Record<keyof TUserFormValues, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);

  /** 값 변경 — 이미 에러가 떠 있는 칸만 재검증해서, 고치는 즉시 메시지를 걷어준다. */
  const setValue = (key: keyof TUserFormValues, value: string): void => {
    const next = { ...values, [key]: value };
    setValues(next);
    if (touched[key]) setErrors((prev) => ({ ...prev, [key]: validators[key](next) }));
  };

  /** 포커스 이탈 — 이 필드의 검증을 시작한다. */
  const handleBlur = (key: keyof TUserFormValues): void => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setErrors((prev) => ({ ...prev, [key]: validators[key](values) }));
  };

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
    // TODO: 저장 API를 useApi 뮤테이션으로 연결한다. 성공·실패와 무관하게 잠금을 반드시 푼다.
    console.log(values);
    setSubmitting(false);
    $router.back();
  };

  return (
    <div className="p-6 space-y-6 max-w-2xl">
      <h1 className="text-2xl font-bold">사용자 등록</h1>

      <Card>
        <CardContent className="pt-6">
          {/* noValidate — 브라우저 기본 말풍선 대신 폼이 직접 메시지를 그린다. */}
          <form
            onSubmit={handleSubmit}
            noValidate
            className="space-y-4"
          >
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

            <div className="grid gap-1.5">
              <Label htmlFor="email">
                이메일 <span className="text-destructive">*</span>
              </Label>
              <Input
                id="email"
                type="email"
                value={values.email}
                onChange={(e) => setValue('email', e.target.value)}
                onBlur={() => handleBlur('email')}
                aria-invalid={!!errors.email}
                aria-describedby="email-message"
                placeholder="이메일을 입력하세요"
              />
              {errors.email && (
                <p
                  id="email-message"
                  role="alert"
                  className="text-[11px] text-destructive"
                >
                  {errors.email}
                </p>
              )}
            </div>

            <div className="grid gap-1.5">
              <Label htmlFor="notes">비고</Label>
              <Textarea
                id="notes"
                rows={4}
                value={values.notes}
                onChange={(e) => setValue('notes', e.target.value)}
                onBlur={() => handleBlur('notes')}
                aria-invalid={!!errors.notes}
                aria-describedby="notes-message"
                placeholder="비고를 입력하세요"
              />
              {errors.notes && (
                <p
                  id="notes-message"
                  role="alert"
                  className="text-[11px] text-destructive"
                >
                  {errors.notes}
                </p>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => $router.back()}
              >
                취소
              </Button>
              <Button
                type="submit"
                disabled={submitting}
              >
                {submitting ? '저장 중...' : '저장'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 자주 하는 실수

| 증상 | 원인 | 고치는 법 |
| --- | --- | --- |
| `Cannot find module 'react-hook-form'` | 이 프로젝트에 폼 라이브러리가 없다 | `useState` + 검증 함수 (이 문서) |
| `FormField` 가 없다는 오류 | UI 배럴에 shadcn `Form` 6종이 없다 | `Label` + `Input` + 오류 `<p>` 조합 |
| 취소를 눌렀는데 저장된다 | 취소 버튼에 `type="button"`이 없다 | `type="button"`을 준다 |
| 한 글자 전 값으로 검증된다 | `setValue` 안에서 `values`로 검증했다 | 방금 만든 `next`로 검증한다 |
| 저장 버튼이 영원히 비활성 | 오류 뒤 `submitting`을 안 풀었다 | `finally { setSubmitting(false); }` |
| 오류인데 포커스가 안 간다 | 입력 `id`와 필드 키가 다르다 | `id`를 필드 키와 같게 맞춘다 |

> 검증 시점·API 연결·수정 폼(기존 값 채우기)은 [폼 처리 패턴](../patterns/form-handling.md)에 더 자세히 있다.

---

## 섹션 B — 초안 / 검토 중 변형

> 실전 투입 후 확인되는 변형 패턴을 여기에 추가한 후 섹션 A로 이동한다.

| 변형 패턴 | 상태 | 비고 |
|---------|------|------|
| 멀티 스텝 폼 (단계별 입력) | tbd | Tabs 또는 단계 인디케이터 |
| 모달 안 인라인 폼 | tbd | Dialog + 위 form 조합 |
| 파일 첨부 포함 폼 | tbd | 파일 업로드 컴포넌트 필요 |

---

## 섹션 C — 프로젝트별 폼 화면 구조

> SI 프로젝트 투입 시 이 섹션에 서브섹션을 추가한다.  
> **직접 편집하지 말 것** — axiom-ai 좌측 패널 **"프로젝트 설정 > 레이아웃 패턴 > 폼 화면"** 에 입력하면 `.axiom/knowledge/project-config.md`의 `### 폼 화면` 섹션으로 자동 저장된다.

```
프로젝트명      : (예: ○○은행 차세대 시스템)
채택 구조       : (axiom-ai 패널에서 입력 — 섹션 A와 다른 부분만 기록)
특이사항        :
```
