import { Button } from '@/shared/components/shadcn/components/ui/button';

export default function MainIndex(): React.ReactNode {
	return (
		<div>
			<h1>Main Index</h1>
			<Button onClick={() => $router.push('/example/account-page')}>계좌 메인 페이지로 이동</Button>
		</div>
	);
}
