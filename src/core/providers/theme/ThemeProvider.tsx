import { useState, useEffect, useCallback } from 'react';
import { ThemeContext, type Theme } from '@/core/context/theme/ThemeContext';
import { themeConfig } from '@/config';

export interface IThemeProviderProps {
	children: React.ReactNode;
}

function getInitialTheme(): Theme {
	if (typeof window === 'undefined') return themeConfig.defaultTheme;

	const stored = window.localStorage.getItem(themeConfig.storageKey);
	if (stored === 'light' || stored === 'dark') {
		return stored;
	}

	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

export default function ThemeProvider({ children }: IThemeProviderProps): React.ReactNode {
	const [theme, setThemeState] = useState<Theme>(getInitialTheme);

	useEffect(() => {
		const root = document.documentElement;
		root.classList.toggle(themeConfig.darkClassName, theme === 'dark');
		window.localStorage.setItem(themeConfig.storageKey, theme);
	}, [theme]);

	const setTheme = useCallback((next: Theme) => {
		setThemeState(next);
	}, []);

	const toggleTheme = useCallback(() => {
		setThemeState((prev) => (prev === 'dark' ? 'light' : 'dark'));
	}, []);

	return (
		<ThemeContext.Provider
			value={{
				theme,
				toggleTheme,
				setTheme,
			}}
		>
			{children}
		</ThemeContext.Provider>
	);
}
