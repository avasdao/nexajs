/* Import modules. */
import {
    bigIntToCompactUint,
    flattenBinArray,
} from '@nexajs/utils'

import encodeTransactionInput from './encodeTransactionInput.js'

export default (inputs) =>
    flattenBinArray([
        bigIntToCompactUint(BigInt(inputs.length)),
        ...inputs.map(encodeTransactionInput),
    ])
