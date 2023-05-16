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
            outputs.push(
                await createValueOutput(
                    receiver.address,
                    receiver.satoshis,
                )
            )
        }

        /* Handle data output. */
        if (receiver.data) {
            /* Add the data output. */
            // NOTE: Miner fee is deducted from output value.
            outputs.push(
                await createDataOutput(receiver.data)
            )
        }
    }
    // console.log('\nOUTPUTS', outputs)

    // TODO Add (miner) fee check. If greater than dust (546),
    //      then send back to WIF address.

    /* Create the initial transaction to estimate miner fee. */
    const transaction = await createTransaction(
        _wif,
        _unspents,
        outputs
    )

    /* Return the transaction. */
    return transaction
}
