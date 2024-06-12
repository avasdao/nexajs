/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')
const debug = require('debug')('shuffle:utils:prepareinsouts')
const Nito = require('nitojs')

/* Set dust threshold. */
const DUST_THRESHOLD = 546

/**
 * Prepare Shuffle Ins and Outs
 *
 * Normalizes and sorts all the transaction inputs and outputs so the
 * transaction building logic can be kept clean and simple.
 *
 * This function also makes sure inputs haven't been spent
 * since they were declared.
 */
const prepareShuffleInsAndOuts = async function (options) {
    /* Set fee (in satoshis). */
    const feeSatoshis = options.feeSatoshis

    /* Initialize shuffle amount (satoshis). */
    // NOTE: If this field is left blank, it will be set later
    //       to the lowest valued coin - fees.
    let shuffleAmountSatoshis = options.shuffleAmountSatoshis

    /* Attach the players input address to their input. */
    const players = options.players.map((onePlayer) => {
        /* Set public key. */
        const pubKey = new bch.PublicKey(onePlayer.coin.publicKey)

        /* Set output index. */
        const vout = Number(onePlayer.coin.vout)

        /* Set cash address. */
        const cashAddress = pubKey.toAddress().toString()

        /* Set legacy address. */
        const legacyAddress = Nito.Address.toLegacyAddress(cashAddress)

        /* Update player data. */
        Object.assign(onePlayer.coin, {
            vout,
            pubKey,
            legacyAddress,
            cashAddress,
        })
        // debug('One player:', onePlayer)

        /* Return player. */
        return onePlayer
    })
    debug('Preparing to shuffle ins and outs (players):', players)

    /* Set address to fetch. */
    const addressesToFetch = players.map(obj => obj.coin.legacyAddress)
    // debug('Address to fetch:', addressesToFetch)

    /* Set compatibility flag. */
    // NOTE: Provides BITBOX data format.
    const comp = true

    /* Request UTXO data. */
    const utxoData = await Nito.Address
        .utxo(addressesToFetch, comp)
        .catch(err => {
            /* eslint-disable-next-line no-console */
            console.error('Something went wrong fetching UTXO data:', err)
            throw new Error(err)
        })
    // debug('UXTO data:', utxoData)

    /* Initialize ALL inputs. */
    const allInputs = []

    /* Loop through ALL players. */
    // NOTE: Sorted by transaction id, and output index.
    for (let onePlayer of _.orderBy(players, ['coin.txid', 'coin.vout'], ['asc', 'asc'])) {
        /* Set address in question. */
        // const addressInQuestion = _.find(utxoData, {
        //     legacyAddress: onePlayer.coin.legacyAddress
        // })
        const addressInQuestion = utxoData.find(data => {
            return data.legacyAddress === onePlayer.coin.legacyAddress
        })
        // debug('Address in question:', addressInQuestion, onePlayer.coin.legacyAddress)

        /* Validate address in question. */
        if (!addressInQuestion) {
            /* Set error. */
            const errorToThrow = new Error('VERIFY_ERROR')

            /* Update error. */
            Object.assign(errorToThrow, {
                blame: {
                    reason: 'BAD_INPUT',
                    player: onePlayer
                }
            })

            // debug('Player (coin):', onePlayer.coin)
            // debug('Player (change):', onePlayer.change)
            // debug('Player (finalOutputAddresses):', onePlayer.finalOutputAddresses)

            throw errorToThrow
        }

        /* Set coin in question. */
        // const coinInQuestion = _.find(addressInQuestion.utxos, {
        //     txid: onePlayer.coin.txid,
        //     vout: onePlayer.coin.vout
        // })
        const coinInQuestion = addressInQuestion.utxos.find(utxo => {
            return (
                utxo.txid === onePlayer.coin.txid &&
                Number(utxo.vout) === Number(onePlayer.coin.vout)
            )
        })

        /* Validate coin in question. */
        if (!coinInQuestion) {
            /* Set error. */
            const errorToThrow = new Error('VERIFY_ERROR')

            /* Add blame. */
            Object.assign(errorToThrow, {
                blame: {
                    reason: 'BAD_INPUT',
                    player: onePlayer
                }
            })

            /* Throw error. */
            throw errorToThrow
        }

        /* Add to ALL inputs. */
        allInputs.push({
            player: _.cloneDeep(onePlayer),
            txid: onePlayer.coin.txid,

            // The output order of this coin inside it's
            // previous transaction.  The old index.
            vout: Number(onePlayer.coin.vout),

            // The order in which this coin will be included
            // in the transaction we're building now. This is
            // it's input index.  We will order by this.
            vin: allInputs.length,
            legacyAddress: addressInQuestion.legacyAddress,
            cashAddress: addressInQuestion.cashAddress,
            amountBch: coinInQuestion.amount,
            satoshis: coinInQuestion.satoshis,
            // confirmations: coinInQuestion.confirmations,
            // confirmations: 1, // FIXME: Any side-effects? Do we need to retrieve this value??
            scriptPubKey: addressInQuestion.scriptPubKey
        })
    }

    /* Validate shuffle amount (satoshis). */
    // NOTE: Dynamically set the shuffleAmount if it wasn't
    //       specified as an argument to this function.
    if (!shuffleAmountSatoshis) {
        shuffleAmountSatoshis = _.minBy(
            allInputs, 'satoshis')['satoshis'] - feeSatoshis
    }

    /* Set final output addresses. */
    const finalOutputAddresses = players[0].finalOutputAddresses

    /* Initialize all output. */
    // NOTE: Outputs are in the order they arrived in the packets.
    const allOutputs = []

    /* Loop through ALL final output addresses. */
    for (let n = 0; n < finalOutputAddresses.length; n++) {
        allOutputs.push({
            vout: n,
            legacyAddress: finalOutputAddresses[n],
            cashAddress: Nito.Address.toCashAddress(finalOutputAddresses[n]),
            satoshis: shuffleAmountSatoshis
        })
    }

    /* Set change exclusion address. */
    // NOTE: Since the shuffle amount (according to CashShuffle v300 spec)
    //       is set to the smallest coin value minus fees within the round,
    //       this player won't get change.
    const changeAddressToExclude = _.get(
        _.minBy(allInputs, 'satoshis'), 'player.change.legacyAddress')

    /* Set change outputs to add. */
    const changeOutputsToAdd = _.reduce(players, function (keepers, onePlayer) {
        if (onePlayer.change.legacyAddress !== changeAddressToExclude) {
            /* Set player input. */
            const playerInput = _.find(
                allInputs, { legacyAddress: onePlayer.coin.legacyAddress })

            /* Add output to keepers. */
            keepers.push({
                player: onePlayer,
                verificationKey: onePlayer.verificationKey,
                legacyAddress: onePlayer.change.legacyAddress,
                cashAddress: Nito.Address.toCashAddress(onePlayer.change.legacyAddress),
                satoshis: playerInput.satoshis - (shuffleAmountSatoshis + feeSatoshis)
            })
        }

        /* Return keepers. */
        return keepers
    }, [])

    /* Loop through ALL change outputs. */
    // NOTE: Order the change amounts based on their verification
    //       key then add them to the outputs array.
    for (let oneOutput of _.orderBy(changeOutputsToAdd, ['verificationKey'], ['asc'])) {
        if (oneOutput.satoshis >= DUST_THRESHOLD) {
            allOutputs.push(
                Object.assign(oneOutput, { vout: allOutputs.length })
            )
        }
    }

    /* Return complete shuffle package. */
    return {
        inputs: _.orderBy(allInputs, ['vin'], ['asc']),
        outputs: _.orderBy(allOutputs, ['vout'], ['asc']),
        shuffleAmountSatoshis,
        feeSatoshis,
        players
    }
}

/* Export module. */
module.exports = prepareShuffleInsAndOuts
