/* Import modules. */
// const Message = require('bitcore-message')
// const bch = require('bitcore-lib-cash')
// const bitcoin = require('bitcoinjs-lib') // v4.x.x
// const bitcoinMessage = require('bitcoinjs-message')
// const { randomBytes } = require('crypto')

/**
 * Sign Message
 */
// const sign = (_wif, _message) => {
//     /* Set private key. */
//     const privateKey = new bch.PrivateKey(_wif)
//     // console.log('PRIVATE KEY', privateKey)
//
//     /* Set message. */
//     const message = new Message(_message)
//     // console.log('MESSAGE', message)
//
//     /* Generate signature. */
//     const signature = message.sign(privateKey)
//     // console.log('SIGNATURE', signature)
//
//     /* Return signature. */
//     return signature
// }
export default (_message, _wif) => {
    /* Initalize locals. */
    let signature

    signature = {
        base64: 'TBD=',
        bin: new Uint8Array(0),
        hex: '00',
    }

    /* Set private key. */
    // const keyPair = bitcoin.ECPair.fromWIF(_wif)
    // console.log('KEYPAIR', keyPair)

    /* Set private key. */
    // const privateKey = keyPair.privateKey
    // console.log('PRIVATE KEY', privateKey)

    /* Generate signature. */
    // const signature = bitcoinMessage
    //     .sign(
    //         _message,
    //         privateKey,
    //         keyPair.compressed,
    //         { extraEntropy: randomBytes(32) }
    //     )
    // console.log('SIGNATURE', signature)
    // console.log('SIGNATURE (base64)', Buffer.from(signature).toString('base64'))

    /* Return signature. */
    return signature
}
