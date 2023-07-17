/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendCoin')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import { Transaction } from '@nexajs/transaction'

/* Set constants. */
import DUST_LIMIT from './getDustLimit.js'

const TYPE1_OUTPUT_LENGTH = 33

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
    let change
    let coins
    let feeTotal
    let feeTotalWithChange
    let receiver
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

    /* Calculate total satoshis. */
    receivers.forEach(_receiver => {
        /* Validate receiver. */
        // if (!_receiver.address) {
        //     throw new Error(`Invalid receiver address [ ${JSON.stringify(_receiver.address)} ]`)
        // }

        if (!_receiver.satoshis) {
            return
            // throw new Error(`Invalid receiver value [ ${JSON.stringify(_receiver.satoshis)} ]`)
        }

        /* Set receipient address. */
        // TODO: Add protection against accidental legacy address.
        // address = _receiver.address

        /* Calculate transaction total. */
        satoshis += _receiver.satoshis
    })
    debug('Transaction satoshis (incl. fee):', satoshis)

    /* Validate dust amount. */
    if (satoshis < DUST_LIMIT) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_LIMIT} ] satoshis.`)
    }

    /* Create new transaction. */
    transaction = new Transaction({
        feeRate: _feeRate
    })

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
        if (_receiver.address && _receiver.satoshis) {
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

    /* Calculate the total balance of the unspent outputs. */
    unspentSatoshis = _coins
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
        )

    // TODO CALCLATE CHANGE OUTPUT LENGTH/SIZE
    /* Prepare WIFs. */
    wifs = coins.map(_coin => {
        return _coin.wif || _coin.wifs
    })
    // console.log('WIFS', wifs)

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    console.log('TX LENGTH', transaction.raw.length / 2)

    // NOTE: 33 bytes for a Type-1 change output.
    // FIXME: Calculate length based on address type.
    feeTotal = (transaction.raw.length / 2) * _feeRate
    console.log('FEE TOTAL (w/out change):', feeTotal)

    /* Calculate change amount. */
    change = (unspentSatoshis - satoshis - feeTotal)

    /* Validate change amount. */
    if (change < 0.0) {
        throw new Error(`Oops! Insufficient funds to complete this transaction.`)
    }

    /* Validate change amount. */
    if (change >= DUST_LIMIT) {
        feeTotalWithChange = ((transaction.raw.length / 2) + TYPE1_OUTPUT_LENGTH) * _feeRate
        console.log('FEE TOTAL (w/ change):', feeTotalWithChange)

        /* Validate dust limit w/ additional output. */
        if ((unspentSatoshis - satoshis - feeTotalWithChange) >= DUST_LIMIT) {
            /* Calculate (NEW) change amount. */
            change = (unspentSatoshis - satoshis - feeTotalWithChange)

            /* Find the change receiver. */
            receiver = receivers.find(_receiver => {
                return _receiver.address && (typeof _receiver.satoshis === 'undefined' || _receiver.satoshis === null || _receiver.satoshis === '')
            })

            /* Validate receiver. */
            if (receiver) {
                console.log('FOUND CHANGE RECEIVER', receiver)

                /* Add (value) output. */
                transaction.addOutput(
                    receiver.address,
                    change,
                )
            } else {
                // TODO Fallback to the first input/signer address
                throw new Error('ERROR! Find a change receiver!')
            }
        }
    }

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    // console.log('\n  Transaction', transaction)
    console.log('\n  Transaction (hex)', transaction.raw)
    // console.log('\n  Transaction (json)', transaction.json)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
