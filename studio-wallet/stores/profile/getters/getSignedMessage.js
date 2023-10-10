/* Import modules. */
import moment from 'moment'
import { Address } from '@nexajs/address'
// import { Message } from '@nexajs/message'

/**
 * Get Signed Message
 */
const getSignedMessage = (state, getters, rootState, rootGetters) => (_message) => {
    /* Validate message. */
    if (!_message || !(typeof _message === 'string')) {
        throw new Error('Signed message MUST be a string.')
    }

    /* Validate accounts. */
    if (!rootGetters['wallet/getAccounts']) {
        return null
    }

    /* Request accounts. */
    const accounts = rootGetters['wallet/getAccounts']

    /* Validate accounts. */
    if (!accounts) {
        return null
    }

    /* Set profile index. */
    const profileIndex = 0

    /* Set chain. */
    const chain = 0 // receiving account

    /* Set derivation path. */
    const path = rootGetters['wallet/getDerivationPath'](chain, profileIndex)

    /* Initialize HD node. */
    const hdNode = rootGetters['wallet/getHDNode']

    /* Initialize child node. */
    const childNode = hdNode.deriveChild(path)

    /* Set (profile) address. */
    const address = Address.toCashAddress(childNode)

    /* Set WIF. */
    const wif = childNode.privateKey.toWIF()

    /* Set nonce. */
    const nonce = moment().unix()

    /* Request signature. */
    const signature = Message.sign(`${_message}:${nonce}`, wif)
    // console.log('GET SIGNED MESSAGE (signature):', signature)

    /* Build package. */
    const pkg = {
        message: _message,
        address,
        signature,
        nonce,
    }
    // console.log('GET SIGNED MESSAGE (pkg):', pkg)

    /* Return signature package. */
    return pkg
}

/* Export module. */
export default getSignedMessage
