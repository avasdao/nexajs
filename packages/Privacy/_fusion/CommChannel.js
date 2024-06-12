/* Import core modules. */
// const _ = require('lodash')
const debug = require('debug')('fusion:comm')
const EventEmitter = require('events').EventEmitter
const moment = require('moment')
const WebSocket = require('ws')

/* Import local modules. */
const serverMessages = require('./serverMessages.js')

/**
 * Communications Channel (Class)
 */
class CommChannel extends EventEmitter {
    constructor (connectionOptions, shuffleRoundInstance) {
        super()

        /* Set instance properties. */
        for (let oneOption in connectionOptions) {
            this[oneOption] = connectionOptions[oneOption]
        }

        /* Set server URI. */
        this.serverUri = connectionOptions.serverUri

        /* Validate server URI. */
        if (!this.serverUri) {
            /* Set connection error. */
            const connectionError = new Error('BAD_SERVER_URI')

            /* Emit connection error. */
            this.emit('connectionError', connectionError)
        }

        /* Initialize Websocket client. */
        this._wsClient = undefined

        /* Initialize server messages. */
        this.msg = serverMessages

        /* Initialize shuffle round. */
        this.round = shuffleRoundInstance

        /* Initialize outbox. */
        // NOTE: Our internal records for sent and received server messages.
        //       Used for debugging bad rounds.
        this.outbox = {
            sent: {}
        }

        /* Initialize inbox. */
        this.inbox = {}

        return this
    }

    /**
     * Connect
     *
     * Establish websockets connection with shuffle server.
     */
    async connect () {
        debug('Server Connection', this.serverUri)

        // TODO: This and all communication functionality will be moved to
        //       a separate class. The `Round` should only touch messages
        //       after they have been parsed, validated, and classified.
        this._wsClient = new WebSocket(this.serverUri, {
            origin: 'http://localhost'
        })

        /* Handle incoming message from CashShuffle server. */
        this._wsClient.on('message', (_buffer) => {
            debug('Websocket (buffer)', _buffer)
        })

        /* Handle a NEW Websockets connection with the CashShuffle server. */
        this._wsClient.on('open', () => {
            this._wsConnected = true
            debug('We are now connected to the CashFusion server', this.serverUri)

            this.emit('connected', this._wsClient)
        })

        /* Handle closing the Websockets connection. */
        this._wsClient.on('close', (details) => {
            if (!this.round.roundComplete) {
                // FIXME: Should we attempt to automatically reconnect
                //        and restart the process??
                debug('Socket connection closed:', details)
                this.emit('disconnected', details)
            }
        })

        /* Handle Websockets errors. */
        this._wsClient.on('error', (someError) => {
            debug('THERE WAS A SOCKET ERROR!', someError)
            this.emit('connectionError', someError)
        })
    }

    /**
     * Send Message
     */
    sendMessage () {
        debug('Now sending message:', arguments)

        /* Set message type. */
        // const messageType = arguments[0]

        /* Set message parameters. */
        // const messageParams = [].slice.call(arguments, 1) // FIXME: Why this trailing space??
        // debug('Now sending message:', arguments,
        //     'type:', messageType,
        //     'params:', messageParams)

        /* Initialize packet message. */
        let packedMessage = null

        /* Validate message type. */
        // if (messageType && typeof this.msg[messageType] === 'function') {
        //     try {
        //         packedMessage = this.msg[messageType].apply(this, messageParams)
        //     } catch (nope) {
        //         debug('Couldnt create', messageType, 'message using params',
        //             messageParams, '\n', nope)
        //         // TODO: Throw exception?
        //     }
        // } else {
        //     // TODO: Should we throw an exception now?
        // }

        /* Add the message to our outbox, in case we need it later. */
        // const outboxEntry = {
        //     messageType: messageType,
        //     time: new Date().getTime(),
        //     protobuffMessage: {
        //         // packed: packedMessage.packed.toString('base64'),
        //         unpacked: packedMessage.unpacked.toJSON(),
        //         components: packedMessage.components
        //     }
        // }

        /* Validate outbox. */
        // if (!this.outbox[messageType]) {
        //     /* Initialize object. */
        //     const obj = {}
        //
        //     /* Initialize object's message type. */
        //     obj[messageType] = []
        //
        //     /* Update outbox. */
        //     _.extend(this.outbox, obj)
        // }

        /* Set outbox sent message flag. */
        // this.outbox.sent[messageType] = true

        /* Add entry to outbox. */
        // this.outbox[messageType].push(outboxEntry)

        /* Send packed message. */
        this._wsClient.send(packedMessage.packed)
    }

    /**
     * Write Debug File
     */
    writeDebugFile () {
        /* Loop through inbox. */
        // for (let oneKey in this.inbox) {
        //     if (_.isArray(this.inbox[oneKey])) {
        //         this.inbox[oneKey] = _.sortBy(this.inbox[oneKey], ['time'], ['desc'])
        //     }
        // }

        /* Loop through outbox. */
        // for (let oneKey in this.outbox) {
        //     if (_.isArray(this.outbox[oneKey])) {
        //         this.outbox[oneKey] = _.sortBy(this.outbox[oneKey], ['time'], ['desc'])
        //     }
        // }

        /* Build data package (for disk). */
        const writeThisToDisk = {
            phase: this.round.phase,
            coin: this.round.coin,
            ephemeralKeypair: this.round.ephemeralKeypair,
            encryptionKeypair: this.round.encryptionKeypair,
            shuffled: this.round.shuffled,
            change: this.round.change,
            players: this.round.players,
            equivHashPlaintext: this.round.equivHashPlaintext,
            equivHash: this.round.equivHash,
            shuffleTx: {
                signatures: this.round.shuffleTx.signatures,
                hex: this.round.shuffleTx.hex,
                serialized: this.round.shuffleTx.tx ? this.round.shuffleTx.tx.toObject() : {},
                results: this.round.shuffleTx.results
            },
            inbox: this.inbox,
            outbox: this.outbox
        }

        /* Set data. */
        const data = JSON.stringify(writeThisToDisk, null, 2)

        /* Write data to disk. */
        require('fs').writeFileSync(`_failedFusion-${moment().unix()}.js`, 'module.exports = ' + data)

        /* Quit application. */
        process.exit(0)
    }
}

/* Export module. */
module.exports = CommChannel
