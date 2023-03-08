/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:markets')


export const getPrice = () => {
    return 0.00001337
}

/**
 * Markets Class
 *
 * Manage all market data, including:
 *   - price feeds
 *   - price alerts
 */
export class Markets extends EventEmitter {
    constructor(_params) {
        /* Initialize Markets class. */
        debug('Initializing Markets...')
        debug(JSON.stringify(_params, null, 2))
        super()

        // TBD
    }
}
