#!/usr/bin/env node

/* Import classes. */
import { Address } from '../index.js'
import { Purse } from '../index.js'
import { Rpc } from '../index.js'

/* Import (Address) modules. */
import { decodeAddress } from '../index.js'
import { encodeAddress } from '../index.js'

/* Import (Purse) modules. */
import { sendUtxo } from '../index.js'
import {
    binToHex,
    // CashAddressType,
    // encodeCashAddress,
    encodePrivateKeyWif,
    hexToBin,
    instantiateSha256,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import (RPC) modules. */
import { callNode } from '../index.js'
import { connectToNode } from '../index.js'

// import { CashAddressType } from '@/libs/_CashAddressType.js'
// import { encodeCashAddress } from '@/libs/_encodeCashAddress.js'
//
// import { ethers } from 'ethers'
// import NexaAddr from 'nexaaddrjs'
// import { OpcodesBTC } from '@bitauth/libauth'
//
// import { useProfileStore } from '@/stores/profile'
//
// import broadcast from '../../libs/broadcast.js'
// import cashaddr from '../../libs/cashaddr.js'
// import createBCHTransaction from '../../libs/createBCHTransaction.js'
// import createNEXATransaction from '../../libs/createNEXATransaction.js'
// import getUnspentOutputs from '../../libs/getUnspentOutputs.js'



const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'
const NEXA_TEST_ADDRESS = 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76';

const debugAddress = () => {
    /* Initialize Address. */
    const address = new Address('nexa:nqblahblahblah')

    address.test()
    console.log()

    address.toString(true)
    console.log()

    const { prefix, type, hash } = Address.decode(NEXA_TEST_ADDRESS)
    console.log(prefix) // 'nexatest'
    console.log(type) // 'P2PKH'
    console.log(hash) // Uint8Array [... ]
    console.log(Address.encode(prefix, type, hash)) // 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76'
    console.log()

    const encoded = encodeAddress(prefix, type, hash)
    console.log('Encoded Address\n%s', encoded)
    console.log()

    const decoded = decodeAddress(NEXA_TEST_ADDRESS)
    console.log('Decoded Address\n%s', decoded)
    console.log()
}

const debugPurse = () => {
    /* Initialize Purse. */
    const purse = new Purse(PRIVATE_KEY)

    purse.test()
    console.log()

    Purse.staticTest()
    console.log()

    /* Private keys. */
    console.log('Private Key (constructor) :', purse.privateKey)
    purse.privateKey = 'my-new-super-secure-key'
    console.log('Private Key (setter)      :', purse.privateKey)
    console.log()

    /* UTXOs. */
    sendUtxo()
    console.log()

    // withdraw()

}

/**
 * Withdraw
 */
const withdraw = async () => {
    /* Set (BIP39) seed phrase. */
    const mnemonic = Profile.mnemonic
    console.log('MNEMONIC', mnemonic)

    const isValidMnemonic = ethers.utils.isValidMnemonic(mnemonic)
    // console.log('IS VALID MNEMONIC', isValidMnemonic)

    const seed = ethers.utils.mnemonicToSeed(mnemonic)
    console.log('SEED', seed)

    /* Generate signature hash and entropy. */
    const signatureHash = ethers.utils.id(seed)
    // console.log('SIGNATURE HASH', signatureHash)

    const signatureEntropy = ethers.BigNumber.from(signatureHash)
    // console.log('SIGNATURE ENTROPY', signatureEntropy)

    /* Instantiate Libauth crypto interfaces. */
    const secp256k1 = await instantiateSecp256k1()
    const sha256 = await instantiateSha256()
    const ripemd160 = await instantiateRipemd160()

    /* Generate private key entropy using Hop Wallet Prime. */
    const privateKeyEntropy = ethers.BigNumber.from(signatureHash)
    // const privateKeyEntropy = signatureEntropy
    //     .mod(this.$store.state.HOP_WALLET_PRIME)

    /* Format the private key to binary. */
    // NOTE: Start at position 2 to omit the 0x prefix added by toHexString.
    const privateKey = hexToBin(
        privateKeyEntropy.toHexString().substring(2))
    // console.log('PRIVATE KEY', privateKey)
    console.log('PRIVATE KEY (hex)', binToHex(privateKey))

    // Derive the corresponding public key.
    const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
    // console.log('PUBLIC KEY', publicKey)
    console.log('PUBLIC KEY (hex)', binToHex(publicKey))

    /* Hash the public key hash according to the P2PKH scheme. */
    const publicKeyHash = ripemd160.hash(sha256.hash(publicKey))
    // console.log('PUBLIC KEY HASH', publicKeyHash)
    console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))

    const myScript = hexToBin('17005114' + binToHex(publicKeyHash))
    console.log('PUBLIC KEY HASH (template)', myScript)
    console.log('PUBLIC KEY HASH (hex template)', binToHex(myScript))

    /* Encode the public key hash into a P2PKH cash address. */
    const cashAddress = encodeCashAddress(
        'bitcoincash', CashAddressType.P2PKH, publicKeyHash)
    console.log('CASH ADDRESS', cashAddress)

    /* Encode the public key hash into a P2PKH nexa address. */
    const nexaAddress = NexaAddr.encode(
        'nexa', 'TEMPLATE', myScript)
    console.log('NEXA ADDRESS', nexaAddress)

    // const nexaAddress = cashaddr.encode('nexa', 'P2PKH', publicKeyHash)
    // const nexaAddress2 = cashaddr.encode('nexa', 'TEMPLATE', publicKeyHash)
    // console.log('NEXA ADDRESS 2', nexaAddress2)

    // const nexaAddress3 = encodeCashAddress(
    //     'nexa', CashAddressType.P2PKH, publicKeyHash)
    // console.log('NEXA ADDRESS 3', nexaAddress3)

    // Encode Private Key WIF.
    const privateKeyWIF = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
    console.log('PRIVATE KEY (WIF):', privateKeyWIF)

    // Fetch all unspent transaction outputs for the temporary in-browser wallet.
    // const unspentOutputs = await getUnspentOutputs(cashAddress)
    const unspentOutputs = await getUnspentOutputs(nexaAddress)
    console.log('UNSPENT OUTPUTS', unspentOutputs)

    if (unspentOutputs.length === 0) {
        return console.error('There are NO unspent outputs available.')
    }

    // Create a bridge transaction without miner fee to determine the transaction size and therefor the miner fee.
    const transactionTemplate = await createNEXATransaction(
        privateKeyWIF,
        unspentOutputs,
        Profile.bchTestAddress,
        0,
    )
    return console.log('TRANSACTION (hex)', binToHex(transactionTemplate))

    /* Set miner fee. */
    // NOTE: We used 1.1 (an extra 0.1) for added (fee) security.
    const minerFee = Math.floor(1.1 * transactionTemplate.byteLength)
    console.info(`Calculated mining fee: [ ${minerFee} ] sats`) // eslint-disable-line no-console

    // If there's funds and it matches our expectation, forward it to the bridge.
    const bridgeTransaction = await createNEXATransaction(
        privateKeyWIF,
        unspentOutputs,
        Profile.bchTestAddress,
        minerFee,
    )
    // console.log('TRANSACTION', bridgeTransaction)
    console.log('TRANSACTION (hex)', binToHex(bridgeTransaction))

    // Broadcast transaction
    // broadcast(binToHex(bridgeTransaction))
}

const debugRpc = async () => {
    /* Initialize RPC. */
    // const purse = new Rpc()

    let result
    let params

    params = []
    result = await Rpc.call('getwalletinfo', params, {
        username: 'user',
        password: 'password',
    })
    .catch(err => console.error(err))
    // result = await call('getwalletinfo', params, {
    //     username: 'user',
    //     password: 'password',
    // })
    // .catch(err => console.error(err))
    console.log('RPC RESULT', result)

    params = [
        'nexa:qra4l7xn7t9kpppnxy5u7xe40jltsghggvmtr4jz0z',
        'HzNg+qPxQN8YvS/6k//7ycfClOesz40uydZ+VOoUz6hIdsR3x7BV61DqbudKMNf66ofGGVrlgD9NDssANO7+o08=',
        'awesomenexa.org_nexid_login_f4ce73a0-acbd-41c9-9d2e-49a807708db1',
    ]
    result = await callNode('verifymessage', params, {
        username: 'user',
        password: 'password',
    })
    .catch(err => console.error(err))
    console.log('RPC RESULT', result)

}

// debugAddress()
debugPurse()
// debugRpc()
