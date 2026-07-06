import type { Theme } from '@/core/context/theme/ThemeContext';

/**
 * 테마(라이트/다크) 설정.
 *
 * storageKey 는 index.html 의 FOUC 방지 스크립트와 ThemeProvider 가 함께 사용합니다.
 * 두 곳이 같은 키를 봐야 "React 마운트 전 미리 적용 → React 가 이어받아 관리"가 매끄럽게 이어지므로,
 * 값의 출처를 .env(VITE_THEME_STORAGE_KEY) 하나로 통일했습니다.
 *   - index.html : %VITE_THEME_STORAGE_KEY% (Vite HTML 치환)
 *   - TS(ThemeProvider) : import.meta.env.VITE_THEME_STORAGE_KEY (이 파일 경유)
 *
 * SI 프로젝트에서 테마 저장 키/기본 테마를 바꿀 때는 이 파일(또는 .env)만 수정하세요. (core 불가침)
 */
export interface ThemeConfig {
	/** 테마를 저장/조회할 localStorage 키 이름 (.env 의 VITE_THEME_STORAGE_KEY) */
	storageKey: string;
	/** window 가 없을 때(SSR 등) 사용할 기본 테마 */
	defaultTheme: Theme;
	/** 다크 모드일 때 <html> 에 붙이는 클래스 이름 (Tailwind dark: 변형과 연동) */
	darkClassName: string;
}

export const themeConfig: ThemeConfig = {
	storageKey: import.meta.env.VITE_THEME_STORAGE_KEY,
	defaultTheme: 'light',
	darkClassName: 'dark',
};
