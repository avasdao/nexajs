/**
 * Rebuild Keypair
 *
 * TODO: Update `generateKeypair` for param and REMOVE THIS FUNCTION,
 *       as it's never used in the codebase.
 */
export default (somePrivateKey) {
    /* Initialize keypair. */
    const keypair = {
        privateKey: new PrivateKey(somePrivateKey)
    }

    /* Set public key. */
    keypair.publicKey = keypair.privateKey.toPublicKey()

    /* Set public key (hex). */
    keypair.publicKeyHex = keypair.publicKey.toString('hex')

    /* Set private key (hex). */
    keypair.privateKeyHex = keypair.privateKey.toString('hex')

    /* Return keypair. */
    return keypair
}
