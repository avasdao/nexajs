/* Import modules. */
const debug = require('debug')('nitojs:markets:getticker')
const superagent = require('superagent')

/* Set endpoint. */
const ENDPOINT = 'https://api.telr.io/v1/ticker/price/'

/**
 * Get Ticker
 *
 * Returns a single float value of the latest ticker price.
 *
 * TODO: Add support for multiple base currencies.
 */
const getTicker = async function (_baseCurrency, _quoteCurrency = 'USD') {
    /* Validate currencies. */
    if (!_baseCurrency || !_quoteCurrency) {
        return null
    }

    /* Set target. */
    const target = ENDPOINT + _baseCurrency
    debug('getTicker (target):', target)

    /* Call (remote) API. */
    const data = await superagent.get(target)
    debug('getTicker (response):', target)

    /* Validate (response) data. */
    if (data && data.text) {
        /* Return text. */
        return data.text
    } else {
        /* Return null. */
        return null
    }

}

/* Export module. */
module.exports = getTicker
