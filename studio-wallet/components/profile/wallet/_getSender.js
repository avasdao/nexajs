/* Import modules. */
import { encodeAddress } from '@nexajs/address'
import { sha256 } from '@nexajs/crypto'
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
} from '@bitauth/libauth'

let ripemd160

;(async () => {
    ripemd160 = await instantiateRipemd160()
})()

export default (_input) => {
    /* Retrieve the FIRST script signature. */
    const scriptSig = _input.scriptSig.hex

    /* Parse public key from script signature. */
    const publicKey = hexToBin(scriptSig.slice(4, 70))

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)

    /* Generate public key hash. */
    const publicKeyHash = ripemd160.hash(sha256(scriptPushPubKey))

    /* Generate public key hash script. */
    const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))

    /* Generate address. */
    const address = encodeAddress('nexa', 'TEMPLATE', pkhScript)

    /* Return (sender) address. */
    return address
}
