/**
 * Vite 환경변수(import.meta.env) 타입 선언.
 *
 * .env의 VITE_* 값에 타입을 입혀 자동완성과 타입검사를 받게 합니다.
 * (vite/client의 기본 선언은 [key: string]: any 라서 오타·타입오류를 잡지 못합니다)
 *
 * .env에 변수를 추가하면 여기에도 같이 등록하세요.
 * 등록하지 않은 키는 여전히 any로 통과합니다.
 *
 * ⚠️ 최상위 import/export를 추가하지 말 것 — 모듈이 되면 전역 선언이 깨집니다.
 */

// ⚠️ 최상위 import/export를 추가하지 말 것. 모듈이 되면 전역 augmentation이 깨진다.
interface ImportMetaEnv {
	readonly VITE_API_BASE_URL: string;
	readonly VITE_API_TIMEOUT: string;
	readonly VITE_ROUTER_BASENAME: string;
	readonly VITE_LOCALSTORAGE_TOKEN_NAME: string;
	readonly VITE_THEME_STORAGE_KEY: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
