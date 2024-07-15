/* Import modules. */
import { decodeAddress } from '@nexajs/address'
import { encodeDataPush } from '@nexajs/script'
import { bigIntToBinUint64LE } from '@nexajs/utils'

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
export default async (_address, _satoshis) => {
    /* Initialize locals. */
    let amount
    let lockingBytecode

    /* Encode amount. */
    amount = bigIntToBinUint64LE(_satoshis)

    /* Set locking byte code. */
    lockingBytecode = decodeAddress(_address).hash

    /* Add data script. */
    lockingBytecode = encodeDataPush(lockingBytecode)

    /* Create (value) output. */
    const valueOutput = {
        amount,
        lockingBytecode,
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return valueOutput
}
