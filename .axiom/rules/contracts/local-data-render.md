---
id: local-data-render
kind: contract
axiomSchema: 1
title: "로컬 데이터 렌더 — 이미 파일에 있는 함수·상수를 화면에 표시 (API 아님)"
requiresPatchMode: true
---
- **이 요청은 이미 이 파일에 존재하는 함수·상수(로컬 데이터 출처)를 화면에 렌더하는 것입니다** — 서버에서 새로 불러오는 게 아닙니다.
- ⛔ **절대 금지**: 새 `useApi` 호출·새 `/api/…` 엔드포인트·`@axiom/hooks` import·응답 타입(`TXxxResponse`) 추가. 파일명이 `XxxListPage`(예: EmployeeListPage)라도 **API를 만들지 마세요** — 데이터는 이미 파일 안 함수/상수에 있습니다.
- ✅ **해야 할 것**: 쿼리가 지목한 기존 함수·상수(예: `getArr()`)를 그대로 호출해 `.map()`으로 렌더하세요 (기존 데이터의 **실제 필드만** 사용, 없는 필드 추측 금지).
- **⚠ 출력 모드는 반드시 `patch`**: 이 작업은 **JSX 테이블 렌더**가 필요합니다. axiom-action을 `"mode":"patch"`로 내세요. ⛔ `structural` 모드 금지 — structural은 컴포넌트 본문에 선언(훅·타입·import)만 삽입하고 **`return` 안 JSX를 만들지 못해** 표가 안 그려집니다. patch로 ① 필요한 import·훅·타입 추가와 ② 테이블 JSX 삽입을 **한 응답에 함께** 내세요.
- **⚠ JSX 렌더는 반드시 포함**(선언만 하고 끝내면 화면에 아무것도 안 나와 무효):
  · **이미 `<table>`/`<Table>`이 있으면** → 그 `tbody`의 `.map()` 대상만 이 목록으로 **교체**(헤더·컬럼 구조는 그대로).
  · **테이블이 없으면** → 컴포넌트 `return`의 적절한 위치에 scaffold `<Table>`로 **새 테이블을 만들어 삽입**하고 그 안에서 `.map()`으로 렌더. Table 컴포넌트는 **단일 경로**에서: `import { Table, TableHeader, TableBody, TableRow, TableHead, TableCell } from '@axiom/components/ui';` (⛔ `@axiom/components/ui/table` 같은 서브경로 금지). 예:
`<Table><TableHeader><TableRow><TableHead>이름</TableHead>…</TableRow></TableHeader><TableBody>{items.map((row) => (<TableRow key={row.id}><TableCell>{row.name}</TableCell>…</TableRow>))}</TableBody></Table>`
