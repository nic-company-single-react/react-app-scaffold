import { Toaster } from '@axiom/components/ui';
import { useTheme } from '@/core/hooks/theme/useTheme';

/**
 * 앱 전역 토스트 호스트.
 *
 * sonner의 <Toaster/> 는 앱 트리에 "딱 한 번" 마운트되어야 toast(...) 호출이 화면에 그려진다.
 * 이 프로젝트는 그 마운트를 AppProviders(전역 Provider 조립부)에서 관리한다. — UIDialogHost 와 동일한 성격.
 *
 * 테마 연결: shared 의 Toaster(sonner.tsx)는 기본적으로 next-themes 의 useTheme 를 읽지만,
 * 이 앱의 다크 모드는 next-themes 가 아니라 커스텀 ThemeProvider(.dark 클래스 토글)로 동작한다.
 * 그래서 여기서 앱 테마(useTheme)를 직접 읽어 theme prop 으로 넘겨(= sonner 내부 기본값을 덮어씀)
 * 토스트가 앱 다크 모드를 그대로 따르게 한다.
 */
export function AppToaster(): React.ReactNode {
	const { theme } = useTheme();
	return <Toaster theme={theme} />;
}
