import { Button } from '@axiom/components/ui';

export interface IPresetButtonProps {
	/** 버튼에 표시할 문구 (예: '오늘', '1주일') */
	label: string;
	/** 현재 선택된 프리셋인지 여부 */
	active?: boolean;
	onClick: () => void;
}

/** 달력 옆에 붙여 날짜를 빠르게 지정하는 프리셋 칩. scaffold Button 을 그대로 사용한다. */
export default function PresetButton({ label, active = false, onClick }: IPresetButtonProps): React.ReactNode {
	return (
		<Button
			type="button"
			size="sm"
			variant={active ? 'default' : 'outline'}
			aria-pressed={active}
			onClick={onClick}
		>
			{label}
		</Button>
	);
}
