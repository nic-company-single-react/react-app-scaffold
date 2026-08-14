import { Link } from 'react-router';
import { Button } from '@axiom/components/ui';
import { ArrowLeft, Compass, House } from 'lucide-react';
import ErrorStateView from './ErrorStateView';

export interface INotFoundViewProps {
	/** [홈으로] 가 향할 경로 (기본 '/') */
	homePath?: string;
	className?: string;
}

/**
 * 404 — 존재하지 않는 경로에 들어왔을 때 보여줄 화면.
 *
 * 라우터의 `path: '*'` 에 연결한다. 사용자는 오타나 만료된 링크로 이 화면에 닿으므로,
 * "없다"고만 말하고 끝내지 말고 **다음에 갈 곳**을 반드시 함께 준다.
 */
export default function NotFoundView({ homePath = '/', className }: INotFoundViewProps): React.ReactNode {
	return (
		<ErrorStateView
			className={className}
			code="404"
			icon={<Compass className="size-10" />}
			title="페이지를 찾을 수 없습니다"
			description="주소가 바뀌었거나 삭제된 페이지입니다. 주소를 다시 확인해 주세요."
			actions={
				<>
					<Button asChild>
						<Link to={homePath}>
							<House className="size-3.5" />
							홈으로
						</Link>
					</Button>
					{/* 컴포넌트 밖에서도 쓸 수 있는 전역 $router — 훅 없이 히스토리를 다룬다. */}
					<Button
						variant="outline"
						onClick={() => $router.back()}
					>
						<ArrowLeft className="size-3.5" />
						이전 페이지
					</Button>
				</>
			}
		/>
	);
}
