import type { ReactNode } from 'react';
import { QueryProvider } from './query-client/QueryProvider';
import ThemeProvider from './theme/ThemeProvider';
import { UIDialogHost } from '@/core/ui/UIDialogHost';
import { AppToaster } from '@/core/ui/AppToaster';

interface AppProvidersProps {
	children: ReactNode;
}

/**
 * 애플리케이션의 모든 Provider를 통합하는 컴포넌트
 *
 * 새로운 Provider 추가 시 이곳에서 관리합니다.
 * Provider 순서는 의존성을 고려하여 배치합니다.
 */
export function AppProviders({ children }: AppProvidersProps) {
	return (
		<ThemeProvider>
			<QueryProvider>
				{children}
				{/* 전역 $ui.alert / $ui.confirm 다이얼로그 호스트 */}
				<UIDialogHost />
				{/* 전역 토스트 호스트 — 어디서든 toast(...) 호출 시 여기로 렌더된다 */}
				<AppToaster />
			</QueryProvider>
		</ThemeProvider>
	);
}
