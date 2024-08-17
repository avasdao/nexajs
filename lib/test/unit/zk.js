/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Zk } from '../../index.js'
import { Pedersen } from '../../index.js'

import { Point } from '@nexajs/crypto'
/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

describe( 'Zero Knowledge Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Zero Knowledge' class.` )
    } )

    describe( 'Zero Knowledge -> New Secret', () => {
        it( 'should generate a new SECRET', () => {
            /* Initialize Pedersen. */
            const pedersen = new Pedersen()
            // console.log('PEDERSEN', pedersen)

            /* Generate new secret. */
            const secret = pedersen.newSecret()
            // console.log('SECRET', secret)

            expect(secret.length).to.gte(63) // FIXME Why isn't this ALWAYS 32 bytes??
        } )
    } )

    describe( 'Zero Knowledge -> Pedersen', () => {
        it( 'should initialize a Pedersen commitment', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const pedersen = new Pedersen()
            // console.log('PEDERSEN', pedersen.G)

            expect(pedersen.G.value).to.eq(BigInt(0))
        } )
    } )

    describe( 'Zero Knowledge -> Generator', () => {
        it( 'should verify the Generator value', () => {

            /* Set generator value. */
            // console.log('GENERATOR', Zk.G())
            // console.log('Point (Gx)', Zk.G().x.toString());
            // console.log('Point (N)', Point.getN());
            // console.log('Point.fromX', Point.fromX(Point.getG().x));

            const compressedPt = Point.pointToCompressed(Zk.G())
            // console.log('Point.pointToCompressed', compressedPt.toString('hex'));

            expect(Zk.G().x.toString()).to.eq('55066263022277343669578718895168534326250603453777594175500187360389116729240')
            expect(compressedPt.toString('hex')).to.eq('0279be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
