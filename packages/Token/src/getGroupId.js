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
export default (_dataScript) => {
    let dataScript
    let groupData
    let groupid
    let nonce
    let outpoint

    outpoint = hexToBin('48f3a733fa9346b161454b15a72f27f90634a2dd20208fcb52c046472d384ef6')

    nonce = bigIntToBinUint64LE(BigInt(263321))
    nonce = hexToBin('99040400000000fc')

    dataScript = new Uint8Array([
        bigIntToBitcoinVarInt(BigInt(_dataScript.length)),
        ..._dataScript,
    ])

    groupData = new Uint8Array([
        ...outpoint,
        ...dataScript,
        ...nonce,
    ])

    groupid = sha256(sha256(groupData))

    return groupid
}
