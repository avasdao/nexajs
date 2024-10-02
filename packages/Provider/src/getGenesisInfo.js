/* Import (local) modules. */
import makeRequest from './makeRequest.js'
import isCachedAsset from './isCachedAsset.js'

/**
 * (Token) Genesis Info
 *
 * Info from token creation transaction.
 */
export default async function (_tokenid) {
    if (isCachedAsset(_tokenid)) {
// FOR TEMP USE ONLY
console.info('[CACHED] getGenesisInfo', _tokenid)
        return isCachedAsset(_tokenid)
    }

    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'token.genesis.info'

    /* Set parameters. */
    params = [ _tokenid ]

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
