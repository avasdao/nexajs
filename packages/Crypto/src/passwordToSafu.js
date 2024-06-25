import scrypt from 'scrypt-js'

import unicodeStringToTypedArray from './unicodeStringToTypedArray.js'

/**
 * Password To Safu
 *
 * Uses Scrypt to extend and harden a user-defined password, so that it may be
 * used to protect highly secure information.
 *
 * Parameters:
 *   - password (required)
 *   - salt (optional)
 */
export default async (_params, _status) => {
    let resolve
    let reject
    let status
    let vaultKey

    if (!_params.password) {
        throw new Error(`\n\n  Oops! You're missing a PASSWORD in your parameters.\n`)
    }

    if (!_params.salt) {
        throw new Error(`\n\n  Oops! You're missing a SALT in your parameters.\n`)
    }

    /* Set password. */
    const password = unicodeStringToTypedArray(_params.password)
    // console.log(`Password: [ ${password} ]`)

    /* Set salt. */
    // NOTE: Common salt values: 1. email address, 2. phone number
    const salt = unicodeStringToTypedArray(_params.salt)
    // console.log(`Salt: [ ${salt} ]`)

    /* Set CPU (memory) cost. */
    // NOTE: increasing this increases the overall difficulty.
    const N1  = 16384   // 2^14 (original recommendation)
    const N2  = 32768   // 2^15 (safe recommendation)
    const N4  = 65536   // 2^16 (JS-native recommendation)
    const N64 = 1048576 // 2^20 (optimal recommendation)

    /* Initialize (N) value. */
    let N = N4

    /* Set block size. */
    // NOTE: Increasing this increases the dependency on memory
    //       latency and bandwidth.
    const r = 8

    /* Set parallelization cost. */
    // NOTE: Increasing this increases the dependency on
    //       multi-processing.
    const p = 1

    /* Set derived key length (in bytes). */
    const dkLen = 32

    try {
        vaultKey = await scrypt
            .scrypt(password, salt, N, r, p, dkLen, _status)
            .catch(reject)
        // console.log(`Vault key: [ ${vaultKey} ]`)

        resolve(vaultKey)
    } catch (err) => reject

    /* Return a promise. */
    return new Promise((_resolve, _reject) => {
        resolve = _resolve
        reject = _reject
    })
}
