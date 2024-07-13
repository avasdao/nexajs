/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Id } from '../../index.js'

/* Import (individual) modules. */
import {
    isSafuPassword,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

/* Initialize locals. */
let result

describe( 'Nexa ID Protocol (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'ID' class.` )
    } )

    describe( 'ID -> isSafuPassword', () => {
        /* Verify password. */
        result = isSafuPassword('Tr0ub4dour&3')
        // console.log('\nRESULT (isSafuPassword):', result)

        it( 'should verify the # of guesses required to crack', () => {
            expect(result.guesses).to.equal(19058000)
        } )

        it( 'should verify the (offline) fast hashing cracking time', () => {
            expect(result.display).to.equal('less than a second')
        } )

        it( 'should verify feedback to the user', () => {
            expect(result.suggestions[0]).to.equal('Add another word or two. Uncommon words are better.')
        } )
    } )

    describe( 'errors', () => {
        /* Verify password. */
        result = isSafuPassword('Tr0ub4dour&3')

        it( 'should expect a message to be displayed to the user', () => {
            expect(result.display).to.not.eq('')
        } )
    } )

} )
