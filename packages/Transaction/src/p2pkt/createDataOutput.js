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
 * Create a transaction P2PKH output with the given value.
 *
 * @function
 *
 * @param address  {string} Bitcoin Cash address to convert to P2PKT lock-code.
 * @param satoshis {number} Satoshi value to attach to output
 *
 * @returns {Promise<Output>} The P2PKT output script.
 */
export default async (_data) => {
    /* Initialize locking byte code. */
    let lockingBytecode

    /* Encode locking byte code. */
    lockingBytecode = encodeDataPush(hexToBin(_data))

    /* Encode locking byte code. */
    lockingBytecode = new Uint8Array([
        OP.RETURN,
        ...lockingBytecode
    ])

    /* Encode locking byte code. */
    lockingBytecode = encodeDataPush(lockingBytecode)
    // console.log('\n  Locking bytecode (hex):', binToHex(lockingBytecode))

    /* Create (data) output. */
    const dataOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(BigInt(0)),
    }

    /* Return the output. */
    return dataOutput
}
