import type { Preview, ReactRenderer } from '@storybook/react-vite';
import type { DecoratorFunction } from 'storybook/internal/types';
import { createElement } from 'react';
import { QueryProvider } from '../src/core/providers/query-client/QueryProvider';
import '../src/assets/styles/app.css';

const withQueryProvider: DecoratorFunction<ReactRenderer> = (Story) =>
	createElement(QueryProvider, null, createElement(Story));

const preview: Preview = {
	decorators: [withQueryProvider],
	parameters: {
		controls: {
			matchers: {
				color: /(background|color)$/i,
				date: /Date$/i,
			},
		},
		a11y: {
			test: 'todo',
		},
	},
};

export default preview;
