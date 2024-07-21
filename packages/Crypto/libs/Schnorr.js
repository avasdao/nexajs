// Important references for schnorr implementation
// https://github.com/bitcoincashorg/bitcoincash.org/blob/master/spec/2019-05-15-schnorr.md
// https://github.com/bitcoincashorg/bitcoincash.org/blob/master/spec/2019-11-15-schnorrmultisig.md#wallet-implementation-guidelines

/* Import modules. */
import _ from 'lodash'

/* Import modules. */
import $ from '../utils/preconditions.js'
import BN from './bn.js'
import Hash from './hash.js'
import Point from './point.js'
import PublicKey from './PublicKey.js'
import Signature from './Signature.js'

// import { randomBytes } from '../index.js'

const Schnorr = function (obj) {
    if (!(this instanceof Schnorr)) {
        return new Schnorr(obj)
    }

    if (obj) {
        this.set(obj)
    }
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
 * Function written to ensure s part of signature is at least 32 bytes, when converting
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
function getsBuffer(s) {
    const sNaturalLength = s.toBuffer().length

    if (sNaturalLength < 32) {
        return s.toBuffer({ size: 32 })
    }

    return s.toBuffer()
}

Schnorr.prototype.set = function (obj) {
    this.hashbuf  = obj.hashbuf  || this.hashbuf
    this.endian   = obj.endian   || this.endian
    this.privkey  = obj.privkey  || this.privkey
    this.pubkey   = obj.pubkey   || (this.privkey ? this.privkey.publicKey : this.pubkey)
    this.sig      = obj.sig      || this.sig
    this.verified = obj.verified || this.verified

    return this
}

Schnorr.prototype.privkey2pubkey = function () {
    this.pubkey = this.privkey.toPublicKey()
}

Schnorr.prototype.toPublicKey = function () {
    return this.privkey.toPublicKey()
}

Schnorr.prototype.sign = function () {
    var hashbuf = this.hashbuf
    var privkey = this.privkey
    var d = privkey.bn

    $.checkState(hashbuf && privkey && d, new Error('invalid parameters'))
    $.checkState(Buffer.isBuffer(hashbuf) && hashbuf.length === 32, new Error('hashbuf must be a 32 byte buffer'))

    var e = BN.fromBuffer(hashbuf, this.endian ? {
        endian: this.endian
    } : undefined)

    var obj = this._findSignature(d, e)
    obj.compressed = this.pubkey.compressed
    obj.isSchnorr = true

    this.sig = new Signature(obj)
    return this
}

/**
 * Schnorr implementation used from bitcoinabc at https://reviews.bitcoinabc.org/D2501
 */
Schnorr.prototype._findSignature = function (_privkey, _hashbuf) {
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


Schnorr.prototype.sigError = function () {
    if (!Buffer.isBuffer(this.hashbuf) || this.hashbuf.length !== 32) {
        return 'hashbuf must be a 32 byte buffer'
    }

    let sigLength = getrBuffer(this.sig.r).length + getsBuffer(this.sig.s).length

    if(!(sigLength === 64 || sigLength === 65)) {
        return 'signature must be a 64 byte or 65 byte array'
    }

    let hashbuf = this.endian === 'little' ? Buffer.reverse(this.hashbuf) : this.hashbuf

    let P = this.pubkey.point
    let G = Point.getG()

    if (P.isInfinity()) return true

    let r = this.sig.r
    let s = this.sig.s

    let p = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 'hex')
    let n = Point.getN()

    if (r.gte(p) || s.gte(n)) {
        // ("Failed >= condition")
        return true
    }

    let Br = getrBuffer(this.sig.r)
    let Bp = Point.pointToCompressed(P)

    let hash = Hash.sha256(Buffer.concat([Br, Bp, hashbuf]))
    let e = BN.fromBuffer(hash, 'big').umod(n)

    let sG = G.mul(s)
    let eP = P.mul(n.sub(e))
    let R = sG.add(eP)

    if (R.isInfinity() || !R.hasSquare() || !R.getX().eq(r)) {
        return true
    }

    return false
}

Schnorr.prototype.verify = function () {
    if (!this.sigError()) {
        this.verified = true
    } else {
        this.verified = false
    }

    return this
}

/**
 * RFC6979 deterministic nonce generation used from https://reviews.bitcoinabc.org/D2501
 * @param {Buffer} privkeybuf
 * @param {Buffer} msgbuf
 * @return k {BN}
 */
Schnorr.prototype.nonceFunctionRFC6979 = function (_privkey, _msgbuf) {
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

Schnorr.sign = function (hashbuf, privkey, endian) {
    return Schnorr().set({
        hashbuf: hashbuf,
        endian: endian,
        privkey: privkey,
    }).sign().sig
}

Schnorr.verify = function (hashbuf, sig, pubkey, endian) {
    return Schnorr().set({
        hashbuf,
        endian,
        sig,
        pubkey,
    }).verify().verified
}

export default Schnorr
