/* Import (test) modules. */
import { expect } from 'chai'

import { hexToBin } from '../index.js'

/* Import class. */
import { Crypto } from '../index.js'

/* Import (individual) modules. */
import { getHmac } from '../index.js'
import { randomBytes } from '../index.js'
import { sha256 } from '../index.js'
import { sha512 } from '../index.js'

const NEXA_TEST_BODY = 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.'
const NEXA_TEST_SECRET = 'correct horse battery staple'

describe( 'Crypto Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Crypto' class.` )
    } )

    describe( 'RandomBytes', () => {
        it( 'should generate 32-bytes of random data', () => {
            const bytes = randomBytes(32)

            expect(bytes).to.have.length(32)
        } )
    } )

    describe( 'Create hash using SHA-256', () => {
        it( 'should generate a 256-bit (HEX) hash of the provided data', () => {
            const hash = sha256(NEXA_TEST_SECRET)
            // console.log('HASH', hash)

            expect(hash).to.equal('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
        } )

        it( 'should generate a 256-bit (BINARY) hash of the provided data', () => {
            const hash = sha256(NEXA_TEST_SECRET, true)
            // console.log('HASH', hash)

            const bin = hexToBin('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')

            expect(hash).to.eql(bin)
        } )
    } )

    describe( 'Create hash using SHA-512', () => {
        it( 'should generate a 512-bit (HEX) hash of the provided data', () => {
            const hash = sha512(NEXA_TEST_SECRET)
            // console.log('HASH', hash)

            expect(hash).to.equal('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')
        } )

        it( 'should generate a 512-bit (BINARY) hash of the provided data', () => {
            const hash = sha512(NEXA_TEST_SECRET, true)
            // console.log('HASH', hash)

            const bin = hexToBin('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')

            expect(hash).to.eql(bin)
        } )
    } )

    describe( 'Create a 512-bit hashed message authentication code', () => {
        it( 'should generate a 512-bit HMAC', () => {
            const hmac = getHmac(NEXA_TEST_BODY, NEXA_TEST_SECRET)
            // console.log('HMAC', hmac)

            expect(hmac).to.equal('171d2f81d571ac58f0a05c561216845a7708472c833fcf695721854083c7296ec4fae86acc1b9c177db1fa95a1ea47fbd52a63e6cc46a1455047000698dc9e56')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
