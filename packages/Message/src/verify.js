/* Import modules. */
// const Message = require('bitcore-message')
// const Address = require('..').Address
// const bitcoinMessage = require('bitcoinjs-message')

/**
 * Verify Message
 */
// const verify = (_address, _signature, _message) => {
//     /* Handle verification. */
//     const verified = Message(_message).verify(_address, _signature);
//
//     /* Return verification. */
//     return verified
// }
export default (_message, _address, _signature) => {
    /* Initialize locals. */
    let verified

    verified = false
    /* Set (legacy) address. */
    // const address = Address.toLegacyAddress(_address)

    /* Handle verification. */
    // const verified = bitcoinMessage.verify(_message, address, _signature)

    /* Return verification. */
    return verified
}
