/* Import modules. */
import createTransaction from './createP2PKTTransaction.js'
import createValueOutput from './createP2PKTValueOutput.js'

/**
 * Create a Nexa Bridging Transaction.
 *
 * This is a transaction from the user's front end temporary Nexa wallet to the backend receiving Nexa wallet with an OP_RETURN to indicate the user's desired Smart Payout Address.
 *
 * Note that the user covers the fee for this transaction.
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
    console.error('NEXA TRANSACTION')
    // Make sure the Bridge Address is a valid Nexa Address.
    // if (!await isValidNexaAddress(receiverAddress)) {
    //     throw new Error(`Invalid Nexa Bridge Address given (${receiverAddress}).`)
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
