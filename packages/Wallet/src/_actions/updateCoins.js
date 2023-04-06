/* Import components. */
import Bugsnag from '@bugsnag/js'
import Nexa from 'nexajs'

/**
 * Update Status
 *
 * Process all coins
 */
const updateStatus = (_coins, _meta, dispatch) => {
    /* Handle coins. */
    Object.keys(_coins).forEach(async coinid => {
        /* Set txid. */
        const txid = coinid.split(':')[0]
        // console.log('UPDATE STATUS (txid)', txid)

        /* Set vout. */
        const vout = coinid.split(':')[1]
        // console.log('UPDATE STATUS (vout)', vout)

        // TODO: We should ONLY process active coins by comparing
        //       its metadata status.

        /* Query spent status. */
        const isSpent = await Nexa.Blockchain.Query.isSpent(txid, vout)
        // console.log('UPDATE STATUS (isSpent)', isSpent, txid, vout)

        /* Validate spent. */
        if (isSpent) {
            /* Set coin. */
            const coin = _coins[coinid]

            /* Validate status. */
            if (coin && coin.status !== 'disabled') {
                /* Set status. */
                coin.status = 'disabled'

                /* Request coin update. */
                dispatch('updateCoin', coin)
            }
        } else {
            /* Validate metadata coins. */
            if (!_meta || !_meta.coins || !_meta.coins[coinid]) {
                return
            }

            /* Validate coin against its metadata. */
            if (_meta.coins[coinid].lock && _meta.coins[coinid].lock.isActive === true) {
                /* Set coin. */
                const coin = _coins[coinid]

                /* Validate status. */
                if (coin && coin.status !== 'locked') {
                    /* Set status. */
                    coin.status = 'locked'

                    /* Request coin update. */
                    dispatch('updateCoin', coin)
                }
            }

        }

    })

}

/**
 * Update Coins (for ALL sessions)
 */
const updateCoins = async ({ dispatch, getters, rootGetters }) => {
    /* Set coins. */
    const coins = getters.getCoins
    // console.log('UPDATE COINS (coins)', coins)

    /* Validate coins. */
    if (!coins) {
        return
    }

    /* Retrieve metadata. */
    const meta = await rootGetters['profile/getMeta']
    // console.log('UPDATE COINS (meta):', meta)

    /* Update status. */
    updateStatus(coins, meta, dispatch)

    /* Retrieve accounts. */
    const accounts = getters.getAccounts
    // console.log('UPDATE COINS (accounts)', accounts)

    /* Validate accounts. */
    if (accounts === null) {
        return
    }

    /* Build search array. */
    const addresses = accounts.map(obj => {
        return obj.address
    })
    // console.log('UPDATE COINS (addresses)', addresses)

    /* Initialize search details. */
    const searchDetails = []

    /* Compile addresses. */
    // FIXME: We do not use for-each with callback here because of async.
    for (let i = 0; i < addresses.length; i++) {
        /* Set address. */
        const address = addresses[i]

        /* Request address details. */
        const details = await Nexa.Address.details(address)
        // console.log('UPDATE COINS (address details)', details)

        /* Validate address details. */
        if (!details) {
            return
        }

        /* Map transactions. */
        const transactions = details.map(detail => {
            return detail.tx_hash
        })
        // console.log('UPDATE COINS (transactions)', transactions)

        searchDetails.push({
            transactions,
            legacyAddress: Nexa.Address.toLegacyAddress(address),
            cashAddress: address,

        })
        // console.log('UPDATE COINS (searchDetails)', searchDetails)
    }

    /* Process search details. */
    searchDetails.forEach(addrDetails => {
        const searchAddr = addrDetails.cashAddress
        // console.log('UPDATE COINS (searchAddr)', searchAddr)

        const txs = addrDetails.transactions
        // console.log('UPDATE COINS (addrDetails.txs)', txs)

        txs.forEach(async txid => {
            /* Retrieve transaction details. */
            const txDetails = await Nexa.Transaction.details(txid)
            // console.log('UPDATE COINS (tx details)', txDetails)

            /* Validate transaction details. */
            if (!txDetails) {
                return
            }

            /* Set outputs. */
            const outputs = txDetails.outputs

            /* Validate outputs. */
            if (!outputs) {
                return
            }

            /* Handle all transaction outputs. */
            outputs.forEach((output, index) => {
                // console.log('UPDATE COINS (output)', output)

                /* Set satoshi (amount). */
                const satoshis = output.satoshis
                // console.log('UPDATE COINS (satoshis)', satoshis)

                /* Validate satoshis. */
                if (satoshis === 0) {
                    // FIXME: Is it okay to skip zero value outputs??
                    return
                }

                /* Set script public key. */
                const scriptPubKey = output.script
                // console.log('UPDATE COINS (scriptPubKey)', scriptPubKey)

                /* Validate script public key. */
                if (!scriptPubKey) {
                    return
                }

                /* Set cash addresses. */
                const cashAddress = Nexa.Address.toCashAddress(scriptPubKey)
                // console.log('UPDATE COINS (cashAddress)', cashAddress)

                /* Initialize WIF. */
                let chainid = null

                /* Initialize WIF. */
                let wif = null

                /* Find the WIF. */
                for (let i = 0; i < accounts.length; i++) {
                    if (accounts[i].address === searchAddr) {
                        /* Set chain id. */
                        chainid = accounts[i].chainid

                        /* Set WIF. */
                        wif = accounts[i].wif

                        break
                    }
                }

                /* Validate search address. */
                if (cashAddress === searchAddr) {
                    /**
                     * Coin
                     *
                     * Status codes:
                     *     active: Coin is ready to receive OR spend funds.
                     *     disabled: Already received and spent funds (MUST be empty).
                     *     locked: Coin is reserved OR has received funds currently
                     *             being held in reserve for a later use.
                     *             (eg. CashShuffle, CashFusion, ANYONECANPAY, etc)
                     */
                    const coin = {
                        status: 'active',
                        txid,
                        vout: index,
                        satoshis,
                        chainid,
                        wif,
                        cashAddress: searchAddr,
                        legacyAddress: Nexa.Address.toLegacyAddress(searchAddr),
                    }
                    // console.log('UPDATE COINS (coin)', coin)

                    /* Set coin id. */
                    const coinid = `${coin.txid}:${coin.vout}`

                    /* Validate new coin. */
                    if (coins && !coins[coinid]) {
                        /* Add new coin. */
                        dispatch('addCoin', coin)

                        try {
                            /* Initialize coins. */
                            const coins = new Audio(require('@/assets/audio/coins.wav'))

                            /* Set volume to lower level. */
                            coins.volume = 0.2

                            /* Play coins. */
                            // WARNING: This action may fail on several browsers;
                            //          so it's best to do this last to avoid any
                            //          unforseen side-effects.
                            coins.play()
                        } catch (err) {
                            console.error(err) // eslint-disable-line no-console

                            /* Report error. */
                            Bugsnag.notify(err)
                        }
                    }
                }
            })

        })

    })
}

/* Export module. */
export default updateCoins
