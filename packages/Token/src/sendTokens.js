/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:token:sendTokens')

/* Import (library) modules. */
import { broadcast } from '@nexajs/provider'

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
 * Send Tokens
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
export default async (_coins, _tokens, _receivers) => {
    debug('Sending tokens', _coins, _tokens, _receivers)
    // console.log('Sending tokens', _coins, _tokens, _receivers)

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
    let tokenAmount
    let tokenid
    let tokens
    let transaction
    let unlocking
    let unspentCoins
    let unspentDustCoins
    let unspentTokens
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

    /* Validate token. */
    if (_tokens) {
        /* Validate tokens. */
        if (Array.isArray(_tokens)) {
            tokens = _tokens
        } else {
            tokens = [_tokens]
        }
    } else if (_coins.tokens) {
        /* Validate tokens. */
        if (Array.isArray(_coins.tokens)) {
            tokens = _coins.tokens
        } else {
            tokens = [_coins.tokens]
        }
    } else {
        throw new Error(`The token(s) provided are invalid [ ${JSON.stringify(_tokens)} ]`)
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
    tokenAmount = BigInt(0)

    /* Calculate total satoshis and tokens. */
    receivers.forEach(_receiver => {
        if (_receiver.satoshis > BigInt(0)) {
            /* Add satoshis to total. */
            satoshis += _receiver.satoshis
        }

        if (_receiver.tokens > BigInt(0)) {
            /* Add satoshis to total. */
            satoshis += DUST_LIMIT

            /* Add tokens to total. */
            tokenAmount += _receiver.tokens
        }
    })
    debug('Transaction satoshis (excl. fee):', satoshis)
    debug('Transaction token amount:', tokenAmount)
    // console.log('SATOSHIS', satoshis)

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

// FIXME
// FIXME: FILTER ALL AUTHORITY TRANSACTION OUTPUTS
// FIXME: CHECK FLAGS.AUTHTXO BIT (1<<63)
// FIXME

    /* Handle tokens. */
    tokens.forEach(_token => {
        /* Add input. */
        transaction.addInput({
            outpoint: _token.outpoint,
            satoshis: _token.satoshis,
            locking: _token.locking,
            unlocking: _token.unlocking,
            hashType: _token.hashType,
        })
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
        /* Handle (token) outputs. */
        if (_receiver.tokenid) {
            /* Add (token) output. */
            transaction.addOutput({
                address: _receiver.address,
                satoshis: DUST_LIMIT,
                tokenid: _receiver.tokenid,
                tokens: _receiver.tokens,
            })

            /* Validate token id. */
            if (!tokenid) {
                tokenid = _receiver.tokenid
            }
        } else if (_receiver.address && _receiver.satoshis) {
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
    unspentCoins = coins
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), BigInt(0)
        )

    /* Calculate the total balance of the unspent outputs. */
    unspentDustCoins = tokens
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.satoshis), BigInt(0)
        )

    /* Total satoshis for coins and tokens (dust value). */
    unspentSatoshis = (unspentCoins + unspentDustCoins)

    unspentTokens = tokens
        .reduce(
            (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
        )
    // console.log('UNSPENT TOKENS', unspentTokens)
    // console.log('TOKEN AMOUNT', tokenAmount)

    /* Validate (change amount) of asset. */
    // NOTE: Auth flag (large negative) value will force NO CHANGE.
    if (unspentTokens - tokenAmount > BigInt(0)) {
        /* Find the change receiver. */
        receiver = getChangeReceiver(receivers)
        // console.log('RECEIVER', receiver)

        /* Validate receiver. */
        if (receiver) {
            // console.log('FOUND CHANGE RECEIVER', receiver)

            /* Add satoshis to total. */
            satoshis += DUST_LIMIT

            /* Add (token) output. */
            transaction.addOutput({
                address: receiver.address,
                satoshis: DUST_LIMIT,
                tokenid,
                tokens: (unspentTokens - tokenAmount),
            })
        } else {
            // TODO Fallback to the first input/signer address
            throw new Error('ERROR! Find a change receiver!')
        }
    }

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
    // console.log('WIFS', wifs)
    // console.log('WIFS', wifs)

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    // console.log('TX LENGTH', transaction.raw.length / 2)

    // NOTE: 33 bytes for a Type-1 change output.
    // FIXME: Calculate length based on address type.
    feeTotal = BigInt((transaction.raw.length / 2) * feeRate)
    // console.log('FEE TOTAL (w/out change):', feeTotal)

    /* Calculate change amount. */
    change = (unspentSatoshis - satoshis - feeTotal)
    // console.log('CHANGE', change)

    /* Validate change amount. */
    if (change < BigInt(0)) {
        throw new Error(`Oops! Insufficient funds to complete this transaction.`)
    }

    /* Validate change amount. */
    if (change >= DUST_LIMIT) {
        feeTotalWithChange = BigInt(((transaction.raw.length / 2) + TYPE1_OUTPUT_LENGTH) * feeRate)
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

    // TODO Add (optional) miner fee.
    // FIXME Allow WIFs for each input.
    await transaction.sign(wifs)

    console.log('\n  Transaction (hex)', transaction.raw)
    // console.log('\n  Transaction (json)', transaction.json)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
