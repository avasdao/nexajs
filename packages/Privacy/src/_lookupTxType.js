/**
 * Lookup Transaction Type
 */
export default {
    'CB': `Coinbase transaction`,
    'N1': `Transaction with just 1 output (either a sweep to another address by the same owner, or a transfer using a "send everything I have" option)`,
    'N2': `Transaction with 2 outputs — most common in wallets — where one of the outputs is the recipient, and the other one is the change address`,
    'NN': `Transaction with more than 2 outputs — most common in exchanges and services that use payout batching`,
}
