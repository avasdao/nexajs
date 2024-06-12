/* Import core modules. */
const bch = require('bitcore-lib-cash')
const debug = require('debug')('shuffle:utils:getkeypairwif')
const Nito = require('nitojs')

/**
 * Get Keypair from WIF
 */
const getKeypairFromWif = function (_wif) {
    /* Initialize coin. */
    const coin = {}

    /* Set private key. */
    coin.privateKey = new bch.PrivateKey(_wif)

    /* Set public key. */
    coin.publicKey = coin.privateKey.toPublicKey()

    /* Set cash address. */
    coin.cashAddress = coin.publicKey.toAddress().toString()
    debug('Get keypair from WIF (cashAddress):', coin.cashAddress)

    /* Set legacy address. */
    coin.legacyAddress = Nito.Address.toLegacyAddress(coin.cashAddress)
    debug('Get keypair from WIF (legacyAddress):', coin.legacyAddress)

    /* Return coin. */
    return coin
}

/* Export module. */
module.exports = getKeypairFromWif
