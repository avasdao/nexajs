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
    let groupid
    let nonce

    /* Initialize counter. */
    counter = 0

    do {
        if (counter % 1000 === 0) {
            console.info('  hashing...') // show progress indicator
        }

        nonce = bigIntToBinUint64LE(BigInt(counter++))
        // console.log('NONCE-1', binToHex(nonce));

        nonce = binToHex(nonce).slice(0, 14) + 'fc'
        // console.log('NONCE-2', nonce);

        nonce = hexToBin(nonce)

        dataScript = new Uint8Array([
            bigIntToBitcoinVarInt(BigInt(_dataScript.length)),
            ..._dataScript,
        ])

        groupData = new Uint8Array([
            ..._outpoint,
            ...dataScript,
            ...nonce,
        ])

        groupid = sha256(sha256(groupData))
    } while (binToHex(groupid).slice(-4) !== '0000')

    return {
        groupid,
        nonce,
    }
}
