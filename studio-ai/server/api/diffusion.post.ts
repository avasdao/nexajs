/* Import modules. */
import * as Minio from 'minio'
import moment from 'moment'
import { sha256 } from '@nexajs/crypto'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const diffusionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/diffusions`)
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let body
    let diffusionPkg
    let host
    let logPkg
    let profile
    let response
    let session
    let sessionid

    /* Set (request) body. */
    body = await readBody(event)
    console.log('SESSIONS.POST (body):', body)

    logPkg = {
        _id: uuidv4(),
        source: 'diffusion',
        body,
    }

    await logsDb
        .put(logPkg)
        .catch(err => console.error(err))

    sessionid = body.sessionid

    if (!sessionid) {
        return {
            error: `Oops! You MUST provide a session id.`
        }
    }

    session = await sessionsDb
        .get(sessionid)
        .catch(err => console.error(err))
    console.log('SESSION', session)

    if (!session) {
        return {
            error: `Oops! You MUST create a new session to continue.`
        }
    }

    diffusionPkg = {
        _id: uuidv4(),
        profileid: session.profileid,
        prompt: body.prompt,
        negative_prompt: null,
        isCompleted: false,
        createdAt: moment().unix(),
    }

    response = await diffusionsDb
        .put(diffusionPkg)
        .catch(err => console.error(err))

    if (!response) {
        return {
            error: `Oops! There was an ERROR processing your request.`
        }
    }

    host = process.env.AI_HOST
    console.log('HOST', host)

    response = await $fetch(host, {
        method: 'POST',
        body,
    })
    console.log('AI HOST (response):', response)

    return {
        ...response,
        success: true,
    }
})
