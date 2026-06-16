import { useContext } from 'react';
import { LayoutDefaultThemeContext } from '@/core/context/layout/default/LayoutDefaultThemeContext';

export const useTheme = () => {
	const context = useContext(LayoutDefaultThemeContext);
	if (!context) {
		throw new Error('useTheme must be used within a LayoutDefaultThemeProvider');
	}
	return context;
};
