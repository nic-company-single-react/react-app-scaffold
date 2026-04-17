import { Button } from '@/shared/components/shadcn/components/ui/button';

export default function MainIndex(): React.ReactNode {
	return (
		<div>
			<h1>Main Index</h1>
			<Button onClick={() => alert('Button clicked')}>Click me</Button>
		</div>
	);
}
