/**
 * 공용 Spinner 의 `icon` prop 에 끼우는 커스텀 브랜드 SVG 아이콘 예시.
 *
 * lucide 아이콘과 동일하게 `React.ComponentProps<'svg'>` 를 받아 그대로 전달하므로,
 * `<Spinner icon={BrandMarkIcon} className="size-8 text-sky-500" />` 처럼 쓰면
 * 회전·크기·색(currentColor)은 Spinner 가 담당하고 모양만 이 아이콘으로 바뀐다.
 *
 * 색은 stroke="currentColor" 라 text-* 로 제어된다. 두 개의 마주보는 아크로 구성해
 * 기본 Loader2 와 확실히 다른 실루엣을 준다.
 */
export default function BrandMarkIcon({ className, ...props }: React.ComponentProps<'svg'>): React.ReactNode {
	return (
		<svg
			viewBox="0 0 24 24"
			fill="none"
			stroke="currentColor"
			strokeWidth={2.5}
			strokeLinecap="round"
			className={className}
			{...props}
		>
			{/* 진한 아크 */}
			<path d="M12 2.5a9.5 9.5 0 0 1 9.5 9.5" />
			{/* 옅은 반대편 아크 */}
			<path
				d="M12 21.5a9.5 9.5 0 0 1-9.5-9.5"
				opacity="0.35"
			/>
		</svg>
	);
}
