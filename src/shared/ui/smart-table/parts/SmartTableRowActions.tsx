/**
 * 행 액션 컬럼 래퍼
 *
 * renderRowActions가 반환한 노드를 우측 정렬로 감쌉니다. 행 클릭 전파를 막습니다.
 */
export interface ISmartTableRowActionsProps {
	children: React.ReactNode;
}

export default function SmartTableRowActions({ children }: ISmartTableRowActionsProps): React.ReactNode {
	return (
		<div
			className="flex justify-end"
			onClick={(e) => e.stopPropagation()}
		>
			{children}
		</div>
	);
}
