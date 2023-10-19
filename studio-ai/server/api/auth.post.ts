/* Import modules. */
import moment from 'moment'
import PouchDB from 'pouchdb'
import { v4 as uuidv4 } from 'uuid'

import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

import { instantiateSecp256k1 } from '@bitauth/libauth'

/* Initialize databases. */
const logsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/logs`)
const profilesDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/profiles`)
const sessionsDb = new PouchDB(`http://${process.env.COUCHDB_USER}:${process.env.COUCHDB_PASSWORD}@127.0.0.1:5984/sessions`)

/**
 * Get Profile
 *
 * Retrieves the full profile of the (authorized) public key.
 */
const getProfile = async (
    _sessionid,
    _publicKey,
    _signature,
    _timestamp,
) => {
    /* Initialize locals. */
    let challenge
    let email
    let logPkg
    let messageHash
    let nickname
    let timestamp
    let profile
    let publicKey
    let response
    let secp256k1
    let session
    let sessionid
    let signature
    let success
    let unitSeparator

    sessionid = _sessionid
    publicKey = hexToBin(_publicKey)
    signature = hexToBin(_signature)
    timestamp = _timestamp

    // Instantiate the Secp256k1 interface.
    secp256k1 = await instantiateSecp256k1()

    /* Set unit separator. */
    unitSeparator = '1f'

    logPkg = {
        _id: uuidv4(),
        source: 'auth',
        sessionid,
        publicKey,
        signature,
        challenge,
        createdAt: moment().unix(),
    }
    // console.log('LOGS PKG', logPkg)

    response = await logsDb
        .put(logPkg)
        .catch(err => console.error(err))
    // console.log('RESPONSE', response)

    /* Validate session Id. */
    if (!sessionid) {
        return {
            error: 'Invalid session Id.',
        }
    }

    /* Request session. */
    session = await sessionsDb
        .get(sessionid)
        .catch(err => console.error(err))
    // console.log('SESSION (cookie):', session)

    /* Validate session. */
    if (!session) {
        return {
            error: 'Session was NOT found!',
        }
    }

    challenge = session?.challenge
    // expiresAt = session.expiresAt

    /* Validate challenge. */
    if (!challenge) {
        return {
            error: 'FATAL: Authorization challenge was NOT found!',
        }
    }

    // TODO Verify that the timestamp is within +/- 15-second window.

    messageHash = hexToBin(`${timestamp}${unitSeparator}${challenge}`)

    success = secp256k1.verifySignatureSchnorr(signature, publicKey, messageHash)
    // console.log('AUTH VERIFICATION SUCCESS', success)

    /* Verify challenge. */
    if (success !== true) {
        return `Authorization FAILED!`
    }

    /* Add profile (address + signature) to session. */
    session = {
        profileid: binToHex(publicKey),
        auth: binToHex(signature),
        ...session,
        updatedAt: moment().unix(),
    }
    // console.log('AUTH SESSION', session)

    /* Request session update. */
    response = await sessionsDb
        .put(session)
        .catch(err => console.error(err))
    // console.log('SESSION UPDATE:', response)

    /* Request profile. */
    profile = await profilesDb
        .get(binToHex(publicKey))
        .catch(err => console.error(err))
    // console.log('PROFILE:', profile)

    /* Validate profile. */
    if (!profile) {
        /* Create NEW profile. */
        profile = {
            _id: binToHex(publicKey),
            nickname,
            email,
            auths: 1,
            createdAt: moment().unix(),
        }
    } else {
        profile = {
            ...profile,
            auths: profile.auths + 1,
            updatedAt: moment().unix(),
        }
    }

    /* Request profile update. */
    response = await profilesDb
        .put(profile)
        .catch(err => console.error(err))
    // console.log('PROFILE UPDATE:', response)

    profile = {
        id: profile._id,
        sessionid,
        ...profile,
    }

    delete profile._id
    delete profile._rev

    /* Return profile. */
    return profile
}


export default defineEventHandler(async (event) => {
    /* Initialize locals. */
    let body
    let publicKey
    let sessionid
    let signature
    let timestamp

    /* Set (request) body. */
    body = await readBody(event)

    /* Validate body. */
    if (!body) {
        return `Authorization FAILED!`
    }

    /* Set profile parameters. */
    sessionid = body.sessionid
    publicKey = body.publicKey
    signature = body.signature
    timestamp = body.timestamp

    // NOTE: Returns a promise.
    return getProfile(
        sessionid,
        publicKey,
        signature,
        timestamp,
    )
})
