/* Import modules. */
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

/* Initialize Elliptic. */
import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('secp256k1')

/* Initialize constants. */
const COMPACT_FORMAT = true
const KEY_FORMAT = 'hex'


/**
 * Derive Public Key (Compressed)
 *
 * Will provide a public key for the provided private key.
 *
 * FIXME Rename this method to allow for available UNCOMPRESSED FORMAT.
 */
export default (_privateKey, _isCompact = COMPACT_FORMAT) => {
    /* Initialize locals. */
    let privateKey

    /* Validate private key. */
    if (typeof _privateKey === 'string') {
        /* Set private key. */
        privateKey = _privateKey
    } else {
        /* Set private key. */
        privateKey = binToHex(_privateKey)
    }

    /* Calculate key. */
    const key = ec.keyFromPrivate(privateKey, KEY_FORMAT)

    /* Set public key. */
    const publicKey = key.getPublic(_isCompact, KEY_FORMAT)

    /* Return (binary) public key. */
    return hexToBin(publicKey)
}
