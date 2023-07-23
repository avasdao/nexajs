/* Import modules. */
import { bigIntToBinUint64LE } from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

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
export default async (_address, _satoshis) => {
    /* Set locking byte code. */
    const lockingBytecode = decodeAddress(_address).hash

    /* Create (value) output. */
    const valueOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(_satoshis),
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return valueOutput
}
