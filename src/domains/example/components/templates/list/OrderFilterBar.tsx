import {
	Button,
	Input,
	Label,
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@axiom/components/ui';
import { RotateCcw, Search } from 'lucide-react';
import { ORDER_STATUS_OPTIONS, PERIOD_OPTIONS, type IOrderFilters } from './order-data';

export interface IOrderFilterBarProps {
	/** 입력 중인 조건(draft). 아직 목록에 반영되지 않은 값이다. */
	value: IOrderFilters;
	/** 입력 중인 조건 변경 */
	onChange: (next: IOrderFilters) => void;
	/** [조회] — draft 를 실제 조회 조건으로 확정한다. */
	onSearch: () => void;
	/** [초기화] — draft 와 조회 조건을 모두 기본값으로 되돌린다. */
	onReset: () => void;
	/** 조회 중이면 버튼을 잠근다. */
	loading?: boolean;
}

/**
 * 목록 화면 상단의 조회 조건 바.
 *
 * 이 컴포넌트는 조건을 **보여주고 수정할 뿐** 조회를 직접 하지 않는다.
 * 언제 조회할지(=draft 를 확정할지)는 부모가 `onSearch` 로 결정한다.
 * 덕분에 같은 조건 바를 클라이언트 필터링에도, 서버 조회에도 그대로 쓸 수 있다.
 */
export default function OrderFilterBar({
	value,
	onChange,
	onSearch,
	onReset,
	loading = false,
}: IOrderFilterBarProps): React.ReactNode {
	const set = <K extends keyof IOrderFilters>(key: K, v: IOrderFilters[K]) => onChange({ ...value, [key]: v });

	return (
		<form
			// 검색창에서 Enter 를 눌러도 조회되도록 form 으로 감싼다. (버튼 클릭과 동일 경로)
			onSubmit={(e) => {
				e.preventDefault();
				onSearch();
			}}
			className="rounded-2xl border border-gray-200 bg-white p-4 shadow-sm dark:border-gray-800 dark:bg-gray-900"
		>
			<div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-[1fr_10rem_10rem_auto] lg:items-end">
				<div className="grid gap-1.5">
					<Label
						htmlFor="filter-keyword"
						className="text-xs font-medium text-gray-600 dark:text-gray-400"
					>
						검색어
					</Label>
					<Input
						id="filter-keyword"
						value={value.keyword}
						onChange={(e) => set('keyword', e.target.value)}
						placeholder="주문번호 · 고객명 · 상품명"
					/>
				</div>

				<div className="grid gap-1.5">
					<Label
						htmlFor="filter-status"
						className="text-xs font-medium text-gray-600 dark:text-gray-400"
					>
						주문 상태
					</Label>
					<Select
						value={value.status}
						onValueChange={(v) => set('status', v)}
					>
						<SelectTrigger
							id="filter-status"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{ORDER_STATUS_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="grid gap-1.5">
					<Label
						htmlFor="filter-period"
						className="text-xs font-medium text-gray-600 dark:text-gray-400"
					>
						주문 기간
					</Label>
					<Select
						value={value.period}
						onValueChange={(v) => set('period', v)}
					>
						<SelectTrigger
							id="filter-period"
							className="w-full"
						>
							<SelectValue />
						</SelectTrigger>
						<SelectContent>
							{PERIOD_OPTIONS.map((opt) => (
								<SelectItem
									key={opt.value}
									value={opt.value}
								>
									{opt.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>

				<div className="flex items-center gap-2 sm:col-span-2 lg:col-span-1">
					<Button
						type="submit"
						disabled={loading}
						className="flex-1 gap-1.5 lg:flex-none"
					>
						<Search className="size-3.5" />
						조회
					</Button>
					<Button
						type="button"
						variant="outline"
						onClick={onReset}
						disabled={loading}
						className="flex-1 gap-1.5 lg:flex-none"
					>
						<RotateCcw className="size-3.5" />
						초기화
					</Button>
				</div>
			</div>
		</form>
	);
}
