/**
 * 전역 오버레이 z-index 사다리 — **디자인 토큰**.
 *
 * 앱 헤더(AppHeader)가 sticky 로 z-99999 를 쓰므로 모든 오버레이는 그보다 커야 한다.
 * 헤더의 z 를 바꾸면 여기도 같이 올려야 하므로, core 가 아니라 퍼블리셔가 닿는 shared 에 둔다.
 *
 * 티어를 분리해두면 "alert/confirm 은 무엇보다 위" 같은 요구를 깊이 계산 없이 구조적으로 만족한다.
 *
 * ⚠️ Tailwind 는 런타임에 조합한 클래스(`z-[${n}]`)를 스캔하지 못해 CSS 를 생성하지 않는다.
 *    깊이별 값처럼 동적인 z-index 는 반드시 인라인 style 로 준다.
 *    (기존 `z-[100000]` 이 동작하는 것은 소스에 리터럴로 박혀 있기 때문이다)
 */

/** $ui.dialog 스택의 바닥. 컴포넌트형 Dialog/Drawer 와 같은 층에서 시작한다. */
export const Z_DIALOG_BASE = 100000;

/** $ui.dialog 스택 깊이 1당 증가폭. */
export const Z_DIALOG_STEP = 10;

/** $ui.alert / $ui.confirm — 어떤 dialog 보다도 위에 떠야 한다. */
export const Z_ALERT = 100500;

/** 토스트 — alert 보다도 위. */
export const Z_TOAST = 100600;

/**
 * 닫기 시 exit 애니메이션(Dialog/AlertDialog 의 duration-100)이 끝난 뒤
 * 큐·스택에서 항목을 제거하기까지의 지연(ms).
 * 즉시 제거하면 컴포넌트가 바로 언마운트되어 닫힘 애니메이션이 재생되지 않는다.
 *
 * ⚠️ 스킨에서 닫힘 애니메이션 길이를 바꾸면 이 값도 함께 맞춰야 한다.
 *    (짧으면 애니메이션이 잘리고, 길면 닫힌 뒤 빈 프레임이 남는다)
 */
export const CLOSE_ANIM_MS = 150;

/** 깊이(0부터)에 해당하는 $ui.dialog z-index 를 계산한다. */
export function getDialogZIndex(depth: number): number {
	return Z_DIALOG_BASE + depth * Z_DIALOG_STEP;
}
