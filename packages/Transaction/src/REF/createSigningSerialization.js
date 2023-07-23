/* Import modules. */
import {
    bigIntToBinUint64LE,
    // createTransactionContextCommon,
    // generateSigningSerializationBCH,
    instantiateSha256,
} from '@bitauth/libauth'

import createTransactionContextCommon from './createTransactionContextCommon.js'
// import generateSigningSerialization from '../p2pkh/generateSigningSerialization.js'
import generateSigningSerialization from '../p2pkt/generateSigningSerialization.js'


/**
 * Create the signing serialization for a given transaction input.
 *
 * @function
 *
 * @param transaction        {Transaction} The transaction to use.
 * @param satoshis           {number}      The input's satoshi value.
 * @param inputIndex         {number}      Input index to sign.
 * @param coveredBytecodeBin {Uint8Array}  The input's locking script.
 * @param hashtype           {number}      Hash type to use for signing serialization.
 *
 * @returns {Promise<Uint8Array>}	The signing serialization.
 */
export default async (
    transaction,
    satoshis,
    inputIndex,
    // coveredBytecodeBin,
    hashtype,
) => {
    // NOTE: A signing serialization are the parts of the transaction that should be signed based on a given sighash type.
    //       Note that the input being spent must also be included in this serialization.
    //       For more details, see: https://documentation.cash/protocol/blockchain/transaction/transaction-signing

    const ctxCommon = {
        inputIndex,
        sourceOutput: { satoshis: bigIntToBinUint64LE(satoshis) },
        spendingTransaction: transaction,
    }

    // Create a "transaction state", used to extract a lot of the relevant information with Libauth.
    const state = createTransactionContextCommon(ctxCommon)

    // Generate the signing serialization using mostly information from the generated "transaction state".
    const signingSerialization = generateSigningSerialization({
        correspondingOutput: state.correspondingOutput,
        // coveredBytecode: coveredBytecodeBin, // NOT USED WITH P2PKT
        locktime: state.locktime,
        // outpointIndex: state.outpointIndex,
        // outpointTransactionHash: state.outpointTransactionHash,
        outputValue: state.outputValue,
        sequenceNumber: state.sequenceNumber,
        sha256: await instantiateSha256(),
        signingSerializationType: new Uint8Array([ hashtype ]),
        transactionOutpoints: state.transactionOutpoints,
        transactionOutputs: state.transactionOutputs,
        transactionAmounts: state.transactionAmounts,
        transactionSequenceNumbers: state.transactionSequenceNumbers,
        // version: 0,
    })

    return signingSerialization
}
