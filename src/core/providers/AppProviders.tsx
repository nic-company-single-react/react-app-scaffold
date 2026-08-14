import type { ReactNode } from 'react';
import { TooltipProvider } from '@axiom/components/ui';
import { QueryProvider } from './query-client/QueryProvider';
import ThemeProvider from './theme/ThemeProvider';
import { UIHosts } from '@/core/ui/UIHosts';

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
				{/* 전역 Tooltip 지연 타이밍(delay/skipDelay)을 앱 전체가 공유하도록 최상위에 한 번만 둔다.
				    각 페이지에서는 Tooltip / TooltipTrigger / TooltipContent 만 쓰면 된다. */}
				<TooltipProvider delayDuration={200}>
					{children}
					{/* 전역 UI 호스트 묶음($ui.dialog 스택 / $ui.alert·confirm / 토스트).
					    호스트를 추가할 일이 있으면 이 파일이 아니라 UIHosts 안에 넣는다. */}
					<UIHosts />
				</TooltipProvider>
			</QueryProvider>
		</ThemeProvider>
	);
}
