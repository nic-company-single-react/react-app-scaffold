import { useState } from 'react';
import { Button, CodeBlock } from '@axiom/components/ui';
import { Code2, ChevronDown } from 'lucide-react';

/** 소스 탭 한 개 */
export interface ISourceFile {
	/** 탭/코드블럭에 표시할 파일명 */
	filename: string;
	/** 파일 원본 소스(보통 `import x from '....?raw'`로 주입) */
	code: string;
	/** 하이라이팅 언어 */
	lang: 'tsx' | 'css';
}

export interface ISourceTabsProps {
	files: ISourceFile[];
	/** 처음부터 펼쳐서 보여줄지 여부(기본 false — 코드가 길어 기본은 접힘) */
	defaultOpen?: boolean;
}

/**
 * 여러 파일 소스를 탭으로 전환하며 보여주고, 각 파일을 복사할 수 있는 뷰어.
 *
 * 코드가 길어 기본은 접혀 있고, 상단 토글 버튼으로 펼친다.
 * 하이라이팅과 복사 버튼은 scaffold의 CodeBlock(@axiom/components/ui)에 그대로 맡기고,
 * 이 컴포넌트는 펼침/접힘과 파일 전환(탭)만 담당한다. 토글·탭 버튼도 scaffold Button을 사용한다.
 * 실전 예제 컴포넌트의 .tsx / .module.css 원본을 `?raw`로 주입해 소스가 항상 실제 파일과 동기화된다.
 */
export default function SourceTabs({ files, defaultOpen = false }: ISourceTabsProps): React.ReactNode {
	const [open, setOpen] = useState(defaultOpen);
	const [active, setActive] = useState(0);
	const current = files[active];

	return (
		<div className="space-y-2">
			<Button
				type="button"
				size="sm"
				variant="outline"
				onClick={() => setOpen((o) => !o)}
				aria-expanded={open}
				className="gap-1.5"
			>
				<Code2 className="w-3.5 h-3.5" />
				{open ? '소스 코드 접기' : '소스 코드 보기'}
				<ChevronDown className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} />
			</Button>

			{open && (
				<>
					<div className="flex flex-wrap gap-1.5">
						{files.map((f, i) => (
							<Button
								key={f.filename}
								type="button"
								size="sm"
								variant={i === active ? 'secondary' : 'ghost'}
								onClick={() => setActive(i)}
								className="font-mono"
							>
								{f.filename}
							</Button>
						))}
					</div>

					{current && (
						<CodeBlock
							code={current.code}
							lang={current.lang}
							filename={current.filename}
						/>
					)}
				</>
			)}
		</div>
	);
}
