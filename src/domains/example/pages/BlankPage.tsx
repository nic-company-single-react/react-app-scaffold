import React, { useEffect } from 'react';
import { CodeBlock } from '@axiom/components/ui';
import { FileCode2 } from 'lucide-react';

interface IBlankPageProps {
	test?: string;
}

// 화면에 그대로 노출되는 이 컴포넌트의 소스 코드.
// 새 페이지를 만들 때 참고할 수 있도록 기본 골격을 보여줍니다.
const sourceCode = `import React, { useEffect } from 'react';

interface IBlankPageProps {
	test?: string;
}

export default function BlankPage({}: IBlankPageProps): React.ReactNode {
	// useEffect hooks
	useEffect(() => {
		// ...
	}, []);

	return (
		<>
			<div>Blank Page!!</div>
		</>
	);
}`;

export default function BlankPage({}: IBlankPageProps): React.ReactNode {
	// useEffect hooks
	useEffect(() => {
		// ...
	}, []);

	return (
		<div className="p-6 space-y-6 max-w-3xl">
			{/* ── 페이지 헤더 ─────────────────────────────────────── */}
			<div className="flex items-center gap-3">
				<div className="flex items-center justify-center w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-900/20">
					<FileCode2 className="w-5 h-5 text-violet-600 dark:text-violet-400" />
				</div>
				<div>
					<h1 className="text-2xl font-bold text-gray-900 dark:text-white">Blank Page</h1>
					<p className="text-sm text-gray-500 dark:text-gray-400">
						새 페이지를 만들 때 시작점이 되는 기본 페이지입니다. 아래는 현재 화면 컴포넌트의 소스 코드입니다.
					</p>
				</div>
			</div>

			{/* ── 현재 화면 컴포넌트 소스 코드 ───────────────────────── */}
			<CodeBlock
				code={sourceCode}
				lang="tsx"
				filename="BlankPage.tsx"
			/>
		</div>
	);
}
