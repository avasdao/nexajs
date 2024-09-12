/* Import modules. */
import { decodeAddress } from '@nexajs/address'
import {
    encodeDataPush,
    OP,
} from '@nexajs/script'
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import (local) modules. */
import signTransactionInput from '../shared/signTransactionInput.js'

/* Initialize default script bytecode. */
const SCRIPT_TEMPLATE_1 = new Uint8Array([
    OP.FROMALTSTACK,
        OP.CHECKSIGVERIFY,
])

/* Initialize signature placeholder. */
const SIGNATURE_PLACEHOLDER = binToHex([...new Uint8Array(64)])

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
    let scriptPubkey
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
        scriptPubkey = encodeDataPush(publicKey)

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
                ...encodeDataPush(scriptPubkey),
                ...encodeDataPush(signature),
            ]
        )
    } else {
        /* Validate unlocking script. */
        // FIXME: Is this correct? should be use `&&`?
        if (unlockingScript === null || input.unlockingBytecode === null) {
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
        binToHex(lockingScript) !== (binToHex(SCRIPT_TEMPLATE_1)) // NOTE: Compare as strings (easier).
        // TODO add support for ALL script templates...
    ) {
        lockingBytecode = lockingScript
    }

    /* Validate locking bytecode. */
    if (lockingBytecode) {
        if (!unlockingBytecode || typeof unlockingBytecode === 'undefined') {
            /* Set unlocking bytecode from locking bytecode. */
            unlockingBytecode = encodeDataPush(lockingBytecode)
        } else {
            /* Validate signature (replacement) request. */
            if (
                (unlockingBytecode.length > 64) &&
                binToHex(unlockingBytecode).includes(SIGNATURE_PLACEHOLDER)
            ) {
                // Generate a transaction signature for this input.
                // TODO We DO NOT always require a signature.
                signature = await signTransactionInput(
                    transaction,
                    input.satoshis,
                    inputIndex,
                    lockingBytecode,
                    SIGHASH_ALL,
                    privateKey,
                )

                /* Set initial bytes. */
                const initialBytes = binToHex(unlockingBytecode)
                // console.log('INITIAL BYTES', initialBytes)

                /* Initialize script signature. */
                const scriptSignature = encodeDataPush(signature)

                /* Build final (authorized) bytes. */
                const finalBytes = initialBytes.replace(SIGNATURE_PLACEHOLDER, binToHex(scriptSignature))
                // console.log('FINAL BYTES', finalBytes)

                /* Complete unlocking bytecode (with valid signature). */
                unlockingBytecode = hexToBin(finalBytes)
            }

            /* Create a FINAL unlocking bytecode. */
            unlockingBytecode = new Uint8Array([
                ...encodeDataPush(lockingBytecode),
                ...unlockingBytecode,
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
