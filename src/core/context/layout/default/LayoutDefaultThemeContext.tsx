import { createContext } from 'react';

export type Theme = 'light' | 'dark';

type LayoutDefaultThemeContextType = {
	theme: Theme;
	toggleTheme: () => void;
	setTheme: (theme: Theme) => void;
};

export const LayoutDefaultThemeContext = createContext<LayoutDefaultThemeContextType | undefined>(undefined);
