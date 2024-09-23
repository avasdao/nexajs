import { Transaction } from '@nexajs/transaction'

import getChangeReceiver from './getChangeReceiver.js'

/* Set constants. */
import DUST_LIMIT from './getDustLimit.js'

const TYPE1_OUTPUT_LENGTH = 33
const MAXINT = 0xffffffff
const DEFAULT_SEQNUMBER = MAXINT - 1 // NOTE: Enables nLocktime

// TODO Add support for ALL signature types.
//      (source: https://spec.nexa.org/nexa/sighashtype.md)
const SIGHASH_ALL = 0x0

/**
 * Build Coins
 *
 * Crate a coin transaction to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coin
 *   - outpoint
 *   - satoshis
 *   - wif
 */
export default async (_coins, _receivers) => {
    // console.log('Building coins', _coins, _receivers)

    /* Initialize locals. */
    let address
    let change
    let coins
    let feeRate
    let feeTotal
    let feeTotalWithChange
    let hashType
    let locking
    let lockTime
    let receiver
    let receivers
    let satoshis
    let sequence
    let transaction
    let unlocking
    let unspentSatoshis
    let wifs

    /* Validate coin. */
    if (_coins) {
        /* Validate coins (object). */
        if (_coins.coins) {
            coins = _coins.coins
        } else {
            coins = _coins
        }

        /* Validate coins. */
        if (Array.isArray(coins)) {
            coins = coins
        } else {
            coins = [coins]
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
    } else if (_coins.receivers) {
        if (Array.isArray(_coins.receivers)) {
            receivers = _coins.receivers
        } else {
            receivers = [_coins.receivers]
        }
    } else {
        throw new Error(`The receiver(s) provided are invalid [ ${JSON.stringify(_receivers)} ]`)
    }

    /* Initialize (initial) transaction satoshis. */
    satoshis = BigInt(0)

    /* Calculate total satoshis. */
    receivers.forEach(_receiver => {
        if (_receiver.satoshis > BigInt(0)) {
            /* Add satoshis to total. */
            satoshis += _receiver.satoshis
        }
    })
    // console.log('Transaction satoshis (incl. fee):', satoshis)

    /* Validate dust amount. */
    if (satoshis < DUST_LIMIT) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_LIMIT} ] satoshis.`)
    }

    /* Validate fee rate. */
    if (_coins.feeRate) {
        feeRate = _coins.feeRate
    } else {
        feeRate = 2.0 // NOTE: This is the Qt node (UI) wallet default.
    }

    /* Validate lock time. */
    if (_coins.lockTime) {
        lockTime = _coins.lockTime
    } else {
        lockTime = 0 // NOTE: This disables CLTV.
    }

    /* Validate sequence (number). */
    if (_coins.sequence) {
        sequence = _coins.sequence
    } else {
        sequence = DEFAULT_SEQNUMBER
    }

    /* Validate locking (script). */
    if (_coins.locking) {
        locking = _coins.locking
    }

    /* Validate unlocking (script). */
    if (_coins.unlocking === null) {
        // NOTE: disables "automatic" transaction signing.
        unlocking = null
    } else {
        // NOTE: expect `undefined` for "standard" pubkey+sig procedure.
        unlocking = _coins.unlocking
    }

    /* Validate hash type. */
    if (_coins.hashType) {
        hashType = _coins.hashType
    } else {
        hashType = SIGHASH_ALL
    }

    /* Create new transaction. */
    transaction = new Transaction({
        feeRate,
        lockTime,
        sequence,
        locking,
        unlocking,
        hashType,
    })

    /* Handle coins. */
    coins.forEach(_coin => {
        /* Add input. */
        transaction.addInput({
            outpoint: _coin.outpoint,
            satoshis: _coin.satoshis,
            locking: _coin.locking,
            unlocking: _coin.unlocking,
            hashType: _coin.hashType,
        })
    })

    /* Handle receivers. */
    receivers.forEach(_receiver => {
        /* Handle (value) outputs. */
        if (_receiver.address && _receiver.satoshis) {
            /* Add (value) output. */
            transaction.addOutput({
                address: _receiver.address,
                satoshis: _receiver.satoshis,
            })
        }

        /* Handle (data) outputs. */
        if (_receiver.data) {
            /* Add (data) output. */
            transaction.addOutput({
                address: _receiver.data
            })
        }
    })

    /* Calculate the total balance of the unspent outputs. */
    unspentSatoshis = coins
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), BigInt(0)
        )

    /* Prepare WIFs. */
    wifs = coins.map(_coin => {
        return _coin.wif || _coin.wifs
    })
    // console.log('WIFS', wifs)

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    // NOTE: 33 bytes for a Type-1 change output.
    // FIXME: Calculate length based on address type.
    feeTotal = BigInt((transaction.raw.length) * feeRate)
    // console.log('FEE TOTAL (w/out change):', feeTotal)

    /* Calculate change amount. */
    change = (unspentSatoshis - satoshis - feeTotal)

    /* Validate change amount. */
    if (change < BigInt(0)) {
        throw new Error(`Oops! Insufficient funds to complete this transaction.`)
    }

    /* Validate change amount. */
    if (change >= DUST_LIMIT) {
        feeTotalWithChange = BigInt(((transaction.raw.length) + TYPE1_OUTPUT_LENGTH) * feeRate)
        // console.log('FEE TOTAL (w/ change):', feeTotalWithChange)

        /* Validate dust limit w/ additional output. */
        if ((unspentSatoshis - satoshis - feeTotalWithChange) >= DUST_LIMIT) {
            /* Calculate (NEW) change amount. */
            change = (unspentSatoshis - satoshis - feeTotalWithChange)

            /* Find the change receiver. */
            receiver = getChangeReceiver(receivers)

            /* Validate receiver. */
            if (receiver) {
                // console.log('FOUND CHANGE RECEIVER', receiver)

                /* Add (value) output. */
                transaction.addOutput({
                    address: receiver.address,
                    satoshis: change,
                })
            } else {
                // TODO Fallback to the first input/signer address
                throw new Error('ERROR! Find a change receiver!')
            }
        }
    }

    /* Sign transaction. */
    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    /* Return transaction. */
    return transaction
}
