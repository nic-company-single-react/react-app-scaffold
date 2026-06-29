/**
 * 로딩 스켈레톤 행 (서버 모드 fetch 중)
 */
import { Skeleton, TableCell, TableRow } from '@axiom/components/ui';

export interface ISmartTableSkeletonProps {
	rows: number;
	colSpan: number;
}

export default function SmartTableSkeleton({ rows, colSpan }: ISmartTableSkeletonProps): React.ReactNode {
	return (
		<>
			{Array.from({ length: rows }).map((_, r) => (
				<TableRow
					key={r}
					className="hover:bg-transparent"
				>
					{Array.from({ length: colSpan }).map((__, c) => (
						<TableCell key={c}>
							<Skeleton className="h-4 w-full" />
						</TableCell>
					))}
				</TableRow>
			))}
		</>
	);
}
