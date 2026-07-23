import { useEffect, useRef, useState } from 'react';
import { Progress, Button } from '@axiom/components/ui';
import { FileText, RotateCcw, UploadCloud } from 'lucide-react';
import styles from './UploadProgressCard.module.css';

/**
 * 파일 업로드 진행률 카드 (실전 예제)
 *
 * scaffold가 제공하는 Progress(@axiom/components/ui)를 **그대로** 쓰되,
 * 스타일은 UploadProgressCard.module.css 에서 data-slot 선택자로 완전히 교체했다.
 * (트랙 높이·색, 인디케이터 그라데이션, 진행 중 광택 줄무늬 등)
 *
 * 업로드 동작은 setInterval 로 시뮬레이션한다. 실제 프로젝트에서는
 * XHR/fetch 의 progress 이벤트에서 setValue(...) 만 호출하면 된다.
 */
export default function UploadProgressCard(): React.ReactNode {
	const [value, setValue] = useState(0);
	const [uploading, setUploading] = useState(false);
	const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

	const clear = () => {
		if (timerRef.current) {
			clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const start = () => {
		clear();
		setValue(0);
		setUploading(true);
		timerRef.current = setInterval(() => {
			setValue((prev) => {
				// 뒤로 갈수록 느려지는 자연스러운 곡선
				const next = prev + Math.max(1, Math.round((100 - prev) / 12));
				if (next >= 100) {
					clear();
					setUploading(false);
					return 100;
				}
				return next;
			});
		}, 220);
	};

	const reset = () => {
		clear();
		setUploading(false);
		setValue(0);
	};

	// 언마운트 시 타이머 정리
	useEffect(() => clear, []);

	const done = value >= 100;

	return (
		<div
			className={styles.card}
			data-active={uploading ? 'true' : 'false'}
		>
			<div className={styles.head}>
				<div className={styles.fileIcon}>
					<FileText className="w-5 h-5" />
				</div>
				<div className={styles.meta}>
					<p className={styles.fileName}>2026_상반기_결산보고서.pdf</p>
					<p className={styles.fileSize}>
						{(24.6 * (value / 100)).toFixed(1)} MB / 24.6 MB
					</p>
				</div>
				<span className={styles.percent}>{value}%</span>
			</div>

			{/* scaffold Progress — 컴포넌트는 그대로, 스타일만 .card 래퍼의
			    data-slot 선택자(module.css)로 교체된다. */}
			<Progress value={value} />

			<div className={styles.foot}>
				<span className={styles.status}>
					{done ? (
						<span className={styles.done}>✓ 업로드 완료</span>
					) : uploading ? (
						'업로드 중…'
					) : (
						'대기 중'
					)}
				</span>
				<div className="flex items-center gap-2">
					<Button
						type="button"
						size="sm"
						variant="outline"
						onClick={reset}
						disabled={uploading || value === 0}
						className="gap-1.5"
					>
						<RotateCcw className="w-3.5 h-3.5" />
						초기화
					</Button>
					<Button
						type="button"
						size="sm"
						onClick={start}
						disabled={uploading}
						className="gap-1.5"
					>
						<UploadCloud className="w-4 h-4" />
						{done ? '다시 업로드' : '업로드 시작'}
					</Button>
				</div>
			</div>
		</div>
	);
}
