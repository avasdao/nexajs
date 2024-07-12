/* Import modules. */
import {
    ripemd160,
    sha256,
} from '@nexajs/crypto'

import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Import (local) modules. */
import { encodeAddress } from '../index.js'

/**
 * Get Sender
 *
 * Retrieves the address of the Sender of an Input.
 */
export default (_input) => {
    /* Retrieve the FIRST script signature. */
    const scriptSig = _input.scriptSig.hex

    /* Parse public key from script signature. */
    const publicKey = hexToBin(scriptSig.slice(4, 70))

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)

    /* Generate public key hash. */
    const publicKeyHash = ripemd160(sha256(scriptPushPubKey))

    /* Generate public key hash script. */
    const pkhScript = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash),
    ])

    /* Generate address. */
    const address = encodeAddress('nexa', 'TEMPLATE', pkhScript)

    /* Return (sender) address. */
    return address
}
