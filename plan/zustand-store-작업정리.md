# Zustand 전역 상태 관리 — 작업 인수인계

> 집/회사 어디서든 이어서 작업하기 위한 정리 문서.
> 목표: 이 스캐폴드에서 **Zustand를 "한 방향으로 단순하게" 쓰는 표준**을 세우고, example 도메인에 실제 데모를 남긴다.

---

## 1. 배경 · 목표

- 이 프로젝트는 서버 상태 = TanStack Query(`useApi`), **클라이언트 전역 상태 = Zustand** 로 역할을 나눈다.
- 기존엔 `src/core/ui/store.ts`(`useUIStore`) 하나만 Zustand를 쓰고 있었다(다이얼로그 큐).
- 이번 작업의 목적: **업무 개발자가 전역 상태를 만들 때 따라갈 표준**(어디에 둘지 / 어떻게 만들지 / 어떻게 쓸지)을 확정하고 데모로 못박기.

---

## 2. 확정된 규칙 (가장 중요 — 이것만 지키면 됨)

### 2-1. 배치: "누가 공유하는가"로 결정 (레이어 3분할)

| 공유 범위 | 위치 | 비고 |
|---|---|---|
| 한 컴포넌트 안 | `useState` | 스토어 불필요 |
| 같은 도메인 내 여러 파일 | `src/domains/<도메인>/store/` | 도메인 전용. 다른 도메인 import 금지 |
| 서로 다른 도메인 | `src/shared/store/` | 앱 공용. 도메인끼리 서로 import 하지 않고 모두 shared만 바라봄 |
| **도구(팩토리)** | `src/core/store/` | **불가침 인프라.** 업무 상태 안 넣음 |

- `src/core/` 는 **불가침**. 업무 상태를 새로 넣지 않는다.
- 승격 흐름: 처음엔 `domains/<도메인>/store/` 로 시작 → 다른 업무에서도 필요해지면 파일을 `shared/store/` 로 옮기고 import 경로만 수정 (코드는 동일 → 이동 비용 거의 0). **처음부터 과하게 shared로 올리지 말 것.**

### 2-2. 생성: 순정 `create` 대신 팩토리 `createStore` 사용

```ts
// src/core/store/createStore.ts (도구, 불가침)
createStore(
  초기상태,                       // 여기 있는 키가 persist 저장 대상
  (set, get) => ({ ...액션 }),    // 액션은 스토어 안에 정의
  { name, persist },              // name 필수
)
```

- `persist: true` → 새로고침 유지(기본 localStorage, `{ storage: 'session' }` 전환). **액션(함수)은 저장에서 자동 제외.**
- devtools는 개발환경(`import.meta.env.DEV`)에서 자동 부착.
- 액션끼리 호출이 필요하면 `get()` 대신 `useXxxStore.getState().다른액션()`.
- `useApi`(도구)가 `core/hooks` 에 있고 실제 호출은 도메인에서 하는 것과 **동일한 대칭 구조**.

### 2-3. 사용: **한 방향으로 고정 = 구조분해 한 줄**

```tsx
const { items, toggle } = useFavoritesStore();   // 항상 이 형태
```

- 셀렉터(`useStore(s => s.x)`)로 이랬다저랬다 하지 않는다. **호출부는 스토어 크기와 무관하게 항상 구조분해 한 줄.**
- 낭비 리렌더는 호출부가 아니라 **스토어 설계로 막는다**: "한 관심사 = 작은 스토어" 를 지키면 값들이 항상 같이 바뀌므로 낭비 리렌더가 생길 구조 자체가 안 만들어진다.
- **거대한 만능 스토어를 만들지 말 것** — 이게 이 규칙의 유일한 전제.
- (참고: 셀렉터 방식은 "무관한 값이 많은 큰 스토어"에서만 이득인데, 위 원칙을 지키면 그런 스토어를 안 만들게 됨.)

---

## 3. 만든/바꾼 파일

### 새로 만든 파일
| 파일 | 역할 | 계층 |
|---|---|---|
| `src/core/store/createStore.ts` | Zustand 팩토리(persist/devtools 배선, 표준화) | core(불가침) |
| `src/domains/example/store/favoritesStore.ts` | 즐겨찾기 스토어 인스턴스(`useFavoritesStore`) | 도메인 전용 |
| `src/domains/example/pages/store/FavoriteCatalog.tsx` | **저장 페이지** — 하트로 담기 | pages |
| `src/domains/example/pages/store/FavoriteList.tsx` | **사용 페이지** — 스토어에서 읽기 | pages |

### 수정한 파일
| 파일 | 변경 |
|---|---|
| `src/domains/example/router/index.tsx` | 라우트 2개 등록: `store/catalog`, `store/favorites` |
| `src/shared/layouts/default/config/navigation.tsx` | 사이드바 "Store (Zustand)" 그룹 추가 |

### 데모 동작
- 담기 페이지(`/example/store/catalog`): 상품 목록에서 하트 → `useFavoritesStore.toggle(item)` 저장
- 목록 페이지(`/example/store/favorites`): 상품 마스터를 모른 채 `useFavoritesStore` 만 읽어 렌더
- 두 페이지가 같은 스토어 공유 → 라우트 이동해도 유지 + `persist: true` 라 **새로고침해도 유지**

---

## 4. 현재 상태 (2026-07-06 기준)

- ✅ 타입체크: `npx tsc --noEmit -p tsconfig.app.json` → **0 에러**
- ✅ 린트: 변경 파일 `npx eslint ...` → **0 에러**
- ⚠️ **미커밋 변경 있음**: `FavoriteCatalog.tsx`, `FavoriteList.tsx`
  - 내용: 소비 코드를 "필드별 셀렉터 여러 줄" → **"구조분해 한 줄"** 로 단순화한 것 (위 2-3 규칙 반영)
  - 이미 커밋된 것: `createStore.ts`, `favoritesStore.ts`, 라우터, 네비게이션, 페이지 초안
    - `51cf4b2 store 상태 저장, 사용 예제 페이지 생성`
    - `9cbebe4 zustand를 활용한 상태저장 생성 파일 추가`

### 집에서 시작하면 먼저 할 일
```bash
git status                 # FavoriteCatalog.tsx / FavoriteList.tsx 수정 확인
git add -A && git commit   # "store 소비 코드 구조분해 한 줄로 단순화" 등
npm run dev                # 사이드바 > Store (Zustand) 에서 실제 동작 확인
```

---

## 5. 남은 일 / 다음 후보 (선택)

- [ ] **브라우저 실동작 확인** (아직 안 함): 담기 → 목록 이동 → 새로고침 유지까지 눈으로 검증
- [ ] `src/core/store/index.ts` 배럴 export 추가 여부 (현재는 `@/core/store/createStore` 직접 import). `useApi`가 `@axiom/hooks` 로 나가는 것과 대칭 맞출지 결정
- [ ] Storybook / 문서에 사용법 반영할지
- [ ] `shared/store/` 로 승격하는 실제 케이스가 생기면 그때 예시 하나 더

---

## 6. 결정하지 말아야 할 함정 (되돌아보지 말 것)

- ❌ 소비부에서 "값 많아지면 셀렉터로 바꿔라" 식으로 이랬다저랬다 → **안 함.** 항상 구조분해, 대신 스토어를 작게.
- ❌ `core/` 에 업무 스토어 넣기 → **안 함.** core는 도구(createStore)만.
- ❌ 자동 셀렉터(`useStore.use.필드()`) 방식 → 검토했으나 **채택 안 함** (구조분해 고정으로 결정).

---

## 7. 관련 메모리 (Claude 세션 간 공유)

- `memory/zustand_store_placement.md` — 위 2번 규칙 전체가 기록되어 있음. 다음 세션에서 자동 참조됨.
