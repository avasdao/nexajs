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

    /* Encode amount. */
    amount = bigIntToBinUint64LE(BigInt(0))

    /* Encode locking byte code. */
    // NOTE: Prepend locking bytecode length.
    lockingBytecode = new Uint8Array([
        bigIntToBitcoinVarInt(BigInt(lockingBytecode.length)),
        ...lockingBytecode,
    ])

    /* Create (data) output. */
    const dataOutput = {
        amount,
        lockingBytecode,
    }

    /* Return the output. */
    return dataOutput
}
