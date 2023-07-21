/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
* (Token) Address Balance
*
* Return the confirmed and unconfirmed balances of tokens in a Bitcoin Cash or Nexa address.
*
* Version added: Rostrum 6.0
*/
export default async function (_address, _cursor, _tokenid) {
    /* Initialize locals. */
    let method
    let params
    let request
    let rostrum

    /* Validate instance. */
    if (typeof this === 'undefined') {
        /* Initialize Rostrum instance. */
        rostrum = await Rostrum.init()

        /* Call self (via instance). */
        return rostrum.getAddressTokenBalance(_address, _cursor, _tokenid)
    }

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
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
