/* Import (test) modules. */
import { expect } from 'chai'

import { v4 as uuidv4 } from 'uuid'

/* Import class. */
import { App } from '../index.js'

/* Import (individual) modules. */
import {
    copyToClipboard,
    // createSession,
} from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Application Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Application' class.` )
    } )

    describe( 'App -> Copy to clipboard', () => {
        it( 'should copy random UUID to clipboard', () => {
return // TODO: CREATE A TEST FOR SERVER
            const params = {}

            /* TBD. */
            const result = copyToClipboard(NEXA_TEST_PARAM)
            console.log('RESULT', result);

            expect(result).to.equal(NEXA_TEST_PARAM)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
