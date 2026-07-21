import * as React from 'react';
import { Accordion as AccordionPrimitive } from 'radix-ui';

import { cn } from '@/shared/utils/cn';
import { ChevronDownIcon, ChevronUpIcon } from 'lucide-react';

/**
 * Accordion 테마 계약(공개 CSS 변수)
 * ------------------------------------------------------------------
 * 내부 구조(data-slot/aria-expanded)를 몰라도 아래 변수만 세팅하면 조정된다.
 * 임의의 상위 요소(예: 래퍼 div)에 선언하면 하위 Accordion 에 상속된다.
 *
 *   --accordion-icon-rotate    열림 시 아이콘 회전 각도            (기본 180deg)
 *   --accordion-icon-duration  아이콘 회전 전환 속도              (기본 200ms)
 *   --accordion-icon-size      트리거 아이콘 크기                 (기본 1rem)
 *   --accordion-content-duration  펼침/접힘 애니메이션 속도        (기본 0.2s)
 *
 * 색상은 이 변수들이 아니라 디자인 토큰(--muted-foreground/--border/--ring)이,
 * 개별 인스턴스의 패딩·폰트 등은 각 파트의 className 이 담당한다.
 */
function Accordion({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Root>) {
	return (
		<AccordionPrimitive.Root
			data-slot="accordion"
			className={cn('flex w-full flex-col', className)}
			{...props}
		/>
	);
}

function AccordionItem({ className, ...props }: React.ComponentProps<typeof AccordionPrimitive.Item>) {
	return (
		<AccordionPrimitive.Item
			data-slot="accordion-item"
			className={cn('not-last:border-b', className)}
			{...props}
		/>
	);
}

function AccordionTrigger({
	className,
	children,
	icon,
	expandedIcon,
	...props
}: React.ComponentProps<typeof AccordionPrimitive.Trigger> & {
	/** 닫힘(기본) 상태 아이콘. 미지정 시 기본 Chevron 사용. 단독 지정 시 열릴 때 180° 회전한다. */
	icon?: React.ReactNode;
	/** 열림 상태 전용 아이콘. 지정하면 icon(닫힘)과 서로 교체 렌더한다(예: Plus ↔ Minus). */
	expandedIcon?: React.ReactNode;
}) {
	// 아이콘 렌더링 규칙:
	//  1) icon/expandedIcon 모두 미지정 → 기존 기본 동작(Chevron 교체) 유지 (하위호환)
	//  2) 둘 다 지정            → 닫힘=icon, 열림=expandedIcon 으로 서로 교체
	//  3) icon 만 지정          → 단일 아이콘을 열릴 때 180° 회전
	const renderIcon = () => {
		if (icon === undefined && expandedIcon === undefined) {
			return (
				<>
					<ChevronDownIcon
						data-slot="accordion-trigger-icon"
						className="pointer-events-none shrink-0 group-aria-expanded/accordion-trigger:hidden"
					/>
					<ChevronUpIcon
						data-slot="accordion-trigger-icon"
						className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline"
					/>
				</>
			);
		}
		if (expandedIcon !== undefined) {
			return (
				<>
					<span
						data-slot="accordion-trigger-icon"
						className="pointer-events-none inline-flex shrink-0 group-aria-expanded/accordion-trigger:hidden [&>svg]:size-(--accordion-icon-size,1rem)"
					>
						{icon ?? <ChevronDownIcon />}
					</span>
					<span
						data-slot="accordion-trigger-icon"
						className="pointer-events-none hidden shrink-0 group-aria-expanded/accordion-trigger:inline-flex [&>svg]:size-(--accordion-icon-size,1rem)"
					>
						{expandedIcon}
					</span>
				</>
			);
		}
		// 단일 아이콘은 열릴 때 회전한다. 회전 각도/속도는 공개 CSS 변수로 노출하여
		// 퍼블리셔가 내부 구조(data-slot/aria-expanded)를 몰라도 변수만 세팅하면 조정되게 한다.
		//   --accordion-icon-rotate   : 열림 시 회전 각도 (기본 180deg)
		//   --accordion-icon-duration : 회전 전환 속도   (기본 200ms)
		return (
			<span
				data-slot="accordion-trigger-icon"
				className="pointer-events-none inline-flex shrink-0 transition-transform duration-(--accordion-icon-duration,200ms) group-aria-expanded/accordion-trigger:transform-[rotate(var(--accordion-icon-rotate,180deg))] [&>svg]:size-(--accordion-icon-size,1rem)"
			>
				{icon}
			</span>
		);
	};

	return (
		<AccordionPrimitive.Header className="flex">
			<AccordionPrimitive.Trigger
				data-slot="accordion-trigger"
				className={cn(
					'group/accordion-trigger relative flex flex-1 items-start justify-between rounded-lg border border-transparent py-2.5 text-left text-sm font-medium transition-all outline-none hover:underline focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 focus-visible:after:border-ring disabled:pointer-events-none disabled:opacity-50 **:data-[slot=accordion-trigger-icon]:ml-auto **:data-[slot=accordion-trigger-icon]:size-(--accordion-icon-size,1rem) **:data-[slot=accordion-trigger-icon]:text-muted-foreground',
					className,
				)}
				{...props}
			>
				{children}
				{renderIcon()}
			</AccordionPrimitive.Trigger>
		</AccordionPrimitive.Header>
	);
}

function AccordionContent({ className, children, ...props }: React.ComponentProps<typeof AccordionPrimitive.Content>) {
	return (
		<AccordionPrimitive.Content
			data-slot="accordion-content"
			className="overflow-hidden text-sm data-open:animate-accordion-down data-closed:animate-accordion-up [--tw-animation-duration:var(--accordion-content-duration,0.2s)]"
			{...props}
		>
			<div
				className={cn(
					'h-(--radix-accordion-content-height) pt-0 pb-2.5 [&_a]:underline [&_a]:underline-offset-3 [&_a]:hover:text-foreground [&_p:not(:last-child)]:mb-4',
					className,
				)}
			>
				{children}
			</div>
		</AccordionPrimitive.Content>
	);
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent };
