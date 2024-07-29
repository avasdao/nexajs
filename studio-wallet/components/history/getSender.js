/* Import modules. */
import { encodeAddress } from '@nexajs/address'

import {
    sha256,
    ripemd160,
} from '@nexajs/crypto'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import { hexToBin } from '@nexajs/utils'

export default (_input) => {
    /* Initialize locals. */
    let address
    let scriptPubKey
    let publicKey
    let publicKeyHash
    let scriptPushPubKey
    let scriptSig

    /* Retrieve the FIRST script signature. */
    scriptSig = _input.scriptSig.hex

    /* Parse public key from script signature. */
    publicKey = hexToBin(scriptSig.slice(4, 70))

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    scriptPushPubKey = encodeDataPush(publicKey)

    /* Generate public key hash. */
    publicKeyHash = ripemd160(sha256(scriptPushPubKey))

    /* Generate public key hash script. */
    scriptPubKey = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash)
    ])

    /* Generate address. */
    address = encodeAddress(
        'nexa',
        'TEMPLATE',
        scriptPubKey,
    )

    /* Return (sender) address. */
    return address
}
