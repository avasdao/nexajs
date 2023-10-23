/* Import modules. */
import { binToHex } from '@nexajs/utils'
import { sha256 } from '@nexajs/crypto'

/* Libauth helpers. */
import { instantiateSecp256k1 } from '@bitauth/libauth'

import createSigningSerialization from './createSigningSerialization.js'

/**
 * Sign a single transaction input using a private key.
 *
 * @function
 *
 * @param transaction        {Transaction} The transaction to use.
 * @param satoshis           {number}      The input's satoshi value.
 * @param inputIndex         {number}      Input index to sign.
 * @param coveredBytecodeBin {Uint8Array}  The input's locking script.
 * @param hashtype           {number}      Hash type to use for signing serialization.
 * @param privateKeyBin      {Uint8Array}  Private Key in binary format.
 *
 * @returns {Uint8Array}	The signed transaction input.
 */
export default async (
    transaction,
    satoshis,
    inputIndex,
    coveredBytecodeBin,
    hashtype,
    privateKeyBin,
) => {
    /* Initialize locals. */
    let secp256k1
    let sighash
    let signatureBin
    let signingSerialization
    let transactionSignature

    /* Generate the signing serialization for this transaction input. */
    signingSerialization = await createSigningSerialization(
        transaction,
        satoshis,
        inputIndex,
        coveredBytecodeBin,
        hashtype,
    )

    /* Create signing serialization hash. */
    sighash = sha256(sha256(signingSerialization))

    /* Instantiate the Secp256k1 interface. */
    secp256k1 = await instantiateSecp256k1()

    /* Generate a signature over the "sighash" using the passed private key. */
    signatureBin = secp256k1
        .signMessageHashSchnorr(privateKeyBin, sighash)

    /* Validate hash type. */
    if (hashtype === 0) {
        // NOTE: DO NOT append a zero (0) hash type.
        transactionSignature = new Uint8Array(signatureBin)
    } else {
        // NOTE: Append the hashtype to the signature to turn it into a valid transaction signature.
        transactionSignature = new Uint8Array([
            ...signatureBin,
            hashtype,
        ])
    }

    /* Return transaction signature. */
    return transactionSignature
}
