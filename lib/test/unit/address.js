/* Import (test) modules. */
import { expect } from 'chai'

import { OP } from '@nexajs/script'

/* Import class. */
import { Address } from '../../index.js'

/* Import (individual) modules. */
import {
    decodeAddress,
    decodeBase58AddressFormat,
    encodeAddress,
    encodeBase58AddressFormat,
    getSender,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    MAINNET_PREFIX,
    TESTNET_PREFIX,
    REGTEST_PREFIX,
    NXY_PREFIX,

    GROUP_TYPE,
    TEMPLATE_TYPE,

    NEXA_TEST_ADDRESS,
    NXY_TEST_ADDRESS,
    ADDRESS_BINARY_HASH,
    NEXA_TEST_TOKEN,
    TOKEN_BINARY_HASH,

    SAMPLE_INPUT,
    DECODED_WIF_PAYLOAD,
} from '../test_vectors.js'

/* Initialize globals. */
let address
let decoded

describe( 'Address (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Address' class.` )
    } )

    describe( 'Address -> Class', () => {
        it( 'should initialize an address from a seed', () => {
            /* Encode the address components. */
            address = new Address(NEXA_TEST_ADDRESS)

            expect(address.toString().seed).to.equal(NEXA_TEST_ADDRESS)
        } )
    } )

    describe( 'Address -> decodeBase58AddressFormat', () => {
        it( 'should decode the base58 address', () => {
            decoded = decodeBase58AddressFormat('6HYqypNbnLLYvhd9cDjD888wNugsRVUV4xboQHPBvvqhWwzZazFP') // wifkey
            // console.log('DECODED', decoded.payload)

            expect(decoded.payload).to.eql(DECODED_WIF_PAYLOAD)
        } )
    } )

    describe( 'Address -> encode', () => {
        it( 'should encode the address (by Class)', () => {
            /* Encode the address components. */
            const addressByClass = Address.encode(
                MAINNET_PREFIX,
                TEMPLATE_TYPE,
                ADDRESS_BINARY_HASH,
            )

            expect(addressByClass).to.equal(NEXA_TEST_ADDRESS)
        } )
    } )

    describe( 'Address -> encodeAddress', () => {
        it( 'should encode the address (by Method)', () => {
            /* Encode the address components. */
            const addressByMethod = encodeAddress(
                MAINNET_PREFIX,
                TEMPLATE_TYPE,
                ADDRESS_BINARY_HASH,
            )

            expect(addressByMethod).to.equal(NEXA_TEST_ADDRESS)
        } )

        it( 'should encode the address (by Method)', () => {
            /* Encode the token components. */
            const tokenByMethod = encodeAddress(
                REGTEST_PREFIX,
                GROUP_TYPE,
                TOKEN_BINARY_HASH,
            )

            expect(tokenByMethod).to.equal(NEXA_TEST_TOKEN)
        } )
    } )

    describe( 'Address -> encodeNetworkAddress', () => {
        it( 'should encode the address (using Nxy network)', () => {
            /* Encode the address components. */
            address = encodeAddress(
                NXY_PREFIX,
                TEMPLATE_TYPE,
                ADDRESS_BINARY_HASH,
            )

            expect(address).to.equal(NXY_TEST_ADDRESS)
        } )
    } )

    describe( 'Address -> decode', () => {
        /* Deconstruct the decoded address. */
        const {
            prefix,
            type,
            hash: hashClass,
        } = Address.decode(NEXA_TEST_ADDRESS)

        it( 'should match the (test) prefix', () => {
            expect(prefix).to.equal(MAINNET_PREFIX)
        } )

        it( 'should match the (Pay-To-Public-Key-Hash) type', () => {
            expect(type).to.equal(TEMPLATE_TYPE)
        } )

        it( 'should match the (Uint8Array) hash (by Class)', () => {
            expect(hashClass).to.eql(ADDRESS_BINARY_HASH)
        } )
    } )

    describe( 'Address -> decodeAddress', () => {
        it( 'should match the (Uint8Array) hash (by Method)', () => {
            /* Deconstruct the decoded address. */
            const { hash: hashByMethod } = decodeAddress(NEXA_TEST_ADDRESS)

            expect(hashByMethod).to.eql(ADDRESS_BINARY_HASH)
        } )

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            /* Deconstruct the decoded address. */
            const { hash: tokenHashByMethod } = decodeAddress(NEXA_TEST_TOKEN)

            expect(tokenHashByMethod).to.eql(TOKEN_BINARY_HASH)
        } )
    } )

    describe( 'Address -> getSender', () => {
        it( 'it should retrieve the SPENDER of a transaction', () => {
            const sender = getSender(SAMPLE_INPUT)

            expect(sender).to.be.a('string')
            expect(sender).to.equal('nexa:nqtsq5g5zmfck8fxlhkpxe28yu4a747l2e65kuptph2ajp8x')
            expect(sender).to.have.lengthOf(53)
        } )

    } )

    describe( 'errors', () => {
        try {
            /* Deconstruct the decoded address. */
            const { prefix, type, hash } = Address.decode()
        } catch (err) {
            // console.error(err.toString())

            it( 'should return a (undefined) error', () => {
                expect(err.toString()).to.include('Invalid address: undefined')
            } )
        }

        try {
            /* Deconstruct the decoded address. */
            const { prefix, type, hash } = Address.decode(null)
        } catch (err) {
            // console.error(err.toString())

            it( 'should return a (null) error', () => {
                expect(err.toString()).to.include('Invalid address: null')
            } )
        }

        try {
            /* Deconstruct the decoded address. */
            const { prefix, type, hash } = Address.decode('')
        } catch (err) {
            // console.error(err.toString())

            it( 'should return a (missing prefix) error', () => {
                expect(err.toString()).to.include('Missing prefix')
            } )
        }
    } )

} )
