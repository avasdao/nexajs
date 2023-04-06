/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Address } from '../index.js'

/* Import (individual) modules. */
import { decodeAddress } from '../index.js'
import { encodeAddress } from '../index.js'
import { listUnspent } from '../index.js'
import { watchAddress } from '../index.js'

const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'

const PREFIX_VERIFY = 'nexa'

const TYPE_VERIFY = 'TEMPLATE'

const HASH_VERIFY = new Uint8Array([
   23,   0,  81, 20, 240,  56,  25,
  205,  14, 116, 30,  63, 178,  25,
   98,  17, 205,  8, 192, 195, 215,
  187, 121, 177
])




// const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'
// const myHandler = (updatedInfo) => {
//     console.log('HANDLER', updatedInfo)
// }
// const cleanup = watchAddress(myAddress, myHandler)
// cleanup() // Execute to cancel (and cleanup) an Address subscription.




describe( 'Address Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Address' class.` )
    } )

    describe( 'instances', () => {
        /* Encode the address components. */
        const address = new Address(NEXA_TEST_ADDRESS)

        it( 'should initialize an address from a seed', () => {
            expect(address.toString().seed).to.equal(NEXA_TEST_ADDRESS)
        } )
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

        console.log('hashClass', hashClass)
        it( 'should match the (Uint8Array) hash (by Class)', () => {
            expect(hashClass).to.eql(HASH_VERIFY)
        } )

        /* Deconstruct the decoded address. */
        const { hash: hashByMethod } = decodeAddress(NEXA_TEST_ADDRESS)

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            expect(hashByMethod).to.eql(HASH_VERIFY)
        } )
    } )

    describe( 'List Unspent', () => {
        it( 'it should retrieve the UTXOs for an address', async () => {
            const unspent = await listUnspent(NEXA_TEST_ADDRESS)
                .catch(err => console.error(err))
            // console.log('UNSPENT', unspent)

            expect(unspent).to.be.an('array')
            expect(unspent).to.have.lengthOf.above(10)
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
