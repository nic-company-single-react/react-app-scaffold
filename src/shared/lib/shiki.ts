import { createHighlighter, type Highlighter } from 'shiki';
let highlighterPromise: Promise<Highlighter> | null = null;
export function getHighlighter(): Promise<Highlighter> {
  if (!highlighterPromise) {
    highlighterPromise = createHighlighter({
      themes: ['github-dark', 'github-light', 'one-dark-pro'],
      langs: ['tsx', 'ts', 'js', 'jsx', 'json', 'css', 'html', 'bash'],
    });
  }
  return highlighterPromise;
}
그리고 컴포넌트의 useEffect 부분을 아래처럼 교체하세요:


// index.tsx 의 useEffect 부분 교체
useEffect(() => {
  isMounted.current = true;
  getHighlighter().then((hl) => {
    if (isMounted.current) {
      setHtml(hl.codeToHtml(code, { lang, theme }));
    }
  });
  return () => {
    isMounted.current = false;
  };
}, [code, lang, theme]);