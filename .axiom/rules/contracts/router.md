---
id: router
kind: contract
axiomSchema: 1
title: "화면 이동 ($router)"
---
- 화면 이동은 전역 `$router` 객체로 합니다(import 불필요): `$router.push('/path')` · `$router.replace('/path')` · `$router.back()`.
- ⛔ `useNavigate()`·`useHistory()` 등 react-router 훅 사용 금지.
- 🔴 **주소는 `/{도메인}/{화면}` 입니다** — 도메인 라우터는 루트 라우터에서 `/{도메인}` 아래에 걸리고,
  도메인 라우터의 `path` 는 그 아래 **자식 경로**이기 때문입니다. 화면 이름만 쓰면 열리지 않습니다.
  - ✅ `$router.push('/course/lesson-detail')`  ⛔ `$router.push('/lesson-detail')`
  - 퍼블리싱 화면은 `/publishing/{도메인}/{화면}` 입니다.
