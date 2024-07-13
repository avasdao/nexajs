/* Import modules. */
import { EventEmitter } from 'events'

/* Import (local) modules. */
// TBD

/**
 * Prvacy Status
 *
 * Enumeration of all possible privacy (status) conditions.
 */
const _PrivacyStatus = Object.freeze({
	FAILED   : Symbol('failed'),
	LOADING  : Symbol('loading'),
	ONLINE   : Symbol('online'),
	READY    : Symbol('ready'),
	UNKNOWN  : Symbol('unknown'),
	UPDATING : Symbol('updating'),
})

/* Export (local) modules. */
export const sendToPeer = async (_peerid) => {
    console.log('Sending message to', _peerid)

    return {
        id: '80701f7f-b027-43b4-83d8-3f3170b90229',
        error: null,
        msg: 'sent!'
    }
}
export const shuffleCoin = async () => {
    console.log('Shuffling...')

    return 'shuffled!'
}
export const PrivacyStatus = _PrivacyStatus


/**
 * Privacy Class
 *
 * Manages privacy functions.
 */
export class Privacy extends EventEmitter {
    constructor(_params) {
        /* Initialize Privacy class. */
        console.info('Initializing Privacy...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        /* Initialize internals. */
        this._status = PrivacyStatus.UNKNOWN

    }

    test() {
        return 'Privacy (Instance) is working!'
    }
    static test() {
        return 'Privacy (Static) is working!'
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Privacy class. */
Nexa.Privacy = Privacy

/* Initialize Privacy modules. */
Nexa.sendToPeer = sendToPeer
Nexa.shuffleCoin = shuffleCoin
Nexa.PrivacyStatus = PrivacyStatus

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
