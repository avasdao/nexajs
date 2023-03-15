/* Import modules. */
import { binToHex } from '@bitauth/libauth'

import encodeTransaction from './encodeTransaction.js'
import createUnsignedInput from './createUnsignedInput.js'
import unlockP2PKTInput from './unlockP2pktInput.js'

import parseWIF from './address/parseWIF.js'

/**
 * Create a transaction.
 *
 * @function
 *
 * @param privateKeyWIF  {string}                     Private Key in WIF format.
 * @param unspentOutputs {AddressListUnspentResponse} Prefix (in hex) to precede data.
 * @param outputs        {Array<Output>}              Array of outputs to include in transaction.
 *
 * @returns {Promise<Output>}	The OP_RETURN output script.
 */
export default async (privateKeyWIF, unspentOutputs, outputs) => {
    // Parse the private key wif into the keypair and address.
    const [
        privateKey,
        publicKey,
        returnAddress
    ] = await parseWIF(privateKeyWIF)

    // NOTE: Convert all coins to the Libauth Input format (unsigned).
    const inputs = [ ...unspentOutputs ].map(createUnsignedInput)

    // Assemble the unsigned transaction.
    const transaction = {
        version: 0,
        inputs,
        outputs,
        locktime: 0,
    }
    console.log('Unsigned (encoded) tx:', binToHex(encodeTransaction(transaction)))

    // Sign all inputs and add the generated unlocking scripts to the transaction.
    // eslint-disable-next-line require-atomic-updates
    transaction.inputs = await Promise.all(
        transaction.inputs.map(
            (input, inputIndex) => unlockP2PKTInput(
                transaction,
                input,
                inputIndex,
                privateKey,
                publicKey,
                returnAddress,
            )
        )
    )
    console.log('Signed transaction:', transaction)
    console.log('Signed transaction (inputs):', transaction.inputs)

    // Hex encode the built transaction.
    const encodedTransaction = encodeTransaction(transaction) // FIXME Prepend (0) version.

    // Return the encoded transaction.
    return encodedTransaction
}
