/* Import modules. */
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Initialize Elliptic (for ECDH). */
import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('curve25519')

/* Initialize constants. */
const COMPACT_FORMAT = true
const KEY_FORMAT = 'hex'


/**
 * Derive Shared Key
 *
 * Uses the (Owner) private key and a (Foreign) public key
 * to derive a "shared key" for both parties to use
 * for (dual-party) cryptographic activities.
 */
export default (_ownedPrivateKey, _foreignPublicKey) => {
    // console.log('DERIVE (privateKey)', _privateKey)

    /* Initialize locals. */
    let privateKey

    /* Validate private key. */
    if (typeof _privateKey === 'string') {
        privateKey = _privateKey
    } else {
        privateKey = binToHex(_privateKey)
    }

    /* Calculate key. */
    const key = ec.keyFromPrivate(privateKey, KEY_FORMAT)
    // const key = ec.keyFromPrivate(privateKey)
    // console.log('KEY', key`)

    /* Retrieve public key. */
    const pub = key.getPublic(COMPACT_FORMAT, KEY_FORMAT)
    // console.log('PUB', pub)

    /* Return (binary) public key. */
    return hexToBin(pub)
}
