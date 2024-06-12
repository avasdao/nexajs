/* Import core modules. */
const _ = require('lodash')
const bch = require('bitcore-lib-cash')
const debug = require('debug')('shuffle:utils')

/* Import local modules. */
const getCoinDetails = require('./_utils/getCoinDetails')
const getKeypairFromWif = require('./_utils/getKeypairFromWif')
const prepareShuffleInsAndOuts = require('./_utils/prepareShuffleInsAndOuts')

/**
 * Check Sufficient Funds
 */
const checkSufficientFunds = function (inputs, amount) {
    debug('Funds verification (amount):', amount)
    // Currently this is done in the `getCoinDetails` function
    // and it's called just before we add the player to the round.
    // It's also done as we're building the shuffle transaction.
    // I want to break this functionality out so we can check from
    // any time.
}

/**
 * Verify Transaction Signature
 */
const verifyTransactionSignature = function (
    shuffleTxInstance, inputSigData, publicKeyHexOfSigner
) {
    // debug('Verify transaction signature',
    //     'shuffleTxInstance', shuffleTxInstance,
    //     'inputSigData', inputSigData,
    //     'publicKeyHexOfSigner', publicKeyHexOfSigner
    // )

    /* Set input to sign. */
    const inputToSign = _.reduce(
        shuffleTxInstance.inputs, function (keeper, oneInput, arrayIndex) {
            // If we already found the right input, pass it through
            // without bothering to check the others;
            if (keeper) {
                return keeper
            }

            const asJson = oneInput.toObject()

            if (inputSigData.prevTxId === asJson.prevTxId && Number(inputSigData.vout) === Number(asJson.outputIndex)) {
                return {
                    input: oneInput,
                    inputIndex: arrayIndex
                }
            } else {
                return undefined
            }
        }, undefined)
    // debug('Input to sign:', inputToSign)

    /* Validate input to sign. */
    if (!inputToSign) {
        return false
    }

    /* Set signer public key. */
    const signerPublicKey = bch.PublicKey(publicKeyHexOfSigner)

    /* Set signature instance. */
    const signatureInstance = bch.crypto.Signature
        .fromTxFormat(Buffer.from(inputSigData.signature, 'hex'))
    // debug('Signature instance:', signatureInstance)

    /* Set signature object. */
    const signatureObject = {
        signature: signatureInstance,
        publicKey: signerPublicKey,
        inputIndex: inputToSign.inputIndex,
        sigtype: signatureInstance.nhashtype
    }
    // debug('Signature object:', signatureObject)

    /* Initialize verification results. */
    let verificationResults = false

    try {
        verificationResults = inputToSign.input
            .isValidSignature(shuffleTxInstance, signatureObject)
    } catch (nope) {
        console.error(nope) // eslint-disable-line no-console
        verificationResults = false
    }
    // debug('Verification results:', verificationResults)

    /* Validate verification results. */
    if (verificationResults) {
        return {
            success: true,
            inputIndex: signatureObject.inputIndex,
            signature: signatureObject
        }
    } else {
        return {
            success: false
        }
    }
}

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
const getShuffleTxAndSignature = function (options) {
    // debug('Get Shuffle Tx and Signature (options):', options)

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
        debug('Transaction input:', txInput)

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
            // debug('My (oneInput):', oneInput)
            myInput = oneInput
        }
    }

    /* Loop through ALL outputs. */
    for (let oneOutput of outputs) {
        // debug('Shuffle transaction (oneOutput)',
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
    debug('Get shuffle transaction and signature (preSignedTx):', preSignedTx)

    /* Sign transaction. */
    shuffleTransaction.sign(
        new bch.PrivateKey.fromWIF(myInput.player.coin.wif))

    /* Set signature instance. */
    const sigInstance = shuffleTransaction
        .getSignatures(myInput.player.coin.wif)[0]
    // debug('Signature instance:', sigInstance)

    /* Return transaction / signature package. */
    return {
        serialized: preSignedTx,
        tx: shuffleTransaction,
        signature: sigInstance.signature.toTxFormat().toString('hex')
    }
}

/**
 * Build Shuffle Transaction
 *
 * NOTE: FOR DEVELOPMENT PURPOSE ONLY
 *       ----------------------------
 *       An intermediary function, used to switch between the different
 *       transaction building methods currently being evaluated.
 */
const buildShuffleTransaction = async function (options) {
    // debug('Build shuffle transaction (options):', options)
    /* Initialize ins and outs. */
    let insAndOuts

    try {
        insAndOuts = await this.prepareShuffleInsAndOuts({
            players: options.players,
            feeSatoshis: options.feeSatoshis
        })
    } catch (nope) {
        console.error('cannot prepare inputs and outputs for shuffle Transaction') // eslint-disable-line no-console
        throw nope
    }
    debug('Build shuffle transaction (insAndOuts):', insAndOuts)

    /* Set shuffle transaction data. */
    const shuffleTxData = await this.getShuffleTxAndSignature({
        inputs: insAndOuts.inputs,
        outputs: insAndOuts.outputs
    })
    debug('Build shuffle transaction (shuffleTxData):', shuffleTxData)

    /* Return the results. */
    return {
        tx: shuffleTxData.tx,
        inputs: insAndOuts.inputs,
        outputs: insAndOuts.outputs,
        serialized: shuffleTxData.serialized,
        signatureBase64: Buffer
            .from(shuffleTxData.signature, 'utf-8')
            .toString('base64')
    }
}

/* Export module. */
module.exports = {
    getKeypairFromWif,
    checkSufficientFunds,
    getCoinDetails,
    verifyTransactionSignature,
    prepareShuffleInsAndOuts,
    getShuffleTxAndSignature,
    buildShuffleTransaction
}
