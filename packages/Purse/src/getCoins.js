/* Import (local) modules. */
import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

import { parseWif } from '@nexajs/hdnode'

import { encodeDataPush } from '@bitauth/libauth'

export default async (_wif, _scriptPubKey = null) => {
    /* Initialize locals. */
    let coins
    let unspent
    let wif

    let {
        privateKey,
        publicKey,
        address,
    } = await parseWif(_wif)

    /* Validate WIF details. */
    if (privateKey && publicKey && address) {
        /* Set WIF. */
        wif = _wif
    }

    /* Handle "script" addresses. */
    if (_scriptPubKey) {
        address = encodeAddress(
            'nexa',
            'TEMPLATE',
            _scriptPubKey,
        )
    }

    /* Fetch all unspent transaction outputs. */
    unspent = await listUnspent(address)
    // console.log('UNSPENT', unspent)

    /* Validate unspent. */
    if (unspent.length === 0) {
        console.error('There are NO unspent outputs available.')

        /* Return empty array. */
        return []
    }

    /* Remove tokens. */
    unspent = unspent.filter(_unspent => {
        return _unspent.hasToken === false
    })

    /* Build coins. */
    coins = unspent.map(_unspent => {
        const outpoint = _unspent.outpoint
        const satoshis = _unspent.satoshis

        return {
            outpoint,
            satoshis,
            wif,
        }
    })

    /* Return coins. */
    return coins
}
