import { useState } from 'react';
import { Input, Label, Textarea } from '@axiom/components/ui';
import { defineDialog } from '@/core/ui';
import { useDialogGuard, useDialogSubmit } from '@axiom/hooks';
import type { IDialogInjected } from '@/types/components';

/** 제출 결과 */
export interface IInquiry {
	subject: string;
	body: string;
}

export interface IInquiryFormDialogProps {
	/** 제목 기본값 */
	defaultSubject?: string;
}

const EMPTY: IInquiry = { subject: '', body: '' };

/**
 * 예제 — 닫기 가드(dirty form).
 *
 * 작성 중인 내용이 있으면 취소·ESC·X·배경 클릭으로 닫으려 할 때 한 번 더 묻는다.
 * 가드는 컨텐츠가 자기 dirty 상태를 알고 있으므로 **컨텐츠가 등록**한다(useDialogGuard).
 * 가드 안에서 `$ui.confirm` 을 부르는 것이 정상 시나리오다 —
 * alert 티어(z-100500)가 dialog 티어(z-100000+)보다 위라 항상 최상단에 뜬다.
 */
function InquiryFormDialog({
	defaultSubject = '',
	dialog,
}: IInquiryFormDialogProps & IDialogInjected<IInquiry>): React.ReactNode {
	const [form, setForm] = useState<IInquiry>({ ...EMPTY, subject: defaultSubject });
	const dirty = form.subject !== defaultSubject || form.body !== '';

	useDialogGuard<IInquiry>(async (result) => {
		// 제출로 닫히는 경우와, 애초에 건드린 게 없으면 그냥 통과시킨다.
		if (!dirty || result.reason === 'submit' || result.reason === 'confirm') return true;
		return $ui.confirm({
			type: 'warning',
			title: '작성 취소',
			message: '작성 중인 내용이 사라집니다. 닫을까요?',
			confirmText: '닫기',
			cancelText: '계속 작성',
		});
	});

	useDialogSubmit<IInquiry>(async () => {
		if (!form.subject.trim()) {
			await $ui.alert({ type: 'warning', message: '제목을 입력하세요.' });
			return undefined; // 닫지 않음
		}
		// 실제 앱이라면 여기서 API 를 호출하고 그 결과를 반환한다.
		dialog.setLoading(true);
		await new Promise((resolve) => setTimeout(resolve, 500));
		dialog.setLoading(false);
		return form;
	});

	return (
		<div className="space-y-4">
			<div className="space-y-2">
				<Label htmlFor="ex-inquiry-subject">제목</Label>
				<Input
					id="ex-inquiry-subject"
					value={form.subject}
					onChange={(e) => setForm((prev) => ({ ...prev, subject: e.target.value }))}
					placeholder="문의 제목"
					autoFocus
				/>
			</div>
			<div className="space-y-2">
				<Label htmlFor="ex-inquiry-body">내용</Label>
				<Textarea
					id="ex-inquiry-body"
					value={form.body}
					onChange={(e) => setForm((prev) => ({ ...prev, body: e.target.value }))}
					placeholder="무엇을 도와드릴까요?"
					rows={5}
				/>
			</div>
			<p className="text-xs text-gray-500 dark:text-gray-400">
				내용을 입력한 뒤 <b>ESC</b> 나 <b>취소</b> 로 닫아보세요. 확인 다이얼로그가 한 번 더 뜹니다.
			</p>
		</div>
	);
}

export default defineDialog<IInquiryFormDialogProps, IInquiry>(InquiryFormDialog);
