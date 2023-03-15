import { flattenBinArray } from '@bitauth/libauth'

import bigIntToCompactUint from './utils/bigIntToCompactUint.js'
// import encodeTransactionOutput from './encodeTransactionOutput.js'

export default (outputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(outputs.length)),
        // ...outputs.map(encodeTransactionOutput),
    ])
