/* Import (local) modules. */
import $ from '../utils/preconditions.js'
import BN from '../libs/BN.js'
import Hash from '../libs/Hash.js'
import Point from '../libs/Point.js'

/**
 * Nonce Function (RFC6979)
 *
 * Generate a nonce, based on RFC6979.
 */
const nonceFunctionRFC6979 = (_privkey, _msgbuf) => {
    /* Initialize locals. */
    let k
    let K
    let T
    let V

    V = Buffer.from('0101010101010101010101010101010101010101010101010101010101010101', 'hex')
    K = Buffer.from('0000000000000000000000000000000000000000000000000000000000000000', 'hex')

    /* Build blob. */
    // TODO Link to protocol spec.
    const blob = Buffer.concat([
        _privkey,
        _msgbuf,
        Buffer.from('', 'ascii'),
        Buffer.from('Schnorr+SHA256  ', 'ascii'),
    ])

    K = Hash.sha256hmac(Buffer.concat([
        V,
        Buffer.from('00', 'hex'),
        blob,
    ]), K)

    V = Hash.sha256hmac(V, K)

    K = Hash.sha256hmac(Buffer.concat([
        V,
        Buffer.from('01', 'hex'),
        blob,
    ]), K)

    V = Hash.sha256hmac(V, K)

    k = new BN(0)

    /* Begin (infinite) loop. */
    // NOTE: Use of a WebAssembly library/module will offer significant
    //       performance improvements.
    while (true) {
        V = Hash.sha256hmac(V, K)
        T = BN.fromBuffer(V)

        k = T

        $.checkState(V.length >= 32, 'V length should be >= 32')

        /* Validate point. */
        if (k.gt(new BN(0)) && k.lt(Point.getN())) {
            break
        }

        K = Hash.sha256hmac(Buffer.concat([
            V,
            Buffer.from('00', 'hex')
        ]), K)

        V = Hash.hmac(Hash.sha256, V, K)
    }

    /* Return (k) value. */
    return k
}


/**
 * Find Signature
 *
 * Locate the point on the curve.
 */
const findSignature = (_privkey, _hashbuf) => {
    /* Initialize locals. */
    let k

    /* Set constants. */
    const n = Point.getN()
    const G = Point.getG()

    /* Convert private key to BigNumber (for maths). */
    const privkeyBN = BN.fromBuffer(Buffer.from(_privkey))

    $.checkState(!privkeyBN.lte(new BN(0)), new Error('privkey out of field of curve'));
    $.checkState(!privkeyBN.gte(n), new Error('privkey out of field of curve'));

    /* Caluclate (k) value. */
    k = nonceFunctionRFC6979(
        _privkey,
        _hashbuf,
    )

    /* Calculate (P) value. */
    // const P = G.mul(_privkey)
    const P = G.mul(privkeyBN)

    /* Calculate (R) value. */
    const R = G.mul(k)

    /* Find deterministic (k). */
    if (R.hasSquare()) {
        k = k
    } else {
        k = n.sub(k)
    }

    /* Calculate (r) value. */
    const r = R.getX()

    /* Calcualte (e0) value. */
    const e0 = BN.fromBuffer(
        Hash.sha256(
            Buffer.concat([
                getrBuffer(r),
                Point.pointToCompressed(P),
                _hashbuf,
            ])
        )
    )

// console.log('PRIVKEY', _privkey)
// console.log('PRIVKEY (BN)', BN.fromBuffer(Buffer.from(_privkey)))
// console.log('k', k)

    /* Calculate (s) value. */
    // const s = ((e0.mul(_privkey)).add(k)).mod(n)
    const s = e0
        .mul(privkeyBN)
        .add(k)
        .mod(n)

    /* Return (r) and (s) values. */
    return { r, s }
}


/**
   * Function written to ensure r part of signature is at least 32 bytes, when converting
   * from a BN to type Buffer.
   * The BN type naturally cuts off leading zeros, e.g.
   * <BN: 4f92d8094f710bc11b93935ac157730dda26c5c2a856650dbd8ebcd730d2d4> 31 bytes
   * Buffer <00 4f 92 d8 09 4f 71 0b c1 1b 93 93 5a c1 57 73 0d da 26 c5 c2 a8 56 65 0d bd 8e bc d7 30 d2 d4> 32 bytes
   * Both types are equal, however Schnorr signatures must be a minimum of 64 bytes.
   * In a previous implementation of this schnorr module, was resulting in 63 byte signatures.
   * (Although it would have been verified, it's proper to ensure the min requirement)
   * @param {*} s BN
   * @return {Buffer}
   */
function getrBuffer(r) {
    let rNaturalLength = r.toBuffer().length

    if (rNaturalLength < 32) {
        return r.toBuffer({size: 32})
    }

    return r.toBuffer()
}


/**
 * Sign Message Hash Schnorr
 *
 * Signs a hash, using the Schnorr hashing algorith.
 */
export default (_privkey, _hashbuf) => {
    /* Initialize locals. */
    let signature

    /* Find signature (from private key and hash buffer). */
    signature = findSignature(_privkey,_hashbuf)

    /* Build signature (from components). */
    signature = new Uint8Array([
        ...signature.r.toBuffer({ size: 32 }),
        ...signature.s.toBuffer({ size: 32 }),
    ])

    /* Return (binary) signature. */
    return signature
}
