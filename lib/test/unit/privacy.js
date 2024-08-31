/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Privacy } from '../../index.js'

/* Import (individual) modules. */
import {
    randomOutputsForTier,
    sendToPeer,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_PARAM,
} from '../test_vectors.js'

/* Initialize globals. */
let result

describe( 'Privacy Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Privacy' class.` )
    } )

    describe( 'Privacy -> Class', () => {
        it( 'should initialize the privacy CLASS', () => {
            /* Set parameters. */
            const params = {}

            /* TBD. */
            const myPrivacy = new Privacy(params)
            // console.log('PRIVACY', myPrivacy)

            expect(myPrivacy).to.an('object')
        } )
    } )

    describe( 'Privacy -> randomOutputsForTier', () => {
        it( 'should genrate random outputs for a specific tier', () => {
            /* Set "random" parameters. */
            const inputAmount    = 1000000
            const tierScale      = 100000
            const feeOffset      = 10034
            const maxOutputCount = 17

            /* Request (random) outputs. */
            const outputs = randomOutputsForTier(
                inputAmount,
                tierScale,
                feeOffset,
                maxOutputCount,
            )
            // console.info('OUTPUTS', outputs)

            /* Calculate outputs total. */
            const sumOutputs = outputs
                .reduce((acc, curVal) => acc + curVal, 0)
            // console.log('SUM OUTPUTS', sumOutputs)

            expect(outputs).to.be.a('array')
            expect(outputs.length).to.be.gte(1)
            expect(sumOutputs).to.eq(inputAmount)
        } )
    } )

    describe( 'Privacy -> sendToPeer', () => {
        it( 'should send a message to a PEER', async () => {
            /* Send (message) to peer. */
            result = await sendToPeer()
            // console.log('RESULT', result)

            expect(result.id).to.equal('80701f7f-b027-43b4-83d8-3f3170b90229')
            expect(result.msg).to.equal('sent!')
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
