import {
    flattenBinArray,
    numberToBinUintLE,
} from '@bitauth/libauth'

// import { binToHex } from '@nexajs/utils'

import { OP } from '@nexajs/script'

/**
 * Encode a single {@link Output} for inclusion in an encoded transaction.
 *
 * @param output - the output to encode
 */
export default (output) => {
    // console.log('\n  output.lockingBytecode', binToHex(output.lockingBytecode));

    /* Initialize version. */
    let version

    /* Handle version selection. */
    if (output.lockingBytecode[1] === OP.RETURN) {
        version = numberToBinUintLE(0)
    } else {
        version = numberToBinUintLE(1)
    }

    return new Uint8Array([
        version,
        ...output.amount,
        ...output.lockingBytecode,
    ])
}
