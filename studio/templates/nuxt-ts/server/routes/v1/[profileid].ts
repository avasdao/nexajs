export default defineEventHandler(async (event) => {
    /* Set profile id. */
    const profileid = event.context.params.profileid

    /* Validate profile id. */
    if (typeof profileid === 'undefined' || profileid === null) {
        /* Set status code. */
        setResponseStatus(event, 404)

        return 'Oops! Something went wrong..'
    }

    /* Return profile id. */
    return profileid
})
