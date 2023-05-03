/* Import modules. */
import { hexToBin } from '@bitauth/libauth'

const MAXINT = 0xffffffff; // Math.pow(2, 32) - 1
const DEFAULT_SEQNUMBER = MAXINT - 1

/**
 * Utility function to convert an electrum unspent output to a libauth compatible input.
 *
 * @function
 *
 * @param unspentOutput {AddressListUnspentEntry} Unspent Output to create input from.
 *
 * @returns {any} The created input.
 */
const createUnsignedInput = (unspentOutput) => {
    const input = {
        outpointTransactionHash: unspentOutput.outpoint ? hexToBin(unspentOutput.outpoint) : hexToBin(unspentOutput.tx_hash),
        unlockingBytecode: new Uint8Array(), // NOTE: This is where the signature and public key will be placed.
        satoshis: unspentOutput.satoshis,
        amount: unspentOutput.satoshis,
        sequenceNumber: DEFAULT_SEQNUMBER, // numberToBinUint32LE??
    }

    // TODO: We should try to strongly type the return type of this function.
    // This is essentially a LibAuth "Input" interface, but has the field "satoshis" added: https://libauth.org/interfaces/input.html
    // Refactoring this would require refactoring how we call unlockP2PKHInput().
    return input
}

/* Export module. */
export default createUnsignedInput
