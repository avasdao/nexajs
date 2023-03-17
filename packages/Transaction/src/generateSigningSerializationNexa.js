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

import Opcodes from './utils/Opcodes.js'

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
// }) => flattenBinArray([
}) => {
    const altLockScriptBin = new Uint8Array([
        Opcodes.OP_FROMALTSTACK,
        Opcodes.OP_CHECKSIGVERIFY
    ])
    console.log('\n  (ALT) Lock Script Bin:\n', altLockScriptBin)

    return new Uint8Array([
        numberToBinUintLE(0), // Doesn't work w/ flattenBinArray
        // numberToBinUint32LE(version),

        ...hashPrevouts({ sha256, signingSerializationType, transactionOutpoints }),

        ...hashAmounts({ sha256, signingSerializationType, transactionAmounts }),

        ...hashSequence({
            sha256,
            signingSerializationType,
            transactionSequenceNumbers,
        }),

        // outpointTransactionHash.slice().reverse(),
        // numberToBinUint32LE(outpointIndex),

        // bigIntToBitcoinVarInt(BigInt(coveredBytecode.length)),
        // ...coveredBytecode,
        bigIntToBitcoinVarInt(BigInt(altLockScriptBin.length)),
        ...altLockScriptBin,

        // outputValue,
        // numberToBinUint32LE(sequenceNumber),

        ...hashOutputs({
            correspondingOutput,
            sha256,
            signingSerializationType,
            transactionOutputs,
        }),

        ...numberToBinUint32LE(locktime),

        // signingSerializationType,
        numberToBinUintLE(0),
        // forkId,
    ])
}
