/* Import core modules. */
const _ = require('lodash')
const debug = require('debug')('shuffle:comm')
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
        console.info('\nServer Connection', this.serverUri) // eslint-disable-line no-console

        // TODO: This and all communication functionality will be moved to
        //       a separate class. The `Round` should only touch messages
        //       after they have been parsed, validated, and classified.
        if (typeof window !== 'undefined') {
            /* eslint-disable-next-line no-undef */
            this._wsClient = new window.WebSocket(this.serverUri)
        } else {
            this._wsClient = new WebSocket(this.serverUri, {
                origin: 'http://localhost'
            })
        }

        /* Handle incoming message from CashShuffle server. */
        // this._wsClient.on('message', (someMessageBuffer) => {
        this._wsClient.addEventListener('message', async (someMessageBuffer) => {
            /* Set message. */
            const message = await this.msg.decodeAndClassify(someMessageBuffer)
            // debug('Handling websocket (message):', message)

            /* Initialize message sub-class. */
            let messageSubClass

            /* Validate message. */
            if (message.pruned.messageType === '_unicast') {
                /* Validate round phase. */
                if (this.round.phase.toLowerCase() === 'announcement') {
                    messageSubClass = 'incomingEncryptedOutputs'
                } else {
                    messageSubClass = 'UNKNOWN'
                }
            }

            /* Change the message type for unicast messages. */
            Object.assign(message.pruned, {
                messageType: messageSubClass || message.pruned.messageType
            })

            /* Add the message to our inbox, in case we need it later. */
            const inboxEntry = {
                messageType: message.pruned.messageType,
                time: new Date().getTime(),
                protobuffMessage: {
                    unpacked: message.full,
                    components: message.components
                }
            }

            this.inbox[message.pruned.messageType] =
                this.inbox[message.pruned.messageType] ? _.sortBy(
                    this.inbox[message.pruned.messageType]
                        .concat(
                            [inboxEntry]), ['time'], ['desc']) : [inboxEntry]

            /* Initialize packet verification results. */
            const packetVerifyResults = {
                success: [],
                fail: []
            }

            if (message.packets[0].packet.fromKey) {
                /* Retrieve sender. */
                const sender = _.find(this.round.players, {
                    verificationKey: message.packets[0].packet.fromKey.key
                })
                debug('Websocket message (this.round.players / sender):',
                    this.round.players, sender)
                // debug('Checking signature for',
                //     message.pruned.messageType.toUpperCase(),
                //     'message from',
                //     (sender ? sender.session + ' ( ' + sender.verificationKey + ' ) ' : 'player with sessionid ' + message.pruned.message.session)
                // )
            }

            /* Loop through ALL message packets. */
            for (let onePacket of message.packets) {
                /* Validate signature. */
                if (onePacket.signature) {
                    if (!this.msg.checkPacketSignature(onePacket)) {
                        packetVerifyResults.fail.push(onePacket)
                    } else {
                        packetVerifyResults.success.push(onePacket)
                    }
                } else {
                    // The signature doesn't need to be verified.
                    packetVerifyResults.success.push(onePacket)
                }
            }

            /* Validate packet results. */
            if (!packetVerifyResults.fail.length) {
                this.emit('serverMessage', message)
            } else {
                console.error('Signature check failed!') // eslint-disable-line no-console

                // This event will be piped right into the
                // `assignBlame` method on the `ShuffleClient`
                // class
                this.emit('protocolViolation', {
                    reason: 'INVALIDSIGNATURE',
                    // accused: _.get(oneSignedPacket, 'packet.fromKey.key'),
                    accused: _.get(packetVerifyResults, 'packet.fromKey.key'),
                    invalid: packetVerifyResults.fail
                })
            }
        })

        /* Handle a NEW Websockets connection with the CashShuffle server. */
        // this._wsClient.on('open', () => {
        this._wsClient.addEventListener('open', () => {
        // this._wsClient.onopen = () => {
            this._wsConnected = true
            // debug('We are now connected to the cashshuffle server:', this.serverUri)

            this.emit('connected', this._wsClient)
        })

        /* Handle closing the Websockets connection. */
        // this._wsClient.on('close', (details) => {
        this._wsClient.addEventListener('close', (details) => {
            if (!this.round.roundComplete) {
                // FIXME: Should we attempt to automatically reconnect
                //        and restart the process??
                debug('Socket connection closed:', details)
                this.emit('disconnected', details)
            }
        })

        /* Handle Websockets errors. */
        // this._wsClient.on('error', (someError) => {
        this._wsClient.addEventListener('error', (someError) => {
            console.error('Socket error!', someError) // eslint-disable-line no-console
            this.emit('connectionError', someError)
        })
    }

    /**
     * Send Message
     */
    sendMessage () {
        /* Set message type. */
        const messageType = arguments[0]

        /* Set message parameters. */
        // const messageParams = [].slice.call(arguments, 1, ) // FIXME: Why this trailing space??
        const messageParams = [].slice.call(arguments, 1) // FIXME: Why this trailing space??
        // debug('Now sending message:', arguments,
        //     'type:', messageType,
        //     'params:', messageParams)

        /* Initialize packet message. */
        let packedMessage = null

        /* Validate message type. */
        if (messageType && typeof this.msg[messageType] === 'function') {
            try {
                packedMessage = this.msg[messageType].apply(this, messageParams)
            } catch (nope) {
                console.error( // eslint-disable-line no-console
                    'Couldnt create', messageType,
                    'message using params', messageParams,
                    '\n', nope)
                // TODO: Throw exception?
            }
        } else {
            // TODO: Should we throw an exception now?
        }

        /* Add the message to our outbox, in case we need it later. */
        const outboxEntry = {
            messageType: messageType,
            time: new Date().getTime(),
            protobuffMessage: {
                // packed: packedMessage.packed.toString('base64'),
                unpacked: packedMessage.unpacked.toJSON(),
                components: packedMessage.components
            }
        }

        /* Validate outbox. */
        if (!this.outbox[messageType]) {
            /* Initialize object. */
            const obj = {}

            /* Initialize object's message type. */
            obj[messageType] = []

            /* Update outbox. */
            Object.assign(this.outbox, obj)
        }

        /* Set outbox sent message flag. */
        this.outbox.sent[messageType] = true

        /* Add entry to outbox. */
        this.outbox[messageType].push(outboxEntry)

        /* Send packed message. */
        this._wsClient.send(packedMessage.packed)
    }

    /**
     * Write Debug File
     */
    writeDebugFile () {
        /* Loop through inbox. */
        for (let oneKey in this.inbox) {
            if (_.isArray(this.inbox[oneKey])) {
                this.inbox[oneKey] = _.sortBy(this.inbox[oneKey], ['time'], ['desc'])
            }
        }

        /* Loop through outbox. */
        for (let oneKey in this.outbox) {
            if (_.isArray(this.outbox[oneKey])) {
                this.outbox[oneKey] = _.sortBy(this.outbox[oneKey], ['time'], ['desc'])
            }
        }

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

        if (typeof window !== 'undefined') {
            console.error(data) // eslint-disable-line no-console
        } else {
            /* Write data to disk. */
            require('fs').writeFileSync(
                `_failedShuffle-${moment().unix()}.js`,
                'module.exports = ' + data
            )
        }

        /* Quit application. */
        process.exit(0)
    }
}

/* Export module. */
module.exports = CommChannel
