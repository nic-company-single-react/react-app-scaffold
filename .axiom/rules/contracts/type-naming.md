---
id: type-naming
kind: contract
axiomSchema: 1
title: "TypeScript 타입 네이밍·위치"
---
- 타입은 `type` + `T` 접두사(`type TUser = { … }`), 인터페이스는 `interface` + `I` 접두사(`interface IConfig { … }`). 접두사 없는 `type`/`interface` 선언 금지.
- API 응답/요청 타입은 `type` + `T`(interface 금지). Props 타입은 `type`, 접두사 없음.
- `type`/`interface`/`enum`은 컴포넌트 본문 안이 아니라 `export default function` **바로 위(모듈 스코프)** 에 선언합니다.
