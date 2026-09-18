---
id: form-validation
kind: contract
axiomSchema: 1
title: "폼 구성·검증 (useState + 검증 함수 — 폼 라이브러리 없음)"
---
- ⛔ **이 스캐폴드에는 폼 라이브러리가 없습니다.** `react-hook-form`(`useForm`)·`zod`·`@hookform/resolvers`는 **설치돼 있지 않고**, UI 배럴에 shadcn `Form` 6종(`Form`·`FormField`·`FormItem`·`FormLabel`·`FormControl`·`FormMessage`)도 **없습니다.** 쓰면 화면이 뜨기 전에 컴파일이 깨집니다.
- 폼은 `useState` + **검증 함수**로 만듭니다. 상태는 넷: `values`(입력값) · `errors`(필드별 메시지) · `touched`(벗어난 적 있는 칸) · `submitting`(저장 중). 검증은 필드별 함수가 **폼 값 전체**를 받아 통과하면 `undefined`, 실패하면 보여줄 메시지를 돌려줍니다.
- 마크업은 표준 `<form onSubmit={handleSubmit} noValidate>` 안에 **배럴에 실재하는 것만**: `Label`(`htmlFor`로 입력 `id`와 짝) · `Input`/`Textarea`/`Select`/`NativeSelect`/`Checkbox`/`Switch`/`RadioGroup` · `Button`. 오류 문구는 입력 아래 `<p className="text-destructive">`로 직접 그립니다.
- 검증 시점은 셋으로 나눕니다 — `onBlur`(첫 검증) · `onChange`(**에러가 떠 있는 칸만** 재검증) · 제출(전체 검증). "입력하는 내내 빨간 글씨가 따라다니는" 것을 피하려는 것이라 합치지 마세요.
- 제출·수정은 `useApi`(@axiom/hooks) mutation과 연결: 검증을 통과하면 `mutate(값, { onSuccess, onError })`. ⛔ `useMutation` 직접 사용 금지.
