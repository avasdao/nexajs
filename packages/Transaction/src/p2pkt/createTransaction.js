/* Import modules. */
import { binToHex } from '@bitauth/libauth'

/* Import (library) modules. */
import { parseWif } from '@nexajs/hdnode'

/* Import (local) modules. */
import encodeTransaction from '../REF/encodeTransaction.js'
import createUnsignedInput from '../REF/createUnsignedInput.js'
import unlockInput from './unlockInput.js'
import unlockInputMulti from './unlockInputMulti.js'


/**
 * Create a transaction.
 *
 * @function
 *
 * @param privateKeyWifs  {string}                     Private Key in WIF format.
 * @param unspentOutputs {AddressListUnspentResponse} Prefix (in hex) to precede data.
 * @param outputs        {Array<Output>}              Array of outputs to include in transaction.
 *
 * @returns {Promise<Output>}	The OP_RETURN output script.
 */
export default async (privateKeyWifs, unspentOutputs, outputs) => {
    const wifs = []

    for (let i = 0; i < privateKeyWifs.length; i++) {
        /* Set WIF. */
        const wif = privateKeyWifs[i]

        if (Array.isArray(wifs[0])) {
            /* Parse the WIF into the keypair and address. */
            const [
                privateKey,
                publicKey,
                returnAddress
            ] = await parseWif(wif, 'nexa', 'TEMPLATE')

            wifs.push({
                privateKey,
                publicKey,
                returnAddress,
            })
        } else {
            /* Parse the WIF into the keypair and address. */
            const [
                privateKey,
                publicKey,
                returnAddress
            ] = await parseWif(wif, 'nexa', 'TEMPLATE')

            wifs.push({
                privateKey,
                publicKey,
                returnAddress,
            })
        }
    }

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

    if (Array.isArray(wifs[0])) {
        // Sign all inputs and add the generated unlocking scripts to the transaction.
        // eslint-disable-next-line require-atomic-updates
        transaction.inputs = await Promise.all(
            transaction.inputs.map(
                (input, inputIndex) => unlockInputMulti(
                    transaction,
                    input,
                    inputIndex,
                    wifs[inputIndex],
                    wifs[inputIndex],
                )
            )
        )
    } else {
        // Sign all inputs and add the generated unlocking scripts to the transaction.
        // eslint-disable-next-line require-atomic-updates
        transaction.inputs = await Promise.all(
            transaction.inputs.map(
                (input, inputIndex) => unlockInput(
                    transaction,
                    input,
                    inputIndex,
                    wifs[inputIndex].privateKey,
                    wifs[inputIndex].publicKey,
                    wifs[inputIndex].returnAddress,
                )
            )
        )
    }

    // Hex encode the built transaction.
    const encodedTransaction = encodeTransaction(transaction) // FIXME Prepend (0) version.

    // Return the encoded transaction.
    return encodedTransaction
}
