# JWT 인증 — 공통 개발자 적용 가이드

> **대상:** 프로젝트 착수 시 인증을 서버에 맞춰 붙이는 사람. 프로젝트당 한 번 읽는다.
> **끝나면:** 로그인 · 자동 토큰 갱신 · 라우트 보호 · 탭 간 로그아웃이 동작하고,
> 업무 개발자는 인증 코드를 한 줄도 짜지 않아도 된다.
> **소요:** 서버 답변이 있으면 1~2시간.

---

## 0. 시작 전 — 지금 상태

스캐폴드에는 인증 **기능**이 들어 있고, **배선은 비어 있다.**

프로젝트마다 로그인 방식·화면·서버 규약이 다르다. 미리 붙여두면 스캐폴드를 반입한 프로젝트가
가장 먼저 하는 일이 "그걸 지우는 일"이 된다. 그래서 스캐폴드는 **동작하는 부품**만 주고,
조립은 이 문서가 안내한다.

### 이미 있는 것 — `src/shared/auth/**` (열지 않는다)

| 파일 | 하는 일 |
|---|---|
| `auth-flow.ts` | 부팅 복구 · 로그인 · 로그아웃 · 갱신 · 정리 · 탭 동기화 |
| `auth-api.ts` | 서버 호출 (엔드포인트 · 응답 매핑) |
| `auth-strategies.ts` | 저장 전략 3벌 (`cookie` · `storage` · `access-only`) |
| `auth-interceptor.ts` | Bearer 자동 첨부 · 401 → 갱신 → 재시도 (동시 요청은 갱신 1회로 묶임) |
| `auth-hooks.ts` | `useAuth` · `useLogin` · `useLogout` |
| `auth.store.ts` | 로그인 상태 · 사용자 |
| `ProtectedRoute.tsx` | 라우트 게이트 (권한 확인 포함) |
| `dev-probe.ts` | 콘솔 확인용 `window.__auth` (dev 전용, 선택) |

### 없는 것 — 이 문서에서 만든다

```
src/domains/auth/types.ts               서버가 받고 주는 값의 모양      ← 만든다
src/domains/auth/pages/LoginIndex.tsx   로그인 화면                    ← 만든다
src/domains/auth/router/index.tsx       로그인 라우트                  ← 만든다
```

### 이미 있고 값만 고치는 것

```
.env                          주소 · 저장소 키
src/config/auth.config.ts     전략 · 경로 · 응답 매핑 · 확장 지점
src/shared/router/index.tsx   어느 라우트를 보호할지
src/main.tsx                  부팅 배선 세 줄
```

> `src/shared/auth/**` 는 **열지 않는다.** 열어야 하는 상황이 생기면 설정으로 흡수할 수 있는
> 범위를 넘었거나(§9), 스캐폴드에 확장 지점이 빠진 것이다. 후자라면 스캐폴드 쪽 결함이니
> 고쳐 쓰기 전에 알린다. 말없이 고쳐 놓으면 새 버전을 반입할 때 그 수정이 날아간다.

> ⚠️ **`src/config/auth.config.ts` 는 지우지 않는다.** `src/shared/auth` 의 다섯 파일이 이걸
> 정적 import 하고, 일부는 **모듈 로드 시점에** 값을 읽는다. 파일이 없으면 컴파일되지 않는다.
> 인증을 쓰지 않더라도 파일은 그대로 둔다(§7).

---

## 1. 서버 담당에게 물어볼 것

**아래를 그대로 복사해서 보내면 된다.** 이 답이 나오면 세팅은 값 채우기만 남는다.

```
[프론트엔드] 인증 연동 확인 요청

1. refresh token 을 어떻게 주시나요?  (셋 중 하나)
   a. Set-Cookie 로 내려줍니다 (HttpOnly)
   b. 응답 body 에 담아서 줍니다
   c. refresh 없이 access token 만 있습니다

2. 엔드포인트 경로를 알려주세요.
   로그인 / 갱신 / 로그아웃 / 내 정보    (예: /api/auth/login)

3. 로그인 요청 body 에 어떤 필드를 받으시나요?
   (예: loginId + password / 사번 + 비밀번호 / 회사코드 + ID + 비밀번호 + OTP)

4. 로그인 응답 형태를 알려주세요.
   - access token 이 들어있는 키 이름      (예: accessToken, token, data.access_token)
   - 사용자 정보가 들어있는 키와 필드      (예: user: { id, name, role })

5. access token 이 만료되면 응답 코드가 무엇인가요?
   → 401 이어야 자동 갱신이 동작합니다. 403 이나 "200 + 에러코드" 면 알려주세요.

6. 갱신할 때 refresh token 을 새 값으로 교체(회전)하시나요?
   → 회전한다면, 직전 토큰을 몇 초간 더 받아주실 수 있나요?
      (탭을 여러 개 띄우면 동시 갱신이 생겨, 유예가 없으면 계정이 로그아웃됩니다)

7. (1번이 a 인 경우만) 쿠키 속성과 CORS 를 확인 부탁드립니다.
   - HttpOnly / SameSite=Lax 이상 / 운영은 Secure
   - Access-Control-Allow-Credentials: true
   - Access-Control-Allow-Origin 은 구체적인 주소 (와일드카드 * 는 브라우저가 막습니다)
```

### 답을 못 받아도 시작할 수 있는 것

**§3.2 ~ §3.5 (타입 · 로그인 화면 · 라우트)는 서버 없이 다 만들 수 있다.** 마크업과 배선은
서버 응답 모양과 무관하다. 답이 오면 §3.1 · §3.3 의 값만 채우면 된다.

**동작 확인(§5)은 서버가 있어야 한다.** 스캐폴드에 인증 목(mock)은 없다 — 프로젝트마다
로그인 규약이 달라 그대로 쓰이는 일이 없었고, 남아 있으면 실서버가 붙은 뒤에도
조용히 앞을 가려서 원인 찾기 어려운 버그를 만들었다.

서버가 한참 늦어져 임시로 흉내내야 한다면 [`목서버-적용가이드.md`](목서버-적용가이드.md) 를 보고
프로젝트 안에 직접 만든다. **실서버가 뜨는 즉시 지운다.**

---

## 2. 전략 고르기

1번 질문의 답이 곧 전략이다.

| 서버 답변 | `strategy` |
|---|---|
| Set-Cookie 로 내려줍니다 (HttpOnly) | `'cookie'` ← **권장** |
| 응답 body 에 담아 줍니다 | `'storage'` |
| refresh 없이 access 만 있습니다 | `'access-only'` |

| | `cookie` | `storage` | `access-only` |
|---|---|---|---|
| access 보관 | **메모리** | localStorage | localStorage |
| refresh 보관 | 브라우저 (JS 접근 불가) | localStorage | — |
| 새로고침 유지 | 부팅 시 갱신 1회 | 저장소에서 복원 | 저장소에서 복원 |
| 401 을 받으면 | 갱신 → 재시도 | 갱신 → 재시도 | **정리 → 로그인 화면** |
| XSS 내성 | **높다** | 낮다 | 낮다 |

`cookie` 가 **가능한지부터** 묻는다. 가능한데 안 쓰는 것과 불가능해서 못 쓰는 것은 다르다.

- `storage` · `access-only` 를 고르면 개발 콘솔에 하향 경고가 한 번 뜬다. **막지는 않는다** — 서버가 그렇다면 다른 방법이 없다. 운영 빌드에서는 안 나온다.
- `access-only` 는 `storage` 와 코드가 거의 같지만 **401 을 받았을 때 행동이 정반대**다(갱신 시도 vs 즉시 로그아웃). 서버에 refresh 가 정말 없을 때만 고른다.

---

## 3. 붙이는 순서 (8단계)

**순서대로 한다.** §3.6(라우터 게이트)을 §3.4·§3.5(화면·라우트)보다 먼저 하면
로그인 화면 대신 404 로 튕겨서 원인을 찾느라 시간을 쓴다.

### 3.1 `.env` — 주소

```bash
# API 서버 주소
VITE_API_BASE_URL=/api                    # 운영 배포 시에는 실제 주소
VITE_SERVER_URL=http://localhost:4000     # dev 프록시가 /api 를 넘길 대상

# access token 저장소 키
VITE_LOCALSTORAGE_TOKEN_NAME=access_token
```

- `VITE_API_BASE_URL` 을 `/api` 로 두면 dev 에서 Vite 프록시가 동일 출처를 만들어 **쿠키 관련 CORS 문제를 우회**한다. `cookie` 전략이라면 이 형태를 권한다.
- `VITE_LOCALSTORAGE_TOKEN_NAME` 은 `storage` · `access-only` 에서만 쓰인다. `cookie` 전략에서는 안 쓰이지만 **지우지 말 것** — 전략을 바꾸는 순간 되살려야 하고, 그 사이 각자 키를 하드코딩하게 된다.

> `.env` 를 고치면 **dev 서버를 재시작**해야 한다. Vite 는 `.env` 를 핫리로드하지 않는다.

- [ ] 완료

### 3.2 `src/domains/auth/types.ts` — 서버가 받고 주는 모양 **(새로 만든다)**

3번 · 4번 질문의 답을 여기 적는다. **이 파일은 프로젝트가 소유한다** — 스캐폴드는 이 형태를
전혀 모르고, 새 버전을 반입해도 덮어쓰지 않는다.

```ts
/**
 * 인증 도메인 타입 — 이 프로젝트가 소유한다.
 *
 * 서버가 받고 주는 값의 모양을 여기서 맞춘다. 스캐폴드는 이 파일을 모른다.
 * 필드를 바꿔도 src/shared/auth/** 는 하나도 안 바뀐다.
 */

/**
 * 로그인 요청에 실을 필드.
 * login() 이 받은 객체를 그대로 요청 body 로 보내므로, 이 타입이 곧 요청 스펙이다.
 */
export interface ILoginCredentials {
	loginId: string;
	password: string;
}

/**
 * 서버가 내려주는 사용자.
 * 스캐폴드는 이 값을 담아 두기만 하고 내용에 관여하지 않는다.
 * 화면에서 useAuth<IAppUser>() 로 꺼내 쓴다.
 */
export interface IAppUser {
	id: number | string;
	loginId: string;
	name: string;
	role?: string;
}
```

필드는 **이름도 개수도 프로젝트마다 다르다.** 서버에 맞춰 그대로 바꾼다.

```ts
// 사번 + 2차 인증을 받는 서버라면
export interface ILoginCredentials {
	empNo: string;
	password: string;
	otp: string;
}

// 회사코드가 앞에 붙는 멀티테넌트 서버라면
export interface ILoginCredentials {
	companyCode: string;
	userId: string;
	password: string;
}
```

`IAppUser` 는 업무 개발자가 `useAuth<IAppUser>()` 로 꺼내 쓰는 타입이다.
서버 키가 다르면 여기서 이름을 맞추거나, `extractUser` 에서 변환한다(§3.3).

- [ ] 완료

### 3.3 `src/config/auth.config.ts` — 설정의 중심 **(이미 있다. 값을 고친다)**

```ts
const LOGIN_PATH = '/auth/login';

export const authConfig: AuthConfig = {
	strategy: 'cookie',                       // §2 에서 고른 값

	endpoints: {                              // 2번 질문의 답
		login: '/auth/login',
		logout: '/auth/logout',
		refresh: '/auth/refresh',
		me: '/auth/me',
	},

	extractAccessToken: (body) => body.accessToken,    // 4번 질문의 답
	extractRefreshToken: (body) => body.refreshToken,  // storage 전략에서만 쓰임
	extractUser: (body) => body.user,

	loginPath: LOGIN_PATH,                    // 로그인 "화면" 경로
	tokenStorageKey: import.meta.env.VITE_LOCALSTORAGE_TOKEN_NAME,

	// 확장 지점 — §4
	resolveRoles: (user) => (user.role ? [String(user.role)] : []),
	onSessionEnd: () => { window.$router?.replace(LOGIN_PATH); },
};
```

#### 경로는 baseURL 뒤에 붙는다

```
VITE_API_BASE_URL=/api  +  endpoints.login='/auth/login'   →   POST /api/auth/login
```

#### ⚠️ `endpoints.login` 과 `loginPath` 는 다른 것이다

이름이 비슷해 **반드시 헷갈린다.**

| | |
|---|---|
| `endpoints.login` | 서버 API 경로 — `POST /api/auth/login` |
| `loginPath` | 화면 라우트 경로 — `/#/auth/login` (§3.5 에서 만든다) |

#### ⚠️ 응답 키를 여러 개 탐색하지 말 것

```ts
// ❌ 하지 마세요
extractAccessToken: (body) => body.accessToken ?? body.token ?? body.data?.token,
```

붙는 순간에는 편하지만, 서버가 응답을 바꿨을 때 **조용히 다른 키를 집어 계속 동작하는 척한다.**
그때 나는 버그는 원인을 찾기 어렵다. 한 줄 아끼려다 하루를 쓴다.

응답이 중첩돼 있으면 **정확히 하나를 지정한다.**

```ts
extractAccessToken: (body) => body.data.access_token,
extractUser: (body) => body.data.userInfo,
```

키 이름이 `IAppUser` 와 다르면 여기서 맞춰준다.

```ts
extractUser: (body) => ({
	id: body.user.empNo,
	loginId: body.user.empNo,
	name: body.user.userNm,
	role: body.user.authCd,
}),
```

- [ ] 완료

### 3.4 `src/domains/auth/pages/LoginIndex.tsx` — 로그인 화면 **(새로 만든다)**

아래를 그대로 복사해 시작한 뒤 프로젝트 디자인에 맞춰 마크업을 바꾼다.
**유지할 것은 훅 네 줄뿐이다.**

```tsx
import { useState, type ChangeEvent, type SubmitEvent } from 'react';
import { Navigate, useLocation } from 'react-router';
import type { ILoginCredentials } from '@/domains/auth/types';
import { useAuth, useLogin } from '@/shared/auth';

/** ProtectedRoute 가 Navigate 의 state 로 넘겨주는 값. */
interface ILoginLocationState {
	from?: { pathname?: string };
}

export default function LoginIndex(): React.ReactNode {
	const location = useLocation();
	const { isAuthenticated } = useAuth();
	const { submit, pending, error } = useLogin();

	const [form, setForm] = useState<ILoginCredentials>({ loginId: '', password: '' });

	// 게이트가 막아 세운 원래 경로. 직접 들어온 경우엔 홈으로.
	// ⚠️ history state 라서 이 화면에서 F5 를 누르면 사라진다(그때는 홈으로 간다).
	//    복귀를 새로고침 뒤에도 보장해야 하면 쿼리스트링(?redirect=)으로 바꾼다.
	const from = (location.state as ILoginLocationState | null)?.from?.pathname ?? '/';

	const setField =
		(key: keyof ILoginCredentials) =>
		(e: ChangeEvent<HTMLInputElement>): void => {
			setForm((prev) => ({ ...prev, [key]: e.target.value }));
		};

	const handleSubmit = async (e: SubmitEvent<HTMLFormElement>): Promise<void> => {
		e.preventDefault();
		// 성공하면 status 가 authenticated 로 바뀌고 아래 Navigate 가 걸린다.
		// 여기서 직접 이동시키지 않는다.
		await submit(form);
	};

	// 로그인 성공 · 이미 로그인한 사람이 주소로 직접 진입 — 두 경우가 여기서 같이 처리된다.
	// useEffect 가 아니라 렌더 중에 Navigate 를 돌려주는 이유는, effect 로 하면
	// 첫 페인트에 로그인 폼이 한 번 번쩍이기 때문이다.
	if (isAuthenticated) {
		return (
			<Navigate
				to={from}
				replace
			/>
		);
	}

	const fieldClass =
		'w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 outline-none focus:border-indigo-500 dark:border-gray-700 dark:bg-gray-900 dark:text-gray-100';

	return (
		<div className="flex min-h-screen flex-col items-center justify-center gap-8 bg-gray-50 px-4 dark:bg-gray-950">
			<h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">로그인</h1>

			<form
				onSubmit={handleSubmit}
				className="w-full max-w-sm space-y-4"
			>
				<div className="space-y-1.5">
					<label
						htmlFor="loginId"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						아이디
					</label>
					<input
						id="loginId"
						value={form.loginId}
						onChange={setField('loginId')}
						autoComplete="username"
						required
						className={fieldClass}
					/>
				</div>

				<div className="space-y-1.5">
					<label
						htmlFor="password"
						className="block text-sm font-medium text-gray-700 dark:text-gray-300"
					>
						비밀번호
					</label>
					<input
						id="password"
						type="password"
						value={form.password}
						onChange={setField('password')}
						autoComplete="current-password"
						required
						className={fieldClass}
					/>
				</div>

				{/* 로그인 실패는 401 이지만 갱신 대상이 아니다. 화면이 튀지 않고 메시지만 보여야 한다. */}
				{error && (
					<p
						role="alert"
						className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700 dark:bg-red-950/50 dark:text-red-300"
					>
						{error}
					</p>
				)}

				<button
					type="submit"
					disabled={pending}
					className="w-full rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:opacity-50"
				>
					{pending ? '로그인 중…' : '로그인'}
				</button>
			</form>
		</div>
	);
}
```

**마크업은 통째로 바꿔도 된다. 유지할 것은 이 네 줄이다.**

```tsx
const { submit, pending, error } = useLogin();
const { isAuthenticated } = useAuth();

await submit(form);                                           // 제출 — form 은 ILoginCredentials
if (isAuthenticated) return <Navigate to={from} replace />;   // 성공 후 이동
{error && <p role="alert">{error}</p>}                        // 실패 메시지
```

- 토큰 저장 · 상태 전환 · 자동 갱신은 **이미 되어 있다.** 직접 하지 말 것.
- `error` 에는 **서버가 준 메시지**가 그대로 들어온다. 서버가 안 주면 기본 문구가 나온다. 기본 문구를 바꾸려면 `useLogin({ fallbackMessage: "..." })`.
- `pending` 은 성공 후에도 `true` 로 유지된다. 곧 화면이 바뀌므로 버튼이 잠겨 있는 편이 이중 제출을 막는다.
- 입력 필드를 늘리려면 `ILoginCredentials`(§3.2) 에 **먼저** 추가한다. 그러면 이 화면이 타입 검사를 받고, 그 객체가 그대로 요청 body 가 된다.

> 이 화면은 `RootLayout` 을 씌우지 않아 헤더·네비 없이 전체 화면으로 뜬다(§3.6 의 라우트 구조).

- [ ] 완료

### 3.5 `src/domains/auth/router/index.tsx` — 로그인 라우트 **(새로 만든다)**

```tsx
import type { TAppRoute } from '@/types/router';
import loadable from '@loadable/component';

const LoginIndex = loadable(() => import('@/domains/auth/pages/LoginIndex'));

const routes: TAppRoute[] = [
	{
		path: 'login',
		element: <LoginIndex />,
		name: 'LoginIndex',
	},
];

export default routes;
```

`/auth` + `login` → `/#/auth/login`. `authConfig.loginPath`(§3.3) 와 **반드시 일치해야 한다.**

- [ ] 완료

### 3.6 `src/shared/router/index.tsx` — 게이트 배선 **(이미 있다. 주석을 코드로)**

파일 상단 주석에 붙이는 형태가 적혀 있다. 그대로 코드로 바꾼다.

```tsx
import { ProtectedRoute } from '@/shared/auth';
import AuthRouter from '@/domains/auth/router';

const routes: TAppRoute[] = [
	// 인증 라우트는 게이트 바깥
	{
		path: '/auth',
		children: AuthRouter,
	},

	// 여기부터 로그인 필수
	{
		element: <ProtectedRoute />,
		children: [
			{ path: '/', element: <RootLayout />, children: MainRouter },
			{ path: '/orders', element: <RootLayout />, children: OrderRouter },
		],
	},

	// 권한까지 확인
	{
		element: <ProtectedRoute roles={['admin']} />,
		children: [{ path: '/admin', element: <RootLayout />, children: AdminRouter }],
	},
];
```

> ⚠️ **인증 라우트(`/auth`)를 게이트 안에 넣으면 안 된다.** 로그인하러 가는 길이 다시 막혀
> 무한 리다이렉트가 된다.

- 권한 부족은 홈으로 보낸다. 바꾸려면 `forbiddenPath="/no-permission"`.
- 로그인 없이 볼 화면은 게이트 **바깥**에 둔다.
- `/example` · `/publishing/example` 은 스캐폴드 예제라 게이트 밖에 있다. 실제 개발이 시작되면 함께 지운다.

- [ ] 완료

### 3.7 `src/main.tsx` — 부팅 배선 **(이미 있다. 주석을 코드로)**

세 줄이다. **위치가 중요하다.**

```ts
import { bootAuth, setupAuthInterceptor, setupTabSync } from '@/shared/auth';

// ① 렌더 밖 · 모듈 최상단 — 첫 요청이 나가기 전에 인터셉터가 걸려 있어야 한다
setupAuthInterceptor();
setupTabSync();

(async () => {
	// ② 부팅 복구 1회. 렌더 **전에** await 한다.
	//    실패해도 렌더는 한다(내부에서 삼킨다). 실패는 "비로그인"이지 "화면 없음"이 아니다.
	await bootAuth();

	createRoot(document.getElementById('root')!).render(
		<AppProviders>
			<App />
		</AppProviders>,
	);
})();
```

- `bootAuth()` 를 렌더 **뒤**로 옮기면 새로고침마다 로그인 폼이 한 번 번쩍인다.
- 목 서버를 쓰고 있다면 `bootAuth()` 는 반드시 목 기동 **뒤**여야 한다. 순서가 바뀌면 갱신 요청이 목을 못 타고 실제 네트워크로 빠져나간다.
- 토큰 복원을 여기서 하지 않는다. 저장소를 아는 것은 전략뿐이고, 새로고침 유지는 `bootAuth()` 가 담당한다.

**선택 — 콘솔 확인 도구(dev 전용).** §5 의 6·7번 검증에 쓴다.

```ts
if (import.meta.env.DEV) {
	const { registerAuthDevProbe } = await import('@/shared/auth/dev-probe');
	registerAuthDevProbe();      // window.__auth
}
```

- [ ] 완료

### 3.8 (선택) 사용자 메뉴 — 헤더에 로그아웃 붙이기

로그아웃 버튼과 사용자 이름은 대개 **헤더**에 붙는다. 헤더가 소유주이므로
`src/shared/components/layout/` 아래 레이아웃 옆에 둔다. `domains/auth` 에 두면
업무 도메인이 인증 도메인을 직접 import 하게 되어 의존이 꼬인다.

```tsx
import type { IAppUser } from '@/domains/auth/types';
import { useAuth, useLogout } from '@/shared/auth';

export default function UserMenu(): React.ReactNode {
	const { isAuthenticated, user } = useAuth<IAppUser>();
	const { logout, pending } = useLogout();

	if (!isAuthenticated) return null;

	return (
		<div className="flex items-center gap-3 text-sm">
			<span className="text-gray-700 dark:text-gray-300">{user?.name ?? '사용자'}</span>
			<button
				type="button"
				onClick={logout}
				disabled={pending}
				className="rounded-md border border-gray-300 px-3 py-1.5 font-medium text-gray-700 transition hover:bg-gray-100 disabled:opacity-50 dark:border-gray-700 dark:text-gray-300 dark:hover:bg-gray-800"
			>
				{pending ? '로그아웃 중…' : '로그아웃'}
			</button>
		</div>
	);
}
```

**로그아웃 후 어디로 갈지는 이 컴포넌트가 정하지 않는다.** `onSessionEnd`(§4) 가 정한다.

- [ ] 완료

---

## 4. 확장 지점 세 개

`src/shared/auth` 를 열지 않고 동작을 바꾸는 자리다. 전부 `auth.config.ts` 에 있다.

### `resolveRoles(user)` — 권한을 꺼내는 방법

```ts
// 문자열 하나로 주는 서버
resolveRoles: (user) => (user.role ? [String(user.role)] : []),

// 배열로 주는 서버
resolveRoles: (user) => (user.roles as string[]) ?? [],

// 중첩돼 있는 서버
resolveRoles: (user) => ((user.auth as { codes?: string[] })?.codes) ?? [],
```

`<ProtectedRoute roles={[...]} />` 와 업무 개발자의 `hasRole()` 이 이 함수를 쓴다.

권한 가드를 안 쓰면 지워도 된다. 다만 **지운 상태에서 `roles` 를 쓰면 막는 쪽으로 동작한다**
(콘솔에 사유가 찍힌다). 가드가 조용히 열려 있는 것보다 낫기 때문이다.

### `onLoginSuccess(session)` — 로그인 직후 할 일

```ts
onLoginSuccess: async (session) => {
	await prefetchMenus();          // 메뉴·권한 조회
	trackLogin(session.user);       // 접속 기록
},
```

이 시점에 토큰과 상태는 **이미 확정돼 있다.** 여기서 던지면 에러가 로그인 화면까지 전달되지만
로그인 자체는 유지된다. 되돌리고 싶으면 이 안에서 `logout()` 을 부른다.

**업무 개발자가 "로그인 직후 공통 데이터를 불러야 한다"고 요청하면 여기서 처리한다.**
화면마다 따로 짜면 프로젝트가 지저분해진다.

### `onSessionEnd(reason)` — 세션이 끝났을 때

```ts
onSessionEnd: (reason) => {
	if (reason === 'expired') window.$ui?.alert('세션이 만료되었습니다. 다시 로그인해 주세요.');
	window.$router?.replace('/auth/login');
},
```

| `reason` | 언제 |
|---|---|
| `logout` | 사용자가 로그아웃했다 |
| `expired` | 갱신에 최종 실패했다 (세션 만료 · refresh 폐기) |
| `other-tab` | 다른 탭에서 로그아웃했다 |

**이동은 스캐폴드가 하지 않는다.** `shared/auth` 는 라우터를 모른다. 이 콜백이 없으면
상태만 바뀌고 화면은 그대로다(보호 라우트에 있었다면 `ProtectedRoute` 가 내보내므로 문제없다).

```ts
// SSO 를 쓰는 프로젝트
onSessionEnd: () => { window.location.href = 'https://sso.example.com/logout'; },
```

`push` 가 아니라 `replace` 를 쓰는 이유 — 뒤로가기로 로그아웃 직전 화면에 돌아가지 못하게 한다.

### 그 밖의 커스터마이즈

| 하고 싶은 것 | 어디서 |
|---|---|
| 모든 요청에 공통 헤더 추가 | `src/config/api.config.ts` 의 `headers` |
| 로그인 상태에 따라 동적 헤더 추가 | `src/main.tsx` 에서 `registerRequestInterceptor()` 로 하나 더 등록 |
| access token 수명 · 재시도 정책 | **서버가 정한다.** 프론트에서 바꿀 값이 아니다 |

---

## 5. 검증

서버를 붙인 뒤 순서대로 돌린다.

| # | 조작 | `cookie` | `storage` | `access-only` |
|---|---|---|---|---|
| 1 | 토큰 없이 보호 라우트 진입 | 로그인 화면 | 〃 | 〃 |
| 2 | 로그인 후 F5 | 유지 · 깜빡임 없음 · refresh **1회** | 유지 · 네트워크 호출 없음 | 유지 · 네트워크 호출 없음 |
| 3 | Local Storage 확인 | **비어 있다** | access · refresh · user | access · user |
| 4 | Cookies → refresh 쿠키 | HttpOnly ✓ · Path ✓ | 없음 | 없음 |
| 5 | 일반 API 요청 헤더 | Bearer ✓ | Bearer ✓ | Bearer ✓ |
| 6 | access 만료 후 조작 | 자동 갱신 후 성공 | 자동 갱신 후 성공 | **로그인 화면** |
| 7 | API 5개 동시 401 | refresh **1개만** | refresh **1개만** | 해당 없음 |
| 8 | 비밀번호를 틀리게 입력 | **에러 메시지.** 리다이렉트 금지 | 〃 | 〃 |
| 9 | 로그아웃 후 뒤로가기 | 로그인 화면 · 이전 데이터 안 보임 | 〃 · 저장소도 비었는지 | 〃 |
| 10 | 보호 라우트 직접 진입 → 로그인 | 원래 경로로 복귀 | 〃 | 〃 |
| 11 | 탭 둘, 한쪽에서 로그아웃 | 다른 탭도 로그인 화면 | 〃 | 〃 |
| 12 | 권한 없는 계정으로 `roles` 라우트 | `forbiddenPath` 로 이동 | 〃 | 〃 |
| 13 | 개발 콘솔 | 경고 없음 | 하향 경고 1회 | 하향 경고 1회 |

### 6 · 7번은 콘솔 도구로 확인한다

§3.7 에서 `registerAuthDevProbe()` 를 켰다면 쓸 수 있다.

```js
await __auth.me();       // me 401 → refresh 200 → me 200  (세 줄이 순서대로 떠야 한다)
await __auth.burst(5);   // me 401 x5 → refresh 200 x1 → me 200 x5
```

`fetch()` 로 직접 찌르면 인터셉터를 타지 않아 이 검증이 성립하지 않는다.
access token 을 빨리 만료시키는 건 **서버 담당에게 요청**한다 — 프론트에서 정하는 값이 아니다.

### 특히 눈여겨볼 항목

- **8번** — 로그인 실패가 갱신 시도로 번지면 에러 메시지 대신 화면이 튄다. Network 에 `refresh` 요청이 나가면 안 된다.
- **7번** — `refresh` 가 2개 이상이면 회전하는 서버에서 계정이 로그아웃된다.
- **10번** — 복귀 경로는 history state 에 담긴다. 로그인 화면에서 F5 하면 사라지고 홈으로 간다. 새로고침 뒤에도 보장해야 하면 `?redirect=` 쿼리 방식으로 바꾼다.

---

## 6. 업무 개발자에게 공지하기

**세팅이 끝나면 반드시 공지한다.** 이걸 안 하면 업무 개발자들이 각자 401 처리를 짜 넣는다.
아래를 복사해 빈칸을 채워 보낸다.

```
[인증 세팅 완료 공지]

1. 로그인 화면:  /#/auth/login
2. 개발용 계정:  ____________________________          ← 채우기 (서버 담당에게 받는다)

3. 인증을 위해 여러분이 짜야 할 코드는 없습니다.
   - API 호출 시 토큰을 붙이지 마세요        (자동으로 붙습니다)
   - 401 처리를 짜지 마세요                  (자동 갱신 + 재시도됩니다)
   - 로그인 상태를 따로 스토어에 만들지 마세요 (useAuth 를 쓰세요)

4. 사용자 정보 꺼내기
       const { user } = useAuth<IAppUser>();
   현재 필드:  ____________________________          ← 채우기

5. 권한 이름:  ____________________________          ← 채우기
   버튼·메뉴 감추기:  {hasRole('____') && <Button />}

6. 현재 보호 중인 라우트:  ____________________       ← 채우기
   새 화면을 보호하려면 저에게 요청하세요.

7. 자세한 사용법:  jwt인증-업무개발자-사용가이드
```

**2 · 4 · 5 · 6번을 빈칸으로 둔 이유** — 프로젝트마다 실제 값이 다르다. 채워 보내야 의미가 있다.

---

## 7. 인증을 쓰지 않는 프로젝트

**아무것도 안 하면 된다.** 스캐폴드 기본 상태가 그것이다.
`src/shared/auth/**` 는 참조되지 않으면 번들에 들어가지 않는다.

폴더까지 지우고 싶다면 `src/shared/auth` 는 지워도 되지만,
**`src/config/auth.config.ts` 는 남긴다.** 지우면 다음에 인증이 필요해졌을 때
설정의 모양을 처음부터 다시 알아내야 한다. 나중에 필요해지면 이 문서로 돌아온다.

---

## 8. 처음부터 붙일 때 자주 하는 실수

| 실수 | 증상 | 예방 |
|---|---|---|
| §3.6(게이트)을 §3.4·§3.5(화면·라우트)보다 먼저 함 | 로그인 화면 대신 404 · 무한 리다이렉트 | §3 순서를 지킨다 |
| `loginPath` 와 실제 라우트 경로가 다름 | 로그인 화면으로 못 간다 | §3.3 과 §3.5 를 대조 |
| `/auth` 를 게이트 안에 넣음 | 무한 리다이렉트 | 게이트 **바깥** |
| `bootAuth()` 를 렌더 뒤에 부름 | 새로고침마다 로그인 폼이 번쩍 | 렌더 **전에** await |
| `setupAuthInterceptor()` 를 async 블록 안에 넣음 | 첫 요청에 토큰이 안 붙는다 | 모듈 최상단 |
| 로그인 화면에서 직접 `navigate()` 호출 | 이동이 두 번 일어나거나 안 일어난다 | `isAuthenticated` + `<Navigate>` |
| `domains/auth` 에 UserMenu 를 두고 업무 화면에서 import | 도메인 간 의존이 꼬인다 | 헤더(`shared/components/layout`)에 둔다 |

---

## 9. 여기까지가 설정, 그 밖은 코드

아래는 **설정으로 흡수하지 않는다.** 이런 서버를 만나면 `src/shared/auth` 를 그 프로젝트에서
고쳐 쓰는 편이 낫다. 억지로 설정으로 우회하면 다음 사람이 더 헤맨다.

- JWT 가 아니라 **세션 쿠키**를 쓰는 서버
- **SSO 리다이렉트**로 토큰을 받는 서버 (로그인 화면 자체가 없는 경우)
- `Authorization` 이 아니라 **커스텀 헤더**(`X-Auth-Token` 등)를 요구하는 서버
- 요청마다 **서명·암호화**를 요구하는 서버

고쳐 쓰기로 했다면 **무엇을 왜 고쳤는지 프로젝트 문서에 남긴다.** 스캐폴드 새 버전을 반입할 때
그 기록이 없으면 덮어써 버린다.

**그리고 스캐폴드 담당에게 알린다.** 설정으로 흡수했어야 할 것을 코드로 고쳤다면
그건 스캐폴드에 확장 지점이 빠진 것이고, 다음 프로젝트도 같은 자리에서 막힌다.

---

## 부록 A. 파일 소유권

스캐폴드는 한 번 주고 끝나는 물건이 아니다. 새 버전을 다시 받을 수 있으므로
**덮어써도 되는 것과 우리 것이 갈려 있어야 한다.**

| | 경로 | |
|---|---|---|
| **스캐폴드 소유** | `src/shared/auth/**` | 열지 않는다. 새 버전으로 덮어써도 안전 |
| | `src/types/auth.ts` | 인증 모듈이 쓰는 형태 |
| **이 프로젝트 소유** | `.env` | 주소 · 저장소 키 |
| | `src/config/auth.config.ts` | 설정 + 확장 지점 (**지우지 않는다**) |
| | `src/domains/auth/**` | 타입 · 로그인 화면 · 라우트 — 이 문서에서 만든 것 전부 |
| | `src/shared/router/index.tsx` | 보호할 라우트 |
| | `src/main.tsx` | 부팅 배선 |

`src/domains/auth/**` 는 **전부 프로젝트 소유다.** 스캐폴드가 예제를 넣어주지 않으므로
새 버전을 반입해도 이 폴더는 충돌하지 않는다.

## 부록 B. 안 될 때

| 증상 | 원인 | 조치 |
|---|---|---|
| 로그인은 200 인데 그 뒤 모든 요청이 401 | `extractAccessToken` 이 응답과 안 맞다 | 콘솔에 "accessToken 을 꺼내지 못했습니다" 가 뜨면 확실하다. 응답 body 를 보고 키를 맞춘다 |
| 404 가 난다 | 경로 조합이 틀렸다 | `VITE_API_BASE_URL` + `endpoints.*` 를 Network 탭의 실제 URL 과 대조 |
| 로그인 화면 대신 404 | `loginPath` 가 가리키는 라우트가 없다 | §3.5 를 먼저 한다 |
| 무한 리다이렉트 | `/auth` 가 `ProtectedRoute` 안에 있다 | 게이트 바깥으로 뺀다 |
| 무한 갱신 루프 | 서버가 갱신 엔드포인트에 인증 미들웨어를 걸었다 | 서버 담당에게 (1번 요구 조건) |
| 로그인 실패인데 화면이 튄다 | 서버가 로그인 실패에 401 이 아닌 다른 코드를 준다 | 서버 담당에게 확인 |
| 새로고침하면 로그아웃된다 | `cookie` 전략인데 쿠키가 안 온다 | CORS · 쿠키 속성 확인 (7번 요구 조건) |
| 새로고침마다 로그인 폼이 번쩍인다 | `bootAuth()` 가 렌더 뒤에 있다 | 렌더 전에 await |
| 탭 두 개를 켜두면 가끔 로그아웃된다 | 동시 갱신이 회전에 걸렸다 | 서버에 유예 요청 (6번 질문) |
| `hasRole()` 이 항상 false | `resolveRoles` 가 없거나 권한 이름이 다르다 | 콘솔에 사유가 찍힌다 |
| 사용자 이름이 안 나온다 | `extractUser` 매핑이 안 맞다 | 응답 body 와 `IAppUser` 를 대조 |
