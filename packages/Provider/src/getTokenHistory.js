/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Token) History
 *
 * Return all confirmed and unconfirmed token transaction history of a given token.
 */
export default async function (_address, _cursor, _tokenid) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'token.transaction.get_history'

    /* Set parameters. */
    if (_cursor) {
        params = [
            _address,
            _cursor,
            _tokenid,
        ]
    } else {
        params = [
            _address,
            _tokenid,
        ]
    }

    /* Build request. */
    request = {
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
