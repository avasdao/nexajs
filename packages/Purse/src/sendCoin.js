/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendCoin')

/* Import (library) modules. */
import { encodeAddress } from '@nexajs/address'
import { broadcast } from '@nexajs/blockchain'
import {
    deriveHdPrivateNodeFromSeed,
    encodePrivateKeyWif,
    mnemonicToSeed
} from '@nexajs/hdnode'
import { createNexaTransaction } from '@nexajs/transaction'

/* Libauth helpers. */
import {
    binToHex,
    deriveHdPath,
    encodeDataPush,
    hexToBin,
    instantiateSha256,
    instantiateSha512,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Set constants. */
import DUST_SATOSHIS from './getDustAmount.js'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()
const sha256 = await instantiateSha256()
const sha512 = await instantiateSha512()

/**
 * Send Coin
 *
 * Simple coin sending to one or more recipients.
 *
 * NOTE: By default, the transaction fee will be automatically calculated
 *       and subtracted from the transaction value.
 *
 * Coin
 *   - wif
 *   - satoshis
 *   - outpoint
 */
export default async (_coin, _receiver, _autoFee = true) => {
    debug('Sending coin', _coin, _receiver)
    // console.log('Sending coin', _coin, _receiver)

    /* Initialize coin. */
    let coin

    /* Initialize receivers. */
    let receivers

    /* Validate coin. */
    if (_coin) {
        coin = _coin
    } else {
        throw new Error(`The coin provided is invalid [ ${JSON.stringify(_coin)} ]`)
    }

    /* Validate receivers. */
    if (Array.isArray(_receiver)) {
        receivers = _receiver
    } else {
        receivers = [_receiver]
    }

    /* Set address. */
    const address = coin.cashAddress

    /* Set transaction id. */
    const txId = coin.txid

    /* Set output index. */
    const outputIndex = coin.vout

    /* Set satoshis. */
    const satoshis = coin.satoshis

    /* Validate satoshis (sending to receiver). */
    if (!satoshis) {
        throw new Error('No transaction value.')
    }

    /* Set public key (hash) script. */
    const script = Address.toPubKeyHash(coin.cashAddress)

    /* Initialize private key. */
    const privateKey = new bch.PrivateKey(coin.wif)

    /* Build UTXO. */
    const utxo = { txId, outputIndex, address, script, satoshis }
    debug('Sending (utxo):', utxo)
    // console.log('SEND COIN (utxo):', utxo)

    /* Build transaction. */
    const transaction = new bch.Transaction()
        .from(utxo)

    /* Initialize (minimum) byte count. */
    // FIXME: We need to properly calculate the fee.
    //        Reference BITBOX `getByteCount` for method.
    // const byteCount = 226
    const byteCount = 270
    debug('Byte count:', byteCount)

    /* Initialize (initial) transaction satoshis. */
    // NOTE: It's the original satoshis - 1 sat/byte for tx size
    // FIXME: Recommendation is to use 1.1 sat/byte
    let txAmount = 0

    /* Handle all receivers. */
    receivers.forEach(_receiver => {
        /* Validate receiver. */
        if (!_receiver.address) {
            throw new Error(`Invalid receiver address [ ${JSON.stringify(_receiver.address)} ]`)
        }

        if (!_receiver.satoshis) {
            throw new Error(`Invalid receiver value [ ${JSON.stringify(_receiver.satoshis)} ]`)
        }

        /* Set receipient address. */
        // TODO: Add protection against accidental legacy address.
        const address = _receiver.address

        /* Initialize satoshis. */
        let satoshis = null

        if (_autoFee) {
            /* Calculate fee per recipient. */
            // NOTE: Fee is split evenly between all recipients.
            const feePerRecipient = Math.ceil(byteCount / receivers.length)

            /* Calculate satoshis. */
            satoshis = _receiver.satoshis - feePerRecipient

            /* Add receiver to transaction. */
            transaction.to(address, satoshis)
        } else {
            /* Set satoshis. */
            satoshis = _receiver.satoshis

            /* Add receiver to transaction. */
            transaction.to(address, satoshis)
        }

        /* Calculate transaction total. */
        txAmount += satoshis
    })
    debug('Transaction satoshis (incl. fee):', txAmount)

    /* Validate dust amount. */
    if (txAmount < DUST_SATOSHIS) {
        throw new Error(`Amount is too low. Minimum is [ ${DUST_SATOSHIS} ] satoshis.`)
    }

    /* Sign transaction. */
    transaction.sign(privateKey)
    debug('Raw transaction (hex):', transaction.toString())
    // console.info('Raw transaction:', transaction) // eslint-disable-line no-console
    // console.info('Raw transaction (hex):', ) // eslint-disable-line no-console

    /* Broadcast transaction to network. */
    return await Transaction
        .sendRawTransaction(transaction.toString())
        .catch(err => {
            console.error(err) // eslint-disable-line no-console
        })




    // Encode Private Key WIF.
    const privateKeyWIF = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
    // console.log('PRIVATE KEY (WIF):', privateKeyWIF)

    // Create a bridge transaction without miner fee to determine the transaction size and therefor the miner fee.
    const transactionTemplate = await createNexaTransaction(
        privateKeyWIF,
        unspentOutputs,
        receiver,
        0,
    )
    // console.log('TRANSACTION (hex)', binToHex(transactionTemplate))

    /* Set miner fee. */
    // NOTE: We used 1.1 (an extra 0.1) for added (fee) security.
    const minerFee = Math.floor(1.1 * transactionTemplate.length)
    // console.info(`Calculated mining fee: [ ${minerFee} ] sats`) // eslint-disable-line no-console

    // If there's funds and it matches our expectation, forward it to the bridge.
    const bridgeTransaction = await createNexaTransaction(
        privateKeyWIF,
        unspentOutputs,
        receiver,
        minerFee,
    )
    console.log('\n  Transaction (hex)', binToHex(bridgeTransaction))

    // Broadcast transaction
    return broadcast(binToHex(bridgeTransaction))

}
