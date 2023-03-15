import {
    flattenBinArray,
    numberToBinUintLE,
    numberToBinUint32LE,
    bigIntToBinUint64LE,
} from '@bitauth/libauth'

import bigIntToCompactUint from './utils/bigIntToCompactUint.js'

export default (input) =>
    // flattenBinArray([
    //     numberToBinUintLE(0), // Type MUST be (0)
    //     input.outpointTransactionHash.slice().reverse(),
    //     // numberToBinUint32LE(input.outpointIndex),
    //     bigIntToCompactUint(BigInt(input.unlockingBytecode.length)),
    //     input.unlockingBytecode,
    //     numberToBinUint32LE(input.sequenceNumber),
    //     bigIntToBinUint64LE(BigInt(input.amount)),
    //     // bigIntToBinUint64LE(BigInt(1337)),
    // ])

    // FIXME We need to detect transaction type for cross-chain input formatting.
    new Uint8Array([
        numberToBinUintLE(0), // Type MUST be (0) zero
        ...flattenBinArray([ // NOTE: This will NOT allow (0) zero starting byte
            input.outpointTransactionHash.slice().reverse(),
            // numberToBinUint32LE(input.outpointIndex),
            bigIntToCompactUint(BigInt(input.unlockingBytecode.length)),
            input.unlockingBytecode,
            numberToBinUint32LE(input.sequenceNumber),
            bigIntToBinUint64LE(BigInt(input.amount)),
            // bigIntToBinUint64LE(BigInt(1337)),
        ])
    ])
