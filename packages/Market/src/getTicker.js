/**
 * Get Ticker
 *
 * Retrieves the NEXA/USD ticker from the default source.
 */
export default async () => {
    let response
    let ticker

    /* Request ticker. */
    response = await fetch('https://api.telr.io/v1/ticker/quote/NEXA')
        .catch(err => console.error(err))

    /* Validate response. */
    if (!response) {
        return null
    }

    /* Set ticker. */
    ticker = await response
        .json()
        .catch(err => console.error(err))

    /* Return ticker. */
    return ticker
}
