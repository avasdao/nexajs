/* Import (test) modules. */
import { expect } from 'chai'

import { OP } from '@nexajs/script'

/* Import class. */
import { Address } from '../../index.js'

/* Import (individual) modules. */
import {
    decodeAddress,
    encodeAddress,
    getSender,
    listUnspent,
    watchAddress,
} from '../../index.js'

// const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz'
const SAMPLE_INPUT = {
    outpoint: 'dd4456006ddfcf16607c7caa297e9654f0aa65c2b758db06d6cc2ec790d20992',
    amount: 160.72,
    scriptSig: {
        asm: '210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c7834 c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0[ALL]',
        hex: '22210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c783440c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0'
    },
    sequence: 4294967294
}

const PREFIX_VERIFY = 'nexa'

const TYPE_VERIFY = 'TEMPLATE'

const HASH_VERIFY = new Uint8Array([
   0,  81,  20, 132, 172,
   11, 121, 194, 105,  92, 235,
  150, 170, 136, 198, 245, 183,
  190, 219, 213, 225, 147, 242
])


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

        it( 'should match the (Uint8Array) hash (by Class)', () => {
            expect(hashClass).to.eql(HASH_VERIFY)
        } )

        /* Deconstruct the decoded address. */
        const { hash: hashByMethod } = decodeAddress(NEXA_TEST_ADDRESS)

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            expect(hashByMethod).to.eql(HASH_VERIFY)
        } )
    } )

    describe( 'Get Spender', () => {
        it( 'it should retrieve the SPENDER of a transaction', () => {
            const sender = getSender(SAMPLE_INPUT)
            // console.log('SENDER', sender)

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
