---
id: global-util
kind: contract
axiomSchema: 1
title: "공통 포맷·변환 유틸 (전역 $util)"
---
- 숫자·날짜·문자열·금융·객체·배열 가공은 전역 `$util`로 합니다(import 불필요): `$util.number.comma(1234567)`("1,234,567") · `$util.number.currency(v)`("…원") · `$util.date.format(d, 'YYYY-MM-DD')` · `$util.string.mask(v, 3, 7)` · `$util.array.groupBy(rows, 'type')` 등.
- ⛔ 수동 포맷(`toLocaleString`·정규식 콤마·`Date` 직접 슬라이싱 등)이나 `import { numberUtil } …` 직접 임포트 대신 전역 `$util.*`를 쓰세요.
- 네임스페이스 6종: `number`·`date`·`string`·`finance`·`object`·`array`.
