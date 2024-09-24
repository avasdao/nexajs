export default async (_target) => {
    /* Initialize locals. */
    let errors
    let json
    let response

    /* Request (data) target. */
    // NOTE: Native `fetch` requires Node v21+.
    response = await fetch(_target)
        .catch(err => {
            console.error(err)
            errors = err
        })
    // console.log('RESPONSE', response)

    /* Validate response. */
    if (response) {
        return response.json() // Promise
    }

    /* Return errors. */
    return errors
}
