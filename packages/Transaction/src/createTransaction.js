/* Import modules. */
import createDataOutput from './p2pkt/createDataOutput.js'
import createTransaction from './p2pkt/createTransaction.js'
import createValueOutput from './p2pkt/createValueOutput.js'
// import createDataOutput from './p2pkh/createDataOutput.js'
// import createTransaction from './p2pkh/createTransaction.js'
// import createValueOutput from './p2pkh/createValueOutput.js'

/**
 * Create a Nexa Transaction
 *
 * This will construct a Nexa transaction.
 *
 * @function
 *
 * @param _wif    {string}                     Private Key in WIF format.
 * @param _unspents   {AddressListUnspentResponse} List of Unspent Outputs to use.
 * @param _receivers  {string}                     Nexa receiving address.
 * @param _minerFee {number}                     The satoshis to pay as miner fee (deducted from value output).
 *
 * @returns {Uint8Array} The transaction binary.
 */
export default async (
    _wif,
    _unspents,
    _receivers,
    _minerFee,
) => {
    /* Calculate the total balance of the unspent outputs. */
    const unspentSatoshis = _unspents
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
        )

    /* Initialize an empty list of outputs. */
    const outputs = []

    /* Handle receivers. */
    for (let i = 0; i < _receivers.length; i++) {
        /* Set receiver. */
        const receiver = _receivers[i]
        // console.log('RECEIVER', receiver)

        /* Handle value output. */
        if (receiver.address) {
            /* Add the value output. */
            // NOTE: Miner fee is deducted from output value.
            outputs
                .push(
                    await createValueOutput(
                        receiver.address,
                        (unspentSatoshis - _minerFee) // FIXME Allow user-defined amount.
                    )
                )
        }

        /* Handle data output. */
        if (receiver.data) {
            /* Add the data output. */
            // NOTE: Miner fee is deducted from output value.
            outputs.push(await createDataOutput(receiver.data))
        }
    }
    // console.log('\nOUTPUTS', outputs)

    /* Create the initial transaction to estimate miner fee. */
    const transaction = await createTransaction(
        _wif,
        _unspents,
        outputs
    )

    /* Return the transaction. */
    return transaction
}
