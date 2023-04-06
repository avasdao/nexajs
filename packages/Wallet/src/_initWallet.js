/**
 * Initialize Wallet
 */
export default () => {
    console.info('Initializing wallet...') // eslint-disable-line no-console

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
    const coinsModel = {}

    /* Commit coins. */
    commit('setCoins', coinsModel)

    /**
     * Indices Model
     *
     * Manages the indices of account (addresses) and their respective
     * derivation paths.
     *
     * Deposit     : m/44'/29223'/0'/0/<index>          (29223 = 0x7227)
     * Change      : m/44'/29223'/0'/1/<index>
     * Causes Cash : m/44'/29223'/17219'/0/<index>      (17219 = 0x4343 = "CC")
     * Nito Cash   : m/44'/29223'/20035'/0/<index>      (20035 = 0x4E43 = "NC")
     */
    const indicesModel = {
        deposit: 0,
        change: 0,
        causes: 0,
        nito: 0,
    }

    /* Commit indices. */
    commit('setIndices', indicesModel)

    /* Return success. */
    return true
}

/* Export module. */
export default initWallet
