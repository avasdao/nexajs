import {
    flattenBinArray,
} from '@bitauth/libauth'

import { bigIntToCompactUint } from './_bigIntToCompactUint.js'
import { encodeTransactionInput } from './_encodeTransactionInput.js'

export const encodeTransactionInputs = (inputs) =>
  flattenBinArray([
    bigIntToCompactUint(BigInt(inputs.length)),
    ...inputs.map(encodeTransactionInput),
  ]);
