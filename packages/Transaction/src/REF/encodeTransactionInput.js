/* Import modules. */
import { flattenBinArray } from '@nexajs/utils'

import {
    bigIntToBinUint64LE,
    numberToBinUintLE,
    numberToBinUint32LE,
} from '@bitauth/libauth'

import { bigIntToCompactUint } from '@nexajs/utils'

export default (input) =>
    // FIXME We need to detect transaction type for cross-chain input formatting.
    new Uint8Array([
        0x0, // Type MUST be (0) zero
        ...flattenBinArray([ // NOTE: This will NOT allow (0) zero starting byte
            input.outpointTransactionHash.slice().reverse(),
            bigIntToCompactUint(BigInt(input.unlockingBytecode.length)),
            input.unlockingBytecode,
            numberToBinUint32LE(input.sequenceNumber),
            bigIntToBinUint64LE(BigInt(input.satoshis)),
        ])
    ])
