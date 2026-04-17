import { createRoot } from 'react-dom/client';
import { AppProviders } from '@/core/common/providers/AppProviders';
import App from './App.tsx';
import './assets/styles/app.css';

createRoot(document.getElementById('root')!).render(
	<AppProviders>
		<App />
	</AppProviders>,
);
