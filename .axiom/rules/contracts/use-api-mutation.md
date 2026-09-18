---
id: use-api-mutation
kind: contract
axiomSchema: 1
title: "저장·수정·삭제 — useApi 뮤테이션 (@axiom/hooks)"
---
- 변경(저장·등록·수정·삭제)도 `useApi`(@axiom/hooks)로 합니다 — `useMutation`을 직접 쓰지 마세요. `type: 'mutation'`을 함께 적어 조회가 아님을 코드에 드러냅니다:
  `const { mutate, isPending } = useApi<TSaveResponse, TSaveRequest>('/api/…', { method: 'PUT', type: 'mutation' });`
- ⛔ 조회와 달리 **자동 실행되지 않습니다.** `data`를 읽는 코드가 아니라 `mutate(보낼값)`를 **부르는 코드**가 있어야 동작합니다.
- **⚠ 선언만 하고 끝내면 무효**: 훅을 만들어도 부르는 곳이 없으면 화면에선 아무 일도 안 일어납니다. 저장 버튼의 `onClick`이나 폼의 `onSubmit`(예: `<form onSubmit={(event) => event.preventDefault()}>`)을 **같은 응답에서 함께 고쳐** `mutate({ …보낼 값… })`를 호출하세요.
- 저장 중 표시는 `isPending`으로(`<Button disabled={isPending}>`), 성공·실패 후처리는 `mutationOptions: { onSuccess, onError }`, 목록 캐시 갱신은 `invalidateQueries('/api/…')` 로 합니다. `invalidateQueries`는 `useApi`가 **돌려주는 값**이라 `const { mutate, isPending, invalidateQueries } = useApi(…)`처럼 구조분해로 받으세요 — ⛔ import 하지 마세요.
- 요청 바디·응답 타입은 **스펙(참조 파일·붙여넣은 스펙)에서만** 가져오세요. 스펙에 없는 필드를 지어내지 말고, 모양을 모르면 제네릭 없이 두세요.
