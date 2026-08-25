# 인증 (JWT)

로그인 · 토큰 갱신 · 로그아웃 · 라우트 보호 · 탭 간 동기화가 **동작하는 부품**으로 들어 있다.
**배선은 되어 있지 않다.** 화면과 라우트는 프로젝트가 만들고, 반복되는 로직은 훅으로 가져다 쓴다.

> ## 붙이는 절차는 여기가 아니다
>
> **[`plan/jwt인증-공통개발자-적용가이드.md`](../../../plan/jwt인증-공통개발자-적용가이드.md)**
> — 어느 파일에 어떤 코드를 넣는지 순서대로 있다. 로그인 화면 · 타입 · 라우터 전문 포함.
>
> 업무 개발자용 사용법: [`plan/jwt인증-업무개발자-사용가이드.md`](../../../plan/jwt인증-업무개발자-사용가이드.md)
>
> 이 문서는 **모듈 자체의 설명서**다 — 무엇이 있고, 무엇을 열지 않으며, 왜 그렇게 생겼는지.

---

## 왜 배선이 비어 있나

프로젝트마다 로그인 방식·화면·서버 규약이 다르다. 예제를 배선까지 해서 넣어두면
스캐폴드를 반입한 프로젝트가 가장 먼저 하는 일이 **그걸 지우는 일**이 된다.
게다가 첫 `npm run dev` 에서 랜딩 페이지 대신 남의 로그인 화면이 뜬다.

그래서 스캐폴드는 **부품만** 준다. 조립은 가이드가 안내한다.

기본 상태에서는:

- `src/shared/auth/**` 가 아무데서도 참조되지 않아 **번들에 들어가지 않는다**
- 어떤 라우트도 보호되지 않고, 인증 관련 네트워크 요청이 나가지 않는다
- 인증을 쓰지 않는 프로젝트는 **아무것도 안 해도 된다**

---

## 소유권 — 무엇을 고치고 무엇을 두는가

스캐폴드는 프로젝트에 한 번 반입하고 끝나는 물건이 아니다. 나중에 새 버전을 다시 받을 수 있으므로,
**"덮어써도 되는 것"과 "이 프로젝트 것"이 파일 단위로 갈려 있어야 한다.**

| | 경로 | 성격 |
|---|---|---|
| **스캐폴드 소유** | `src/shared/auth/**` | 로직 · 전략 · 인터셉터 · 훅 · 게이트. **열지 않는다** |
| | `src/types/auth.ts` | 인증 모듈이 쓰는 형태. 서버에 따라 안 바뀐다 |
| **이 프로젝트 소유** | `.env` | 주소 · 저장소 키 |
| | `src/config/auth.config.ts` | 설정 + **확장 지점 3개** |
| | `src/domains/auth/**` | 타입 · 로그인 화면 · 라우트 — 프로젝트가 만든다 |
| | `src/shared/router/index.tsx` | 어느 라우트를 보호할지 |
| | `src/main.tsx` | 부팅 배선 세 줄 |

> `src/shared/auth/**` 를 열게 됐다면 설정으로 흡수할 수 있는 범위를 넘었거나,
> 스캐폴드에 확장 지점이 빠진 것이다. 후자라면 스캐폴드 쪽 결함이니 **알린다.**

> ⚠️ **`src/config/auth.config.ts` 는 지우지 않는다.** 이 폴더의 다섯 파일이 그걸 정적 import 하고,
> 일부는 **모듈 로드 시점에** 값을 읽는다. 파일이 없으면 컴파일되지 않는다.

---

## 공개 입구 — `index.ts` 에 있는 것만 쓴다

```ts
import { useAuth, useLogin, useLogout, ProtectedRoute } from '@/shared/auth';
```

여기에 없는 것(전략 내부 · 인터셉터 내부 · 세션 정리 · 토큰 쓰기)은 모듈 내부 사정이라
직접 부르면 안 된다. 특히 **토큰 쓰기는 일부러 내보내지 않는다** — 보관 위치는 전략이
단독으로 결정하고, 밖에서 직접 쓰면 저장소에 옛 값이 남는다.

---

## 화면에서 쓰는 것 — 훅 셋

### `useAuth<TUser>()`

```tsx
const { status, user, isAuthenticated, isRefreshing, hasRole } = useAuth<IAppUser>();

{isAuthenticated && <span>{user?.name}</span>}
{hasRole('admin') && <AdminMenu />}
```

사용자 타입은 프로젝트가 정한다. 스캐폴드는 사용자 객체의 내용을 모른다.
필드별로 구독하므로 `status` 만 바뀌는 갱신 때 이름을 그리는 화면이 리렌더되지 않는다.

### `useLogin()`

```tsx
const { submit, pending, error, reset } = useLogin();
```

| | |
|---|---|
| `submit(credentials)` | 받은 객체를 그대로 서버에 보낸다. 성공하면 `true` |
| `pending` | 요청 중. **성공 후에도 true 로 유지된다** (이중 제출 방지) |
| `error` | 서버가 준 메시지. 없으면 기본 문구 |
| `reset()` | 에러·진행 상태 초기화 |

실패 문구를 바꾸려면 `useLogin({ fallbackMessage: '...' })`.

### `useLogout()`

```tsx
const { logout, pending } = useLogout();

<button onClick={logout} disabled={pending}>로그아웃</button>
```

서버 호출이 실패해도 **던지지 않는다.** 화면은 항상 로그아웃된다.
서버가 죽었을 때 로그아웃 버튼이 안 먹으면 그 화면에서 나갈 방법이 없기 때문이다.

> React 밖(이벤트 핸들러 · 유틸)에서 필요하면 `login()` · `logout()` 을 직접 부른다.
> 화면 안에서는 훅이 낫다 — pending 과 에러 메시지까지 같이 관리한다.

### `<ProtectedRoute />`

```tsx
{ element: <ProtectedRoute />, children: [ /* 로그인 필수 */ ] },
{ element: <ProtectedRoute roles={['admin']} />, children: [ /* 권한까지 */ ] },
```

미인증이면 `authConfig.loginPath` 로 보내면서 원래 경로를 `state.from` 에 담는다.
권한 부족은 기본적으로 홈으로 — 바꾸려면 `forbiddenPath="/no-permission"`.

> ⚠️ 로그인 라우트는 **반드시 게이트 바깥**이다. 안에 넣으면 로그인하러 가는 길이
> 다시 막혀 무한 리다이렉트가 된다.

---

## 확장 지점 — `shared/auth` 를 열지 않고 동작 바꾸기

셋 다 `src/config/auth.config.ts` 에 있다.

### `resolveRoles(user)` — 권한을 꺼내는 방법

```ts
resolveRoles: (user) => (user.role ? [String(user.role)] : []),
// 배열로 주는 서버라면
resolveRoles: (user) => (user.roles as string[]) ?? [],
```

`<ProtectedRoute roles={[...]} />` 와 `hasRole()` 이 이 함수를 쓴다.
권한 가드를 안 쓰면 지워도 된다. 다만 지운 상태에서 `roles` 를 지정하면 **막는 쪽으로 동작한다**
(개발 콘솔에 사유가 찍힌다) — 가드가 조용히 열려 있는 것보다 낫다.

### `onLoginSuccess(session)` — 로그인 직후 할 일

```ts
onLoginSuccess: async (session) => {
	await prefetchMenus(session);      // 메뉴·권한 조회
	trackLogin(session.user);          // 접속 기록
},
```

이 시점에 토큰과 상태는 **이미 확정돼 있다.** 여기서 던지면 에러가 로그인 화면까지 전달되지만
로그인 자체는 유지된다. 되돌리고 싶으면 이 안에서 `logout()` 을 부른다.

### `onSessionEnd(reason)` — 세션이 끝났을 때

```ts
onSessionEnd: (reason) => {
	if (reason === 'expired') window.$ui?.alert('세션이 만료되었습니다.');
	window.$router?.replace('/auth/login');
},
```

| `reason` | 언제 |
|---|---|
| `logout` | 사용자가 로그아웃했다 |
| `expired` | 갱신에 최종 실패했다 (세션 만료 · refresh 폐기) |
| `other-tab` | 다른 탭에서 로그아웃했다 |

**이동은 스캐폴드가 하지 않는다.** 로그인 화면으로 보낼지, SSO 로그아웃 URL 로 보낼지,
안내를 띄울지는 프로젝트마다 다르다. `shared/auth` 가 라우터를 몰라야 폴더 단위로 이식되고
테스트도 된다.

### 그 밖의 커스터마이즈

| 하고 싶은 것 | 어디서 |
|---|---|
| 모든 요청에 공통 헤더 추가 | `src/config/api.config.ts` 의 `headers` |
| 로그인 상태에 따라 동적 헤더 추가 | `main.tsx` 에서 `registerRequestInterceptor()` 로 하나 더 등록 |
| access 수명 · 재시도 횟수 | 서버 정책이다. 프론트에서 바꿀 값이 아니다 |

---

## `strategy` 고르는 법

서버 담당에게 **이것만** 물어보면 정해진다.

```
Q. 로그인하면 refresh token 을 어떻게 주시나요?

  "Set-Cookie 로 내려줍니다 (httpOnly)"         →  'cookie'        ← 권장
  "응답 body 에 refreshToken 으로 넣어드립니다"  →  'storage'
  "refresh 는 없고 access 만 있습니다"           →  'access-only'
```

`cookie` 가 가능한지부터 묻는다. **가능한데 안 쓰는 것과 불가능해서 못 쓰는 것은 다르다.**

| | **`cookie`** (기본·권장) | **`storage`** | **`access-only`** |
|---|---|---|---|
| access 보관 | **메모리** | localStorage | localStorage |
| refresh 보관 | 브라우저 (JS 접근 불가) | localStorage | — |
| 갱신 요청 | 쿠키가 자동으로 실린다 | body 에 실어 보낸다 | — |
| 새로고침 유지 | 부팅 갱신 1회 | 저장소에서 복원 | 저장소에서 복원 |
| 401 을 받으면 | 갱신 → 재시도 | 갱신 → 재시도 | **정리 → 로그인 화면** |
| XSS 내성 | **높다** | 낮다 | 낮다 |

`storage` · `access-only` 를 고르면 개발 콘솔에 하향 경고가 한 번 뜬다.
**막지는 않는다** — 서버가 그렇다면 다른 방법이 없다. 운영 빌드에서는 나오지 않는다.

`access-only` 를 따로 둔 이유는 코드는 거의 같지만 **401 을 받았을 때의 행동이 정반대**이기
때문이다(갱신 시도 vs 즉시 로그아웃). 불리언 하나로 감추면 원인을 찾을 수 없다.

---

## 서버에 요구할 것

**1~4 는 공통, 5~6 은 `cookie` 전략에서만 필요하다.**

1. **`refresh` 엔드포인트에 인증 미들웨어를 붙이지 않는다.** access 가 만료돼서 오는 요청이다.
2. **access 만료는 `401` 로 준다.** 403 이나 `200 + 에러코드`로 주면 자동 갱신이 발동하지 않는다.
3. **로그인 실패(비밀번호 틀림)도 401 이지만 갱신 대상이 아니다.** 프론트가 URL 로 구분한다.
4. **회전(rotation)을 한다면 직전 refresh 를 몇 초간 유예해준다.**
   프론트의 동시 요청은 single-flight 로 묶지만 그것은 **탭 단위**다.
   탭이나 기기가 둘 이상이면 동시 갱신이 반드시 생기고, 유예가 없으면 그때마다
   재사용 감지에 걸려 **계정 전체가 로그아웃된다.**
5. **CORS** — `Access-Control-Allow-Credentials: true` 와 **구체적인** `Access-Control-Allow-Origin`.
   `*` 이면 브라우저가 막는다. (dev 는 Vite 프록시로 동일 출처를 만들어 우회한다)
6. **쿠키 속성** — `HttpOnly` 필수, `SameSite=Lax` 이상, 운영(HTTPS)에서는 `Secure`.
   `Path` 를 `/api/auth` 로 좁히면 나머지 요청에 refresh 가 실려 나가지 않는다.

5~6 의 합의가 안 되면 `cookie` 를 쓸 수 없다. 그때는 `storage` 로 내려가면 되고,
**그 이유로 이 폴더를 뜯을 일은 없다.**

---

## 확인 체크리스트

붙인 뒤 실서버로 돌린다. 항목별 기대값은
[적용 가이드 §5](../../../plan/jwt인증-공통개발자-적용가이드.md) 에 표로 있다.

특히 눈여겨볼 것:

- **비밀번호 오류** — 갱신 시도로 번지면 안 된다. Network 에 `refresh` 가 나가면 실패다.
- **동시 401** — `refresh` 가 2개 이상이면 회전하는 서버에서 계정이 로그아웃된다.
- **새로고침** — 폼이 번쩍이면 `bootAuth()` 가 렌더 뒤에 있다.

6·7번(자동 갱신 · single-flight)은 개발 콘솔 프로브로 본다. `main.tsx` 에서
`registerAuthDevProbe()` 를 켜면 `window.__auth` 가 생긴다.

```js
await __auth.me();       // 만료 후에 부르면  me 401 → refresh 200 → me 200
await __auth.burst(5);   // me 401 x5 → refresh 200 x1 → me 200 x5
```

`fetch()` 로 직접 찌르면 인터셉터를 타지 않아 이 검증이 성립하지 않는다.

---

## 여기까지가 설정, 그 밖은 코드

아래는 **설정으로 흡수하지 않는다.** 이런 서버를 만나면 이 폴더를 그 프로젝트에서 고쳐 쓰는 편이 낫다.

- JWT 가 아니라 **세션 쿠키**를 쓰는 서버
- **SSO 리다이렉트**로 토큰을 받는 서버
- `Authorization` 이 아니라 **커스텀 헤더**(`X-Auth-Token` 등)를 요구하는 서버

"여기까지가 설정이고 그 밖은 코드를 고치는 영역"이라는 경계를 알려주는 것도 스캐폴드의 일이다.
고쳐 썼다면 **무엇을 왜 고쳤는지 남기고, 스캐폴드 담당에게 알린다.**

---

## 내부 구조 — 열게 됐을 때의 지도

```
shared/auth/
├─ index.ts               공개 입구 — 여기 있는 것만 쓴다
├─ auth-flow.ts           **부팅 · 로그인 · 로그아웃 · 갱신 · 정리 · 탭동기화**
├─ auth-api.ts            서버 호출 (엔드포인트 · 응답 매핑)
├─ auth-strategies.ts     저장 전략 3벌 + 토큰 보관
├─ auth-interceptor.ts    Bearer 주입 · 401 → 갱신 → 재시도
├─ auth-hooks.ts          useAuth · useLogin · useLogout
├─ auth.store.ts          status · user
├─ ProtectedRoute.tsx     라우트 게이트
└─ dev-probe.ts           콘솔 확인용 (dev 전용)
```

`auth-hooks.ts` 와 `ProtectedRoute.tsx` 만 React 에 의존한다. 나머지는 순수 로직이라 화면 없이도 돌고 테스트할 수 있다.

> **처음 파악한다면 이 순서로 읽으면 된다** — 이 README → `config/auth.config.ts`(설정) → `auth-flow.ts`(무슨 일이 언제 일어나는가).
> 그 셋이면 전체가 잡히고, 나머지는 필요할 때만 연다.

### 설계 이유 몇 가지

**상태를 Context 가 아니라 스토어에 두는 이유** — 응답 인터셉터는 React 컴포넌트가 아니다.
모듈 스코프 함수라 Context 에 닿지 못한다. Context 로 가면 "인터셉터가 쓸 수 있게 setter 를
모듈 변수에 심어두는" 우회가 반드시 따라붙는다. zustand 는 `useAuthStore.getState()` 로도
읽혀 그 우회가 필요 없다.
