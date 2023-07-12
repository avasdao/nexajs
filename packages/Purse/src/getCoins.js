/* Import (local) modules. */
import { listUnspent } from '@nexajs/address'
import { parseWif } from '@nexajs/hdnode'

export default async (_wif) => {
    let coins
    let mempool
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

    /* Validate unspent. */
    if (unspent.length === 0) {
        console.error('There are NO unspent outputs available.')

        /* Return empty array. */
        return []
    }

    /* Remove tokens. */
    unspent = unspent.filter(_unspent => {
        return _unspent.isToken === false
    })

    mempool = unspent.find(_unspent=> {
        return _unspent.height === 0
    })
    // console.log('MEMPOOL', mempool)

    // FIXME Force mempool UTXOs.
    // NOTE: This is a bugfix until Rostrum 9.0 fix.
    if (mempool) {
        unspent = [mempool]
    }

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
