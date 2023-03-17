/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Ethers.js helpers. */
import { entropyToMnemonic } from '@ethersproject/hdnode'
import { mnemonicToEntropy } from '@ethersproject/hdnode'
import { mnemonicToSeed } from '@ethersproject/hdnode'
import { isValidMnemonic } from '@ethersproject/hdnode'
import { randomBytes } from '@ethersproject/random'

/* Import library modules. */
import { broadcast } from '../index.js'

/* Import class. */
import { Purse } from '../index.js'

/* Import library modules. */
import { createNexaTransaction } from '../index.js'
import { encodeAddress } from '../index.js'
import { getUnspentOutputs } from '../index.js'
import { sendUtxo } from '../index.js'

/* Libauth helpers. */
import {
    binToHex,
    CashAddressType,
    // deriveHdPrivateNodeFromSeed,
    deriveHdPrivateNodeChild,
    deriveHdPath,
    encodeCashAddress,
    // encodePrivateKeyWif,
    encodeDataPush,
    hexToBin,
    hmacSha512,
    instantiateSha256,
    instantiateSha512,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

import { deriveHdPrivateNodeFromSeed } from '../index.js'
import { encodePrivateKeyWif } from '../index.js'

const HARDENED_OFFSET = 2147483648

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony'
const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9'
const PRIVATE_KEY = 'a42801c4-40cd-4e8f-aeba-a74f5145ad9b'
const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'Purse Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Purse' class.` )
    } )

    describe( 'Purse -> Ethers -> RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Purse -> Mnemonic', () => {
        it( 'should validate the test mnemonic', () => {
            const isValid = isValidMnemonic(TEST_MNEMONIC)

            expect(isValid).to.be.true
        } )
    } )

    describe( 'Purse -> Ethers -> MnemonicToEntropy', () => {
        it( 'should generate 128-bits of entropy from 12-word mnemonic', () => {
            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            // console.log('ENTROPY', entropy)

            expect(entropy).to.equal('0x11519ca189c85493673aa915e843f788')
        } )
    } )

    describe( 'Purse -> Ethers -> EntropyToMnemonic', () => {
        const entropy = mnemonicToEntropy(TEST_MNEMONIC)

        it( 'should generate a 12-word mnemonic from 128-bits of entropy', () => {
            const mnemonic = entropyToMnemonic(entropy)
            // console.log('ENTROPY TO TEST_MNEMONIC', mnemonic)

            expect(mnemonic).to.equal(TEST_MNEMONIC)
        } )
    } )

    describe( 'Purse -> Ethers -> MnemonicToSeed', () => {
        it( 'should generate a 512-bit seed from a 12-word mnemonic', () => {
            const seed = mnemonicToSeed(TEST_MNEMONIC).slice(2)
            // console.log('SEED', seed)

            expect(seed).to.equal(TEST_SEED)
        } )
    } )

    describe( 'Purse -> UTXO -> BroadcastTransaction', () => {
        it( 'should prepare and sign an UTXO for broadcast to the network', async () => {
            /* Instantiate Libauth crypto interfaces. */
            const ripemd160 = await instantiateRipemd160()
            const secp256k1 = await instantiateSecp256k1()
            const sha256 = await instantiateSha256()
            const sha512 = await instantiateSha512()

            const seed = hexToBin(TEST_SEED)
            // console.log('Binary seed:', seed)
            expect(seed).to.have.length(64)

            const node = deriveHdPrivateNodeFromSeed({ sha512 }, seed)
            // console.log('\n  HD Node:', node)
            expect(node.chainCode).to.have.length(32)
            expect(node.privateKey).to.have.length(32)

            let child
            /* Format the private key to binary. */
            child = deriveHdPath({ ripemd160, sha256, sha512, secp256k1 }, node, `m/44'/29223'/0'`)
            // child = deriveHdPrivateNodeChild({ ripemd160, sha256, sha512, secp256k1 }, node, HARDENED_OFFSET + 44)
            console.log('CHILD', child);
            // console.log('CHILD', child);
            // child = deriveHdPrivateNodeChild({ sha512 }, child, HARDENED_OFFSET + 29223)
            // child = deriveHdPrivateNodeChild({ sha512 }, child, HARDENED_OFFSET + 0)
            const privateKey = child.privateKey
            // const privateKey = child.privateKey
            // console.log('PRIVATE KEY (hex)', binToHex(privateKey))
            // expect(binToHex(privateKey)).to.equal('d0ce89906690fa8ed1fe6709447abb8cf2a2252c8fa559e1051fb3c1aee0c750')
            expect(binToHex(privateKey)).to.equal('bac1aad76d064508b88395a53e383173f1d6000af14dc24247d313c322ef1649')

            /* Derive the corresponding public key. */
            const publicKey = secp256k1.derivePublicKeyCompressed(privateKey)
            // console.log('PUBLIC KEY', publicKey)
            // console.log('PUBLIC KEY (hex)', binToHex(publicKey))
            // expect(binToHex(publicKey)).to.equal('02bd3f95e1b1b90286955c5f99d804b9baa8f825bf9bbcb087aa3b5546d5eb0c7d')
            expect(binToHex(publicKey)).to.equal('0331ac8b4dc0e25e9e88e24c455b51cae9e97518a14b3f2adc71853569bdb599e6')

            /* Hash the public key hash according to the P2PKH/P2PKT scheme. */
            const scriptPushPubKey = encodeDataPush(publicKey)
            // console.log('SCRIPT PUSH PUBLIC KEY', scriptPushPubKey);
            const publicKeyHash = ripemd160.hash(sha256.hash(scriptPushPubKey))
            // console.log('PUBLIC KEY HASH (hex)', binToHex(publicKeyHash))
            // expect(binToHex(publicKeyHash)).to.equal('76145b99a7949672243e097065f10ee8a5baabb2')
            expect(binToHex(publicKeyHash)).to.equal('7ab0bc77dca11dca35b350403132ab57e4a64cd7')

            const pkhScript = hexToBin('17005114' + binToHex(publicKeyHash))
            console.info('  Public key hash Script:', binToHex(pkhScript))
            // expect(binToHex(pkhScript)).to.equal('1700511476145b99a7949672243e097065f10ee8a5baabb2')
            expect(binToHex(pkhScript)).to.equal('170051147ab0bc77dca11dca35b350403132ab57e4a64cd7')

            /* Encode the public key hash into a P2PKH nexa address. */
            const nexaAddress = encodeAddress(
                'nexa', 'TEMPLATE', pkhScript)
            console.info('            Nexa address:', nexaAddress)
            // expect(nexaAddress).to.equal('nexa:nqtsq5g5wc29hxd8jjt8yfp7p9cxtugwazjm42ajg42n0mzy')
            expect(nexaAddress).to.equal('nexa:nqtsq5g502ctca7u5ywu5ddn2pqrzv4t2lj2vnxhphhjclh4')

            // Encode Private Key WIF.
            const privateKeyWIF = encodePrivateKeyWif(sha256, privateKey, 'mainnet')
            // console.log('PRIVATE KEY (WIF):', privateKeyWIF)
            // expect(privateKeyWIF).to.equal('6JHxp4ajyiAchWgvn4G95hiN51SG9WFvgdefbvYSnZkgPWtiiJzi') // Nexa (`6` or `??`)
            expect(privateKeyWIF).to.equal('6HZ6mS9WtUWa6AFCBiKCyLSw7qTXhmqcXMYoYL6GAzSEzNzj6v4q') // Nexa (`6` or `??`)

            // Fetch all unspent transaction outputs for the temporary in-browser wallet.
            // const unspentOutputs = await getUnspentOutputs(cashAddress)
            const unspentOutputs = await getUnspentOutputs(nexaAddress)
            console.log('Unspent outputs:\n', unspentOutputs)

            if (unspentOutputs.length === 0) {
                return console.error('There are NO unspent outputs available.')
            }

            // Create a bridge transaction without miner fee to determine the transaction size and therefor the miner fee.
            const transactionTemplate = await createNexaTransaction(
                privateKeyWIF,
                unspentOutputs,
                NEXA_TEST_ADDRESS,
                0,
            )
            // console.log('TRANSACTION (hex)', binToHex(transactionTemplate))

            /* Set miner fee. */
            // NOTE: We used 1.1 (an extra 0.1) for added (fee) security.
            const minerFee = Math.floor(1.1 * transactionTemplate.length)
            console.info(`Calculated mining fee: [ ${minerFee} ] sats`) // eslint-disable-line no-console

            // If there's funds and it matches our expectation, forward it to the bridge.
            const bridgeTransaction = await createNexaTransaction(
                privateKeyWIF,
                unspentOutputs,
                NEXA_TEST_ADDRESS,
                minerFee,
            )
            // console.log('TRANSACTION', bridgeTransaction)
            console.log('TRANSACTION (hex)', binToHex(bridgeTransaction))

            // Broadcast transaction
            broadcast(binToHex(bridgeTransaction))
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
