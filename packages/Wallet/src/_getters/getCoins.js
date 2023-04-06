/**
 * Get Coins
 */
const getCoins = (state) => {
    /* Validate state. */
    if (!state || !state.coins) {
        return null
    }

    /* Initialize coins. */
    const coins = state.coins

    /* Return coins. */
    return coins
}

/* Export module. */
export default getCoins
