/* Import modules. */
import { encodeDataPush } from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

import {
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
export default async (_script, _satoshis) => {
    console.log('\n  Receiving script:', _script)
    console.log('\n  Receiving satoshis:', _satoshis)

    let lockingBytecode
    let scriptAmount
    let scriptOutput

    if (_tokens > 0xFFFFFFFFn) {
        scriptAmount = bigIntToBinUint64LE(_tokens)
    } else if (_tokens > 0xFFFFn) {
        scriptAmount = bigIntToBinUint32LE(_tokens)
    } else {
        scriptAmount = bigIntToBinUint16LE(_tokens)
    }

    scriptAmount = encodeDataPush(scriptAmount)

    lockingBytecode = new Uint8Array([
        ...encodeDataPush(hexToBin(_tokenid)),
        ...scriptAmount,
        ...decodeAddress(_address).hash.slice(2), // remove 0x1700
    ])

    lockingBytecode = encodeDataPush(lockingBytecode)
    // console.log('\n  lockingBytecode (hex):', binToHex(lockingBytecode))

    /* Create (script) output. */
    scriptOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(_satoshis),
        tokenidHex: _tokenid,
        tokens: bigIntToBinUint64LE(_tokens),
    }
    // console.log('\n  scriptOutput:', scriptOutput)

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return scriptOutput
}
