/* Import modules. */
import { EventEmitter } from 'events'

/**
 * Fusion Class
 *
 * Manages privacy functions.
 */
export class Fusion extends EventEmitter {
    constructor(_params) {
        /* Initialize Fusion class. */
        console.info('Initializing Fusion...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        /* Initialize internals. */
        this._status = FusionStatus.UNKNOWN

    }

    test() {
        return 'Fusion (Instance) is working!'
    }
    static test() {
        return 'Fusion (Static) is working!'
    }
}
