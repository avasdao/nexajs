/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendToken')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

import { Transaction } from '@nexajs/transaction'

/* Set constants. */
import DUST_SATOSHIS from './getDustAmount.js'

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
export default async (_tokens, _receivers, _autoFee = true) => {
    debug('Sending tokens', _tokens, _receivers)
    // console.log('Sending tokens', _tokens, _receivers)

    /* Initialize token. */
    let tokens

    /* Initialize receivers. */
    let receivers

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
    // NOTE: It's the original satoshis - 1 sat/byte for tx size
    // FIXME: Recommendation is to use 1.1 sat/byte
    let txAmount = 0

    /* Create new transaction. */
    const transaction = new Transaction()

    /* Handle tokens. */
    tokens.forEach(_token => {
        /* Add input. */
        transaction.addInput(
            _token.outpoint,
            _token.satoshis,
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

    const wifs = tokens.map(_token => {
        return _token.wif || _token.wifs
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