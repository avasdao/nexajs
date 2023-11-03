/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import { getCoins } from '@nexajs/purse'

import {
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    encodeDataPush,
    instantiateRipemd160,
    instantiateSecp256k1,
    instantiateSha256,
} from '@bitauth/libauth'

import { Wallet } from '@nexajs/wallet'

/* Import class. */
import { Token } from '@nexajs/token'

/* Import library modules. */
import {
    getGroupDataScript,
    getGroupId,
    getTokens,
    getTopTokens,
    sendToken,
} from '@nexajs/token'

// nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8
const STUDIO_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000' // STUDIO

export default async (_wallet, isLive = false) => {
    let coins
    let nullData
    let receivers
    let response
    let tokens
    let txResult
    let userData
    let wif

    /* Encode Private Key WIF. */
    wif = encodePrivateKeyWif({ hash: sha256 }, _wallet.privateKey, 'mainnet')
    // console.log('WIF', wif)

    coins = await getCoins(wif)
        .catch(err => console.error(err))
    // console.log('COINS', coins)

    tokens = await getTokens(wif)
        .catch(err => console.error(err))
    // console.log('TOKENS', tokens)

    /* Filter tokens. */
    // NOTE: Currently limited to a "single" Id.
    tokens = tokens.filter(_token => {
        return _token.tokenidHex === STUDIO_ID_HEX
    })
    // console.log('\n  Tokens (filtered):', tokens)

    if (tokens.length === 1) {
        throw new Error('Oops! There are NO $STUDIO tokens to melt..')
    }

    userData = [
        'MELT',
        'STUDIO',
    ]

    /* Initialize hex data. */
    nullData = encodeNullData(userData)
    // console.log('HEX DATA', nullData)

    receivers = [
        {
            data: nullData,
        },
    ]

    // NOTE: Return the authority baton.
    receivers.push({
        address: _wallet.address,
        tokenid: STUDIO_ID_HEX, // TODO Allow auto-format conversion.
        tokens: BigInt(0xfc00000000000000), // All permissions enabled
    })

    // FIXME: FOR DEV PURPOSES ONLY
    receivers.push({
        address: _wallet.address,
    })
    console.log('\n  Receivers:', receivers)

    if (isLive) {
        /* Send UTXO request. */
        response = await sendToken(coins, tokens, receivers)
        console.log('Send UTXO (response):', response)

        try {
            txResult = JSON.parse(response)
            console.log('TX RESULT', txResult)
        } catch (err) {
            console.error(err)
        }
    }
}
