/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Crypto } from '../index.js'

/* Import (individual) modules. */
import { randomBytes } from '../index.js'
import { sha256 } from '../index.js'
import { sha512 } from '../index.js'

const NEXA_TEST_PARAM = 'correct horse battery staple'

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
        it( 'should generate a 256-bit hash of the provided data', () => {
            const hash = sha256(NEXA_TEST_PARAM)
            // console.log('HASH', hash)

            expect(hash).to.equal('c4bbcb1fbec99d65bf59d85c8cb62ee2db963f0fe106f483d9afa73bd4e39a8a')
        } )
    } )

    describe( 'Create hash using SHA-512', () => {
        it( 'should generate a 512-bit hash of the provided data', () => {
            const hash = sha512(NEXA_TEST_PARAM)
            // console.log('HASH', hash)

            expect(hash).to.equal('be5ef7679d88ab9a9045f6267e55f5e5784b4b8cd764b5cd855a5244f91c626953cd46c43d7668873fd6efbd3b221249315580031963472a078781fe046e62ae')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
