/* Import modules. */
import Nexa from 'nexajs'

/**
 * Get Mnemonic
 *
 * source: https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki
 */
const getMnemonic = (state, getters, rootState, rootGetters) => {
    /* Set master seed. */
    const masterSeed = rootGetters['profile/getMasterSeed']

    /* Set locale. */
    const locale = rootGetters.getLocale

    /**
     * Create mnemonic wordlist using BIP-39.
     * (https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki)
     *
     * Available languages are:
     *   01. English
     *   02. Japanese
     *   03. Korean
     *   04. Spanish
     *   05. Chinese (Simplified)
     *   06. Chinese (Traditional)
     *   07. French
     *   08. Italian
     *   09. Czech
     */
    let language = null

    /* Handle language selection. */
    switch(locale) {
    case 'en-US':
        language = 'English'
        break
    default:
        language = 'English'
    }

    /* Initialize mnemonic. */
    const mnemonic = Nexa.Crypto.mnemonic(masterSeed, language)
    // console.log('MNEMONIC', mnemonic)

    /* Return mnemonic. */
    return mnemonic
}

/* Export module. */
export default getMnemonic
