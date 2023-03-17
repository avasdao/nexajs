import { flattenBinArray } from '@bitauth/libauth'
import { bigIntToCompactUint } from '@nexajs/utils'

import encodeTransactionOutput from './encodeTransactionOutput.js'

export default (outputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(outputs.length)),
        ...outputs.map(encodeTransactionOutput),
    ])
