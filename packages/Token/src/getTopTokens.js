/* Set constants. */
const OTOPLO_ENDPOINT = 'https://tokenapi.otoplo.com/api/v1'

/**
 * Top Tokens
 *
 * Retrieves a list of the TOP tokens (by transaction count).
 */
export default async (_max = 20) => {
    /* Request (API) data. */
    const response = await fetch(`${OTOPLO_ENDPOINT}/tokens/top?max=${_max}`)
        .catch(err => console.error(err))
    // console.log('TOP TOKENS (response):', response)

    /* Return (JSON) response. */
    return response.json()
}
