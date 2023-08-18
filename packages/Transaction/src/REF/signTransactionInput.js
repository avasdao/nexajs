/* Import modules. */
import { binToHex, hexToBin } from '@nexajs/utils'
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
const signTransactionInput = async (
    transaction,
    satoshis,
    inputIndex,
    coveredBytecodeBin,
    hashtype,
    privateKeyBin,
) => {
    /* Generate the signing serialization for this transaction input. */
    const signingSerialization = await createSigningSerialization(
        transaction,
        satoshis,
        inputIndex,
        coveredBytecodeBin,
        hashtype,
    )

    /* Create signing serialization hash. */
    const sighash = sha256(sha256(signingSerialization))

    // Instantiate the Secp256k1 interface.
    const secp256k1 = await instantiateSecp256k1()

    // Generate a signature over the "sighash" using the passed private key.
    const signatureBin = secp256k1.signMessageHashSchnorr(privateKeyBin, sighash)

    // Append the hashtype to the signature to turn it into a valid transaction signature.
    const transactionSignature = new Uint8Array(signatureBin)
    // console.log('\n  Transaction signature:', binToHex(transactionSignature), '\n')

    /* Return transaction signature. */
    return transactionSignature
}

/* Export module. */
export default signTransactionInput
