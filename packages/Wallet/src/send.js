/* Import modules. */
import { sendCoin } from '@nexajs/purse'
import { sendToken } from '@nexajs/token'


/**
 * Send (Assets)
 *
 * Receives parameters for transferring any form of Nexa asset(s).
 */
export default async function (_tokenid, _receiver, _amount) {
    /* Initialize locals. */
    let address
    let coins
    let error
    let locking
    let lockTime
    let nullData
    let receiver
    let receivers
    let response
    let satoshis
    let sequence
    let suggestions
    let tokenAmount
    let tokens
    let txidem
    let txResult
    let unlocking
    let unspentCoins
    let unspentTokens

    /* Validate amount. */
    if (typeof _amount === 'bigint') {
        /* Set token amount. */
        tokenAmount = _amount

        // console.log('TOKENID', _tokenid)
        // console.log('TOKENS', this.tokens)

        /* Filter tokens. */
        // NOTE: Currently limited to a "single" Id.
        tokens = this.tokens.filter(_token => {
            return _token.tokenidHex === _tokenid
        })
        // console.log('TOKENS (filtered)', tokens)

        /* Calculate the total balance of the unspent outputs. */
        unspentTokens = tokens
            .reduce(
                (totalValue, unspentOutput) => (totalValue + unspentOutput.tokens), BigInt(0)
            )
        // console.log('UNSPENT TOKENS', unspentTokens)

        /* Add primary (asset) receiver. */
        receivers = [
            {
                address: _receiver,
                tokenid: _tokenid, // TODO Allow auto-format conversion.
                tokens: tokenAmount,
            },
        ]

        /* Handle (automatic) TOKEN change. */
        if (unspentTokens - tokenAmount > BigInt(0)) {
            receivers.push({
                address: this.address,
                tokenid: _tokenid, // TODO Allow auto-format conversion.
                tokens: (unspentTokens - tokenAmount),
            })
        }

        // FIXME: FOR DEV PURPOSES ONLY
        receivers.push({
            address: this.address,
        })
        // console.log('RECEIVERS', receivers)

        /* Send UTXO request. */
        response = await sendToken(this.coins, tokens, receivers)
        // console.log('Send UTXO (response):', response)
    } else if (typeof _receiver === 'bigint') {
        /* Set receiver. */
        receiver = _tokenid

        /* Set satoshis. */
        satoshis = _receiver

        const receivers = [
            {
                address: receiver,
                satoshis,
            },
        ]

        // FIXME: FOR DEV PURPOSES ONLY
        receivers.push({
            address: this.address,
        })
        // console.log('RECEIVERS', receivers)

        /* Send UTXO request. */
        response = await sendCoin(this.coins, receivers)
        // console.log('Send UTXO (response):', response)
    } else if (
        (_tokenid.coins || _tokenid.tokens) &&
        _tokenid.receivers.length > 0
    ) {
        /* Initialize transaction (object) builder. */
        const txBuilder = {}

        /* Set coins. */
        txBuilder.coins = _tokenid.coins

        /* Set tokens. */
        txBuilder.tokens = _tokenid.tokens

        /* Set receivers. */
        txBuilder.receivers = _tokenid.receivers

        /* Set lockTime. */
        txBuilder.lockTime = _tokenid.lockTime

        /* Set sequence. */
        txBuilder.sequence = _tokenid.sequence

        /* Set locking. */
        txBuilder.locking = _tokenid.locking

        /* Set unlocking. */
        txBuilder.unlocking = _tokenid.unlocking

        // TODO Add validation for each (object) parameter.

        /* Validate tokens. */
        if (txBuilder.tokens) {
            /* Send CUSTOM token(s). */
            response = await sendToken(txBuilder)
        } else {
            /* Send CUSTOM coin(s). */
            response = await sendCoin(txBuilder)
        }
    } else {
        throw new Error('Oops! Your transaction parameters are invalid.')
    }

    /* Handle transaction result. */
    try {
        txResult = JSON.parse(response)
        // console.log('TX RESULT', txResult)

        /* Validate result (txidem). */
        if (txResult.result) {
            console.log(txResult.result)

            /* Set transaction idem. */
            txidem = txResult.result

            /* Set error. */
            error = null
        }

        /* Validate error. */
        if (txResult.error?.message) {
            // console.error(txResult.error.message)
            /* Set transaction idem. */
            txidem = null

            /* Initialize suggestions. */
            suggestions = []

            // FIXME FOR DEV PURPOSES ONLY
            suggestions.push('Sorry, no advice.')

            /* Set error. */
            error = {
                ...txResult.error,
                suggestions,
            }
        }
    } catch (err) {
        console.error(err)
    }

    return {
        txidem,
        error,
    }
}
