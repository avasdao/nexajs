/* Import modules. */
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

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

export default async () => {
    let coins
    let groupData
    let groupid
    let nexaAddress
    let nullData
    let outpoint
    let params
    let publicKey
    let publicKeyHash
    let receivers
    let response
    let reversed
    let scriptData
    let scriptPubKey
    let tokens
    let txResult
    let userData
    let wif

    /* Instantiate Libauth crypto interfaces. */
    const ripemd160 = await instantiateRipemd160()
    const secp256k1 = await instantiateSecp256k1()
    const sha256 = await instantiateSha256()

    let wallet = new Wallet(process.env.MNEMONIC)

    /* Encode Private Key WIF. */
    wif = encodePrivateKeyWif(sha256, wallet.privateKey, 'mainnet')
    console.log('WIF', wif)
}
