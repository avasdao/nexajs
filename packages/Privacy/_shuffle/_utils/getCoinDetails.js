/* Import core modules. */
const debug = require('debug')('shuffle:utils:getcoindata')
const Nito = require('nitojs')

/**
 * Get Coin Details
 *
 * Retrieves the full coin details, given a transaction id
 * and an output index.
 */
const getCoinDetails = async function (_txid, _vout) {
    /* Set transaction id. */
    const txid = _txid
    debug('Retrieving coin data for txid:', txid)

    /* Validate transaction id. */
    if (!txid) {
        throw new Error(`Invalid transaction id [ ${txid} ]`)
    }

    /* Validate output index. */
    const vout = Number(_vout)
    debug('Output index is:', vout)

    /* Set verbose flag. */
    const verbose = true

    /* Request transaction data. */
    const txData = await Nito.Transaction
        .getRawTransaction(txid, verbose)
        .catch(err => {
            /* eslint-disable-next-line no-console */
            console.error('Something went wrong fetching transaction data.', err.message)
            throw new Error(err)
        })
    debug('Retrieved transaction data:', txData)

    /* Set outputs. */
    const outputs = txData.outputs

    /* Set coin in question. */
    const coinInQuestion = outputs[vout]
    debug('Coin in question:', coinInQuestion)

    /* Validate coin in question. */
    if (!coinInQuestion) {
        throw new Error('Could not find a coin from the params provided.')
    }

    /* Set script. */
    const script = coinInQuestion.script

    /* Set cash address. */
    const cashAddress = Nito.Address.toCashAddress(script)

    /* Set legacy address. */
    const legacyAddress = Nito.Address.toLegacyAddress(script)

    /* Set compatibility flag. */
    // NOTE: Provides BITBOX data format.
    const comp = true

    /* Request UTXO data. */
    const utxoData = await Nito.Address
        .utxo(cashAddress, comp)
        .catch(err => {
            /* eslint-disable-next-line no-console */
            console.error('Something went wrong fetching UTXO data:', err.message)
            throw new Error(err)
        })
    debug('Retrieved UTXO data:', utxoData)

    /* Set UTXOs. */
    const utxos = utxoData.utxos

    /* Set output in question. */
    const outputInQuestion = utxos.find(utxo => {
        return (utxo.txid === txid && Number(utxo.vout) === vout)
    })
    debug('Output in question:', outputInQuestion)

    /* Set coin data. */
    const coinData = {
        txid,
        vout,
        legacyAddress,
        cashAddress,
        script,
        spent: !outputInQuestion
    }

    /* Validate output in question. */
    if (outputInQuestion) {
        Object.assign(coinData, {
            amount: outputInQuestion.amount,
            satoshis: Number(outputInQuestion.satoshis),
            height: outputInQuestion.height,
            // confirmations: outputInQuestion.confirmations,
            // confirmations: 1, // FIXME: Any side-effects? Do we need to retrieve this value??
        })
    }
    debug('Coin data:', coinData)

    /* Return coin data. */
    return coinData
}

/* Export module. */
module.exports = getCoinDetails
