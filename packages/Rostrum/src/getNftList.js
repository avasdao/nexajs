/* Import modules. */
import { Rostrum } from '../index.js'
import makeRequest from './makeRequest.js'

/**
 * (NFT) List
 *
 * Return list of all NFT's minted from a specified parent token.
 *
 * Version added: Rostrum 7.0
 */
export default async function (_tokenid, _cursor) {
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
        return rostrum.getNftList(_tokenid, _cursor)
    }

    /* Set method. */
    method = 'token.nft.list'

    /* Set parameters. */
    if (_cursor) {
        params = [
            _tokenid,
            _cursor,
        ]
    } else {
        params = [ _tokenid ]
    }

    /* Build request. */
    request = {
        method,
        params,
    }

    /* Return (async) request. */
    return makeRequest.bind(this)(request)
}
