/* Import modules. */
import { decodeAddress } from '@nexajs/address'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    // bigIntToCompactUint,
    binToHex,
} from '@nexajs/utils'

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
    lockingScript,
    unlockingScript,
) => {
    // Define SIGHASH_ALL constant.
    // TODO Add support for ALL signature types.
    //      (source: https://spec.nexa.org/nexa/sighashtype.md)
    const SIGHASH_ALL = 0x0

    /* Initialize locals. */
    let lockingBytecode
    let scriptPubKey
    let signature
    let signedInput
    let unlockingBytecode

    /* Validate unlocking script. */
    // NOTE: We exclude all "well-known" script templates.
    if (
        typeof unlockingScript === 'undefined' &&
        typeof input.unlockingBytecode === 'undefined'
    ) {
        /* Add data push to script public key. */
        scriptPubKey = encodeDataPush(publicKey)

        // Generate a transaction signature for this input.
        // TODO We DO NOT always require a signature.
        signature = await signTransactionInput(
            transaction,
            input.satoshis,
            inputIndex,
            lockingScript,
            SIGHASH_ALL,
            privateKey,
        )
        // console.log('signature', signature)

        /* Build "standard" script for unlocking P2PKT transactions. */
        // NOTE: This is the MOST common (aka default) unlocking script.
        unlockingBytecode = new Uint8Array(
            [
                ...encodeDataPush(scriptPubKey),
                ...encodeDataPush(signature),
            ]
        )
    } else {
        /* Validate unlocking script. */
        if (
            unlockingScript === null || input.unlockingBytecode === null ||
            unlockingScript === false || input.unlockingBytecode === false
        ) {
            /* Keep the "empty" unlocking script (previously initialized). */
            // unlockingBytecode = new Uint8Array(0)
            // unlockingBytecode = input.unlockingBytecode

            // FIXME: For now, handle this condition LATER in the script.
        } else {
            /* Set unlocking byte code. */
            // NOTE: Used when handling 3rd-party input(s), signed by their owner(s).
            unlockingBytecode = unlockingScript || input.unlockingBytecode
        }
    }

    /* Validate locking script. */
    if (typeof input.lockingBytecode !== 'undefined') {
        // NOTE: Push the "locking" script as a prefix to the "unlocking" script.
        lockingBytecode = input.lockingBytecode
    } else if (
        lockingScript !== null &&
        typeof lockingScript !== 'undefined' &&
        binToHex(lockingScript) !== binToHex(SCRIPT_TEMPLATE_1) // NOTE: Compare as strings (easier).
        // TODO add support for ALL script templates...
    ) {
        lockingBytecode = lockingScript
    }

    /* Validate locking bytecode. */
    if (lockingBytecode) {
        if (!unlockingBytecode || typeof unlockingBytecode === 'undefined') {
            unlockingBytecode = new Uint8Array([
                ...lockingBytecode,
            ])
        } else {
            // NOTE: Push the "locking" script as a prefix to the
            //       "unlocking" script.
            unlockingBytecode = new Uint8Array([
                ...lockingBytecode,
                ...unlockingBytecode, // FIXME Have support for (0)??
            ])
        }
    }
    // console.log('unlockingBytecode (FINAL)', binToHex(unlockingBytecode))

    /* Add unlocking script to (signed) input package. */
    signedInput = {
        ...input,
        unlockingBytecode,
    }

    // Return the signed input (package).
    return signedInput
}
