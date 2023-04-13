/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Transaction } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Transaction Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Transaction' class.` )
    } )

    describe( 'Transaction -> Create', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        it( 'should return a transaction object', () => {
            expect(transaction).to.be.an('object')
        } )
    } )

    describe( 'Transaction -> Add Input', () => {
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

    describe( 'Transaction -> Add Output', () => {
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

    describe( 'Transaction -> Lock Time', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        it( 'should return the default LOCK TIME', () => {
            expect(transaction.lockTime).to.be.equal(0)
        } )
    } )

    describe( 'Transaction -> Signing', () => {
        /* Create transaction. */
        const transaction = new Transaction()

        it( 'should return FALSE flag', () => {
            expect(transaction.isSigned).to.be.false
        } )

        it( 'should return TRUE flag', () => {
            /* Sign the transaction. */
            transaction.sign()

            expect(transaction.isSigned).to.be.true
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
