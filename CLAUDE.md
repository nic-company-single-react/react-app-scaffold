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

## 라우팅

- `createHashRouter`를 사용한다 (URL이 `/#/...` 형태).
- 따라서 페이지 내 앵커 이동에 `<a href="#id">`를 쓰면 라우트 해시가 깨진다.
  대신 `document.getElementById(id)?.scrollIntoView(...)` 같은 방식으로 직접 스크롤한다.
