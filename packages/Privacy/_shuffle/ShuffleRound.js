/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')
const debug = require('debug')('shuffle:round')
const EventEmitter = require('events').EventEmitter
const Nito = require('nitojs')

/* Import local modules. */
const cryptoUtils = require('./cryptoUtils.js')
const coinUtils = require('./coinUtils.js')

/* Import CommChannel (Class). */
const CommChannel = require('./CommChannel.js')

/**
 * Shuffle
 *
 * The de-facto unbiased shuffle algorithm is the Fisher-Yates
 * (aka Knuth) Shuffle. (see: https://github.com/coolaj86/knuth-shuffle)
 */
const _shuffle = function (array) {
    var currentIndex = array.length, temporaryValue, randomIndex

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {
        // Pick a remaining element...
        randomIndex = Math.floor(Math.random() * currentIndex)
        currentIndex -= 1

        // And swap it with the current element.
        temporaryValue = array[currentIndex]
        array[currentIndex] = array[randomIndex]
        array[randomIndex] = temporaryValue
    }

    return array
}

/* Initialize magic number. */
// const magic = Buffer.from('42bcc32669467873', 'hex')

/**
 * Delay (Execution)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/**
 * Shuffle Round (Class)
 */
class ShuffleRound extends EventEmitter {
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
            console.error(`A valid shuffle address generation hook was not provided!`) // eslint-disable-line no-console
            throw new Error('BAD_SHUFFLE_FN')
        }

        /* Initialize shuffled. */
        this.shuffled = this.hooks.shuffled()

        /* Validate change hook. */
        // NOTE: Make sure either a change generation function or change
        //       keypair object was provided. Use the keypair, if we got both.
        if (!_.isFunction(this.hooks.change)) {
            console.error(`A valid change generation hook was not provided!`) // eslint-disable-line no-console
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
                console.error('Failed to act right in response to server message:', nope) // eslint-disable-line no-console
                this.writeDebugFile()
            }
        })

        /* Handle protocol violation. */
        this.comms.on('protocolViolation', this.assignBlame.bind(this))

        /* Handle connection error. */
        this.comms.on('connectionError', this.handleCommsError.bind(this))

        /* Handle disconnection. */
        this.comms.on('disconnected', (commsDisconnectMessage) => {
            /* Validate round completion. */
            if (this.roundComplete) {
                debug('The shuffle Round has completed!')
            } else {
                /* eslint-disable-next-line no-console */
                console.error('Our connection to the CashShuffle server is REKT!')

                /* Set success flag. */
                this.success = false

                /* Set round copmletion flag. */
                this.roundComplete = true

                /* Update round error. */
                Object.assign(this.roundError, {
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
            this.emit('phase', 'registration')

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
                console.error('Couldnt send registration message:', nope.message) // eslint-disable-line no-console
            }
        })

        this.ready()
            .catch((nope) => {
                console.error('ERROR:', nope) // eslint-disable-line no-console
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
        /* eslint-disable-next-line no-console */
        console.error('Something has gone wrong with our communication channel:', someError.message)

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
            console.error('Failure!', nope) // eslint-disable-line no-console
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
        if (typeof window !== 'undefined') {
            /* eslint-disable-next-line no-console */
            console.log('Act on message (jsonMessage):', jsonMessage.pruned.message)
        } else {
            debug('Act on message (jsonMessage):', jsonMessage.pruned.message)
        }
        this.emit('notice', jsonMessage.pruned.message)

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
                this.emit('phase', 'announcement')

                /* Set number of players. */
                this.numberOfPlayers = Number(message['number'])

                try {
                    this.broadcastTransactionInput()
                } catch (nope) {
                    console.error('Error broadcasting broadcastTransactionInput:', nope) // eslint-disable-line no-console
                }
            } else {
                console.error('Problem with server phase message') // eslint-disable-line no-console

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
                console.error('Error broadcasting broadcastTransactionInput:', nope) // eslint-disable-line no-console
            }

            // If we've received the message from all players (including us)
            // containing their `verificationKey` and the coin they wish to
            // shuffle, send the next protocol message if we are player one.
            if (this.myPlayerNumber === _.get(_.minBy(this.players, 'playerNumber'), 'playerNumber')) {
                try {
                    await this.announceChangeAddress()
                } catch (nope) {
                    console.error('Error broadcasting changeAddress:', nope) // eslint-disable-line no-console
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

            debug('Act on message (incomingChangeAddress):',
                'Encryption pubkey', message['message']['key']['key'],
                'Legacy address', message['message']['address']['address']
            )
            console.log('Act on message (incomingChangeAddress):',
                'Encryption pubkey', message['message']['key']['key'],
                'Legacy address', message['message']['address']['address']
            )

            /* Update this player with their change address. */
            Object.assign(
                this.players[_.findIndex(this.players, { session: message['session'] })], {
                    encryptionPubKey: message['message']['key']['key'],
                    change: {
                        legacyAddress: message['message']['address']['address']
                    }
                }
            )

            /**
             * If we are player 1, go ahead and send the first encrypted
             * unicast message containing the Bitcoin address that will
             * house our shuffled output. This function will return without
             * doing anything unless all players.
             */
            if (_.get(_.minBy(this.players, 'playerNumber'), 'playerNumber') === this.myPlayerNumber) {
                this.phase = 'shuffle'
                this.emit('phase', 'shuffle')

                try {
                    await this.forwardEncryptedShuffleTxOutputs(undefined, undefined)
                } catch (nope) {
                    console.error('Error broadcasting changeAddress:', nope) // eslint-disable-line no-console
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
                this.emit('phase', 'shuffle')
                this.forwardEncryptedShuffleTxOutputs(jsonMessage.packets, sentBy)
            }
            break
        }
        case 'finalTransactionOutputs':
            newPhaseName = _.isString(
                message['phase']) ? message['phase'].toLowerCase() : undefined

            /* Set new phase name. */
            this.phase = newPhaseName
            this.emit('phase', newPhaseName)

            this.checkFinalOutputsAndDoEquivCheck(jsonMessage.packets)
            break
        case 'incomingEquivCheck':
            try {
                await this.processEquivCheckMessage(message)
            } catch (nope) {
                console.error('Error processing incoming equivCheck:', nope) // eslint-disable-line no-console
            }
            break
        case 'blame':
            this.handleBlameMessage(message)
            break
        case 'incomingInputAndSig':
            try {
                await this.verifyAndSubmit(message)
            } catch (nope) {
                console.error('Error processing incoming output and signature:', nope) // eslint-disable-line no-console
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
        console.error('Oh goodness, something is amiss!', someError) // eslint-disable-line no-console
    }

    /**
     * Write Debug File
     */
    writeDebugFile () {
        this.comms.writeDebugFile(true)
    }

    /***************************************************************************

                    BEGIN COINSHUFFLE PROTOCOL METHODS
                    ----------------------------------

     **************************************************************************/

    /**
     * Broadcast Transaction Input
     *
     * This function reveals the coin our client wishes to shuffle as well as
     * our verificationKey. Although we revealed our verificationKey in our
     * server registration message, that message isn't relayed to our peers.
     * This is the first message where our peers see the vk.
     */
    broadcastTransactionInput () {
        if (this.comms.outbox.sent['broadcastTransactionInput']) {
            return
        }

        // debug('Revealing our verificationKey and coin to our peers!');

        /* Initialize inputs. */
        const inputsObject = {}

        /* Set inputs. */
        inputsObject[this.coin.publicKey.toString('hex')] =
            [this.coin.txid + ':' + this.coin.vout]

        try {
            this.comms
                .sendMessage(
                    'broadcastTransactionInput',
                    inputsObject,
                    this.session,
                    this.myPlayerNumber,
                    this.ephemeralKeypair.publicKey
                )
        } catch (nope) {
            console.error('Couldnt send broadcastTransactionInput message:', nope.message) // eslint-disable-line no-console
            return this.endShuffleRound()
        }
    }

    /**
     * Add Player to Round
     *
     * This function is called in response to us receiving a new message from
     * either ourselves or another player that announces which coin they will
     * be shuffling. We should receive one of these messages for each player
     * in the round (including ourselves). The messages are unicast
     * (no toKey field).
     *
     * In this function we do ALL of the following:
     *     1. Check that the coin exists on the blockchain.
     *     2. Check that the coin value is appropriate for the current round.
     *     3. Add the player to our internal state data.
     *
     * NOTE: It's also here where we record each player's verificationKey,
     *       that the `CommChannel` class uses to verify the signature on all
     *       future messages.
     */
    async addPlayerToRound (message) {
        /* Initialize player coin. */
        const playerCoin = {
            publicKey: _.keys(message['message']['inputs'])[0]
        }

        /* Initialize UTXO info. */
        const utxoInfo = _.values(message['message']['inputs'])[0]['coins'][0].split(':')

        /* Set player transaction id. */
        playerCoin.txid = utxoInfo[0]

        /* Set player coin output (index). */
        playerCoin.vout = Number(utxoInfo[1])

        /* Set player to add. */
        const playerToAdd = {
            session: message['session'],
            playerNumber: Number(message['number']),
            isMe: message['session'] === this.session,
            verificationKey: message['fromKey']['key'],
            coin: playerCoin
        }

        /* Validate player. */
        if (playerToAdd.isMe) {
            Object.assign(playerToAdd.coin, this.coin)
        }

        /* Add player. */
        this.players.push(playerToAdd)

        // debug('Added player', playerToAdd);

        /* Initialize coin details. */
        // NOTE: We've already added the player to our pool but we
        //       still need to verify the data they sent us.
        const coinDetails = await this.util.coin
            .getCoinDetails(playerCoin.txid, playerCoin.vout)
            .catch(err => {
                /* eslint-disable-next-line no-console */
                console.error('Cannot get coin details', err)

                /* Assign blame. */
                this.assignBlame({
                    reason: 'INSUFFICIENTFUNDS',
                    accused: playerToAdd.verificationKey
                })
            })

        /* Validate coin details. */
        // NOTE: Check that the coin is there and big enough
        //       before adding the player.
        if (!coinDetails.satoshis || this.shuffleFee + this.poolAmount > coinDetails.satoshis) {
            debug('Insufficient funds for player (coinDetails):', coinDetails)

            /* Assign blame. */
            this.assignBlame({
                reason: 'INSUFFICIENTFUNDS',
                accused: playerToAdd.verificationKey
            })

            return
        }

        /* Grab player. */
        const grabPlayer = _.find(this.players, { session: playerToAdd.session })

        /* Validate player. */
        // NOTE: If it's our message, add our coin object to
        //       the player and only update the fiscal properties.
        if (playerToAdd.isMe) {
            Object.assign(grabPlayer.coin, {
                amount: coinDetails.amount,
                satoshis: coinDetails.satoshis,
                // confirmations: coinDetails.confirmations,
                spent: coinDetails.spent
            })
        } else {
            Object.assign(grabPlayer.coin, coinDetails)
        }

        // debug(`Player ${grabPlayer.playerNumber} updated`);
    }

    /**
     * Announce Change Address
     *
     * Here we announce our change address, as well as the public key that
     * other players should use to encrypt messages meant for our eyes only.
     * Primarily, they will use it when encrypting the transaction output
     * addresses so we can decrypt them, add our own, and re-encrypt all of
     * them for the next player to do the same.
     *
     * NOTE: Encrypting these output addresses keeps the server from being
     *       able to keep a record of which coin belongs to which player.
     *
     * NOTE: This function fires many times but we should only announce our
     *       change address once. If we've already done this, just return.
     */
    announceChangeAddress () {
        if (this.comms.outbox.sent['changeAddressAnnounce'] ||
            this.players.length < this.numberOfPlayers
        ) {
            return
        }

        /* Send message. */
        this.comms.sendMessage(
            'changeAddressAnnounce',
            this.session,
            this.myPlayerNumber,
            this.change.legacyAddress,
            this.encryptionKeypair.publicKeyHex,
            this.phase,
            this.ephemeralKeypair.publicKey,
            this.ephemeralKeypair.privateKey
        )
    }

    /**
     * Forward Encrypted Shuffle Transaction Outputs
     *
     * Implements processing of messages during the shuffling phase.
     *
     * It performs the following:
     *     1. Accepts the encrypted output addresses sent to us in the first
     *        message of the "shuffle" phase. There should be as few as zero
     *        and at most all-but-one address(es) in legacy format. They are
     *        encrypted to our public `encryptionKey` that we shared along
     *        with our change address in the previous step.
     *
     *     2. The remaining behavior in this function varies depending on if
     *        we are are the last player. In both cases though, we will first
     *        do all of the following:
     *            (a) Make sure this message came from the previous player.
     *            (b) Strip off the top layer of encryption from all strings.
     *            (c) Encrypt and add our own output address that will soon
     *                contain our shuffled coin.
     *            (d) Shuffle the entire set of addresses well. If we are the
     *                last player, we may choose not to.
     *            (e) Check that each string is unique. If not, assign blame
     *                and end the round.
     *
     *     3. If we are the last player, as determined by the highest `number`
     *        returned by the server in response to our our registration
     *        message, then we will signal the end of the shuffle stage by
     *        broadcasting the complete set of shuffled addresses in decrypted
     *        form to every player as a regular multicast message.
     *
     *     4. If we are not the last player, we encrypt and add our own
     *        addresses. We must add one layer of encryption to our address
     *        for every subsequent player in the round. For example, if we are
     *        player 3 in a 10 player round, we must add 7 layers of
     *        encryption, starting with player #10 then working our way back
     *        to player #4. Then we send all of them to player #4 as a
     *        signed multi-packet unicast message. Unicast messages are those
     *        that include toKey field which the server relays only to them.
     *
     * NOTE: If we are player 1, this function has been called without any
     *       parameters so there will be nothing for us to decrypt and our
     *       message will be the first message of the shuffle phase. Before we
     *       send it though, we need to make sure everyone has sent us their
     *       decryption keys. If they haven't, just return without doing
     *       anything. This function will be called again with each new key
     *       received.
    */
    forwardEncryptedShuffleTxOutputs (arrayOfPacketObjects, sender) {
        /* Initialize ourselves. */
        const me = _.find(this.players, { isMe: true })

        /* Initialize ordered players. */
        const orderedPlayers = _.orderBy(
            this.players, ['playerNumber'], ['asc'])

        /* Set first player. */
        const firstPlayer = _.minBy(orderedPlayers, 'playerNumber')

        /* Set last player. */
        const lastPlayer = _.maxBy(orderedPlayers, 'playerNumber')

        /* Set next player. */
        const nextPlayer = orderedPlayers[_.findIndex(orderedPlayers, { isMe: true }) + 1]

        /* Set previous player. */
        const previousPlayer = orderedPlayers[_.findIndex(orderedPlayers, { isMe: true }) - 1]

        /* Validate encryption keys. */
        // NOTE: Check that we have received a decryption key from all players,
        //       and that they are all unique.
        //
        // NOTE: Uniqueness isn't a protocol requirement, but it probably
        //       should be.
        if (
            _.uniq(
                _.compact(
                    orderedPlayers.map(obj => obj['encryptionPubKey'])
                )
            ).length !== this.players.length) {
            debug('Waiting for the remaining encryption keys:', orderedPlayers)
            return
        }

        /* Initialize string for next player. */
        const stringsForNextPlayer = []

        /* Validate player data. */
        if (me.playerNumber !== firstPlayer.playerNumber) {
            // Make sure the player who sent us this message is who it should be
            if (sender.playerNumber !== previousPlayer.playerNumber) {
                debug(`Player ${sender.playerNumber} is not player ${previousPlayer.playerNumber} despite saying so`)

                this.assignBlame({
                    reason: 'LIAR',
                    accused: sender.verificationKey
                })

                return
            }

            /* Retrieve decrypted string. */
            const decryptedStrings = _.reduce(arrayOfPacketObjects, (results, onePacket) => {
                try {
                    /* Set decryption results. */
                    const decryptionResults = this.util.crypto
                        .decrypt(
                            _.get(onePacket, 'packet.message.str'),
                            this.encryptionKeypair.privateKeyHex
                        )
                    debug('Forward encrypted shuffle tx outputs:',
                        'onePacket', onePacket,
                        'privateKeyHex', this.encryptionKeypair.privateKeyHex,
                        decryptionResults
                    )

                    /* Add decryption to results. */
                    results.strings.push(decryptionResults.toString('utf-8'))
                } catch (nope) {
                    console.error('Cannot decrypt') // eslint-disable-line no-console

                    results.errors.push({
                        packet: onePacket,
                        error: nope
                    })
                }

                return results
            }, {
                strings: [],
                errors: []
            })
            debug('Forward encrypted shuffle tx outputs (decryptedStrings):', decryptedStrings)

            /* Validate decrypted string. */
            // NOTE: Blame our sender if the ciphertext cannot be decrypted.
            //       It may or may not be their fault, but someone has to be
            //       the fall guy.
            if (decryptedStrings.errors.length) {
                this.assignBlame({
                    reason: 'INVALIDFORMAT',
                    accused: sender.verificationKey
                })
            }

            _.each(
                decryptedStrings.strings, (oneThing) => {
                    stringsForNextPlayer.push(oneThing)
                }
            )
        }

        /* Set our encrypted output address. */
        // NOTE: Add our output address after first encrypting it with the
        //       public keys of all subsequent players in the round except.
        const ourEncryptedOutputAddress = _.reduceRight(
            orderedPlayers, (
                encryptedAddressInfo, onePlayer
            ) => {
                if (nextPlayer && onePlayer.playerNumber >= nextPlayer.playerNumber) {
                    try {
                        encryptedAddressInfo.string = this.util.crypto
                            .encrypt(
                                encryptedAddressInfo.string,
                                onePlayer.encryptionPubKey
                            )
                        debug(
                            'Forward encrypted shuffle tx outputs (encryptedAddressInfo):',
                            encryptedAddressInfo
                        )
                    } catch (nope) {
                        /* eslint-disable-next-line no-console */
                        console.error(`Cannot encrypt address for encryptionPubKey ${onePlayer.encryptionPubKey} because ${nope.message}`)

                        encryptedAddressInfo.errors.push({
                            player: onePlayer,
                            error: nope
                        })
                    }
                }

                return encryptedAddressInfo
            }, {
                errors: [],
                string: this.shuffled.legacyAddress
            })

        /* Validate our encrypted output address. */
        if (ourEncryptedOutputAddress.errors.length) {
            this.assignBlame({
                reason: 'INVALIDFORMAT',
                accused: sender.verificationKey
            })
        }

        /* Add our encrypted output address to string for next player. */
        stringsForNextPlayer.push(ourEncryptedOutputAddress.string)

        /* Do a uniqueness check on the output addresses / ciphertexts. */
        if (_.compact(_.uniq(stringsForNextPlayer)).length !== stringsForNextPlayer.length) {
            this.assignBlame({
                reason: 'MISSINGOUTPUT',
                accused: sender.verificationKey
            })
        }

        /**
         * Shuffle Array
         */
        const shuffleArray = function (someArray, num) {
            return (
                num > 0 ?
                shuffleArray(_shuffle(someArray), num - 1) :
                _shuffle(someArray)
            )
        }

        /* Validate if we are the last player. */
        if (me.playerNumber === lastPlayer.playerNumber) {
            debug(`Broadcasting final shuffled output addresses ${stringsForNextPlayer}!`)

            /* Send message. */
            this.comms.sendMessage(
                'broadcastFinalOutputAddresses',
                this.session,
                me.playerNumber,
                shuffleArray(stringsForNextPlayer, 100),
                'broadcast',
                this.ephemeralKeypair.publicKey,
                this.ephemeralKeypair.privateKey
            )
        } else {
            debug('Sending encrypted outputs:',
                stringsForNextPlayer,
                'to player',
                nextPlayer.playerNumber,
                '(', nextPlayer.verificationKey, ')'
            )

            /* Send message. */
            this.comms.sendMessage(
                'forwardEncryptedOutputs',
                this.session,
                me.playerNumber,
                shuffleArray(stringsForNextPlayer, 100),
                this.phase,
                nextPlayer.verificationKey,
                this.ephemeralKeypair.publicKey,
                this.ephemeralKeypair.privateKey
            )
        }
    }

    /**
     * Check Final Outputs and Do Equivocation Check
     *
     * This function performs processing of the "broadcast" phase message sent
     * by the final player in the round. This message announces the final
     * set of shuffled output addresses.
     *
     * This function does all of the following:
     *
     *     1. Ensure our address is in list of output addresses.
     *        If not, blame and exit.
     *     2. Broadcast our own "equivocation check" message.
     *     3. Compute hash of outputs string and broadcast it.
     *
     * TODO: Check that the message was actually sent by the last player
     *       in the round.
     */
    checkFinalOutputsAndDoEquivCheck (signedPackets) {
        const me = _.find(this.players, { isMe: true })

        const finalOutputAddresses = signedPackets.map(obj => obj['packet']['message']['str'])
        debug(
            'Check final outputs and do equiv check (finalOutputAddresses):',
            finalOutputAddresses
        )

        /* Make sure our address was included. If not, blame! */
        if (finalOutputAddresses.indexOf(this.shuffled.legacyAddress) < 0) {
            debug(`Our address isn't in the final outputs!`)

            this.assignBlame({
                reason: 'MISSINGOUTPUT',
                // accused: _.get(messageObject, _.get(signedPackets[0], 'packet.fromKey.key'))
                accused: _.get(signedPackets, _.get(signedPackets[0], 'packet.fromKey.key'))
            })
        }

        // Attach the entire array of ordered output addresses to our
        // players.  Although we don't know which address belongs to which
        // player ( they've been shuffled by everyone ), the order becomes
        // important later because it effects the transaction output order
        // which has implications for it's signature.
        for (let n = this.players.length; n >= 0; n--) {
            debug('this.players[ n ]:', n, this.players[ n ])
            if (typeof this.players[ n ] !== 'undefined') {
                Object.assign(this.players[ n ], { finalOutputAddresses })
            }

        }

        /* Set equivocation hash (plaintext). */
        this.equivHashPlaintext = '[\'' +
            finalOutputAddresses.join('\', \'') +
            '\'][\'' +
            _.orderBy(this.players, 'playerNumber').map(obj => obj['encryptionPubKey']
            ).join('\', \'') +
            '\']'

        /* Calculate equivocation hash. */
        this.equivHash = bch.crypto.Hash
            .sha256sha256(Buffer.from(this.equivHashPlaintext, 'utf-8'))
            .toString('base64')

        /* Advance to the next phase. */
        this.phase = 'EQUIVOCATION_CHECK'
        this.emit('phase', 'EQUIVOCATION_CHECK')

        /* Now broadcast the results of our "equivocation check". */
        this.comms.sendMessage(
            'broadcastEquivCheck',
            this.session,
            me.playerNumber,
            this.equivHash,
            this.phase,
            this.ephemeralKeypair.publicKey,
            this.ephemeralKeypair.privateKey
        )
    }

    /**
     * Process Equivocation Check Message
     *
     * This function implements processing of messages on Equivocation Check
     * phase(phase # 4).
     *
     * It does the following:
     *     1. Verify if hashes from all players are the same. If it's not,
     *        goes to the blame phase.
     *
     *     2. If hashes are the same it sets the next phase as verification
     *        and submission phase.
     */
    async processEquivCheckMessage (prunedMessage) {
        const me = _.find(this.players, { isMe: true })

        /* Set first player. */
        const firstPlayer = _.minBy(this.players, 'playerNumber')

        /* Set last player. */
        // const lastPlayer = _.maxBy(this.players, 'playerNumber')

        /* Add the hash provided by the player to that player's state data. */
        const sender = Object.assign(
            this.players[_.findIndex(this.players, { session: prunedMessage['session'] })], {
                equivCheck: _.get(prunedMessage, 'message.hash.hash')
            }
        )

        debug(
            'Got a processEquivCheck message from', sender.verificationKey,
            'with hash', sender.equivCheck
        )

        const allHashes = _.compact(this.players.map(obj => obj['equivCheck']))

        if (allHashes.length === this.players.length) {
            // Are all the hashes the same and do they equal ours?
            if (_.uniq(allHashes).length === 1 && _.uniq(allHashes)[0] === this.equivHash) {
                debug('Everyone passes the EQUIVOCATION_CHECK!')

                this.phase = 'VERIFICATION_AND_SUBMISSION'
                this.emit('phase', 'VERIFICATION_AND_SUBMISSION')

                if (me.playerNumber === firstPlayer.playerNumber) {
                    try {
                        await this.verifyAndSubmit()
                    } catch (nope) {
                        console.error('Error processing incoming output and signature:', nope) // eslint-disable-line no-console
                    }
                }
            } else {
                debug('Someone failed the equivCheck!')

                // for (let onePlayer of round.players) {
                for (let onePlayer of this.players) {
                    if (onePlayer.equivCheck !== me.equivCheck) {
                        this.assignBlame({
                            reason: 'EQUIVOCATIONFAILURE',
                            accused: sender.verificationKey,
                            hash: onePlayer.equivCheck
                        }, true)
                    }
                }
            }
        } else {
            // debug('Waiting for more equivCheck messages');
        }
    }

    /**
     * Verify and Submit
     *
     * This function handles messages for the final phase of the protocol
     * (phase # 5).
     *
     * It does the following:
     *     1. Creates an unsigned transaction that adheres to the
     *        CashShuffle spec (input order and amounts, etc).
     *
     *     2. Partially sign the transaction. Sign our input then broadcast
     *        its signature to the other players.
     *
     *     3. Check if we've received the input signature all the other players.
     *
     *     4. Verify the input signature's of all players. If there is a wrong
     *        signature, go to the blame phase.
     *
     *     5. If everything is good, use the signatures to finish signing
     *        the transaction.
     *
     *     6. Broadcast the transaction to the network.
     *
     *     7. Set the done flag and cleanup the round.
     */
    async verifyAndSubmit (prunedMessage) {
        debug('Verify and submit (prunedMessage):', prunedMessage)

        /* Initialize ordered players. */
        const orderedPlayers = _.orderBy(this.players, ['playerNumber'], ['asc'])

        /* Initialize first player. */
        const firstPlayer = _.minBy(orderedPlayers, 'playerNumber')

        /* Initialize last player. */
        // const lastPlayer = _.maxBy(orderedPlayers, 'playerNumber')

        /* Initialize ourselves. */
        const me = _.find(this.players, { isMe: true })

        // If we got a signature message before we've finished building
        // the partially signed transaction, wait up to 15 seconds or until
        // the transaction is done building before letting processing
        // this message.  Otherwise, chaos reigns.
        if (this.shuffleTx.isBuilding) {
            /* Set wait until time. */
            const waitUntilThisTime = new Date().getTime() + (1000 * 15)

            while (this.shuffleTx.isBuilding) {
                /* Set time now. */
                const timeNow = new Date().getTime()

                if (timeNow > waitUntilThisTime || !this.shuffleTx.isBuilding) {
                    this.shuffleTx.isBuilding = false
                } else {
                    await delay(500)
                }
            }
        }

        // If we haven't built the shuffle transaction and
        // broadcast our signature, do so now.
        if (!this.comms.outbox.sent['broadcastSignatureAndUtxo']) {
            // Set the isBuilding flag so incoming messages don't trigger
            // multiple transaction build attempts and multiple signature
            // broadcasts.  It sometimes takes a few seconds to build the
            // partially signed transactions because we also hit a REST
            // endpoint to validate user's have sufficient funds.
            this.shuffleTx.isBuilding = true

            let shuffleTransaction

            try {
                shuffleTransaction = await this.util.coin.buildShuffleTransaction({
                    players: this.players,
                    feeSatoshis: this.shuffleFee
                })
            } catch (nope) {
                console.error('Problem building shuffle transaction:', nope) // eslint-disable-line no-console
                this.writeDebugFile()
            }

            Object.assign(this.shuffleTx, {
                serialized: shuffleTransaction.serialized,
                tx: shuffleTransaction.tx,
                inputs: shuffleTransaction.inputs,
                outputs: shuffleTransaction.outputs
            })

            // Broadcast our transaction signature.  If the other players
            // are able to apply it to their copy of the transaction then
            // the shuffleRound is complete.

            this.comms.sendMessage(
                'broadcastSignatureAndUtxo',
                this.session,
                me.playerNumber,
                me.coin.txid + ':' + me.coin.vout,
                shuffleTransaction.signatureBase64,
                this.phase,
                this.ephemeralKeypair.publicKey,
                this.ephemeralKeypair.privateKey
            )

            // Turn off the isBuilding sign so any queued up signature
            // checks may now occur.
            this.shuffleTx.isBuilding = false
        }

        // The CashShuffle protocol dictates that the first player in the
        // round is responsible for first broadcasting their transaction
        // signature.  So if we ARE the first player, we call this function
        // without any parameters after we've received and verified the hashes.
        // We will exit now after sending the protocol message and this function
        // will be immediately called again (this time with parameters) as the
        // server sends us our own signature message.
        if (firstPlayer.playerNumber === me.playerNumber && !prunedMessage) {
            return
        }

        /* Set unspent transaction output. */
        const utxo = _.get(prunedMessage, 'message.signatures[0].utxo')

        /* Build new signature data. */
        const newSigData = {
            prevTxId: utxo.split(':')[0],
            vout: Number(utxo.split(':')[1]),
            signature: Buffer.from(
                _.get(
                    prunedMessage,
                    'message.signatures[0].signature.signature'
                ), 'base64').toString('utf-8')
        }
        debug('Verify and submit (newSigData):', newSigData)

        // Assert(len(sig) >= 8 and len(sig) <= 72)
        // Assert(sig[0] == 0x30)
        // Assert(sig[1] == len(sig)-2) # Check length
        // Assert(sig[2] == 0x02)

        /* Add new signature data to shuffle signatures. */
        this.shuffleTx.signatures.push(newSigData)

        /* Retrieve signer. */
        const signer = _.find(this.players, (onePlayer) => {
            return onePlayer.coin.txid === newSigData.prevTxId && Number(onePlayer.coin.vout) === newSigData.vout
        })
        debug('Verify and submit (signer):', signer)

        /* Validate signer. */
        if (!signer) {
            this.assignBlame({
                reason: 'INVALIDSIGNATURE',
                accused: _.get(prunedMessage, 'fromKey.key')
            })

            return
        }

        debug(`Got a shuffle transaction signature for coin ${utxo}`)

        // Verify that the signature we've been given is valid for the shuffle
        // transaction input they've stated.  If so, we will add that signature
        // to our transaction.  If not, we will abort and blame the sender.
        // Note, the function returns the data necessary to add the signature.
        // That data takes the form below.
        //
        // {
        //   success: true,
        //   inputIndex: signatureObject.inputIndex,
        //   signature: signatureObject
        // };
        let sigVerifyResults

        try {
            sigVerifyResults = this.util.coin
                .verifyTransactionSignature(
                    this.shuffleTx.tx,
                    newSigData,
                    _.get(signer, 'coin.publicKey')
                )
        } catch (nope) {
            console.error('Error when trying to validate signature', nope) // eslint-disable-line no-console

            this.assignBlame({
                reason: 'INVALIDSIGNATURE',
                accused: _.get(prunedMessage, 'fromKey.key')
            })

            return
        }

        /* Validate signature (for UTXO). */
        if (sigVerifyResults && sigVerifyResults.success) {
            debug(`Shuffle transaction signature for ${utxo} checks out!`)

            // If it was us that sent the message, we don't need to apply
            // the signature.  Our signature was applied during the creation
            // of the shuffle transaction.  We only need to apply the other
            // player's signatures.
            if (!signer.isMe) {
                // debug(`Applying signature to input${sigVerifyResults.inputIndex}!`);

                try {
                    this.shuffleTx.tx.inputs[sigVerifyResults.inputIndex]
                        .addSignature(this.shuffleTx.tx, sigVerifyResults.signature)
                } catch (nope) {
                    /* eslint-disable-next-line no-console */
                    console.error('We failed to apply a signature to our transaction.  Looks like our fault', nope)
                    // TODO: throw and cleanup
                }
            }
        } else {
            debug(`Bad signature for coin ${utxo}`)

            this.assignBlame({
                reason: 'INVALIDSIGNATURE',
                accused: _.get(prunedMessage, 'fromKey.key')
            })
        }

        /* Initialize fully signed flag. */
        let txIsFullySigned

        try {
            txIsFullySigned = this.shuffleTx.tx.isFullySigned()
        } catch (nope) {
            console.error('Malformed shuffle transaction', nope) // eslint-disable-line no-console
            this.endShuffleRound()
        }

        if (txIsFullySigned && this.shuffleTx.signatures.length === this.numberOfPlayers) {
            debug(`Broadcasting CashShuffle tx ${this.shuffleTx.tx.hash} to the network!`)

            let submissionResults

            // debug('Broadcasting raw tx:',
            //     this.shuffleTx.tx.toBuffer('hex').toString('hex'))
            debug('Broadcasting raw tx:',
                this.shuffleTx.tx.toBuffer('hex').toString('hex'))

            try {
                /* Send raw transaction. */
                submissionResults = await Nito.Transaction
                    .sendRawTransaction(this.shuffleTx.tx.toBuffer('hex').toString('hex'))

                this.emit('complete', {
                    txid: this.shuffleTx.tx.toBuffer('hex').toString('hex'),
                    submissionResults,
                })
            } catch (nope) {
                console.error('Error broadcasting transaction to the network:', nope) // eslint-disable-line no-console

                this.endShuffleRound()

                return
            }

            if (submissionResults) {
                Object.assign(this.shuffleTx, {
                    results: submissionResults
                })
            }

            const allOutputAddressesUsed = this.shuffleTx.tx.outputs.map(oneOutput => {
                return oneOutput.script.toAddress().toString()
            })

            // Add a property so the user's wallet logic can
            // quickly tell if this change address can be reused.
            Object.assign(this.change, {
                usedInShuffle: allOutputAddressesUsed
                    .indexOf(this.change.legacyAddress) > -1
            })

            this.success = true

            this.endShuffleRound()
        } else {
            debug('Waiting on more signatures...')
        }
    }

    /**
     * End Shuffle Round
     */
    endShuffleRound(writeDebugFileAnyway) {
        debug(`Shuffle has ended with success [ ${ this.success } ]`)
        this.roundComplete = true

        if (!this.success || writeDebugFileAnyway) {
            debug('Writing debug file..')
            this.writeDebugFile()
        }

        // Close this round's connection to the server
        this.comms._wsClient.close()

        const msg = `Coin ${this.coin.txid}:${this.coin.vout} has been successfully shuffled!`
        this.emit('notice', msg)
        this.emit('shuffle')
    }

    /**
     * Stop
     */
    stop() {
        /* Set complete flag. */
        this.roundComplete = true

        // Close this round's connection to the server
        this.comms._wsClient.close()

        debug(`Shuffle has stopped.`)
    }

    /**
     * Handle Blame
     *
     * When we receive a message from another player accusing someone
     * of violating the protocol.
     */
    handleBlameMessage (messageObject) {
        /* Retrieve key of accused. */
        const keyOfAccused = _.get(messageObject, 'message.blame.accused.key')

        /* Set accused. */
        const accused = _.find(this.players, { verificationKey: keyOfAccused })

        /* Validate accused. */
        if (accused.isMe) {
            debug(`I'M THE ONE BEING BLAMED. HOW RUDE!!`)
            console.log(`I'M THE ONE BEING BLAMED. HOW RUDE!!`)
        } else {
            debug('Player', accused.verificationKey, 'is to blame!')
            console.log('Player', accused.verificationKey, 'is to blame!')
        }

        /* Write debug file. */
        this.writeDebugFile()
    }

    /**
     * Assign Blame
     *
     * When we conclude that a player has violated the protocol and we need to
     * send out a blame message.
     *
     * Possible Ban Reasons:
     *     INSUFFICIENTFUNDS = 0
     *     DOUBLESPEND = 1
     *     EQUIVOCATIONFAILURE = 2
     *     SHUFFLEFAILURE = 3
     *     SHUFFLEANDEQUIVOCATIONFAILURE = 4
     *     INVALIDSIGNATURE = 5
     *     MISSINGOUTPUT = 6
     *     LIAR = 7
     *     INVALIDFORMAT = 8
     */

    /*
    {
        reason: < enum string citing reason for blame accusation >,
        accused: < verification key in hex format of player who 's being accused >,
        invalid: < an array of protobuff packets that provide evidence of fault > ,
        hash: < hash provided by accused which differs from our own > ,
        keypair: {
            key: < private key > ,
            public: < public key >
        }
    }
    */
    assignBlame (details, keepAlive) {
        debug(`Issuing a formal blame message against ${details.accused} for ${details.reason}`)

        /* Send message. */
        this.comms.sendMessage(
            'blameMessage',
            details,
            this.session,
            this.myPlayerNumber,
            this.ephemeralKeypair.publicKey,
            this.ephemeralKeypair.privateKey
        )

        if (!keepAlive) {
            this.endShuffleRound()
        }
    }
}

module.exports = ShuffleRound
