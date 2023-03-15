/* Import modules. */
import createTransaction from './createP2PKTTransaction.js'
import createValueOutput from './createP2PKTValueOutput.js'

/**
 * Create a Nexa Transaction
 *
 * This will construct a Nexa transaction.
 *
 * @function
 *
 * @param privateKeyWIF    {string}                     Private Key in WIF format.
 * @param unspentOutputs   {AddressListUnspentResponse} List of Unspent Outputs to use.
 * @param receiverAddress  {string}                     Nexa receiving address.
 * @param minerFeeSatoshis {number}                     The satoshis to pay as miner fee (deducted from value output).
 *
 * @returns {Uint8Array} The transaction binary.
 */
export default async (
    privateKeyWIF,
    unspentOutputs,
    receiverAddress,
    minerFeeSatoshis,
) => {
    /* Calculate the total balance of the unspent outputs. */
    const unspentSatoshis = unspentOutputs
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.value), 0
        )

    /* Initialize an empty list of outputs. */
    const outputs = []

    /* Add the value output. */
    // NOTE: Miner fee is deducted from output value.
    outputs
        .push(
            await createValueOutput(
                receiverAddress,
                (unspentSatoshis - minerFeeSatoshis)
            )
        )
    // console.log('Outputs:', outputs)

    /* Create the initial transaction to estimate miner fee. */
    const transaction = await createTransaction(
        privateKeyWIF,
        unspentOutputs,
        outputs
    )

    /* Return the transaction. */
    return transaction
}
