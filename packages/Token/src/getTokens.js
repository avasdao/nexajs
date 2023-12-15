/* Import (local) modules. */
import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

import { parseWif } from '@nexajs/hdnode'

import { hexToBin } from '@nexajs/utils'

import { encodeDataPush } from '@bitauth/libauth'

export default async (_wif, _scriptPubKey = null) => {
    let prefix
    let tokens
    let unspent
    let wif

    /* Handle prefix. */
    if (process?.env?.TESTNET) {
        prefix = 'nexatest'
    } else if (process?.env?.REGTEST) {
        prefix = 'nexareg'
    } else {
        prefix = 'nexa'
    }
    // console.log('PREFIX', prefix)

    /* Parse WIF. */
    let {
        privateKey,
        publicKey,
        address,
    } = await parseWif(_wif, prefix)

    /* Validate WIF details. */
    if (privateKey && publicKey && address) {
        /* Set WIF. */
        wif = _wif
    }

    /* Handle "script" addresses. */
    if (_scriptPubKey) {
        address = encodeAddress(
            prefix,
            'TEMPLATE',
            _scriptPubKey,
        )
    }

    /* Fetch all unspent transaction outputs. */
    unspent = await listUnspent(address)

    /* Validate unspent. */
    if (unspent.length === 0) {
        console.error('There are NO unspent outputs available.')

        /* Return empty array. */
        return []
    }

    /* Remove tokens. */
    unspent = unspent.filter(_unspent => {
        return _unspent.hasToken === true
    })
    // console.log('UNSPENT (tokens):', unspent)

    /* Build tokens. */
    tokens = unspent.map(_unspent => {
        const outpoint = _unspent.outpoint
        const satoshis = _unspent.satoshis
        const tokenid = hexToBin(_unspent.tokenid) || null
        const tokenidHex = _unspent.tokenidHex || null
        const tokens = _unspent.tokens || null

        return {
            outpoint,
            satoshis,
            tokenid,
            tokenidHex,
            tokens,
            wif,
        }
    })

    /* Return tokens. */
    return tokens
}
