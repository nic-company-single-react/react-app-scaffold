import { QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { getQueryClient } from '../../query';
import { type ReactNode, useState } from 'react';

interface QueryProviderProps {
	children: ReactNode;
}

export function QueryProvider({ children }: QueryProviderProps) {
	// useState로 QueryClient를 초기화하여 React 생명주기와 동기화.
	// 전역(window.__TANSTACK_QUERY_CLIENT__) 등록은 getQueryClient() 내부에서 처리됨(Devtools Extension 인식용).
	const [queryClient] = useState(() => getQueryClient());

	return (
		<QueryClientProvider client={queryClient}>
			{children}
			{import.meta.env.DEV && !import.meta.env.STORYBOOK && <ReactQueryDevtools initialIsOpen={false} />}
		</QueryClientProvider>
	);
}
