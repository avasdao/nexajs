/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Id } from '../index.js'

/* Import (individual) modules. */
import {
    isSafuPassword,
} from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Nexa ID Protocol Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'ID' class.` )
    } )

    describe( 'Id -> Is Safu Password', () => {
        /* TBD. */
        // const myId = new Id(params)
        const report = isSafuPassword('Tr0ub4dour&3')
        console.log('REPORT', report)

        it( 'should offer the number of guesses required to crack', () => {
            expect(report.guesses).to.equal(19058000)
        } )
    } )

    describe( 'Id -> Is Safu Password', () => {
        /* TBD. */
        // const myId = new Id(params)
        const report = isSafuPassword('Tr0ub4dour&3')
        // console.log('REPORT', report)

        it( 'should offer the (offline) fast hashing cracking time', () => {
            expect(report.display).to.equal('less than a second')
        } )
    } )

    describe( 'Id -> Is Safu Password', () => {
        /* TBD. */
        // const myId = new Id(params)
        const report = isSafuPassword('Tr0ub4dour&3')
        // console.log('REPORT', report)

        it( 'should offer feedback to the user', () => {
            expect(report.suggestions[0]).to.equal('Add another word or two. Uncommon words are better.')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
