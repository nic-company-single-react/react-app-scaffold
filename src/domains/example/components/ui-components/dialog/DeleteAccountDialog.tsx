import { useState } from 'react';
import {
	Button,
	Dialog,
	DialogClose,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@axiom/components/ui';
import { TriangleAlert, Check } from 'lucide-react';
import styles from './DeleteAccountDialog.module.css';

/** 삭제를 확정하려면 사용자가 그대로 입력해야 하는 확인 문구 */
const CONFIRM_TEXT = '계정 삭제';

/**
 * 실전 예제 — 위험 작업 확인 다이얼로그(계정 삭제).
 *
 * scaffold Dialog(@axiom/components/ui)를 구조 변경 없이 그대로 쓰되,
 * *.module.css 의 data-slot 오버라이드만으로 로즈/danger 톤으로 재스타일했다.
 *
 * ⚠️ DialogContent 는 Portal 로 document.body 밑에 렌더되므로, 스타일은 반드시
 *    DialogContent 의 className(.sheet)을 기점으로 작성한다. (page 래퍼 하위로는 못 잡음)
 *
 * 실무 포인트:
 *  - open/onOpenChange 로 제어하고, 닫힐 때 입력값을 초기화한다.
 *  - 확인 문구를 정확히 입력해야만 삭제 버튼이 활성화된다(오폭 방지).
 *  - 기본 X 닫기 버튼은 숨기고(showCloseButton={false}) 하단 버튼으로만 닫는다.
 */
export default function DeleteAccountDialog(): React.ReactNode {
	const [open, setOpen] = useState(false);
	const [input, setInput] = useState('');
	const [deleted, setDeleted] = useState(false);

	const canDelete = input.trim() === CONFIRM_TEXT;

	const handleOpenChange = (next: boolean) => {
		setOpen(next);
		if (!next) setInput(''); // 닫힐 때 입력값 리셋
	};

	const handleDelete = () => {
		setOpen(false);
		setInput('');
		setDeleted(true);
	};

	return (
		<div className="flex flex-wrap items-center gap-3">
			<Dialog
				open={open}
				onOpenChange={handleOpenChange}
			>
				<DialogTrigger asChild>
					<Button variant="outline">계정 삭제…</Button>
				</DialogTrigger>

				<DialogContent
					showCloseButton={false}
					className={styles.sheet}
				>
					<DialogHeader>
						<div className={styles.iconBadge}>
							<TriangleAlert className="w-6 h-6" />
						</div>
						<DialogTitle>정말 계정을 삭제할까요?</DialogTitle>
						<DialogDescription>
							이 작업은 <b>되돌릴 수 없습니다.</b> 모든 데이터가 영구적으로 삭제됩니다. 계속하려면 아래 입력란에{' '}
							<code className={styles.code}>{CONFIRM_TEXT}</code> 를 입력하세요.
						</DialogDescription>
					</DialogHeader>

					<input
						value={input}
						onChange={(e) => setInput(e.target.value)}
						placeholder={CONFIRM_TEXT}
						className={styles.input}
						autoFocus
					/>

					<DialogFooter>
						<Button
							className={styles.danger}
							disabled={!canDelete}
							onClick={handleDelete}
						>
							영구 삭제
						</Button>
						<DialogClose asChild>
							<Button
								variant="outline"
								className={styles.cancel}
							>
								취소
							</Button>
						</DialogClose>
					</DialogFooter>
				</DialogContent>
			</Dialog>

			{deleted && (
				<span className="inline-flex items-center gap-1.5 text-xs font-medium text-emerald-600 dark:text-emerald-400">
					<Check className="w-3.5 h-3.5" />
					삭제 요청이 접수되었습니다 (데모).
				</span>
			)}
		</div>
	);
}
