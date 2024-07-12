/* Import modules. */
import { sha256 } from '@nexajs/crypto'

import { parseWif } from '@nexajs/hdnode'

import { binToHex } from '@nexajs/utils'

/* Libauth helpers. */
import { instantiateSecp256k1 } from '@bitauth/libauth'

let secp256k1

const hexToBase64 = (_hex) => {
    return btoa(_hex.match(/\w{2}/g).map(function(a) {
        return String.fromCharCode(parseInt(a, 16))
    }).join(''))
}

export default async (_wif, _message) => {
    /* Initalize locals. */
    let ecdsa
    let magicMessage
    let messageHash
    let signature
    let signatureBin
    let signatureHex
    let signatureElectron

    // Instantiate the Secp256k1 interface.
    secp256k1 = await instantiateSecp256k1()

    const {
        address,
        privateKey,
        publicKey,
    } = await parseWif(_wif, 'nexa', 'TEMPLATE')

    const enc = new TextEncoder()

    magicMessage = new Uint8Array([
        0x18, // int(24) as per specification
        ...enc.encode('Bitcoin Signed Message:\n'),
        _message.length,
        ...enc.encode(_message),
    ])
    // console.log('MAGIC MSG', magicMessage)

    messageHash = sha256(sha256(magicMessage))
    // console.log('MSG HASH', messageHash)

    // Generate a signature over the "sighash" using the passed private key.
    signature = secp256k1
        .signMessageHashRecoverableCompact(privateKey, messageHash)
    // console.log('SIGNATURE', signature)

    signatureBin = signature.signature

    signatureHex = binToHex(signatureBin)

    signatureElectron = new Uint8Array([
        (0x1f + signature.recoveryId), // int(31) + <recovery-id> as per specification
        ...signatureBin,
    ])

    signature = {
        bin: signatureBin,
        ecdsa: hexToBase64(signatureHex),
        hex: signatureHex,
        sig: hexToBase64(binToHex(signatureElectron)),
    }

    /* Return signature. */
    return signature
}
