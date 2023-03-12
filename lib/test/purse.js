/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Import class. */
import { Purse } from '../index.js'

/* Import (Class) modules. */
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

const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'
const NEXA_TEST_ADDRESS = 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76';

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> UTXO -> Send', () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
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
        } )
    } )

    describe( 'Purse -> Withdraw', () => {
        it( 'should prepare to Withdraw all funds on an address', async () => {
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
        } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
