/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendCoin')

/* Import (library) modules. */
import { encodeAddress } from '@nexajs/address'
import { broadcast } from '@nexajs/blockchain'

import { Transaction } from '@nexajs/transaction'

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
export default async (_coins, _receivers, _autoFee = true) => {
    debug('Sending coins', _coins, _receivers)
    // console.log('Sending coins', _coins, _receivers)

    /* Initialize coin. */
    let coins

    /* Initialize receivers. */
    let receivers

    /* Validate coin. */
    if (_coins) {
        /* Validate coins. */
        if (Array.isArray(_coins)) {
            coins = _coins
        } else {
            coins = [_coins]
        }
    } else {
        throw new Error(`The coin(s) provided are invalid [ ${JSON.stringify(_coins)} ]`)
    }

    /* Validate receivers. */
    if (Array.isArray(_receivers)) {
        receivers = _receivers
    } else {
        receivers = [_receivers]
    }

    /* Set outpoint. */
    const outputpoint = coins[0].outpoint

    /* Set satoshis. */
    const satoshis = coins[0].satoshis

    /* Validate satoshis (sending to receiver). */
    if (!satoshis) {
        throw new Error('No transaction value.')
    }

    /* Set public key (hash) script. */
    // const script = Address.toPubKeyHash(coin.cashAddress)

    /* Initialize private key. */
    // const privateKey = new bch.PrivateKey(coin.wif)

    /* Build UTXO. */
    // const utxo = { txId, outputIndex, address, script, satoshis }
    // debug('Sending (utxo):', utxo)
    // console.log('SEND COIN (utxo):', utxo)

    /* Build transaction. */
    // const transaction = new bch.Transaction()
    //     .from(utxo)

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
    // receivers.forEach(_receiver => {
    //     /* Validate receiver. */
    //     if (!_receiver.address) {
    //         throw new Error(`Invalid receiver address [ ${JSON.stringify(_receiver.address)} ]`)
    //     }
    //
    //     if (!_receiver.satoshis) {
    //         throw new Error(`Invalid receiver value [ ${JSON.stringify(_receiver.satoshis)} ]`)
    //     }
    //
    //     /* Set receipient address. */
    //     // TODO: Add protection against accidental legacy address.
    //     const address = _receiver.address
    //
    //     /* Initialize satoshis. */
    //     let satoshis = null
    //
    //     if (_autoFee) {
    //         /* Calculate fee per recipient. */
    //         // NOTE: Fee is split evenly between all recipients.
    //         const feePerRecipient = Math.ceil(byteCount / receivers.length)
    //
    //         /* Calculate satoshis. */
    //         satoshis = _receiver.satoshis - feePerRecipient
    //
    //         /* Add receiver to transaction. */
    //         transaction.to(address, satoshis)
    //     } else {
    //         /* Set satoshis. */
    //         satoshis = _receiver.satoshis
    //
    //         /* Add receiver to transaction. */
    //         transaction.to(address, satoshis)
    //     }
    //
    //     /* Calculate transaction total. */
    //     txAmount += satoshis
    // })
    // debug('Transaction satoshis (incl. fee):', txAmount)

    /* Validate dust amount. */
    // if (txAmount < DUST_SATOSHIS) {
    //     throw new Error(`Amount is too low. Minimum is [ ${DUST_SATOSHIS} ] satoshis.`)
    // }

    /* Sign transaction. */
    // transaction.sign(privateKey)
    // debug('Raw transaction (hex):', transaction.toString())
    // console.info('Raw transaction:', transaction) // eslint-disable-line no-console
    // console.info('Raw transaction (hex):', ) // eslint-disable-line no-console

    /* Broadcast transaction to network. */
    // return await Transaction
    //     .sendRawTransaction(transaction.toString())
    //     .catch(err => {
    //         console.error(err) // eslint-disable-line no-console
    //     })


    const transaction = new Transaction()
    console.log('TRANSACTION-1', transaction)

    const unspents = [{
        outpoint: coins[0].outpoint,
        satoshis: coins[0].satoshis,
    }]

    // Create a bridge transaction without miner fee to determine the transaction size and therefor the miner fee.
    await transaction
        .build(
            coins[0].wif,
            unspents,
            receivers[0],
        )
        .catch(err => console.error(err))
    console.log('TRANSACTION-2', transaction)
    // console.log('TRANSACTION (hex)', binToHex(transactionTemplate))

    /* Set miner fee. */
    // NOTE: We used 1.1 (an extra 0.1) for added (fee) security.
    // const minerFee = Math.floor(1.1 * transactionTemplate.length)
    // console.info(`Calculated mining fee: [ ${minerFee} ] sats`) // eslint-disable-line no-console

    // If there's funds and it matches our expectation, forward it to the bridge.
    // const bridgeTransaction = await createNexaTransaction(
    //     privateKeyWIF,
    //     unspentOutputs,
    //     receiver,
    //     minerFee,
    // )

    console.log('\n  Transaction (json)', transaction.json)
    console.log('\n  Transaction (hex)', transaction.raw)

    // Broadcast transaction
    return broadcast(transaction.raw)
}
