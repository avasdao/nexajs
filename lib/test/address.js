/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Address } from '../index.js'

/* Import (individual) modules. */
import { decodeAddress } from '../index.js'
import { encodeAddress } from '../index.js'

const NEXA_TEST_ADDRESS = 'nexatest:qzmzm493h5j67z2zk2lsag4qeye02x5pxyrlswqv76';

const PREFIX_VERIFY = 'nexatest'

const TYPE_VERIFY = 'P2PKH'

const HASH_VERIFY = new Uint8Array([
    182, 45, 212, 177, 189, 37, 175, 9,
    66, 178, 191, 14, 162, 160, 201, 50,
    245, 26, 129,  49,
])

describe( 'Address Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Address' class.` )
    } )

    describe( 'encoding', () => {
        /* Encode the address components. */
        const addressByClass = Address.encode(
            PREFIX_VERIFY,
            TYPE_VERIFY,
            HASH_VERIFY,
        )

        it( 'should encode the address (by Class)', () => {
            expect(addressByClass).to.equal(NEXA_TEST_ADDRESS)
        } )

        /* Encode the address components. */
        const addressByMethod = encodeAddress(
            PREFIX_VERIFY,
            TYPE_VERIFY,
            HASH_VERIFY,
        )

        it( 'should encode the address (by Method)', () => {
            expect(addressByMethod).to.equal(NEXA_TEST_ADDRESS)
        } )
    } )

    describe( 'decoding', () => {
        /* Deconstruct the decoded address. */
        const {
            prefix,
            type,
            hash: hashClass,
        } = Address.decode(NEXA_TEST_ADDRESS)

        it( 'should match the (test) prefix', () => {
            expect(prefix).to.equal(PREFIX_VERIFY)
        } )

        it( 'should match the (Pay-To-Public-Key-Hash) type', () => {
            expect(type).to.equal(TYPE_VERIFY)
        } )

        it( 'should match the (Uint8Array) hash (by Class)', () => {
            expect(hashClass).to.eql(HASH_VERIFY)
        } )

        /* Deconstruct the decoded address. */
        const { hash: hashByMethod } = decodeAddress(NEXA_TEST_ADDRESS)

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            expect(hashByMethod).to.eql(HASH_VERIFY)
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
