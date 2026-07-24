import { useState } from 'react';
import { Button } from '@axiom/components/ui';
import { Trash2, RotateCcw } from 'lucide-react';

interface IFileRow {
	id: number;
	name: string;
	size: string;
}

const INITIAL_ROWS: IFileRow[] = [
	{ id: 1, name: '2026-1분기_정산.xlsx', size: '128 KB' },
	{ id: 2, name: '거래명세_원본.csv', size: '54 KB' },
	{ id: 3, name: '고객목록_백업.json', size: '17 KB' },
];

/**
 * 실전 예제 — 삭제 전 확인.
 *
 * 행의 "삭제"를 누르면 `$ui.confirm`(error 타입)으로 되돌릴 수 없는 작업임을 확인받는다.
 * 사용자가 확인하면 목록에서 실제로 제거하고, 완료 알림(`$ui.alert`)까지 이어서 띄운다.
 * `confirm` 은 확인=true / 취소·X·ESC=false 로 resolve 되므로 `await` 한 값으로 분기한다.
 */
export default function DeleteConfirmCard(): React.ReactNode {
	const [rows, setRows] = useState<IFileRow[]>(INITIAL_ROWS);

	const handleDelete = async (row: IFileRow): Promise<void> => {
		const ok = await $ui.confirm({
			type: 'error',
			title: '파일 삭제',
			message: `'${row.name}' 을(를) 삭제할까요? 이 작업은 되돌릴 수 없습니다.`,
			confirmText: '삭제',
			cancelText: '취소',
		});
		if (!ok) return;

		setRows((prev) => prev.filter((r) => r.id !== row.id));
		await $ui.alert({ type: 'success', message: '삭제되었습니다.', autoDismiss: 1400 });
	};

	return (
		<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 shadow-sm overflow-hidden max-w-lg">
			<div className="flex items-center justify-between border-b border-gray-100 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50 px-4 py-2.5">
				<span className="text-xs font-medium text-gray-600 dark:text-gray-400">첨부 파일 ({rows.length})</span>
				<Button
					type="button"
					size="sm"
					variant="ghost"
					className="gap-1.5"
					disabled={rows.length === INITIAL_ROWS.length}
					onClick={() => setRows(INITIAL_ROWS)}
				>
					<RotateCcw className="h-3.5 w-3.5" />
					초기화
				</Button>
			</div>

			{rows.length === 0 ? (
				<p className="px-4 py-8 text-center text-sm text-gray-400 dark:text-gray-500">모든 파일이 삭제되었습니다.</p>
			) : (
				<ul className="divide-y divide-gray-100 dark:divide-gray-800">
					{rows.map((row) => (
						<li
							key={row.id}
							className="flex items-center gap-3 px-4 py-3"
						>
							<div className="min-w-0 flex-1">
								<p className="truncate text-sm font-medium text-gray-900 dark:text-gray-100">{row.name}</p>
								<p className="text-xs text-gray-400 dark:text-gray-500">{row.size}</p>
							</div>
							<Button
								type="button"
								size="icon-sm"
								variant="ghost"
								aria-label={`${row.name} 삭제`}
								className="text-gray-400 hover:text-destructive"
								onClick={() => handleDelete(row)}
							>
								<Trash2 className="h-4 w-4" />
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
