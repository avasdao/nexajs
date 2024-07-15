/* Import modules. */
import { EventEmitter } from 'events'

/**
 * Shuffle Class
 *
 * Manages privacy functions.
 */
export class Shuffle extends EventEmitter {
    constructor(_params) {
        /* Initialize Shuffle class. */
        console.info('Initializing Shuffle...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        /* Initialize internals. */
        this._status = ShuffleStatus.UNKNOWN

    }

    test() {
        return 'Shuffle (Instance) is working!'
    }
    static test() {
        return 'Shuffle (Static) is working!'
    }
}
