const debug = require('debug')('nitojs:privacy:shufflemanager')
const EventEmitter = require('events').EventEmitter

/* Initialize shuffle client. */
const shuffleClient = require('../../packages/shuffle/ShuffleClient.js')

/**
 * Shuffle Manager
 *
 * Starts the shuffle manager with an attached shuffle client,
 * providing the following:
 *    1. Coin: Nito Wallet Format (NWF).
 *    2. Change (address) generator function.
 *    3. Target (address) generator function.
 */
// const shuffleManager = (_coin, _changeFunc, _targetFunc, _disableAutoShuffle=false) => {
class ShuffleManager extends EventEmitter {
    constructor(_coin, _changeFunc, _targetFunc, _disableAutoShuffle = false) {
        super()

        this.shuffleManager = new shuffleClient({
            coins: [ _coin ],

            hooks: {
                change: _changeFunc, // NOTE: This is a function.
                shuffled: _targetFunc, // NOTE: This is a function.
            },

            protocolVersion: 300,

            maxShuffleRounds: 1,

            // Disable automatically joining shuffle rounds
            // once a connection with the server is established
            disableAutoShuffle: _disableAutoShuffle,

            serverStatsUri: 'https://shuffle.servo.cash:8080/stats'
            // serverStatsUri: 'https://cashshuffle.c3-soft.com:9999/stats'
        })

        /* Handle phase change messages. */
        this.shuffleManager.on('phase', (_phase) => {
            debug('Shuffle manager (phase):', _phase)
            this.emit('phase', _phase)
        })

        /* Handle notices. */
        this.shuffleManager.on('notice', (_notice) => {
            debug('Shuffle manager (notice):', _notice)
            /* Emit notice. */
            this.emit('notice', _notice)
        })

        /* Return shuffle manager. */
        return this.shuffleManager
    }

}

/* Export module. */
module.exports = ShuffleManager
