/* Import modules. */
import { EventEmitter } from 'events'
import ShuffleClient from './ShuffleClient.js'

export const ShuffleType = Object.freeze({
	DEFAULT : Symbol('default'),
	DUST    : Symbol('dust'),
})

export const Phase = Object.freeze({
	NONE                        : Symbol('none'),
	ANNOUNCEMENT                : Symbol('announcement'),
	SHUFFLE                     : Symbol('shuffle'),
	BROADCAST                   : Symbol('broadcast'),
	EQUIVOCATION_CHECK          : Symbol('equivocation_check'),
	SIGNING                     : Symbol('signing'),
	VERIFICATION_AND_SUBMISSION : Symbol('verification_and_submission'),
	BLAME                       : Symbol('blame'),
})

export const Reason = Object.freeze({
	INSUFFICIENTFUNDS             : Symbol('insufficientfunds'),
	DOUBLESPEND                   : Symbol('doublespend'),
	EQUIVOCATIONFAILURE           : Symbol('equivocationfailure'),
	SHUFFLEFAILURE                : Symbol('shufflefailure'),
	SHUFFLEANDEQUIVOCATIONFAILURE : Symbol('shuffleandequivocationfailure'),
	INVALIDSIGNATURE              : Symbol('invalidsignature'),
	MISSINGOUTPUT                 : Symbol('missingoutput'),
	LIAR                          : Symbol('liar'),
	INVALIDFORMAT                 : Symbol('invalidformat'),
})


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
export class ShuffleManager extends EventEmitter {
    constructor(
        _coin,
        _changeFunc,
        _targetFunc,
        _disableAutoShuffle = false
    ) {
        super()

        this.shuffleManager = new ShuffleClient({
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
            console.log('Shuffle manager (phase):', _phase)
            this.emit('phase', _phase)
        })

        /* Handle notices. */
        this.shuffleManager.on('notice', (_notice) => {
            console.log('Shuffle manager (notice):', _notice)
            /* Emit notice. */
            this.emit('notice', _notice)
        })

        /* Return shuffle manager. */
        return this.shuffleManager
    }
}
