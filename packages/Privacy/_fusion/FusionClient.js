/* Import core modules. */
const _ = require('lodash')
const axios = require('axios')
const debug = require('debug')('cashshuffle:client')
const EventEmitter = require('events').EventEmitter
const URL = require('url').URL

const ShuffleRound = require('./ShuffleRound.js')
const coinUtils = require('./coinUtils.js')

/**
 * Delay (Execution)
 */
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

/* Set delay (in milliseconds). */
const DELAY_IN_MS = 5000

/**
 * Shuffle Client (Class)
 */
class ShuffleClient extends EventEmitter {
    constructor (clientOptions) {
        super()

        debug('Client options', clientOptions)

        /* Add client options to instance. */
        for (let oneOption in clientOptions) {
            this[oneOption] = clientOptions[oneOption]
        }

        /* Set maximum shuffle rounds. */
        this.maxShuffleRounds = this.maxShuffleRounds || 5

        /* Set coins. */
        this.coins = this.coins && this.coins.length ? this.coins : []

        /* Initialize coins to populate. */
        // NOTE: Will add the necessary properties to the coins, so the
        //       shuffle libraries can use them.
        const coinsToPopulate = []

        /* Loop through ALL coins. */
        while (this.coins.length) {
            coinsToPopulate.push(this.coins.pop())
        }
        debug('Coins to populate', coinsToPopulate)

        /* Initialize hooks. */
        this.hooks = this.hooks || {}

        /* Validate change hooks. */
        if (!_.isFunction(this.hooks.change)) {
            debug(`A valid change generation hook was not provided!`)
            throw new Error('BAD_CHANGE_FN')
        }

        /* Validate shuffled hooks. */
        if (!_.isFunction(this.hooks.shuffled)) {
            debug(`A valid shuffle address generation hook was not provided!`)
            throw new Error('BAD_SHUFFLE_FN')
        }

        /* Add unshuffled coins. */
        this.addUnshuffledCoins(
            _.orderBy(coinsToPopulate, ['satoshis'], ['desc']))

        /* Initialize rounds. */
        this.rounds = []

        /* Initialize shuffled. */
        this.shuffled = []

        /* Initialize skipped. */
        this.skipped = []

        /* Initialize shuffling flag. */
        this.isShuffling = false

        // TODO: Add option to prioritize coin selection to either
        //       minimize coins vs maximize shuffle speed.
        // this.shufflePriority = this.shufflePriority ? this.shufflePriority : 'amount';

        // this.statsIntervalId

        /* Initialize server statistics. */
        // NOTE: Server Stats fetched from the `/stats` endpoint.
        this.serverStats = {}

        /* Initialize server back-off (milliseconds). */
        // NOTE: If we every try and fail to reach the server, this number
        //       will be populated with the amount of time the client will
        //       wait in between reconnection attempts.
        this.serverBackoffMs = 0

        /* Set the shuffle fee (in satoshis). */
        this.shuffleFee = 270

        /**
         * Server Pool Amounts
         *
         * (estiamting fiat USD value @ $250.00)
         *
         * Minimum fee amount of 1,000 satoshis (~$0.0025)
         *
         * NOTE: Dust amount is 546 satoshis (~$0.001365)
         */
        this.serverPoolAmounts = [
            1000000000, // 10.0 BCH ($2,500.00)
            100000000, // 1.0 BCH ($250.00)
            10000000, // 0.1 BCH ($25.00)
            1000000, // 0.01 BCH ($2.50)
            100000, // 0.001 BCH ($0.25)
            10000 // 0.0001 BCH ($0.025)
        ]

        /* Initialize lost server connection flag. */
        // NOTE: This flag gets set to true if the server becomes unreachable
        //       after we've started shuffling.  We will use it in our
        //       auto-reconnect logic.
        this.lostServerConnection = false

        /**
         * Check Statistics Interval
         *
         * This is the actual function that is called by setInterval every
         * 5 seconds.  It also enforces server back-off for a persistent
         * lost connection.
         */
        this.checkStatsIntervalFn = async () => {
            this
                .updateServerStats()
                .then(async () => {
                    debug('Updated server statistics.')

                    /* Validate (auto) shuffle status. */
                    if (!this.disableAutoShuffle || this.isShuffling) {
                        /* Set shuffling flag. */
                        this.isShuffling = true

                        /* Validate server connection. */
                        if (!this.lostServerConnection) {
                            /* Start shuffling. */
                            this.shuffle()
                        }
                    }

                    /* Set lost server connection flag. */
                    this.lostServerConnection = false
                })
                .catch(async (error) => {
                    if (error) {
                        return console.error(error) // eslint-disable-line no-console
                    }

                    /* Clear (interval) timer. */
                    clearInterval(this.tingId)
                    debug(`No server. Waiting ${Math.floor(this.serverBackoffMs / 1000)} seconds before reconnecting`)

                    /* Delay execution. */
                    await delay(this.serverBackoffMs)

                    /* Set server statistics interval. */
                    this.setServerStatsInterval()
                })
        }

        /**
         * Set Server Statistics Interval
         *
         * Re-fetch the server stats every 5 seconds, so we can make an
         * informed decision about which pools to join!
         */
        this.setServerStatsInterval = async () => {
            /* Set (delay) interval. */
            this.tingId = setInterval(this.checkStatsIntervalFn, DELAY_IN_MS)

            /* Check statistics interval. */
            this.checkStatsIntervalFn()
        }

        /* Set server statistics interval. */
        this.setServerStatsInterval()

        return this
    }

    /**
     * Skip Coin
     *
     * Skip a coin that is deemed unshufflable. This normally occurs when
     * UTXOs are at or below the dust threshold.
     */
    skipCoin (someCoin) {
        debug('Skipping coin', someCoin)
        /* Remove the coin from the pool of available coins. */
        const coinToSkip = _.remove(this.coins, someCoin)[0]

        /* Validate coin skip. */
        if (!coinToSkip) {
            throw new Error('coin_not_found')
        }

        /* Add coin to skipped. */
        this.skipped.push(coinToSkip)
    }

    /**
     * Start New Round
     *
     * Instantiate new round and add it to our round array. Set the event
     * listeners so we know when a round has ended and needs cleanup.
     */
    async startNewRound (someCoin, poolAmount, serverUri) {
        debug('Start new round',
            someCoin,
            poolAmount,
            serverUri
        )
        /* Remove the coin from the pool of available coins. */
        const coinToShuffle = _.remove(this.coins, someCoin)[0]

        /* Validate coin shuffle. */
        if (!coinToShuffle) {
            throw new Error('coin_not_found')
        }

        /* Initialize new shuffle round. */
        const newShuffleRound = new ShuffleRound({
            hooks: this.hooks,
            serverUri,
            coin: coinToShuffle,
            protocolVersion: this.protocolVersion,
            poolAmount,
            shuffleFee: this.shuffleFee
        })

        /* Handle when a shuffle round ends, successfully or not. */
        newShuffleRound.on('shuffle', this.cleanupCompletedRound.bind(this))

        /* Handle debugging messages. */
        // NOTE: Pass any debug messages from our shuffleround instances
        //       to any listeners on the shuffleClass instance.
        newShuffleRound.on('debug', (someShuffleRoundMessage) => {
            this.emit('debug', someShuffleRoundMessage)
        })

        debug(
            'Attempting to mix a',
            newShuffleRound.coin.satoshis,
            'satoshi coin on',
            newShuffleRound.serverUri
        )

        /* Add new shuffle round. */
        this.rounds.push(newShuffleRound)
    }

    /**
     * Cleanup Completed Round
     */
    cleanupCompletedRound (shuffleRoundObject) {
        /* Validate shuffle object. */
        if (!shuffleRoundObject) {
            return
        }

        /* Remove the coin from the pool of available coins. */
        // TODO: Make this removal criteria more specific in case of
        //       the insanely unlikely case where the server gives us the
        //       same sessionid for two simultaneously open rounds.
        _.remove(this.rounds, { session: shuffleRoundObject.session })

        // If successful, add the clean coin to our shuffled coin
        // array and emit an event on the client so anyone watching
        // can take the appropriate action.
        if (!_.get(shuffleRoundObject, 'roundError.shortCode')) {
            // debug(`Adding ${shuffleRoundObject.shuffled}`);

            /* Put the newly shuffled coin in the "shuffled" array. */
            this.shuffled.push(shuffleRoundObject.shuffled)

            // Try and shuffle any change outputs
            //
            // ( HELP!  Should this be configurable? Idfk )
            //
            // if (shuffleRoundObject.change && shuffleRoundObject.change.usedInShuffle && this.reshuffleChange) {
            //   this.coins.push(shuffleRoundObject.change);
            // }

            /* Emit an event on the `ShuffleClient` class. */
            this.emit('shuffle', shuffleRoundObject)
        } else {
            // Handle cleanup for when our round ends due to a
            // protocol violation or an exception is thrown.
            //
            // This error property takes the form below
            //
            // {
            //     shortCode: 'BAD_SIG',
            //     errorObject: [ Error instance containing a stacktrace ],
            //     isProtocolError: true,
            //     isException: false,
            //     accusedPlayer: [ Object containing player data ]
            // }
            //
            // TODO: Add logic for segregating coins that fail to shuffle
            //       because they are deemed unshufflable by our peers or by
            //       this library.
            debug(`Round failed with code ${shuffleRoundObject.roundError.shortCode}`)

            /* Push this coin back onto our stack of coins to be shuffled. */
            this.coins.push(shuffleRoundObject.coin)
        }
    }

    /**
     * Shuffle
     */
    async shuffle () {
        /* Validate shuffling status. */
        while (this.isShuffling) {
            // If we have a connection error, wait a while
            // then try again.  Don't exit this loop.
            if (!this.serverBackoffMs) {
                if (this.coins.length && this.rounds.length < this.maxShuffleRounds) {
                    // Here we can add logic that considers this client's
                    // `maxShuffleRounds` param when selecting a coin to
                    // shuffle.

                    /* Set coin to shuffle. */
                    const coinToShuffle = _.maxBy(this.coins, 'satoshis')

                    /* Determine the pools this coin is eligible for. */
                    const eligiblePools = _.partition(this.serverPoolAmounts, (onePoolAmount) => {
                        /* Set amount after fee. */
                        const amountAfterFee = coinToShuffle.satoshis - this.shuffleFee

                        /* Validate eligibility. */
                        return amountAfterFee >= onePoolAmount
                    })[0]

                    /* Validate eligibility. */
                    // NOTE: If the value of the coin is less than the lowest
                    //       pool size on this server, deem it unshufflable.
                    if (!eligiblePools.length) {
                        this.skipCoin(coinToShuffle)

                        this.emit('skipped', _.extend(coinToShuffle, {
                            error: 'dust'
                        }))

                        continue
                    }

                    /* Get a list of the pools in which we have an active shuffle round. */
                    const poolsInUse = _.map(_.filter(this.rounds, { done: false }), 'poolAmount')

                    /* Remove any pool that we have an active round in. */
                    const poolsWeCanUse = _.difference(eligiblePools, poolsInUse)

                    /* Set eligible pools with players. */
                    const eligiblePoolsWithPlayers = _.intersection(poolsWeCanUse, _.map(this.serverStats.pools, 'amount'))

                    /* Set pool to use. */
                    const poolToUse = _.max(eligiblePoolsWithPlayers.length ? eligiblePoolsWithPlayers : poolsWeCanUse)

                    /* Validate pool to use. */
                    if (!poolToUse) {
                        continue
                    }

                    /* Validate server statistics. */
                    if (!(this.serverStats && this.serverStats.shuffleWebSocketPort)) {
                        debug('Cannot find shuffle server information')
                        continue
                    }

                    /* Initialize server URI. */
                    let serverUri = this.serverUri

                    /* Validate server URI. */
                    if (!serverUri) {
                        /* Set parsed server statistics. */
                        const serverStatsUriParsed = new URL(this.serverStatsUri)

                        /* Update server statistics. */
                        Object.assign(serverStatsUriParsed, {
                            protocol: serverStatsUriParsed.protocol.replace(/^http(s?):/, 'ws$1:'),
                            port: this.serverStats.shuffleWebSocketPort,
                            pathname: ''
                        })

                        /* Set server URI. */
                        serverUri = serverStatsUriParsed.toString()
                        debug('Parsed Server URI', serverUri)
                    }

                    try {
                        debug('Starting new round in:', serverUri)
                        await this.startNewRound(coinToShuffle, poolToUse, serverUri)
                    } catch (nope) {
                        debug('Cannot shuffle coin:', nope)
                        continue
                    }
                } else {
                    // debug('No coins to shuffle',
                    //     this.coins.length,
                    //     this.rounds.length,
                    //     this.maxShuffleRounds
                    // )
                }
            } else {
                /* Set lost server connection flag. */
                this.lostServerConnection = true
            }

            /* Delay execution. */
            await delay(DELAY_IN_MS)
        }
    }

    /**
     * Stop
     */
    stop () {
        /* Validate shuffling status. */
        if (this.isShuffling) {
            /* Set shuffling flag. */
            this.isShuffling = false
        }
    }

    /**
     * Add Unshuffled Coins
     */
    addUnshuffledCoins (oneOrMoreCoins) {
        // This accepts single coin objects or arrays of them.
        // Always make sure we're processing them as arrays.
        oneOrMoreCoins = _.isArray(oneOrMoreCoins) ? oneOrMoreCoins : [ oneOrMoreCoins ]

        /* Loop through ALL coins. */
        for (let oneCoin of oneOrMoreCoins) {
            if (!oneCoin.satoshis || oneCoin.satoshis < 10000 + this.shuffleFee) {
                debug(`Skipping coin ${oneCoin} because it's just dust`)
                this.skipped.push(_.extend(oneCoin, { shuffled: false, error: 'size' }))
            }

            try {
                // Extend the coin object with `PublicKey` and `PrivateKey`
                // instances from the `bitcoinjs-fork` library.  They will
                // be used for transaction signing and verification.
                const keypair = coinUtils.getKeypairFromWif(oneCoin.wif)

                _.extend(oneCoin, {
                    publicKey: keypair.publicKey,
                    privateKey: keypair.privateKey
                })

                this.coins.push(oneCoin)
            } catch (nope) {
                debug('Cannot populate coin for shuffling:', nope)
                continue
            }
        }
    }

    /**
     * Change Shuffle Server
     *
     * Change the Cashshuffle server this client will use, in future shuffle
     * rounds. All pending shuffle rounds will use whichever server it
     * started with.
     */
    async changeShuffleServer (someServerUri) {
        try {
            await this.updateServerStats(someServerUri)
        } catch (nope) {
            debug('Error changing servers:', nope)
            throw nope
        }

        return true
    }

    /**
     * Update Server Stats
     */
    async updateServerStats (newServerUri) {
        /* Initialize server stats. */
        let serverStats

        try {
            serverStats = await axios
                .get(newServerUri || this.serverStatsUri)
        } catch (nope) {
            // If we fail to reach the server, try again with
            // an increasing infrequency with the maximum time
            // between tries being 20 seconds and the minimum
            // being 5 seconds.
            this.serverBackoffMs = this.serverBackoffMs ? Math.floor((this.serverBackoffMs * 3) / 2) : DELAY_IN_MS
            this.serverBackoffMs = this.serverBackoffMs <= 20000 ? this.serverBackoffMs : 20000

            debug(nope.message)
            throw nope
        }

        /* Validate server statistics. */
        if (serverStats) {
            /* Update server statistics. */
            _.extend(this.serverStats, serverStats.data)

            /* Reset server back-off. */
            this.serverBackoffMs = 0
        }

        /* Return server statistics. */
        return serverStats
    }
}

module.exports = ShuffleClient
