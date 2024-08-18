/* Import modules. */
import crypto from 'crypto'
import CryptoJS from 'crypto-js'
import AES from 'crypto-js/aes.js'

import { randomBytes } from '../index.js'

// FIXME What is this for??
CryptoJS.pad.NoPadding = { pad: function (){}, unpad: function (){} }

/* Set constants. */
const AES_ALGO = 'aes-128-cbc' // NOTE: Offers greatest compatibility (with legacy systems).
// const AES_ALGO = 'aes-256-cbc'
// const AES_ALGO = 'aes-256-ctr' // NOTE: Offers the least compatibility (with legacy systems).
const IV_LENGTH = 16

/**
 * Encrypt
 *
 * Performs AES encryption on the plain body provided to the function.
 *
 * Parameters:
 *   - body (required)
 *   - key | password (required)
 */
export default (_privkey, _iv, _plaintext) => {
    /* Initialize locals. */
    let bodyType
    let hexBody
    let iv
    let plainBody
    let privateKey

    /* Validate parameters. */
    // NOTE: Initialization vector is an OPTIONAL parameter.
    if (typeof _plaintext === 'undefined' || _plaintext === null) {
        /* Set plain body. */
        plainBody = _iv

        /* Set initialization vector. */
        // NOTE: This value MUST be unique for EVERY encryption.
        iv = Buffer.from(randomBytes(IV_LENGTH))
    } else {
        /* Set plain body. */
        plainBody = _plaintext

        /* Set initialization vector. */
        // NOTE: This value MUST be unique for EVERY encryption.
        iv = _iv
    }

    /* Validate plain body. */
    if (!plainBody) {
        throw new Error(`Oops! You're missing a BODY in your parameters.`)
    }

    /* Validate initialization vector. */
    if (!iv) {
        throw new Error(`Oops! You're missing the INITIALIZATION VECTOR in your parameters.`)
    }

    /* Validate (String) body. */
    if (typeof plainBody === 'string' || plainBody instanceof String) {
        bodyType = 'string'

        // plainBody = plainBody
    }

    /* Validate body type. */
    if (!bodyType) {
        try {
            /* Parse plain body. */
            plainBody = JSON.stringify(JSON.parse(plainBody))

            /* Set body type. */
            bodyType = 'json'
        } catch (e) { /* do nothing */ }
    }

    /* Set private key. */
    // TODO Validate and convert, if necessary.
    privateKey = Buffer.from(_privkey, 'hex')
    console.log('****PRIVATE KEY', privateKey)

    /* Validate private key. */
    if (!privateKey) {
        throw new Error(`Oops! You're missing a KEY or PASSWORD in your parameters.`)
    }

    /* Initialize locals. */
    let crypted
console.log('****AES_ALGO', AES_ALGO);
console.log('****privateKey', privateKey);
console.log('****iv', iv);
    /* Initialize AES cipher. */
    const cipher = crypto.createCipheriv(AES_ALGO, privateKey, iv)
    console.log('******CIPHER', cipher)

    /* Set auto-padding flag. */
    cipher.setAutoPadding(true)

    /* Convert plain body to Hex. */
    hexBody = Buffer.from(plainBody, 'utf8').toString('hex')
    console.log('HEX BODY', hexBody)

    /* Update cipher. */
    crypted = cipher.update(hexBody, 'hex', 'hex')

    /* Append the final (data block). */
    crypted += cipher.final('hex')

    /* Return the (final) buffer. */
    return Buffer.from(crypted, 'hex')
}
