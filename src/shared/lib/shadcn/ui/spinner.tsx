import { cn } from "@/shared/utils/cn"
import { Loader2Icon } from "lucide-react"

export interface SpinnerProps extends React.ComponentProps<"svg"> {
  /**
   * 회전시킬 아이콘 컴포넌트. 미지정 & children 없으면 기본 Loader2Icon(lucide).
   * lucide 아이콘이나 같은 시그니처(svg props를 받는) 커스텀 SVG 컴포넌트를 넘겨 "모양"만 교체한다.
   */
  icon?: React.ComponentType<React.ComponentProps<"svg">>
  /**
   * 회전 여부. 기본 true.
   * 이미 스스로 움직이는 이미지(GIF·APNG·애니메이션 SVG 등)를 넣을 때는 false 로 꺼서 이중 회전을 막는다.
   */
  spin?: boolean
  /**
   * <img> 같은 임의 콘텐츠를 직접 넣을 때 사용한다(icon 대신).
   * 이때 Spinner 는 <span> 래퍼로 감싸 회전·크기·접근성만 담당하고, 그림은 넘긴 콘텐츠를 그대로 쓴다.
   */
  children?: React.ReactNode
}

function Spinner({ className, icon: Icon = Loader2Icon, spin = true, children, ...props }: SpinnerProps) {
  const spinClass = spin ? "animate-spin" : undefined

  // children(이미지 등)을 넘기면 <svg> 가 아니므로 span 래퍼로 감싼다.
  if (children) {
    return (
      <span
        data-slot="spinner"
        role="status"
        aria-label="Loading"
        className={cn("inline-flex items-center justify-center", spinClass, className)}
        {...(props as React.HTMLAttributes<HTMLSpanElement>)}
      >
        {children}
      </span>
    )
  }

  return (
    <Icon data-slot="spinner" role="status" aria-label="Loading" className={cn("size-4", spinClass, className)} {...props} />
  )
}

export { Spinner }
