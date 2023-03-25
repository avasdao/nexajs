/* Import components. */
import Nito from 'nitojs'

/**
 * Update Status
 *
 * Will mark "spent" coins as disabled.
 */
const updateStatus = (_coins, dispatch) => {
    Object.keys(_coins).forEach(async coinid => {
        /* Set txid. */
        const txid = coinid.split(':')[0]

        /* Set vout. */
        const vout = coinid.split(':')[1]

        /* Query spent status. */
        const isSpent = await Nito.Blockchain.Query.isSpent(txid, vout)

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
        }
    })
}

/**
 * Update Coins (for ALL sessions)
 *
 * TODO: Add handling for change/update package received from BitDB.
 */
const updateCoins = async ({ dispatch, getters }) => {
    /* Set coins. */
    const coins = getters.getCoins
    console.log('UPDATE COINS (coins)', coins)

    /* Validate coins. */
    if (!coins) {
        return
    }

    /* Update status. */
    updateStatus(coins, dispatch)

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
        const address = addresses[i]

        /* Retrieve address details. */
        const details = await Nito.Address.details(address)
        // console.log('UPDATE COINS (address details)', details)

        /* Validate details. */
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
            legacyAddress: Nito.Address.toLegacyAddress(address),
            cashAddress: address,
        })
        // console.log('UPDATE COINS (searchDetails)', searchDetails)
    }

    /* Process search details. */
    searchDetails.forEach(addrDetails => {
        const searchAddress = addrDetails.cashAddress
        // console.log('UPDATE COINS (searchAddress)', searchAddress)

        const txs = addrDetails.transactions
        // console.log('UPDATE COINS (addrDetails.txs)', txs)

        txs.forEach(async txid => {
            /* Retrieve transaction details. */
            const txDetails = await Nito.Transaction.details(txid)
            // console.log('UPDATE COINS (tx details)', txDetails)

            /* Set outputs. */
            const outputs = txDetails.outputs

            /* Handle all transaction outputs. */
            outputs.forEach((output, vout) => {
                // console.log('UPDATE COINS (output)', output)

                /* Set satoshi (amount). */
                const satoshis = output.satoshis
                // console.log('UPDATE COINS (satoshis)', satoshis)

                /* Set script public key. */
                const scriptPubKey = output.script

                /* Validate script. */
                if (!scriptPubKey) {
                    return
                }

                /* Set cash addresses. */
                const cashAddress = Nito.Address.toCashAddress(scriptPubKey)
                console.log('UPDATE COINS (cashAddress)', cashAddress, searchAddress)

                /* Initialize chain id. */
                let chainid = null

                /* Initialize WIF. */
                let wif = null

                /* Find account. */
                const account = getters.getAccounts.find(account => {
                    return account.address === searchAddress
                })
                // console.log('ACCOUNT', account)

                /* Validate account. */
                if (account) {
                    /* Set chain id. */
                    chainid = account.chainid

                    /* Set WIF. */
                    wif = account.wif
                }

                /* Validate search address. */
                // if (cashAddress.includes(searchAddress)) {
                if (cashAddress === searchAddress) {
                    /* Set status. */
                    const status = 'active'

                    /* Set legacy address. */
                    const legacyAddress = Nito.Address
                        .toLegacyAddress(cashAddress)

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
                        status,
                        txid,
                        vout,
                        satoshis,
                        wif,
                        // cashAddress: searchAddress,
                        // legacyAddress: Nito.Address.toLegacyAddress(searchAddress),
                        cashAddress,
                        legacyAddress,
                    }
                    console.log('UPDATE COINS (coin)', coin)

                    /* Set coin id. */
                    const coinid = `${coin.txid}:${coin.vout}`

                    /* Validate new coin. */
                    if (!coins[coinid]) {
                        /* Create coin package. */
                        const pkg = {
                            chainid,
                            coin,
                        }

                        /* Add new coin. */
                        dispatch('addCoin', pkg)
                    } else {
                        // console.error('Coin already exists in the purse.')
                    }
                }

            }) // outputs.forEach()

        }) // txs.forEach()

    }) // searchDetails.forEach()

}

/* Export module. */
export default updateCoins
