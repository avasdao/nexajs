/* Import modules. */
const Address = require('..').Address
const bch = require('bitcore-lib-cash')
const debug = require('debug')('nitojs:transaction:sendcoin')
const Transaction = require('.')

/* Set dust (amount) satoshis. */
const DUST_SATOSHIS = 546

/**
 * Send Coin
 *
 * Simple coin sending to one or more receipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 */
const sendCoin = async (_coin, _receivers, _autoFee = true) => {
    debug('Sending coin', _coin, _receivers)
    // console.log('Sending coin', _coin, _receivers)

    /* Initialize coin. */
    let coin

    /* Initialize receivers. */
    let receivers

    /* Validate coin. */
    if (_coin) {
        coin = _coin
    } else {
        throw new Error(`The coin provided is invalid [ ${JSON.stringify(_coin)} ]`)
    }

    /* Validate receivers. */
    if (Array.isArray(_receivers)) {
        receivers = _receivers
    } else {
        receivers = [_receivers]
    }

    /* Set address. */
    const address = coin.cashAddress

    /* Set transaction id. */
    const txId = coin.txid

    /* Set output index. */
    const outputIndex = coin.vout

    /* Set satoshis. */
    const satoshis = coin.satoshis

    /* Validate satoshis (sending to receiver). */
    if (!satoshis) {
        throw new Error('No transaction value.')
    }

    /* Set public key (hash) script. */
    const script = Address.toPubKeyHash(coin.cashAddress)

    /* Initialize private key. */
    const privateKey = new bch.PrivateKey(coin.wif)

    /* Build UTXO. */
    const utxo = { txId, outputIndex, address, script, satoshis }
    debug('Sending (utxo):', utxo)
    // console.log('SEND COIN (utxo):', utxo)

    /* Build transaction. */
    const transaction = new bch.Transaction()
        .from(utxo)

    /* Initialize (minimum) byte count. */
    // FIXME: We need to properly calculate the fee.
    //        Reference BITBOX `getByteCount` for method.
    // const byteCount = 226
    const byteCount = 270
    debug('Byte count:', byteCount)

    /* Initialize (initial) transaction satoshis. */
    // NOTE: It's the original satoshis - 1 sat/byte for tx size
    // FIXME: Recommendation is to use 1.1 sat/byte
    let txAmount = 0

    /* Handle all receivers. */
    receivers.forEach(_receiver => {
        /* Validate receiver. */
        if (!_receiver.address) {
            throw new Error(`Invalid receiver address [ ${JSON.stringify(_receiver.address)} ]`)
        }

        if (!_receiver.satoshis) {
            throw new Error(`Invalid receiver value [ ${JSON.stringify(_receiver.satoshis)} ]`)
        }

        /* Set receipient address. */
        // TODO: Add protection against accidental legacy address.
        const address = _receiver.address

        /* Initialize satoshis. */
        let satoshis = null

        if (_autoFee) {
            /* Calculate fee per recipient. */
            // NOTE: Fee is split evenly between all recipients.
            const feePerRecipient = Math.ceil(byteCount / receivers.length)

            /* Calculate satoshis. */
            satoshis = _receiver.satoshis - feePerRecipient

            /* Add receiver to transaction. */
            transaction.to(address, satoshis)
        } else {
            /* Set satoshis. */
            satoshis = _receiver.satoshis

            /* Add receiver to transaction. */
            transaction.to(address, satoshis)
        }

        /* Calculate transaction total. */
        txAmount += satoshis
    })
    debug('Transaction satoshis (incl. fee):', txAmount)

    /* Validate dust amount. */
    if (txAmount < DUST_SATOSHIS) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_SATOSHIS} ] satoshis.`)
    }

    /* Sign transaction. */
    transaction.sign(privateKey)
    debug('Raw transaction (hex):', transaction.toString())
    // console.info('Raw transaction:', transaction) // eslint-disable-line no-console
    // console.info('Raw transaction (hex):', ) // eslint-disable-line no-console

    /* Broadcast transaction to network. */
    return await Transaction
        .sendRawTransaction(transaction.toString())
        .catch(err => {
            console.error(err) // eslint-disable-line no-console
        })
}

/* Export module. */
module.exports = sendCoin
