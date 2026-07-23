import { useCallback, useEffect, useState } from 'react';
import { ListTree } from 'lucide-react';

interface NavItem {
	id: string;
	title: string;
}

export interface ISectionNavProps {
	/** 바로가기 패널 상단에 표시할 제목. */
	title?: string;
}

/**
 * 페이지에 렌더링된 `SectionHeader` 들을 자동으로 수집해
 * 오른쪽에 고정되는 바로가기(목차) 메뉴를 만든다.
 *
 * - `SectionHeader` 가 붙인 `[data-section-nav]` 마커를 DOM 에서 탐색한다.
 * - IntersectionObserver 로 현재 보이는 섹션을 하이라이트한다(스크롤 스파이).
 * - 화면 너비가 좁아지면(`xl` 미만) 숨긴다.
 * - 해시 라우터를 쓰므로 `<a href="#id">` 대신 `scrollIntoView` 로 직접 이동한다.
 */
export default function SectionNav({ title = '바로가기' }: ISectionNavProps): React.ReactNode {
	const [items, setItems] = useState<NavItem[]>([]);
	const [activeId, setActiveId] = useState<string>('');

	// 1) SectionHeader 목록 수집
	useEffect(() => {
		const collect = () => {
			const nodes = Array.from(document.querySelectorAll<HTMLElement>('[data-section-nav]'));
			setItems(
				nodes
					.filter((n) => n.id)
					.map((n) => ({
						id: n.id,
						title: n.dataset.sectionTitle ?? n.textContent?.trim() ?? '',
					})),
			);
		};
		collect();
		// 지연 렌더링(비동기 콘텐츠) 대비로 다음 프레임에 한 번 더 수집한다.
		const raf = requestAnimationFrame(collect);
		return () => cancelAnimationFrame(raf);
	}, []);

	// 2) 스크롤 스파이 — 현재 화면에 보이는 섹션을 활성화
	useEffect(() => {
		if (items.length === 0) return;

		const observer = new IntersectionObserver(
			(entries) => {
				const visible = entries
					.filter((e) => e.isIntersecting)
					.sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
				if (visible[0]) setActiveId(visible[0].target.id);
			},
			// 상단 헤더 여백을 감안하고, 뷰포트 상단 1/3 지점에 들어온 섹션을 활성으로 본다.
			{ rootMargin: '-88px 0px -70% 0px', threshold: 0 },
		);

		items.forEach((it) => {
			const el = document.getElementById(it.id);
			if (el) observer.observe(el);
		});
		return () => observer.disconnect();
	}, [items]);

	const handleClick = useCallback((id: string) => {
		document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
	}, []);

	if (items.length === 0) return null;

	return (
		<nav
			aria-label={title}
			className="hidden xl:block fixed right-6 top-28 z-30 w-56"
		>
			<div className="rounded-2xl border border-gray-200/70 dark:border-gray-800 bg-white/80 dark:bg-gray-900/80 backdrop-blur shadow-sm p-3">
				<p className="px-2 pb-2 flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wide text-gray-400 dark:text-gray-500">
					<ListTree className="w-3.5 h-3.5" />
					{title}
				</p>
				<ul className="space-y-0.5 max-h-[70vh] overflow-y-auto">
					{items.map((it) => {
						const active = it.id === activeId;
						return (
							<li key={it.id}>
								<button
									type="button"
									onClick={() => handleClick(it.id)}
									aria-current={active ? 'true' : undefined}
									className={`group w-full flex items-center gap-2 rounded-lg px-2.5 py-1.5 text-left text-xs transition-colors ${
										active
											? 'bg-brand-50 text-brand-500 dark:bg-brand-500/12 dark:text-brand-400 font-medium'
											: 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-gray-200'
									}`}
								>
									<span
										className={`h-1.5 w-1.5 shrink-0 rounded-full transition-colors ${
											active
												? 'bg-brand-500 dark:bg-brand-400'
												: 'bg-gray-300 dark:bg-gray-600 group-hover:bg-gray-400'
										}`}
									/>
									<span className="truncate">{it.title}</span>
								</button>
							</li>
						);
					})}
				</ul>
			</div>
		</nav>
	);
}
