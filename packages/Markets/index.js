/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:markets')

/* Import modules. */
import { EventEmitter } from 'events'
import { v4 as uuidv4 } from 'uuid'

/* Import (local) modules. */
import _getPrice from './src/getPrice.js'
import _getQuote from './src/getQuote.js'
import _getTicker from './src/getTicker.js'

/* Export (local) modules. */
export const getPrice = _getPrice
export const getQuote = _getQuote
export const getTicker = _getTicker


/**
 * Markets Class
 *
 * Manage all market data, including:
 *   - price feeds
 *   - price alerts
 */
export class Markets extends EventEmitter {
    constructor(_primary, _secondary) {
        /* Initialize Markets class. */
        debug('Initializing Markets...')
        debug(JSON.stringify(_primary, null, 2))
        debug(JSON.stringify(_secondary, null, 2))
        super()

        // TBD
    }
}


/* Initialize (globalThis) Nexa class. */
const Nexa = {}

/* Initialize Markets class. */
Nexa.Markets = Markets

/* Initialize Markets modules. */
Nexa.getPrice = getPrice // FIXME: Make this an alias for `getQuote`.
Nexa.getQuote = getQuote
Nexa.getTicker = getTicker

/* Export Nexa to globalThis. */
// NOTE: We merge to avoid conflict with other libraries.
globalThis.Nexa = {
    ...globalThis.Nexa, // preserve Nexa object
    ...Nexa, // extend Nexa object
}
