import { useState } from 'react';
import { Badge, Button } from '@axiom/components/ui';
import { UserPlus, X } from 'lucide-react';
import MemberPickerDialog, { type IExampleMember } from './MemberPickerDialog';

/**
 * 실전 예제 — 담당자 지정.
 *
 * `$ui.dialog` 로 회원 피커를 띄우고 **결과를 await 로 받는다**.
 * 결과 타입은 호출부에서 `$ui.dialog<IExampleMember>({...})` 처럼 지정한다.
 *
 * 컴포넌트형 Dialog 로 같은 걸 만들면 필요한 것들:
 *   - `const [open, setOpen] = useState(false)`
 *   - `<Dialog open={open} onOpenChange={...}>` JSX 배치
 *   - 선택 결과를 부모로 올리는 `onSelect` 콜백 prop
 *   - 닫힐 때 내부 상태 리셋
 * 여기서는 전부 없다. 이벤트 핸들러 한 줄이 끝이다.
 */
export default function MemberAssignCard(): React.ReactNode {
	const [assignee, setAssignee] = useState<IExampleMember | null>(null);

	const handlePick = async (): Promise<void> => {
		const picked = await $ui.dialog<IExampleMember>({
			component: MemberPickerDialog,
			props: { selectedId: assignee?.id },
			title: '담당자 선택',
			description: '행의 "선택" 버튼을 누르면 그 회원이 결과로 반환됩니다.',
			size: 'lg',
			footer: false, // 컨텐츠가 직접 닫는다
		});

		// 취소 · ESC · X · 배경 클릭은 undefined
		if (!picked) return;

		setAssignee(picked);
		await $ui.alert({ type: 'success', message: `${picked.name} 님을 담당자로 지정했습니다.`, autoDismiss: 1400 });
	};

	return (
		<div className="max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
			<p className="text-sm font-semibold text-gray-900 dark:text-white">담당자</p>

			<div className="mt-3 flex items-center gap-3">
				{assignee ? (
					<div className="flex min-w-0 flex-1 items-center gap-2">
						<Badge>{assignee.name}</Badge>
						<span className="truncate font-mono text-xs text-gray-500 dark:text-gray-400">
							{$util.string.formatMobile(assignee.phone)}
						</span>
						<Button
							type="button"
							size="icon-sm"
							variant="ghost"
							aria-label="담당자 해제"
							className="text-gray-400 hover:text-destructive"
							onClick={() => setAssignee(null)}
						>
							<X className="size-4" />
						</Button>
					</div>
				) : (
					<p className="flex-1 text-xs text-gray-400 dark:text-gray-500">아직 지정되지 않았습니다.</p>
				)}

				<Button
					type="button"
					variant="outline"
					className="gap-1.5"
					onClick={handlePick}
				>
					<UserPlus className="size-4" />
					{assignee ? '변경' : '지정'}
				</Button>
			</div>
		</div>
	);
}
