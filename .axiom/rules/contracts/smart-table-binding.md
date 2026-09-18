---
id: smart-table-binding
kind: contract
axiomSchema: 1
title: "SmartTable에 list API 적용 — 타입+훅+컬럼DSL+SmartTable 재작성 (레시피)"
requiresPatchMode: true
replacesRegionRootWith: SmartTable
---
- **SmartTable**(@axiom/components/ui)은 컬럼을 `defineColumns` 설정 맵으로 선언하는 고수준 그리드입니다. 손으로 `<table><tr><td>`를 짜지 말고 **아래 3부품을 모두** 출력하세요(하나라도 빠지면 적용이 거부됩니다):
  1) `<hook>`에 **응답 타입 + useApi + 파생 목록 + 컬럼DSL**을 함께 선언 — 요소 타입(`TXxx`)과 응답 타입(`TXxxResponse`)을 **반드시 같은 `<hook>`에 선언**하세요(`useApi<TXxxResponse>`처럼 타입 인자만 쓰고 선언을 빠뜨리면 거부됨):
`type TXxx = { id: number; … };`  ← 필드는 **참조 스펙의 response 스키마**에서(더미 필드 추측 금지)
`type TXxxResponse = { data: TXxx[] };`  ← 스펙의 실제 응답 래퍼 형태에 맞게
`const XXX_ENDPOINT = '/api/…';`
`const { data: xxxResponse } = useApi<TXxxResponse>(XXX_ENDPOINT);`
`const xxxItems = xxxResponse?.data ?? [];`
`const xxxColumns = defineColumns<TXxx>({ 필드명: '라벨', 금액필드: { label: '금액', format: 'money', align: 'right' } });`
     · 맵의 **key가 곧 데이터 필드명**입니다. 문자열은 라벨 단축형, 객체는 `{ label, format?, align?, badge? }`. `format`은 `'money'|'number'|'percent'|'date'|'date:YYYY.MM.DD'|'phone'` 등(전역 `$util`로 자동 매핑).
  2) import는 두 줄: `<import module="@axiom/components/ui" named="SmartTable, defineColumns" />` 와 `<import module="@axiom/hooks" named="useApi" />`
  3) `<region>`의 기존 테이블 마크업을 **`<SmartTable data={xxxItems} columns={xxxColumns} searchable />`** 한 줄로 교체하세요 (영역 최상위 태그는 유지). 정렬·페이지네이션·검색·컬럼토글은 SmartTable이 자동 처리하므로 별도 구현하지 마세요.
- ⚠ `data`와 `endpoint`를 **동시에 주지 마세요**. 위처럼 useApi로 받아 `data`에 넘기는 클라이언트 모드가 기본입니다 (서버 페이징이 꼭 필요하면 `data` 대신 `endpoint="/api/…"` 한 가지만, `select`로 응답을 `{ rows, total }`로 매핑).
- ⚠ **응답 스키마 확인 게이트(모를 때만)**: 대상 `/api/…` 응답의 필드 구성이 **참조 스펙·열린 파일 어디에도 없으면**, 필드를 추측해 코드를 짓지 말고 — **axiom-action(편집 블록)을 출력하지 말고** 아래 톤으로 한 번만 되물으세요(추궁이 아니라 "정확히 해드리려 확인"):
  > "{엔드포인트} 응답 데이터의 형태를 확인하고 싶습니다. 표를 정확히 구성하려면 응답 필드 구성을 알아야 해서요 — ① 응답 JSON 예시나 타입을 붙여주시거나 ② 스펙 파일 경로(예: `/plan/api-spec.md`)를 짚어주시면 그대로 반영하겠습니다. ③ 지금 바로 진행이 필요하면 일반적인 형태로 **가정해 초안**을 만들고 가정한 필드는 주석으로 표시해 두겠습니다."
  · 단, 응답 스키마가 **이미 컨텍스트(참조 스펙/열린 파일의 타입)에 있으면 되묻지 말고** 바로 위 골격대로 적용하세요(불필요한 되묻기 금지).
