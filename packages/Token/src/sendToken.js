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
export default async (_coins, _tokens, _receivers, _autoFee = true) => {
    debug('Sending tokens', _coins, _tokens, _receivers)
    // console.log('Sending tokens', _coins, _tokens, _receivers)

    /* Initialize coins. */
    let coins

    /* Initialize tokens. */
    let tokens

    /* Initialize receivers. */
    let receivers

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
                DUST_SATOSHIS,
                _receiver.tokenid,
                _receiver.tokens,
            )
        } else if (_receiver.address) {
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

    const wifsCoins = coins.map(_coin => {
        return _coin.wif || _coin.wifs
    })

    const wifsTokens = tokens.map(_token => {
        return _token.wif || _token.wifs
    })

    const wifs = [
        ...wifsCoins,
        ...wifsTokens,
    ]
    console.log('WIFS', wifs)

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    return console.log('\n  Transaction (hex)', transaction.raw)
    // console.log('\n  Transaction (json)', transaction.json)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
