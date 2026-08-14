import { Progress } from '@axiom/components/ui';
import { defineDialog } from '@/core/ui';
import type { IDialogInjected } from '@/types/components';

export interface IUploadProgressDialogProps {
	/** 진행률 0~100 — 호출부가 handle.update({ percent }) 로 갱신한다. */
	percent: number;
	/** 업로드 중인 파일명 */
	filename: string;
}

/**
 * 예제 — 열려 있는 다이얼로그의 props 갱신.
 *
 * `$ui.dialog` 는 명령형이라 props 가 **호출 시점 스냅샷**이다.
 * 진행률처럼 바깥에서 계속 밀어넣어야 하는 값은 반환 핸들의 `update()` 로 갱신한다.
 *
 * ```ts
 * const d = $ui.dialog({ component: UploadProgressDialog, props: { percent: 0, filename } });
 * d.update({ percent: 40 });
 * d.close();
 * ```
 *
 * 참고: 서버에서 오는 실시간 데이터라면 update() 대신 컨텐츠가 react-query/zustand 를
 * 직접 구독하는 편이 낫다. 호스트가 QueryProvider 안쪽에 있으므로 그대로 동작한다.
 */
function UploadProgressDialog({
	percent,
	filename,
}: IUploadProgressDialogProps & IDialogInjected<void>): React.ReactNode {
	return (
		<div className="space-y-3">
			<p className="truncate text-sm text-gray-700 dark:text-gray-300">{filename}</p>
			<Progress value={percent} />
			<p className="text-right font-mono text-xs text-gray-500 dark:text-gray-400">{percent}%</p>
		</div>
	);
}

export default defineDialog<IUploadProgressDialogProps, void>(UploadProgressDialog);
