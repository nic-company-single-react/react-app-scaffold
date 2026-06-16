import { Outlet } from 'react-router';
import { useSidebar } from './hooks/useSidebar';
import AppSidebar from './components/AppSidebar';
import Backdrop from './components/Backdrop';
import AppHeader from './components/AppHeader';

export default function RootLayoutContent(): React.ReactNode {
	const { isExpanded, isHovered, isMobileOpen } = useSidebar();

	// Layout 구조는 프로젝트 상황에 따라 변경하여 사용합니다.
	return (
		<div className="min-h-screen xl:flex bg-gray-50 dark:bg-gray-950">
			<div>
				<AppSidebar />
				<Backdrop />
			</div>
			<div
				className={`flex-1 transition-all duration-300 ease-in-out ${
					isExpanded || isHovered ? 'lg:ml-72.5' : 'lg:ml-22.5'
				} ${isMobileOpen ? 'ml-0' : ''}`}
			>
				<AppHeader />
				<div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
					<Outlet />
				</div>
			</div>
		</div>
	);
}
