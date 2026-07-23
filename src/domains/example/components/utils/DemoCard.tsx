import SectionHeader from '@/domains/example/components/ui-components/common/SectionHeader';

export interface IDemoCardProps {
	id: string;
	signature: string;
	description: string;
	children: React.ReactNode;
}

/** 유틸 함수 데모 카드 래퍼 (앵커 id + 시그니처 헤더 + 본문) */
export default function DemoCard({ id, signature, description, children }: IDemoCardProps): React.ReactNode {
	return (
		<section
			id={id}
			className="scroll-mt-24 space-y-3"
		>
			<SectionHeader
				title={signature}
				description={description}
			/>
			<div className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm dark:border-gray-800 dark:bg-gray-900">
				<div className="space-y-4">{children}</div>
			</div>
		</section>
	);
}
