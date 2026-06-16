import { useState, useEffect, useCallback } from 'react';
import { LayoutDefaultThemeContext, type Theme } from '@/core/context/layout/default/LayoutDefaultThemeContext';

export interface IThemeProviderProps {
	children: React.ReactNode;
}

const STORAGE_KEY = 'theme';

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return 'light';

	const stored = window.localStorage.getItem(STORAGE_KEY);
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function LayoutDefaultThemeProvider({ children }: IThemeProviderProps): React.ReactNode {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle('dark', theme === 'dark');
		window.localStorage.setItem(STORAGE_KEY, theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
	}, []);

	return (
		<LayoutDefaultThemeContext.Provider
			value={{
				theme,
				toggleTheme,
				setTheme,
			}}
		>
			{children}
		</LayoutDefaultThemeContext.Provider>
	);
}
