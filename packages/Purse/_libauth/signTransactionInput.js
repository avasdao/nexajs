/* Import modules. */
import {
    binToHex,
    hexToBin,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

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
    // Generate the signing serialization for this transaction input.
    const signingSerialization = await createSigningSerialization(
        transaction,
        satoshis,
        inputIndex,
        coveredBytecodeBin,
        hashtype
    )
    console.log('COVERED BYTECODE BIN', coveredBytecodeBin)
    console.log('HASH TYPE', hashtype)
    console.log('SIGNING SERIALIZATION', binToHex(signingSerialization))

    // Generate the "sighash" by taking the double SHA256 of the signing serialization.
    const sha256 = await instantiateSha256()

    let seqVal = hexToBin('feffffff')
    console.log('seqVal', seqVal)
    let seqHash = sha256.hash(sha256.hash(seqVal))
    console.log('seqHash', seqHash)
    console.log('seqHash (hex)', binToHex(seqHash))

    let finalVal = hexToBin('00f9259df3cb2d51f8a2f9de2aa2b97406a475f51b77c9a5f381cdf3004c0c55c99200c28f67d2f426c3cf0fd559f268a3447e7ae55f9da0a1c9d4df6dbf4cdab018606b350cd8bf565266bc352f0caddcf01e8fa789dd8a15386327cf8cabe198026cad9e5c6418a54cb315904d657dc3a2c4bc24d33a8f2520b788ae92281c63a30d180000000000')
    console.log('finalVal', finalVal)
    let finalHash = sha256.hash(sha256.hash(finalVal))
    console.log('finalHash', finalHash)
    console.log('finalHash (hex)', binToHex(finalHash))
    console.log('finalHash (rev)', binToHex(finalHash.reverse()))

    let sighash = sha256.hash(sha256.hash(signingSerialization))
sighash = hexToBin('032bcd0f7064c10856729f4ec3284b402cceebefcb4b368fecda4180a6b6de30').reverse()
// sighash = sighash.match(/[a-fA-F0-9]{2}/g).reverse().join('')
// sighash = hexToBin('f3e5beb67928147a936bc87e9c4f3759e1401d14b738ba7c55a1e929055fd061')
    console.log('SIGNATURE HASH (binary):', sighash)
    console.log('SIGNATURE HASH', binToHex(sighash))

    // Instantiate the Secp256k1 interface.
    const secp256k1 = await instantiateSecp256k1()

privateKeyBin = hexToBin('3e36d3622f5adad01080cc2120bb72c0714ecec6118eb9523586410b7435ae80')
    // Generate a signature over the "sighash" using the passed private key.
    const signatureBin = secp256k1.signMessageHashSchnorr(privateKeyBin, sighash)
    console.log('PRIVATE KEY (binary):', privateKeyBin)
    console.log('PRIVATE KEY', binToHex(privateKeyBin))
    console.log('SCHNORR SIGNATURE', binToHex(signatureBin))

let mySig = 'c3cf9603df26eed06da75681ee33941d127694abfb543cba26dd95a3432a638043f0d4d3cd612396267efd3ab35bab8faf010a1d8a64ce7eb4b7749d0532f2d6'
let myPubKey = '03cbe16ecb57d7a173ef5d46692daf38f366e2939b655817335fbfcd8a4edc41c0'

    const signatureVerify = secp256k1.verifySignatureSchnorr(hexToBin(mySig), hexToBin(myPubKey), sighash)
    console.log('signatureVerify:', signatureVerify)
    // console.log('PRIVATE KEY', binToHex(privateKeyBin))
    // console.log('SCHNORR SIGNATURE', binToHex(signatureBin))

    // Append the hashtype to the signature to turn it into a valid transaction signature.
    const transactionSignature = Uint8Array.from([ ...signatureBin, hashtype ])
    console.log('TRANSACTION SIGNATURE', binToHex(transactionSignature))

    return transactionSignature
}

/* Export module. */
export default signTransactionInput
