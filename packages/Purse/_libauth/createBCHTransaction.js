/* Import modules. */
import createTransaction from './createTransaction'
import createValueOutput from './createValueOutput'

/**
 * Create a Cash Bridging Transaction.
 *
 * This is a transaction from the user's front end temporary Cash wallet to the backend receiving Cash wallet with an OP_RETURN to indicate the user's desired Smart Payout Address.
 *
 * Note that the user covers the fee for this transaction.
 *
 * @function
 *
 * @param privateKeyWIF    {string}                     Private Key in WIF format.
 * @param unspentOutputs   {AddressListUnspentResponse} List of Unspent Outputs to use.
 * @param receiverAddress  {string}                     Cash receiving address.
 * @param minerFeeSatoshis {number}                     The satoshis to pay as miner fee (deducted from value output).
 *
 * @returns {Uint8Array} The transaction binary.
 */
const createBCHTransaction = async (
    privateKeyWIF,
    unspentOutputs,
    receiverAddress,
    minerFeeSatoshis,
) => {
    // Make sure the Bridge Address is a valid Cash Address.
    // if (!await isValidCashAddress(receiverAddress)) {
    //     throw new Error(`Invalid Cash Bridge Address given (${receiverAddress}).`)
    // }

    // Calculate the total balance of the unspent outputs.
    const unspentSatoshis = unspentOutputs
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.value), 0
        )

    // Initialize an empty list of outputs.
    // NOTE: The order of the outputs we add to this is important and should be OP_RETURN, Value and Optional Change.
    const outputs = []

    // Add the value output (note that miner fee is deducted from output value).
    outputs
        .push(
            await createValueOutput(receiverAddress, unspentSatoshis - minerFeeSatoshis)
        )

    // Create the initial transaction to estimate miner fee.
    const transaction = await createTransaction(privateKeyWIF, unspentOutputs, outputs)

    // Return the transaction.
    return transaction
}

/* Export module. */
export default createBCHTransaction
