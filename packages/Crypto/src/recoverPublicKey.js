/**
 * Will return a public key string if the provided signature and the message digest is correct
 * If it isn't the specific reason is accessible via the "error" member.
 *
 * @param {Address|String} nexaAddress - A nexa address
 * @param {String} signatureString - A base64 encoded compact signature
 * @returns {String}
 */
export default (nexaAddress, signatureString) => {
    // $.checkArgument(nexaAddress)
    // $.checkArgument(signatureString && _.isString(signatureString))

    // if (_.isString(nexaAddress)) {
        // nexaAddress = Address.fromString(nexaAddress)
    // }

    var signature = Signature
        .fromCompact(Buffer.from(signatureString, 'base64'))

    // recover the public key
    var ecdsa = new ECDSA()

    ecdsa.hashbuf = this.magicHash()
    ecdsa.sig = signature

    var publicKey = ecdsa.toPublicKey()

    // var signatureAddress = Address.fromPublicKey(publicKey, nexaAddress.network, nexaAddress.type)

    // check that the recovered address and specified address match
    if (nexaAddress.toString() !== signatureAddress.toString()) {
        this.error = 'The signature did not match the message digest'
    }

    return publicKey.toString()
}
