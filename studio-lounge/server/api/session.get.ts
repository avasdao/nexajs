/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let session
    let sessionid
    let error
    let query

    /* Set (request) query. */
    query = getQuery(event)
    // console.log('QUERY', query)

    /* Set session id. */
    sessionid = query?.sid
    // console.log('SESSION ID', sessionid)

    /* Validate session id. */
    if (!sessionid) {
        return {
            error: 'Not found',
            query,
        }
    }

    /* Save (database) session. */
    session = await sessionsDb
        .get(sessionid)
        .catch(err => {
            console.error(err)
            error = err
        })
    // console.log('SESSION:', session)

    /* Validate session. */
    if (!session) {
        return {
            error: 'Not found',
            query,
        }
    }

    /* Add ID to session. */
    session = {
        id: session._id,
        ...session,
        error,
    }

    /* Sanitize session. */
    delete session._id
    delete session._rev
    // delete session.auth
    delete session.session

    /* Return session. */
    return session
})
