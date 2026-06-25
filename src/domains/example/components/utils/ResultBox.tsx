import { CornerDownRight } from 'lucide-react';

export interface IResultBoxProps {
	call: string;
	result: React.ReactNode;
}

/** 실행 결과 출력 박스: 호출식 → 결과 */
export default function ResultBox({ call, result }: IResultBoxProps): React.ReactNode {
	return (
		<div className="flex flex-wrap items-center gap-2 rounded-lg border border-indigo-200/70 bg-indigo-50/60 px-3 py-2.5 text-sm dark:border-indigo-800/50 dark:bg-indigo-900/20">
			<CornerDownRight className="size-4 shrink-0 text-indigo-500 dark:text-indigo-400" />
			<code className="font-mono text-xs text-gray-600 dark:text-gray-400">{call}</code>
			<span className="text-gray-400">→</span>
			<code className="font-mono text-sm font-semibold text-indigo-700 dark:text-indigo-300">{result}</code>
		</div>
	);
}
