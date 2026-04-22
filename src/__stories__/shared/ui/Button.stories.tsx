import type { Meta, StoryObj } from '@storybook/react-vite';
import { Button } from '@axiom/components/ui';

const meta = {
	title: 'UI Components/Button',
	component: Button,
	tags: ['autodocs'],
	argTypes: {
		variant: {
			control: 'select',
			options: ['default', 'outline', 'secondary', 'ghost', 'destructive', 'link'],
			description: '버튼 스타일 변형',
		},
		size: {
			control: 'select',
			options: ['default', 'xs', 'sm', 'lg', 'icon', 'icon-xs', 'icon-sm', 'icon-lg'],
			description: '버튼 크기',
		},
		disabled: {
			control: 'boolean',
			description: '비활성화 여부',
		},
		children: {
			control: 'text',
			description: '버튼 내용',
		},
	},
	args: {
		children: '버튼',
		variant: 'default',
		size: 'default',
		disabled: false,
	},
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {};

export const Outline: Story = {
	args: { variant: 'outline' },
};

export const Secondary: Story = {
	args: { variant: 'secondary' },
};

export const Ghost: Story = {
	args: { variant: 'ghost' },
};

export const Destructive: Story = {
	args: { variant: 'destructive' },
};

export const Link: Story = {
	args: { variant: 'link' },
};

export const Disabled: Story = {
	args: { disabled: true },
};

export const AllVariants: Story = {
	name: '전체 변형 모음',
	render: () => (
		<div className="flex flex-wrap gap-3 p-4">
			<Button variant="default">Default</Button>
			<Button variant="outline">Outline</Button>
			<Button variant="secondary">Secondary</Button>
			<Button variant="ghost">Ghost</Button>
			<Button variant="destructive">Destructive</Button>
			<Button variant="link">Link</Button>
		</div>
	),
};

export const AllSizes: Story = {
	name: '전체 크기 모음',
	render: () => (
		<div className="flex flex-wrap items-center gap-3 p-4">
			<Button size="xs">XS</Button>
			<Button size="sm">SM</Button>
			<Button size="default">Default</Button>
			<Button size="lg">LG</Button>
		</div>
	),
};
