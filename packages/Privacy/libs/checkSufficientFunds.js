/**
 * Check Sufficient Funds
 */
export default (inputs, amount) => {
    console.log('Funds verification (amount):', amount)
    // Currently this is done in the `getCoinDetails` function
    // and it's called just before we add the player to the round.
    // It's also done as we're building the shuffle transaction.
    // I want to break this functionality out so we can check from
    // any time.
}
