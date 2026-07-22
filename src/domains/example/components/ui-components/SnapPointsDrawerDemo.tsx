import { useState } from 'react';
import {
	Button,
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from '@axiom/components/ui';

/**
 * Drawer 의 snapPoints 데모.
 *
 * activeSnapPoint 를 제어하려면 상태가 필요해 별도 컴포넌트로 분리했다.
 * snapPoints 는 비율(0~1) 또는 "300px" 같은 px 문자열을 배열로 받는다.
 */
export default function SnapPointsDrawerDemo(): React.ReactNode {
	const [snap, setSnap] = useState<number | string | null>(0.35);

	return (
		<Drawer
			snapPoints={[0.35, 0.7, 1]}
			activeSnapPoint={snap}
			setActiveSnapPoint={setSnap}
		>
			<DrawerTrigger asChild>
				<Button variant="outline">스냅 시트 열기 (35% → 70% → 100%)</Button>
			</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>지도 검색 결과</DrawerTitle>
					<DrawerDescription>
						위로 드래그해 단계를 올려보세요. 현재 단계: <code className="font-mono">{String(snap)}</code>
					</DrawerDescription>
				</DrawerHeader>
				<div className="overflow-y-auto px-4 pb-4 space-y-2">
					{Array.from({ length: 15 }, (_, i) => (
						<div
							key={i}
							className="rounded-lg border border-gray-200 dark:border-gray-700 px-3 py-2 text-sm text-gray-600 dark:text-gray-400"
						>
							스타벅스 광화문{i + 1}호점 — 도보 {i + 2}분
						</div>
					))}
				</div>
			</DrawerContent>
		</Drawer>
	);
}
