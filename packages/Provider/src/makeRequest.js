/* Set (REST) API endpoints. */
const ROSTRUM_ENDPOINT = 'https://nexa.sh/v1/rostrum'

/* Set constants. */
const ROSTRUM_METHOD = 'POST'

/* Initialize (HTTP) headers. */
const headers = new Headers()
headers.append('Content-Type', 'application/json')

/**
 * Make Request
 *
 * Handles the remote data request.
 */
export default async (_body) => {
    /* Initialize locals. */
    let body
    let response

    /* Validate + sanitize `body`. */
    body = JSON.stringify(_body)

    /* Make remote (data) request. */
    // NOTE: Native `fetch` requires Node v21+.
    response = await fetch(ROSTRUM_ENDPOINT, {
        method: ROSTRUM_METHOD,
        headers,
        body,
    }).catch(err => console.error(err))

    /* Decode response. */
    response = await response.json()

// FIXME Validate + sanitize response.

    /* Return (JSON) response. */
    return response
}
