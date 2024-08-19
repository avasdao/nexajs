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
        ...new Uint8Array(_msgbuf),
    ])
    // console.log('MAGIC HASH', binToHex(hash))

    /* Calculate hash buffer. */
    const hashbuf = sha256(sha256(hash))

    /* Initialize ECDSA. */
    const ecdsa = new ECDSA()

    /* Set hash buffer. */
    // FIXME Convert to TypedArray.
    ecdsa.hashbuf = Buffer.from(hashbuf)

    /* Set private key. */
    ecdsa.privkey = privkey

    /* Set public key. */
    ecdsa.pubkey = privkey.toPublicKey()

    /* Sign. */
    // FIXME Is there an option to make this deterministic??
    ecdsa.signRandomK()

    /* Calculate. */
    ecdsa.calci()

    /* Return signature. */
    return ecdsa.sig
        .toCompact()
        .toString('base64')
}
