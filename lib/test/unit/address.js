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
const ADDRESS_BINARY_HASH = new Uint8Array([
   0,  81,  20, 132, 172,
   11, 121, 194, 105,  92, 235,
  150, 170, 136, 198, 245, 183,
  190, 219, 213, 225, 147, 242
])

const NEXA_TEST_TOKEN = 'nexareg:tqcfh2wjq3l9pd43s997282eu4esxhf4mfl5uplk5jpt7gt50vqqqa49yj5gp'
// const NEXA_TEST_TOKEN_HEX = '309ba9d2047e50b6b1814be51d59e573035d35da7f4e07f6a482bf21747b0000'
const TOKEN_BINARY_HASH = new Uint8Array([
   48, 155, 169, 210,   4, 126,  80, 182,
  177, 129,  75, 229,  29,  89, 229, 115,
    3,  93,  53, 218, 127,  78,   7, 246,
  164, 130, 191,  33, 116, 123,   0,   0
])

const SAMPLE_INPUT = {
    outpoint: 'dd4456006ddfcf16607c7caa297e9654f0aa65c2b758db06d6cc2ec790d20992',
    amount: 160.72,
    scriptSig: {
        asm: '210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c7834 c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0[ALL]',
        hex: '22210218264068bc8be1517fb289818a6bc4264a49eba9ee1114aaa040521a1c7c783440c856ef6c3ab5555d4614e76c464ff2d8b5abf7440b86f512eb439b98f14f783b329241dd1ce649d6f6595b9cc2a60d7dad95283689793758787e35aba00d34c0'
    },
    sequence: 4294967294
}

const MAINNET_PREFIX = 'nexa'
const TESTNET_PREFIX = 'nexatest'
const REGTEST_PREFIX = 'nexareg'

const GROUP_TYPE = 'GROUP'
const TEMPLATE_TYPE = 'TEMPLATE'

describe( 'Address Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Address' class.` )
    } )

    describe( 'Instance tests', () => {
        /* Encode the address components. */
        const address = new Address(NEXA_TEST_ADDRESS)

        it( 'should initialize an address from a seed', () => {
            expect(address.toString().seed).to.equal(NEXA_TEST_ADDRESS)
        } )
    } )

    describe( 'Encoding tests', () => {
        /* Encode the address components. */
        const addressByClass = Address.encode(
            MAINNET_PREFIX,
            TEMPLATE_TYPE,
            ADDRESS_BINARY_HASH,
        )

        it( 'should encode the address (by Class)', () => {
            expect(addressByClass).to.equal(NEXA_TEST_ADDRESS)
        } )

        /* Encode the address components. */
        const addressByMethod = encodeAddress(
            MAINNET_PREFIX,
            TEMPLATE_TYPE,
            ADDRESS_BINARY_HASH,
        )

        it( 'should encode the address (by Method)', () => {
            expect(addressByMethod).to.equal(NEXA_TEST_ADDRESS)
        } )

        /* Encode the token components. */
        const tokenByMethod = encodeAddress(
            REGTEST_PREFIX,
            GROUP_TYPE,
            TOKEN_BINARY_HASH,
        )
// console.log('tokenByMethod', tokenByMethod);

        it( 'should encode the address (by Method)', () => {
            expect(tokenByMethod).to.equal(NEXA_TEST_TOKEN)
        } )
    } )

    describe( 'Decoding tests', () => {
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

        /* Deconstruct the decoded address. */
        const { hash: hashByMethod } = decodeAddress(NEXA_TEST_ADDRESS)

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            expect(hashByMethod).to.eql(ADDRESS_BINARY_HASH)
        } )

        /* Deconstruct the decoded address. */
        const { hash: tokenHashByMethod } = decodeAddress(NEXA_TEST_TOKEN)
// console.log('tokenHashByMethod', tokenHashByMethod);

        it( 'should match the (Uint8Array) hash (by Method)', () => {
            expect(tokenHashByMethod).to.eql(TOKEN_BINARY_HASH)
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
