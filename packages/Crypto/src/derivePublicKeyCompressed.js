/* Import modules. */
import { binToHex } from '@nexajs/utils'

/* Initialize Elliptic. */
import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('secp256k1')

/* Initialize constants. */
const COMPACT_FORMAT = true
const KEY_FORMAT = 'hex'

export default (_privateKey) => {
    /* Calculate key. */
    const key = ec.keyFromPrivate(binToHex(_privateKey), KEY_FORMAT)
    // console.log('KEY', key`)

    /* Retrieve public key. */
    const pub = key.getPublic(COMPACT_FORMAT, KEY_FORMAT)
    // console.log('PUB', pub)

    /* Return public key. */
    return pub
}
