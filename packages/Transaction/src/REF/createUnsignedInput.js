/* Import modules. */
import { hexToBin } from '@nexajs/utils'

/**
 * Utility function to convert an electrum unspent output to a libauth compatible input.
 *
 * @function
 *
 * @param unspentOutput {AddressListUnspentEntry} Unspent Output to create input from.
 *
 * @returns {any} The created input.
 */
export default (unspentOutput) => {
    /* Initialize locals. */
    let lockingBytecode
    let unlockingBytecode

    /* Set locking bytecode. */
    lockingBytecode = unspentOutput.locking

    /* Set unlocking bytecode. */
    unlockingBytecode = unspentOutput.unlocking

    return {
        outpointTransactionHash: unspentOutput.outpoint
            ? hexToBin(unspentOutput.outpoint)
            : hexToBin(unspentOutput.tx_hash),

        lockingBytecode,

        unlockingBytecode,

        satoshis: unspentOutput.satoshis,

        hashType: unspentOutput.hashType,

        sequenceNumber: unspentOutput.sequence,
    }
}
