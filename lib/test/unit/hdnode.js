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

/* Import class. */
import { Hdnode } from '../../index.js'

/* Import (individual) modules. */
import {
    deriveHdPrivateNodeFromSeed,
    decodePrivateKeyWif,
    encodePrivateKeyWif,
    parseWif,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    TEST_MNEMONIC,
    TEST_SEED,
    PRIVATE_KEY,
    PUBLIC_KEY,
    TEST_WIF,
    RETURN_ADDRESS,
    P2PKH_TEST_ADDRESS,
} from '../test_vectors.js'

/* Initialize globals. */
let decoded
let result

describe( 'HD Node (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'HD Node' class.` )
    } )

    describe( 'HD Node -> decodePrivateKeyWif', () => {
        it( 'should encode a private key using WIF', async () => {
            // Encode Private Key WIF.
            decoded = decodePrivateKeyWif(TEST_WIF)
            expect(decoded.privateKey).to.eql(hexToBin(PRIVATE_KEY))
        } )
    } )

    describe( 'HD Node -> deriveHdPrivateNodeFromSeed', () => {
        it( 'should derive an HD Private Node from a seed', async () => {
            const seed = hexToBin(TEST_SEED)
            // console.log('Binary seed:', seed)
            expect(seed).to.have.length(64)

            const node = deriveHdPrivateNodeFromSeed(seed)
            // console.log('\n  HD Node:', node)

            expect(binToHex(node.chainCode)).to.eq('f15dccdea3a6bdb06015cbfa7470a5817194b14ecde7b35e3ece32bbebe3a7aa')
            expect(binToHex(node.privateKey)).to.eq('d0ce89906690fa8ed1fe6709447abb8cf2a2252c8fa559e1051fb3c1aee0c750')
        } )

    } )

    describe( 'HD Node -> encodePrivateKeyWif', () => {
        it( 'should encode a private key using WIF', async () => {
            // Encode Private Key WIF.
            const privateKeyWIF = encodePrivateKeyWif(hexToBin(PRIVATE_KEY), 'mainnet')
            expect(privateKeyWIF).to.equal(TEST_WIF)
        } )
    } )

    describe( 'HD Node -> parseWif', () => {
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

    describe( 'HD Node -> (Ethers.js) isValidMnemonic', () => {
        it( 'should validate the test mnemonic', () => {
            const isValid = isValidMnemonic(TEST_MNEMONIC)

            expect(isValid).to.be.true
        } )
    } )

    describe( 'HD Node -> (Ethers.js) mnemonicToEntropy', () => {
        it( 'should generate 128-bits of entropy from 12-word mnemonic', () => {
            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            // console.log('ENTROPY', entropy)

            expect(entropy).to.equal('11519ca189c85493673aa915e843f788')
        } )
    } )

    describe( 'HD Node -> (Ethers.js) entropyToMnemonic', () => {
        it( 'should generate a 12-word mnemonic from 128-bits of entropy', () => {
            const entropy = mnemonicToEntropy(TEST_MNEMONIC)
            const mnemonic = entropyToMnemonic(entropy)
            // console.log('ENTROPY TO TEST_MNEMONIC', mnemonic)

            expect(mnemonic).to.equal(TEST_MNEMONIC)
        } )
    } )

    describe( 'HD Node -> (Ethers.js) mnemonicToSeed', () => {
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
