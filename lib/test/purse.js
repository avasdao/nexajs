/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Ethers.js helpers. */
import { entropyToMnemonic } from '@ethersproject/hdnode'
import { mnemonicToEntropy } from '@ethersproject/hdnode'
import { mnemonicToSeed } from '@ethersproject/hdnode'
import { isValidMnemonic } from '@ethersproject/hdnode'
import { randomBytes } from '@ethersproject/random'

/* Import library modules. */


/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
import { createTransaction } from '../index.js'
import { encodeAddress } from '../index.js'
import { getUnspentOutputs } from '../index.js'
import { sendUtxo } from '../index.js'

/* Libauth helpers. */
import {
    binToHex,
    CashAddressType,
    deriveHdPrivateNodeFromSeed,
    encodeCashAddress,
    encodePrivateKeyWif,
    hexToBin,
    hmacSha512,
    instantiateSha256,
    instantiateSha512,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony'
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

    describe( 'Purse -> Ethers', () => {
        it( 'should test Ethers libraries', () => {
            const myBytes = randomBytes(32)
            console.log('MY BYTES', myBytes)
            console.log('MY BYTES', Buffer.from(myBytes).toString('hex'))
        } )
    } )

    describe( 'Purse -> Mnemonic', () => {
        it( 'should validate the test mnemonic', () => {
            console.log('Test mnemonic:', TEST_MNEMONIC)
            const isValid = isValidMnemonic(TEST_MNEMONIC)
            // expect(isValid).to.be.true
        } )
    } )

    describe( 'Purse -> Withdraw', () => {
        it( 'should prepare to Withdraw all funds on an address', async () => {
            console.log('TEST_MNEMONIC', TEST_MNEMONIC)

            const isValid = isValidMnemonic(TEST_MNEMONIC)
            console.log('IS VALID TEST_MNEMONIC', isValid)

            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            console.log('ENTROPY', entropy)

            const myBytes = randomBytes(16)

            const e2m = entropyToMnemonic(myBytes)
            console.log('ENTROPY TO TEST_MNEMONIC', e2m)

            const seed = mnemonicToSeed(TEST_MNEMONIC).slice(2)
            console.log('SEED', seed)

            const binSeed = hexToBin(seed)
            console.log('BIN SEED', binSeed)

            /* Instantiate Libauth crypto interfaces. */
            const secp256k1 = await instantiateSecp256k1()
            const sha256 = await instantiateSha256()
            const ripemd160 = await instantiateRipemd160()

            const sha512 = await instantiateSha512()
            console.log('SHA512', sha512);
            // const hmac = await hmacSha512()
            const node = deriveHdPrivateNodeFromSeed({ sha512 }, binSeed)
            console.log('HD NODE', node);
            // console.log('HD NODE (privateKey)', binToHex(node.privateKey));

            /* Format the private key to binary. */
            // NOTE: Start at position 2 to omit the 0x prefix added by toHexString.
            const privateKey = node.privateKey
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
            const nexaAddress = encodeAddress(
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
            const transactionTemplate = await createTransaction(
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
