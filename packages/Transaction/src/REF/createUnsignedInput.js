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
    return {
        outpointTransactionHash: unspentOutput.outpoint
            ? hexToBin(unspentOutput.outpoint)
            : hexToBin(unspentOutput.tx_hash),

        lockingBytecode: unspentOutput.locking,

        unlockingBytecode: unspentOutput.unlocking || new Uint8Array(), // NOTE: This is where the signature and public key will be placed.

        satoshis: unspentOutput.satoshis,

        // amount: unspentOutput.satoshis,

        hashType: unspentOutput.hashType,

        sequenceNumber: unspentOutput.sequence,
    }
}
