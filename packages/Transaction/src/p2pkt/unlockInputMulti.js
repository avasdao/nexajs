/* Import modules. */
import { encodeDataPush } from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'
import { OP } from '@nexajs/script'
import { binToHex } from '@nexajs/utils'

import signTransactionInput from '../REF/signTransactionInput.js'


/**
 * Signs and builds the unlocking script for a P2PKH Input.
 *
 * @function
 *
 * @param transaction  {Transaction} The transaction being signed.
 * @param input        {any}         The input to use.
 * @param inputIndex   {number}      The index of the input.
 * @param privateKeys  {Array}       The private keys to use.
 * @param redeemScript {string}      The redeem script to use.
 *
 * @returns {Promise<Input>} The P2PKH output script.
 */
export default async (
    transaction,
    input,
    inputIndex,
    privateKeys,
    redeemScript,
) => {
    let unlockingBytecode

    // Define SIGHASH_ALL constant.
    const SIGHASH_ALL = 0x0

    // Generate a transaction signature for this input.
    const signatureBin1 = await signTransactionInput(
        transaction,
        input.satoshis,
        inputIndex,
        SIGHASH_ALL,
        privateKeys[0],
    )
    // console.log('signatureBin-1', signatureBin1)

    // Generate a transaction signature for this input.
    const signatureBin2 = await signTransactionInput(
        transaction,
        input.satoshis,
        inputIndex,
        SIGHASH_ALL,
        privateKeys[1],
    )
    // console.log('signatureBin-2', signatureBin2)

    // Build the unlocking script that unlocks the P2PKT locking script.
    unlockingBytecode = new Uint8Array(
        [
            ...encodeDataPush(redeemScript),

            OP.THREE, // checkbits (0000 0011)
            ...encodeDataPush(signatureBin1),
            ...encodeDataPush(signatureBin2),
        ]
    )
    console.log('unlockingBytecode', binToHex(unlockingBytecode))

    // Add the unlocking script to the input.
    const signedInput = { ...input, unlockingBytecode } // NOTE: Here we update the unlocking script.
    // console.log('signedInput', signedInput)

    // Return the signed input.
    return signedInput
}
