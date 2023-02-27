import {
    flattenBinArray,
} from '@bitauth/libauth'

import { bigIntToCompactUint } from './_bigIntToCompactUint.js'
// import { encodeTransactionOutput } from './_encodeTransactionOutput.js'

export const encodeTransactionOutputs = (outputs) =>
  flattenBinArray([
    bigIntToCompactUint(BigInt(outputs.length)),
    // ...outputs.map(encodeTransactionOutput),
  ]);
