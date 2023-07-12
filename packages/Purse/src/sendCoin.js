/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendCoin')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import { Transaction } from '@nexajs/transaction'

/* Set constants. */
import DUST_LIMIT from './getDustLimit.js'

/**
 * Send Coin
 *
 * Simple coin sending to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coin
 *   - outpoint
 *   - satoshis
 *   - wif
 */
export default async (_coins, _receivers, _feeRate = 2.0) => {
    debug('Sending coins', _coins, _receivers)
    // console.log('Sending coins', _coins, _receivers)

    /* Initialize locals. */
    let address
    let coins
    let feePerRecipient
    let receivers
    let satoshis
    let transaction
    let unspentSatoshis
    let wifs

    /* Validate coin. */
    if (_coins) {
        /* Validate coins. */
        if (Array.isArray(_coins)) {
            coins = _coins
        } else {
            coins = [_coins]
        }
    } else {
        throw new Error(`The coin(s) provided are invalid [ ${JSON.stringify(_coins)} ]`)
    }

    /* Validate receivers. */
    if (_receivers) {
        if (Array.isArray(_receivers)) {
            receivers = _receivers
        } else {
            receivers = [_receivers]
        }
    } else {
        throw new Error(`The receiver(s) provided are invalid [ ${JSON.stringify(_receivers)} ]`)
    }

    /* Initialize (initial) transaction satoshis. */
    satoshis = 0

    /* Calculate the total balance of the unspent outputs. */
    unspentSatoshis = _unspents
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
        )

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
        address = _receiver.address

        /* Calculate transaction total. */
        satoshis += _receiver.satoshis
    })
    debug('Transaction satoshis (incl. fee):', satoshis)

    /* Validate dust amount. */
    if (satoshis < DUST_LIMIT) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_LIMIT} ] satoshis.`)
    }

    /* Create new transaction. */
    transaction = new Transaction()

    /* Handle coins. */
    coins.forEach(_coin => {
        /* Add input. */
        transaction.addInput(
            _coin.outpoint,
            _coin.satoshis,
        )
    })

    /* Handle receivers. */
    receivers.forEach(_receiver => {
        /* Handle (value) outputs. */
        if (_receiver.address) {
            /* Add (value) output. */
            transaction.addOutput(
                _receiver.address,
                _receiver.satoshis,
            )
        }

        /* Handle (data) outputs. */
        if (_receiver.data) {
            /* Add (data) output. */
            transaction.addOutput(
                _receiver.data
            )
        }
    })

    wifs = coins.map(_coin => {
        return _coin.wif || _coin.wifs
    })
    // console.log('WIFS', wifs)

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    console.log('\n  Transaction (hex)', transaction.raw)
    // console.log('\n  Transaction (json)', transaction.json)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
