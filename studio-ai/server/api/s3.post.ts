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
    let session
    let sessionid
    let success
    let url

    /* Set (request) body. */
    body = await readBody(event)
    // console.log('SESSIONS.POST (body):', body)

    const minioClient = new Minio.Client({
        endPoint: process.env.S3_HOSTNAME,
        accessKey: process.env.S3_ACCESS_KEY,
        secretKey: process.env.S3_SECRET_KEY,
        useSSL: true,
    })
    // console.log('MINIO CLIENT', minioClient)

    const buckets = await minioClient.listBuckets()
    console.log('BUCKETS', buckets)

    // var buffer = 'Hello World'
    // success = await minioClient.putObject('nexa', 'hello-file', buffer)
    // console.log('SAVE OBJECT (success)', success)

    url = await minioClient.presignedGetObject('nexa', 'hello-file', 60)
    console.log('PRE-SIGNED URL', url)

    /* Return session. */
    return url
})
