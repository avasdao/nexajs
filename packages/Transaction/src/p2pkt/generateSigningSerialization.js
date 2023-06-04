import {
    bigIntToBitcoinVarInt,
    flattenBinArray,
    numberToBinUintLE,
    numberToBinUint32LE,
} from '@bitauth/libauth'

import { OP } from '@nexajs/script'

import {
    hashPrevouts,
    hashAmounts,
    hashSequence,
    hashOutputs,
} from './signing-serialization.js'

const altLockScriptBin = new Uint8Array([
    OP.FROMALTSTACK,
    OP.CHECKSIGVERIFY,
])

/**
 * Serialize the signature-protected properties of a transaction following the
 * algorithm required by the `signingSerializationType` of a signature.
 *
 * Note: This implementation re-computes all hashes each time it is called. A
 * performance-critical application could instead use memoization to avoid
 * re-computing these values when validating many signatures within a single
 * transaction. See BIP143 for details.
 */
export default ({
    correspondingOutput,
    // coveredBytecode, // NOT USED WITH P2PKT
    locktime,
    outpointIndex,  // NOT USED WITH P2PKT
    outpointTransactionHash,  // NOT USED WITH P2PKT
    outputValue,  // NOT USED WITH P2PKT
    sequenceNumber,  // NOT USED WITH P2PKT
    sha256,
    signingSerializationType,
    transactionOutpoints,
    transactionOutputs,
    transactionAmounts,
    transactionSequenceNumbers,
    version,  // NOT USED WITH P2PKT
}) => new Uint8Array([
    numberToBinUintLE(0), // NOTE: Doesn't work w/ flattenBinArray

    ...hashPrevouts({ sha256, signingSerializationType, transactionOutpoints }),

    ...hashAmounts({ sha256, signingSerializationType, transactionAmounts }),

    ...hashSequence({
        sha256,
        signingSerializationType,
        transactionSequenceNumbers,
    }),

    bigIntToBitcoinVarInt(BigInt(altLockScriptBin.length)),
    ...altLockScriptBin,

    ...hashOutputs({
        correspondingOutput,
        sha256,
        signingSerializationType,
        transactionOutputs,
    }),

    ...numberToBinUint32LE(locktime),

    // signingSerializationType,
    numberToBinUintLE(0),
])
