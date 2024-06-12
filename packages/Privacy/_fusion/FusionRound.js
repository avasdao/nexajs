/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')
const debug = require('debug')('cashshuffle:round')
const EventEmitter = require('events').EventEmitter

/* Import local modules. */
const cryptoUtils = require('./cryptoUtils.js')
const coinUtils = require('./coinUtils.js')

/* Import CommChannel (Class). */
const CommChannel = require('./CommChannel.js')

/* Initialize magic number. */
// const magic = Buffer.from('42bcc32669467873', 'hex')

/**
 * Delay (Execution)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Shuffle Round (Class)
 */
class FusionRound extends EventEmitter {
    constructor (clientOptions) {
        super()

        /* Initialize client options. */
        for (let oneOption in clientOptions) {
            this[oneOption] = clientOptions[oneOption]
        }

        /* Initialize done flag. */
        this.done = false

        /* Initialize phase. */
        this.phase = ''

        /* Initialize util. */
        // TODO: Rename to `utils`.
        this.util = {
            /* Tools for encryption and message sign / verify. */
            crypto: cryptoUtils,

            /* Tools that make REST calls for blockchain data. */
            coin: coinUtils
        }

        /* Initialize ephemeral keypair. */
        // NOTE: A public and private keypair, destroyed at the end of a shuffle
        //       round. Its only purpose is to sign and verify protocol
        //       messages to ensure the participants aren't being
        //       cheated / attacked by the server or each other.
        this.ephemeralKeypair = this.util.crypto.generateKeypair()

        /* Initialize encryption keypair. */
        // NOTE: A public and private keypair, destroyed at the end of a shuffle
        //       round. It's used to encrypt and decrypt message fields during
        //       the shuffle round so they are kept private from the server and
        //       the other players in the round.
        this.encryptionKeypair = this.util.crypto.generateKeypair()

        /* Initialize hooks. */
        this.hooks = this.hooks || {}

        /* Validate shuffled hook. */
        if (!_.isFunction(this.hooks.shuffled)) {
            debug(`A valid shuffle address generation hook was not provided!`)
            throw new Error('BAD_SHUFFLE_FN')
        }

        /* Initialize shuffled. */
        this.shuffled = this.hooks.shuffled()

        /* Validate change hook. */
        // NOTE: Make sure either a change generation function or change
        //       keypair object was provided. Use the keypair, if we got both.
        if (!_.isFunction(this.hooks.change)) {
            debug(`A valid change generation hook was not provided!`)
            throw new Error('BAD_CHANGE_FN')
        }

        /* Initialize change. */
        this.change = this.hooks.change()

        /* Initialize (shuffle) players. */
        // NOTE: This is where we keep our representation of all the shufflers
        //       in the round (including us).
        this.players = []

        /* Initialize output addresses. */
        // NOTE: Once we reach the "shuffle" phase, this array will house the
        //       addresses that each player's shuffled coins will be sent to.
        this.outputAddresses = []

        /* Initialize shuffle transaction. */
        // NOTE: Used to store the partially signed transaction after it
        //       is generated but before its broadcasted to the network.
        this.shuffleTx = {
            isBuilding: false,

            // NOTE: We will add each signature and input data to this
            //       collection as it's received during the verification
            //       and submission phase.
            signatures: []
        }

        /* Initialize round completion flag. */
        this.roundComplete = false

        /* Initialize success flag. */
        this.success = false

        /* Initialize round error. */
        // NOTE: This object will be extended with error data in the event
        //       that the round ends unexpectedly for any reason. This
        //       includes a protocol error on behalf of any player in the
        //       round (ourselves included) as well as if an exception is
        //       thrown in this library.
        this.roundError = {
            // shortCode: 'BAD_SIG',
            // errorObject: [ Error instance containing a stacktrace ],
            // isProtocolError: true,
            // isException: false,
            // accusedPlayer: [ Object containing player data ]
        }

        /* Initialize communications channel. */
        this.comms = new CommChannel({
            serverUri: this.serverUri
        }, this)

        /* Handle server message. */
        this.comms.on('serverMessage', async (someServerMessage) => {
            try {
                await this.actOnMessage(someServerMessage)
            } catch (nope) {
                debug('Failed to act right in response to server message:', nope)
                this.writeDebugFile()
            }
        })

        /* Handle protocol violation. */
        this.comms.on('protocolViolation', this.assignBlame.bind(this))

        /* Handle connection error. */
        this.comms.on('connectionError', this.handleCommsError.bind(this))

        /* Handle disconnection. */
        this.comms.on('disconnected', (commsDisconnectMessage) => {
            debug('Our connection to the CashShuffle server is REKT!')

            /* Validate round completion. */
            if (this.roundComplete) {
                debug('The shuffle Round has completed')
            } else {
                /* Set success flag. */
                this.success = false

                /* Set round copmletion flag. */
                this.roundComplete = true

                /* Update round error. */
                _.extend(this.roundError, {
                    shortCode: 'COMMS_DISCONNECT',
                    errorObject: new Error(commsDisconnectMessage),
                    isProtocolError: false,
                    isException: false
                })

                /* End shuffle round. */
                this.endShuffleRound()
            }
        })

        /* Handle connection. */
        // this.comms.on('connected', (socket) => {
        //     debug('socket', socket)
        this.comms.on('connected', () => {

            /* Set round phase. */
            this.phase = 'registration'

            try {
                // console.log(
                //     '\nSENDING REGISTRATION MESSAGE',
                //     this.protocolVersion,
                //     this.poolAmount,
                //     this.ephemeralKeypair.publicKey
                // )

                this.comms
                    .sendMessage(
                        'registration',
                        this.protocolVersion,
                        this.poolAmount,
                        this.ephemeralKeypair.publicKey
                    )
            } catch (nope) {
                debug('Couldnt send registration message:', nope.message)
            }
        })

        this.ready()
            .catch((nope) => {
                debug('ERROR:', nope)
            })
            .then(() => {
                //
            })

        return this
    }

    /**
     * Handle Communications Error
     */
    handleCommsError (someError) {
        debug('Something has gone wrong with our communication channel:', someError.message)

        /* Update round error. */
        this.roundError = {
            shortCode: 'COMS_ERR',
            errorObject: someError,
            isProtocolError: false,
            isException: true
        }

        /* End shuffle round. */
        this.endShuffleRound()
    }

    /**
     * Ready
     */
    async ready () {
        this.emit('debug', { message: 'beginning-round' })

        /* Setup server connection. */
        try {
            await this.comms.connect()
        } catch (nope) {
            debug('Failure!', nope)
            throw nope
        }
    }

    /**
     * Act On Message
     *
     * Process incoming websocket events which contain the prototype buffer
     * encoded server messages.
     */
    async actOnMessage (jsonMessage) {
        // console.log('\nACTING ON MESSAGE', jsonMessage) // eslint-disable-line no-console
        debug('Acting on message:', jsonMessage.pruned.message)

        /* Set message type. */
        const messageType =
            jsonMessage.pruned.message && jsonMessage.pruned.messageType

        /* Validate message type. */
        if (!messageType) {
            throw new Error('BAD_MESSAGE_PARSING')
        }

        /* Set message. */
        const message = jsonMessage.pruned.message

        /* Initialize new phase name. */
        let newPhaseName

        // debug('Attempting to act on', messageType, 'message\n\n');

        /* Handle message type. */
        switch (messageType) {
        /**
         * The server has informed us of the number of players currently in the
         * pool. This fires every time a player joins or leaves.
         *
         * NOTE: We always get one along without server greeting.
         */
        case 'playerCount':
            /* Set number of players. */
            this.numberOfPlayers = Number(message['number'])
            break

        /**
         * The server has accepted our pool registration message and replied
         * with our player number and a session id to identify us within this
         * pool and round.
         */
        case 'serverGreeting':
            /* Set our player number. */
            this.myPlayerNumber = Number(message['number'])

            /* Set our session id. */
            this.session = message['session']
            break

        /**
         * This is a message sent to all players to inform them that it's now
         * time to share their change address as well as their second ephemeral
         * public key (later used to decrypt the encrypted output addresses).
         */
        case 'announcementPhase':
            /* Set new phase name. */
            newPhaseName = _.isString(
                message['phase']) ? message['phase'].toLowerCase() : undefined

            /* Validate new phase name. */
            if (newPhaseName && newPhaseName === 'announcement') {
                /* Set phase. */
                this.phase = 'announcement'

                /* Set number of players. */
                this.numberOfPlayers = Number(message['number'])

                try {
                    this.broadcastTransactionInput()
                } catch (nope) {
                    debug('Error broadcasting broadcastTransactionInput:', nope)
                }
            } else {
                debug('Problem with server phase message')

                if (_.get(jsonMessage, 'packets[0].packet.fromKey.key')) {
                    this.assignBlame({
                        reason: 'INVALIDFORMAT',
                        accused: _.get(jsonMessage, 'packets[0].packet.fromKey.key')
                    })
                }
            }
            break
        case 'incomingVerificationKeys':
            try {
                await this.addPlayerToRound(message)
            } catch (nope) {
                debug('Error broadcasting broadcastTransactionInput:', nope)
            }

            // If we've received the message from all players (including us)
            // containing their `verificationKey` and the coin they wish to
            // shuffle, send the next protocol message if we are player one.
            if (this.myPlayerNumber === _.get(_.minBy(this.players, 'playerNumber'), 'playerNumber')) {
                try {
                    await this.announceChangeAddress()
                } catch (nope) {
                    debug('Error broadcasting changeAddress:', nope)
                    this.endShuffleRound()
                }
            }
            break
        case 'incomingChangeAddress':
            /* Validate change address announcement. */
            // NOTE: If we are player one, we will have already sent
            //       this message.
            if (!this.comms.outbox.sent['changeAddressAnnounce']) {
                await this.announceChangeAddress()
            }

            debug('Incoming change address',
                'Encryption pubkey', message['message']['key']['key'],
                'Legacy address', message['message']['address']['address'])

            /* Update this player with their change address. */
            _.extend(this.players[_.findIndex(this.players, { session: message['session'] })], {
                encryptionPubKey: message['message']['key']['key'],
                change: {
                    legacyAddress: message['message']['address']['address']
                }
            })

            /**
             * If we are player 1, go ahead and send the first encrypted
             * unicast message containing the Bitcoin address that will
             * house our shuffled output. This function will return without
             * doing anything unless all players.
             */
            if (_.get(_.minBy(this.players, 'playerNumber'), 'playerNumber') === this.myPlayerNumber) {
                this.phase = 'shuffle'

                try {
                    await this.forwardEncryptedShuffleTxOutputs(undefined, undefined)
                } catch (nope) {
                    debug('Error broadcasting changeAddress:', nope)
                    this.endShuffleRound()
                }
            }
            break
        case 'incomingEncryptedOutputs': {
            newPhaseName = _.isString(message['phase']) ? message['phase'].toLowerCase() : undefined

            // Grab the sender of this message by using the verificationKey used
            // to sign this protobuff message.  The signature has already been
            // verified successfully but we're not sure yet if the sender is lying
            // about their player number.  This check will be performed in the the
            // `forwardEncryptedShuffleTxOutputs` function.
            const sentBy = _.find(this.players, {
                verificationKey: _.get(jsonMessage, 'packets[0].packet.fromKey.key')
            })

            if (this.phase === 'announcement' && newPhaseName === 'shuffle') {
                this.phase = 'shuffle'
                this.forwardEncryptedShuffleTxOutputs(jsonMessage.packets, sentBy)
            }
            break
        }
        case 'finalTransactionOutputs':
            debug('got final transaction outputs!')
            newPhaseName = _.isString(
                message['phase']) ? message['phase'].toLowerCase() : undefined

            /* Set new phase name. */
            this.phase = newPhaseName

            this.checkFinalOutputsAndDoEquivCheck(jsonMessage.packets)
            break
        case 'incomingEquivCheck':
            try {
                await this.processEquivCheckMessage(message)
            } catch (nope) {
                debug('Error processing incoming equivCheck:', nope)
            }
            break
        case 'blame':
            this.handleBlameMessage(message)
            break
        case 'incomingInputAndSig':
            try {
                await this.verifyAndSubmit(message)
            } catch (nope) {
                debug('Error processing incoming output and signature:', nope)
            }
            break
        // case '':
        // break;
        default:
            break
        }

        // debug('Finished acting on', messageType, 'message\n\n');
    }

    /**
     * Process Websockets Error
     */
    processWsError (someError) {
        debug('Oh goodness, something is amiss!', someError)
    }

    /**
     * Write Debug File
     */
    writeDebugFile () {
        this.comms.writeDebugFile(true)
    }

    /***************************************************************************

                    BEGIN COINFUSION PROTOCOL METHODS
                    ----------------------------------

     **************************************************************************/

    // TODO:
}

module.exports = ShuffleFusion
