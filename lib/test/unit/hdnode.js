/* Import (test) modules. */
import { expect } from 'chai'

/* HD wallet helpers. */
import {
    sha256,
    sha512,
} from '@nexajs/crypto'

import {
    entropyToMnemonic,
    isValidMnemonic,
    mnemonicToEntropy,
    mnemonicToSeed,
} from '@nexajs/hdnode'

/* Binary utilities. */
import {
    binToHex,
    hexToBin,
} from '@nexajs/utils'

import {
    deriveHdPrivateNodeChild,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import class. */
import { Hdnode } from '../index.js'

/* Import (individual) modules. */
import {
    deriveHdPrivateNodeFromSeed,
    decodePrivateKeyWif,
    encodePrivateKeyWif,
    parseWif,
} from '../index.js'

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony'
const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9'
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c'
const PUBLIC_KEY = '03fc6dbeb83e8d9514eb2512fa1c5f00ab7f96bce07195cb6a5f6ae4f3c41592b2'
const TEST_WIF = '6HYqypNbnLLYvhd9cDjD888wNugsRVUV4xboQHPBvvqhWwzZazFP'
// const RETURN_ADDRESS = 'nexa:nqtsq5g5s9wrr0dcvcj25wjk3uvgg2e4lheqmcw6wthf5frx'
const RETURN_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
// const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const P2PKH_TEST_ADDRESS = 'nexa:qqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljspxnfmms'

describe( 'HD Node Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'HD Node' class.` )
    } )

    describe( 'HD Node -> Derive HD Private Node (from Seed)', () => {
        it( 'should create an HD node (chainCode) from a seed', async () => {
            const seed = hexToBin(TEST_SEED)
            // console.log('Binary seed:', seed)
            expect(seed).to.have.length(64)

            const node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)
            // console.log('\n  HD Node:', node)
            expect(node.chainCode).to.have.length(32)
        } )

        it( 'should create an HD node (privateKey) from a seed', async () => {
            const seed = hexToBin(TEST_SEED)
            // console.log('Binary seed:', seed)
            expect(seed).to.have.length(64)

            const node = deriveHdPrivateNodeFromSeed({ sha512: { hash: sha512 } }, seed)
            // console.log('\n  HD Node:', node)
            expect(node.privateKey).to.have.length(32)
        } )
    } )

    describe( 'HD Node -> Encode Private Key (WIF)', () => {
        it( 'should encode a private key using WIF', async () => {
            // Encode Private Key WIF.
            const privateKeyWIF = encodePrivateKeyWif({ hash: sha256 }, hexToBin(PRIVATE_KEY), 'mainnet')
            expect(privateKeyWIF).to.equal(TEST_WIF) // Nexa (`6` or `??`)
        } )
    } )

    describe( 'HD Node -> Decode Private Key (WIF)', () => {
        it( 'should encode a private key using WIF', async () => {
            // Encode Private Key WIF.
            const decoded = decodePrivateKeyWif({ hash: sha256 }, TEST_WIF)
            expect(decoded.privateKey).to.eql(hexToBin(PRIVATE_KEY)) // Nexa (`6` or `??`)
        } )
    } )

    describe( 'HD Node -> Parse Wallet Import Format (WIF)', () => {
        it( 'should parse a private key from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(TEST_WIF)

            expect(privateKey).to.eql(hexToBin(PRIVATE_KEY))
        } )

        it( 'should parse a public key from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(TEST_WIF)

            expect(publicKey).to.eql(hexToBin(PUBLIC_KEY))
        } )

        it( 'should parse a return address from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(TEST_WIF)

            expect(address).to.equal(RETURN_ADDRESS)
        } )

        it( 'should parse a return address from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const {
                address,
                privateKey,
                publicKey,
            } = await parseWif(TEST_WIF, 'nexa', 'P2PKH')

            expect(address).to.equal(P2PKH_TEST_ADDRESS)
        } )
    } )
    describe( 'HD Node -> Ethers.js Helpers', () => {
        it( 'should validate the test mnemonic', () => {
            const isValid = isValidMnemonic(TEST_MNEMONIC)

            expect(isValid).to.be.true
        } )

        it( 'should generate 128-bits of entropy from 12-word mnemonic', () => {
            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            // console.log('ENTROPY', entropy)

            expect(entropy).to.equal('11519ca189c85493673aa915e843f788')
        } )

        it( 'should generate a 12-word mnemonic from 128-bits of entropy', () => {
            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            const mnemonic = entropyToMnemonic(entropy)
            // console.log('ENTROPY TO TEST_MNEMONIC', mnemonic)

            expect(mnemonic).to.equal(TEST_MNEMONIC)
        } )

        it( 'should generate a 512-bit seed from a 12-word mnemonic', () => {
            const seed = mnemonicToSeed(TEST_MNEMONIC)
            // console.log('SEED', seed)

            expect(seed).to.equal(TEST_SEED)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
