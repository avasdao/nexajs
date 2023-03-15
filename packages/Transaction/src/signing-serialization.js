import {
    bigIntToBitcoinVarInt,
    flattenBinArray,
    numberToBinUint32LE,
} from '@bitauth/libauth'

/**
 * A.K.A. `sighash` flags
 */
export const SigningSerializationFlag = {
    /**
     * A.K.A. `SIGHASH_ALL`
     */
    allOutputs: 0x01,

    /**
     * A.K.A `SIGHASH_NONE`
     */
    noOutputs: 0x02,

    /**
     * A.K.A. `SIGHASH_SINGLE`
     */
    correspondingOutput: 0x03,
    forkId: 0x40,

    /**
     * A.K.A `ANYONE_CAN_PAY`
     */
    singleInput: 0x80,
}

const Internal = {
    mask5Bits: 0b11111,
    sha256HashByteLength: 32,
}

export const isDefinedSigningSerializationType = (byte) => {
    const baseType =
        // eslint-disable-next-line no-bitwise
        byte &
        // eslint-disable-next-line no-bitwise
        ~(SigningSerializationFlag.forkId | SigningSerializationFlag.singleInput)

    return (
        baseType >= SigningSerializationFlag.allOutputs &&
        baseType <= SigningSerializationFlag.correspondingOutput
    )
}

const match = (type, flag) =>
    // eslint-disable-next-line no-bitwise
    (type[0] & flag) !== 0

const equals = (
    type,
    flag
    // eslint-disable-next-line no-bitwise
) => (type[0] & Internal.mask5Bits) === flag

const shouldSerializeSingleInput = (type) =>
    match(type, SigningSerializationFlag.singleInput)

const shouldSerializeCorrespondingOutput = (type) =>
    equals(type, SigningSerializationFlag.correspondingOutput)

const shouldSerializeNoOutputs = (type) =>
    equals(type, SigningSerializationFlag.noOutputs)

const emptyHash = () =>
    new Uint8Array(Internal.sha256HashByteLength).fill(0)

/**
 * Return the proper `hashPrevouts` value for a given a signing serialization
 * type.
 * @param signingSerializationType - the signing serialization type to test
 * @param transactionOutpoints - see `generateSigningSerializationNexa`
 */
export const hashPrevouts = ({
    sha256,
    signingSerializationType,
    transactionOutpoints
}) => sha256.hash(sha256.hash(transactionOutpoints))

/**
 * Return the proper `hashAmounts` value for a given a signing serialization
 * type.
 * @param signingSerializationType - the signing serialization type to test
 * @param amount - see `generateSigningSerializationNexa`
 */
export const hashAmounts = ({
    sha256,
    signingSerializationType,
    transactionAmounts
}) => sha256.hash(sha256.hash(transactionAmounts))

/**
 * Return the proper `hashSequence` value for a given a signing serialization
 * type.
 * @param signingSerializationType - the signing serialization type to test
 * @param transactionSequenceNumbers - see
 * `generateSigningSerializationNexa`
 */
export const hashSequence = ({
    sha256,
    signingSerializationType,
    transactionSequenceNumbers
}) => sha256.hash(sha256.hash(transactionSequenceNumbers))

/**
 * Return the proper `hashOutputs` value for a given a signing serialization
 * type.
 * @param signingSerializationType - the signing serialization type to test
 * @param transactionOutputs - see `generateSigningSerializationNexa`
 * @param correspondingOutput - see `generateSigningSerializationNexa`
 */
export const hashOutputs = ({
    correspondingOutput,
    sha256,
    signingSerializationType,
    transactionOutputs
}) => sha256.hash(sha256.hash(transactionOutputs))

/**
 * Serialize the signature-protected properties of a transaction following the
 * algorithm required by the `signingSerializationType` of a signature.
 *
 * Note: this implementation re-computes all hashes each time it is called. A
 * performance-critical application could instead use memoization to avoid
 * re-computing these values when validating many signatures within a single
 * transaction. See BIP143 for details.
 */
export const generateSigningSerializationNexa = ({
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
    transactionSequenceNumbers,
    version
}) =>
    flattenBinArray([
        numberToBinUint32LE(version),
        hashPrevouts({ sha256, signingSerializationType, transactionOutpoints }),
        hashSequence({
            sha256,
            signingSerializationType,
            transactionSequenceNumbers,
        }),
        outpointTransactionHash.slice().reverse(),
        numberToBinUint32LE(outpointIndex),
        bigIntToBitcoinVarInt(BigInt(coveredBytecode.length)),
        coveredBytecode,
        outputValue,
        numberToBinUint32LE(sequenceNumber),
        hashOutputs({
            correspondingOutput,
            sha256,
            signingSerializationType,
            transactionOutputs,
        }),
        numberToBinUint32LE(locktime),
        signingSerializationType,
        forkId,
    ])

/**
 * @param signingSerializationType - the 32-bit number indicating the signing
 * serialization algorithm to use
 */
export const isLegacySigningSerialization = ({
    signingSerializationType
}) => {
    // eslint-disable-next-line no-bitwise, @typescript-eslint/no-magic-numbers
    const forkValue = signingSerializationType >> 8

    // eslint-disable-next-line no-bitwise, @typescript-eslint/no-magic-numbers
    const newForkValue = (forkValue ^ 0xdead) | 0xff0000

    // eslint-disable-next-line no-bitwise, @typescript-eslint/no-magic-numbers
    const sighashType = (newForkValue << 8) | (signingSerializationType & 0xff)

    // eslint-disable-next-line no-bitwise
    return (sighashType & SigningSerializationFlag.forkId) === 0
}
