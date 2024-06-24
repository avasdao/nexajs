const EventEmitter = require('events').EventEmitter

/**
 * Score
 *
 * Performs heuristics to determine the privacy level of UTXOs.
 */
class Score extends EventEmitter {
    constructor() {
        super()

        console.log('Privacy Score initialized.')
    }

}

/* Export module. */
module.exports = Score
