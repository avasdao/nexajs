/* Import modules. */
import Bugsnag from '@bugsnag/js'
import Nexa from 'nexajs'

/**
 * Get (Wallet) History
 *
 * Retrieves ALL accounts held within this wallet, then
 * updates the full history.
 */
const getHistory = async (state, getters) => {
    console.info('Retrieving account history...') // eslint-disable-line no-console

    /* Initialize history. */
    const history = []

    /* Initialize our transactions. */
    const ourTransactions = []

    /* Initialize addresses (array). */
    // const addresses = []

    try {
        /* Initialize HD node. */
        // const hdNode = getters.getHDNode

        /* Set accounts. */
        const accounts = getters.getAddresses('BCH')
        console.log('ALL ACTIVE ACCOUNTS', accounts)

        /* Set addresses. */
        const addresses = accounts.map(account => account.address)
        console.log('ALL ACTIVE ACCOUNT ADDRESES', addresses)

        // FIXME
        // const change = 0

        /* Initialize child node. */
        // const childNode = hdNode.derivePath(`${getters.getDerivationPath('BCH')}/${change}/0`)

        // const address = Nexa.Address.toCashAddress(childNode)
        // console.log('ADDRESS', address)

        // NOTE: Array with maximum of 20 legacy or cash addresses.
        // TODO: Add support for "change" addresses.
        // if (address) {
        //     /* Add address. */
        //     addresses.push(address)
        // }

        /* Retrieve unspent transaction outputs. */
        const utxo = await Nexa.Address.utxo(addresses)
        console.log('UTXOS', utxo)

        /* Retrieve transaction details. */
        const addrDetails = await Nexa.Address.details(addresses)
        console.log('ADDRESS(ES) DETAILS', addrDetails)

        /* Loop through ALL uxtos. */
        addrDetails.forEach(address => {
            // console.log('ADDRESS DETAILS', address)

            /* Retrieve transactions. */
            const transactions = address.transactions

            /* Loop through ALL uxtos. */
            transactions.forEach(async txHash => {
                console.log('TX HASH', txHash)

                /* Validate transaction. */
                if (ourTransactions.includes(txHash)) {
                    /* Already included; so skip. */
                    return
                } else {
                    /* Add to our transactions. */
                    ourTransactions.push(txHash)
                }

                /* Retrieve transaction details. */
                const details = await Nexa.Transaction.details(txHash)
                console.log('TX DETAILS', details)

                /* Set (transaction) hash. */
                const hash = details.txid

                /* Initialize value. */
                let value = 0

                /* Initialize incoming. */
                let incoming = false

                /* Initialize persistence. */
                let persistence = false
                // let persistence = utxo.confirmations > 0 ? true : false

                /* Initialize timestamp. */
                let timestamp = null

                /* Set inputs. */
                const inputs = details.vin

                /* Search inputs. */
                inputs.forEach(input => {
                    // console.log('INPUT CASHADDR', input.cashAddress)

                    /* Validate (matching) transaction. */
                    // FIXME: This "could" fail (or cause problems),
                    //        when sending within the same wallet.
                    if (addresses.includes(input.cashAddress)) {
                        /* Add value. */
                        // value += input.value
                        value = parseInt(details.valueOut * 100000000)

                        /* Validate persistence. */
                        if (details.confirmations > 0) {
                            persistence = true
                        }

                        /* Set timestamp. */
                        timestamp = details.time
                    }
                })

                /* Set outputs. */
                const outputs = details.vout

                /* Search outputs. */
                outputs.forEach(output => {
                    // console.log('OUTPUT CASHADDR', output.scriptPubKey.cashAddrs[0])

                    /* Validate (matching) transaction. */
                    // FIXME: This "could" fail (or cause problems),
                    //        when sending within the same wallet.
                    if (addresses.includes(output.scriptPubKey.cashAddrs[0])) {
                        /* Add value. */
                        value += parseInt(output.value * 100000000)

                        /* Set (incoming) flag. */
                        incoming = true

                        /* Validate persistence. */
                        if (details.confirmations > 0) {
                            persistence = true
                        }

                        /* Set timestamp. */
                        timestamp = details.time
                    }
                })

                /* Build transaction details. */
                const tx = {
                    hash,
                    value,
                    incoming,
                    persistence,
                    timestamp
                }

                console.log('BUILT TX', tx)

                /* Add transaction to history. */
                history.push(tx)

                // console.log('GET HISTORY', history)

                /* Commit history. */
                // if (txIdx === transactions.length - 1) {
                //     commit('setWalletHistory', history)
                // }
            })
        })

        /* Return history. */
        return history
    } catch (err) {
        console.error(err) // eslint-disable-line no-console

        /* Report error. */
        Bugsnag.notify(err)
    }
}

/* Export module. */
export default getHistory
