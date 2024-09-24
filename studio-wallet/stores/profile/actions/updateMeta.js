/* Import modules. */
import Bugsnag from '@bugsnag/js'
import crypto from 'crypto'

/**
 * Encrypt
 *
 * Uses AES-256-CBC to encrypt a plaintext string.
 */
function _encrypt(_plaintext, _key, _algo = 'aes-256-cbc') {
    /* Generate initilization vector. */
    const iv = crypto.randomBytes(16)

    /* Initialize cipher. */
    const cipher = crypto.createCipheriv(_algo, Buffer.from(_key), iv)

    /* Update cipher. */
    let encrypted = cipher.update(_plaintext)

    /* Finalize cipher. */
    encrypted = Buffer.concat([encrypted, cipher.final()])

    /* Return encrypted package. */
    return {
        iv: iv.toString('hex'),
        body: encrypted.toString('hex')
    }
}

/**
 * Update Metadata
 *
 * Metadata is used to store details about addresses.
 */
const updateMeta = async ({ commit, getters, rootGetters }, _meta) => {
    /* Commit metadata. */
    commit('setMeta', _meta)

    /* Request master seed. */
    const key = getters.getMasterSeed

    /**
     * Encrypt Metadata
     *
     * For convenience reasons, all metadata is stored in the platform's
     * data repository. For privacy reasons, ALL metadata is first encrypted
     * with a key ONLY known to this profile.
     */
    const encrypted = _encrypt(JSON.stringify(_meta), key)
    // console.log('UPDATE META (encrypted):', encrypted)

    const signedPkg = getters.getSignedMessage(JSON.stringify(encrypted))
    // console.log('SIGNED PACKAGE', signedPkg)

    /* Retrieve API provider. */
    const API_PROVIDER = rootGetters.getApiProvider

    /* Set api target. */
    const target = `${API_PROVIDER}/profiles`

    // FIXME: Consider complications when updating a profile that is OLDER
    //        than the most recent cloud version (as in running the application
    //        for multiple devices).

    /* Call api. */
    return await fetch
        .put(target)
        .send(signedPkg)
        .catch(Bugsnag.notify)
}

/* Export module. */
export default updateMeta

/**
 *
 * {
 *   "addresses": [{
 *     <address>: {
 *       "label": <string>,
 *       "comment": <string>,
 *       "lock": {
 *         "isActive": <boolean>,
 *         "source": <string>, (source_code:source_id)
 *         "createdAt": <datetime>,
 *         "expiresAt": <datetime>
 *       }
 *     }
 *   }],
 * }
 *
 * {
 *   "coins": [{
 *     <coinid>: {
 *       "label": <string>,
 *       "comment": <string>,
 *       "cashfusion": {
 *         "isActive": <boolean>,
 *         "sessionid": <string>,
 *         "phase": <string>,
 *         "generation": <integer>,
 *         "createdAt": <datetime>,
 *         "updatedAt": <datetime>
 *       },
 *       "cashshuffle": {
 *         "isActive": <boolean>,
 *         "sessionid": <string>,
 *         "phase": <string>,
 *         "generation": <integer>,
 *         "createdAt": <datetime>,
 *         "updatedAt": <datetime>
 *       },
 *       "lock": {
 *         "isActive": <boolean>,
 *         "source": <string>, (source_code:source_id)
 *         "createdAt": <datetime>,
 *         "expiresAt": <datetime>
 *       }
 *     }
 *   }]
 * }
 */
