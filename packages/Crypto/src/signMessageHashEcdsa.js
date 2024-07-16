/* Import modules. */
// import {
//     ECDSA,
//     PrivateKey,
// } from '@nexajs/hdnode'
import {
    binToHex,
    hexToBin,
    utf8ToBin,
} from '@nexajs/utils'

import { sha256 } from '../index.js'

/* Initialize Elliptic. */
import pkg from 'elliptic'
const { ec: EC } = pkg
const ec = new EC('secp256k1')
const ECDSA = ec

/* Initialize constants. */
const COMPACT_FORMAT = true
const KEY_FORMAT = 'hex'

export default async (_privkey, _msgbuf) => {
    // console.log('DERIVE (privateKey)', _privateKey)

    /* Initialize locals. */
    let magicMessage
    let messageHash
    // let privateKey

    /* Validate private key. */
    // if (typeof _privateKey === 'string') {
    //     privateKey = _privateKey
    // } else {
    //     privateKey = binToHex(_privateKey)
    // }

    /* Calculate key. */
    // const key = ec.keyFromPrivate(privateKey, KEY_FORMAT)
    // const key = ec.keyFromPrivate(privateKey)
    // console.log('KEY', key`)

    /* Retrieve public key. */
    // const pub = key.getPublic(COMPACT_FORMAT, KEY_FORMAT)
    // console.log('PUB', pub)

    /* Return (binary) public key. */
    // return hexToBin(pub)

    magicMessage = new Uint8Array([
        0x18, // int(24) as per specification
        ...utf8ToBin('Bitcoin Signed Message:\n'),
        _msgbuf.length,
        ...utf8ToBin(_msgbuf),
    ])
    // console.log('MAGIC MSG', magicMessage)

    messageHash = sha256(sha256(magicMessage))
    // console.log('MSG HASH', binToHex(messageHash))


    const key = ec.keyFromPrivate(binToHex(_privkey), 'hex')
    // console.log('KEY', key)

    const signature = key.sign(messageHash)
    // console.log('SIGNATURE', signature)
    // console.log('SIGNATURE (base64)', signature.toCompact())

    return signature
}

// /**
//  * Sign Message
//  *
//  * Will sign a message with a given bitcoin private key.
//  */
// export default async (_privkey, _msgbuf) => {
//     console.log('PRIVKEY (hex)', _privkey)
//
//     /* Initialize locals. */
//     let privkey
//
//     if (typeof _privkey === 'string') {
//         privkey = ec.keyFromPrivate(_privkey, KEY_FORMAT)
//     } else {
//         privkey = ec.keyFromPrivate(binToHex(_privkey), KEY_FORMAT)
//     }
//     // console.log('PRIVKEY', privkey)
//     // console.log('GENERATE', ec.genKeyPair())
//     console.log('GENERATE (pub)', ec.genKeyPair().getPublic())
//     /* Validate private key. */
//     // if (!(_privkey instanceof PrivateKey)) {
//     //     throw new Error('First argument should be an instance of PrivateKey')
//     // }
//
//     /* Initialize hash. */
//     // const hash = this.magicHash
//     const hash = new Uint8Array([
//         0x18, // int(24) as per specification
//         ...utf8ToBin('Bitcoin Signed Message:\n'),
//         _msgbuf.length,
//         ...utf8ToBin(_msgbuf),
//     ])
//     // console.log('MAGIC MSG', magicMessage)
//
//     /* Initialize ECDSA. */
//     // const ecdsa = new ECDSA()
//
//     /* Set hash buffer. */
//     ec.hashbuf = hash
//
//     /* Set private key. */
//     ec.privkey = privkey
//
//     /* Set public key. */
//     ec.pubkey = privkey.getPublic()
//
//     /* Sign. */
//     ec.signRandomK()
//
//     /* Calculate. */
//     ec.calci()
//
//     /* Return signature. */
//     return ec.sig
//         .toCompact()
//         .toString('base64')
// }
