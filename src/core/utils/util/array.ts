import type { IArrayUtil } from '@/types/common';

export const arrayUtil: IArrayUtil = {
	groupBy(array: Record<string, unknown>[], key: string): Record<string, Record<string, unknown>[]> {
		const out: Record<string, Record<string, unknown>[]> = {};
		for (const item of array) {
			const g = String(item[key]);
			(out[g] ??= []).push(item);
		}
		return out;
	},

	sortBy(
		array: Record<string, unknown>[],
		key: string,
		order: 'asc' | 'desc' = 'asc',
	): Record<string, unknown>[] {
		const dir = order === 'desc' ? -1 : 1;
		// 원본을 건드리지 않도록 복사 후 정렬합니다.
		return [...array].sort((a, b) => {
			const av = a[key] as never;
			const bv = b[key] as never;
			if (av < bv) return -dir;
			if (av > bv) return dir;
			return 0;
		});
	},

	sum(array: number[]): number {
		return array.reduce((acc, n) => acc + (Number(n) || 0), 0);
	},

	sumBy(array: Record<string, unknown>[], key: string): number {
		return array.reduce((acc, item) => acc + (Number(item[key]) || 0), 0);
	},

	uniq(array: unknown[]): unknown[] {
		return [...new Set(array)];
	},

	uniqBy(array: Record<string, unknown>[], key: string): Record<string, unknown>[] {
		const seen = new Set<unknown>();
		const out: Record<string, unknown>[] = [];
		for (const item of array) {
			const k = item[key];
			if (!seen.has(k)) {
				seen.add(k);
				out.push(item);
			}
		}
		return out;
	},

	chunk(array: unknown[], size: number): unknown[][] {
		if (size <= 0) return [];
		const out: unknown[][] = [];
		for (let i = 0; i < array.length; i += size) {
			out.push(array.slice(i, i + size));
		}
		return out;
	},

	toTree(
		flat: Record<string, unknown>[],
		idKey: string = 'id',
		parentKey: string = 'parentId',
		childrenKey: string = 'children',
	): Record<string, unknown>[] {
		const map = new Map<unknown, Record<string, unknown>>();
		const roots: Record<string, unknown>[] = [];
		// 1단계: 각 노드를 children 배열을 가진 복사본으로 등록합니다.
		for (const node of flat) {
			map.set(node[idKey], { ...node, [childrenKey]: [] });
		}
		// 2단계: 부모를 찾아 연결하고, 없으면 루트로 둡니다.
		for (const node of map.values()) {
			const pid = node[parentKey];
			const parent = pid != null ? map.get(pid) : undefined;
			if (parent) (parent[childrenKey] as Record<string, unknown>[]).push(node);
			else roots.push(node);
		}
		return roots;
	},

	flattenTree(tree: Record<string, unknown>[], childrenKey: string = 'children'): Record<string, unknown>[] {
		const out: Record<string, unknown>[] = [];
		const walk = (nodes: Record<string, unknown>[]) => {
			for (const node of nodes) {
				const { [childrenKey]: children, ...rest } = node;
				out.push(rest);
				if (Array.isArray(children) && children.length > 0) walk(children as Record<string, unknown>[]);
			}
		};
		walk(tree);
		return out;
	},
};
