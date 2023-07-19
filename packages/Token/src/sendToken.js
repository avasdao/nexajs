/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendToken')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import { Transaction } from '@nexajs/transaction'

/* Set constants. */
import DUST_LIMIT from './getDustLimit.js'
const TYPE1_OUTPUT_LENGTH = 33

/**
 * Send Token
 *
 * Simple token sending to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coin
 *   - wif
 *   - satoshis
 *   - outpoint
 */
export default async (_coins, _tokens, _receivers, _feeRate = 2.0) => {
    debug('Sending tokens', _coins, _tokens, _receivers, _feeRate)
    // console.log('Sending tokens', _coins, _tokens, _receivers, _feeRate)

    /* Initialize locals. */
    let address
    let change
    let coins
    let feeTotal
    let feeTotalWithChange
    let receiver
    let receivers
    let satoshis
    let tokens
    let transaction
    let unspentCoins
    let unspentTokens
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

    /* Validate token. */
    if (_tokens) {
        /* Validate tokens. */
        if (Array.isArray(_tokens)) {
            tokens = _tokens
        } else {
            tokens = [_tokens]
        }
    } else {
        throw new Error(`The token(s) provided are invalid [ ${JSON.stringify(_tokens)} ]`)
    }

    /* Validate receivers. */
    if (Array.isArray(_receivers)) {
        receivers = _receivers
    } else {
        receivers = [_receivers]
    }

    /* Initialize (initial) transaction satoshis. */
    satoshis = 0

    /* Calculate total satoshis. */
    receivers.forEach(_receiver => {
        if (_receiver.satoshis) {
            /* Add satoshis to total. */
            satoshis += _receiver.satoshis
        }

        if (_receiver.tokens) {
            /* Add satoshis to total. */
            satoshis += DUST_LIMIT
        }
    })
    debug('Transaction satoshis (incl. fee):', satoshis)
    console.log('SATOSHIS', satoshis)

    /* Create new transaction. */
    transaction = new Transaction({
        feeRate: _feeRate
    })

    /* Handle tokens. */
    tokens.forEach(_token => {
        /* Add input. */
        transaction.addInput(
            _token.outpoint,
            _token.satoshis,
        )
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
        /* Handle (token) outputs. */
        if (_receiver.tokenid) {
            /* Add (token) output. */
            transaction.addOutput(
                _receiver.address,
                DUST_LIMIT,
                _receiver.tokenid,
                _receiver.tokens,
            )
        } else if (_receiver.address && _receiver.satoshis) {
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
    unspentCoins = coins
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
        )

    /* Calculate the total balance of the unspent outputs. */
    unspentTokens = tokens
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), 0
        )

    unspentSatoshis = (unspentCoins + unspentTokens)

    /* Validate dust amount. */
    if (unspentSatoshis < DUST_LIMIT) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_LIMIT} ] satoshis.`)
    }

    const wifsCoins = coins.map(_coin => {
        return _coin.wif || _coin.wifs
    })

    const wifsTokens = tokens.map(_token => {
        return _token.wif || _token.wifs
    })

    wifs = [
        ...wifsCoins,
        ...wifsTokens,
    ]
    console.log('WIFS', wifs)
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
    console.log('CHANGE', change)

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

    console.log('\n  Transaction (hex)', transaction.raw)
    // console.log('\n  Transaction (json)', transaction.json)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
