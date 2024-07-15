/**
 * Get Shuffle Transaction and Signature
 *
 * Builds the partially signed transaction that will eventually be broadcast
 * to the the network.
 *
 * It returns a serialized (as JSON ) version of the transaction before any
 * signatures are added as well as the fully formed transaction with only our
 * signature applied.
 */
export default (options) => {
    // console.log('Get Shuffle Tx and Signature (options):', options)

    /* Set inputs. */
    const inputs = options.inputs

    /* Set outputs. */
    const outputs = options.outputs

    /* Set shuffle transaction. */
    const shuffleTransaction = new bch.Transaction()

    /* Initialize my input. */
    let myInput

    /* Loop through ALL inputs. */
    for (let oneInput of inputs) {
        /* Set player public key. */
        const playerPubKey = bch.PublicKey(oneInput.player.coin.publicKey)

        /* Set transaction input. */
        const txInput = new bch.Transaction.UnspentOutput({
            txid: oneInput.txid,
            outputIndex: oneInput.vout,
            address: playerPubKey.toAddress(),
            scriptPubKey: bch.Script.fromAddress(playerPubKey.toAddress()),
            satoshis: oneInput.satoshis
        })
        console.log('Transaction input:', txInput)

        /* Set shuffle transaction. */
        shuffleTransaction.from(txInput)

        // WARNING: For some stupid reason, bitcoincashjs's `PublicKeyHashInput`
        //          instances are showing the outputIndex field which should be
        //          type number or string as type 'undefined'.
        //          Idfk, just be aware.
        const grabIt = _.find(shuffleTransaction.inputs, function (txInput) {
            /* Set buffer string. */
            const bufferString = txInput.prevTxId.toString('hex')

            return oneInput.txid === bufferString && Number(oneInput.vout) === Number(txInput.outputIndex)
        })

        /* Fix the sequence number. */
        Object.assign(grabIt, { sequenceNumber: 0xfffffffe })

        /* Add public key to input's script. */
        grabIt.setScript(bch.Script('21' + oneInput.player.coin.publicKey))

        /* Validate our input. */
        if (oneInput.player.isMe) {
            // console.log('My (oneInput):', oneInput)
            myInput = oneInput
        }
    }

    /* Loop through ALL outputs. */
    for (let oneOutput of outputs) {
        // console.log('Shuffle transaction (oneOutput)',
        //     oneOutput,
        //     'legacyAddress', oneOutput.legacyAddress,
        //     'cashAddress', oneOutput.cashAddress,
        //     'satoshis', oneOutput.satoshis
        // )
        shuffleTransaction.to(oneOutput.cashAddress, oneOutput.satoshis)
    }

    /* Set version 1. */
    shuffleTransaction.setVersion(1)

    /* Set pre-signed transaction. */
    const preSignedTx = shuffleTransaction.toObject()
    console.log('Get shuffle transaction and signature (preSignedTx):', preSignedTx)

    /* Sign transaction. */
    shuffleTransaction.sign(
        new bch.PrivateKey.fromWIF(myInput.player.coin.wif))

    /* Set signature instance. */
    const sigInstance = shuffleTransaction
        .getSignatures(myInput.player.coin.wif)[0]
    // console.log('Signature instance:', sigInstance)

    /* Return transaction / signature package. */
    return {
        serialized: preSignedTx,
        tx: shuffleTransaction,
        signature: sigInstance.signature.toTxFormat().toString('hex')
    }
}
