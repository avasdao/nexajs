/**
 * Update Coin
 *
 * Updates the status of a coin in its respective session.
 */
const updateCoin = ({ commit, getters }, _coin) => {
    console.info('Updating coin...', _coin) // eslint-disable-line no-console

    /* Request coins. */
    const coins = getters.getCoins
    // console.log('UPDATE COIN (coins):', coins)

    /* Validate coins. */
    if (!coins) {
        return
    }

    /* Add coin to session. */
    coins[`${_coin.txid}:${_coin.vout}`] = _coin

    /* Commit updated wallet. */
    commit('setCoins', coins)
}

/* Export module. */
export default updateCoin
