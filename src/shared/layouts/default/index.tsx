// default 레이아웃 진입점 ===============================
// 이 폴더(default/)는 자체 완결형 레이아웃 모듈입니다.
// context / providers / hooks / components / config 를 모두 내부에 소유하며,
// 새 사이트는 이 폴더를 통째로 복제해 수정한 뒤 ../index.ts 의 스위치만 교체합니다.
import RootLayoutContent from './RootLayoutContent';
import SidebarProvider from './providers/SidebarProvider';

interface IRootLayoutProps {
	//
}

export default function RootLayout({}: IRootLayoutProps): React.ReactNode {
	return (
		<SidebarProvider>
			<RootLayoutContent />
		</SidebarProvider>
	);
}
