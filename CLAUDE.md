# 프로젝트 작업 규칙

이 파일은 레포에 커밋되어 모든 작업 환경(다른 PC 포함)에서 공유되는 코딩 컨벤션입니다.

## 폴더 구조 규칙

### 도메인 pages / components 분리

각 도메인(`src/domains/<domain>/`)에서:

- **`pages/`** — 페이지(라우트 대상) 컴포넌트만 둔다.
- **`components/`** — 페이지 내부에서 사용하는 보조 컴포넌트는 여기에 별도 파일로 생성한다.
- 페이지 파일 안에 보조 컴포넌트를 인라인으로 정의하지 않는다.
- `components/` 하위는 `pages/`의 경로 구조를 그대로 미러링한다.
  - 예: `pages/utils/NumberUtil.tsx`의 내부 컴포넌트 → `components/utils/Field.tsx`, `components/utils/ResultBox.tsx`, `components/utils/DemoCard.tsx`

### 컴포넌트 작성 컨벤션

- props 타입은 `export interface I<Component>Props` 형태로 내보낸다.
- 컴포넌트는 `export default function`으로 작성한다.
- 참고 예시: `src/domains/example/components/ui-components/ExCard.tsx`, `SectionHeader.tsx`

## 스타일(CSS Module) 배치 규칙

핵심 원칙: **파일명 = 소비 주체의 이름, 위치 = 소비 주체 바로 옆(co-location).**
`*.module.css`는 스코프가 특정 컴포넌트/페이지 하나에 묶이므로, 그것을 `import` 하는 파일 옆에 둔다.

스타일이 필요할 때 아래 순서로 판단한다.

1. **사소한 스타일** — Tailwind 유틸리티 클래스를 `className`에 인라인한다. module 파일을 만들지 않는다.
2. **떼어낼 수 있는 UI 조각** — 컴포넌트로 추출하고, 스타일은 그 **컴포넌트 파일 바로 옆**에 둔다.
   - 파일명은 **컴포넌트 이름과 동일**하게 한다.
   - 예: `components/ui-components/TransactionDetailAccordion.tsx` → 같은 폴더에 `TransactionDetailAccordion.module.css`, import는 `./TransactionDetailAccordion.module.css`.
   - ⚠️ 스타일을 소비 컴포넌트가 아닌 다른 폴더(예: 페이지 폴더)에 두지 않는다. 소비자와 스타일 소유주가 어긋나면 역의존이 생긴다.
3. **순수 그 페이지 전용 스타일** — 재사용 컴포넌트로 뺄 성질이 아니라 그 페이지의 레이아웃 자체에만 해당하면, **페이지 파일 바로 옆**에 둔다.
   - 파일명은 **페이지 이름과 동일**하게 한다. (컴포넌트명이 아니라 페이지명 기준)
   - 예: `pages/ui-components/AccordionComponent.tsx` → 같은 폴더에 `AccordionComponent.module.css`.
   - 이 경우 소비자(page) = 소유주(page)로 일치하므로 `pages/`에 css가 있어도 정당하다.
4. **여러 컴포넌트가 공유하는 도메인 공용 스타일** — 비-scoped 공용 변수·클래스·테마 등은 `src/domains/<domain>/common/styles/`에 모은다. (도메인 최상위에 별도 `style/` 폴더를 신설하지 않는다)

전역 토큰·테마·리셋은 이 규칙 대상이 아니며 기존대로 `src/assets/styles/`에 둔다.

다크 모드는 앱 규칙(`.dark` 클래스, `&:is(.dark *)`)에 맞춰 CSS Module에서 `:global(.dark) .클래스` 형태로 처리한다.

## 라우팅

- `createHashRouter`를 사용한다 (URL이 `/#/...` 형태).
- 따라서 페이지 내 앵커 이동에 `<a href="#id">`를 쓰면 라우트 해시가 깨진다.
  대신 `document.getElementById(id)?.scrollIntoView(...)` 같은 방식으로 직접 스크롤한다.
