/**
 * 포맷/배지를 적용해 셀 내용을 렌더하는 컴포넌트
 *
 * format → formatRegistry, badge → Badge 컴포넌트로 위임합니다.
 * 완전 커스텀이 필요하면 컬럼의 `cell`을 쓰세요 (이 컴포넌트를 거치지 않습니다).
 */
import { Badge } from '@axiom/components/ui';

import type { ISmartBadgeMap, SmartFormat } from '../types';
import { formatValue } from './formatRegistry';

export interface ICellFormatterProps {
	value: unknown;
	format?: SmartFormat;
	badge?: ISmartBadgeMap;
}

export default function CellFormatter({ value, format, badge }: ICellFormatterProps): React.ReactNode {
	// 배지 우선
	if (badge) {
		const key = value === null || value === undefined ? '' : String(value);
		const conf = badge.map?.[key];
		const label = conf?.label ?? (key === '' ? '-' : key);
		return (
			<Badge
				variant={conf?.variant ?? badge.fallbackVariant ?? 'secondary'}
				className={conf?.className}
			>
				{label}
			</Badge>
		);
	}

	const text = formatValue(format, value);
	return <>{text === '' ? '-' : text}</>;
}
