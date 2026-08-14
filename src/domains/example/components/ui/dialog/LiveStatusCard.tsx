import { useEffect, useState } from 'react';
import { Button } from '@axiom/components/ui';
import { MonitorPlay } from 'lucide-react';
import { useLiveProps } from '@axiom/hooks';
import LiveStatusDialog from './LiveStatusDialog';

/**
 * 실전 예제 — 바탕 페이지의 state 를 살아있는 props 로 넘긴다.
 *
 * 여기서 하는 일은 딱 세 가지다.
 *  1. 평범하게 `useState` 로 값을 만든다 (1초마다 갱신).
 *  2. 그 값들을 `useLiveProps` 로 감싼다. ← 이 한 줄이 전부다.
 *  3. 평소와 똑같이 `$ui.dialog` 로 연다.
 *
 * `handle.update()` 도 동기화 effect 도 없다. 다이얼로그를 열어둔 채 카드의 숫자와
 * 다이얼로그 안의 숫자가 같이 올라가는 것을 확인할 수 있다.
 *
 * 반응성이 필요 없다면 감싸지 말고 `props: { ... }` 로 그냥 넘기면 된다.
 * 여는 방법은 어느 쪽이든 `$ui.dialog` 하나다.
 */
export default function LiveStatusCard(): React.ReactNode {
	const [elapsed, setElapsed] = useState(0);
	const [queue, setQueue] = useState(12);
	const [now, setNow] = useState(() => new Date().toLocaleTimeString('ko-KR'));

	// 1초마다 바뀌는 바탕 페이지 state
	useEffect(() => {
		const timer = setInterval(() => {
			setElapsed((n) => n + 1);
			setNow(new Date().toLocaleTimeString('ko-KR'));
			setQueue((q) => Math.max(0, q + (Math.random() < 0.5 ? -1 : 1)));
		}, 1000);
		return () => clearInterval(timer);
	}, []);

	// ★ 값만 상자로 감싼다. 컨텐츠 컴포넌트는 이 상자의 존재를 모른다.
	const live = useLiveProps({ elapsed, now, queue });

	return (
		<div className="max-w-md rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
			<p className="text-sm font-semibold text-gray-900 dark:text-white">바탕 페이지 state</p>

			<dl className="mt-3 grid grid-cols-[6rem_1fr] gap-x-4 gap-y-2 text-sm">
				<dt className="text-gray-500 dark:text-gray-400">현재 시각</dt>
				<dd className="font-mono text-gray-800 dark:text-gray-200">{now}</dd>
				<dt className="text-gray-500 dark:text-gray-400">경과(초)</dt>
				<dd className="font-mono text-gray-800 dark:text-gray-200">{elapsed}</dd>
				<dt className="text-gray-500 dark:text-gray-400">대기 건수</dt>
				<dd className="font-mono text-gray-800 dark:text-gray-200">{queue}</dd>
			</dl>

			<div className="mt-4 flex justify-end">
				<Button
					type="button"
					variant="outline"
					className="gap-1.5"
					onClick={() =>
						void $ui.dialog({
							component: LiveStatusDialog,
							props: live,
							title: '실시간 처리 현황',
							description: '바탕 페이지의 state 가 1초마다 바뀝니다.',
							size: 'sm',
							footer: false,
						})
					}
				>
					<MonitorPlay className="size-4" />
					다이얼로그로 보기
				</Button>
			</div>
		</div>
	);
}
