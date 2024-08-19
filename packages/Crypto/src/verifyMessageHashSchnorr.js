/* Import modules. */
import {
    binToHex,
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'
// import { encodeDataPush } from '@nexajs/script'

import BN from '../libs/BN.js'
import Hash from '../libs/Hash.js'
import Signature from '../libs/Signature.js'

import {
    Point,
    PublicKey,

    ripemd160,
    sha256,
} from '../index.js'


/**
 * Function written to ensure r part of signature is at least 32 bytes, when converting
 * from a BN to type Buffer.
 * The BN type naturally cuts off leading zeros, e.g.
 * <BN: 4f92d8094f710bc11b93935ac157730dda26c5c2a856650dbd8ebcd730d2d4> 31 bytes
 * Buffer <00 4f 92 d8 09 4f 71 0b c1 1b 93 93 5a c1 57 73 0d da 26 c5 c2 a8 56 65 0d bd 8e bc d7 30 d2 d4> 32 bytes
 * Both types are equal, however Schnorr signatures must be a minimum of 64 bytes.
 * In a previous implementation of this schnorr module, was resulting in 63 byte signatures.
 * (Although it would have been verified, it's proper to ensure the min requirement)
 * @param {*} val BN
 * @return {Buffer}
 */
const getFullBuffer = (_val) => {
    let rNaturalLength = _val.toBuffer().length

    if (rNaturalLength < 32) {
          return _val.toBuffer({ size: 32 })
    }

    return _val.toBuffer()
}


export default (_signature, _pubkey, _msgbuf) => {
    /* Initialize locals. */
    let msgbuf
    let signature

    msgbuf = Buffer.from(_msgbuf)

    /* Extract R value. */
    const rVal = BN.fromBuffer(Buffer.from(_signature.slice(0, 32)))
    // console.log('R VAL', rVal)

    /* Extract S value. */
    const sVal = BN.fromBuffer(Buffer.from(_signature.slice(32)))
    // console.log('S VAL', sVal)

    /* Validate buffer length. */
    if (!Buffer.isBuffer(msgbuf) || msgbuf.length !== 32) {
        return 'hashbuf must be a 32 byte buffer'
    }

    /* Validate signature length. */
    let sigLength = getFullBuffer(rVal).length + getFullBuffer(sVal).length
    // console.log('SIG LENGTH', sigLength)

    /* Validate signature length. */
    if (!(sigLength === 64 || sigLength === 65)) {
        return 'signature must be a 64 byte or 65 byte array'
    }

    // let hashbuf = this.endian === 'little' ? Buffer.reverse(msgbuf) : msgbuf
    let hashbuf = msgbuf

    // let P = this.pubkey.point
    let P = PublicKey(Buffer.from(_pubkey)).point
    let G = Point.getG()

    /* Validate infinity value. */
    if (P.isInfinity()) {
        return false // FAIL!
    }

    // let r =
    // let s = sVal

    let p = new BN('FFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFFEFFFFFC2F', 'hex')
    let n = Point.getN()

    /* Validate R and S values are within range. */
    if (rVal.gte(p) || sVal.gte(n)) {
        // ("Failed >= condition")
        return false // FAIL!
    }

    let Br = getFullBuffer(rVal)

    let Bp = Point.pointToCompressed(P)

    let hash = Hash.sha256(Buffer.concat([ Br, Bp, hashbuf ]))

    let e = BN.fromBuffer(hash, 'big').umod(n)

    let sG = G.mul(sVal)

    let eP = P.mul(n.sub(e))

    let R = sG.add(eP)

    /* Validate R value. */
    if (R.isInfinity() || !R.hasSquare() || !R.getX().eq(rVal)) {
        return false // FAIL!
    }

    /* Return SUCCESS! */
    return true
}
