import { OP } from '@nexajs/script'

import {
    flattenBinArray,
    numberToBinUint32LE,
    bigIntToBinUint64LE,
} from '@bitauth/libauth'

/**
 * Encode a single output for inclusion in an encoded transaction.
 *
 * @param output - the output to encode
 */
const encodeOutput = (_output) => {
    /* Initialize locals. */
    let version

    /* Handle version selection. */
    if (_output.lockingBytecode[1] === OP.RETURN) {
        version = new Uint8Array([0]) // v0
    } else {
        version = new Uint8Array([1]) // v1
    }

    return new Uint8Array([
        version,
        ..._output.amount,
        ..._output.lockingBytecode,
    ])
}

/**
 * Get the hash of all outpoints in a series of inputs. (For use in
 * `hashTransactionOutpoints`.)
 *
 * @param inputs - the series of inputs from which to extract the outpoints
 * @param sha256 - an implementation of sha256
 */
const encodeOutpoints = (inputs) =>
    flattenBinArray(
        inputs.map((i) =>
            new Uint8Array([
                0,
                ...i.outpointTransactionHash.slice().reverse(),
            ])
        )
    )

/**
 * Encode an array of transaction outputs for use in transaction signing
 * serializations.
 *
 * @param outputs - the array of outputs to encode
 */
const encodeOutputsForSigning = (outputs) =>
    flattenBinArray(outputs.map(encodeOutput))

/**
 * Encode an array of input amounts for use in transaction signing
 * serializations.
 *
 * @param inputs - the array of inputs from which to extract the amounts
 * numbers
 */
const encodeAmountsForSigning = (inputs) =>
    flattenBinArray(
        inputs.map((i) => bigIntToBinUint64LE(BigInt(i.satoshis)))
    )

/**
 * Encode an array of input sequence numbers for use in transaction signing
 * serializations.
 *
 * @param inputs - the array of inputs from which to extract the sequence
 * numbers
 */
const encodeSequenceNumbersForSigning = (inputs) =>
    flattenBinArray(
        inputs.map((i) => numberToBinUint32LE(i.sequenceNumber))
    )


export default (program) => ({
    correspondingOutput:
        program.inputIndex < program.spendingTransaction.outputs.length
            ? encodeOutput(program.spendingTransaction.outputs[program.inputIndex])
            : undefined,

    locktime: program.spendingTransaction.locktime,

    outpointIndex:
        program.spendingTransaction.inputs[program.inputIndex].outpointIndex,

    outpointTransactionHash:
        program.spendingTransaction.inputs[program.inputIndex]
            .outpointTransactionHash,

    outputValue: program.sourceOutput.amount,

    sequenceNumber:
        program.spendingTransaction.inputs[program.inputIndex].sequenceNumber,

    transactionOutpoints: encodeOutpoints(program.spendingTransaction.inputs),

    transactionOutputs: encodeOutputsForSigning(
        program.spendingTransaction.outputs
    ),

    transactionAmounts: encodeAmountsForSigning(
        program.spendingTransaction.inputs
    ),

    transactionSequenceNumbers: encodeSequenceNumbersForSigning(
        program.spendingTransaction.inputs
    ),

    version: program.spendingTransaction.version,
})
