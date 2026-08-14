import { Label } from '@axiom/components/ui';
import { cn } from '@/shared/utils/cn';

export interface IFormFieldProps {
	/** 라벨과 입력요소를 잇는 id. 자식 입력요소의 `id` 와 반드시 같아야 한다. */
	id: string;
	/** 필드 라벨 */
	label: string;
	/** 필수 표시(*) 노출 여부 */
	required?: boolean;
	/** 검증 실패 메시지. 값이 있으면 에러 상태로 렌더된다. */
	error?: string;
	/** 입력 전 안내 문구. 에러가 있으면 에러 메시지로 교체된다. */
	hint?: string;
	/** 실제 입력요소(Input · Select · Textarea …) */
	children: React.ReactNode;
	className?: string;
}

/**
 * 폼 한 칸(라벨 + 입력요소 + 메시지)을 감싸는 래퍼.
 *
 * 폼마다 매번 반복되는 세 가지를 한 곳에 모아둔다.
 *  1. `Label htmlFor` ↔ 입력요소 `id` 연결 (라벨 클릭 시 포커스 / 스크린리더)
 *  2. 필수 표시(*)와 그 접근성 텍스트
 *  3. 도움말 · 에러 메시지 자리 — 메시지가 나타나도 레이아웃이 밀리지 않도록 항상 자리를 잡는다
 *
 * 입력요소 쪽에는 소비자가 직접 `aria-invalid` 와 `aria-describedby={`${id}-message`}` 를
 * 넘겨야 한다. 래퍼가 children 을 cloneElement 로 조작하지 않는 이유는,
 * 어떤 입력요소가 오든(3rd-party 포함) 예측 가능하게 동작하게 하기 위해서다.
 */
export default function FormField({
	id,
	label,
	required,
	error,
	hint,
	children,
	className,
}: IFormFieldProps): React.ReactNode {
	const message = error ?? hint;

	return (
		<div className={cn('grid gap-1.5', className)}>
			<Label
				htmlFor={id}
				className="text-xs font-medium text-gray-700 dark:text-gray-300"
			>
				{label}
				{required && (
					<span
						className="text-destructive"
						aria-hidden="true"
					>
						*
					</span>
				)}
				{required && <span className="sr-only">필수 입력</span>}
			</Label>

			{children}

			{message && (
				<p
					id={`${id}-message`}
					// 에러는 즉시 읽히도록 alert, 도움말은 조용히 연결만 한다.
					role={error ? 'alert' : undefined}
					className={cn('text-[11px] leading-relaxed', error ? 'text-destructive' : 'text-gray-400 dark:text-gray-500')}
				>
					{message}
				</p>
			)}
		</div>
	);
}
