/* Import modules. */
const bch = require('bitcore-lib-cash')
const debug = require('debug')('nitojs:wallet:createaccount')
const Crypto = require('../Crypto')

/**
 * Create Account
 *
 * Creates a new Bitcoin wallet.
 *
 * An optional `key` can be provided to allow for deterministic wallet
 * generation.
 *
 * A security parameter allows for automatic key generation, in this case,
 * either 12 words (128-bit) or 24 words (256-bit) security is required.
 */
const createAccount = function () {
    debug('Initializing wallet...') // eslint-disable-line no-console

    // FIXME
    if (this._mappedKeys && this._numSigs) {
        return bch.Address(this._mappedKeys, this._numSigs)
    }

    /* Validate wallet key. */
    if (!this._walletKey) {
        throw new Error(`[ ${this._walletKey} ] is an invalid wallet key.`)
    }

    /* Validate wallet key. */
    // TODO: Add improved validation for seed.
    if (this._walletKey.length === 32) { // buffer
        /* Set seed. */
        this._seed = this._walletKey
    } else if (this._walletKey.length === 64) { // hex
        /* Set seed. */
        this._seed = Buffer.from(this._walletKey, 'hex')
    } else if (this._walletKey.length > 64) { // FIXME: Improve mnemonic validation.
        /* Set mnemonic. */
        this._mnemonic = this._walletKey
    }

    /* Validate params. */
    // TODO: Allow master seed to be auto-generated and returned in response.
    // TODO: Add support for mnemonic phrase.
    if (!this._walletKey && !this._securityLevel) {
        throw new Error(`A 32-byte master seed is required to create a new wallet.`)
    }

    /* Validate seed. */
    if (!this._seed) {
        /**
         * Master Seed
         *
         * Generate a wallet master seed from random bytes.
         *
         * !!! WARNING !!! WARNING !!! WARNING !!!
         * We MUST properly evaluate ANY and ALL weaknesses with
         * using randomBytes via a ("mobile") web browser.
         */
        this._seed = Crypto.randomBytes(32)
    }

    /* Validate seed. */
    if (!this._seed) {
        throw new Error(`Seed buffer failed to be generated during wallet creation.`)
    }

    /* Set locale. */
    // FIXME: Auto-detect locale.
    const locale = 'en-US'

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

    /* Validate mnemonic. */
    if (!this._mnemonic && this._seed) {
        /* Initialize mnemonic. */
        this._mnemonic = Crypto.mnemonic(this._seed, language)
        debug('Mnemonic', this._mnemonic)
    } else {
        /* Initialize mnemonic. */
        this._mnemonic = Crypto.mnemonic(this._mnemonic, language)
    }

    /**
     * Coins Model
     *
     * Coins are (UTXO) objects containing:
     *     - txid
     *     - vout
     *     - satoshis
     *     - wif (Wallet Import Format)
     *     - cashAddress
     *     - legacyAddress
     *
     * Status codes:
     *     active: Session address is ready to receive OR spend funds.
     *     disabled: Already received and spent funds (MUST be empty).
     *     locked: Session address is reserved OR has received funds currently
     *             being held in reserve for a later use.
     *             (eg. CashShuffle, CashFusion, ANYONECANPAY, etc)
     *
     * NOTE: Reserved paths are used to "freeze" coins, for use with
     *       assurance contracts.
     */
    // const coinsModel = {}

    /* Commit coins. */
    // commit('setCoins', coinsModel)

    /**
     * Indices Model
     *
     * Manages the indices of account (addresses) and their respective
     * derivation paths.
     *
     * Deposit     : m/44'/145'/0'/0/<index>
     * Change      : m/44'/145'/0'/1/<index>
     */
    // const indicesModel = {
    //     deposit: 0,
    //     change: 0,
    // }

    /* Commit indices. */
    // commit('setIndices', indicesModel)

    /* Initialize accounts. */
    // NOTE: These accounts are cached for quick access in the wallet.
    // const accounts = getters.getAccounts
    // console.info('Wallet accounts..', accounts) // eslint-disable-line no-console

    /* Generate seed. */
    const seed = this._mnemonic.toSeed()

    /* Initialize HD "parent" node. */
    // this.node = this._mnemonic.toHDPrivateKey()
    const root = bch.HDPrivateKey.fromSeed(seed)
    // console.log('ROOT PRIVATE KEY', root.toString())

    /* Set "default" BCH path. */
    const path = `m/44'/145'/0'`

    /* Initialize "BCH" node. */
    this.node = root.deriveChild(path)
    // console.log('DEFAULT PRIVATE KEY', this.node.toString())

    /* Initialize first account. */
    const firstAcct = this.node.deriveChild(`m/0/0`)

    /* Return first account. */
    return firstAcct
}

/* Export module. */
module.exports = createAccount
