/* Import modules. */
const debug = require('debug')('nitojs:markets:getquote')
const superagent = require('superagent')

/* Set endpoint. */
const ENDPOINT = 'https://api.telr.io/v1/ticker/quote/'

/**
 * Get Quote
 *
 * Returns an object containing the most recent ticker data.
 *
 * TODO: Add support for multiple base currencies.
 */
const getQuote = async function (_baseCurrency, _quoteCurrency = 'USD') {
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

/* Export module. */
module.exports = getQuote
