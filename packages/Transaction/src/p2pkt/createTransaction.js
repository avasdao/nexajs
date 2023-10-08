/* Import (library) modules. */
import { parseWif } from '@nexajs/hdnode'

import { binToHex } from '@nexajs/utils'

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
export default async (
    _privateKeyWifs,
    _unspentOutputs,
    _outputs,
    _locktime,
    _lockingScript,
    _unlockingScript,
) => {
    /* Initialize WIFs. */
    const wifs = []

    /* Handle WIFs. */
    for (let i = 0; i < _privateKeyWifs.length; i++) {
        /* Set WIF. */
        const wif = _privateKeyWifs[i]

        /* Validate array. */
        if (Array.isArray(_privateKeyWifs[0])) {
            for (let j = 0; j < wif.length; j++) {
                if (!wif[j]) {
                    continue
                }

                /* Parse the WIF into the keypair. */
                const {
                    address,
                    privateKey,
                    publicKey,
                } = await parseWif(wif[j], 'nexa', 'TEMPLATE')

                if (!wifs[i]) {
                    wifs[i] = []
                }

                wifs[i].push({
                    privateKey,
                    publicKey,
                    // address,
                })
            }
        } else {
            /* Parse the WIF into the keypair and address. */
            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(wif, 'nexa', 'TEMPLATE')

            wifs.push({
                privateKey,
                publicKey,
                // address,
            })
        }
    }

    // NOTE: Convert all coins to the Libauth Input format (unsigned).
    const inputs = [ ..._unspentOutputs ].map(createUnsignedInput)

    /* Assemble the unsigned transaction. */
    // see: https://spec.nexa.org/protocol/blockchain/transaction
    const transaction = {
        version: 0,
        inputs,
        outputs: _outputs,
        locktime: _locktime,
    }
    // console.log('Unsigned (encoded) tx:', binToHex(encodeTransaction(transaction)))
// FIXME FOR DEV PURPOSES ONLY
const redeemScript = '522102bd13fc253edbcbcbfa1c21b7ba63336c30dbd3b51bdb4deb3e28547d7c1dd4762103802a8952f26f69fdd2301c7f91571f56165ba8af5dc0f5272ae23af226774856210293112f13c7295880317a16e8b8552e8d5d3fc9ff28bdade2e9532ffa063928cd53af'
    if (Array.isArray(_privateKeyWifs[0])) {
        // Sign all inputs and add the generated unlocking scripts to the transaction.
        // eslint-disable-next-line require-atomic-updates
        transaction.inputs = await Promise.all(
            transaction.inputs.map(
                (input, inputIndex) => unlockInputMulti(
                    transaction,
                    input,
                    inputIndex,
                    wifs[inputIndex].map(_wif => {
                        return _wif.privateKey
                    }),
                    redeemScript,
                    _lockingScript,
                    _unlockingScript,
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
                    _lockingScript,
                    _unlockingScript,
                )
            )
        )
    }

    /* Encode the built transaction. */
    const encodedTransaction = encodeTransaction(transaction)

    /* Return the encoded transaction. */
    return encodedTransaction
}
