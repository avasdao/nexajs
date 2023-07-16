/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Script } from '../index.js'

/* Import (individual) modules. */
import { decodeNullData } from '../index.js'
import { encodeNullData } from '../index.js'
import { OP } from '../index.js'

const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'

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

    describe( 'Script -> Encode NULL data', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE)
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX)
        } )
    } )

    describe( 'Script -> Encode NULL data (Array)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData([NEXA_FOR_EVERYONE, NEXA_FOR_EVERYONE])
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX + '1f' + NEXA_FOR_EVERYONE_HEX)
        } )
    } )

    describe( 'Script -> Encode NULL data (Tab)', () => {
        it( 'should match the NULL data', () => {
            const nullData = encodeNullData(NEXA_FOR_EVERYONE + '\tFTW!')
            // console.log('NULL DATA', nullData)

            expect(nullData).to.equal(NEXA_FOR_EVERYONE_HEX + '09' + '46545721')
        } )
    } )

    describe( 'errors', () => {
        it( 'should fail to return an opcode', () => {
            expect(OP.UNKNOWN256).to.not.exist
        } )
    } )

} )
