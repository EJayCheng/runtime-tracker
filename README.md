# Runtime Tracker

## Getting Started

[GitHub](https://github.com/EJayCheng/runtime-tracker) / [npm](https://www.npmjs.com/package/runtime-tracker)

`npm i runtime-tracker --save`

```typescript=
import { RuntimeTracker } from "runtime-tracker";

let A = new RuntimeTracker("A");
A.step("A-1").step("A-1-1");
A.step("A-1").step("A-1-2");
await delay(100);
A.step("A-2");
await delay(200);
A.step("A-3").step("A-3-1");
A.end();
console.log(A.toString());
// [A]: 1,004 ms
//    ├ [A-1]: 1,004 ms
//    │   ├ [A-1-1]: 1,004 ms
//    │   └ [A-1-2]: 1,004 ms
//    ├ [A-2]: 1,004 ms
//    └ [A-3]: 0 ms
//       └ [A-3-1]: 0 ms
```
