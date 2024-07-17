/* Import modules. */
import { sha256 } from '@nexajs/crypto'

import { parseWif } from '@nexajs/hdnode'

import {
    binToHex,
    hexToBase64,
} from '@nexajs/utils'

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

    /* Import modules. */
    import { verifyMessageHashEcdsa } from '@nexajs/crypto'

    /* Return signature. */
    return signMessageHashEcdsa(_address, _signature, _msgbuf)
}
