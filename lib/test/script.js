/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
// import { Script } from '../index.js'

/* Import (individual) modules. */
import { OP } from '../index.js'

const NEXA_TEST_PARAM = 'someval'

describe( 'Script Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Script' class.` )
    } )

    describe( 'Script -> Zero', () => {
        it( 'should match the ZERO opcode', () => {
            expect(OP.ZERO).to.equal(0x00)
        } )
    } )

    describe( 'Script -> Return', () => {
        it( 'should match the RETURN opcode', () => {
            expect(OP.RETURN).to.equal(0x6a)
        } )
    } )

    describe( 'Script -> Group', () => {
        it( 'should match the GROUP opcode', () => {
            expect(OP.GROUP).to.equal(0xb6)
        } )
    } )

    describe( 'errors', () => {
        it( 'should fail to return an opcode', () => {
            expect(OP.UNKNOWN256).to.not.exist
        } )
    } )

} )
