/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (Token) Address Balance
 *
 * Return the confirmed and unconfirmed balances of tokens in a Bitcoin Cash or Nexa address.
 */
export default async function (_address, _cursor, _tokenid) {
    /* Initialize locals. */
    let method
    let params
    let request

    /* Set method. */
    method = 'token.address.get_balance'

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
