/* Import modules. */
import { decodeAddress } from '@nexajs/address'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
} from '@nexajs/utils'

import { flattenBinArray } from '@bitauth/libauth'

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
    let scriptPubKey
    let signature
    let signedInput
    let unlockingBytecode

    // Generate a transaction signature for this input.
    signature = await signTransactionInput(
        transaction,
        input.amount,
        inputIndex,
        lockingScript,
        SIGHASH_ALL,
        privateKey,
    )
    // console.log('signature', signature)

    scriptPubKey = encodeDataPush(publicKey)

    /* Validate unlocking script. */
    // NOTE: We exclude all "well-known" script templates.
    if (typeof unlockingScript === 'undefined') {
        /* Build "standard" script for unlocking P2PKT transactions. */
        unlockingBytecode = flattenBinArray(
            [
                encodeDataPush(scriptPubKey),
                encodeDataPush(signature),
            ]
        )
    } else {
        /* Validate unlocking script. */
        if (unlockingScript === null || unlockingScript === false) {
            /* Build an "empty" unlocking script. */
            unlockingBytecode = new Uint8Array(0)
        } else {
            /* Set unlocking byte code. */
            unlockingBytecode = unlockingScript
        }
    }

    /* Validate locking script. */
    if (lockingScript !== null &&
        typeof lockingScript !== 'undefined' &&
        binToHex(lockingScript) !== binToHex(SCRIPT_TEMPLATE_1)
        // TODO add support for ALL script templates...
    ) {
        unlockingBytecode = flattenBinArray([
            encodeDataPush(lockingScript), // NOTE: add "locking" prefix ??
            unlockingBytecode,
        ])
    }
    console.log('unlockingBytecode (FINAL)', binToHex(unlockingBytecode))

    /* Add unlocking script to (signed) input package. */
    signedInput = {
        ...input,
        unlockingBytecode,
    }
    // console.log('signedInput', signedInput)

    // Return the signed input (package).
    return signedInput
}
