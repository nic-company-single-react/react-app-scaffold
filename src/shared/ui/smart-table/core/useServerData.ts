/**
 * 서버 모드 데이터 훅
 *
 * 내부 {page,size,sort,keyword} state를 paramMap으로 서버 네이밍으로 변환해
 * useApi의 params로 결선합니다. params가 바뀌면 queryKey가 바뀌어 자동 refetch됩니다.
 * 클라이언트 모드에서도 Rules of Hooks 준수를 위해 항상 호출되며, enabled로 비활성화됩니다.
 */
import { useEffect, useMemo, useState } from 'react';
import type { SortingState } from '@tanstack/react-table';

import { useApi } from '@axiom/hooks';
import type { QueryParams, THttpMethod } from '@/core/types/api-types';

import type { ISmartServerParamMap, ISmartSelectResult, SmartSelect } from '../types';

const DEFAULT_PARAM_MAP: Required<ISmartServerParamMap> = {
	page: 'page',
	size: 'size',
	sort: 'sort',
	order: 'order',
	keyword: 'keyword',
	pageBase: 1,
};

/** 표준 응답 메타가 없으므로 흔한 형태를 순차 추론하는 기본 어댑터 */
export function defaultSelect<TRaw, TRow>(raw: TRaw | undefined): ISmartSelectResult<TRow> {
	if (raw === undefined || raw === null) return { rows: [], total: 0 };
	if (Array.isArray(raw)) return { rows: raw as TRow[], total: raw.length };

	const obj = raw as Record<string, unknown>;
	const rows = (obj.content ?? obj.rows ?? obj.list ?? obj.items ?? obj.data ?? []) as TRow[];
	const total = (obj.totalElements ??
		obj.totalCount ??
		obj.total ??
		obj.count ??
		(Array.isArray(rows) ? rows.length : 0)) as number;
	return { rows: Array.isArray(rows) ? rows : [], total: Number(total) || 0 };
}

export interface IUseServerDataOptions<TRaw, TRow> {
	enabled: boolean;
	endpoint: string;
	method?: THttpMethod;
	fixedParams?: Record<string, string | number | boolean>;
	paramMap?: ISmartServerParamMap;
	pageSize: number;
	select?: SmartSelect<TRaw, TRow>;
}

export interface IUseServerDataResult<TRow> {
	rows: TRow[];
	total: number;
	page: number;
	size: number;
	sorting: SortingState;
	keyword: string;
	setPage: (page: number) => void;
	setSize: (size: number) => void;
	setSorting: (sorting: SortingState) => void;
	setKeyword: (keyword: string) => void;
	isLoading: boolean;
	isFetching: boolean;
	isError: boolean;
	refetch: () => void;
}

export function useServerData<TRaw, TRow>(
	options: IUseServerDataOptions<TRaw, TRow>,
): IUseServerDataResult<TRow> {
	const { enabled, endpoint, method = 'GET', fixedParams, paramMap, pageSize, select } = options;
	const map = useMemo(() => ({ ...DEFAULT_PARAM_MAP, ...paramMap }), [paramMap]);

	const [page, setPage] = useState(0); // 0-base 내부
	const [size, setSize] = useState(pageSize);
	const [sorting, setSorting] = useState<SortingState>([]);
	const [keyword, setKeyword] = useState('');
	const [debouncedKeyword, setDebouncedKeyword] = useState('');

	// 검색어 디바운스 (네트워크 절약)
	useEffect(() => {
		const t = setTimeout(() => {
			setDebouncedKeyword(keyword);
			setPage(0);
		}, 300);
		return () => clearTimeout(t);
	}, [keyword]);

	const sort = sorting[0];
	const params: QueryParams = useMemo(() => {
		const p: QueryParams = { ...fixedParams };
		p[map.page] = page + map.pageBase;
		p[map.size] = size;
		if (sort) {
			p[map.sort] = sort.id;
			p[map.order] = sort.desc ? 'desc' : 'asc';
		}
		if (debouncedKeyword) p[map.keyword] = debouncedKeyword;
		return p;
	}, [fixedParams, map, page, size, sort, debouncedKeyword]);

	const query = useApi<TRaw>(endpoint || '__smart_table_noop__', {
		method,
		params,
		queryOptions: { enabled: enabled && !!endpoint },
	});

	const { rows, total } = useMemo<ISmartSelectResult<TRow>>(() => {
		if (!enabled) return { rows: [], total: 0 };
		const raw = query.data;
		if (select) {
			if (raw === undefined || raw === null) return { rows: [], total: 0 };
			return select(raw);
		}
		if (import.meta.env.DEV && raw && !Array.isArray(raw)) {
			// 기본 어댑터 추론 안내 (dev 디버그)
			console.debug('[SmartTable] select 미지정 — 기본 어댑터로 응답을 추론합니다.', raw);
		}
		return defaultSelect<TRaw, TRow>(raw);
	}, [enabled, query.data, select]);

	return {
		rows,
		total,
		page,
		size,
		sorting,
		keyword,
		setPage,
		setSize,
		setSorting,
		setKeyword,
		isLoading: query.isLoading,
		isFetching: query.isFetching,
		isError: query.isError,
		refetch: () => void query.refetch(),
	};
}
