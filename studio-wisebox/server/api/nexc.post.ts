/* Import modules. */
import moment from 'moment'
import { sha256 } from '@nexajs/crypto'
import { v4 as uuidv4 } from 'uuid'

export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let body
    let response
    let session
    let sessionid
    let success

    /* Set (request) body. */
    body = await readBody(event)
    console.log('SESSIONS.POST (body):', body)

    /* Return session. */
    return body
})
