/* Import modules. */
import { parseWif } from '@nexajs/hdnode'
import { binToHex } from '@nexajs/utils'

/* Import (local) modules. */
import encodeTransaction from '../shared/encodeTransaction.js'
import createUnsignedInput from '../shared/createUnsignedInput.js'
import unlockP2PKHInput from './unlockInput.js'

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
    const {
        privateKey,
        publicKey,
        // address
    } = await parseWif(privateKeyWIF, 'nexa', 'P2PKH')

    // FIXME FOR DEV PURPOSES ONLY
    const address = 'nexa:qqf2mwpynv8f26v53sqcaldvwujt9fuu5sdw3yxjl3'

    // Convert all coins to the Libauth Input format (unsigned)
    const inputs = [ ...unspentOutputs ].map(createUnsignedInput)

    // Assemble the unsigned transaction.
    const transaction = {
        version: 0,
        inputs,
        outputs,
        locktime: 0,
    }
    console.log('UNSIGNED TRANSACTION', JSON.parse(JSON.stringify(transaction)))
    // console.log('UNSIGNED TRANSACTION (encoded):', encodeTransaction(transaction))
    // console.log('UNSIGNED TRANSACTION (encoded) (hex):', binToHex(encodeTransaction(transaction)))

    // Sign all inputs and add the generated unlocking scripts to the transaction.
    // eslint-disable-next-line require-atomic-updates
    transaction.inputs = await Promise.all(
        transaction.inputs.map(
            (input, inputIndex) => unlockP2PKHInput(
                transaction,
                input,
                inputIndex,
                privateKey,
                publicKey,
                address,
            )
        )
    )
    // console.log('\n\nSIGNED TRANSACTION', transaction)
    // console.log('\n\nSIGNED TRANSACTION (inputs):', transaction.inputs)
    // console.log('\n\nSIGNED TRANSACTION (outpointTransactionHash):', binToHex(transaction.inputs[0].outpointTransactionHash))
    // console.log('\n\nSIGNED TRANSACTION (unlockingBytecode):', binToHex(transaction.inputs[0].unlockingBytecode))
    console.log('\n\nSIGNED TRANSACTION (outputs):', transaction.outputs)

    // Hex encode the built transaction.
    const encodedTransaction = encodeTransaction(transaction)

    // Return the encoded transaction.
    return encodedTransaction
}
