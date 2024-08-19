/* Import modules. */
import {
    encodeDataPush,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'

import Signature from '../libs/Signature.js'

import {
    ECDSA,
    ripemd160,
    sha256,
} from '../index.js'

export default (_address, _signature, _msgbuf, _addressEncoder) => {
    let prefix
    let response
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

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptData = encodeDataPush(hexToBin(publicKey.toString()))

    const publicKeyHash = ripemd160(sha256(scriptData))

    const scriptPubKey = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash),
    ])
    // console.info('\n  Script Public Key:', binToHex(scriptPubKey))

    if (typeof _addressEncoder === 'undefined' || !_addressEncoder) {
        throw new Error('TEMP FIX: Please add an ADDRESS ENCODER as a (4th) parameter `verifyMessageHashEcdsa(p1, p2, p3, ADDRESS_ENCODER)`.')
    }

    /* Encode the public key hash into a P2PKH nexa address. */
    signatureAddress = _addressEncoder(
        prefix,
        'TEMPLATE',
        scriptPubKey,
    )
    // console.info('SIG ADDRESS (recovered)', signatureAddress)

    /* Verify recovered address and specified address match. */
    if (_address !== signatureAddress) {
        // throw new Error('The signature did not match the message digest')
        console.error('The signature DOES NOT match the message digest.')

        return {
            publicKey: hexToBin(publicKey.toString()),
            isValid: false,
        }
    }

    response = ecdsa.verify(hash, signature, publicKey)
    // console.log('RESPONSE', response)

    if (!response) {
        throw new Error('The signature was invalid')
    }

    return {
        publicKey: hexToBin(publicKey.toString()),
        isValid: response.verified,
    }
}
