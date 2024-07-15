/* Import modules. */
import { decodeAddress } from '@nexajs/address'

import { encodeDataPush } from '@nexajs/script'

import {
    bigIntToBitcoinVarInt,
    binToHex,
    hexToBin,
    bigIntToBinUint16LE,
    bigIntToBinUint32LE,
    bigIntToBinUint64LE
} from '@nexajs/utils'

/**
 * Create a transaction P2PKH output with the given value.
 *
 * @function
 *
 * @param address  {string} Bitcoin Cash address to convert to P2PKT lock-code.
 * @param satoshis {number} Satoshi value to attach to output
 *
 * @returns {Promise<Output>} The P2PKT output script.
 */
export default async (
    _address,
    _satoshis,
    _tokenidHex,
    _tokens,
) => {
    /* Validate token (hex) id. */
    if (!_tokenidHex) {
        throw new Error(`Oops! Missing token (hex) id.`)
    }

    /* Initialize locals. */
    let lockingBytecode
    let scriptAmount
    let tokenOutput

    if (_tokens > BigInt(0xFFFFFFFF)) {
        scriptAmount = bigIntToBinUint64LE(_tokens)
    } else if (_tokens > BigInt(0xFFFF)) {
        scriptAmount = bigIntToBinUint32LE(_tokens)
    } else {
        scriptAmount = bigIntToBinUint16LE(_tokens)
    }

    lockingBytecode = new Uint8Array([
        ...encodeDataPush(hexToBin(_tokenidHex)),
        ...encodeDataPush(scriptAmount),
        ...decodeAddress(_address).hash.slice(1), // remove group id 0x00
    ])

    /* Prepend locking bytecode length. */
    lockingBytecode = new Uint8Array([
        bigIntToBitcoinVarInt(BigInt(lockingBytecode.length)),
        ...lockingBytecode,
    ])

    /* Create (token) output. */
    tokenOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(_satoshis),
    }

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return tokenOutput
}
