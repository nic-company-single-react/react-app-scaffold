---
id: date-picker
kind: contract
axiomSchema: 1
title: "날짜 선택 — Calendar 드롭다운 패턴 (레시피)"
---
- `<Input type="date">`(또는 날짜 입력)를 `Calendar`(@axiom/components/ui) 드롭다운으로 바꿀 때는 **아래 4부품을 모두** 출력하세요 — 하나라도 빠지면 달력이 동작하지 않습니다(import만 추가하고 끝내지 마세요):
  1) import: `<import module="@axiom/components/ui" named="Calendar" />`
  2) `<hook>`에 **열림 state + 바깥영역 ref** (이 컨트롤 전용 새 이름으로): `const [pickerOpen, setPickerOpen] = useState(false);` 와 `const pickerRef = useRef<HTMLDivElement>(null);`
  3) `<hook>`에 **바깥 클릭 시 닫기 effect** — 이 `useEffect`는 미러링이 아니라 정당한 UI 패턴이므로 **반드시 추가**하세요: `useEffect(() => { const h = (e: MouseEvent): void => { if (pickerRef.current && !pickerRef.current.contains(e.target as Node)) setPickerOpen(false); }; document.addEventListener('mousedown', h); return () => document.removeEventListener('mousedown', h); }, []);`
  4) `<region>`의 입력칸을 **버튼 + 조건부 Calendar**로(영역 최상위 태그는 그대로 유지): `<div ref={pickerRef} className="relative"><Button variant="outline" onClick={() => setPickerOpen((v) => !v)}>{날짜값 || '날짜 선택'}</Button>{pickerOpen && <Calendar mode="single" selected={…} onSelect={(d) => { …기존 문자열 state에 반영…; setPickerOpen(false); }} />}</div>`
- ⚠ 기존 날짜 문자열 state(API 전송용 `yyyy-MM-dd` 등)는 **그대로 유지**하고 Calendar 선택 결과를 그 state에 반영하세요 — 서버 전송 포맷을 깨지 않도록 새 미러 state를 만들지 마세요.
