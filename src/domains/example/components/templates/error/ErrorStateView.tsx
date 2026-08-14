import { cn } from '@/shared/utils/cn';

export interface IErrorStateViewProps {
	/** 큰 글씨로 보여줄 코드. 예: '404' · '500' */
	code?: string;
	/** 코드 위에 놓을 아이콘 */
	icon?: React.ReactNode;
	title: string;
	description?: React.ReactNode;
	/**
	 * 개발자용 원인 문자열(에러 메시지·스택 등).
	 * **개발 모드에서만** 노출된다. 운영 화면에 스택을 흘리면 내부 구조가 그대로 드러난다.
	 */
	detail?: string;
	/** 하단 버튼 영역 */
	actions?: React.ReactNode;
	className?: string;
}

/**
 * 에러 화면의 공통 뼈대.
 *
 * 404 · 라우트 에러 · 렌더 에러는 원인이 다를 뿐 사용자에게 보여줄 모양은 같다.
 * 그래서 표현은 이 컴포넌트 하나로 모으고, 각 상황별 컴포넌트는
 * "무슨 문구와 어떤 버튼을 넣을지"만 결정한다.
 */
export default function ErrorStateView({
	code,
	icon,
	title,
	description,
	detail,
	actions,
	className,
}: IErrorStateViewProps): React.ReactNode {
	return (
		<div
			role="alert"
			className={cn('flex min-h-100 flex-col items-center justify-center gap-4 px-6 py-12 text-center', className)}
		>
			{icon && <div className="text-gray-300 dark:text-gray-600">{icon}</div>}

			{code && <p className="font-mono text-5xl font-bold tracking-tight text-gray-200 dark:text-gray-700">{code}</p>}

			<div className="space-y-1.5">
				<h2 className="text-lg font-semibold text-gray-900 dark:text-white">{title}</h2>
				{description && (
					<div className="max-w-md text-sm leading-relaxed text-gray-500 dark:text-gray-400">{description}</div>
				)}
			</div>

			{/* 개발 모드에서만 원인을 노출한다. 운영 빌드에서는 아예 렌더되지 않는다. */}
			{detail && import.meta.env.DEV && (
				<pre className="max-w-xl overflow-x-auto rounded-lg bg-gray-50 px-3 py-2 text-left font-mono text-[11px] leading-relaxed whitespace-pre-wrap text-gray-500 dark:bg-gray-800/60 dark:text-gray-400">
					{detail}
				</pre>
			)}

			{actions && <div className="flex flex-wrap items-center justify-center gap-2 pt-1">{actions}</div>}
		</div>
	);
}
