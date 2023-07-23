/* Import modules. */
import { bigIntToBinUint64LE } from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

/**
 * Create a transaction P2PKH output with the given value.
 *
 * @function
 *
 * @param address  {string} Bitcoin Cash address to convert to P2PKH lock-code.
 * @param satoshis {number} Satoshi value to attach to output
 *
 * @returns {Promise<Output>} The P2PKH output script.
 */
export default async (address, satoshis) => {
    const lockingBytecode = decodeAddress(address).hash

    // Create the output.
    const valueOutput = {
        // lockingBytecode: await getLockingBytecodeFromAddress(address),
        lockingBytecode,
        satoshis: bigIntToBinUint64LE(satoshis),
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.
    //       However, before we do this, we must refactor our logic in Hop.Cash backend.

    // Return the output.
    return valueOutput
}
