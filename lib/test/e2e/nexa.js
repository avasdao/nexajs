/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { assert, expect } from 'chai'

/* Import class. */
import Nexa from '../../index.js'

/* Initialize a new Nexa instance. */
const nexa = new Nexa()

/* Import test(-ing) vectors. */
import {
    NEXA_TOKENID,
} from '../test_vectors.js'

describe( 'Nexa (Base) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (public on-chain) JavaScript methods provided by the 'Nexa' (Base) class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Emitter test', () => {
        nexa.on('test', (_msg) => {
            it( 'should match the Emitter greeting', () => {
                assert.equal( _msg, 'Hello Dev! This is a simple (Emitter) test...' )
            } )
        })

        nexa.testEmitter()
    } )

    describe( 'Instance test', () => {
        it( 'should match the Instant greeting', () => {
            assert.equal( nexa.test(), 'Hello Dev! This is a simple (Instance) test...' )
        } )
    } )

    describe( 'Static test', () => {
        it( 'should match the Static greeting', () => {
            assert.equal( Nexa.test(), 'Hello Dev! This is a simple (Static) test...' )
        } )
    } )

    describe( 'error', () => {
        it( 'should return an error', () => {
            // assert.throws( utils.badd, Error('it blowed up') )
            // assert.throws( utils.badd, 'it blowed up' )
            // expect(utils.badd).to.throw( 'it blowed up' )
        } )
    } )
} )
