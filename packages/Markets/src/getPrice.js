/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:markets:getprice')

/**
 * Get Price
 *
 * Retrieves the NEXA/USD price from the default source.
 */
export default async () => {
    let price
    let response

    /* Request price. */
    response = await fetch('https://nexa.exchange/price')
        .catch(err => console.error(err))

    /* Validate response. */
    if (!response) {
        return 0.00
    }

    /* Set price. */
    price = await response.text()

    /* Convert to Number. */
    price = parseFloat(price)

    /* Return price. */
    return price
}