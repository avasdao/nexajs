

/**
 * Fusion Server (Class)
 *
 * Server for clients waiting to start a fusion. New clients get a
 * ClientThread made for them, and they are put into the waiting pools.
 * Once a Fusion thread is started, the ClientThreads are passed over to
 * a FusionController to run the rounds.
 */
export default class FusionServer() {
    constructor(
        _config,
        _network,
        _bindhost,
        _port,
        _upnp = null,
        _announcehost = null,
        _donation_address = null,
    ) {

        super()

        this.config = _config

        this.network = _network

        this.isTestnet = _networks.net.TESTNET

        this.announceHost = _announcehost

        this.donationAddress = _donation_address

        this.waitingPools = {
            t: WaitingPool(Params.min_clients, Params.max_tier_client_tags) for t in Params.tiers
        }

        this.tLastFuse = time.monotonic() // when the last fuse happened; as a placeholder, set this to startup time.

        this.resetTimer()

    }

    /**
     * Reset Timer
     *
     * Scan pools for the favoured fuse:
     * - Out of the pool(s) with the most number of players,
     * - Choose the pool with the earliest fill time;
     * - If no pools are filled then there is no favoured fuse.
     *   (since fill time is a float, this will almost always be unique)
     */
    resetTimer() {

    }

    /**
     * Start Fuse
     *
     * Immediately launch Fusion at the selected tier.
     */
    startFuse() {

    }

    /**
     * New Client Job
     *
     * TBD...
     */
    new_client_job() {

    }

}
