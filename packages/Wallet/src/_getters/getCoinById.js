/**
 * Get Coin by Id
 *
 * Returns the full coin details.
 */
const getCoinById = (state, getters) => (_coinId) => {
    /* Set coin id. */
    const coinId = _coinId
    // console.log('GET COIN BY ID (coinid)', coinId)

    /* Validate sessions. */
    if (!getters.getSessions) {
        return null
    }

    /* Initialize sessions. */
    const sessions = getters.getSessions
    // console.log('GET COIN BY ID (sessions):', sessions)

    /* Initialize coin. */
    let coin = null

    Object.keys(sessions).forEach(_sessionId => {
        /* Validate coin. */
        if (coin) return

        /* Set session. */
        const session = sessions[_sessionId]

        /* Set coins. */
        const coins = session.coins

        Object.keys(coins).forEach(_coinId => {
            /* Validate coin. */
            if (coin) return

            if (_coinId === coinId) {
                coin = coins[_coinId]
            }
        })
    })

    /* Return account. */
    return coin
}

/* Export module. */
export default getCoinById
