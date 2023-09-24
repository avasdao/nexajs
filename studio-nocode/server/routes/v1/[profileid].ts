export default defineEventHandler(async (event) => {
    /* Set profile id. */
    const profileid = event.context.params.profileid

    /* Return profile id. */
    return profileid
})
