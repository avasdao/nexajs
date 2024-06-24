/* Import modules. */
import SecureLS from 'secure-ls'

/**
 * Save To Safu
 *
 * Saves data encrypted to local storage.
 */
export default (_params) => {
    let body
    let errors
    let id
    let key

    body = _params?.body

    if (!body) {
        throw new Error(`\n\n  Oops! You're missing a BODY in your parameters.\n`)
    }

    key = _params?.key

    if (!key) {
        throw new Error(`\n\n  Oops! You're missing a KEY or PASSOWRD in your parameters.\n`)
    }

    const ls = new SecureLS({
        encodingType: 'aes',
        isCompression: false,
        encryptionSecret: key,
    })

    /* Save to local storage. */
    // TODO Add support for Node.js (disk) storage.
    ls.set(id, body)

    return {
        errors,
        id,
        key,
        body,
    }
}
