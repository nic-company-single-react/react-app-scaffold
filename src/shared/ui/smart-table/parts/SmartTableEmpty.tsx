/**
 * 빈 상태 / 에러 상태 셀
 */
import { TableCell, TableRow } from '@axiom/components/ui';
import { Inbox, TriangleAlert } from 'lucide-react';

export interface ISmartTableEmptyProps {
	colSpan: number;
	error?: boolean;
	emptyText?: React.ReactNode;
}

export default function SmartTableEmpty({ colSpan, error, emptyText }: ISmartTableEmptyProps): React.ReactNode {
	return (
		<TableRow className="hover:bg-transparent">
			<TableCell
				colSpan={colSpan}
				className="h-32 text-center"
			>
				<div className="flex flex-col items-center justify-center gap-2 text-muted-foreground">
					{error ? (
						<>
							<TriangleAlert className="size-6 text-destructive" />
							<span className="text-sm">데이터를 불러오지 못했습니다.</span>
						</>
					) : (
						<>
							<Inbox className="size-6" />
							<span className="text-sm">{emptyText ?? '결과가 없습니다.'}</span>
						</>
					)}
				</div>
			</TableCell>
		</TableRow>
	);
}
