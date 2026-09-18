# 규칙 폴더(`.axiom/rules/`) 쓰는 법

여기 있는 것은 **확장을 다시 빌드하지 않고 고칠 수 있는 규약 데이터**입니다.
읽는 문서(`.axiom/guide/` · `.axiom/knowledge/`)와 나눠 둔 이유는 **검증 방식이 다르기 때문**입니다 —
여기 TSX 골격은 lint를 통과해야 하고, 틀리면 생성물이 바로 깨집니다. md 문서는 틀려도 답만 나빠집니다.

## 폴더가 곧 종류입니다

```
.axiom/rules/
├── _routing.md            언제 무엇을 붙일까 (자원과 분리)
├── core-rules.md          핵심 규칙          → kind: core-rules
├── contracts/*.md         계약카드 본문      → kind: contract
├── page-templates/*.tsx   페이지 골격        → kind: page-template
├── components.json        컴포넌트 목록·prop → kind: component
├── tokens/*               디자인 토큰        → kind: tokens
├── <아무 폴더>/*.md        그 밖의 지식       → kind: doc  ← 탈출구
└── vendor/<이름>/         외부에서 받은 것 (모양은 같고 폴더만 다름)
```

- **`id`는 파일명**입니다(확장자 제외). `contracts/use-api.md` → `use-api`.
- **`kind`는 폴더**입니다. 모르는 폴더에 넣으면 `doc`이 됩니다 — **모르겠으면 그냥 md로 넣으세요.**
- **`origin`(번들/vendor/로컬)은 적지 않습니다.** 파일이 어디 있느냐로 확장이 정합니다.

그래서 `.tsx` 골격처럼 frontmatter를 달 수 없는 파일도 그냥 자원이 됩니다.

## frontmatter는 선택입니다

필요할 때만 답니다. 적으면 파일 위치보다 **그쪽이 이깁니다.**

```markdown
---
id: badge-component      # 안 적으면 파일명
kind: contract           # 안 적으면 폴더
axiomSchema: 1           # 안 적으면 현재 판
title: 뱃지 컴포넌트      # 진단 창에 보이는 이름
---
- Badge는 `@/shared/lib/shadcn/ui`에서 가져옵니다
- variant는 default·secondary·destructive·outline 넷뿐입니다
```

`---` 블록 **아래 본문이 그대로 프롬프트에 실립니다.**

## 컴포넌트 목록(`components.json`)

새 UI 부품을 추가했을 때 **확장을 다시 빌드하지 않고** 채팅에게 알리는 자리입니다.
모양은 `{ 컴포넌트이름: { import, source, props, domNote } }` 하나뿐입니다.

```json
{
  "axiomSchema": 1,
  "components": {
    "Sonner": {
      "import": "@axiom/components/ui",
      "source": "src/shared/lib/shadcn/ui/sonner.tsx",
      "domNote": true,
      "props": [
        { "name": "position", "type": "'top-right' | 'bottom-right'", "required": false, "doc": "토스트 위치" }
      ]
    }
  }
}
```

- **이름은 PascalCase**여야 합니다 — 감지(`<Toaster` · 평문 `Toaster`)가 그 전제로 돕니다.
- `import`를 빼면 배럴(`@axiom/components/ui`), `domNote`를 빼면 `false`가 기본값입니다.
- `props`에는 **그 부품 고유의 prop만** 적습니다(`className`·`onClick` 같은 표준 DOM 속성은 뺍니다).
- `aliases`로 **사람이 부르는 다른 이름**을 붙일 수 있습니다(아래 참고).
- 고친 뒤 명령 팔레트 → **`Axiom AI: 컴포넌트 목록 다시 읽기`**. 몇 종을 읽었는지 알려 줍니다.

**한 항목이 틀리면 그 항목만 빠지고** 나머지는 그대로 삽니다(사유는 Output `axiom-ai: Corpus`에).
쓸 항목이 하나도 안 남으면 파일을 통째로 물리고 확장에 박힌 목록으로 돌아갑니다 —
목록이 0종이면 컴포넌트 감지가 전부 멎기 때문입니다.

### 부르는 이름이 다를 때 — `aliases`

export 이름과 사람이 부르는 이름이 다른 부품이 있습니다. `sonner.tsx`가 내놓는 것은 `Toaster`인데
문서도 사람도 "Toast"라고 부릅니다. 그대로 두면 "Toast 옵션 알려줘"에 **prop 표가 안 붙습니다.**

```json
"Toaster": { "…": "…", "aliases": ["Toast", "토스트"] }
```

- 별칭으로 걸려도 답에는 **정식 이름**(`Toaster`)으로 나옵니다.
- 영문 별칭은 낱말 단위로 봅니다(`toasted` 안에는 안 걸립니다). **한글 별칭은 부분 일치**입니다.
- 가이드 문서 이름에서 유추되는 별칭은 **다시 굽기가 자동으로** 넣습니다(애매하면 안 넣습니다).

### 프로젝트 소스에서 다시 굽기

부품을 새로 만들었으면 손으로 적지 말고 **`Axiom AI: 컴포넌트 목록 다시 굽기 (프로젝트 소스에서)`**.
`src/shared/ui/index.ts` 배럴이 export하는 것을 읽어 목록을 새로 만듭니다.

- 프로젝트의 `node_modules/typescript`를 씁니다(확장은 컴파일러를 동봉하지 않습니다).
  없으면 **아무것도 안 건드리고** 알려 줍니다 — `npm install` 후 다시 하세요.
- 덮기 전에 **무엇이 추가/삭제/변경되는지 보여주고 묻습니다.** 기존 파일은 `components.json.bak`으로 남습니다.
- 소스를 못 읽거나 결과가 0종이면 **쓰지 않습니다.**
- 배럴이 export하지 않는 부품은 안 들어옵니다 — **배럴이 진실원**입니다.

## 겹칠 때 · 틀릴 때

같은 `id`면 **뒤가 이깁니다**: `번들 기본값 → vendor/<이름> → 로컬`.
프로젝트가 직접 고친 것이 언제나 최종입니다.

| 사고 | 어떻게 되나 |
| --- | --- |
| `id` 충돌 | 뒤가 이기고 **누가 누구를 덮었는지** Output·진단 창에 남습니다 |
| 파일이 깨짐(문법·JSON·스키마) | **그 파일만** 빠지고 같은 id의 번들 기본값이 대신 삽니다 |
| 모르는 `kind` | 그 파일만 건너뛰고 경고 — `kind:`를 지우면 `doc`으로 들어옵니다 |
| 라우팅이 없는 자원을 가리킴 | 경고. 대소문자만 다르면 "혹시 이것입니까?"까지 알려 줍니다 |

**조용히 넘어가는 경우는 없습니다.** 전부 Output(`Axiom AI`)과 진단 명령에 남습니다.

## 되돌리기

- 명령 팔레트 → **`Axiom AI: 규칙 재시드`** — 누락 파일만 복구 / 번들로 전체 원복
- 명령 팔레트 → **`Axiom AI: 이 요청에 무엇이 붙었나`** — 지금 무엇이 붙는지 확인
- 명령 팔레트 → **`Axiom AI: 컴포넌트 목록 다시 읽기`** — `components.json`을 고친 뒤 즉시 반영
- 명령 팔레트 → **`Axiom AI: 컴포넌트 목록 다시 굽기`** — 프로젝트 소스에서 목록을 새로 만들기

## id 규칙

공백 · `/` · `\` 를 쓸 수 없고 `_` `.` 로 시작할 수 없습니다. **그 밖에는 한글도 됩니다** —
`사내표준/명명규칙.md` 를 그대로 넣으면 id가 `명명규칙`인 `doc` 자원이 됩니다.

단, `Badge`와 `badge`는 **다른 id**입니다(정확히 일치해야 덮어쓰기·붙이기가 됩니다).
