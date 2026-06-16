# React App Scaffold

프로젝트 투입 시 곧바로 프론트엔드 작업을 시작할 수 있도록 라우팅·상태관리·UI 컴포넌트·디자인 토큰·테스트까지 갖춘 **React 스타터 프로젝트**입니다. 클론 → 의존성 설치 → 개발 서버 실행만으로 잘 정돈된 기본 화면이 뜨며, 여기서부터 사이트에 맞게 커스터마이징해 나가면 됩니다.

> 📖 **시작 가이드:** https://redsky02122.dothome.co.kr/guide/docs/started/getting-started/overview

## Quick Start

```bash
# 1. 저장소 클론
git clone <repository-url> my-app
cd my-app

# 2. 의존성 설치
npm install

# 3. 개발 서버 실행 (기본 포트 5173)
npm run dev
```

## 기본 탑재 스택

| 영역          | 스택                                                          |
| ------------- | ------------------------------------------------------------- |
| Core          | React 19, TypeScript, Vite                                    |
| 스타일        | Tailwind CSS v4, Design Token (Style Dictionary), 다크모드    |
| UI            | shadcn/ui, Radix UI / Base UI, lucide-react                   |
| 서버 상태     | TanStack Query (+ Devtools), axios                            |
| 클라이언트 상태 | Zustand                                                     |
| 라우팅        | React Router v7 (도메인 단위 구조)                            |
| 테이블/캐러셀 | TanStack Table, Embla / Swiper                                |
| 문서화        | Storybook 10 (a11y · docs 애드온)                             |
| 테스트        | Vitest (브라우저 모드), Playwright                            |
| 품질          | ESLint, Prettier                                              |

## 주요 스크립트

| 명령어                   | 설명                                          |
| ------------------------ | --------------------------------------------- |
| `npm run dev`            | 디자인 토큰 빌드 후 개발 서버 실행            |
| `npm run build`          | 타입 체크 후 프로덕션 빌드                     |
| `npm run preview`        | 빌드 결과물 로컬 미리보기                      |
| `npm run build:tokens`   | 디자인 토큰(Style Dictionary) 빌드            |
| `npm run lint`           | ESLint 검사                                   |
| `npm run lint:fix`       | ESLint 자동 수정                              |
| `npm run format`         | Prettier 포맷팅                               |
| `npm run storybook`      | Storybook 실행 (포트 6006)                    |
| `npm run build-storybook`| Storybook 정적 빌드                           |

## 디렉터리 구조

```
src/
├─ assets/          정적 리소스 · 글로벌 스타일 · 디자인 토큰 CSS
├─ core/            앱 공통 인프라 (api · router · query · providers · hooks · utils)
├─ design-tokens/   원시/시맨틱 디자인 토큰 정의 (Style Dictionary 소스)
├─ domains/         도메인 단위 화면
│  ├─ main/         메인(랜딩) 페이지
│  └─ example/      UI 컴포넌트 · API 사용 예제
├─ shared/          공통 레이아웃 · UI 컴포넌트(shadcn) · 라우터 · 유틸
├─ publishing/      퍼블리싱 작업용 공간
└─ __stories__/     Storybook 스토리 · 문서
```

## 커스터마이징 가이드

1. **랜딩 페이지** — [src/domains/main/pages/MainIndex.tsx](src/domains/main/pages/MainIndex.tsx)를 프로젝트에 맞게 교체합니다.
2. **네비게이션** — [src/shared/components/layout/default/config/navigation.tsx](src/shared/components/layout/default/config/navigation.tsx)에서 사이드바 메뉴를 정의합니다.
3. **도메인 추가** — `src/domains/<도메인>/` 아래에 `pages` · `router`를 만들고 라우터에 연결합니다.
4. **테마/토큰** — `src/design-tokens/`에서 색상·간격·타이포를 수정한 뒤 `npm run build:tokens`로 반영합니다.
5. **예제 정리** — 실제 개발을 시작하면 `src/domains/example` 등 데모 코드는 제거하거나 참고용으로만 남깁니다.

자세한 내용은 [시작 가이드 문서](https://redsky02122.dothome.co.kr/guide/docs/started/getting-started/overview)를 참고하세요.
