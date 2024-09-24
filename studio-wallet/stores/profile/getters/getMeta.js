/* Import modules. */
import Bugsnag from '@bugsnag/js'
import crypto from 'crypto'
import { Address } from '@nexajs/addres'

/**
 * Decrypt
 *
 * Recovers the plaintext string from AES-256-CBC encrypted message.
 */
function _decrypt(_encrypted, _key) {
    /* Set initilization vector. */
    const iv = Buffer.from(_encrypted.iv, 'hex')

    /* Set encrypted text. */
    const encryptedText = Buffer.from(_encrypted.body, 'hex')

    /* Initialize decipher. */
    const decipher = crypto
        .createDecipheriv('aes-256-cbc', Buffer.from(_key), iv)

    /* Update decipher with encrypted text. */
    let decrypted = decipher.update(encryptedText)

    /* Finalize decrypted message. */
    decrypted = Buffer.concat([decrypted, decipher.final()])

    /* Return decrypted string. */
    return decrypted.toString()
}

/**
 * Get Metadata
 */
const getMeta = async (state, getters, rootState, rootGetters) => {
    /* Initialize locals. */
    let response
    
    /* Validate state. */
    if (!state || !state.meta) {
        /* Set profile index. */
        const profileIndex = 0

        /* Set chain. */
        const chain = 0 // receiving account

        /* Set derivation path. */
        const path = rootGetters['wallet/getDerivationPath'](chain, profileIndex)
        // console.log('GET ADDRESS (path)', path)

        /* Initialize HD node. */
        const hdNode = rootGetters['wallet/getHDNode']

        /* Initialize child node. */
        const childNode = hdNode.deriveChild(path)

        /* Set (profile) address. */
        const address = Address.toCashAddress(childNode)

        /* Retrieve API provider. */
        const API_PROVIDER = rootGetters.getApiProvider

        /* Set target. */
        const target = `${API_PROVIDER}/profiles/${address}`

        /* Set contract path. */
        response = await fetch(target)
            .catch(Bugsnag.notify)
        response = await response.json()
        // console.log('GET META (response):', response)

        /* Validate resopnse. */
        // FIXME: This may be singleton OR not index-0
        if (response && response.body && response.body[0] && response.body[0].meta) {
            /* Set (encrypted) metadata. */
            const encrypted = response.body[0].meta // FIXME: This may be singleton OR not index-0
            // console.log('GET META (encrypted):', encrypted)

            /* Request decryption key. */
            const key = getters.getMasterSeed

            try {
                /* Decrypt metadata. */
                const decrypted = _decrypt(encrypted, key)
                // console.log('GET META (decrypted):', decrypted)

                const parsed = JSON.parse(decrypted)
                // console.log('GET META (parsed):', parsed)

                /* Return (parsed) metadata. */
                return parsed
            } catch (err) {
                console.error(err) // eslint-disable-line no-console

                /* Report error. */
                Bugsnag.notify(err)

                /* Return error message. */
                return err
            }
        } else {
            return null
        }
    } else {
        /* Return metadata. */
        return state.meta
    }
}

/* Export module. */
export default getMeta
