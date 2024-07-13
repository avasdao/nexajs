/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Transaction } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

describe( 'Transaction (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Transaction' class.` )
    } )

    describe( 'Transaction -> Class', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        it( 'should return a transaction object', () => {
            expect(transaction).to.be.an('object')
        } )

        it( 'should return the default LOCK TIME', () => {
            expect(transaction.lockTime).to.be.equal(0)
        } )

        it( 'should return FALSE flag', () => {
            expect(transaction.isSigned).to.be.false
        } )
    } )

    describe( 'Transaction -> addInput', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        const input = {
            outpoint: '1234567',
            amount: BigInt(1337),
        }

        transaction.addInput(input)
        // console.log('TRANSACTION', transaction)

        it( 'should return an array of INPUTS', () => {
            expect(transaction.inputs).to.be.an('array')
        } )

        it( 'total number of inputs should equal ONE', () => {
            expect(transaction.inputs.length).to.equal(1)
        } )

    } )

    describe( 'Transaction -> addOutput', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        const output = {
            amount: BigInt(888),
            lockingScript: '1234567',
        }

        transaction.addOutput(output)
        // console.log('TRANSACTION', transaction)

        it( 'should return an array of OUTPUT', () => {
            expect(transaction.outputs).to.be.an('array')
        } )

        it( 'total number of outputs should equal ONE', () => {
            expect(transaction.outputs.length).to.equal(1)
        } )

    } )

    describe( 'Transaction -> sign', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        // it( 'should return TRUE flag', () => {
        //     /* Sign the transaction. */
        //     transaction.sign()
        //
        //     expect(transaction.isSigned).to.be.true
        // } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
