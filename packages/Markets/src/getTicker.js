/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:markets:getticker')

/**
 * Get Ticker
 *
 * Retrieves the NEXA/USD ticker from the default source.
 */
export default async () => {
    let response
    let ticker

    /* Request ticker. */
    response = await fetch('https://nexa.exchange/ticker')
        .catch(err => console.error(err))

    /* Validate response. */
    if (!response) {
        return null
    }

    /* Set ticker. */
    ticker = await response.json()

    /* Return ticker. */
    return ticker
}
