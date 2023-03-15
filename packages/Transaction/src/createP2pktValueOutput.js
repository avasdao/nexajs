/* Import modules. */
import { bigIntToBinUint64LE } from '@bitauth/libauth'
import getLockingBytecodeFromAddress from './address/getLockingBytecodeFromAddress.js'

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
const createValueOutput = async (address, satoshis) => {
    // Create the output.
    const valueOutput = {
        lockingBytecode: await getLockingBytecodeFromAddress(address),
        satoshis: bigIntToBinUint64LE(BigInt(satoshis)),
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.
    //       However, before we do this, we must refactor our logic in Hop.Cash backend.

    // Return the output.
    return valueOutput
}

/* Export module. */
export default createValueOutput
