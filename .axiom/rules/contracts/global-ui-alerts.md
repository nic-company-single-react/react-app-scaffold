---
id: global-ui-alerts
kind: contract
axiomSchema: 1
title: "알림·확인 다이얼로그 (전역 $ui)"
requiresPatchMode: true
---
- 알림·확인은 브라우저 기본이 아니라 전역 `$ui`로 합니다(import 불필요): `await $ui.alert('메시지')` · `const ok = await $ui.confirm('메시지')`(확인=`true`).
- ⛔ `window.alert()`/`window.confirm()`/전역 `alert()`/`confirm()` 사용 금지 — `$ui`는 디자인토큰·다크모드가 적용된 non-blocking 다이얼로그이며 `Promise`로 결과를 받습니다.
- 타입 지정 시 아이콘·색상·기본제목 자동: `$ui.alert('저장됐습니다', { type: 'success' })`(success|info|warning|error). 토스트처럼 자동 닫힘: `{ autoDismiss: 1500 }`.
