/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:market:getquote')

/* Set endpoint. */
const ENDPOINT = 'https://nexa.exchange/v1'

/**
 * Get Price
 *
 * Returns an object containing the most recent ticker data.
 *
 * TODO: Add support for multiple base currencies.
 */
export default async (_baseCurrency = 'NEXA', _quoteCurrency = 'USD') => {
    /* Validate currencies. */
    if (!_baseCurrency || !_quoteCurrency) {
        return null
    }

    /* Set target. */
    const target = ENDPOINT + _baseCurrency
    debug('getQuote (target):', target)

    /* Call (remote) API. */
    const data = await superagent.get(target)
    debug('getQuote (response):', target)

    /* Validate (response) data. */
    if (data && data.body) {
        /* Return body. */
        return data.body
    } else {
        /* Return null. */
        return null
    }
}
