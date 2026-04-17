import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/providers/AppProviders.tsx';
import App from './App.tsx';
import './assets/styles/app.css';

createRoot(document.getElementById('root')!).render(
	<AppProviders>
		<App />
	</AppProviders>,
);
