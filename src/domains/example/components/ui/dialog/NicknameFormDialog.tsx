import { useEffect, useState } from 'react';
import { Input, Label } from '@axiom/components/ui';
import { useDialog, useDialogSubmit } from '@axiom/hooks';

export interface INicknameFormDialogProps {
	/** 초기 닉네임 */
	initial: string;
}

/**
 * 예제 — shell footer 모드(기본).
 *
 * 컨텐츠는 **본문만** 그린다. 확인/취소 버튼은 $ui.dialog 의 shell 이 그려주고,
 * "확인을 눌렀을 때 무엇을 결과로 돌려줄지"만 useDialogSubmit 으로 등록한다.
 *
 * 포인트:
 *  - props 는 평범하다. 제어 API 는 prop 이 아니라 useDialog() 로 꺼낸다.
 *  - useDialogSubmit 은 매 렌더마다 최신 클로저로 교체되므로 stale closure 가 없다.
 *  - 제출 핸들러가 undefined 를 반환하면 다이얼로그가 닫히지 않는다(검증 실패).
 *  - setConfirmDisabled 는 렌더 중이 아니라 effect 에서 호출한다.
 */
export default function NicknameFormDialog({ initial }: INicknameFormDialogProps): React.ReactNode {
	const dialog = useDialog<string>();
	const [draft, setDraft] = useState(initial);
	const tooShort = draft.trim().length < 2;

	// 확인 버튼 활성 조건 — 상태 갱신이므로 effect 에서 처리한다.
	useEffect(() => {
		dialog.setConfirmDisabled(tooShort);
	}, [dialog, tooShort]);

	// 확인 클릭 시 실행. 반환값이 곧 $ui.dialog 의 결과다.
	useDialogSubmit<string>(() => {
		if (tooShort) return undefined; // 닫지 않음
		return draft.trim();
	});

	return (
		<div className="space-y-2">
			<Label htmlFor="ex-nickname">닉네임</Label>
			<Input
				id="ex-nickname"
				value={draft}
				onChange={(e) => setDraft(e.target.value)}
				placeholder="2자 이상"
				autoFocus
			/>
			{tooShort && <p className="text-xs text-destructive">2자 이상 입력해야 저장할 수 있습니다.</p>}
		</div>
	);
}
