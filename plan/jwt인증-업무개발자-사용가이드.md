# JWT 인증 — 업무 개발자 사용 가이드

> **대상:** 이 프로젝트에서 업무 화면을 개발하는 사람. 인증 세팅은 공통 개발자가 이미 끝내 두었다.
> **한 줄 요약:** 인증을 위해 여러분이 짜야 할 코드는 **거의 없다.** 아래 셋만 필요할 때 꺼내 쓴다.

---

## 30초 요약

```
로그인 화면      /#/auth/login
개발용 계정      공통 개발자가 공지한다 (서버 계정이다)

필요할 때만 쓰는 것 세 개
  useAuth()       로그인한 사용자 · 권한 확인
  useLogout()     로그아웃 버튼
  ProtectedRoute  화면을 로그인 필수로 (라우터 설정)

API 호출은 평소대로. 인증 관련 코드는 한 줄도 넣지 않는다.
```

전부 `@/shared/auth` 에서 가져온다.

```ts
import { useAuth, useLogout } from '@/shared/auth';
```

---

## 1. 안 해도 되는 것

**이 장이 이 문서에서 가장 중요하다.** 아래는 전부 이미 되어 있다. 직접 짜면 오히려 깨진다.

| 하지 마세요 | 이미 이렇게 됩니다 |
|---|---|
| 요청에 토큰 붙이기 | 요청 인터셉터가 모든 요청에 `Authorization: Bearer …` 를 자동으로 붙인다 |
| `401` 분기 처리 | 자동으로 토큰을 갱신하고 **실패했던 요청을 다시 보낸다.** 호출한 쪽은 성공만 본다 |
| 로그인 상태를 자기 스토어에 만들기 | 앱 전역에 하나 있다. `useAuth()` 로 읽는다 |
| 새로고침 후 로그인 유지 처리 | 앱이 뜰 때 자동으로 복구한다 |
| 로그아웃할 때 캐시 지우기 | `useLogout()` 이 쿼리 캐시까지 정리한다 |
| 토큰 만료 시간 계산 · 미리 갱신 | 만료되면 알아서 갱신된다 |
| 화면마다 "로그인했나" 확인 | 보호된 라우트 안이면 이미 로그인된 상태다 |

### 이렇게 짜지 마세요

```tsx
// ❌ 토큰을 직접 붙이지 않는다
const token = localStorage.getItem('access_token');
const { data } = useApi('/orders', { headers: { Authorization: `Bearer ${token}` } });

// ❌ 401 을 직접 처리하지 않는다
try {
  await callApi('/orders');
} catch (e) {
  if (e.status === 401) {
    await refreshToken();      // 이미 자동으로 된다
    navigate('/auth/login');   // 이미 자동으로 간다
  }
}

// ❌ 로그인 상태를 또 만들지 않는다
const useMyAuthStore = defineStore({ name: 'my-auth', state: { isLogin: false } });
```

```tsx
// ✅ 그냥 이렇게 부르면 된다
const { data, isPending, error } = useApi<TOrder[]>('/orders');
```

> **401 을 직접 처리하면 왜 나쁜가** — 자동 갱신이 이미 돌고 있는데 화면이 또 갱신을 시도하면
> 갱신 요청이 두 번 나간다. 서버가 refresh token 을 회전시키는 구성이면 **두 번째가
> "이미 쓴 토큰"으로 걸려 그 계정이 통째로 로그아웃된다.**

---

## 2. 화면에서 쓰는 것

### 2.1 로그인한 사용자 보여주기 — `useAuth()`

```tsx
import { useAuth } from '@/shared/auth';
import type { IAppUser } from '@/domains/auth/types';

export default function OrderHeader(): React.ReactNode {
	const { user, isAuthenticated } = useAuth<IAppUser>();

	if (!isAuthenticated) return null;

	return <span>{user?.name} 님</span>;
}
```

`useAuth<IAppUser>()` 처럼 **타입을 넣어주면** `user.name` 이 자동완성된다.
`IAppUser` 는 `src/domains/auth/types.ts` 에 있고, **이 프로젝트 서버에 맞춰 정의된 타입**이다.

돌려주는 값:

| | |
|---|---|
| `user` | 로그인한 사용자. 비로그인이면 `null` |
| `isAuthenticated` | 로그인 여부 |
| `isRefreshing` | 토큰 갱신 중. 이때 화면을 내보내면 안 된다 |
| `status` | `idle` · `refreshing` · `authenticated` · `anonymous` |
| `hasRole(...)` | 권한 확인 (아래) |

> `status` 를 직접 봐야 할 일은 거의 없다. `isAuthenticated` 로 충분하다.

### 2.2 권한으로 감추기 — `hasRole()`

```tsx
const { hasRole } = useAuth();

return (
	<div>
		<button>조회</button>
		{hasRole('admin') && <button>삭제</button>}
	</div>
);
```

여러 개 중 하나라도 있으면 통과한다.

```tsx
{hasRole('admin', 'manager') && <ApprovalButton />}
```

**권한 이름은 프로젝트마다 다르다.** 이 프로젝트에서 쓰는 이름은 공통 개발자에게 확인한다.

> 화면 전체를 권한으로 막는 것은 §3 에서 다룬다. 버튼·메뉴 단위는 `hasRole` 이 맞다.

### 2.3 로그아웃 버튼 — `useLogout()`

```tsx
import { useLogout } from '@/shared/auth';

export default function LogoutButton(): React.ReactNode {
	const { logout, pending } = useLogout();

	return (
		<button
			type="button"
			onClick={logout}
			disabled={pending}
		>
			{pending ? '로그아웃 중…' : '로그아웃'}
		</button>
	);
}
```

- 서버에 알리고, 토큰을 지우고, 쿼리 캐시를 비우고, 로그인 화면으로 보낸다. **전부 자동이다.**
- 서버 호출이 실패해도 **화면은 반드시 로그아웃된다.** (서버가 죽었을 때 버튼이 안 먹으면 나갈 방법이 없으므로)
- `try/catch` 로 감쌀 필요가 없다. 던지지 않는다.

사용자 이름 + 로그아웃 버튼을 묶은 예제 코드가
[`jwt인증-공통개발자-적용가이드.md` §3.8](jwt인증-공통개발자-적용가이드.md) 에 있다.
대개 헤더에 이미 붙어 있으니, 화면마다 새로 만들기 전에 먼저 확인한다.

### 2.4 API 호출 — 평소대로

**인증 때문에 추가로 할 일이 없다.**

```tsx
import { useApi } from '@axiom/hooks';

// 조회
const { data, isPending, error, refetch } = useApi<TOrder[]>('/orders');

// 등록
const { mutate, isPending: isSaving } = useApi<TOrder, TOrderForm>('/orders', {
	method: 'POST',
	type: 'mutation',
});
```

토큰은 자동으로 붙는다. 토큰이 만료돼 있으면 **갱신 후 이 요청이 다시 실행되고**, 여러분은 그 사실을 모른 채 정상 응답을 받는다.

**`catch` / `error` 는 언제 도나** — 진짜 실패했을 때만이다. 예를 들어

- 서버가 400 · 404 · 500 을 준 경우 → 평소대로 처리한다
- 세션이 완전히 끝난 경우(갱신도 실패) → **이때는 이미 로그인 화면으로 이동 중이다.** 별도 처리가 필요 없다

### 2.5 예외 하나 — axios 를 안 타는 요청

파일 다운로드 링크나 WebSocket 처럼 `useApi` / `callApi` 를 안 쓰는 경로에서는 토큰이 자동으로 안 붙는다. **이때만** 직접 꺼내 쓴다.

```ts
import { getAccessToken } from '@/shared/auth';

const res = await fetch(`/api/files/${id}`, {
	headers: { Authorization: `Bearer ${getAccessToken()}` },
});
```

> 반대로 **토큰을 저장하거나 지우는 함수는 제공하지 않는다.** 보관 방식은 프로젝트 설정이
> 단독으로 결정하기 때문이다. 로그인·로그아웃이 필요하면 훅을 쓴다.

---

## 3. 내 화면을 로그인 필수로 만들기

라우터는 여러 사람이 함께 쓰는 파일이라 **보통 공통 개발자와 협의**한다. 방법은 아래와 같다.

`src/shared/router/index.tsx` 의 **보호 구간 `children` 안에** 라우트를 넣으면 끝이다.

```tsx
{
	element: <ProtectedRoute />,
	children: [
		{ path: '/', element: <RootLayout />, children: MainRouter },

		// ↓ 여기에 추가하면 로그인해야 들어올 수 있다
		{ path: '/orders', element: <RootLayout />, children: OrderRouter },
	],
},
```

화면 코드에는 **아무것도 추가하지 않는다.** 로그인 안 한 사람은 여기까지 오지 못한다.

### 권한까지 확인하려면

```tsx
{
	element: <ProtectedRoute roles={['admin']} />,
	children: [
		{ path: '/admin', element: <RootLayout />, children: AdminRouter },
	],
},
```

권한이 없으면 홈으로 보낸다. 다른 곳으로 보내려면 `forbiddenPath` 를 준다.

```tsx
<ProtectedRoute roles={['admin']} forbiddenPath="/no-permission" />
```

> 권한 부족을 **로그인 화면으로 보내지 않는다.** "다시 로그인하면 되나?"로 읽혀 사용자가 같은 자리를 맴돌기 때문이다.

### 로그인 없이도 보여야 하는 화면

보호 구간 **바깥**에 두면 된다. 로그인 화면(`/auth`)이 그렇게 되어 있다.

---

## 4. 개발 중 로그인하기

### 4.1 계정

**공통 개발자가 공지한 계정을 쓴다.** 개발 서버의 실제 계정이라 스캐폴드에 적혀 있지 않다.
`/#/auth/login` 에서 로그인하면 된다. 브라우저를 닫았다 열어도 유지된다.

계정을 못 받았다면 공통 개발자에게 요청한다. 직접 회원가입하거나 DB 를 건드리지 않는다.

### 4.2 Network 탭에 `refresh` 가 자꾸 보인다면

정상이다. access token 이 만료될 때마다 자동 갱신이 도는 것이고, 그게 이 모듈이 하는 일이다.

**토큰 수명은 서버가 정한다.** 프론트에서 바꿀 값이 아니니, 너무 잦아 개발에 방해가 되면
공통 개발자를 통해 서버 담당에게 요청한다.

### 4.3 콘솔 도구 (개발 모드 전용)

공통 개발자가 `registerAuthDevProbe()` 를 켜 두었다면 쓸 수 있다.

```js
// 자동 갱신이 도는지 눈으로 보기
await __auth.me();          // 토큰이 만료돼 있으면 me 401 → refresh 200 → me 200
await __auth.burst(5);      // 동시 401 이 갱신 1회로 묶이는지
```

> `fetch()` 로 직접 찔러보면 인터셉터를 타지 않아 자동 갱신이 안 일어난다. 확인하려면 위 도구를 쓴다.

`__auth` 가 없다고 나오면 프로브가 꺼져 있는 것이다. 공통 개발자에게 요청한다.

---

## 5. 자주 겪는 문제

| 증상 | 원인 | 조치 |
|---|---|---|
| 화면이 자꾸 로그인으로 튄다 | 세션이 끝났다(만료·다른 탭 로그아웃) | 다시 로그인. 반복되면 공통 개발자에게 |
| 로그인은 되는데 그다음 요청이 전부 401 | 서버 응답에서 토큰을 꺼내는 설정이 안 맞다 | **공통 개발자에게.** 화면 문제가 아니다 |
| 내 API 만 401 이 난다 | 그 API 가 서버에서 다른 인증을 요구하거나, 권한이 없다 | 서버 담당·공통 개발자에게 |
| 새로고침하면 로그인이 풀린다 | 부팅 복구가 안 되고 있다 | **공통 개발자에게.** 정상 동작이 아니다 |
| 로그인 화면이 새로고침 때마다 번쩍인다 | 부팅 복구 배선 문제 | **공통 개발자에게** |
| `user` 가 `null` 인데 로그인은 돼 있다 | 서버가 사용자 정보를 안 내려주거나 매핑이 안 맞다 | 공통 개발자에게 |
| `hasRole()` 이 항상 `false` | 권한 꺼내는 설정이 없거나 권한 이름이 다르다 | 콘솔에 사유가 찍힌다. 공통 개발자에게 |
| 로그아웃했는데 이전 데이터가 보인다 | 캐시를 자체적으로 들고 있다 | 직접 만든 전역 상태를 로그아웃 시 비운다 |

> 표의 **"공통 개발자에게"가 많은 것이 정상이다.** 인증 설정은 서버 계약과 맞물려 있어
> 업무 화면에서 고칠 수 있는 것이 아니다. 화면 코드를 고쳐서 우회하려 하지 마세요 —
> 우회 코드가 남으면 실서버가 붙을 때 더 찾기 어려워진다.

---

## 6. 이런 건 공통 개발자에게

| 요청 | 왜 |
|---|---|
| 사용자 정보에 필드 추가 (부서·사번 등) | 서버 응답 · 타입 · 매핑이 같이 바뀐다 |
| 새 권한 이름 추가 | 서버가 내려주는 값과 맞아야 한다 |
| 내 화면을 보호 라우트로 | 라우터는 공용 파일이다 |
| 로그인 후 특정 화면으로 보내기 | 인증 설정의 확장 지점에서 처리한다 |
| 로그인 직후 공통 데이터 미리 조회 | 같은 확장 지점에서 처리한다 |
| 세션 만료 안내 문구·모달 | 같은 확장 지점에서 처리한다 |

마지막 셋은 **모든 화면에 공통으로 걸리는 동작**이라, 화면마다 따로 짜면 프로젝트가 지저분해진다. 공통 개발자가 한 곳에서 처리한다.

---

## 부록 — 전체 예제

로그인한 사용자 표시 + 권한 버튼 + API 호출이 한 화면에 다 들어간 형태다.

```tsx
import { useApi } from '@axiom/hooks';
import type { IAppUser } from '@/domains/auth/types';
import { useAuth } from '@/shared/auth';

interface IOrder {
	id: number;
	title: string;
}

export default function OrderIndex(): React.ReactNode {
	const { user, hasRole } = useAuth<IAppUser>();

	// 인증 관련 코드 없음. 토큰도 401 처리도 자동이다.
	const { data: orders, isPending, error } = useApi<IOrder[]>('/orders');

	if (isPending) return <p>불러오는 중…</p>;
	if (error) return <p role="alert">주문을 불러오지 못했습니다.</p>;

	return (
		<div className="space-y-4 p-6">
			<h1 className="text-lg font-bold">주문 목록</h1>
			<p className="text-sm text-gray-600 dark:text-gray-400">{user?.name} 님이 조회 중</p>

			<ul className="space-y-1">
				{orders?.map((o) => <li key={o.id}>{o.title}</li>)}
			</ul>

			{hasRole('admin') && (
				<button
					type="button"
					className="rounded-md bg-red-600 px-3 py-2 text-sm text-white"
				>
					일괄 삭제 (관리자)
				</button>
			)}
		</div>
	);
}
```

**이 화면에서 인증을 위해 쓴 것은 `useAuth()` 한 줄뿐이다.** 나머지는 전부 자동이다.
