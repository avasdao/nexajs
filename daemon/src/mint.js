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

const TOKEN_ID = 'nexa:tq4624c2tg3xxcjrpmu3sed9fwzq5g56krc44csx49t67sru6yqqqdu2htfk3' // STUDIO
const TOKEN_ID_HEX = '2ba5570a5a226362430ef91865a54b840a229ab0f15ae206a957af407cd10000' // STUDIO

export default async (_wallet, _receiver, _amount) => {
    let coins
    let nullData
    let receivers
    let response
    let tokens
    let txResult
    let userData
    let wif

    console.log('WALLET ADDRESS', _wallet.address)

    /* Encode Private Key WIF. */
    wif = encodePrivateKeyWif({ hash: sha256 }, _wallet.privateKey, 'mainnet')

    coins = await getCoins(wif)
        .catch(err => console.error(err))
    console.log('COINS', coins)

    tokens = await getTokens(wif)
        .catch(err => console.error(err))
    console.log('TOKENS', tokens)

    /* Filter tokens. */
    // NOTE: Currently limited to a "single" Id.
    tokens = tokens.filter(_token => {
        return _token.tokenidHex === TOKEN_ID_HEX
    })
    // console.log('\n  Tokens (filtered):', tokens)

    userData = [
        'MINT',
        'STUDIO',
    ]

    /* Initialize hex data. */
    nullData = encodeNullData(userData)
    // console.log('HEX DATA', nullData)

    receivers = [
        {
            data: nullData,
        },
        {
            address: _receiver,
            tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
            tokens: BigInt(_amount),
        },
    ]

    // NOTE: Return the authority baton.
    receivers.push({
        address: _wallet.address,
        tokenid: TOKEN_ID_HEX, // TODO Allow auto-format conversion.
        tokens: BigInt(0xfc00000000000000), // All permissions enabled
    })

    // FIXME: FOR DEV PURPOSES ONLY
    receivers.push({
        address: _wallet.address,
    })
    console.log('\n  Receivers:', receivers)
// return
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
