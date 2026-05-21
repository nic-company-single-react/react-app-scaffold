# 디자인 시스템 + 퍼블리싱 워크플로우 구조 추가 플랜

## Context

현재 `react-app-scaffold`는 React 19 + TypeScript + Vite + Tailwind CSS v4 + shadcn/ui + Storybook 조합의 scaffold 프로젝트이다. 지금은 모든 스타일이 두 파일(`app.css` 136줄, `layout/default/layout.css` 787줄)에 집중되어 있으며, `layout.css` 첫 줄에도 "토큰/theme/utility가 섞여 있으니 분리하는 게 좋다"는 주석이 이미 달려 있다.

목표는 세 가지:
1. CSS를 역할별로 5개 레이어로 분리 — 퍼블리셔·개발자가 각자 맡은 레이어만 수정하게 한다
2. `src/publishing/` 스테이징 공간 신설 — 퍼블리셔 마크업 결과물의 기준 위치를 만든다
3. Storybook에 디자인 토큰 문서 페이지 추가 — 색상·타이포·그림자 팔레트를 시각화한다

---

## 구현 계획

### Phase 1 — 토큰 파일 생성 (layout.css @theme 블록 분리)

`src/assets/styles/layout/default/layout.css` 의 `@theme { }` 블록(라인 7–158)을 아래 파일로 추출한다. layout.css의 해당 블록은 제거하고, 대신 각 tokens 파일을 import한다.

**생성할 파일:**

`src/assets/styles/tokens/colors.css`
- `@theme { }` 안에 `layout.css` 의 `--color-*` 전체 이동
- 포함: current, transparent, white, black, brand(12단계), blue-light(10단계), gray(12단계+dark), orange(10단계), success(10단계), error(10단계), warning(10단계), theme-pink-500, theme-purple-500

`src/assets/styles/tokens/typography.css`
- `@theme { }` 안에 `--font-*`, `--breakpoint-*`, `--text-title-*`, `--text-theme-*` 이동

`src/assets/styles/tokens/shadows.css`
- `@theme { }` 안에 `--shadow-theme-*`, `--shadow-datepicker`, `--shadow-focus-ring`, `--shadow-slider-navigation`, `--shadow-tooltip`, `--drop-shadow-4xl` 이동

`src/assets/styles/tokens/spacing.css`
- `@theme { }` 안에 `--z-index-*` 이동

---

### Phase 2 — 테마 파일 생성 (app.css 시맨틱 변수 분리)

`app.css`의 `:root { }`, `.dark { }`, `@theme inline { }` 블록을 테마 파일로 이동한다.

**생성할 파일:**

`src/assets/styles/themes/theme-default.css`
- `app.css` 의 `@theme inline { }` 블록 전체 이동 (shadcn 시맨틱 색상 → Tailwind 유틸 연결)
- `app.css` 의 `:root { }` 블록 전체 이동 (라이트 테마)
- `app.css` 의 `.dark { }` 블록 전체 이동 (다크 테마)
- 상단에 주석: "프로젝트 투입 시 이 파일을 복사해 `theme-[project].css`로 만들고 변수만 override"

`src/assets/styles/themes/theme-example-project.css`
- 예시 전용 파일 (실제 투입 때 참고용)
- `:root`에서 `--primary`, `--ring`을 `var(--color-brand-500)`으로 override하는 예시만 포함
- 파일 전체를 주석으로 설명

---

### Phase 3 — 베이스 파일 생성 (layout.css @layer base / @utility 분리)

`layout/default/layout.css` 의 `@layer base`(라인 168–183), `@utility` 블록(라인 185–), `@layer utilities`를 분리한다.

**생성할 파일:**

`src/assets/styles/base/reset.css`
- `layout.css` `@layer base` 안의 `*` (border-color 호환 리셋) + `button` cursor 규칙 이동

`src/assets/styles/base/typography.css`
- `layout.css` `@layer base` 안의 `body` 규칙 이동
- `app.css` `@layer base` 의 `*`, `body`, `html` 규칙과 합산 (body는 두 파일 내용 병합)
  - 최종 body: `@apply bg-gray-50 text-foreground relative font-normal font-outfit z-1;`

`src/assets/styles/base/utilities.css`
- `layout.css` 의 `@utility menu-item*`, `menu-dropdown-*`, `no-scrollbar`, `custom-scrollbar` 전체 이동
- `layout.css` 의 `@layer utilities` (input date 브라우저 아이콘 제거) 이동

`src/assets/styles/base/layout.css`
- 현재는 빈 파일로 생성 (향후 전역 레이아웃 헬퍼 클래스 추가 공간)

---

### Phase 4 — layout.css 정리

추출 완료 후 `layout/default/layout.css`에는 아래만 남긴다:
- 서드파티 라이브러리 오버라이드 (ApexCharts, jVectorMap, Flatpickr, FullCalendar, Swiper, Simplebar) — 라인 ~300 이후
- `tableCheckbox`, `taskCheckbox`, `.task` 등 컴포넌트 단위 커스텀 스타일
- `.dark .custom-scrollbar` 다크모드 스크롤바 override

파일 상단 주석을 업데이트: "@theme, @layer base, @utility 블록은 각각 tokens/, base/ 로 분리됨"

---

### Phase 5 — app.css 리팩토링 (순수 @import 진입점으로)

`app.css`를 아래 구조의 순수 import manifest로 교체한다:

```css
/* app.css — CSS 진입점. 선언은 이 파일에 두지 않는다. */

/* 1. External */
@import url('https://fonts.googleapis.com/...');
@import 'tailwindcss';
@import 'tw-animate-css';          /* 중복 import 제거 (기존 버그) */
@import 'shadcn/tailwind.css';
@import '@fontsource-variable/geist';

/* 2. Design Tokens */
@import './tokens/colors.css';
@import './tokens/typography.css';
@import './tokens/shadows.css';
@import './tokens/spacing.css';

/* 3. Theme */
@import './themes/theme-default.css';
/* @import './themes/theme-[project].css'; ← 프로젝트 투입 시 주석 해제 */

/* 4. Base */
@import './base/reset.css';
@import './base/typography.css';
@import './base/layout.css';
@import './base/utilities.css';

/* 5. Layout */
@import './layout/default/layout.css';

/* @custom-variant은 Tailwind v4에서 반드시 루트 파일에 있어야 함 */
@custom-variant dark (&:is(.dark *));
```

**주의사항:**
- `@custom-variant dark`는 반드시 `app.css`에 직접 위치 (import된 파일 안에 넣으면 dark: variant가 생성 안 됨)
- `tw-animate-css`는 기존 app.css에 중복 import되어 있음 → 한 번만 import

---

### Phase 6 — 퍼블리싱 폴더 신설

```
src/publishing/
├── README.md                        ← 퍼블리셔 → 개발자 워크플로우 가이드
├── templates/
│   └── example/
│       ├── index.html               ← 전체 페이지 마크업 예시
│       └── style.css                ← 페이지 단위 커스텀 CSS
└── components/
    └── example/
        ├── ExampleCard.html         ← 컴포넌트 단위 마크업 스니펫
        └── ExampleCard.css          ← 컴포넌트 커스텀 CSS
```

**README.md 포함 내용:**
1. 퍼블리셔 작업 방법: 마크업은 `templates/` 또는 `components/`에, Tailwind 유틸 클래스 사용 기준
2. 미리보기 방법: `npm run dev` 후 dev server URL의 CSS를 링크하거나, `dist/` 빌드 후 복사
3. 토큰 참조: Storybook `Getting Started/Design Tokens` 페이지 링크
4. 개발자 핸드오프: `templates/` HTML → JSX 변환, `components/` HTML → shared/domains 컴포넌트화
5. 네이밍 규칙

**index.html 예시:** brand 색상 클래스(`bg-brand-500`), 타이포 클래스(`text-title-sm`), 그림자(`shadow-theme-md`), 시맨틱 클래스(`bg-background`) 실제 사용 예시가 담긴 대시보드 카드

---

### Phase 7 — Storybook 디자인 토큰 문서 페이지

`src/__stories__/_docs/DesignTokens.stories.tsx` 생성

**4개의 Story:**

1. `Colors` — 색상 팔레트 시각화
   - 컬러 그룹: brand, gray, success, error, warning, orange, blue-light, theme-pink/purple
   - 시맨틱 컬러: --background, --foreground, --primary, --secondary, --muted, --accent, --destructive, --border 등
   - 각 스와치: 색상 박스 + 변수명 + 실제 CSS 계산값 (getComputedStyle로 런타임 읽기)

2. `Typography` — 타이포 스케일 시각화
   - title 계열 (2xl~sm) + theme 계열 (xl, sm, xs)
   - 각 행: 토큰명 / 폰트 크기 / 라인 높이 / "The quick brown fox" 샘플 텍스트

3. `Shadows` — 그림자 예시
   - shadow-theme-xs/sm/md/lg/xl, shadow-focus-ring, shadow-tooltip
   - 흰 박스에 각 그림자 적용

4. `Spacing` — z-index 스케일
   - z-index-1 ~ z-index-999999 시각 표

**Meta 설정:**
```tsx
title: 'Getting Started/Design Tokens',
tags: ['autodocs'],
parameters: { layout: 'fullscreen' }
```

**preview.ts storySort 업데이트:**
```ts
order: ['Getting Started', ['소개', 'Design Tokens'], 'UI Components', [...], 'Functions', '*']
```

---

## 수정되는 기존 파일

| 파일 | 변경 내용 |
|------|-----------|
| `src/assets/styles/app.css` | @import manifest로 교체, tw-animate-css 중복 제거 |
| `src/assets/styles/layout/default/layout.css` | @theme, @layer base, @utility 블록 제거 후 서드파티 오버라이드만 남김 |
| `.storybook/preview.ts` | storySort order에 'Design Tokens' 추가 |

## 신규 생성 파일

```
src/assets/styles/tokens/colors.css
src/assets/styles/tokens/typography.css
src/assets/styles/tokens/shadows.css
src/assets/styles/tokens/spacing.css
src/assets/styles/themes/theme-default.css
src/assets/styles/themes/theme-example-project.css
src/assets/styles/base/reset.css
src/assets/styles/base/typography.css
src/assets/styles/base/layout.css
src/assets/styles/base/utilities.css
src/publishing/README.md
src/publishing/templates/example/index.html
src/publishing/templates/example/style.css
src/publishing/components/example/ExampleCard.html
src/publishing/components/example/ExampleCard.css
src/__stories__/_docs/DesignTokens.stories.tsx
```

---

## 검증 방법

1. **빌드 검증:** `npm run dev` 실행 후 브라우저에서 기존 페이지 렌더링 확인 (색상, 레이아웃 깨짐 없음)
2. **토큰 검증:** DevTools 콘솔에서 `getComputedStyle(document.documentElement).getPropertyValue('--color-brand-500')` 실행 → `#465fff` 반환
3. **Tailwind 유틸 검증:** 임의 요소에 `class="bg-brand-500 text-title-sm shadow-theme-md"` 적용 후 스타일 반영 확인
4. **Storybook 검증:** `npm run storybook` 후 `Getting Started/Design Tokens` 스토리 4개 렌더링 확인
5. **서드파티 오버라이드 검증:** Flatpickr, FullCalendar 스타일이 여전히 layout.css에서 적용되는지 확인
