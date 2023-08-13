/* Import modules. */
import { hexToBin } from '@nexajs/utils'

const MAXINT = 0xffffffff
const DEFAULT_SEQNUMBER = MAXINT - 1 // NOTE: Enables nLocktime

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
    const input = {
        outpointTransactionHash: unspentOutput.outpoint ? hexToBin(unspentOutput.outpoint) : hexToBin(unspentOutput.tx_hash),
        unlockingBytecode: new Uint8Array(), // NOTE: This is where the signature and public key will be placed.
        satoshis: unspentOutput.satoshis,
        amount: unspentOutput.satoshis,
        sequenceNumber: DEFAULT_SEQNUMBER, // numberToBinUint32LE??
    }

    /* Return input. */
    return input
}
