/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:charts')


export const welcome = () => {
    return 'Welcome!'
}

/**
 * Charts Class
 *
 * TBD
 */
export class Charts extends EventEmitter {
    constructor(_params) {
        /* Initialize Charts class. */
        debug('Initializing Charts...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}
