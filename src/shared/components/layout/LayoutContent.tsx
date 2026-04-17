import { Outlet } from 'react-router';

export default function LayoutContent(): React.ReactNode {
	return (
		<div className="p-4 mx-auto max-w-(--breakpoint-2xl) md:p-6">
			루트 레이아웃!!
			<Outlet />
		</div>
	);
}
