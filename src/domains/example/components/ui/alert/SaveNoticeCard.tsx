import { useState } from 'react';
import { Button, Switch } from '@axiom/components/ui';
import { BellRing } from 'lucide-react';

export interface ISaveNoticeCardProps {
	/** 초기 알림 수신 여부 */
	defaultEnabled?: boolean;
}

/**
 * 실전 예제 — 설정 저장 후 완료 알림.
 *
 * "저장" 버튼을 누르면 짧은 비동기 처리(모의 API)를 흉내내고,
 * 완료되면 `$ui.alert`(성공 타입, 자동 닫힘)로 사용자에게 알린다.
 * `await` 로 다이얼로그가 닫힐 때까지 기다리므로, 후속 처리를 이어서 쓸 수 있다.
 */
export default function SaveNoticeCard({ defaultEnabled = true }: ISaveNoticeCardProps): React.ReactNode {
	const [enabled, setEnabled] = useState(defaultEnabled);
	const [saving, setSaving] = useState(false);

	const handleSave = async (): Promise<void> => {
		setSaving(true);
		// 모의 API 저장 (0.6s)
		await new Promise((resolve) => setTimeout(resolve, 600));
		setSaving(false);

		await $ui.alert({
			type: 'success',
			title: '저장 완료',
			message: enabled ? '알림 수신이 켜졌습니다.' : '알림 수신이 꺼졌습니다.',
			autoDismiss: 1600,
		});
	};

	return (
		<div className="rounded-2xl border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 p-5 shadow-sm max-w-md">
			<div className="flex items-center gap-3">
				<div className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-50 dark:bg-sky-900/20">
					<BellRing className="h-5 w-5 text-sky-600 dark:text-sky-400" />
				</div>
				<div className="min-w-0 flex-1">
					<p className="text-sm font-semibold text-gray-900 dark:text-white">알림 수신</p>
					<p className="text-xs text-gray-500 dark:text-gray-400">이벤트·공지 알림을 이메일로 받습니다.</p>
				</div>
				<Switch
					checked={enabled}
					onCheckedChange={setEnabled}
					aria-label="알림 수신 토글"
				/>
			</div>

			<div className="mt-4 flex justify-end">
				<Button
					type="button"
					onClick={handleSave}
					disabled={saving}
				>
					{saving ? '저장 중…' : '저장'}
				</Button>
			</div>
		</div>
	);
}
