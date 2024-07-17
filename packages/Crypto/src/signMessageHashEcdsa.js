/* Import modules. */
import {
    binToHex,
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'

/* Import (local) modules. */
import {
    ECDSA,
    PrivateKey,
    sha256,
} from '../index.js'

/**
 * Sign Message
 *
 * Will sign a message with a given bitcoin private key.
 */
export default (_privkey, _msgbuf) => {
    /* Initialize locals. */
    let privkey

    /* Set private key. */
    privkey = PrivateKey(binToHex(_privkey))

    /* Build (message) hash. */
    const hash = new Uint8Array([
        0x18, // int(24) as per specification
        ...utf8ToBin('Bitcoin Signed Message:\n'),
        _msgbuf.length,
        ...utf8ToBin(_msgbuf),
    ])
    // console.log('MAGIC HASH', binToHex(hash))

    /* Calculate hash buffer. */
    const hashbuf = Buffer.from(sha256(sha256(hash)))

    /* Initialize ECDSA. */
    const ecdsa = new ECDSA()

    /* Set hash buffer. */
    ecdsa.hashbuf = hashbuf

    /* Set private key. */
    ecdsa.privkey = privkey

    /* Set public key. */
    ecdsa.pubkey = privkey.toPublicKey()

    /* Sign. */
    ecdsa.signRandomK()

    /* Calculate. */
    ecdsa.calci()

    /* Return signature. */
    return ecdsa.sig
        .toCompact()
        .toString('base64')
}
