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

const TOKEN_ID = 'nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8' // STUDIO
const TOKEN_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000' // STUDIO

export default async (isLive = false) => {
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

    let wallet = await Wallet.init(process.env.MNEMONIC)

    /* Encode Private Key WIF. */
    wif = encodePrivateKeyWif(sha256, wallet.privateKey, 'mainnet')

    /* Derive the corresponding public key. */
    publicKey = secp256k1.derivePublicKeyCompressed(wallet.privateKey)

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    scriptData = encodeDataPush(publicKey)

    publicKeyHash = ripemd160.hash(sha256.hash(scriptData))

    scriptPubKey = new Uint8Array([
        OP.ZERO,
        OP.ONE,
        ...encodeDataPush(publicKeyHash),
    ])

    /* Encode the public key hash into a P2PKH nexa address. */
    nexaAddress = encodeAddress(
        'nexa',
        'TEMPLATE',
        scriptPubKey,
    )

    console.log('ADDRESS', nexaAddress, wallet.address, nexaAddress === wallet.address)

    coins = await getCoins(wif)
        .catch(err => console.error(err))
    console.log('COINS', coins)

    outpoint = (coins.find(_coin => {
        return typeof _coin.outpoint !== 'undefined' && _coin.outpoint.length === 64
    })).outpoint
    console.log('OUTPOINT', outpoint)

    params = {
        ticker: 'STUDIO',
        name: `Studio Time + Collection`,
        uri: 'https://nexa.studio/studio.json',
        hash: reverseHex('af84241f6a8975094efb1072fc927d27af71dba3d27d6d63f437fa42aa9909c4'),
        decimals: 0,
    }

    groupData = await getGroupDataScript(params)
    console.log('GROUP DATA SCRIPT', binToHex(groupData))

    let { groupidBin, nonceBin } = await getGroupId(outpoint, groupData)
    console.log('GROUP ID (hex):', binToHex(groupidBin))
    console.log('NONCE', binToHex(nonceBin))

    reversed = '0x' + reverseHex(binToHex(nonceBin))
    console.log('REVERSED', reversed)

    console.log('NONCE (BI):', BigInt(reversed))
    // console.log('NONCE (BI):', BigInt(nonceDec))


    /* Encode the public key hash into a P2PKH nexa address. */
    groupid = encodeAddress(
        'nexa',
        'GROUP',
        groupidBin,
    )
    console.log('GROUP ID', groupid)

    tokens = await getTokens(wif)
        .catch(err => console.error(err))
    console.log('TOKENS', tokens)

    /* Filter tokens. */
    // NOTE: Currently limited to a "single" Id.
    tokens = tokens.filter(_token => {
        // return _token.tokenidHex === TOKEN_ID_HEX
        return _token.tokenidHex === groupid
    })
    console.log('TOKENS (filtered):', tokens)

    userData = [
        'NexaJS\tUnitTest',
        uuidv4(),
    ]

    receivers = [
        {
            data: groupData,
        },
        {
            address: wallet.address,
            tokenid: binToHex(groupidBin), // TODO Allow auto-format conversion.
            tokens: BigInt(reversed),
        },
    ]

    // FIXME: FOR DEV PURPOSES ONLY
    receivers.push({
        address: wallet.address,
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
