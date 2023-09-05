/* Import modules. */
import {
    bigIntToBinUint64LE,
    bigIntToBitcoinVarInt,
} from '@bitauth/libauth'

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
    let nullData
    let output

    /* Encode amount. */
    amount = bigIntToBinUint64LE(BigInt(0))

    /* Encode null data. */
    // NOTE: Prepend null data length.
    nullData = new Uint8Array([
        bigIntToBitcoinVarInt(BigInt(_data.length)),
        ..._data,
    ])

    /* Set locking bytecode. */
    lockingBytecode = nullData

    /* Create (data) output. */
    output = {
        amount,
        lockingBytecode,
    }

    /* Return the output. */
    return output
}
