/* Import modules. */
import { decodeAddress } from '@nexajs/address'
import {
    binToHex,
    flattenBinArray,
} from '@nexajs/utils'

/* Import (local) modules. */
import signTransactionInput from '../shared/signTransactionInput.js'

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
    // Extract the bytecode (locking script) from our return address.
    // const lockScriptBin = await getLockingBytecodeFromAddress(address)

    // const lockScriptBin = new Uint8Array([
    //     ...await decodeAddress(address).hash
    // ])

    // Define SIGHASH_ALL constant.
    const SIGHASH_ALL = 0x41

    // Generate a transaction signature for this input.
    const signatureBin = await signTransactionInput(
        transaction,
        input.satoshis,
        inputIndex,
        lockScriptBin,
        SIGHASH_ALL,
        privateKey,
    )

    // Build the unlocking script that unlocks the P2PKH locking script.
    const unlockingBytecode = flattenBinArray(
        [
            encodeDataPush(signatureBin),
            encodeDataPush(publicKey)
        ]
    )

    // Add the unlocking script to the input.
    const signedInput = { ...input, unlockingBytecode } // NOTE: Here we update the unlocking script.

    // Return the signed input.
    return signedInput
}
