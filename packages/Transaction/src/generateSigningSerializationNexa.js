import {
    bigIntToBitcoinVarInt,
    flattenBinArray,
    // hashOutputs,
    numberToBinUintLE,
    numberToBinUint32LE,
} from '@bitauth/libauth'

import {
    hashPrevouts,
    hashAmounts,
    hashSequence,
    hashOutputs,
} from './signing-serialization.js'


/**
 * Serialize the signature-protected properties of a transaction following the
 * algorithm required by the `signingSerializationType` of a signature.
 *
 * Note: this implementation re-computes all hashes each time it is called. A
 * performance-critical application could instead use memoization to avoid
 * re-computing these values when validating many signatures within a single
 * transaction. See BIP143 for details.
 */
export default ({
    correspondingOutput,
    coveredBytecode,
    forkId = new Uint8Array([0, 0, 0]),
    locktime,
    outpointIndex,
    outpointTransactionHash,
    outputValue,
    sequenceNumber,
    sha256,
    signingSerializationType,
    transactionOutpoints,
    transactionOutputs,
    transactionAmounts,
    transactionSequenceNumbers,
    version,
}) => flattenBinArray([
    numberToBinUintLE(0), // Won't WORK!
    // numberToBinUint32LE(version),

    hashPrevouts({ sha256, signingSerializationType, transactionOutpoints }),

    hashAmounts({ sha256, signingSerializationType, transactionAmounts }),

    hashSequence({
        sha256,
        signingSerializationType,
        transactionSequenceNumbers,
    }),

    // outpointTransactionHash.slice().reverse(),
    // numberToBinUint32LE(outpointIndex),

    bigIntToBitcoinVarInt(BigInt(coveredBytecode.length)),
    coveredBytecode,

    // outputValue,
    // numberToBinUint32LE(sequenceNumber),

    hashOutputs({
        correspondingOutput,
        sha256,
        signingSerializationType,
        transactionOutputs,
    }),

    numberToBinUint32LE(locktime),

    signingSerializationType,
    // forkId,
])
