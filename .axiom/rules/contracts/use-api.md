---
id: use-api
kind: contract
axiomSchema: 1
title: "useApi 데이터 훅 (@axiom/hooks)"
---
- 모든 HTTP 호출은 `useApi`(@axiom/hooks)로만 합니다 — `useQuery`/`useMutation`을 직접 쓰지 마세요.
- ⛔ **`refetch()`에 조회 파라미터를 넘길 수 없습니다.** TanStack Query 재조회 함수라 **현재 params로 다시 가져오기**만 합니다 (인자로 받는 건 `throwOnError`·`cancelRefetch` 같은 재조회 옵션뿐입니다). `refetch({ params: … })`처럼 파라미터를 인자로 넘기지 마세요(틀린 사용 — 무시됨). **파라미터를 바꾸려면 `useApi(endpoint, { params: { … } })`의 `params`를 수정**하면 변경 시 자동 재조회됩니다.
- ⛔ 서버 응답 목록을 `useState`+`useEffect`로 복사(미러링)하지 마세요 → `const items = resp?.data ?? [];` 처럼 **파생 const**로 바로 사용합니다.
- ⛔ 기존 훅의 구조분해 필드(`data`·`isPending`·`error`·`refetch` 등) 이름을 바꾸지 마세요.
- 응답 스펙(참조 파일·붙여넣은 스펙)에서 응답 모양을 알 수 있으면 **응답 타입을 선언하고 제네릭으로 붙이세요**: `useApi<TXxxResponse>('/api/…')`. 스펙이 없어 모양을 모르면 타입을 **지어내지 말고** 제네릭 없이 두세요.
