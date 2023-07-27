/* Import modules. */
import { encodeDataPush } from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

import {
    binToHex,
    hexToBin,
    bigIntToCompactUint,
    numberToBinUint16LE,
    numberToBinUint32LE,
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
export default async (_address, _satoshis, _tokenid, _tokens) => {

    let lockingBytecode
    let scriptAmount
    let tokenOutput

    if (_tokens > BigInt(0xFFFFFFFF)) {
        scriptAmount = bigIntToBinUint64LE(_tokens)
    } else if (_tokens > BigInt(0xFFFF) ) {
        scriptAmount = bigIntToBinUint32LE(_tokens)
    } else {
        scriptAmount = bigIntToBinUint16LE(_tokens)
    }

    scriptAmount = encodeDataPush(scriptAmount)

    if (_tokenid) {
        lockingBytecode = new Uint8Array([
            ...encodeDataPush(hexToBin(_tokenid)),
            ...scriptAmount,
            ...decodeAddress(_address).hash.slice(2), // remove 1700
        ])

        lockingBytecode = encodeDataPush(lockingBytecode)
    } else {
        lockingBytecode = decodeAddress(_address).hash
    }
    // console.log('\n  lockingBytecode (hex):', binToHex(lockingBytecode))

    /* Create (token) output. */
    tokenOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(_satoshis),
        tokenidHex: _tokenid,
        tokens: bigIntToBinUint64LE(_tokens),
    }
    // console.log('\n  tokenOutput:', tokenOutput)

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return tokenOutput
}
