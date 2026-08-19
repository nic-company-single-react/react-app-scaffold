import { Suspense } from 'react';
import { DialogPendingFallback } from '@/shared/ui/overlay/DialogSkin';
import { DialogContext } from './DialogContext';
import DialogErrorBoundary from './DialogErrorBoundary';
import DialogRouterBridge from './DialogRouterBridge';
import { settleDialog } from './dialogController';
import type { IDialogApiHandle, TAnyDialogComponent } from '@/types/components';

export interface IDialogBodyProps {
	id: string;
	/** 컨텐츠에 내려줄 제어 API */
	api: IDialogApiHandle<unknown>;
	/** 본문으로 렌더할 컴포넌트 */
	component: TAnyDialogComponent;
	/** 이미 확정된 컨텐츠 props (라이브 구독 · 콜백 프록시 처리 완료) */
	props: Record<string, unknown>;
}

/**
 * 다이얼로그 본문을 감싸는 **구조** 레이어. 마크업이 아니라 순서가 핵심이다.
 *
 * ⚠️ 중첩 순서를 바꾸면 안 된다.
 *   - 에러 경계가 Suspense **바깥**에 있어야 `loadable(() => import(...))` 의 청크 로드 실패를 잡는다.
 *     못 잡으면 `await $ui.dialog(...)` 가 영원히 resolve 되지 않는다.
 *   - 라우터 브리지가 있어야 컨텐츠 안에서 useNavigate / useLocation 이 동작한다
 *     (호스트가 라우터 트리 바깥에서 렌더되기 때문).
 *
 * 보이는 부분(대기 화면 · 실패 화면)은 shared 의 스킨이 담당한다.
 */
export default function DialogBody({ id, api, component: Content, props }: IDialogBodyProps): React.ReactNode {
	return (
		<DialogContext.Provider value={api}>
			<DialogRouterBridge>
				<DialogErrorBoundary
					id={id}
					onError={(dialogId) => settleDialog(dialogId, 'error')}
				>
					<Suspense fallback={<DialogPendingFallback />}>
						<Content
							{...props}
							dialog={api}
						/>
					</Suspense>
				</DialogErrorBoundary>
			</DialogRouterBridge>
		</DialogContext.Provider>
	);
}
