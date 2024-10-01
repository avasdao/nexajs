/* Import (local) modules. */
import makeRequest from './makeRequest.js'

/**
 * (NFT) List
 *
 * Return list of all NFT's minted from a specified parent token.
 */
export default async function (_tokenid, _cursor) {
    /* Initialize locals. */
    let method
    let params
    let request

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
        request: method,
        params,
    }

    /* Return (async) request. */
    return makeRequest(request)
}
