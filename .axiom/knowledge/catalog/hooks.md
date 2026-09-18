---
title: react-app-scaffold 공통 훅 목록
version: "1.0"
tags: [훅, 훅목록, 훅 목록, hook, hooks, 커스텀훅, custom-hook, 공통훅, 제공하는훅, 사용가능한훅, 어떤훅,
       useapi, usetheme, usesidebar, use-api, 훅종류, 훅리스트, hook-list, 훅뭐있어]
scope: scaffold
related: [patterns/use-api.md, patterns/use-api-example.md, catalog/overview.md]
---

# 공통 훅 목록 (react-app-scaffold)

react-app-scaffold가 기본 제공하는 커스텀 훅이다. 업무 개발자가 직접 쓰는 것은 **`useApi`** 가 핵심이며, 나머지는 테마·레이아웃 전용이다.

| 훅 | import | 용도 | 상세 |
|----|--------|------|------|
| `useApi` | `@axiom/hooks` | TanStack Query 기반 데이터 조회/변경(쿼리·뮤테이션). 앱 개발자용 표준 API 훅 | [use-api.md](../patterns/use-api.md) |
| `useTheme` | `@/core/hooks/theme/useTheme` | 라이트/다크 테마 상태·토글 (`ThemeProvider` 하위에서만) | — |
| `useSidebar` | (레이아웃 내부) `../hooks/useSidebar` | 사이드바 열림·서브메뉴 상태. 레이아웃 컴포넌트 전용 | — |

> ⛔ React 기본 훅(`useState`·`useEffect`·`useCallback`·`useMemo`)은 스캐폴드 제공이 아니라 React 표준이다.

## useApi — 데이터 조회/변경 (앱 개발자 표준)

**시그니처는 `useApi<T>(endpoint, options?)` 다 — 엔드포인트가 첫 번째 인자다.**

```ts
import { useApi } from '@axiom/hooks';

// 조회(GET) — TanStack Query useQuery 래핑. options를 생략하면 GET이다.
const { data, isLoading, refetch } = useApi<IUser[]>('/api/users');

// 변경(POST/PUT/DELETE) — method를 주면 useMutation 래핑이 된다.
const { mutate, isPending } = useApi<IUser, ICreateUserBody>('/api/users', {
  method: 'POST',
  onSuccess: () => { /* invalidate 등 */ },
});
```

> ⛔ **`useApi({ method, url })` 처럼 객체 하나로 부르지 않는다.** 그렇게 쓰면 `TS2345`
> (`Argument of type '{ … }' is not assignable to parameter of type 'string'`)가 난다.
> 오버로드 선언은 [use-api.ts](../scaffold-source/use-api.ts.md) 에 그대로 있다.

- `queryKey`는 **넘기지 않는다.** 훅이 엔드포인트와 params로 알아서 만든다(`createQueryKey`).
- 타입: `IUseApiQueryOptions`, `IUseApiMutationOptions` (`@axiom/hooks`에서 export)
- 자세한 계약·예제는 [use-api.md](../patterns/use-api.md), [use-api-example.md](../patterns/use-api-example.md) 참고.

## useTheme — 테마 상태

```ts
import { useTheme } from '@/core/hooks/theme/useTheme';

const { theme, toggleTheme, setTheme } = useTheme();
// theme: 'light' | 'dark'
// toggleTheme(): 라이트↔다크 전환
// setTheme('dark'): 명시적 지정
```

- 반드시 `ThemeProvider` 하위에서 호출(아니면 throw). 보통 `ThemeToggleButton` 등 레이아웃 컴포넌트에서 사용.

## useSidebar — 사이드바 상태 (레이아웃 전용)

```ts
import { useSidebar } from '../hooks/useSidebar';

const {
  openSubmenu, toggleSidebar, toggleMobileSidebar,
  setIsHovered, setActiveItem, toggleSubmenu,
} = useSidebar();
```

- `SidebarProvider` 하위 레이아웃(`AppHeader`·`AppSidebar` 등) 내부에서만 사용한다. 업무 페이지에서 직접 쓸 일은 거의 없다.
