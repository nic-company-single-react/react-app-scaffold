import { Input, Label } from '@axiom/components/ui';

export interface IFieldProps {
	label: string;
	value: string;
	onChange: (v: string) => void;
	type?: string;
	placeholder?: string;
	className?: string;
}

/** 작은 라벨 + 인풋 묶음 (유틸 데모 입력 필드) */
export default function Field({
	label,
	value,
	onChange,
	type = 'text',
	placeholder,
	className = '',
}: IFieldProps): React.ReactNode {
	return (
		<div className={`space-y-1.5 ${className}`}>
			<Label className="text-xs text-gray-500 dark:text-gray-400">{label}</Label>
			<Input
				type={type}
				value={value}
				placeholder={placeholder}
				onChange={(e) => onChange(e.target.value)}
				className="font-mono"
			/>
		</div>
	);
}
