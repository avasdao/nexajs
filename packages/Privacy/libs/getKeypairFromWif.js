/* Import modules. */
import Nexa from '@nexajs'


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
    console.log('Get keypair from WIF (cashAddress):', coin.cashAddress)

    /* Set legacy address. */
    coin.legacyAddress = Nito.Address.toLegacyAddress(coin.cashAddress)
    console.log('Get keypair from WIF (legacyAddress):', coin.legacyAddress)

    /* Return coin. */
    return coin
}

/* Export module. */
module.exports = getKeypairFromWif
