/* Import modules. */
// import { sha256 } from '@nexajs/crypto'
// import { encodePrivateKeyWif } from '@nexajs/hdnode'

import { encodeAddress } from '@nexajs/address'

// import { sha256 } from '@nexajs/crypto'

import {
    getCoins,
    sendCoins,
} from '@nexajs/purse'

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    getTokens,
    sendToken,
} from '@nexajs/token'

/* Libauth helpers. */
import {
    encodeDataPush,
    // instantiateRipemd160,
} from '@bitauth/libauth'

// const TOKEN_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000' // AVAS
const TOKEN_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000' // STUDIO

export default async function (_receivers) {
    /* Initialize locals. */
    let body
    let coins
    let nexaAddress
    let nullData
    // let publicKey
    let publicKeyHash
    let receivers
    let response
    let scriptPubKey
    // let scriptPushPubKey
    let tokens
    let txResult
    let userData
    // let wif

    console.info('\n  Nexa address:', this.address)

    coins = await getCoins(this.wif)
        .catch(err => console.error(err))
    console.log('\n  Coins:', coins)

    tokens = await getTokens(this.wif)
        .catch(err => console.error(err))
    console.log('\n  Tokens:', tokens)

    /* Filter tokens. */
    // NOTE: Currently limited to a "single" Id.
    tokens = tokens.filter(_token => {
        return _token.tokenidHex === TOKEN_ID_HEX
    })
    console.log('\n  Tokens (filtered):', tokens)

    userData = [
        'RAIN',
        `$STUDIO Telegram Airdrop`,
    ]

    /* Initialize hex data. */
    nullData = encodeNullData(userData)

    receivers = [
        {
            data: nullData,
        },
    ]

    _receivers.forEach(_receiver => {
        receivers.push(        {
            address: _receiver.address,
            tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
            tokens: BigInt(_receiver.tokens),
        },
)
    })

    receivers.push({
        address: this.address,
    })
    console.log('\n  Receivers:', receivers)
// return
    /* Send UTXO request. */
    response = await sendToken(coins, tokens, receivers)
    console.log('Send UTXO (response):', response)

    try {
        txResult = JSON.parse(response)
        console.log('TX RESULT', txResult)

        if (txResult.error) {
            console.error(txResult.error)
        }
    } catch (err) {
        console.error(err)
    }

    return txResult
}
