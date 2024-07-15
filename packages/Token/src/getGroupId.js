/* Import modules. */
import { sha256 } from '@nexajs/crypto'

import {
    bigIntToBinUint64LE,
    bigIntToBitcoinVarInt,
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/**
 * Create Group Id
 *
 * Generate an ID for a new group.
 */
export default (_outpoint, _dataScript) => {
    /* Initialize locals. */
    let bitmask
    let counters
    let dataScript
    let groupData
    let groupidBin
    let nonceBin
    let nonceHex
    let outpoint

    /* Initialize counter. */
    counters = new Array(8)
    counters[0] = 0
    counters[1] = 0
    counters[2] = 0
    counters[3] = 0
    counters[4] = 0
    counters[5] = 0
    counters[6] = 0

    /* Set outpoint .*/
    outpoint = hexToBin(_outpoint)

    /* Reverse outpoint. */
    // NOTE: Where is this located in the spec??
    outpoint = outpoint.reverse()

    /* Format data script. */
    dataScript = new Uint8Array([
        bigIntToBitcoinVarInt(BigInt(_dataScript.length)),
        ..._dataScript,
    ])

    do {
        // NOTE: Show progress...
        if (counters[0]++ % 10000 === 0) {
            console.info('  hashing...') // show progress indicator
        }

        // nonceHex = bigIntToBinUint64LE(BigInt(counters[0]))
        // console.log('NONCE-1', binToHex(nonceHex));

        /* Handle counters. */
        if (counters[0] && counters[0] % 255 === 0) {
            counters[1]++

            if (counters[1] && counters[1] % 255 === 0) {
                counters[2]++

                if (counters[2] && counters[2] % 255 === 0) {
                    counters[3]++

                    if (counters[3] && counters[3] % 255 === 0) {
                        counters[4]++

                        if (counters[4] && counters[4] % 255 === 0) {
                            counters[5]++

                            if (counters[5] && counters[5] % 255 === 0) {
                                counters[6]++
                            }
                        }
                    }
                }
            }
        }

        // nonceBin = hexToBin(nonceHex)
        nonceBin = new Uint8Array([
            counters[0],
            counters[1],
            counters[2],
            counters[3],
            counters[4],
            counters[5],
            counters[6],
            0xfc, // 252 (Authorization flag)
        ])

        groupData = new Uint8Array([
            ...outpoint,
            ...dataScript,
            ...nonceBin,
        ])

        groupidBin = sha256(sha256(groupData))
} while (groupidBin[30] !== 0 || groupidBin[31] !== 0)

    return {
        groupidBin,
        nonceBin,
    }
}
