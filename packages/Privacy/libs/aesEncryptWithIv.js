/**
 * AES Encrypt with IV
 */
export default (key, iv, message) => {
    let cipher, crypted
    cipher = crypto.createCipheriv('aes-128-cbc', key, iv)
    cipher.setAutoPadding(true)
    crypted = cipher.update(message, 'hex', 'hex')
    crypted += cipher.final('hex')

    return Buffer.from(crypted, 'hex')
}
