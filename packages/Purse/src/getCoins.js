/* Import (local) modules. */
import { listUnspent } from '@nexajs/address'
import { parseWif } from '@nexajs/hdnode'

export default async (_wif) => {
    let coins
    let unspent
    let wif

    const [
        privateKey,
        publicKey,
        depositAddress,
    ] = await parseWif(_wif)

    /* Validate WIF details. */
    if (privateKey && publicKey && depositAddress) {
        /* Set WIF. */
        wif = _wif
    }

    /* Fetch all unspent transaction outputs. */
    unspent = await listUnspent(depositAddress)
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
