/* Import modules. */
import { hexToBin } from '@nexajs/utils'

/* Libauth helpers. */
import { instantiateSecp256k1 } from '@bitauth/libauth'

let secp256k1


const base64ToHex = (str) => {
    const raw = atob(str);
    let result = '';
    for (let i = 0; i < raw.length; i++) {
        const hex = raw.charCodeAt(i).toString(16);
        result += (hex.length === 2 ? hex : '0' + hex);
    }
    return result.toUpperCase();
}

export default async (_message, _signature, _publicKey = null) => {
    // TODO Add support for public key (ie. Schnorr) verifications.

    /* Initialize locals. */
    let isValid
    let publicKey
    let recoveryId
    let signature
    let signatureBin
    let signatureHex

    // Instantiate the Secp256k1 interface.
    secp256k1 = await instantiateSecp256k1()

    const enc = new TextEncoder()

    /* Set flag .*/
    isValid = false

    /* Set (legacy) address. */
    // const address = Address.toLegacyAddress(_address)

    signatureHex = base64ToHex(_signature)
    console.log('signatureHex', signatureHex);

    signatureBin = hexToBin(signatureHex)
    console.log('signatureBin', signatureBin);

    recoveryId = signatureBin[0] - 31

    signature = signatureBin.slice(1)

    publicKey = secp256k1.recoverPublicKeyCompressed(
        signature,
        recoveryId,
        enc.encode(_message)
    )

    isValid = secp256k1.verifySignatureCompact(
        signature,
        publicKey,
        enc.encode(_message)
    )

    /* Return validation flag. */
    return {
        isValid,
        publicKey,
    }
}
