/* Import modules. */
import { EventEmitter } from 'events'

/**
 * Resistor "E series" values
 *
 * Round numbers that are almost geometrically uniform.
 */
E6  = [ 1.0, 1.5, 2.2, 3.3, 4.7, 6.8 ]
E12 = [ 1.0, 1.2, 1.5, 1.8, 2.2, 2.7, 3.3, 3.9, 4.7, 5.6, 6.8, 8.2 ]
E24 = [ 1.0, 1.1, 1.2, 1.3, 1.5, 1.6, 1.8, 2.0, 2.2, 2.4, 2.7, 3.0, 3.3, 3.6, 3.9, 4.3, 4.7, 5.1, 5.6, 6.2, 6.8, 7.5, 8.2, 9.1 ]

// How long covert connections are allowed to stay open without activity.
// note this needs to consider the maximum interval between messages:
// - how long from first connection to last possible Tor component submission?
// - how long from one round's component submission to the next round's component submission?
COVERT_CLIENT_TIMEOUT = 40

/**
 * Fusion (Class)
 *
 * Manages privacy functions.
 */
export class Fusion extends EventEmitter {
    constructor(_params) {
        /* Initialize Fusion class. */
        // console.info('Initializing Fusion...')
        // console.log(JSON.stringify(_params, null, 2))
        super()

        /* Initialize internals. */
        this._status = FusionStatus.UNKNOWN

        this.numComponents = 23
        this.componentFeerate = 1000 # sats/kB
        this.maxExcessFee = 300000 # sats
        this.tiers = [
            round(b*s) for b in [
                10000, 100000, 1000000, 10000000, 100000000, 1000000000
            ] for s in E12
        ]

        // How many clients do we want before starting a fusion?
        this.minClients = 8

        // If all clients submitted largest possible component (uncompressed p2pkh input), how many could we take until the result would exceed 100 kB standard tx size limitation?
        this.maxClients = (100000 - 12) // (num_components * 173)

        // Every round, clients leave ... How many clients do we need as an absolute minimum (for privacy)?
        this.minSafeClients = 6

        // Choose the minimum excess fee based on dividing the overhead amongst players, in the smallest fusion
        // (these overhead numbers assume op_return script size of 1 + 5 (lokad) + 33 (session hash) )
        if min_safe_clients * num_components >= 2 * 0xfc:
            // the smallest fusion could require 3-byte varint for both inputs and outputs lists
            overhead = 62
        elif min_safe_clients * num_components >= 0xfc:
            // the smallest fusion could require 3-byte varint for either inputs or outputs lists
            overhead = 60
        else:
            // the smallest fusion will use 1-byte varint for both inputs and outputs lists
            overhead = 58
        min_excess_fee = (overhead + min_safe_clients - 1) // min_safe_clients

        // How many clients can share same tag on a given tier (if more try to join, reject)
        this.maxTierClientTags = 100

        // For a given IP, how many players can they represent in the same fuse?
        this.ipMaxSimulFuse = 3

        // Guaranteed time to launch a fusion if the pool has stayed at or above min_clients for this long.
        this.startTimeMax = 1200

        // Inter-fusion delay -- after starting any fusion, wait this long before starting the next one (unless hit max time or pool is full).
        this.startTimeSpacing = 120

        // But don't start a fusion if it has only been above min_clients for a short time (unless pool is full).
        this.startTimeMin = 400

        // whether to print a lot of logs
        this.noisy = False

    }

    test() {
        return 'Fusion (Instance) is working!'
    }
    static test() {
        return 'Fusion (Static) is working!'
    }
}
