# JWT 인증 — 표준 방식 구현 계획

> 작성: 2026-08-21
> 통상적인 JWT 인증 구조(**단명 access + 회전 refresh**)를 정의하고, 그 구조에 맞춰
> 이 프로젝트를 고치는 단계별 계획. 현재 코드가 무엇을 하고 있는지는 §8에서만 다룬다.

---

## 1. 목표 구조

### 두 개의 토큰

| | access token | refresh token |
|---|---|---|
| 형태 | **JWT** (HS256) | **불투명 난수** (JWT 아님) |
| 수명 | **15분** | **14일** |
| 보관 위치 | 클라이언트 **메모리** (JS 변수) | **`httpOnly` 쿠키** |
| 전달 | `Authorization: Bearer <token>` | 쿠키 자동 전송 |
| 쓰는 곳 | 모든 API 요청 | `/api/auth/refresh` · `/api/auth/logout` **만** |
| 서버 검증 | 서명만 확인 (DB 조회 없음) | **DB 조회** (`refresh_tokens`) |
| 취소 | 불가 — 만료를 기다린다 | 가능 — 행 하나를 폐기하면 끝 |

> **refresh를 JWT로 만들지 않는다.** JWT의 값어치는 "DB를 안 봐도 검증된다"인데,
> refresh는 폐기 여부를 확인해야 하므로 어차피 DB를 본다. 그러면 JWT일 이유가 없고,
> 난수 32바이트가 더 짧고 더 안전하다(payload가 없으니 새어도 알 수 있는 게 없다).

> **refresh는 원문을 저장하지 않는다.** DB에는 SHA-256 해시만 넣는다.
> 비밀번호와 같은 취급이다 — DB가 통째로 새도 그것만으로는 로그인할 수 없어야 한다.

### 다섯 가지 흐름

```
① 로그인
   화면 ──POST /api/auth/login {loginId, password}──► 서버
        ◄── 200 { accessToken, user }                       (access는 body)
        ◄── Set-Cookie: refresh_token=…; HttpOnly; SameSite=Lax; Path=/api/auth
   화면: accessToken을 메모리에 둔다. localStorage에 아무것도 안 쓴다.

② 일반 요청
   화면 ──GET /api/checkins  Authorization: Bearer <access>──► 서버
        ◄── 200                                     (쿠키는 Path 때문에 안 실린다)

③ 갱신 (access 만료 · 401)
   화면 ──POST /api/auth/refresh  (쿠키 자동 전송)──► 서버
        ◄── 200 { accessToken, user }
        ◄── Set-Cookie: refresh_token=<새 값>       ★ 회전 — 옛 refresh는 즉시 폐기
   화면: 새 access를 메모리에 넣고 **실패했던 요청을 다시 보낸다.**

④ 부팅 · 새로고침
   메모리는 비어 있다. 쿠키는 살아 있다.
   화면 ──POST /api/auth/refresh──► 서버
        성공 → access 확보, 화면 진입
        실패 → 로그인 화면

⑤ 로그아웃
   화면 ──POST /api/auth/logout  (쿠키 자동 전송)──► 서버
        서버: 그 refresh 행을 폐기 + 쿠키 삭제 지시
        ◄── 204 + Set-Cookie: refresh_token=; Max-Age=0
   화면: 메모리 access를 비우고 로그인 화면으로.
```

### 회전과 재사용 감지

갱신할 때마다 refresh를 새 값으로 **바꾸고 옛 값을 폐기**한다(rotation).
그리고 **이미 폐기된 refresh가 다시 들어오면 그 계정의 refresh를 전부 폐기**한다(reuse detection).

```
정상:   R1 ──갱신──► R2 ──갱신──► R3
탈취:   R1 ──갱신──► R2                     (탈취자가 먼저 씀)
        R1 ──갱신──► ✗ 이미 폐기된 R1이 왔다
                     → 이 계정의 R1·R2·R3 전부 폐기 → 양쪽 다 재로그인
```

회전만 하고 감지를 안 하면 "진짜 사용자가 그냥 실패한 것"으로 끝나고,
이상이 있었다는 사실이 아무 데도 남지 않는다. **감지가 회전의 목적이다.**

---

## 2. 왜 이 구조가 표준인가

**access를 메모리에 두는 이유** — `localStorage`는 JS가 읽는다. XSS가 한 번 나면
토큰이 그대로 나간다. 메모리 변수도 완전히 안전하지는 않지만, 새 탭·다음 방문에는 남지 않고
공격자가 실행 중인 그 순간에만 닿는다. 그리고 어차피 15분이면 만료된다.

**refresh를 `httpOnly` 쿠키에 두는 이유** — `httpOnly`는 **JS가 아예 못 읽는다.**
XSS로도 값을 꺼낼 수 없다. 대신 브라우저가 자동으로 실어 보내므로 CSRF가 문제가 되는데,
`SameSite=Lax`가 다른 사이트에서 시작된 POST에 쿠키를 안 싣는다.

**`Path=/api/auth`로 좁히는 이유** — refresh가 하는 일은 갱신과 로그아웃 둘뿐이다.
경로를 좁히면 나머지 수십 개 API 요청에 refresh가 실려 나가지 않는다. 새어 나갈 표면을 줄인다.

**access를 15분으로 두는 이유** — JWT는 발급한 것을 도로 물릴 수 없다. 그래서
**물릴 수 없는 쪽을 짧게** 둔다. 계정을 정지시켜도 최대 15분은 통과하는데, 그 15분을
0으로 만들려면 매 요청마다 DB를 봐야 하고 그러면 JWT를 쓸 이유가 사라진다.

**로그아웃이 서버 호출인 이유** — 클라이언트에서 토큰만 지우는 로그아웃은
"내 화면에서 안 보이게 하는 것"이지 로그아웃이 아니다. 그 값을 복사해 둔 사람에게는
아무 일도 일어나지 않는다.

**부팅 시 refresh를 한 번 부르는 이유(④)** — access가 메모리에만 있으니 새로고침하면 사라진다.
쿠키가 남아 있으므로 갱신 한 번으로 복구된다. 이 왕복 동안 화면은 **로그인도 대시보드도 아닌
「확인 중」** 이어야 한다. 여기서 대시보드를 그리면 자식 화면들이 토큰 없이 API를 쏘고,
로그인 화면을 그리면 정상 사용자가 새로고침할 때마다 로그인 화면이 번쩍인다.

---

## 3. 설정값

`server/.env` (신규 생성 — 지금 없다):

```
JWT_SECRET=<임의의 긴 문자열>          # 기본값 없이 강제 (STEP 7)
JWT_EXPIRES_IN=15m                     # access
REFRESH_EXPIRES_IN=14d                 # refresh
COOKIE_SECURE=false                    # 운영(HTTPS)에서만 true
```

프론트는 추가 설정이 없다. `src/config/auth.config.ts`의 `tokenStorageKey`는
**쓰이지 않게 된다** (localStorage를 안 쓰므로). 지우거나 주석으로 사유를 남긴다.

---

## 4. 서버 구현

### STEP 1 — `cookie-parser` 설치

```bash
npm --prefix server i cookie-parser
```

Express 4는 쿠키를 **읽지** 못한다(`res.cookie`로 쓰는 것은 내장). `server/src/index.js`에서
`app.use(express.json(...))` 다음 줄에 `app.use(cookieParser())`를 건다.

### STEP 2 — `refresh_tokens` 마이그레이션

파일: `server/src/db/migrations/024_create_refresh_tokens.js` (현재 023까지 있다)

| 컬럼 | 타입 | 설명 |
|---|---|---|
| `id` | increments | |
| `user_id` | FK → users, **CASCADE** | 계정이 지워지면 토큰도 의미 없다 |
| `token_hash` | string(64) **unique** | SHA-256 hex. **원문은 저장하지 않는다** |
| `family_id` | string(36) **index** | 회전 사슬의 식별자. 재사용 감지가 이 단위로 폐기한다 |
| `expires_at` | timestamptz | |
| `revoked_at` | timestamptz nullable | 폐기 시각. **행을 지우지 않는다** — 지우면 재사용 감지가 불가능하다 |
| `user_agent` | string nullable | 어느 기기였는지. 사고 조사 때만 쓴다 |
| `created_at` | timestamptz | |

`server/src/db/tables.js`의 `DATA_TABLES`에 `'refresh_tokens'`를 **users 뒤에** 추가한다.
빠뜨리면 DB 이사 때 이 테이블만 조용히 비어서 넘어간다.

> **`revoked_at`으로 두고 행을 지우지 않는 이유** — 재사용 감지는 "폐기된 토큰이 다시 왔다"를
> 알아채는 것이다. 행을 지우면 그건 "없는 토큰"과 구분되지 않고, 둘은 뜻이 전혀 다르다
> (하나는 침해 신호이고 하나는 그냥 틀린 값이다).

### STEP 3 — 토큰 발급 유틸

파일: `server/src/lib/tokens.js` (신규)

| 함수 | 하는 일 |
|---|---|
| `signAccessToken(user)` | 기존 것을 옮긴다. `expiresIn`을 `JWT_EXPIRES_IN`(15m)로 |
| `issueRefreshToken(userId, { familyId, userAgent })` | `crypto.randomBytes(32).toString('base64url')` 생성 → 해시를 DB에 insert → **원문을 반환**. `familyId`가 없으면 `crypto.randomUUID()`로 새로 만든다 |
| `verifyRefreshToken(raw)` | 해시로 조회 → 없음/만료/폐기를 구분해 반환 |
| `revokeFamily(familyId)` | 그 사슬 전체를 `revoked_at` 처리 |
| `hashToken(raw)` | `crypto.createHash('sha256').update(raw).digest('hex')` |

`server/src/middleware/authMiddleware.js`는 검증(`requireAuth`·`requireAdmin`)만 남긴다.
발급과 검증이 한 파일에 있으면 라우트가 발급 함수를 쓰려고 미들웨어를 import하게 된다.

### STEP 4 — 쿠키 정책 한 곳에

파일: `server/src/lib/authCookie.js` (신규)

```js
export const REFRESH_COOKIE = 'refresh_token';

export const refreshCookieOptions = () => ({
  httpOnly: true,
  sameSite: 'lax',
  secure: process.env.COOKIE_SECURE === 'true',
  path: '/api/auth',
  maxAge: REFRESH_TTL_MS,
});
```

`setRefreshCookie(res, raw)` · `clearRefreshCookie(res)` 두 개를 export한다.

> **옵션을 라우트마다 손으로 적지 않는다.** 로그인·갱신·로그아웃 세 곳에 흩어지면
> 언젠가 한 곳에서 `httpOnly`나 `path`가 빠진다. 그러면 그 한 곳이 전체 정책이 된다.

### STEP 5 — 로그인 · 회원가입 응답 변경

파일: `server/src/routes/auth.js` (`/login`, `/signup`)

```
기존:  res.json({ accessToken, user })
변경:  refresh 발급 → setRefreshCookie(res, raw) → res.json({ accessToken, user })
```

**응답 body는 그대로 둔다.** 화면 코드가 안 바뀐다.

### STEP 6 — `POST /api/auth/refresh`

인증 미들웨어를 **붙이지 않는다.** access가 만료돼서 오는 요청이다.

```
1. 쿠키에서 refresh 원문을 읽는다.        없으면 → 401
2. 해시로 조회.                            없으면 → 401 (쿠키 삭제)
3. revoked_at 이 있으면                    → ★ revokeFamily(family_id) 후 401
4. expires_at 이 지났으면                  → 401 (쿠키 삭제)
5. 사용자가 is_active 인지 확인.           아니면 → revokeFamily 후 401
6. 옛 행을 revoked_at 처리
7. 같은 family_id 로 새 refresh 발급 → setRefreshCookie
8. res.json({ accessToken: signAccessToken(user), user: toPublicUser(user) })
```

**3번이 재사용 감지다.** 이 줄이 없으면 회전이 그냥 번거로운 절차가 된다.

> **6·7을 트랜잭션으로 묶는다.** 옛것만 폐기되고 새것 발급이 실패하면 그 사용자는
> 재로그인 말고 길이 없다.

### STEP 7 — `POST /api/auth/logout` · `JWT_SECRET` 강제

**로그아웃**: 쿠키의 refresh를 찾아 `revokeFamily` → `clearRefreshCookie` → `204`.
쿠키가 없어도 **204를 준다.** 이미 로그아웃된 상태에서 에러를 주면 화면이 로그아웃을 못 끝낸다.

**`JWT_SECRET`**: 기본값 `'nicify-dev-secret-change-me'`를 **지운다.**

```js
const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) throw new Error('JWT_SECRET 이 없습니다. server/.env 를 확인하세요.');
```

기본값이 있으면 `.env`를 빠뜨린 배포가 **조용히 성공한다.** 그 문자열은 레포에 있으므로
누구나 admin 토큰을 위조할 수 있다. 부팅에서 죽는 편이 낫다 — 죽는 건 배포 직후 1분이고,
조용히 성공하면 위조 가능한 상태로 몇 달 간다.

---

## 5. 클라이언트 구현

### STEP 8 — access를 메모리로만

파일: `src/shared/auth/token-store.ts` · `src/main.tsx`

`token-store.ts`는 **이미 메모리가 기본**이다. 할 일은 localStorage 경로를 걷어내는 것이다.

- `main.tsx`의 부팅 시 localStorage 복원(`const saved = localStorage.getItem(...)`) **삭제**
- `LoginIndex.tsx`의 `localStorage.setItem(...)` **삭제** (`setAccessToken`만 남긴다)
- `AccountMenu.tsx`의 `localStorage.removeItem(...)` **삭제**
- `ProtectedRoute.tsx`의 `localStorage.getItem(...)` **삭제** (STEP 12에서 대체)

grep로 `tokenStorageKey` 사용처가 0이 되는지 확인한다.

> 새로고침 유지는 이제 localStorage가 아니라 **STEP 10의 부팅 갱신**이 담당한다.
> 둘을 같이 두면 안 된다 — localStorage에 남은 옛 토큰이 갱신 결과를 덮어쓴다.

### STEP 9 — 쿠키 전송 확인

`src/core/api/api-client.ts:17`에 `withCredentials = true`가 **이미 있다.** 확인만 하고 넘어간다.
단, STEP 11의 재시도에서 `axios`를 새로 부를 때는 그 설정이 안 따라오므로 거기서 다시 켜야 한다.

### STEP 10 — 부팅 갱신 (`AuthProvider`)

파일: `src/shared/auth/AuthProvider.tsx` (신규) · `src/App.tsx`

앱이 처음 뜰 때 `POST /api/auth/refresh`를 **한 번** 부르고, 그동안 라우터를 그리지 않는다.

| 상태 | 그리는 것 |
|---|---|
| `idle` / `refreshing` | 전체 화면 로딩 (스플래시를 재사용해도 된다) |
| `authenticated` | `<RouterProvider />` |
| `anonymous` | `<RouterProvider />` — 게이트가 로그인으로 보낸다 |

`RouterProvider`를 감싸는 자리라 `App.tsx`가 바뀐다. 컨텍스트로 `status`와
`setAuthenticated()` / `setAnonymous()`를 내려, 로그인·로그아웃·인터셉터가 같은 상태를 본다.

> **React 18 StrictMode에서 개발 중 두 번 실행된다.** refresh가 두 번 나가면
> **회전 때문에 두 번째가 재사용 감지에 걸려 전 계정이 폐기된다.**
> 모듈 스코프 플래그나 `useRef`로 1회를 보장한다. 이 함정은 반드시 밟는다.

### STEP 11 — 401 → 갱신 → 재시도

파일: `src/shared/auth/setup-auth-interceptor.ts`

응답 인터셉터 `onRejected`:

```
1. status !== 401 이면            → 그대로 reject
2. url이 /api/auth/login|signup|refresh 이면 → 그대로 reject   ★
3. 이미 재시도한 요청이면(_retry)  → 그대로 reject
4. refresh() 호출 (single-flight)
   실패 → 토큰 정리 + anonymous 로 전환 → reject
   성공 → _retry 표시 + 새 access 헤더 → 요청 재전송
```

**2번을 빠뜨리면 두 가지가 깨진다.**
- 로그인 401(비밀번호 틀림)이 갱신 시도로 바뀌어, 에러 메시지 대신 화면이 튄다
- refresh 자체의 401이 또 refresh를 부른다 → 무한 루프

**single-flight** — 화면 하나가 API 다섯 개를 동시에 쏘면 401이 다섯 개 온다.
각자 갱신하면 refresh 요청이 다섯 개 나가고, **회전 때문에 넷이 재사용 감지에 걸린다.**
진행 중인 Promise를 모듈 변수에 담아두고 나머지는 그것을 `await` 한다.

```
let inflight = null;
function refresh() {
  if (!inflight) inflight = doRefresh().finally(() => { inflight = null; });
  return inflight;
}
```

> **이 프로젝트에서 재시도가 까다로운 지점** — `core/api/api-client.ts`의 `request()`가
> 에러를 잡아 `{ success: false }`로 **바꿔서 반환한다.** 호출 측에 예외가 안 간다는 뜻이고,
> 재시도는 **인터셉터 안에서 끝나야** 한다. core는 건드리지 않는 것이 이 스캐폴드의 규칙이므로,
> 재시도는 `axios(error.config)`를 직접 불러 처리한다.
> `error.config.url`은 이미 절대 URL이라 그대로 쓸 수 있고, `withCredentials: true`를
> **직접 붙여야 한다**(맨 axios는 기본값이 false다).

### STEP 12 — 라우트 게이트

파일: `src/shared/components/router/ProtectedRoute.tsx`

STEP 10이 부팅 갱신을 끝낸 뒤에 라우터가 그려지므로, 게이트는 **컨텍스트의 `status`만** 보면 된다.

| status | 그리는 것 |
|---|---|
| `authenticated` | `<Outlet />` |
| `anonymous` | `<Navigate to={authConfig.loginPath} state={{ from: location }} replace />` |

서버에 다시 묻지 않는다 — 부팅 갱신이 이미 물었다. `useMeQuery`는 게이트가 아니라
**사용자 정보를 그리는 화면**(`AccountMenu` 등)이 계속 쓴다.

`state.from`은 로그인 후 복귀에 쓴다 (STEP 13).

### STEP 13 — 로그인 · 로그아웃 화면

**로그인** (`LoginIndex.tsx`)
`onSuccess`에서 `setAccessToken` → `setAuthenticated()` → `location.state?.from?.pathname ?? '/'` 로 이동.

**로그아웃** (`AccountMenu.tsx`)
`POST /api/auth/logout` 호출 → 성공/실패와 무관하게 `clearAccessToken()` + `setAnonymous()` → 로그인으로.

> **서버 호출이 실패해도 클라이언트는 로그아웃한다.** 서버가 죽었을 때
> 로그아웃 버튼이 안 먹으면 그 화면에서 나갈 방법이 없다.

### STEP 14 — 탭 간 동기화

한 탭에서 로그아웃하면 다른 탭은 모른다. access가 메모리에 있으니 다른 탭의 토큰은
멀쩡히 남아 최대 15분간 계속 동작한다.

`localStorage`에 **토큰이 아니라 신호만** 쓴다 — `auth-event` 키에 `logout:<timestamp>`.
`window.addEventListener('storage', ...)`로 받아 `setAnonymous()`. 값 자체는 아무 의미가 없고,
`storage` 이벤트가 다른 탭에서만 발생한다는 성질만 쓴다.

---

## 6. 구현 순서

서버를 먼저 끝낸다. 클라이언트를 먼저 고치면 붙을 엔드포인트가 없어 중간 확인이 안 된다.

```
STEP 1 ─ 2 ─ 3 ─ 4 ─ 5 ─ 6 ─ 7        서버   (여기서 curl 로 ①③⑤ 흐름 확인)
                                │
                                ▼
STEP 8 ─ 9 ─ 10 ─ 12 ─ 13 ─ 11 ─ 14   클라이언트
```

클라이언트에서 **11(401 재시도)을 12·13 뒤로 미룬다.** 로그인·게이트가 먼저 돌아야
"갱신에 실패하면 어디로 가는가"의 도착지가 생긴다.

서버만 끝난 시점에 아래가 통과해야 다음으로 넘어간다.

```bash
# ① 로그인 → 쿠키 저장
curl -i -c c.txt -X POST localhost:4200/api/auth/login \
  -H 'Content-Type: application/json' -d '{"loginId":"redsky","password":"nicify1234"}'
# → 200 + Set-Cookie: refresh_token=…; HttpOnly; Path=/api/auth

# ③ 갱신 → 새 access + 새 쿠키
curl -i -b c.txt -c c2.txt -X POST localhost:4200/api/auth/refresh
# → 200, 쿠키 값이 바뀌어 있어야 한다 (회전)

# ★ 재사용 감지 — 옛 쿠키로 다시 갱신
curl -i -b c.txt -X POST localhost:4200/api/auth/refresh
# → 401. 그리고 c2.txt 도 죽어 있어야 한다 (family 전체 폐기)
```

---

## 7. 검증 시나리오

| # | 조작 | 기대 |
|---|---|---|
| 1 | 토큰 없이 `#/` · `#/admin/users` | 로그인 화면 |
| 2 | 로그인 후 F5 | 유지 · **로그인 화면 깜빡임 없음** · refresh 요청 **1회** |
| 3 | 개발자도구 Application → Local Storage | **비어 있다** (토큰이 없다) |
| 4 | Cookies → `refresh_token` | `HttpOnly` ✓ · `Path=/api/auth` ✓ |
| 5 | 일반 API 요청의 Request Headers | 쿠키가 **안 실린다** (Path 때문) |
| 6 | 15분 대기 후 화면에서 조회 | 자동 갱신 후 성공. **사용자는 아무것도 모른다** |
| 7 | 한 화면에서 API 5개 동시 401 | refresh 요청이 **1개만** 나간다 |
| 8 | 비밀번호를 틀리게 입력 | **에러 메시지.** 리다이렉트되면 안 된다 |
| 9 | 로그아웃 후 그 쿠키로 `/refresh` | 401 |
| 10 | 회전된 옛 쿠키로 `/refresh` | 401 + 그 계정 refresh 전부 폐기 |
| 11 | `#/admin/users` → 로그인 | `/admin/users`로 복귀 |
| 12 | 탭 둘 열고 한쪽에서 로그아웃 | 다른 탭도 로그인 화면 |
| 13 | 개발 모드 첫 진입 (StrictMode) | refresh가 **1회만** — 2회면 STEP 10 함정 |
| 14 | `server/.env` 없이 서버 기동 | **부팅 실패** |

---

## 8. 지금 코드에서 바뀌는 것

| 항목 | 지금 | 바뀐 뒤 |
|---|---|---|
| access 수명 | 7일 | 15분 |
| access 보관 | `localStorage` + 메모리 | **메모리만** |
| refresh | 없음 | `httpOnly` 쿠키 + DB |
| 게이트 판정 | `localStorage`에 문자열이 있는지 | 부팅 갱신 결과(`status`) |
| 401 처리 | 없음 (주석) | 갱신 → 재시도 |
| 로그아웃 | 클라이언트에서 문자열 삭제 | 서버가 refresh 폐기 |
| `JWT_SECRET` | 하드코딩 기본값 있음 | 없으면 부팅 실패 |
| `authConfig.tokenStorageKey` | 사용 중 | **미사용** — 정리 대상 |

이미 되어 있어 손대지 않는 것: `withCredentials`(api-client.ts:17),
요청 인터셉터의 Bearer 주입, `GET /api/auth/me`, `requireAuth` · `requireAdmin`.

---

## 9. 미결 사항

- [ ] 동시 로그인 허용 범위 — 기기 여러 대를 허용할지(family 여러 개), 1인 1세션으로 제한할지
- [ ] 비밀번호 변경 시 다른 기기의 refresh를 전부 폐기할지 (지금 서버는 일부러 유지 — `auth.js:170`)
- [ ] 계정 비활성화 시 즉시 차단 — refresh는 막히지만 access는 최대 15분 산다. 이걸 허용할지
- [ ] 재사용 감지가 걸렸을 때 관리자에게 알릴지, 로그만 남길지
- [ ] `refresh_tokens` 만료 행 정리 주기 (크론 vs 갱신 시 같이 지우기)
- [ ] 사내 계정(AD) 연동이 정해지면 refresh 관리를 그쪽에 넘길지

---

## 작성 규칙

- 결정은 이유와 함께 적는다. 무엇을 했는지는 git log가 안다. 여기 적을 것은 *왜*다.
- 끝난 항목을 지우지 않는다 — 순서를 되짚을 때 쓴다.
- 날짜는 절대 표기(`2026-08-21`)로 쓴다.
