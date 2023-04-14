/* Import modules. */
import {
    encodeDataPush,
    flattenBinArray,
    hexToBin,
} from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

import signTransactionInput from './signTransactionInput.js'


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
    address,
) => {
    // Extract the bytecode (locking script) from our return address.
    // const lockScriptBin = await getLockingBytecodeFromAddress(address)
    const lockScriptBin = new Uint8Array([
        ...hexToBin('17005114'),
        ...await decodeAddress(address).hash
    ])
    // console.log('\n  Lock Script Bin:\n', lockScriptBin)

    // Define SIGHASH_ALL constant.
    const SIGHASH_ALL = 0x0

    // Generate a transaction signature for this input.
    const signatureBin = await signTransactionInput(
        transaction,
        input.amount,
        inputIndex,
        lockScriptBin,
        SIGHASH_ALL,
        hexToBin(privateKey),
    )
    // console.log('signatureBin', signatureBin)

    const scriptPubKey = encodeDataPush(hexToBin(publicKey))

    // Build the unlocking script that unlocks the P2PKT locking script.
    const unlockingBytecode = flattenBinArray(
        [
            encodeDataPush(scriptPubKey),
            encodeDataPush(signatureBin),
        ]
    )
    // console.log('unlockingBytecode', unlockingBytecode)

    // Add the unlocking script to the input.
    const signedInput = { ...input, unlockingBytecode } // NOTE: Here we update the unlocking script.
    // console.log('signedInput', signedInput)

    // Return the signed input.
    return signedInput
}
