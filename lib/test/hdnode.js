/* Import (test) modules. */
import { expect } from 'chai'

import {
    binToHex,
    deriveHdPrivateNodeChild,
    hexToBin,
    instantiateSha256,
    instantiateSha512,
    instantiateSecp256k1,
    instantiateRipemd160,
} from '@bitauth/libauth'

/* Import class. */
import { Hdnode } from '../index.js'

/* Import (individual) modules. */
import { deriveHdPrivateNodeFromSeed } from '../index.js'
import { encodePrivateKeyWif } from '../index.js'
import { parseWif } from '../index.js'

/* Set (BIP39) seed phrase. */
const TEST_MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony'
const TEST_SEED = '7f4b36c05bc7b02fbacf1bd60077fd41478f0da66d5c895b7f9106e17a90e2e3a456255f17701d8548d756741dc854c61aa68f2cd9d36bcbc869f1c046a65de9'
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c'
const PUBLIC_KEY = '03fc6dbeb83e8d9514eb2512fa1c5f00ab7f96bce07195cb6a5f6ae4f3c41592b2'
const TEST_WIF = '6HYqypNbnLLYvhd9cDjD888wNugsRVUV4xboQHPBvvqhWwzZazFP'
const RETURN_ADDRESS = 'nexa:nqtsq5g5s9wrr0dcvcj25wjk3uvgg2e4lheqmcw6wthf5frx'
// const BCH_TEST_ADDRESS = 'bitcoincash:qqwsfram5cc87k2n26gshjnylg8gdjnauuum5sws3c'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

describe( 'HD Node Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'HD Node' class.` )
    } )

    describe( 'HD Node -> Derive HD Private Node (from Seed)', () => {
        it( 'should create an HD node (chainCode) from a seed', async () => {
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
        } )

        it( 'should create an HD node (privateKey) from a seed', async () => {
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
            expect(node.privateKey).to.have.length(32)
        } )
    } )

    describe( 'HD Node -> Encode Private Key (WIF)', () => {
        it( 'should encode a private key using WIF', async () => {
            /* Instantiate Libauth crypto interfaces. */
            const ripemd160 = await instantiateRipemd160()
            const secp256k1 = await instantiateSecp256k1()
            const sha256 = await instantiateSha256()
            const sha512 = await instantiateSha512()

            // Encode Private Key WIF.
            const privateKeyWIF = encodePrivateKeyWif(sha256, hexToBin(PRIVATE_KEY), 'mainnet')
            expect(privateKeyWIF).to.equal(TEST_WIF) // Nexa (`6` or `??`)
        } )
    } )

    describe( 'HD Node -> Parse Wallet Import Format (WIF)', () => {
        it( 'should parse a private key from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const [
                privateKey,
                publicKey,
                returnAddress
            ] = await parseWif(TEST_WIF)

            expect(privateKey).to.equal(PRIVATE_KEY)
        } )

        it( 'should parse a public key from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const [
                privateKey,
                publicKey,
                returnAddress
            ] = await parseWif(TEST_WIF)

            expect(publicKey).to.equal(PUBLIC_KEY)
        } )

        it( 'should parse a return address from WIF', async () => {
            // Parse the private key wif into the keypair and address.
            const [
                privateKey,
                publicKey,
                returnAddress
            ] = await parseWif(TEST_WIF)

            expect(returnAddress).to.equal(RETURN_ADDRESS)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
