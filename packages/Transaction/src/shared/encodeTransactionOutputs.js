/* Import modules. */
import {
    bigIntToCompactUint,
    flattenBinArray,
} from '@nexajs/utils'

import encodeTransactionOutput from './encodeTransactionOutput.js'

export default (outputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(outputs.length)),
        ...outputs.map(encodeTransactionOutput),
    ])
