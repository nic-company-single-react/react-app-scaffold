# $ui.alert 실행 흐름

> 화면에서 `await $ui.alert(...)` 를 호출했을 때 파일이 읽히는 순서.
> `$ui.confirm` 도 같은 경로를 탄다 (`kind` 값만 다르다).

```ts
await $ui.alert({ type: 'success', message: '저장되었습니다.' });
```

---

## 0단계 — 부팅 (호출 전에 이미 끝나 있음)

1. [main.tsx:16](../src/main.tsx#L16) — `registerWindowUI()` 호출
2. [core/ui/index.ts:102](../src/core/ui/index.ts#L102) — `window.$ui` 에 `alert`/`confirm`/`dialog` 를 심는다
3. [AppProviders.tsx:27](../src/core/providers/AppProviders.tsx#L27) → [UIHosts.tsx:21](../src/core/ui/UIHosts.tsx#L21) — `<UIAlertHost />` 를 앱에 딱 한 번 마운트
4. [alert/UIAlertHost.tsx:14](../src/core/ui/alert/UIAlertHost.tsx#L14) — 큐가 비어 있어 `null` 반환. **아무것도 안 그리고 대기**

---

## 1단계 — 호출 (동기)

5. [index.ts:81](../src/core/ui/index.ts#L81) — Promise 를 만들고 `resolve` 를 밖으로 캡처
6. [index.ts:26 `normalize()`](../src/core/ui/index.ts#L26) — `'문자열'` 과 `{ 옵션 }` 두 호출 형태를 하나로 병합
7. [createId.ts:12](../src/core/ui/createId.ts#L12) — `id` 가 없으면 UUID 부여
8. [alert/alertStore.ts:26](../src/core/ui/alert/alertStore.ts#L26) — `{ kind, option, resolve }` 를 **FIFO 큐 맨 뒤**에 넣는다
9. 호출부는 `await` 에서 **정지**

---

## 2단계 — 렌더

10. [useAlertFrame.ts:25](../src/core/ui/alert/useAlertFrame.ts#L25) — 큐 구독이 변화를 감지해 호스트를 리렌더
11. [useAlertFrame.ts:36](../src/core/ui/alert/useAlertFrame.ts#L36) — `setOpen(true)` 로 두 번째 리렌더 (열림 애니메이션용)
12. [useAlertFrame.ts:85](../src/core/ui/alert/useAlertFrame.ts#L85) — **동작**만 담은 `frame` 반환 (열림 상태 · z-index · 닫기 함수 3종)
13. [UIAlertHost.tsx:16](../src/core/ui/alert/UIAlertHost.tsx#L16) — `<AlertSkin frame={frame} />` ← **core → shared 경계**
14. [AlertSkin.tsx:45](../src/shared/ui/overlay/AlertSkin.tsx#L45) — **모양**. 아이콘·색상·문구를 정하고 [Radix](../src/shared/lib/shadcn/ui/alert-dialog.tsx)로 DOM 을 그린다

---

## 3단계 — 닫기

15. 확인 버튼 · ESC · X · autoDismiss — **네 경로 모두** [`closeWith(reason)`](../src/core/ui/alert/useAlertFrame.ts#L52) 하나로 모인다
16. `closeWith` 내부 순서
    1. 중복 진입 차단 (정산은 정확히 1회)
    2. `onClose` 콜백 호출
    3. **`resolve()`** ← 5번의 Promise 가 풀리고 화면 코드의 `await` 가 재개된다
    4. `setOpen(false)` — 닫힘 애니메이션 시작
    5. [150ms](../src/shared/ui/overlay/overlay-layers.ts#L34) 뒤 `dequeue()` — 큐에서 제거
17. 큐에 다음 항목이 있으면 10번으로 되돌아간다

> **3번(정산)과 5번(큐 제거)을 분리한 게 핵심.** 바로 제거하면 닫힘 애니메이션이 잘린다.

---

## 요약

```text
화면 코드
  ↓ $ui.alert(...)
index.ts        Promise 생성 · 옵션 병합
  ↓
createId.ts     id 부여
  ↓
alertStore.ts   큐에 넣기 ──── 호출부는 await 로 정지
  ↓ (구독)
useAlertFrame   동작 계산
  ↓
UIAlertHost     core → shared 경계
  ↓
AlertSkin       모양 (Radix DOM)

닫기 → closeWith() → resolve()로 await 재개 → 150ms 뒤 큐에서 제거
```

**입구(`index.ts`) → 상태(`alertStore`) → 동작(`useAlertFrame`) → 모양(`AlertSkin`)** 네 단계.

| 고치고 싶은 것 | 열 파일 |
| --- | --- |
| 디자인 (아이콘·색상·버튼) | [AlertSkin.tsx](../src/shared/ui/overlay/AlertSkin.tsx) |
| 동작 (닫기·정산·자동닫힘) | [useAlertFrame.ts](../src/core/ui/alert/useAlertFrame.ts) |
| 호출 API·옵션 | [index.ts](../src/core/ui/index.ts) |
| 큐 정책 | [alertStore.ts](../src/core/ui/alert/alertStore.ts) |
| z-index·애니메이션 길이 | [overlay-layers.ts](../src/shared/ui/overlay/overlay-layers.ts) |
