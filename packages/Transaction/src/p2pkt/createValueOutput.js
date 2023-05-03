/* Import modules. */
import {
    bigIntToBinUint64LE,
    binToHex
} from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

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
export default async (address, amount) => {
    // console.log('\n  Receiving address:', address)
    // console.log('  Receiving address (decoded):\n', decodeAddress(address))

    const lockingBytecode = decodeAddress(address).hash
    // console.log('  lockingBytecode (hex):', binToHex(lockingBytecode))

    /* Create the output. */
    const valueOutput = {
        // lockingBytecode: await getLockingBytecodeFromAddress(address),
        lockingBytecode,
        amount: bigIntToBinUint64LE(BigInt(amount)),
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return valueOutput
}
