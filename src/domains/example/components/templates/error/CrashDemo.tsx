import { useState } from 'react';
import { Button } from '@axiom/components/ui';
import { Bomb } from 'lucide-react';

export interface ICrashDemoProps {
	/** 던질 에러 메시지 */
	message?: string;
}

/**
 * 데모용 — 버튼을 누르면 렌더 도중 예외를 던진다.
 *
 * 에러 경계가 실제로 동작하는지 눈으로 확인하기 위한 장치일 뿐, 복사해 쓸 코드는 아니다.
 * `AppErrorBoundary` 가 이 컴포넌트를 감싸면 예외를 잡아 대체 화면을 그린다.
 *
 * 경계가 에러를 잡을 때 React 는 그 아래 트리를 **통째로 언마운트**한다.
 * 그래서 [다시 시도] 로 경계를 초기화하면 이 컴포넌트가 새로 마운트되고
 * `crashed` 도 자연히 false 로 돌아온다.
 */
export default function CrashDemo({
	message = '주문 위젯을 그리는 중 예외가 발생했습니다. (데모용 의도적 에러)',
}: ICrashDemoProps): React.ReactNode {
	const [crashed, setCrashed] = useState(false);

	// 렌더 경로에서 던져야 에러 경계가 잡는다.
	// (onClick 안에서 바로 throw 하면 이벤트 핸들러라 잡히지 않는다.)
	if (crashed) throw new Error(message);

	return (
		<div className="flex min-h-40 flex-col items-center justify-center gap-3 rounded-xl bg-gray-50 px-6 py-8 text-center dark:bg-gray-800/40">
			<p className="text-xs text-gray-500 dark:text-gray-400">
				정상 상태의 위젯입니다. 아래 버튼을 누르면 렌더 도중 예외가 발생합니다.
			</p>
			<Button
				variant="outline"
				onClick={() => setCrashed(true)}
				className="gap-1.5 text-destructive"
			>
				<Bomb className="size-3.5" />
				에러 발생시키기
			</Button>
		</div>
	);
}
