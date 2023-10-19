/* Import modules. */
import PouchDB from 'pouchdb'

/* Initialize databases. */
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

/**
 * Get Session
 *
 * Connects to a storage device that is managing the sessions for the
 * application to retrieve the user's session.
 */
const getSession = async (_store, _sessionid) => {
    /* Initialize locals. */
    let error
    let session

    // TODO Detect data store (type).

    // TODO Validate data store (connection).

    /* Validate session id. */
    if (!_sessionid) {
        return {
            error: 'Not found',
        }
    }

    /* Retrieve session details (from data store). */
    session = await _store
        .get(_sessionid)
        .catch(err => {
            console.error(err)
            error = err
        })
    // console.log('SESSION:', session)

    /* Validate session. */
    if (!session) {
        return {
            error: 'Not found',
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
    // delete session.session

    /* Return session. */
    return session
}

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let query
    let sessionid

    /* Set (request) query. */
    query = getQuery(event)

    /* Set session id. */
    sessionid = query?.sid

    /* Request session details. */
    return await getSession(sessionsDb, sessionid)
        .catch(err => console.error(err))
})
