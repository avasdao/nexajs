/* Import (library) modules. */
import { mnemonicToSeed } from '@nexajs/hdnode'

/* Import (local) modules. */
import getUnspentOutputs from './getUnspentOutputs.js'

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

/* Setup (non-ESM) debugger. */
import debugFactory from 'debug'
const debug = debugFactory('nexa:purse:sendUtxo')

export default async (_params) => {
    debug('Sending UTXO...')
    debug(JSON.stringify(_params, null, 2))

    /* Instantiate Libauth crypto interfaces. */
    const ripemd160 = await instantiateRipemd160()
    const secp256k1 = await instantiateSecp256k1()
    const sha256 = await instantiateSha256()
    const sha512 = await instantiateSha512()

    if (!_params) {
        throw new Error(`Oops! You are missing Transaction parameters.`)
    }

    /* Set mnemonic. */
    const mnemonic = _params.mnemonic

    /* Set receiving address. */
    const receiver = _params.receiver

    /* Calculate seed. */
    const seed = mnemonicToSeed(mnemonic).slice(2)
    // console.log('SEED', seed)

    /* Initialize HD node. */
    const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)
    // console.log('\n  HD Node:', node)

    /* Derive a child from the Master node */
    const child = deriveHdPath({ ripemd160, sha256, sha512, secp256k1 }, node, `m/44'/29223'/0'/0/0`)
    // console.log('CHILD', child)

    const privateKey = child.privateKey
    console.log('PRIVATE KEY (hex)', binToHex(privateKey))

    /* Derive the corresponding public key. */
    const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
    // console.log('PUBLIC KEY', publicKey)
    // console.log('PUBLIC KEY (hex)', binToHex(publicKey))

    /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
    const scriptPushPubKey = encodeDataPush(publicKey)
    // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);

    const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
    // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

    const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
    // console.info('  Public key hash Script:', binToHex(pkhScript))

    /* Encode the public key hash into a P2PKH nexa address. */
    const nexaAddress = encodeAddress(
        'nexa', 'TEMPLATE', pkhScript)
    console.info('\n  Nexa address:', nexaAddress)

    // Encode Private Key WIF.
    const privateKeyWIF = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
    // console.log('PRIVATE KEY (WIF):', privateKeyWIF)

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    const unspentOutputs = await getUnspentOutputs(nexaAddress)
    console.log('\n  Unspent outputs:\n', unspentOutputs)

    if (unspentOutputs.length === 0) {
        return console.error('There are NO unspent outputs available.')
    }

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
