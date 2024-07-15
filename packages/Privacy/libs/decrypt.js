/**
 * Decrypt
 */
export default (encryptedMessage, somePrivateKeyHexString) => {
    /* Initialize private key. */
    const privateKey = new PrivateKey(somePrivateKeyHexString)

    /* Initialize encrypted (message). */
    const encrypted = Buffer.from(encryptedMessage, 'base64')

    /* Valiate encrypted (message). */
    if (encrypted.length < 85) {
        throw new Error('invalid ciphertext: length')
    }

    /* Set magic (bytes). */
    const magic = encrypted.slice(0, 4)

    /* Initialize ephemeral public key. */
    let ephemeralPubkey = encrypted.slice(4, 37)

    /* Set ciphertext. */
    const ciphertext = encrypted.slice(37, -32)

    /* Set MAC. */
    const mac = encrypted.slice(-32)

    /* Validate magic (bytes). */
    if (magic.toString() !== 'HUSH') {
        throw new Error('invalid ciphertext: invalid magic bytes')
    }

    try {
        /* Set ephemeral public key. */
        ephemeralPubkey = PublicKey(ephemeralPubkey)
    } catch (error) {
        throw new Error('invalid ciphertext: invalid ephemeral pubkey')
    }

    // ???
    ephemeralPubkey.point.validate()

    /* Set secret multiplier. */
    const secretMultiplier = privateKey.toBigNumber()

    /* Set ECDH key. */
    const ecdhKey = PublicKey(
        ephemeralPubkey.point.mul(secretMultiplier)).toBuffer()

    /* Set key. */
    const key = crypto.createHash('sha512').update(ecdhKey).digest()

    /* Set initialization vector. */
    const iv = key.slice(0, 16)

    /* Set key (E). */
    const keyE = key.slice(16, 32)

    /* Set key (M). */
    const keyM = key.slice(32)

    /* Calculate the "valid" MAC. */
    const validMac = crypto
        .createHmac('sha256', keyM)
        .update(encrypted.slice(0, -32))
        // .update(encrypted.slice(-32)) // THIS SHOULD WORK AS WELL
        .digest('hex')

    /* Validate MAC. */
    if (mac.toString('hex') !== validMac) {
        throw new Error('invalid password')
    }

    /* Return decrypted string. */
    return _aesDecryptWithIV(keyE, iv, ciphertext)
}
