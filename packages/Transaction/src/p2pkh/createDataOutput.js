/* Import modules. */
import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import { binToHex } from '@nexajs/utils'

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
    let lockingBytecode

    lockingBytecode = encodeDataPush(_data)

    lockingBytecode = new Uint8Array([
        OP.RETURN,
        ...lockingBytecode
    ])

    lockingBytecode = encodeDataPush(lockingBytecode)
    // console.log('\n  Locking bytecode (hex):', binToHex(lockingBytecode))

    /* Create the output. */
    const dataOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(BigInt(0)),
        satoshis: bigIntToBinUint64LE(BigInt(0)),
    }

    /* Return the output. */
    return dataOutput
}
