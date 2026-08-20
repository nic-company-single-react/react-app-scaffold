# $ui.dialog — 구조 개선 작업

> `$ui.dialog` 기능 자체는 완성되어 동작 중이다. 이 문서가 다루는 것은 **동작이 아니라 구조**다.
> 목표: 나중에 누군가 **AI 도움 없이** 이 기능의 버그를 고치거나 기능을 추가할 때,
> "어디부터 봐야 하는가"에 코드 스스로가 답하도록 만든다.
>
> 이 문서의 핵심은 **3장 실행 추적**이다. 모든 개선 판단은 거기서 나온다.

---

## 1. 배경 · 이 문서를 쓰는 이유

`$ui.dialog` 는 커밋 `f60a4ef`(생성) / `ac0c3e0`(수정) 로 들어온 기능이다. 코드 자체의 품질은 좋다 —
불변식이 주석에 명시되어 있고(`settleDialog` 의 3개 규칙), `requestCloseDialog` 단일 관문 설계도 정확하고,
core(동작) ↔ shared(모양) 경계도 깔끔하다.

문제는 **그 좋은 설계가 파일 구조에서 안 보인다**는 점이다. 폴더를 열면 10개 파일이 알파벳순으로
평평하게 나열될 뿐이고, 진입점(`index.ts`)도 없고, 문서도 없다.
SmartTable 은 [사용가이드](smart-table-사용가이드.md)가 있는데 규모가 비슷한 `$ui.dialog` 는 없다.

그래서 **파일을 줄일지 / 나눌지를 감으로 정하지 말고, 실제 실행 순서를 근거로 정하자**는 것이
이 작업의 방침이다.

---

## 2. 현재 파일 지도

`$ui.dialog` 구현에 해당하는 파일은 **15개**다. (사용 예제·테스트 제외)

### 2-1. 코어 엔진 — `src/core/ui/dialog/` · 10개

| 파일 | 줄수 | 역할 |
|---|---:|---|
| [dialogController.ts](../src/core/ui/dialog/dialogController.ts) | 283 | **심장.** 열기 · 닫기 요청 · 정산(settle) · 갱신 |
| [useDialogFrame.ts](../src/core/ui/dialog/useDialogFrame.ts) | 190 | 스택 항목 1건 → 스킨이 쓸 `IDialogFrame` 으로 배선 |
| [dialogStore.ts](../src/core/ui/dialog/dialogStore.ts) | 107 | zustand 스택 스토어 + `runtimes` Map (submit/guard 슬롯) |
| [useLiveProps.ts](../src/core/ui/dialog/useLiveProps.ts) | 98 | 살아있는 props 상자. `@axiom/hooks` 로 공개 |
| [UIDialogStackHost.tsx](../src/core/ui/dialog/UIDialogStackHost.tsx) | 91 | 전역 스택 호스트. 라우트 자동닫기 · pointer-events 안전망 |
| [useDialog.ts](../src/core/ui/dialog/useDialog.ts) | 84 | 컨텐츠용 훅 4종. `@axiom/hooks` 로 공개 |
| [DialogRouterBridge.tsx](../src/core/ui/dialog/DialogRouterBridge.tsx) | 63 | 포털 밖 컨텐츠에 라우터 컨텍스트 재주입 |
| [DialogBody.tsx](../src/core/ui/dialog/DialogBody.tsx) | 48 | 컨텐츠를 감싸는 **구조** 레이어 (중첩 순서가 핵심) |
| [DialogErrorBoundary.tsx](../src/core/ui/dialog/DialogErrorBoundary.tsx) | 39 | 렌더 실패를 `'error'` 로 정산 |
| [DialogContext.ts](../src/core/ui/dialog/DialogContext.ts) | 10 | `IDialogApiHandle` 을 컨텐츠 트리에 전달 |

### 2-2. 조립 · 전역 등록 — `src/core/ui/`

| 파일 | 역할 |
|---|---|
| [index.ts](../src/core/ui/index.ts) | `createDialogApi()` 로 `$ui.dialog` 조립 · `registerWindowUI()` |
| [createId.ts](../src/core/ui/createId.ts) | UUID v4. **alert/confirm 과 공유** (순환참조 회피용 별도 모듈) |
| [UIHosts.tsx](../src/core/ui/UIHosts.tsx) | `UIDialogStackHost` 마운트 지점 |
| [core/hooks/index.ts](../src/core/hooks/index.ts) | 훅 재export — 화면 코드의 유일한 창구 |

### 2-3. 표현층 — `src/shared/ui/overlay/`

| 파일 | 줄수 | 역할 |
|---|---:|---|
| [DialogSkin.tsx](../src/shared/ui/overlay/DialogSkin.tsx) | 154 | 껍데기 디자인. **퍼블리셔가 고치는 유일한 파일** |
| [overlay-layers.ts](../src/shared/ui/overlay/overlay-layers.ts) | 39 | z-index 사다리 · `CLOSE_ANIM_MS`. alert/toast 와 공유 |

### 2-4. 타입

[src/types/components/index.ts](../src/types/components/index.ts) — 394줄.
alert · confirm · dialog 공개 API · **core↔shared 내부 계약**(`IDialogFrame` 등)이 한 파일에 있다.

---

## 3. 실행 추적 — 모든 판단의 근거

아래 한 줄을 호출했을 때 파일이 읽히는 **실제 순서**다.

```tsx
const member = await $ui.dialog<IMember>({ component: MemberPickerDialog, props: { deptId: 3 } });
```

### Phase 0 — 앱 부팅 (호출 전에 이미 끝나 있는 준비)

| # | 파일 | 하는 일 |
|---|---|---|
| 1 | [main.tsx:16](../src/main.tsx#L16) | `registerWindowUI()` 호출 |
| 2 | [core/ui/index.ts:102](../src/core/ui/index.ts#L102) | → `createWindowUI()` → `createDialogApi()` 로 **`window.$ui.dialog` 함수 생성** |
| 3 | [AppProviders.tsx](../src/core/providers/AppProviders.tsx) | `<UIHosts />` 마운트 |
| 4 | [UIHosts.tsx:19](../src/core/ui/UIHosts.tsx#L19) | `<UIDialogStackHost />` 마운트 |
| 5 | [UIDialogStackHost.tsx:22](../src/core/ui/dialog/UIDialogStackHost.tsx#L22) | `$router.subscribe` 등록 → 스택이 비어 `:48` `return null` **(대기)** |

### Phase 1 — 호출 순간 (동기 · React 무관)

```
$ui.dialog({...})
│
├─▶ core/ui/index.ts:40        createDialogApi 내부 함수
│   ├─ :41  { component, props, ...rest } 분해
│   ├─ :44  new Promise 생성 · settle 캡처        ← await 가 여기 묶인다
│   └─ :48  openDialog(component, props, rest, settle)
│       │
│       └─▶ dialog/dialogController.ts:73   openDialog()
│           ├─ :79   createId()  ──────────────▶ core/ui/createId.ts:11
│           ├─ :80   getState()  ──────────────▶ dialog/dialogStore.ts:57
│           ├─ :83   MAX_STACK_DEPTH(20) 검사       재귀 폭주 방어
│           ├─ :92   중복 id 검사
│           ├─ :102  withDefaults()  (:55)          size:'md' 등 기본값 주입
│           ├─ :103  currentPathname()  (:46)  ───▶ window.$router
│           ├─ :112  getDialogRuntime(id) ────────▶ dialogStore.ts:95   런타임 슬롯 생성
│           └─ :113  push(item) ──────────────────▶ dialogStore.ts:59   ★ 스택 등록
│
└─▶ core/ui/index.ts:50   controls 생성 → :61 Object.assign(promise, controls) 반환
```

**이 시점** — 호출자는 handle 을 받았지만 `await` 는 pending. 화면엔 아직 아무것도 없다.

### Phase 2 — zustand 알림 → 렌더

```
dialogStore 변경 알림
│
└─▶ UIDialogStackHost.tsx:16    stack 구독이 깨어남 → 리렌더
    └─ :55  <DialogItem item depth isTop />
        │
        ├─▶ :83  useDialogFrame(item, depth, isTop)
        │   │
        │   └─▶ dialog/useDialogFrame.ts:32        ★ 동작의 심장
        │       ├─ :44   isLiveProps() ───────────▶ useLiveProps.ts:49
        │       ├─ :45   useResolvedProps() (:174)   live면 useSyncExternalStore 구독
        │       ├─ :54   api 생성 (id당 1회, identity 고정)
        │       ├─ :86   contentProps — 함수형 prop 을 고정 래퍼로 치환
        │       ├─ :109  autoDismiss 타이머
        │       ├─ :116  getDialogZIndex(depth) ──▶ shared/ui/overlay/overlay-layers.ts
        │       ├─ :121  contentBehavior — ESC·배경클릭 전부 preventDefault
        │       ├─ :155  createElement(DialogBody, …)   ⚠ 아직 렌더 안 됨. element 만 생성
        │       └─ :156  planFooter() (:181)
        │
        └─▶ :86  <DialogSkin frame option />
            │
            └─▶ shared/ui/overlay/DialogSkin.tsx:85          여기부터 "모양"
                ├─ :89   {...frame.rootProps}  → <Dialog>    ⛔ 지우면 안 됨
                ├─ :91   {...frame.contentProps} → <DialogContent>  ⛔ 지우면 가드 우회
                │        └─▶ shared/lib/shadcn/ui/dialog.tsx (Radix)
                ├─ :96   SIZE_CLASS[frame.size]
                ├─ :112  헤더 · 타이틀
                ├─ :123  {frame.body}     ← ★ 여기서 DialogBody 가 비로소 렌더된다
                │   │
                │   └─▶ dialog/DialogBody.tsx:30       ⚠ 중첩 순서가 핵심
                │       ├─ :32  <DialogContext.Provider> ─▶ DialogContext.ts:10
                │       ├─ :33  <DialogRouterBridge>    ─▶ DialogRouterBridge.tsx:31
                │       │         useInRouterContext · $router.subscribe · <Router>
                │       ├─ :34  <DialogErrorBoundary>   ─▶ DialogErrorBoundary.tsx:22
                │       ├─ :38  <Suspense fallback=…>   ─▶ DialogSkin.tsx:19 PendingFallback
                │       └─ :39  <Content {...props} dialog={api} />
                │           │
                │           └─▶ 사용자 컴포넌트 (예: MemberPickerDialog.tsx)
                │               ├─ useDialog()       ─▶ useDialog.ts:15  useContext
                │               ├─ useDialogSubmit() ─▶ useDialog.ts:42  runtime.submit 등록
                │               └─ useDialogGuard()  ─▶ useDialog.ts:71  runtime.guard 등록
                │                   ↑ 화면 코드는 @axiom/hooks 경유 (core/hooks/index.ts:10)
                └─ :126  footer — frame.footer.kind 로 분기
```

**이 시점** — 화면에 다이얼로그가 떴고, 컨텐츠의 submit/guard 가
[dialogStore.ts:92](../src/core/ui/dialog/dialogStore.ts#L92) 의 `runtimes` Map 에 등록된 상태다.

### Phase 3 — 닫기 ('확인' 클릭)

```
DialogSkin.tsx:142   onClick={frame.confirm}
│
└─▶ useDialogFrame.ts:161   requestCloseDialog(id, 'confirm')
    │
    └─▶ dialogController.ts:161   requestCloseDialog()      ★ 모든 닫기의 단일 관문
        ├─ :163  settled / pending 검사 (ESC 연타 등 재진입 차단)
        ├─ :167  dismissable:false + USER_DISMISS_REASONS 검사   ('confirm' 은 통과)
        ├─ :173  pending = true
        ├─ :177  reason==='confirm' → runtime.submit() 실행
        │        └─ :183  undefined 반환 시 ▸ 닫지 않고 return  (검증 실패)
        ├─ :196  GUARD_BYPASS_REASONS 아니면 → runtime.guard 실행
        │        └─ :201  false 반환 시 ▸ 닫지 않고 return
        ├─ :207  catch → fail-open (닫히지 않는 모달이 최악이므로)
        └─ :213  settleDialog(id, reason, payload)
            │
            └─▶ dialogController.ts:125   settleDialog()
                ├─ :130  settled=true, open=false
                ├─ :137  option.onClose?.(result)
                ├─ :142  item.resolve(data)      ★★ 사용자의 await 가 여기서 풀린다
                └─ :146  setTimeout(CLOSE_ANIM_MS) ─▶ overlay-layers.ts
                         └─ :150  clearDialogRuntime(id) + remove(id)
                             │
                             └─▶ UIDialogStackHost.tsx:38   스택 비면 body pointer-events 복구
```

### 3-1. 추적이 알려주는 "읽어야 할 순서"

파일이 등장하는 순서 = 새 개발자가 읽어야 할 순서다. **알파벳순도, 현재 폴더 나열 순서도 아니다.**

```
① core/ui/index.ts          — $ui.dialog 가 무엇인가
② dialogController.ts       — 열기·닫기·정산 (전체 흐름의 60%)
③ dialogStore.ts            — 무엇이 저장되는가
④ UIDialogStackHost.tsx     — 화면에 어떻게 올라가는가
⑤ useDialogFrame.ts         — 동작이 어떻게 배선되는가
⑥ DialogSkin.tsx            — 모양 (퍼블리셔는 여기만)
⑦ DialogBody.tsx            — 컨텐츠가 어떤 껍질에 싸이는가
⑧ useDialog.ts              — 컨텐츠가 쓰는 API
⑨ useLiveProps.ts           — 선택 기능
```

---

## 4. 추적에서 드러난 문제

### 문제 1 — 진입점이 없다

`core/ui/dialog/` 에 `index.ts` 가 없다. (커밋 `f60a4ef` 엔 있었으나 `ac0c3e0` 에서 사라짐)
그 결과 [core/hooks/index.ts:10](../src/core/hooks/index.ts#L10) 이 `@/core/ui/dialog/useDialog` 처럼
**내부 파일을 직접 찌른다.** 폴더를 열었을 때 "여기부터"를 가리키는 것이 없다.

### 문제 2 — 렌더 경로 4개가 사실은 내부 구현인데 최상위에 노출돼 있다

추적 Phase 2 를 보면 렌더 경로가 **외부 진입점이 하나뿐인 일직선 체인**이다.

```
UIDialogStackHost ─▶ useDialogFrame ─▶ DialogBody ─┬─▶ DialogErrorBoundary
   (유일한 외부 진입점)                              ├─▶ DialogRouterBridge
                                                    └─▶ DialogContext
```

`DialogErrorBoundary` · `DialogRouterBridge` 는 **오직 DialogBody 만**, `DialogBody` 는
**오직 useDialogFrame 만**, `useDialogFrame` 은 **오직 UIDialogStackHost 만** import 한다.
즉 중간 4개는 밖에서 아무도 안 쓴다. **병합해도 외부 import 변경이 0건**이다.

### 문제 3 — 닫기 정책이 3곳에 흩어져 있다

`$ui.dialog` 버그 대부분이 나올 지점인데 판단 근거가 분산돼 있다.

- [dialogController.ts:40](../src/core/ui/dialog/dialogController.ts#L40) `USER_DISMISS_REASONS`
- [dialogController.ts:43](../src/core/ui/dialog/dialogController.ts#L43) `GUARD_BYPASS_REASONS`
- `confirmed` 판정 `reason === 'confirm' || reason === 'submit'` 이 `:132`, `:199`, 타입 주석 `:41` **3중복**

표로 만들면 이렇게 된다. **이 표가 코드 어디에도 없다.**

| reason | dismissable:false 로 차단? | beforeClose 가드? | confirmed |
|---|:---:|:---:|:---:|
| `confirm` | ✗ | **실행** | ✓ |
| `submit` | ✗ | **실행** | ✓ |
| `cancel` | ✗ | **실행** | ✗ |
| `close` `escape` `overlay` `autoDismiss` | **차단** | 실행 | ✗ |
| `programmatic` `route` `error` | ✗ | **우회** | ✗ |

> `cancel` 이 `dismissable:false` 를 통과한다는 사실은 코드상 "두 Set 어디에도 없음"이라 안 보인다.
> 의도된 설계로 판단되나, 표가 있으면 한 줄로 확인된다. **개선 작업 중 별도 검증 필요.**

### 문제 4 — `dialogController.ts` 의 열기와 닫기는 같이 읽히지 않는다

283줄 한 파일에 관심사가 6개(open / settle / requestClose / update / flag / 조회)인데,
추적을 보면 **`openDialog` 는 Phase 1, `requestCloseDialog`·`settleDialog` 는 Phase 3** 로
실행 시점이 완전히 떨어져 있다. 한 파일에 두는 이득이 생각보다 작다.

### 문제 5 — `frame.body` 는 생성과 렌더 시점이 어긋난다

[useDialogFrame.ts:155](../src/core/ui/dialog/useDialogFrame.ts#L155) 에서 `createElement(DialogBody)` 로
element 만 만들고, 실제 렌더는 [DialogSkin.tsx:123](../src/shared/ui/overlay/DialogSkin.tsx#L123) 의
`{frame.body}` 에서 일어난다. **core → shared → core 로 한 번 튕겨 나갔다 들어온다.**
추적 없이 코드만 봐서는 가장 놓치기 쉬운 지점 — 반드시 문서에 남겨야 한다.

### 문제 6 — 타입 394줄에 4종류가 섞여 있다

[types/components/index.ts](../src/types/components/index.ts) 에
alert · confirm · dialog 공개 API · **내부 계약**(`IDialogFrame`, `IDialogContentBehavior`, `TDialogFooterPlan`)이
한 파일에 있다. "내가 바꿔도 되는 옵션"과 "건드리면 스킨이 깨지는 계약"의 구분이 파일 경계로 안 드러난다.

### 문제 7 — 문서가 없다

[plan/](.) 에 SmartTable · 단위테스트 가이드는 있는데 `$ui.dialog` 문서만 없다.

### 문제 8 — `store.ts` 이름이 혼란스럽다

[core/ui/store.ts](../src/core/ui/store.ts) 는 **alert/confirm 큐**인데 이름이 그냥 `store` 라
`dialog/dialogStore.ts` 와 헷갈린다. [UIDialogStackHost.tsx:17](../src/core/ui/dialog/UIDialogStackHost.tsx#L17) 이
이걸 왜 읽는지(= ESC 우선순위 · pointer-events 판정) 이름만으로는 알 수 없다.

---

## 5. 개선 후보

### 5-1. ⚠️ 방향이 상충함 — 하나를 골라야 한다

논의 과정에서 **정반대 두 방향**이 나왔다. 섞으면 안 된다.

| 방향 | 내용 | 해결하는 문제 |
|---|---|---|
| **A. 줄이기** | 내부 구현 파일 병합 (10 → 7 또는 4) | 문제 2 |
| **B. 나누기** | `closePolicy.ts` 신설 · 타입 4분할 | 문제 3, 6 |

**절충안**: 파일 수는 A 로 줄이되, B 의 실익은 파일을 늘리지 않고 챙긴다 —
4장의 reason 표를 [dialogController.ts](../src/core/ui/dialog/dialogController.ts) **최상단 주석**으로 박고
두 `Set` 을 그 바로 아래 나란히 둔다.

### 5-2. 병합 판정표

| 대상 | 줄수 | 외부 사용처 | 판정 |
|---|---:|---|---|
| `DialogContext.ts` → **useDialog.ts** | 10 | 없음 | ✅ **확실** |
| `DialogErrorBoundary.tsx` → DialogBody.tsx | 39 | 없음 | ✅ **확실** |
| `DialogRouterBridge.tsx` → DialogBody.tsx | 63 | 없음 | 🔶 검토 |
| `useDialogFrame.ts` → UIDialogStackHost.tsx | 190 | 없음 | 🔶 검토 |
| `dialogStore.ts` → dialogController.ts | 107 | 테스트만 | 🔶 검토 |
| `useLiveProps.ts` | 98 | `@axiom/hooks` 공개 | ❌ 불가 |
| `createId.ts` | 28 | alert·confirm 공유 | ❌ 불가 — [순환참조 사유 주석 명시](../src/core/ui/createId.ts#L8) |
| `overlay-layers.ts` | 39 | alert·toast 공유 | ❌ 불가 |

> ⚠️ `DialogContext.ts` 는 **useDialog.ts 로** 보내야 한다. DialogBody 로 보내면
> `@axiom/hooks` 가 DialogSkin · react-router 까지 전이 의존으로 끌고 온다.

> 🔶 `DialogRouterBridge` 병합의 걸림돌: 63줄 중 30줄이 "왜 필요한가 / RootLayout 안으로 못 옮기는 이유 /
> 되는 훅·안 되는 훅" 문서다. DialogBody 로 합치면 파일명은 "Body"인데 내용 절반이 라우터 얘기가 된다.

### 5-3. 병합안 3가지

| 안 | 결과 | 구성 |
|---|---|---|
| **A** (권장) | 10 → **7개** | 확실 2개 + RouterBridge 병합 |
| **A′** | 10 → **8개** | 확실 2개만. RouterBridge 는 문서 가치로 존치 |
| **B** | 10 → **4개** | `dialogCore.ts`(~380) + `UIDialogStackHost.tsx`(~420) + useDialog + useLiveProps |

**안 A 결과 (7개)**

| 파일 | 줄수 | 역할 |
|---|---:|---|
| dialogController.ts | 283 | 동작 |
| useDialogFrame.ts | 190 | core→skin 어댑터 |
| **DialogBody.tsx** | ~150 | 컨텐츠 감싸기 (+에러경계 +라우터브리지) |
| dialogStore.ts | 107 | 상태 |
| useLiveProps.ts | 98 | 살아있는 props (공개) |
| **useDialog.ts** | ~94 | 컨텐츠 훅 (+Context) |
| UIDialogStackHost.tsx | 91 | 스택 렌더 진입점 |

**안 B 를 권하지 않는 이유**: 파일 수는 이겨도 400줄대 파일 2개가 생긴다.
`UIDialogStackHost.tsx` 안에 클래스 컴포넌트 · react-router 어댑터 · 190줄 훅 · 호스트가 섞이면
**파일 경계로 찾던 것을 스크롤로 찾게 바꾸는 것**이라 순이득이 작다.

### 5-4. 문서 · 진입점 (파일 병합과 무관하게 필요)

| 산출물 | 내용 | 해결 |
|---|---|---|
| `core/ui/dialog/README.md` | 3장 실행 추적 + 4장 reason 표 + 불변식 + 아래 역인덱스 | 문제 7 |
| `core/ui/dialog/index.ts` | 공개 표면 barrel + 상단 파일 목차 주석 | 문제 1 |
| `core/hooks/index.ts` 수정 | 내부 파일 직접 import → barrel 경유 | 문제 1 |
| `core/ui/store.ts` → `alertQueueStore.ts` | 이름으로 역할이 드러나게 | 문제 8 |

**버그 → 파일 역인덱스** (README 핵심 표)

| 증상 | 볼 파일 |
|---|---|
| ESC/배경클릭이 안 먹거나 가드를 무시함 | [useDialogFrame.ts:121-139](../src/core/ui/dialog/useDialogFrame.ts#L121-L139) `contentBehavior` |
| `await` 가 안 풀림 / 두 번 resolve | [dialogController.ts:125](../src/core/ui/dialog/dialogController.ts#L125) `settleDialog` |
| 확인 눌러도 안 닫힘 | `runtime.submit` 이 `undefined` 반환 → [:183](../src/core/ui/dialog/dialogController.ts#L183) |
| props 가 갱신 안 됨 | [useLiveProps.ts](../src/core/ui/dialog/useLiveProps.ts) + [useDialogFrame.ts:174](../src/core/ui/dialog/useDialogFrame.ts#L174) |
| 콜백이 옛날 값을 봄 | [useDialogFrame.ts:86-106](../src/core/ui/dialog/useDialogFrame.ts#L86-L106) `stableCallbacks` |
| 화면 전체 클릭 불가 | [UIDialogStackHost.tsx:38-46](../src/core/ui/dialog/UIDialogStackHost.tsx#L38-L46) |
| 중첩 시 딤이 새까매짐 | [DialogSkin.tsx:93](../src/shared/ui/overlay/DialogSkin.tsx#L93) `overlayClassName` |
| 모양·색·버튼 배치 | [DialogSkin.tsx](../src/shared/ui/overlay/DialogSkin.tsx) **만** 열면 됨 |
| z-index 겹침 | [overlay-layers.ts](../src/shared/ui/overlay/overlay-layers.ts) |
| 컨텐츠에서 `useParams` 가 빈 객체 | [DialogRouterBridge.tsx:28](../src/core/ui/dialog/DialogRouterBridge.tsx#L28) — 알려진 미지원 |

---

## 6. 진행 상태

### ✅ 완료

| 항목 | 내용 | 검증 |
|---|---|---|
| 테스트 파일 분리 | 테스트 3종을 [core/ui/dialog/test/](../src/core/ui/dialog/test/) 로 이동 (`git mv`) · 상대 import 10곳 `./` → `../` | `tsc --noEmit` exit 0 · unit 2files/20tests · browser 3files/12tests **전부 통과** |

> vitest `include` 가 `src/**/*.test.{ts,tsx}` 글로브라 폴더 깊이와 무관하게 탐지되고,
> `*.browser.test.tsx` 파일명 규칙이 유지돼 unit/browser project 분리도 그대로 동작함을 확인.

### ⏸ 결정 대기

| # | 결정할 것 | 선택지 |
|---|---|---|
| 1 | 병합 범위 | **A**(7개) / A′(8개) / B(4개) / 병합 안 함 |
| 2 | README 위치 | `core/ui/dialog/README.md` / `plan/` / 둘 다 |
| 3 | 타입 4분할 여부 | 파일 줄이기와 상충 — 5-1 절충안 채택 시 **보류** |
| 4 | `cancel` + `dismissable:false` 동작 | 의도 확인 필요 (4장 문제 3 참고) |
| 5 | 테스트 배치 규칙 통일 | `SectionHeader` 테스트 2개도 `test/` 로 옮길지 + CLAUDE.md 규칙 추가 |

### 권장 작업 순서

병합이 import 경로를 바꾸므로, **문서를 먼저 쓰면 두 번 고쳐야 한다.**

```
1) 병합 (5-3 안 A)              — 외부 import 변경 0건. 각 단계마다 tsc + 테스트
2) reason 표를 controller 최상단 주석으로  (5-1 절충안)
3) index.ts barrel + core/hooks 경유 수정
4) core/ui/store.ts → alertQueueStore.ts 리네임
5) README.md 작성               — 확정된 최종 구조 기준으로
6) 타입 분할 여부 재검토
```

---

## 7. 작업 시 지켜야 할 것

이 기능의 불변식이다. 리팩터링 중 깨지면 **증상이 늦게 나타나서 발견이 매우 어렵다.**

1. **Promise 는 정확히 한 번 반드시 resolve 된다.** `settled` 플래그가 이걸 보장한다.
   절대 reject 하지 않는다 — 아무도 `await` 하지 않는 handle 에서 unhandled rejection 이 터진다.
2. **Radix 에게 닫기 결정권을 주지 않는다.** ESC · 배경클릭 · 외부 인터랙션을 전부 `preventDefault` 하고
   `requestCloseDialog()` 한 곳으로 모아야 `beforeClose` 가드가 무력화되지 않는다.
   → [DialogSkin.tsx](../src/shared/ui/overlay/DialogSkin.tsx#L49) 의 `{...frame.contentProps}` 를 지우면
   **잘 닫히는 것처럼 보이지만** 작성 중이던 폼이 확인 없이 날아간다.
3. **컨텐츠 렌더 실패는 반드시 정산된다.** 에러 경계가 `Suspense` **바깥**에 있어야
   `loadable(() => import(...))` 의 청크 로드 실패를 잡는다. → [DialogBody.tsx](../src/core/ui/dialog/DialogBody.tsx#L22) 의 중첩 순서.
4. **`dialogStore` 는 순정 zustand 를 쓴다.** `defineStore`(immer) 는 auto-freeze 하는데
   여기엔 컴포넌트 함수 · ReactNode · 사용자 props · resolve 콜백이 들어간다. → [dialogStore.ts:7](../src/core/ui/dialog/dialogStore.ts#L7)
