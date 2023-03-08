/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:blockchain')


export const welcome = () => {
    return 'Welcome!'
}

/**
 * Blockchain Class
 *
 * TBD
 */
export class Blockchain extends EventEmitter {
    constructor(_params) {
        /* Initialize Blockchain class. */
        debug('Initializing Blockchain...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}
