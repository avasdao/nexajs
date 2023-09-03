/* Import modules. */
import {
    bigIntToBinUint64LE,
    encodeDataPush,
} from '@bitauth/libauth'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

import { OP } from '@nexajs/script'

/**
 * Create a transaction P2PKT output with the data value.
 *
 * @function
 *
 * @param data  {Uint8Array} Null data.
 *
 * @returns {Promise<Output>} The P2PKT output script.
 */
export default async (_data) => {
    /* Initialize locals. */
    let amount
    let lockingBytecode

    /* Encode locking byte code. */
    lockingBytecode = encodeDataPush(_data)

    /* Encode amount. */
    amount = bigIntToBinUint64LE(BigInt(0))

    /* Create (data) output. */
    const dataOutput = {
        lockingBytecode,
        amount,
    }

    /* Return the output. */
    return dataOutput
}
