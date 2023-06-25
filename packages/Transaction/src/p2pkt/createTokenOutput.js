/* Import modules. */
import {
    bigIntToBinUint64LE,
} from '@bitauth/libauth'

import { decodeAddress } from '@nexajs/address'

import {
    binToHex,
    hexToBin,
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
    console.log('\n  Receiving address:', _address)
    console.log('\n  Receiving satoshis:', _satoshis)
    console.log('\n  Receiving token id:', _tokenid)
    console.log('\n  Receiving # tokens:', _tokens)

    const lockingBytecode = decodeAddress(_address).hash
    console.log('\n  lockingBytecode (hex):', binToHex(lockingBytecode))

    /* Create (token) output. */
    const tokenOutput = {
        lockingBytecode,
        amount: bigIntToBinUint64LE(BigInt(_satoshis)),
        tokenidHex: hexToBin(_tokenid),
        tokens: bigIntToBinUint64LE(BigInt(_tokens)),
    }
    console.log('\n  tokenOutput:', tokenOutput)

    // TODO: We want to do a check here to ensure the satoshi amount is above the dust limit.

    /* Return the output. */
    return tokenOutput
}
