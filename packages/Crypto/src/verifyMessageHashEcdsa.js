/* Import modules. */
import {
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'
// import { encodeDataPush } from '@nexajs/script'

import Signature from '../libs/Signature.js'

import {
    ECDSA,
    ripemd160,
    sha256,
} from '../index.js'

export default (_address, _signature, _msgbuf) => {
    let prefix
    let result
    let signatureAddress

    prefix = 'nexa'

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

    // if (_.isString(_address)) {
    //     _address = Address.fromString(_address)
    // }

    const signature = Signature
        .fromCompact(Buffer.from(_signature, 'base64'))
    // console.log('SIGNATURE', signature)

    // recover the public key
    const ecdsa = new ECDSA()

    /* Set hash buffer. */
    // FIXME Convert to TypedArray.
    ecdsa.hashbuf = Buffer.from(hashbuf)

    ecdsa.sig = signature

    const publicKey = ecdsa.toPublicKey()
    ecdsa.pubkey = publicKey
    // console.log('PUBLIC KEY', publicKey.toString())

// FIXME

    // /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    // scriptData = encodeDataPush(hexToBin(publicKey.toString()))
    //
    // publicKeyHash = ripemd160(sha256(scriptData))
    //
    // scriptPubKey = new Uint8Array([
    //     OP.ZERO,
    //     OP.ONE,
    //     ...encodeDataPush(publicKeyHash),
    // ])
    // // console.info('\n  Script Public Key:', binToHex(scriptPubKey))
    //
    // /* Encode the public key hash into a P2PKH nexa address. */
    // signatureAddress = encodeAddress(
    //     prefix,
    //     'TEMPLATE',
    //     scriptPubKey,
    // )
    // console.info('SIG ADDRESS', signatureAddress)

// FIXME

    // check that the recovered address and specified address match
    // if (_address !== signatureAddress.toString()) {
    //     throw new Error('The signature did not match the message digest')
    //     // return false
    // }

    result = ecdsa.verify(hash, signature, publicKey)
    // console.log('RESULT', result)

    if (!result) {
        throw new Error('The signature was invalid')
    }

    return {
        publicKey: hexToBin(publicKey.toString()),
        isValid: result.verified
    }
}
