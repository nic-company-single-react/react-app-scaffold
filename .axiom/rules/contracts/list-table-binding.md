---
id: list-table-binding
kind: contract
axiomSchema: 1
title: "목록 테이블에 list API 적용 — 타입+훅+테이블 재작성 (레시피)"
requiresPatchMode: true
---
- 테이블/목록에 list API를 적용할 때는 **아래 3부품을 모두** 출력하세요 — 훅만 넣고 멈추지 말고 ⓐ응답 타입 ⓑuseApi 훅 ⓒ테이블 재작성을 **한 번에**. (하나라도 빠지면 적용이 거부됩니다.)
  1) `<hook>`에 **응답 타입 + useApi + 파생 목록**을 함께 선언 — 요소 타입(`TXxx`)과 응답 타입(`TXxxResponse`)을 **반드시 같은 `<hook>`에 선언**하세요. `useApi<TXxxResponse>`처럼 타입 인자만 쓰고 선언을 빠뜨리면 거부됩니다:
`type TXxx = { … };`  ← 필드는 **참조 스펙의 response 스키마**에서(더미 배열 필드 추측 금지)
`type TXxxResponse = { data: TXxx[] };`  ← 스펙의 실제 응답 래퍼 형태에 맞게
`const XXX_ENDPOINT = '/api/…';`
`const { data: xxxResponse } = useApi<TXxxResponse>(XXX_ENDPOINT);`
`const xxxItems = xxxResponse?.data ?? [];`
  2) import는 useApi만: `<import module="@axiom/hooks" named="useApi" />`
  3) 데이터를 화면 테이블로 렌더 — `xxxItems`를 `.map()`으로:
- **⚠ 출력 모드는 반드시 `patch`**: 이 작업은 **JSX 테이블 렌더**가 필요합니다. axiom-action을 `"mode":"patch"`로 내세요. ⛔ `structural` 모드 금지 — structural은 컴포넌트 본문에 선언(훅·타입·import)만 삽입하고 **`return` 안 JSX를 만들지 못해** 표가 안 그려집니다. patch로 ① 필요한 import·훅·타입 추가와 ② 테이블 JSX 삽입을 **한 응답에 함께** 내세요.
- **⚠ JSX 렌더는 반드시 포함**(선언만 하고 끝내면 화면에 아무것도 안 나와 무효):
  · **이미 `<table>`/`<Table>`이 있으면** → 그 `tbody`의 `.map()` 대상만 이 목록으로 **교체**(헤더·컬럼 구조는 그대로).
  · **테이블이 없으면** → 컴포넌트 `return`의 적절한 위치에 scaffold `<Table>`로 **새 테이블을 만들어 삽입**하고 그 안에서 `.map()`으로 렌더. Table 컴포넌트는 **단일 경로**에서: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@axiom/components/ui';` (⛔ `@axiom/components/ui/table` 같은 서브경로 금지). 예:
`<Table><TableHeader><TableRow><TableHead>이름</TableHead>…</TableRow></TableHeader><TableBody>{items.map((row) => (<TableRow key={row.id}><TableCell>{row.name}</TableCell>…</TableRow>))}</TableBody></Table>`
- ⚠ 기존 테이블을 교체할 땐 컬럼(헤더·셀 구성)은 유지하고 `.map` 대상만 하드코딩 배열 → `xxxItems`로 바꾸세요. 로딩/에러 표시가 필요하면 `isPending`·`error`를 쓰되, 안 쓸 거면 구조분해에서 빼세요(미사용 선언은 거부됨).
- ⚠ **응답 스키마 확인 게이트(모를 때만)**: 대상 `/api/…` 응답의 필드 구성이 **참조 스펙·열린 파일 어디에도 없으면**, 필드를 추측해 코드를 짓지 말고 — **axiom-action(편집 블록)을 출력하지 말고** 아래 톤으로 한 번만 되물으세요(추궁이 아니라 "정확히 해드리려 확인"):
  > "{엔드포인트} 응답 데이터의 형태를 확인하고 싶습니다. 표를 정확히 구성하려면 응답 필드 구성을 알아야 해서요 — ① 응답 JSON 예시나 타입을 붙여주시거나 ② 스펙 파일 경로(예: `/plan/api-spec.md`)를 짚어주시면 그대로 반영하겠습니다. ③ 지금 바로 진행이 필요하면 일반적인 형태로 **가정해 초안**을 만들고 가정한 필드는 주석으로 표시해 두겠습니다."
  · 단, 응답 스키마가 **이미 컨텍스트(참조 스펙/열린 파일의 타입)에 있으면 되묻지 말고** 바로 위 골격대로 적용하세요(불필요한 되묻기 금지).
