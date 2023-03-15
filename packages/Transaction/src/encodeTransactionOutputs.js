import { flattenBinArray } from '@bitauth/libauth'

import bigIntToCompactUint from './utils/bigIntToCompactUint.js'
// import encodeTransactionOutput from './encodeTransactionOutput.js'

export const encodeTransactionOutputs = (outputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(outputs.length)),
        // ...outputs.map(encodeTransactionOutput),
    ])
