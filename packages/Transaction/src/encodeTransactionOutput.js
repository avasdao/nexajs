import {
    bigIntToBinUint64LE,
    flattenBinArray,
    numberToBinUintLE,
} from '@bitauth/libauth'

import bigIntToCompactUint from './utils/bigIntToCompactUint.js'

/**
 * Encode a single {@link Output} for inclusion in an encoded transaction.
 *
 * @param output - the output to encode
 */
export default (output) => {
    return flattenBinArray([
        numberToBinUintLE(1),
        output.amount,
        output.lockingBytecode,
    ])
}
