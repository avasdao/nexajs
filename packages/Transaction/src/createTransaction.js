/* Import modules. */
import createDataOutput from './p2pkt/createDataOutput.js'
import createTokenOutput from './p2pkt/createTokenOutput.js'
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
 * @param _wifs    {string}                     Private Key in WIF format.
 * @param _unspents   {AddressListUnspentResponse} List of Unspent Outputs to use.
 * @param _receivers  {string}                     Nexa receiving address.
 *
 * @returns {Uint8Array} The transaction binary.
 */
export default async (
    _wifs,
    _unspents,
    _receivers,
    _locktime,
    _lockingScript,
    _unlockingScript,
) => {
    /* Initialize an empty list of outputs. */
    const outputs = []

    /* Handle receivers. */
    for (let i = 0; i < _receivers.length; i++) {
        /* Set receiver. */
        const receiver = _receivers[i]
        // console.log('RECEIVER', receiver)

        /* Handle token output. */
        if (receiver.tokenid) {
            /* Add the value output. */
            // NOTE: Miner fee is deducted from output value.
            outputs.push(
                await createTokenOutput(
                    receiver.address,
                    receiver.satoshis,
                    receiver.tokenid,
                    receiver.tokens,
                )
            )
        } else if (receiver.address) {
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
    // FIXME: We must add current block height as a 4th method param.
    const transaction = await createTransaction(
        _wifs,
        _unspents,
        outputs,
        _locktime,
        _lockingScript,
        _unlockingScript,
    )

    /* Return the transaction. */
    return transaction
}
