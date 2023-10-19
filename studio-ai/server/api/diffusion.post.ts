/* Import modules. */
import * as Minio from 'minio'
import moment from 'moment'
import { sha256 } from '@nexajs/crypto'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

/* Initialize databases. */
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let body
    let host
    let response

    /* Set (request) body. */
    body = await readBody(event)
    console.log('SESSIONS.POST (body):', body)

    host = process.env.AI_HOST
    console.log('HOST', host)

    response = await $fetch(host, {
        method: 'POST',
        body,
    })
    console.log('AI HOST (response):', response)

    return {
        success: true,
        response,
    }
})
