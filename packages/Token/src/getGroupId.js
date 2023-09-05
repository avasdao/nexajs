/* Import modules. */
import { sha256 } from '@nexajs/crypto'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

import {
    bigIntToBinUint64LE,
    bigIntToBitcoinVarInt,
} from '@bitauth/libauth'

/**
 * Create Group Id
 *
 * Generate an ID for a new group.
 */
export default (_outpoint, _dataScript) => {
    /* Initialize locals. */
    let bitmask
    let counter
    let dataScript
    let groupData
    let groupidBin
    let nonceBin
    let nonceHex
    let outpoint

    /* Initialize counter. */
    counter = 0

    /* Set outpoint .*/
    outpoint = hexToBin(_outpoint)

    do {
        if (counter % 1000 === 0) {
            console.info('  hashing...') // show progress indicator
        }

        nonceHex = bigIntToBinUint64LE(BigInt(counter++))
        // console.log('NONCE-1', binToHex(nonceHex));

        nonceHex = binToHex(nonceHex).slice(0, 14) + 'fc'
        // console.log('NONCE-2', nonceHex);

        nonceBin = hexToBin(nonceHex)

        dataScript = new Uint8Array([
            bigIntToBitcoinVarInt(BigInt(_dataScript.length)),
            ..._dataScript,
        ])

        groupData = new Uint8Array([
            ...outpoint.reverse(), // NOTE: Where is this located in the spec??
            ...dataScript,
            ...nonceBin,
        ])

        groupidBin = sha256(sha256(groupData))
    } while (binToHex(groupidBin).slice(-4) !== '0000')

    return {
        groupidBin,
        nonceBin,
    }
}
