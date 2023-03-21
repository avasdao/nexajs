/* Import modules. */
// const Message = require('bitcore-message')
const Address = require('..').Address
const bitcoinMessage = require('bitcoinjs-message')

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
const verify = (_message, _address, _signature) => {
    /* Set (legacy) address. */
    const address = Address.toLegacyAddress(_address)

    /* Handle verification. */
    const verified = bitcoinMessage.verify(_message, address, _signature)

    /* Return verification. */
    return verified
}

/* Export module. */
module.exports = verify
