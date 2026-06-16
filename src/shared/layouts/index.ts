// ★ 활성 레이아웃 선택 지점
// 새 사이트는 ./default 를 복제한 폴더(예: ./peoplify)를 만든 뒤, 아래 3곳을 함께 교체하면
// 사이트 전체(구조+스타일+테마)가 통째로 바뀝니다.
//   1) 이 파일:                      ./default → ./<name>           (레이아웃 컴포넌트)
//   2) assets/styles/app.css:        ./layout/default/layout.css → ./layout/<name>/layout.css  (서드파티 오버라이드)
//   3) assets/styles/app.css:        ./themes/theme-default.css  → ./themes/theme-<name>.css   (색상 테마, 둘 중 하나만)
// 예) peoplify 로 전환: (1) './peoplify' (2) './layout/peoplify/layout.css' (3) './themes/theme-peoplify.css'
export { default as RootLayout } from './default';
