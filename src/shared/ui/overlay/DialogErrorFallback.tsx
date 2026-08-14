/**
 * $ui.dialog 컨텐츠 렌더가 실패했을 때 본문 자리에 보여줄 화면.
 *
 * 프로젝트 문구·스타일에 맞춰 자유롭게 고쳐도 됩니다. 이 컴포넌트는 표시만 담당하고,
 * Promise 정산(다이얼로그를 닫고 `await` 를 풀어주는 일)은 core 의 에러 경계가 이미 끝냈습니다.
 */
export default function DialogErrorFallback(): React.ReactNode {
	return (
		<p className="py-6 text-center text-sm text-destructive">내용을 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.</p>
	);
}
