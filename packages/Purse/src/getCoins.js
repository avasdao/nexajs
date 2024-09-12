/* Import (local) modules. */
import {
    encodeAddress,
    listUnspent,
} from '@nexajs/address'

import { parseWif } from '@nexajs/hdnode'

export default async (_wifs, _scriptPubKey = null) => {
    /* Initialize locals. */
    let allCoins
    let coins
    let prefix
    let unspent
    let wif
    let wifs

    /* Handle prefix. */
    if (typeof process !== 'undefined' && process?.env?.TESTNET) {
        prefix = 'nexatest'
    } else if (typeof process !== 'undefined' && process?.env?.REGTEST) {
        prefix = 'nexareg'
    } else {
        prefix = 'nexa'
    }
    // console.log('PREFIX', prefix)

    if (Array.isArray(_wifs)) {
        wifs = _wifs
    } else {
        wifs = [_wifs]
    }

    /* Initialize (all) coins. */
    allCoins = []

    /* Handle WIFs. */
    for (let i = 0; i < wifs.length; i++) {
        /* Set WIF. */
        wif = wifs[i]

        /* Validate WIF. */
        if (typeof wif === 'undefined' || wif === null) {
            /* Skip. */
            continue
        }

        /* Parse WIF. */
        let {
            privateKey,
            publicKey,
            address,
        } = await parseWif(wif, prefix)

        /* Validate WIF details. */
        if (!privateKey || !publicKey || !address) {
            /* Skip. */
            continue
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
            console.info('There are NO unspent outputs available.')

            /* Skip. */
            continue
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

        /* Add new coins. */
        allCoins = [
            ...allCoins,
            ...coins,
        ]
    }

    /* Return (all) coins. */
    return allCoins
}
