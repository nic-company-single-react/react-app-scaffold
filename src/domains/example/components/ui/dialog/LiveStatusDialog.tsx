import { Badge } from '@axiom/components/ui';
import { Activity } from 'lucide-react';

export interface ILiveStatusDialogProps {
	/** 경과 시간(초) */
	elapsed: number;
	/** 현재 시각 문자열 */
	now: string;
	/** 대기 건수 */
	queue: number;
}

/**
 * 예제 — 결과도 제어도 없는 표시 전용 컨텐츠.
 *
 * 스스로 닫지 않으므로 `useDialog()` 조차 없다. 동기화 코드도 없다.
 * 다이얼로그 전용으로 만든 게 아니라 그냥 props 를 받아 렌더하는 보통 컴포넌트이고,
 * 페이지 안에 그대로 박아 써도 똑같이 동작한다.
 *
 * 호출부가 `useLiveProps` 로 감싸 넘기면 바탕 페이지의 state 가 바뀔 때마다 이 props 도 같이 바뀐다.
 * 이 컴포넌트는 그 사실조차 모른다 — 셸이 상자를 풀어서 평범한 props 로 내려준다.
 *
 * ⚠️ 단 하나의 규칙: props 를 `useState(props.x)` 로 **복사하지 말 것**.
 *    React 의 초기값은 마운트 때 한 번만 쓰이므로 그러면 갱신이 화면에 보이지 않는다.
 *    (여기처럼 값을 그대로 렌더하거나 파생시켜 쓰면 된다)
 */
export default function LiveStatusDialog({ elapsed, now, queue }: ILiveStatusDialogProps): React.ReactNode {
	const mm = String(Math.floor(elapsed / 60)).padStart(2, '0');
	const ss = String(elapsed % 60).padStart(2, '0');

	return (
		<div className="space-y-4">
			<div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
				<Activity className="size-4 animate-pulse text-emerald-500" />
				실시간 갱신 중
			</div>

			<dl className="grid grid-cols-[6rem_1fr] gap-x-4 gap-y-3 text-sm">
				<dt className="text-gray-500 dark:text-gray-400">현재 시각</dt>
				<dd className="font-mono text-gray-800 dark:text-gray-200">{now}</dd>

				<dt className="text-gray-500 dark:text-gray-400">경과</dt>
				<dd className="font-mono text-gray-800 dark:text-gray-200">
					{mm}:{ss}
				</dd>

				<dt className="text-gray-500 dark:text-gray-400">대기 건수</dt>
				<dd>
					<Badge variant={queue > 15 ? 'destructive' : 'default'}>{queue}건</Badge>
				</dd>
			</dl>

			<p className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
				이 값들은 전부 <b>바탕 페이지의 state</b> 입니다. 이 컴포넌트는 받은 props 를 그리기만 합니다.
			</p>
		</div>
	);
}
