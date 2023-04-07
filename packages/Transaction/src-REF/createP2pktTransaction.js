/* Import modules. */
import { binToHex } from '@bitauth/libauth'

import encodeTransaction from './encodeTransaction.js'
import createUnsignedInput from './createUnsignedInput.js'
import unlockP2PktInput from './unlockP2pktInput.js'

import { parseWif } from '@nexajs/hdnode'

/**
 * Create a transaction.
 *
 * @function
 *
 * @param privateKeyWif  {string}                     Private Key in WIF format.
 * @param unspentOutputs {AddressListUnspentResponse} Prefix (in hex) to precede data.
 * @param outputs        {Array<Output>}              Array of outputs to include in transaction.
 *
 * @returns {Promise<Output>}	The OP_RETURN output script.
 */
export default async (privateKeyWif, unspentOutputs, outputs) => {
    // Parse the private key wif into the keypair and address.
    const [
        privateKey,
        publicKey,
        returnAddress
    ] = await parseWif(privateKeyWif)
    console.log('privateKeyWif', {
        privateKey,
        publicKey,
        returnAddress
    })

    // NOTE: Convert all coins to the Libauth Input format (unsigned).
    const inputs = [ ...unspentOutputs ].map(createUnsignedInput)

    /* Assemble the unsigned transaction. */
    // see: https://spec.nexa.org/protocol/blockchain/transaction
    const transaction = {
        version: 0,
        inputs,
        outputs,
        locktime: 0, // FIXME: We must add current block height as a new method param
    }
    // console.log('Unsigned (encoded) tx:', binToHex(encodeTransaction(transaction)))

    // Sign all inputs and add the generated unlocking scripts to the transaction.
    // eslint-disable-next-line require-atomic-updates
    transaction.inputs = await Promise.all(
        transaction.inputs.map(
            (input, inputIndex) => unlockP2PktInput(
                transaction,
                input,
                inputIndex,
                privateKey,
                publicKey,
                returnAddress,
            )
        )
    )
    console.log('  \nSigned transaction:', transaction, '\n')
    // console.log('Signed transaction (inputs):', transaction.inputs)
    // console.log('Signed transaction (outputs):', transaction.outputs)

    // Hex encode the built transaction.
    const encodedTransaction = encodeTransaction(transaction) // FIXME Prepend (0) version.

    // Return the encoded transaction.
    return encodedTransaction
}
