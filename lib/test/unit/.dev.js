/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import {
    encodeAddress,
    encodeDataPush,
    hexToBin,
    OP,
} from '../../index.js'

/* Import (individual) modules. */
// import {
//     classMethod1,
//     classMethod2,
// } from '../../index.js'

/* Import test(-ing) vectors. */
import {
    SAMPLE_INPUT,
} from '../test_vectors.js'

describe( 'Singleton Test', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Class' class.` )
    } )

    describe( 'Market -> payPartialOffer', () => {
        it( 'should complete the payment on a partially signed offer', () => {
            const prefix = 'nexa'

            // const publicKeyHash = hexToBin('b2912c4cc61f1b8cbe5c77ebd5eeea2641645f10') // nexa:nqtsq5g5k2gjcnxxrudce0juwl4atmh2yeqkghcs46snrqug
            // const publicKeyHash = hexToBin('45f5b9d41dd723141f721c727715c690fedbbbd6') // nexa:nqtsq5g5gh6mn4qa6u33g8mjr3e8w9wxjrldhw7kvymc38lp
            const publicKeyHash = hexToBin('17d23be87a7f54479324ba1b0672cadcc2d096e3') // 

            const scriptPubKey = new Uint8Array([
                OP.ZERO,
                OP.ONE,
                ...encodeDataPush(publicKeyHash),
            ])

            /* Encode the public key hash into a P2PKH nexa address. */
            const address = encodeAddress(
                prefix,
                'TEMPLATE',
                scriptPubKey,
            )
            console.info('ADDRESS', address)


        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
