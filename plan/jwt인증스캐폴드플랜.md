# JWT 인증 — 스캐폴드 제공 기능 설계

> 작성: 2026-08-25
> 개정: 2026-08-25 — 저장 전략을 `useRefresh` 불리언에서 **프리셋 3개**로 승격 (§3③·§4.8)
> 개정: 2026-08-25 — **S1~S13 구현 완료.** 구현 중 드러난 사실을 §1·§2·§5·§6·§7·§9·§10·§11에 반영
> 개정: 2026-08-25 — **스캐폴드 컨셉 기준 리팩터링(§12).** 소유권 분리 · 훅 추출 · 확장 지점 · 권한 가드
> 개정: 2026-08-25 — **파일 통합(§12⑧).** 인증 파일 27개 → 14개, shared/auth 17개 → 9개
>
> 이 문서는 **스캐폴드가 SI 프로젝트에 제공할 JWT 인증 세팅**의 설계다.
> 우리 앱 하나에 로그인을 붙이는 계획이 아니다. 독자는 이 스캐폴드를 복사해 쓰는 **다음 개발자**다.
> 서버는 만들지 않는다. 전제하는 계약을 §2에 적고 그것만 요구한다.
>
> 짝 문서: `plan/jwt인증로직플랜.md` — 서버 측 구현 플랜이다. 대상 레포가 다르므로(server/ 폴더,
> knex 마이그레이션, 4200 포트) 이 레포의 작업 지시로 읽지 않는다. §1·§2의 구조 설명만 이 문서가 계승했다.
>
> **구현 상태: S1~S13 완료, S14는 문서만 완료(테스트 미작성).**
> SI가 읽을 사용 문서는 [src/shared/auth/README.md](../src/shared/auth/README.md)로 분리했다.
> 이 문서는 *왜 그렇게 했는지*를 남기는 설계 기록으로 유지한다.

---

## 1. 완료 기준 — SI 개발자가 하는 일

이 기능의 명세는 "무엇이 동작하는가"가 아니라 **"SI 개발자가 몇 개를 만지는가"**다.
아래 다섯 가지가 전부여야 한다.

```
1. .env                        VITE_API_BASE_URL 한 줄
2. src/config/auth.config.ts   strategy 한 줄 + 엔드포인트 + 응답 키 매핑
3. src/domains/auth/types.ts   ILoginCredentials · IAppUser — 서버가 받고 주는 "모양"
4. 로그인 화면                  login({ loginId, password }) 호출 한 줄
5. src/shared/router/index.tsx 보호할 라우트를 ProtectedRoute 아래로 넣기
```

> **3번은 구현 중에 추가됐다(원래 네 개였다).**
> 처음에는 `buildLoginBody(loginId, password)`를 설정에 두려 했는데, 그것은 **필드 이름만 바꿀 뿐
> 개수를 못 바꾼다.** 회사코드·OTP·사번처럼 세 번째 값이 필요한 서버가 SI 현장에 흔하고,
> 그 순간 SI가 `shared/auth/auth-api.ts`를 열게 되어 이 판정이 깨진다.
> **응답에서 꺼내는 쪽(`extract*`)만 열고 보내는 쪽을 고정한 것이 비대칭이었다.**
> 자격 증명을 타입으로 열면 개수 제약이 사라지고, 필드명을 틀렸을 때 서버가 401을 줄 때까지
> 기다리지 않고 컴파일에서 걸린다. 사용자 타입도 어차피 SI가 고쳐야 하는 값이라 같은 파일에 모인다.
>
> **위치는 §12에서 한 번 더 옮겼다** — `src/types/auth.ts`(스캐폴드 소유)가 아니라
> `src/domains/auth/types.ts`(SI 소유)다. 사유는 §12①.

그리고 **열지 않아도 되는 것**을 같이 못 박는다.

```
src/core/**              불가침 (기존 규칙)
src/shared/auth/**       전략 · 인터셉터 · single-flight · 부팅 갱신 · 탭 동기화가 전부 들어있다
src/main.tsx             부팅 배선은 끝나 있다 (인증을 끌 때만 §10에서 세 줄 본다)
```

> **이 목록이 곧 합격 판정이다.** 위 다섯 개 말고 다른 파일을 SI가 열어야 하는 상황이 생기면,
> 그건 그 SI 프로젝트의 사정이 아니라 **스캐폴드의 결함**이다. 설계할 때 이 기준으로 되묻는다.

착수 시점에 갈아끼울 자리는 이미 뚫려 있었고, 채워져 있지 않을 뿐이었다.

| 착수 전에 뚫려 있던 구멍 | 위치 | 결과 |
|---|---|---|
| 저장 위치 교체구 `setAccessTokenResolver()` | `src/shared/auth/token-store.ts` | **제거함** (아래) |
| 인증 로직 주입 창구 `registerRequestInterceptor` / `registerResponseInterceptor` | `src/core/api/index.ts` | 그대로 씀 |
| 인증 설정 단일 소유 파일 | `src/config/auth.config.ts` | 확장 |
| 라우트 게이트 자리 | `src/shared/components/router/ProtectedRoute.tsx` | `status` 기반으로 교체 |

> **`setAccessTokenResolver()`를 지운 이유** — 세 전략을 다 만들어보니 어느 쪽도 쓰지 않았다.
> `storage` 계열은 `persist()`에서 저장소에 쓰고 `loadOnBoot()`에서 **부팅 1회만** 읽으면 되고,
> 읽기는 언제나 메모리다. 그러면 §4.1이 경고한 "저장소에 남은 옛 토큰이 갱신 결과를 덮어쓰는"
> 사고가 구조적으로 나지 않는다. resolver로 가면 `setAccessToken()`이 전략에 따라 **효력이 없어져**
> 같은 함수가 상황마다 다르게 동작하고, export된 교체구는 §4.8의 "전략이 저장 위치를 단독으로
> 결정한다"와 어긋나는 신호를 준다.

따라서 이 작업은 **새 구조를 만드는 일이 아니라 뚫린 구멍을 표준 구현으로 채우고
어디를 갈아끼우는지 문서화하는 일**이었다. 예상 밖의 작업은 core 수정 1건뿐이다(§6).

---

## 2. 전제하는 서버 계약

우리가 구현하지 않는다. 서버 담당에게 **요구할 명세**다.
**요구 수준은 §3의 전략에 따라 달라진다.** 아래는 기본값인 `cookie` 전략 기준이고,
`storage` 전략은 서버에 요구할 것이 사실상 없다(§3③ 표).

### 두 개의 토큰

| | access token | refresh token |
|---|---|---|
| 형태 | JWT | 불투명 난수 (JWT가 아니어도 된다) |
| 수명 | 15분 안팎 | 14일 안팎 |
| 보관 위치 | 클라이언트 **메모리** (JS 변수) | **`httpOnly` 쿠키** |
| 전달 | `Authorization: Bearer <token>` | 브라우저가 자동 전송 |
| 쓰는 곳 | 모든 API 요청 | `refresh` · `logout` **만** |
| 취소 | 불가 — 만료를 기다린다 | 가능 — 서버가 폐기한다 |

> **refresh를 JWT로 만들 필요는 없다.** JWT의 값어치는 "DB를 안 봐도 검증된다"인데,
> refresh는 폐기 여부를 확인해야 하므로 어차피 DB를 본다. `cookie` 전략에서 프론트는 이 값을
> **읽지 못하므로**(httpOnly) 형태에 관여하지 않는다. 서버가 정하면 된다.

### 다섯 가지 흐름

```
① 로그인
   화면 ──POST {endpoints.login} {loginId, password}──► 서버
        ◄── 200 { accessToken, user }                      (access는 body)
        ◄── Set-Cookie: refresh_token=…; HttpOnly; SameSite=Lax; Path=/api/auth
   화면: accessToken을 메모리에 둔다. localStorage에 아무것도 쓰지 않는다.

② 일반 요청
   화면 ──GET /api/…  Authorization: Bearer <access>──► 서버
        ◄── 200                                    (쿠키는 Path 때문에 실리지 않는다)

③ 갱신 (access 만료 · 401)
   화면 ──POST {endpoints.refresh}  (쿠키 자동 전송)──► 서버
        ◄── 200 { accessToken, user }
        ◄── Set-Cookie: refresh_token=<새 값>       ★ 회전 — 옛 refresh는 즉시 폐기
   화면: 새 access를 메모리에 넣고 실패했던 요청을 다시 보낸다.

④ 부팅 · 새로고침
   메모리는 비어 있다. 쿠키는 살아 있다.
   화면 ──POST {endpoints.refresh}──► 서버
        성공 → access 확보, 화면 진입
        실패 → 로그인 화면
   이 왕복 동안 화면은 로그인도 대시보드도 아닌 「스플래시」다.

⑤ 로그아웃
   화면 ──POST {endpoints.logout}  (쿠키 자동 전송)──► 서버
        ◄── 204 + Set-Cookie: refresh_token=; Max-Age=0
   화면: 메모리 access를 비우고 쿼리 캐시를 지운 뒤 로그인 화면으로.
```

### 프론트가 서버에 요구하는 최소 조건

이 목록이 지켜지지 않으면 기본 구성이 동작하지 않는다. 서버 담당에게 그대로 전달한다.
**1~4는 모든 전략 공통이고, 5~6은 `cookie` 전략에서만 필요하다.**

1. **`refresh` 엔드포인트에 인증 미들웨어를 붙이지 않는다.** access가 만료돼서 오는 요청이다.
2. **access 만료는 `401`로 준다.** 403이나 200+에러코드로 주면 갱신이 발동하지 않는다.
3. **로그인 실패(비밀번호 틀림)도 401이지만 갱신 대상이 아니다.** 프론트가 URL로 구분한다(§4.5).
4. **회전한다면 직전 refresh를 몇 초간 유예해준다.** ← 구현 중 추가
   §4.6의 single-flight는 **탭 단위**다(모듈 스코프 변수). 탭이나 기기가 둘 이상이면
   동시 갱신이 반드시 생기고, 유예가 없으면 그때마다 재사용 감지에 걸려 **계정 전체가 로그아웃된다.**
   프론트가 아무리 잘 짜도 막을 수 없는 종류라 서버 쪽 조건으로 옮긴다.
5. **CORS** — 쿠키를 쓰므로 `Access-Control-Allow-Credentials: true`와
   **구체적인** `Access-Control-Allow-Origin`이 필요하다. `*`이면 브라우저가 막는다.
   dev는 Vite 프록시(`/api` → `VITE_SERVER_URL`)로 동일 출처를 만들어 이 문제를 우회한다.
6. **쿠키 속성** — `HttpOnly` 필수, `SameSite=Lax` 이상, 운영(HTTPS)에서는 `Secure`.
   `Path`를 `/api/auth`처럼 좁히면 나머지 요청에 refresh가 실려 나가지 않는다.

> **5~6의 합의가 안 되면 `cookie` 전략을 쓸 수 없다.** 그게 이 스캐폴드가 `storage` 전략을
> 같이 내장하는 이유다. 서버 담당을 설득하지 못했다는 이유로 SI가 `shared/auth`를 뜯게 두지 않는다.

> **회전(rotation)과 재사용 감지는 서버의 일이다.** 다만 프론트가 그것 때문에 지켜야 할 규칙이 하나 있다 —
> **refresh 요청이 동시에 두 개 나가면 안 된다.** 회전하는 서버에서는 두 번째가 "폐기된 토큰"으로 걸려
> 계정 전체가 로그아웃된다. §4.6의 single-flight와 §4.4의 부팅 1회 보장이 이 요구에서 나온다.

---

## 3. 서버가 계약과 다를 때 — 갈아끼움 3곳

**결정: 표준 구조를 기본값으로 고정하고, 갈아끼움 지점은 세 개만 연다.**

전략 어댑터로 전부 개방하면 유연해지지만, 스캐폴드 사용자가 읽고 이해해야 할 개념이 늘어
목적(쉽게)과 멀어진다. 반대로 완전 고정하면 서버가 조금만 달라도 `shared/auth` 내부를 열게 되어
§1의 합격 판정이 깨진다. 실제 SI 현장에서 갈리는 지점만 셋을 골랐다.

### ① 엔드포인트 경로

```ts
endpoints: { login: '/auth/login', logout: '/auth/logout', refresh: '/auth/refresh', me: '/auth/me' }
```

경로만 다른 경우가 압도적으로 많다. 여기서 흡수한다.

> ⚠️ **`loginPath`와 `endpoints.login`은 다른 것이다.** 앞은 라우트 경로(`/#/auth/login`),
> 뒤는 API 경로다. 이름이 비슷해 반드시 헷갈리므로 `auth.config.ts` 주석에 명시한다.

### ② 응답에서 토큰·사용자를 꺼내는 방법

```ts
extractAccessToken:  (body) => body.accessToken,
extractRefreshToken: (body) => body.refreshToken,   // storage 전략에서만 쓰인다
extractUser:         (body) => body.user,
```

`accessToken` / `token` / `data.access_token` — 서버마다 다르다.
스캐폴드가 여러 키를 방어적으로 탐색하지 않는다. **함수 하나로 SI가 명시한다.**

> **탐색을 넣지 않는 이유** — `body.accessToken ?? body.token ?? body.data?.token` 식의 코드는
> 붙는 순간에는 편하지만, 서버가 응답을 바꿨을 때 **조용히 다른 키를 집어 계속 동작하는 척한다.**
> 그때 나는 버그는 원인을 찾기 어렵다. 한 줄 적게 하려다 하루를 쓴다.

### ③ 저장 전략 — 프리셋 3개

```ts
strategy: 'cookie' | 'storage' | 'access-only'
```

| | **`cookie`** (기본·권장) | **`storage`** | **`access-only`** |
|---|---|---|---|
| 서버가 refresh를 주는 방법 | `Set-Cookie` (httpOnly) | 응답 body `{ refreshToken }` | 주지 않는다 |
| access 보관 | **메모리** | `localStorage` | `localStorage` |
| refresh 보관 | 브라우저 (JS 접근 불가) | `localStorage` | — |
| 갱신 요청 | 쿠키가 자동으로 실린다 | body에 실어 보낸다 | — |
| 새로고침 유지 | 부팅 갱신 1회(④) | 저장소에서 복원 | 저장소에서 복원 |
| 401을 받으면 | 갱신 → 재시도 | 갱신 → 재시도 | 정리 → 로그인 화면 |
| 서버에 요구할 것 | §2 전체 (CORS·쿠키 속성) | §2의 1~3만 | §2의 2만 |
| XSS 내성 | **높다** | 낮다 | 낮다 |
| 언제 고르나 | 서버와 쿠키 합의가 됐을 때 | 서버가 body로 줄 때 | refresh가 아예 없을 때 |

**왜 `storage`가 필요한가** — 쿠키 방식은 서버가 CORS와 `Set-Cookie` 속성을 맞춰줘야 성립한다.
합의가 안 되면 **프론트 혼자서는 시작조차 못 한다.** 반면 Spring Security + JWT 조합처럼
`{ accessToken, refreshToken }`을 body로 내려주는 서버는 프론트가 그대로 받아 쓰면 된다.
SI 현장에서는 이쪽이 오히려 더 자주 보인다. **더 흔한 경우를 지원하지 않는 스캐폴드는 쓸모가 없다.**

**왜 `access-only`를 따로 두는가** — refresh 없이 access 하나만 길게(예: 1일) 주는 서버가 여전히 많다.
`storage`에서 갱신만 빠진 형태라 코드를 거의 공유하지만, **401을 받았을 때의 행동이 정반대**다
(갱신 시도 vs 즉시 로그아웃). 이 차이를 불리언 하나로 감추면 SI가 원인을 못 찾는다.

**기본값을 `cookie`로 두는 이유** — 스캐폴드의 기본값은 곧 권장이다. 세 개를 동등하게 나열하면
SI는 마찰이 가장 적은 쪽(`storage`)을 무심코 고른다. 그러면 **보안 등급이 가장 낮은 구성이
기본이 되어버린다.** 기본값은 권장안에 두고, 내려가는 선택에는 근거를 남기게 한다.

> **`storage` · `access-only`를 고르면 개발 모드에서 콘솔에 한 줄 경고를 띄운다.**
> 막지는 않는다 — 서버가 그렇다면 어쩔 수 없다. 다만 **"이건 차선책이고 왜 그런지"**를
> 그 구성을 고른 사람이 한 번은 읽게 한다. 운영 빌드에서는 나오지 않는다.

> **`authConfig.tokenStorageKey`를 지우지 않는다.** `cookie` 전략에서는 쓰이지 않지만
> 나머지 둘에서 저장소 키로 되살아난다. 지웠다가 다시 만들면 `.env` 항목까지 되살려야 하고,
> 그 사이 SI들이 각자 하드코딩한다. **주석으로 "어느 전략에서 쓰이는 값인지"를 남긴다.**

### 이 셋으로도 안 되면

JWT가 아니라 세션 쿠키를 쓰는 서버, SSO 리다이렉트로 토큰을 받는 서버, 커스텀 헤더를 요구하는 서버라면
**설정으로 흡수하지 않는다.** `shared/auth`를 그 프로젝트에서 고쳐 쓰는 편이 낫다.
스캐폴드는 그 사실을 §8 가이드에 적어 SI가 헤매지 않게 한다 — **"여기까지가 설정이고
그 밖은 코드를 고치는 영역"이라는 경계를 알려주는 것도 스캐폴드의 일이다.**

---

## 4. 설계 결정

### 4.1 access는 가능하면 메모리에 둔다 (`cookie` 전략)

`localStorage`는 JS가 읽는다. XSS가 한 번 나면 토큰이 그대로 나간다. 메모리 변수도 완전히 안전하지는
않지만 새 탭·다음 방문에는 남지 않고, 공격자가 실행 중인 그 순간에만 닿는다. 어차피 15분이면 만료된다.

`token-store.ts`는 **이미 메모리가 기본**이다. `main.tsx`의 localStorage 복원 경로를 걷어내고,
저장소가 필요한 전략에서만 `setAccessTokenResolver()`로 그 경로를 켠다.

> **둘을 동시에 두면 안 된다.** localStorage에 남은 옛 토큰이 갱신 결과를 덮어쓴다.
> 전략이 저장 위치를 **단독으로** 결정한다.

### 4.2 refresh는 `httpOnly` 쿠키에 두는 것이 최선이다

`httpOnly`는 JS가 아예 못 읽는다. XSS로도 값을 꺼낼 수 없다. 대신 브라우저가 자동으로 실어 보내
CSRF가 문제가 되는데, `SameSite=Lax`가 다른 사이트에서 시작된 POST에 쿠키를 싣지 않는다.

프론트에는 **쿠키를 다루는 코드가 한 줄도 없다.** `withCredentials: true`만 켜져 있으면 된다.
[src/config/api.config.ts](../src/config/api.config.ts)에 **이미 켜져 있고 사유 주석까지 달려 있다.**

`storage` 전략에서 refresh를 `localStorage`에 두는 것은 **명백한 하향**이다. access는 15분이지만
refresh는 2주다 — XSS 한 번이 2주짜리 접근권이 된다. 그럼에도 지원하는 이유는 §3③에 적었다.
**차선책이라는 사실을 문서와 콘솔 경고가 계속 말해주게 한다.**

> ⚠️ 짝 문서 §8의 "`withCredentials`(api-client.ts:17)"는 위치가 틀렸다.
> `api-client.ts:17`은 `this.axiosInstance = this.createAxiosInstance(config)`이고,
> 이 값의 소유자는 core가 아니라 `src/config/api.config.ts`다. 이 스캐폴드의 설정 소유 규칙 그대로다.

### 4.3 인증 상태는 zustand 스토어에 둔다 (Context 아님)

`status: 'idle' | 'refreshing' | 'authenticated' | 'anonymous'` 와 `user`를 한 곳에서 본다.
로그인·로그아웃·부팅 갱신·응답 인터셉터가 **같은 상태**를 봐야 한다.

**Context가 아니라 스토어인 이유** — 응답 인터셉터는 React 컴포넌트가 아니다. 모듈 스코프 함수라
Context에 닿지 못한다. Context로 가면 "인터셉터가 쓸 수 있게 setter를 모듈 변수에 심어두는" 우회가
반드시 따라붙고, 그 우회가 스캐폴드 사용자가 이해해야 할 개념을 하나 늘린다.
zustand 스토어는 `useAuthStore()`로도 `useAuthStore.getState()`로도 읽혀 **우회가 필요 없다.**

이 레포에는 [`defineStore`](../src/core/store/defineStore.ts) 팩토리가 이미 있다. 새 도구를 들이지 않는다.

배치는 `src/shared/auth/auth.store.ts` — 특정 업무 도메인 것이 아니라 앱 전체가 공유하므로 `shared`가 맞다.

### 4.4 부팅 복구는 `main.tsx`에서, 스플래시 아래에서 한다

`createRoot()` **전에** 전략의 `loadOnBoot()`를 1회 호출하고 결과를 스토어에 넣은 다음 렌더한다.
전략에 따라 그 안에서 하는 일이 다르다.

| 전략 | `loadOnBoot()`이 하는 일 |
|---|---|
| `cookie` | `POST {endpoints.refresh}` 1회 (네트워크 왕복 있음) |
| `storage` | localStorage에서 복원. 없으면 refresh 시도 |
| `access-only` | localStorage에서 복원. 네트워크 호출 없음 |

**`AuthProvider` 컴포넌트로 만들지 않는 이유** — React StrictMode는 개발 중 effect를 두 번 실행한다.
refresh가 두 번 나가면 **회전하는 서버에서 두 번째가 재사용 감지에 걸려 계정 전체가 폐기된다.**
`useRef` 가드로 막을 수는 있지만, 그건 스캐폴드 사용자가 몰라도 되는 함정을 하나 남겨두는 것이다.
`main.tsx`는 모듈이 한 번 평가되므로 **함정 자체가 생기지 않는다.**

그리고 이 레포에는 [index.html](../index.html)에 `#app-splash`가 이미 있다. `createRoot().render()`가
`#root` 내용을 교체하므로, **렌더를 미루면 스플래시가 그대로 떠 있는다.** 로딩 화면을 새로 만들 필요가 없다.
"로그인 화면 깜빡임"과 "토큰 없이 API를 쏘는 자식 화면" 두 문제가 동시에 사라진다.

> **top-level await 대신 async IIFE를 쓴다.** `main.tsx`에서 최상위 `await`를 쓰면 빌드 타깃이
> 그것을 지원해야 한다. 이 스캐폴드는 WebView 배포를 염두에 두고 있으므로(index.html 스플래시 주석),
> `(async () => { … createRoot(…).render(…) })()` 로 감싸 타깃 의존을 없앤다.

> **복구가 실패해도 반드시 렌더한다.** 실패는 "비로그인"이지 "화면 없음"이 아니다.
> 여기서 렌더를 안 하면 스플래시에서 영원히 멈춘다.

### 4.5 401 재시도는 인터셉터 안에서 끝낸다

응답 인터셉터 `onRejected`의 순서다.

```
1. status !== 401                          → 그대로 reject
2. url이 login | refresh 엔드포인트         → 그대로 reject          ★
3. 이미 재시도한 요청(_retry)                → 그대로 reject
4. strategy.supportsRefresh === false       → 정리 → anonymous → reject
5. refresh() 호출 (single-flight)
     실패 → 토큰 정리 + 캐시 정리 + anonymous → reject
     성공 → _retry 표시 + 새 access 헤더 → 요청 재전송
```

**2번을 빠뜨리면 두 가지가 깨진다.**
- 로그인 401(비밀번호 틀림)이 갱신 시도로 바뀌어, 에러 메시지 대신 화면이 튄다
- refresh 자체의 401이 다시 refresh를 부른다 → 무한 루프

**4번이 전략과 만나는 유일한 지점이다.** 나머지 흐름은 전략을 모른다. 인터셉터는
"갱신할 수 있는가"만 묻고, 어떻게 갱신하는지(쿠키 자동 / body 첨부)는 전략이 안다.

**호출 측이 아니라 인터셉터에서 끝내는 이유** — [`callApi`](../src/core/api/api.ts)는 실패를 `ApiError`로
던진다. 재시도를 호출 측에 맡기면 **API를 부르는 모든 코드가 401 분기를 갖게 된다.**
스캐폴드가 제공해야 할 것은 "각자 처리하는 방법"이 아니라 "처리하지 않아도 되는 상태"다.

> ⚠️ 짝 문서 STEP 11의 "`request()`가 `{success:false}`로 바꿔 호출 측에 예외가 안 간다"는
> 이 레포에서는 절반만 맞다. `BaseAxiosClient.request()`까지는 그렇지만
> [`callApi`](../src/core/api/api.ts)가 그것을 `ApiError`로 다시 던진다. 결론(인터셉터에서 끝낸다)은
> 같지만 이유가 다르므로 그대로 옮겨 적지 않는다.

**재시도 수단** — 인터셉터 콜백 안에서는 core의 axios 인스턴스에 닿지 못한다(core 불가침).
`axios(error.config)`를 직접 부른다. `error.config`는 axios가 defaults를 병합한 뒤의 설정이고
`url`도 이미 절대 URL이라 그대로 쓸 수 있다. **다만 맨 `axios`는 인터셉터를 타지 않으므로
`Authorization` 헤더를 손으로 붙여야 한다.** (인터셉터를 안 타는 것은 오히려 이득이다 — 재시도가
또 401이어도 갱신 루프에 들어가지 않는다.) `withCredentials`가 병합되어 넘어오는지는 착수 시 실측하고,
아니면 명시적으로 붙인다.

### 4.6 갱신은 single-flight로 묶는다

화면 하나가 API 다섯 개를 동시에 쏘면 401이 다섯 개 온다. 각자 갱신하면 refresh 요청이 다섯 개 나가고,
**회전하는 서버에서는 넷이 재사용 감지에 걸려 계정 전체가 폐기된다.**

진행 중인 Promise를 모듈 변수에 담아두고 나머지는 그것을 `await` 한다.

```
let inflight = null;
function refresh() {
  if (!inflight) inflight = strategy.refresh().finally(() => { inflight = null; });
  return inflight;
}
```

부팅 복구(§4.4)도 같은 함수를 쓴다. 그러면 "부팅 갱신 중에 어떤 화면이 401을 받는" 경합도 한 번으로 합쳐진다.
**이 장치는 전략 바깥에 둔다.** 전략마다 다시 만들면 하나에서 빠뜨린다.

### 4.7 로그아웃은 쿼리 캐시까지 지운다

[TanStack Query](../src/core/query/query-client.ts)를 쓰므로 `getQueryClient().clear()`를 부르지 않으면
**다음 사용자 화면에 이전 사용자의 데이터가 그대로 보인다.** 캐시는 토큰과 수명이 같아야 한다.

로그아웃과 refresh 최종 실패, 두 경로 모두에서 지운다.

> **서버 호출이 실패해도 클라이언트는 로그아웃한다.** 서버가 죽었을 때 로그아웃 버튼이 안 먹으면
> 그 화면에서 나갈 방법이 없다.

### 4.8 전략은 스캐폴드가 완성해 내장한다 — 플러그인이 아니다

§3 서두에서 "전략 어댑터로 전부 개방하지 않는다"고 했다. 프리셋 3개를 두는 것은 그것과 다르다.

| | 거부한 것 | 하는 것 |
|---|---|---|
| 형태 | SI가 인터페이스를 배워 **직접 전략을 작성** | 스캐폴드가 완성해 내장, SI는 **이름만 고름** |
| SI가 하는 일 | 인터페이스 학습 + 구현 + 검증 | `strategy: 'storage'` 한 줄 |
| §1 합격 판정 | 깨진다 | 유지된다 |

전략은 **코드가 아니라 선택지**여야 한다. 인터페이스는 스캐폴드 내부 계약이고
`AuthStrategy` 타입을 export하지 않는다 — 내보내는 순간 "직접 만들어도 된다"는 신호가 된다.

내부 인터페이스는 다섯 개로 끝난다. **SI는 이걸 몰라도 된다.**

```
interface AuthStrategy {
  supportsRefresh: boolean
  loadOnBoot(): Promise<Session | null>   // 부팅 시 세션 복구
  persist(session): void                  // 로그인 · 갱신 성공 후 저장
  refresh(): Promise<Session>             // 갱신 요청 (쿠키 자동 / body 첨부)
  clear(): void                           // 로그아웃 정리
}
```

**분기가 이 다섯 곳뿐이라 전략이 늘어도 인터셉터·게이트·스토어·화면은 그대로다.**
`storage`와 `access-only`는 `supportsRefresh`와 `refresh()` 말고는 거의 같아 실질 구현은 두 벌이다.

> ⚠️ **비용은 코드가 아니라 검증이다.** §9 체크리스트를 **전략 수만큼** 돌려야 하고,
> §7의 목도 전략별로 응답이 달라진다. 그럼에도 감수하는 이유는, 스캐폴드는 다음 사람이 그대로
> 복사해 가는 물건이라 **한 번 잘 검증해 두는 비용이 매 SI가 매번 헤매는 비용보다 싸기 때문이다.**

---

## 5. 구성 요소

**실제 구현 결과다.** 계획에 없다가 추가된 것은 ★로 표시했다.

> ⚠️ **이 표는 리팩터링 전(파일 통합 전) 구성이다.** 최종 파일 구성은 **§12⑧** 을 본다.
> 여기 남겨두는 것은 "어떤 관심사가 필요했는가"를 되짚을 때 쓰기 때문이다 —
> 통합 후에도 역할은 그대로 있고 파일 경계만 바뀌었다.

| 파일 | 신규/수정 | 역할 | SI가 여는가 |
|---|---|---|---|
| `.env` | 수정 | `VITE_API_BASE_URL` → `/api` | **✅ 연다** |
| `src/config/auth.config.ts` | 수정 | `strategy` · 엔드포인트 · 응답 매핑 · 라우트 경로 | **✅ 연다** |
| ★ `src/types/auth.ts` | 신규 | `ILoginCredentials` · `IAuthUser` · `AuthConfig` · `IAuthSession` | **✅ 연다** |
| `src/shared/auth/auth.store.ts` | 신규 | `status` · `user` (zustand) | ❌ |
| `src/shared/auth/auth-api.ts` | 신규 | 엔드포인트 호출만. 상태를 바꾸지 않는다 | ❌ |
| ★ `src/shared/auth/auth-actions.ts` | 신규 | `login()` · `logout()` — 화면이 부르는 것 | ❌ |
| ★ `src/shared/auth/session.ts` | 신규 | `clearSession()` — 토큰·쿼리 캐시·상태를 같이 정리 | ❌ |
| ★ `src/shared/auth/refresh-session.ts` | 신규 | 갱신 single-flight (전략 바깥, §4.6) | ❌ |
| ★ `src/shared/auth/strategies/types.ts` | 신규 | `IAuthStrategy` 내부 계약 (export 하지 않는다) | ❌ |
| `src/shared/auth/strategies/index.ts` | 신규 | 설정의 `strategy` 이름 → 구현 선택 + 하향 경고 | ❌ |
| `src/shared/auth/strategies/cookie.ts` | 신규 | httpOnly 쿠키 전략 | ❌ |
| `src/shared/auth/strategies/storage.ts` | 신규 | localStorage 전략 (`access-only` 포함) | ❌ |
| `src/shared/auth/token-store.ts` | 수정 | access를 메모리에 보관. 읽기는 언제나 메모리 | ❌ |
| `src/shared/auth/setup-auth-interceptor.ts` | 수정 | Bearer 주입 · 401 → 갱신 → 재시도 | ❌ |
| `src/shared/auth/boot-auth.ts` | 신규 | 부팅 복구 1회 (`main.tsx`가 부른다) | ❌ |
| `src/shared/auth/tab-sync.ts` | 신규 | 탭 간 로그아웃 전파 (`storage` 이벤트) | ❌ |
| ★ `src/shared/auth/README.md` | 신규 | SI가 읽을 사용 문서 (§8이 여기로 갔다) | **✅ 읽는다** |
| `src/shared/components/router/ProtectedRoute.tsx` | 수정 | `status` 기반 게이트 | ❌ |
| ★ `src/shared/components/auth/AccountMenu.tsx` | 신규 | 사용자 표시 + 로그아웃 버튼 | **✅ 참고·복제** |
| `src/main.tsx` | 수정 | 부팅 배선 (목 기동 → `bootAuth()` → 렌더) | ❌ (§10에서만) |
| `src/domains/auth/**` | 신규 | 로그인 화면 | **✅ 그 자리에서 갈아끼운다** |
| `src/shared/router/index.tsx` | 수정 | auth 라우트 + ProtectedRoute 배선 | **✅ 연다** |
| ★ `src/mock-server/**` | 신규 | MSW 가짜 서버 (dev 전용) + 자체 README | ❌ (서버 생기면 삭제) |
| ★ `src/core/api/api-client.ts` | **수정** | URL 조립 결함 수정 — §6 참고 | ❌ |

> **★ 표시가 많은 이유** — 계획이 틀렸다기보다, 설계 문서가 "무엇을 만들지"를 적고
> 파일 경계까지는 못 정했기 때문이다. 실제로 갈라진 자리는 대부분 **순환 참조를 피하려다**
> 생겼다. `session.ts`가 그 예다 — `tab-sync`가 `clearSession`을 쓰고 `auth-actions`가
> `tab-sync`를 쓰므로, `clearSession`이 `auth-actions`에 남아 있으면 순환이 된다.
> 함수 선언이라 실제로는 돌아가지만, 스캐폴드에 순환을 남기면 다음 사람이 그걸 따라 한다.

---

## 6. 구현 순서

**서버 계약을 흉내낼 수 있는 상태를 먼저 만든다(S1).** 그래야 이후 단계를 매번 눈으로 확인하며 간다.
확인 수단 없이 S2~S13을 다 만들면 마지막에 한꺼번에 디버깅하게 된다.

```
S1  목(mock) 준비 + .env baseURL 전환      ← 여기서부터 눈으로 확인 가능
S2  auth.config 확장 (strategy 포함)
S3  auth.store 신설
S4  AuthStrategy 인터페이스 + cookie 전략
S5  token-store 정리 (전략이 위치를 결정)
S6  auth-api 신설
S7  부팅 복구 (boot-auth + main.tsx)
S8  ProtectedRoute → status 기반
S9  domains/auth 로그인 화면 + 라우터 배선
S10 401 → 갱신 → 재시도 (single-flight)     ← S8·S9 뒤
S11 로그아웃 (+ 쿼리 캐시 정리)
S12 storage · access-only 전략 추가          ← cookie 경로가 전부 통과한 뒤
S13 탭 간 동기화
S14 테스트 + README 가이드
```

### 실제로 진행한 순서 (2026-08-25)

```
S1 → S2 → S3 → [S6] → [S4] → S5 → S7 → S8 → S9 → ★core 수정 → S10 → S11 → S13 → S12 → S14
```

바뀐 곳이 셋이다.

**① `S6`(auth-api)를 `S4`(전략) 앞으로 옮겼다.**
전략의 `loadOnBoot()`·`refresh()`가 결국 `POST {endpoints.refresh}`를 부른다. 계획 순서대로 가면
S4에서 아직 없는 함수를 호출하는 코드를 쓰게 되고, **매 단계 `tsc`가 통과한 상태로 넘어간다**는
진행 방식이 깨진다. auth-api는 전략을 전혀 모르므로(refresh를 body에 실을지는 인자 하나로 갈린다)
먼저 만들 수 있고, 먼저 만드는 게 맞다.

**② `S13`(탭 동기화)을 `S12`(전략 추가) 앞으로 옮겼다.**
§6 서두의 "cookie 하나로 §9를 전부 통과시킨 뒤에 두 번째 전략을 넣는다"를 그대로 따르면,
탭 동기화도 cookie 경로에 속하므로 S12보다 먼저다. 그래야 S12에서 나는 실패가 반드시 전략 쪽이다.

**③ 계획에 없던 core 수정 1건이 S9와 S10 사이에 끼었다.** ★

[api-client.ts](../src/core/api/api-client.ts)의 `makeRequestConfig`가 `new URL(endpoint, base)`로
주소를 만들고 있었다. `endpoint`가 `/`로 시작하면 **절대 경로로 해석되어 base의 경로가 통째로 버려진다.**

```
new URL('/auth/login', 'http://host/api')   →   'http://host/auth/login'    // /api 가 사라진다
```

즉 §8이 SI에게 권하는 구성(`VITE_API_BASE_URL=/api`)이 **404로만 조용히 깨지고 있었다.**
착수 전에는 baseURL이 `https://jsonplaceholder.typicode.com`(경로 없음)이라 드러나지 않았다.
axios 자신은 baseURL을 문자열로 이어 붙이는데 core만 다르게 동작하던 것이라, axios 쪽에 맞췄다.

> **"core 불가침"과 충돌하지 않는다.** 그 규칙은 *SI 프로젝트가* core를 안 건드린다는 뜻이고,
> 스캐폴드를 만드는 시점에는 우리가 core의 소유자다. 그리고 이건 취향이 아니라 결함이라,
> 놔두면 이 스캐폴드를 받아가는 SI 전원이 같은 지뢰를 밟는다.

> **S10을 S8·S9 뒤로 미루는 이유** — 게이트와 로그인 화면이 먼저 돌아야
> "갱신에 실패하면 어디로 가는가"의 **도착지**가 생긴다. 도착지 없이 재시도를 만들면 실패 경로를 확인할 수 없다.

> **S12를 뒤로 미루는 이유** — 전략을 두 개 동시에 만들면 버그가 났을 때
> "전략이 잘못됐나, 공통 배선이 잘못됐나"를 가릴 수 없다. **`cookie` 하나로 §9를 전부 통과시킨 뒤에**
> 두 번째 전략을 넣는다. 그러면 그 시점의 실패는 반드시 전략 쪽이다.

### 각 단계 메모

**S1** — `.env`의 `VITE_API_BASE_URL`이 지금 `https://jsonplaceholder.typicode.com`이다. 크로스 오리진이라
쿠키가 붙지 않는다. [vite.config.ts](../vite.config.ts)에 `/api` → `VITE_SERVER_URL` 프록시가 **이미 있으므로**
`/api`로 바꾸면 동일 출처가 되어 §2의 CORS 조건을 dev에서 우회한다. 목 구성은 §7.

**S5** — `main.tsx`의 `localStorage.getItem(...)` 복원을 걷어낸다. 저장소 접근은 전략만 한다.
`setAccessTokenResolver()`는 남겨두되 **전략이 호출하는 것**으로 소유자를 옮긴다.

**S9** — [CLAUDE.md](../CLAUDE.md) 규칙을 따른다. 페이지는 `domains/auth/pages/`, 보조 컴포넌트는
`domains/auth/components/`에 별도 파일로. 페이지 안에 인라인 정의하지 않는다.
라우터는 `createHashRouter`이므로 앵커 이동에 `<a href="#…">`를 쓰지 않는다.

**S13** — 탭 동기화는 전략에 따라 성격이 다르다. `storage` 계열은 토큰이 localStorage에 있어
`storage` 이벤트가 자연히 발생하지만, **로그아웃 전파는 여전히 명시적으로 해야 한다**
(다른 탭의 메모리 상태와 쿼리 캐시는 자동으로 안 지워진다). 전략과 무관하게 같은 신호를 쓴다.

**S14** — [vite.config.ts](../vite.config.ts)에 vitest `unit`(jsdom) / `browser`(chromium) 두 프로젝트가
파일명 규칙으로 갈려 있다. single-flight와 401 재시도는 **jsdom 유닛 테스트로 박아둔다.**
스캐폴드는 다음 사람이 복사해 가는 물건이라, 이 두 개가 조용히 깨지면 알아챌 방법이 없다.
**전략 선택 분기도 테스트 대상이다** — 설정값 하나로 저장 위치가 바뀌는 구조라 회귀가 눈에 안 띈다.

---

## 7. 서버 없이 확인하는 수단

이 레포에는 서버가 없다. 그러면 **스캐폴드가 실제로 동작하는지 우리도 확인할 수 없고**,
SI도 서버를 붙이기 전까지 아무것도 돌려볼 수 없다.

**결정: MSW(Mock Service Worker)로 목 서버를 넣는다. dev 빌드와 example 도메인 한정.**

| 준다 | login · refresh · logout · me 네 개 핸들러. **회전까지 흉내낸다** |
|---|---|
| 범위 | `import.meta.env.DEV`에서만 기동. 운영 번들에 들어가지 않는다 |
| 전략 | 목이 **쿠키 응답과 body 응답을 모두 낸다.** 설정의 `strategy`를 바꾸면 그대로 확인된다 |
| 비용 | devDependency 1개 추가 (`msw`) |

**MSW를 고른 이유** — 네트워크 계층에서 가로채므로 `Set-Cookie`를 포함한 **응답 전체를 흉내낼 수 있다.**
그래서 "15분 뒤 401 → 자동 갱신 → 재시도"와 "동시 401 다섯 개 → refresh 한 번"을 **개발자도구에서 눈으로 볼 수 있다.**
스캐폴드에서 이건 편의가 아니라 **동작 증명**이다. 문서로 "됩니다"라고 쓰는 것과 다르다.
전략이 셋으로 늘면서 이 이유는 더 강해졌다 — **전략마다 §9를 돌려야 하는데 목이 없으면 그걸 할 방법이 없다.**

**고르지 않은 대안**
- *axios 인터셉터 레벨 간이 목* — 추가 패키지가 없어 폐쇄망에 유리하지만, `httpOnly` 쿠키를 흉내낼 수 없다.
  `cookie` 전략이 반쪽만 검증된다. (`storage` 전략만 쓸 프로젝트라면 이걸로 충분하다)
- *목 없이 계약 문서 + 예제 화면만* — 가장 빠르지만, 스캐폴드가 실제로 도는지 아무도 모른 채 배포된다.

> ⚠️ **의존성 추가는 이 플랜에서 유일하다.** 폐쇄망 반입 절차 때문에 곤란하면 S1에서 간이 목으로 내리고
> §9 체크리스트 중 쿠키 관련 항목을 "실서버에서만 확인"으로 표시한다. 이 결정만 뒤집으면 되고 나머지 설계는 그대로다.

### 실측 결과 — "응답 전체를 흉내낼 수 있다"는 절반만 맞다

MSW를 붙여 확인해보니 `Set-Cookie`가 **브라우저의 쿠키 저장소로 가지 않는다.**
Service Worker가 지어낸 응답이라, MSW가 자체 저장소(`localStorage`의 `__msw-cookie-store__`)로
따로 관리한다. 그래서 개발자도구 → Application → Cookies에는 `refresh_token`이 보이지 않는다.

| | 목으로 확인되는가 |
|---|---|
| 로그인 → 갱신 → **회전** → 로그아웃 흐름 | ✅ |
| **재사용 감지** (폐기된 refresh 재사용 → 사슬 전체 폐기) | ✅ |
| 401 → 자동 갱신 → 재시도, single-flight | ✅ |
| body 없이 쿠키만으로 갱신되는가 | ✅ (MSW 저장소를 통해) |
| §9 **4번** — `HttpOnly` · `Path` 속성 확인 | ❌ **실서버 전용** |

**흐름 검증은 전부 성립한다.** 앱 입장에서는 "쿠키가 자동으로 실려 간다"가 그대로 재현되므로,
§4.4 부팅 갱신·§4.5 401 재시도·§4.6 single-flight가 모두 목으로 확인됐다.
못 보는 것은 쿠키의 **속성**뿐이다.

> 이 성질 때문에 목의 `refresh`·`logout` 핸들러는 **쿠키와 body를 둘 다 받게** 만들었다.
> 그리고 body를 먼저 본다 — httpOnly 쿠키는 JS로 바꿔치기할 수 없어서,
> **"옛 refresh를 일부러 보내는" 재사용 감지 확인이 body 경로가 아니면 불가능하기 때문이다.**
> 실동작에는 영향이 없다(cookie 전략은 body를 보내지 않는다). 순전히 검증 가능성 때문이다.

---

## 8. SI 붙이는 절차 (README에 들어갈 초안)

> **이 초안은 [src/shared/auth/README.md](../src/shared/auth/README.md)로 옮겨 완성했다.**
> 아래는 착수 시점의 초안이며, 구현 결과와 다른 곳이 두 군데 있다(3번 추가, 4번 문구).
> **SI에게 전달할 최신본은 저 README다.** 여기 남겨두는 것은 §6의 "끝난 항목을 지우지 않는다" 규칙 때문이다.

문서가 아니라 **제품의 일부**다. 이 단계를 넘어가면 §1의 합격 판정을 못 넘긴 것이다.

```
1. .env
     VITE_API_BASE_URL=/api          (운영 배포 시 실제 주소)
     VITE_SERVER_URL=http://…        (dev 프록시 대상)

2. src/config/auth.config.ts
     strategy            서버에 맞춰 셋 중 하나 (아래 고르는 법)
     endpoints           서버 경로 네 개
     extractAccessToken  응답에서 토큰 꺼내는 함수
     extractUser         응답에서 사용자 꺼내는 함수
     loginPath           로그인 라우트 경로 (API 경로가 아니다)

3. src/types/auth.ts                              ← 구현 중 추가 (§1)
     ILoginCredentials   로그인 요청에 실을 필드 (개수도 이름도 서버마다 다르다)
     IAuthUser           서버가 주는 사용자 모양

4. 로그인 화면
     src/domains/auth/components/LoginForm.tsx 의 마크업만 바꾼다.
     ★ "복제해서 다른 데 만든다"가 아니라 "그 자리에서 갈아끼운다".
       authConfig.loginPath 가 이 경로를 가리키고 있다.
     인증 처리는 login({ loginId, password }) 한 줄이 전부다.

5. 라우터
     src/shared/router/index.tsx 에서 보호할 라우트를 ProtectedRoute 아래로 옮긴다.
     ⚠️ 인증 라우트(/auth)는 반드시 게이트 바깥. 안에 넣으면 무한 리다이렉트다.

6. 확인
     §9 체크리스트를 순서대로 돌린다.
```

### `strategy` 고르는 법 — 서버 담당에게 이것만 물어본다

```
Q. 로그인하면 refresh token을 어떻게 주시나요?

  "Set-Cookie 로 내려줍니다 (httpOnly)"        →  'cookie'      ← 권장. 이걸로 되면 이걸로 한다
  "응답 body 에 refreshToken 으로 넣어드립니다" →  'storage'
  "refresh 는 없고 access 만 있습니다"          →  'access-only'
```

`cookie`가 가능한지부터 묻는다. **가능한데 안 쓰는 것과, 불가능해서 못 쓰는 것은 다르다.**

`shared/auth` 안쪽을 열어야 할 상황이 되면 **§3의 경계를 넘은 것**이다. 그 경우의 판단 기준도 §3에 있다.

---

## 9. 자가진단 체크리스트

SI가 자기 서버를 붙인 뒤 순서대로 돌린다. 서버 쪽 curl 검증은 짝 문서에 있고 여기서는 다루지 않는다.
**우리는 이 표를 전략 세 개에 대해 각각 통과시킨 뒤에 스캐폴드를 배포한다.**

| # | 조작 | `cookie` | `storage` | `access-only` |
|---|---|---|---|---|
| 1 | 토큰 없이 보호 라우트 진입 | 로그인 화면 | 〃 | 〃 |
| 2 | 로그인 후 F5 | 유지 · 깜빡임 없음 · refresh **1회** | 유지 · 네트워크 호출 없음 | 유지 · 네트워크 호출 없음 |
| 3 | 개발자도구 → Local Storage | **비어 있다** | access·refresh 있음 | access 있음 |
| 4 | Cookies → refresh 쿠키 | `HttpOnly` ✓ · `Path` 좁혀짐 ✓ **(실서버 전용)** | 없음 | 없음 |
| 5 | 일반 API 요청 헤더 | Bearer ✓ · refresh 쿠키 안 실림 | Bearer ✓ | Bearer ✓ |
| 6 | access 만료 후 화면 조작 | 자동 갱신 후 성공 | 자동 갱신 후 성공 | **로그인 화면** |
| 7 | 한 화면에서 API 5개 동시 401 | refresh **1개만** | refresh **1개만** | 해당 없음 |
| 8 | 비밀번호를 틀리게 입력 | **에러 메시지.** 리다이렉트 금지 | 〃 | 〃 |
| 9 | 로그아웃 후 뒤로가기 | 로그인 화면 · 이전 데이터 안 보임 | 〃 · **저장소도 비었는지 확인** | 〃 |
| 10 | 보호 라우트 직접 진입 → 로그인 | 원래 경로로 복귀 | 〃 | 〃 |
| 11 | 탭 둘 열고 한쪽에서 로그아웃 | 다른 탭도 로그인 화면 | 〃 | 〃 |
| 12 | 개발 모드 첫 진입 (StrictMode) | refresh **1회만** | 해당 없음 | 해당 없음 |
| 13 | 개발 콘솔 | 경고 없음 | **하향 경고 1회** | **하향 경고 1회** |

**통과 현황 (2026-08-25, 목 기준)** — 세 전략 모두 **4번을 제외하고 전부 통과.**

- **4번은 목으로 확인할 수 없다** (§7 실측 결과). 실서버가 생기면 이 항목만 다시 본다.
- **10번은 SPA 내부 이동에서만 보존된다.** 복귀 경로를 `Navigate`의 `state`에 담는데
  이건 history 메모리라, **로그인 화면에서 F5를 누르면 사라지고 홈으로 간다.**
  문제가 되는 프로젝트는 `ProtectedRoute`·`LoginIndex`에서 `?redirect=` 쿼리로 바꾼다.
  (§11의 미결 항목이었고, 이것이 실측 결과다)
- **12번(StrictMode)은 현재 자동 통과다.** 이 레포는 `StrictMode`를 쓰지 않는다.
  다만 §4.4의 판단은 유지한다 — 스캐폴드를 받아간 사람이 켤 수 있고,
  `main.tsx`에 두면 켜도 안전하다.

---

## 10. 인증을 쓰지 않는 프로젝트에서 끄는 법

모든 SI가 로그인을 쓰지는 않는다. **끄는 법이 문서에 없으면 각자 코드를 뜯어낸다.**

```
main.tsx 에서 세 줄을 주석 처리한다.        ← S13에서 한 줄 늘었다
  setupAuthInterceptor();
  setupTabSync();
  await bootAuth();

라우터에서 ProtectedRoute를 걷어낸다.
```

`shared/auth`와 `domains/auth`는 **지우지 않아도 된다.** 참조되지 않으면 번들에 들어가지 않는다.
나중에 인증이 필요해지면 두 줄을 되살린다.

---

## 11. 미결 사항

### 닫힌 것 (2026-08-25 구현으로 결정됨)

- [x] **MSW 도입** (§7) — 도입했다. 다만 `Set-Cookie`가 브라우저 쿠키 저장소로 가지 않아
      §9의 4번만 실서버 전용으로 남는다. 나머지 흐름은 전부 목으로 검증된다
- [x] **`storage` 전략의 refresh 저장 위치** — **`localStorage` 고정.**
      `sessionStorage`는 탭을 닫으면 사라져 더 안전하지만 **탭마다 별개**라, 새 탭에서 로그인이
      유지되지 않고 S13의 탭 동기화와도 어긋난다. 선택지로 열면 SI가 그 차이를 다 이해해야 한다
- [x] **하향 경고의 위치** — dev 콘솔에만 둔다. 세션당 1회, 운영 빌드에서는 나오지 않는다.
      README 배지는 넣지 않았다 — 경고를 봐야 할 사람은 그 설정을 고르는 순간의 개발자다
- [x] **`extractUser`가 없는 서버** — `me` 호출로 대체하지 않는다.
      대신 `setAuthenticated`가 **값이 있을 때만 덮어쓴다.** 갱신 응답에 user가 없어도
      화면에 떠 있던 이름이 갑자기 사라지지 않는다. 부팅에 네트워크 왕복을 늘리지 않는 쪽을 택했다
- [x] **로그인 복귀 경로(`state.from`)** — SPA 내부 이동에서는 보존된다.
      **로그인 화면에서 F5를 누르면 사라진다**(history state라서). §9의 주석에 적었고,
      문제가 되는 프로젝트는 `?redirect=` 쿼리로 바꾸면 된다
- [x] **탭 동기화 수단** — **`storage` 이벤트.** `BroadcastChannel`이 API는 깔끔하지만
      이 스캐폴드는 WebView 배포를 염두에 두고 있어(index.html 스플래시 주석) 지원이 갈린다.
      토큰이 아니라 **신호만** 쓰고, 이벤트가 다른 탭에서만 발생한다는 성질만 빌린다
- [x] **`domains/auth`의 위치** — **기본 포함.** dev 전용으로 빼면 운영 번들에
      `loginPath`의 도착지가 없어져 게이트가 갈 곳을 잃는다. 성격은 "복제할 예제"가 아니라
      **"그 자리에서 갈아끼우는 자리"**다. 경로와 `authConfig.loginPath`가 계약이고 내용은 SI 것이다
- [x] **`setAccessTokenResolver`** — 제거했다. 근거는 §1
- [x] **자격 증명·사용자 타입의 소유자** — SI 소유(`src/domains/auth/types.ts`)로 옮겼다. §12①
- [x] **화면 로직의 재사용 형태** — 훅(`useLogin` · `useLogout` · `useAuth`)으로 뽑았다. §12②
- [x] **로그아웃·만료 후 이동 정책** — `authConfig.onSessionEnd(reason)` 로 넘겼다. §12③
- [x] **확장 지점** — `resolveRoles` · `onLoginSuccess` · `onSessionEnd` 셋을 열었다. §12④
- [x] **권한(role) 기반 라우트 가드** — `<ProtectedRoute roles={['admin']} />` 와 `useAuth().hasRole()`. §12⑤

### 열려 있는 것

- [ ] **탭 간 동시 갱신** — §4.6의 single-flight는 **탭 단위**(모듈 스코프 변수)다.
      탭 둘이 동시에 401을 받으면 refresh가 둘 나가고, 회전 서버에서 계정이 폐기된다.
      **서버 유예(§2-4)가 정답**이라고 보지만, 그게 안 되는 서버라면 `navigator.locks`로
      탭 간 잠금을 검토한다(구형 WebView 지원 확인 필요). 리더 탭 선출은 구현 부담이 크다
- [ ] **유닛 테스트 미작성 (S14)** — 의도적으로 건너뛴 상태다. 대상 셋:
      `refresh-session`(동시 호출이 전략 `refresh()`를 1회만 부르는지),
      `setup-auth-interceptor`(401 분기 5단계 — 특히 login/refresh URL 제외와 `_retry`),
      `strategies`(설정 한 줄로 저장 위치가 실제로 바뀌는지).
      **셋 다 조용히 깨지는 종류**라, 깨져도 화면에서는 한동안 티가 안 난다
- [ ] **재시도 요청에 쿠키가 실리는지 실측** — §4.5의 재시도는 맨 `axios`를 쓴다.
      `error.config`에 `withCredentials`가 병합돼 오는 것으로 보이나, MSW가 쿠키를 자체 저장소로
      다뤄 목에서는 판별되지 않는다. 실서버에서 확인하고, 안 실리면 한 줄 명시한다
- [ ] **목의 `/api/posts` 핸들러는 인증을 확인하지 않는다** — example 화면 편의를 위한 것이다.
      인증 검증에는 영향이 없지만, 목을 "보호된 API"의 예로 읽으면 오해가 된다

---

## 12. 구현 후 리팩터링 — 스캐폴드 컨셉 기준 재점검

> 2026-08-25. S1~S14를 끝낸 뒤 **"이게 정말 어느 프로젝트에나 쉽게 붙는 물건인가"**를 기준으로
> 다시 읽고 고쳤다. 로직 계층은 컨셉에 맞았고, **화면·타입·라우팅 계층이 어긋나 있었다.**

문제는 하나로 요약됐다 — **"SI가 고칠 것"과 "스캐폴드가 소유한 것"의 경계가 파일 단위로 안 갈렸고,
일부는 의존 방향이 거꾸로였다.** 스캐폴드는 한 번 주고 끝나는 물건이 아니라 새 버전을 다시 반입할
수 있어야 하는데, 두 소유자의 코드가 한 파일에 섞이면 그 순간 충돌 지점이 된다.

### ① 스캐폴드가 SI 소유 타입에 의존하고 있었다

`auth-api.ts` · `auth-actions.ts`가 `ILoginCredentials`를 직접 import 했고, 그 타입은
`src/types/auth.ts`에서 `AuthConfig`(스캐폴드 소유)와 **한 파일에 섞여** 있었다.
SI가 필드를 바꾸면 스캐폴드 함수의 시그니처가 따라 바뀌는 구조다.

```
바뀐 것
  src/types/auth.ts          스캐폴드 소유만 남긴다. user 는 TAuthUser(=불투명)로 열었다
  src/domains/auth/types.ts  신규. ILoginCredentials · IAppUser — SI 소유
  login(credentials: object) 스캐폴드는 로그인에 무엇이 필요한지 모른다.
                             받은 객체를 그대로 body 로 보낸다
```

**사용자 객체도 불투명하게 만들었다.** 스캐폴드가 `user`의 필드를 읽는 곳은 예제 한 군데뿐이었는데
`id/loginId/name/role`을 강제하고 있었다. 실제 서버는 `empNo`·`userNm`·`deptCd`를 준다.
이제 스토어는 그냥 담아두고, 화면이 `useAuth<IAppUser>()`로 자기 타입을 붙인다.

### ② 재사용할 로직이 버릴 마크업과 한 파일에 있었다

`LoginForm.tsx`는 100줄 중 60줄이 Tailwind 마크업인데, 값어치 있는 것은 pending 관리 ·
`ApiError`에서 메시지 꺼내기 · 성공 처리 셋이었다. **로그인 화면은 프로젝트마다 완전히 다르므로
SI는 마크업을 통째로 새로 쓰고, 그러면 저 셋도 같이 버려진다.**

"복제해서 디자인만 바꾼다"는 안내가 현실과 맞지 않았다. 폼 구조가 다르면 복제가 아니라 재작성이다.

```
신규  src/shared/auth/hooks/useLogin.ts    { submit, pending, error, reset }
      src/shared/auth/hooks/useLogout.ts   { logout, pending }
      src/shared/auth/hooks/useAuth.ts     { status, user, isAuthenticated, hasRole }
```

마크업은 이제 100% 프로젝트 것이다. `shared/auth`에서 React에 의존하는 것은 `hooks/` 뿐이고,
나머지는 화면 없이 도는 순수 로직으로 남겼다.

### ③ 라우팅 정책이 로직 안에 박혀 있었다

`logout()`과 `tab-sync`가 `window.$router?.replace(loginPath)`를 직접 불렀다. 둘 다 문제다 —
전역 객체에 의존하면 폴더 단위 이식과 테스트가 막히고, **세션이 끝났을 때 어디로 보낼지는
프로젝트 정책**이다(로그인 화면 / 랜딩 / SSO 로그아웃 URL / 만료 안내).

```
clearSession(reason)  로컬 정리만 하고 authConfig.onSessionEnd(reason) 를 부른다
reason                'logout' | 'expired' | 'other-tab'
```

기본 동작(로그인 화면으로 replace)은 **`auth.config.ts`(SI 소유)에 뒀다.** 그래서 기본은 제공되지만
바꾸는 자리도 SI 것이다. `shared/auth`는 이제 라우터를 모른다.

### ④ 확장 지점이 하나도 없었다

SI 공통 개발자가 실제로 부딪히는 요구 넷이 전부 `shared/auth` 수정을 요구했다 —
로그인 후 후속 작업, 세션 만료 안내, 권한 가드, 동적 헤더. **§1의 합격 판정이 여기서 깨졌고,**
고쳐 놓으면 스캐폴드 새 버전을 반입할 때 그 수정이 날아간다.

```ts
// auth.config.ts 에 추가된 확장 지점
resolveRoles?:    (user) => string[]            // 권한 가드가 권한을 꺼내는 방법
onLoginSuccess?:  (session) => void | Promise   // 메뉴 조회 · 프리페치 등
onSessionEnd?:    (reason) => void              // 이동 · 안내
```

동적 헤더는 새 지점을 만들지 않았다. `@/core/api`가 이미 `registerRequestInterceptor`를
내보내므로 `main.tsx`에서 하나 더 등록하면 된다.

### ⑤ 권한 가드는 "언젠가"가 아니었다

§11에 미결로 미뤄뒀는데, **거의 모든 SI에 있다.** `ProtectedRoute`에 `roles` prop을 넣었다.

```tsx
<ProtectedRoute roles={['admin']} forbiddenPath="/" />
```

권한 부족을 로그인 화면으로 보내지 않는다. "다시 로그인하면 되나?"로 읽혀 같은 자리를 맴돈다.
`resolveRoles`가 없는데 `roles`를 지정하면 **막는 쪽으로** 동작한다(콘솔에 사유가 찍힌다) —
가드가 조용히 열려 있는 것보다 낫다.

### ⑥⑦ 정리 두 가지

- **목이 앱 코드를 import 하고 있었다.** `mock-server/browser.ts`가 `callApi`를 가져다
  콘솔 프로브를 만들었는데, 가짜 서버가 앱을 부르는 건 방향이 거꾸로고 목을 지울 때 걸린다.
  프로브를 `shared/auth/dev-probe.ts`(dev 전용, `window.__auth`)로 옮겼다.
- **예제가 공통 컴포넌트 자리에 있었다.** `shared/components/auth/AccountMenu.tsx`는 이름과
  위치가 "공통"인데 내용은 색이 하드코딩된 예제였다. `domains/auth/components/UserMenu.tsx`로
  옮겼다(example 도메인에 같은 이름이 이미 있어 헷갈리지 않게 이름도 바꿨다).

### 배럴도 좁혔다

`setAccessToken` · `clearAccessToken`을 공개 목록에서 뺐다. **토큰의 보관 위치는 전략이 단독으로
결정한다**(§4.8)는 원칙과 어긋나는 신호였다. 밖에서 직접 쓰면 저장소에 옛 값이 남는다.

### ⑧ 파일 통합 — 27개 → 14개

리팩터링 직후 인증 관련 파일이 **27개**였고, `shared/auth` 만 17개였다. 그중 **9개가 45줄 미만.**

파일 경계가 **"읽는 사람"이 아니라 "만드는 순서와 순환 참조 회피"로 정해져 있었다.**
S1~S14를 한 단계씩 진행하며 단계마다 파일을 하나씩 만들었고, `session.ts` 는 순환을 끊으려고
`auth-actions.ts` 에서 잘라낸 것이라 읽는 사람에게 의미 있는 경계가 아니었다.

공통 개발자가 `shared/auth` 를 열면 17개를 보고 **어디부터 읽어야 할지 모른다.**
파일이 작은 게 단순한 게 아니라 **찾을 것이 적은 게 단순하다.**

```
합침
  auth-flow.ts        ← boot-auth + auth-actions + refresh-session + session + tab-sync
                        전부 "세션 생애주기" 한 주제다. 위→아래로 읽으면 흐름이 다 보이고,
                        순환 참조도 같이 사라졌다 (226줄)
  auth-strategies.ts  ← strategies/ 4개 + token-store
                        전략 셋을 나란히 놓아야 차이가 보인다. 토큰 보관은 전략이 관리하는
                        저장소라 같은 파일이 맞다. 거의 안 여는 파일이라 길어도 부담이 없다 (296줄)
  auth-hooks.ts       ← hooks/ 4개 (182줄)
  LoginIndex.tsx      ← LoginForm 흡수. 로그인 화면은 **파일 하나를 통째로 갈아끼운다**

옮김
  ProtectedRoute.tsx  shared/components/router/ → shared/auth/
                      그 폴더에 이 파일 하나뿐이었다. 옮기니 "인증은 이 폴더 하나"가 성립한다

이름 통일
  setup-auth-interceptor.ts → auth-interceptor.ts
```

**안 합친 것과 이유**

| 파일 | 왜 남겼나 |
|---|---|
| `auth-api.ts` | 서버 계약이 특이할 때 여는 파일이다. 흐름과 섞으면 그때 읽을 게 두 배가 된다 |
| `auth.store.ts` | 59줄. "상태가 어떻게 생겼나" 볼 때 여는 파일이다 |
| `auth-interceptor.ts` | 401 분기 5단계가 이 파일의 전부다. **버그 나면 여기만 본다** |
| `dev-probe.ts` | 별도 모듈이어야 운영 번들에서 빠진다 |
| `index.ts` | 재export만. 공개 API 목록이 한눈에 보이는 것 자체가 값어치다 |
| `src/types/auth.ts` | `AuthConfig` 는 설정 객체의 타입이고, 이 레포는 `api.config.ts` ↔ `types/api.ts` 로 같은 관계를 이미 쓴다. 인증만 규칙을 달리하면 그게 또 헷갈린다 |

**읽는 순서가 생겼다** — `README.md` → `auth.config.ts`(설정) → `auth-flow.ts`(무슨 일이 언제 일어나는가).
그 셋이면 전체가 잡히고 나머지는 필요할 때만 연다.

### 결과

```
스캐폴드 소유 (새 버전으로 덮어써도 안전) — 전부 한 폴더
  src/shared/auth/       index · auth-flow · auth-api · auth-strategies ·
                         auth-interceptor · auth-hooks · auth.store ·
                         ProtectedRoute · dev-probe · README
  src/types/auth.ts      설정 객체의 타입

이 프로젝트 소유 (스캐폴드가 안 건드린다)
  .env  ·  src/config/auth.config.ts  ·  src/domains/auth/types.ts  ·  src/shared/router/index.tsx

예제 (바꾸거나 지운다)
  src/domains/auth/pages · components  ·  src/mock-server/**
```

```
인증 관련 파일   27개 → 14개
shared/auth      17개 → 9개
```

`npx tsc -b --force` · `npm run build` · 변경 파일 lint 통과. 운영 번들에 `msw` · `mock-server` ·
dev 프로브가 들어가지 않는 것도 `dist` 에서 확인했다.


---

## 작성 규칙

- 결정은 이유와 함께 적는다. 무엇을 했는지는 git log가 안다. 여기 적을 것은 *왜*다.
- 끝난 항목을 지우지 않는다 — 순서를 되짚을 때 쓴다.
- 날짜는 절대 표기(`2026-08-25`)로 쓴다.
- **독자는 이 스캐폴드를 처음 여는 사람이다.** 우리 사정을 아는 사람을 전제하고 쓰지 않는다.
