/* Import modules. */
import { decodeAddress } from '@nexajs/address'

import { OP } from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

import {
    encodeDataPush,
    flattenBinArray,
} from '@bitauth/libauth'

import signTransactionInput from '../REF/signTransactionInput.js'

/* Initialize default script bytecode. */
const SCRIPT_TEMPLATE_1 = new Uint8Array([
    OP.FROMALTSTACK,
        OP.CHECKSIGVERIFY,
])

/**
 * Signs and builds the unlocking script for a P2PKH Input.
 *
 * @function
 *
 * @param transaction {Transaction} The transaction being signed.
 * @param input       {any}         The input to use.
 * @param inputIndex  {number}      The index of the input.
 * @param privateKey  {string}      The private key to use.
 * @param publicKey   {string}      The public key to use.
 * @param address     {string}      The address to use.
 *
 * @returns {Promise<Input>} The P2PKH output script.
 */
export default async (
    transaction,
    input,
    inputIndex,
    privateKey,
    publicKey,
    lockScriptBin,
) => {
    // Define SIGHASH_ALL constant.
    const SIGHASH_ALL = 0x0

    /* Initialize locals. */
    let scriptPubKey
    let signatureBin
    let signedInput
    let unlockingBytecode

    // Generate a transaction signature for this input.
    signatureBin = await signTransactionInput(
        transaction,
        input.amount,
        inputIndex,
        lockScriptBin,
        SIGHASH_ALL,
        hexToBin(privateKey),
    )
    // console.log('signatureBin', signatureBin)

    scriptPubKey = encodeDataPush(hexToBin(publicKey))

    // Build the unlocking script that unlocks the P2PKT locking script.
    unlockingBytecode = flattenBinArray(
        [
            // NOTE: We exclude all "well-known" script templates.
            encodeDataPush(scriptPubKey),
            encodeDataPush(signatureBin),
        ]
    )

    /* Validate locking script. */
    if (lockScriptBin !== null &&
        typeof lockScriptBin !== 'undefined' &&
        binToHex(lockScriptBin) !== binToHex(SCRIPT_TEMPLATE_1)
        // add more script templates...
    ) {
        unlockingBytecode = flattenBinArray([
            encodeDataPush(lockScriptBin),
            unlockingBytecode,
        ])
    }
    // console.log('unlockingBytecode', unlockingBytecode)

    // Add the unlocking script to the input.
    signedInput = { ...input, unlockingBytecode } // NOTE: Here we update the unlocking script.
    // console.log('signedInput', signedInput)

    // Return the signed input.
    return signedInput
}
