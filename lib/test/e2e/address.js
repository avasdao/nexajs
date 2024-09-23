/* Import (test) modules. */
import { expect } from 'chai'

import { OP } from '@nexajs/script'

/* Import class. */
import { Address } from '../../index.js'

/* Import (individual) modules. */
import {
    listUnspent,
    watchAddress,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_ADDRESS,
} from '../test_vectors.js'

/* Initialize globals. */
let decoded

describe( 'Address (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Address' class.` )
    } )

    describe( 'Address -> list unspent', () => {
        it( 'should list all unspent coins for an address', async () => {
            /* Encode the address components. */
            const unspent = await listUnspent(NEXA_TEST_ADDRESS)
                .catch(err => console.error(err))
            // console.log('UNSPENT', unspent)

            expect(unspent).to.be.an('array')
            expect(unspent[0].txid).to.have.lengthOf(64)
            expect(typeof unspent[0].satoshis).to.equal('bigint')
            expect(unspent[0].hasToken).to.exist
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
