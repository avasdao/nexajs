# NEXA.js Token

Manage group token assets.


## Request TOP Tokens

```js
import { getTopTokens } from '@nexajs/token'

const tokens = await getTopTokens()
console.log(tokens)
// [
//   {
//     token: 'nexa:tzpkl799rmczewlerpu7ck7fywkp828vj3tvqqquaewpaxyhzqqqqk96tks5p',
//     tokenIdHex: '836ff8a51ef02cbbf91879ec5bc923ac13a8ec9456c0001cee5c1e9897100000',
//     name: 'subgroup',
//     ticker: 'TOG',
//     documentUrl: 'nexa:tq94wt0kxx75saepz6tmpedykr2pkyvldn7wmqvhqkvgfxa7fyqqq0szwfew7',
//     documentHash: '0a657265682073617720474f54202e4c4f4c203f646574696d696c6e55206e69',
//     decimals: null,
//     txCount: 6232
//   },
//   ...
// ]
```
