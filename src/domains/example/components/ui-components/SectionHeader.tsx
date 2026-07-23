import { useId } from 'react';

export interface ISectionHeaderProps {
	title: string;
	description?: string;
	/** 바로가기(SectionNav)에서 사용할 앵커 id. 미지정 시 자동 생성됩니다. */
	id?: string;
}

export default function SectionHeader({ title, description, id }: ISectionHeaderProps): React.ReactNode {
	// id 미지정 시 페이지 내에서 안정적으로 유일한 앵커 id 를 생성한다.
	const autoId = useId();
	const sectionId = id ?? `section-${autoId.replace(/:/g, '')}`;

	return (
		<div
			id={sectionId}
			data-section-nav=""
			data-section-title={title}
			// 스크롤 이동 시 상단에 여백을 둬 헤더가 잘리지 않게 한다.
			className="space-y-1 pb-1 scroll-mt-24"
		>
			<h2 className="text-base font-semibold text-gray-900 dark:text-white">{title}</h2>
			{description && <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>}
		</div>
	);
}