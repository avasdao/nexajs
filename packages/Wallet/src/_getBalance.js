/* Import modules. */
import Nexa from 'nexajs'

/**
* Get Balance by Session Id
*
* Retrieves the current (total) session balance.
*
* NOTE: Optional (market price) parameter is used to calculate fiat value,
*       and return a "formatted" value package.
*/
const getBalanceBySessionId = (
    state, getters, rootState, rootGetters
) => async (_quoteCurrency) => {
    /* Set base currency. */
    const baseCurrency = 'BCH'

    /* Retrieve accounts. */
    const accounts = getters.getAccounts
    // console.log('GET BALANCE (accounts)', accounts)

    /* Validate accounts. */
    if (accounts === null) {
        return
    }

    /* Build search array. */
    const addresses = accounts.map(obj => {
        return obj.address
    })
    // console.log('GET BALANCE (all accounts)', addresses)

    /* Validate search accounts. */
    if (!addresses && addresses.length) {
        return 0
    }

    /* Initialize balance. */
    let balance = 0

    /* Loop through all address. */
    // FIXME: We do not use for-each with callback here because of async.
    for (let i = 0; i < addresses.length; i++) {
        /* Set address. */
        const address = addresses[i]

        /* Retrieve (address) balances. */
        // TODO Use wallet.coins to track balance (faster!)
        const balances = await Nexa.Address.balance(address)

        /* Validate balances. */
        if (!balances) {
            continue
        }

        /* Check unconfirmed flag. */
        if (rootGetters['getFlags'].unconfirmed) {
            balance += (balances.confirmed + balances.unconfirmed)
        } else {
            balance += balances.confirmed
        }
    }

    /* Retrieve market price. */
    const marketPrice = await Nexa.Markets.getTicker(baseCurrency, _quoteCurrency)
    console.info(`Market price (${_quoteCurrency})`, marketPrice) // eslint-disable-line no-console

    /* Validate market price. */
    if (marketPrice) {
        /* Format balance (for display). */
        // TODO: Support additional currencies.
        const formattedBalance =
            rootGetters['utils/getFormattedValue'](balance, marketPrice, _quoteCurrency)

        /* Return (formatted) balance. */
        return formattedBalance
    } else {
        /* Return (empty) balance. */
        return null
    }
}

/* Export module. */
export default getBalanceBySessionId
