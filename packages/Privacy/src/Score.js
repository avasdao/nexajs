const debug = require('debug')('nitojs:privacy:score')
const EventEmitter = require('events').EventEmitter

/**
 * Score
 *
 * Performs heuristics to determine the privacy level of UTXOs.
 */
class Score extends EventEmitter {
    constructor() {
        super()

        debug('Privacy Score initialized.')
    }

}

/* Export module. */
module.exports = Score
