import {
	Badge,
	Button,
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
	Separator,
} from '@axiom/components/ui';
import { Ban } from 'lucide-react';
import { ORDER_STATUS_META, type IOrder } from './order-data';

export interface IOrderDetailDialogProps {
	/** 열려 있는 대상 주문. `null` 이면 닫힘. */
	order: IOrder | null;
	/** 닫힘 요청 (배경 클릭 · ESC · 닫기 버튼) */
	onClose: () => void;
	/** 주문 취소 확정 — 목록 쪽 상태를 갱신하는 책임은 부모에게 있다. */
	onCancelOrder: (order: IOrder) => void;
}

/** 주문 상세의 한 줄 (라벨 + 값) */
function DetailRow({ label, children }: { label: string; children: React.ReactNode }): React.ReactNode {
	return (
		<>
			<dt className="text-xs text-gray-500 dark:text-gray-400">{label}</dt>
			<dd className="text-sm text-gray-800 dark:text-gray-200">{children}</dd>
		</>
	);
}

/**
 * 주문 상세 다이얼로그.
 *
 * 행마다 Dialog 를 만들지 않는다. DialogContent 는 Portal 로 body 밑에 렌더되므로
 * 행 안에 두는 건 위치상 의미가 없고, 행 수만큼 인스턴스만 늘어난다.
 * 목록 바깥에 **인스턴스 하나**를 두고 "어떤 행을 열지"만 `order` 로 넘긴다.
 */
export default function OrderDetailDialog({ order, onClose, onCancelOrder }: IOrderDetailDialogProps): React.ReactNode {
	/** 취소 가능 상태인지 — 이미 배송이 시작됐거나 취소된 주문은 막는다. */
	const cancelable = order ? order.status === 'pending' || order.status === 'paid' : false;

	const handleCancel = async () => {
		if (!order) return;
		// 되돌릴 수 없는 동작은 반드시 한 번 더 묻는다.
		const ok = await $ui.confirm({
			type: 'warning',
			title: '주문 취소',
			message: `${order.orderNo} 주문을 취소하시겠습니까?`,
			confirmText: '취소하기',
			cancelText: '닫기',
		});
		if (!ok) return;
		onCancelOrder(order);
		onClose();
	};

	return (
		<Dialog
			open={order !== null}
			onOpenChange={(open) => {
				if (!open) onClose();
			}}
		>
			<DialogContent>
				<DialogHeader>
					<DialogTitle>주문 상세</DialogTitle>
					<DialogDescription>목록에서 선택한 주문 한 건의 상세 정보입니다.</DialogDescription>
				</DialogHeader>

				{/* 닫히는 순간 order 가 null 이 되므로 본문은 존재할 때만 그린다. */}
				{order && (
					<div className="space-y-4">
						<div className="flex items-center justify-between gap-3">
							<span className="font-mono text-sm text-gray-700 dark:text-gray-300">{order.orderNo}</span>
							<Badge variant={ORDER_STATUS_META[order.status].variant}>{ORDER_STATUS_META[order.status].label}</Badge>
						</div>

						<Separator />

						<dl className="grid grid-cols-[5.5rem_1fr] items-center gap-x-4 gap-y-3">
							<DetailRow label="고객명">{order.customer}</DetailRow>
							<DetailRow label="연락처">
								<span className="font-mono">{$util.string.formatMobile(order.phone)}</span>
							</DetailRow>
							<DetailRow label="상품">{order.product}</DetailRow>
							<DetailRow label="결제 금액">
								<span className="font-mono font-semibold">{$util.number.currency(order.amount)}</span>
							</DetailRow>
							<DetailRow label="주문 경로">{order.channel}</DetailRow>
							<DetailRow label="주문일">{order.orderedAt}</DetailRow>
						</dl>

						{!cancelable && (
							<p className="rounded-lg bg-gray-50 px-3 py-2 text-[11px] leading-relaxed text-gray-500 dark:bg-gray-800/50 dark:text-gray-400">
								배송이 시작되었거나 이미 종료된 주문은 이 화면에서 취소할 수 없습니다.
							</p>
						)}
					</div>
				)}

				<DialogFooter showCloseButton>
					<Button
						variant="outline"
						onClick={handleCancel}
						disabled={!cancelable}
						className="gap-1.5 text-destructive"
					>
						<Ban className="size-3.5" />
						주문 취소
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
