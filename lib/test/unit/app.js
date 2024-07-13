/* Import (test) modules. */
import { expect } from 'chai'

import { v4 as uuidv4 } from 'uuid'

/* Import class. */
import { App } from '../../index.js'

/* Import (individual) modules. */
import {
    copyToClipboard,
    // createSession,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

describe( 'Application (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Application' class.` )
    } )

    describe( 'App -> copyToClipboard', () => {
        it( 'should copy random UUID to clipboard', () => {
// return // TODO: CREATE A TEST FOR SERVER
            // const params = {}
            globalThis.document = {}
            globalThis.navigator = {}
            globalThis.window = {}

            /* TBD. */
            const result = copyToClipboard(NEXA_TEST_PARAM)
            // console.log('RESULT', result)

            expect(result).to.equal(undefined)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
