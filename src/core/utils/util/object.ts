import type { IObjectUtil } from '@/types/common';

/** 일반 객체(배열·null 제외)인지 확인합니다. */
function isPlainObject(v: unknown): v is Record<string, unknown> {
	return v !== null && typeof v === 'object' && !Array.isArray(v);
}

export const objectUtil: IObjectUtil = {
	isEmpty(value: unknown): boolean {
		if (value === null || value === undefined) return true;
		if (typeof value === 'string') return value.trim() === '';
		if (Array.isArray(value)) return value.length === 0;
		if (typeof value === 'object') return Object.keys(value).length === 0;
		return false;
	},

	deepClone(value: unknown): unknown {
		return structuredClone(value);
	},

	deepEqual(a: unknown, b: unknown): boolean {
		if (Object.is(a, b)) return true;
		if (typeof a !== 'object' || typeof b !== 'object' || a === null || b === null) return false;
		if (Array.isArray(a) !== Array.isArray(b)) return false;
		const ka = Object.keys(a as object);
		const kb = Object.keys(b as object);
		if (ka.length !== kb.length) return false;
		return ka.every((k) =>
			objectUtil.deepEqual((a as Record<string, unknown>)[k], (b as Record<string, unknown>)[k]),
		);
	},

	pick(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		const out: Record<string, unknown> = {};
		for (const k of keys) {
			if (k in obj) out[k] = obj[k];
		}
		return out;
	},

	omit(obj: Record<string, unknown>, keys: string[]): Record<string, unknown> {
		const exclude = new Set(keys);
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			if (!exclude.has(k)) out[k] = v;
		}
		return out;
	},

	get(obj: Record<string, unknown>, path: string, fallback?: unknown): unknown {
		let cur: unknown = obj;
		for (const part of path.split('.')) {
			if (cur === null || typeof cur !== 'object') return fallback;
			cur = (cur as Record<string, unknown>)[part];
		}
		return cur === undefined ? fallback : cur;
	},

	set(obj: Record<string, unknown>, path: string, value: unknown): Record<string, unknown> {
		const clone = structuredClone(obj);
		const parts = path.split('.');
		let cur: Record<string, unknown> = clone;
		for (let i = 0; i < parts.length - 1; i++) {
			const k = parts[i];
			if (!isPlainObject(cur[k])) cur[k] = {};
			cur = cur[k] as Record<string, unknown>;
		}
		cur[parts[parts.length - 1]] = value;
		return clone;
	},

	cleanEmpty(obj: Record<string, unknown>): Record<string, unknown> {
		const out: Record<string, unknown> = {};
		for (const [k, v] of Object.entries(obj)) {
			if (v === null || v === undefined || v === '') continue;
			if (isPlainObject(v)) {
				const nested = objectUtil.cleanEmpty(v);
				if (Object.keys(nested).length > 0) out[k] = nested;
			} else {
				out[k] = v;
			}
		}
		return out;
	},

	merge(target: Record<string, unknown>, source: Record<string, unknown>): Record<string, unknown> {
		const out = structuredClone(target);
		for (const [k, v] of Object.entries(source)) {
			if (isPlainObject(v) && isPlainObject(out[k])) {
				out[k] = objectUtil.merge(out[k] as Record<string, unknown>, v);
			} else {
				out[k] = structuredClone(v);
			}
		}
		return out;
	},
};
