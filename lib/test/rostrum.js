/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Rostrum } from '../index.js'

/* Import (individual) modules. */
import { addressBalance } from '../index.js'
import { addressDecode } from '../index.js'
import { addressFirstUse } from '../index.js'

const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g570krcx3gl9l3yhh8lsh2gq446fse9vef5hwewryc'
const NEXA_TOKEN_ADDRESS = 'nexa:tqjdvl627lz78s5sr37u65d0rqskla20cpcjytl3n2mxwgsv55qqq09265twm'

describe( 'Rostrum (LIVE) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Rostrum' class.` )
    } )

    describe( 'Blockchain -> Address -> Balance', () => {
        it( 'should receive an object (by Class) from the REMOTE server', async () => {
            /* Request balance. */
            const result = await Rostrum.getBalance(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive an object (by Method) from the REMOTE server', async () => {
            /* Request balance. */
            const result = await addressBalance(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive confirmed balance for the given address', async () => {
            /* Request balance. */
            const result = await addressBalance(NEXA_TEST_ADDRESS)
            expect(result.confirmed).to.equal(133700)
        } )

        it( 'should receive unconfirmed balance for the given address', async () => {
            /* Request balance. */
            const result = await addressBalance(NEXA_TEST_ADDRESS)
            expect(result.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'Blockchain -> Address -> Decoding', () => {
        it( 'should receive an object from the REMOTE server', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive a "token aware" address', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TEST_ADDRESS)
            expect(result.is_token_aware).to.be.true
        } )

        it( 'should receive a matching payload', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TEST_ADDRESS)
            expect(result.payload).to.equal('17005114f3ec3c1a28f97f125ee7fc2ea402b5d26192b329')
        } )

        it( 'should receive a matching payload', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TOKEN_ADDRESS)
            expect(result.payload).to.equal('24d67f4af7c5e3c2901c7dcd51af18216ff54fc071222ff19ab667220ca50000')
        } )

        it( 'should receive a matching address type', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TEST_ADDRESS)
            expect(result.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching address type', async () => {
            /* Request decoding. */
            const result = await addressDecode(NEXA_TOKEN_ADDRESS)
            expect(result.type).to.equal('group')
        } )
    } )

    describe( 'Blockchain -> Address -> First Use', () => {
        it( 'should receive an object from the REMOTE server', async () => {
            /* Request first use. */
            const result = await addressFirstUse(NEXA_TEST_ADDRESS)
            // console.log('FIRST USE', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the first block hash for an address', async () => {
            /* Request first use. */
            const result = await addressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.block_hash).to.equal('cfbf7de19339a2de74af454289be7ace72fab620c7cbfaca892ad3c6467b4a10')
        } )

        it( 'should receive the first block height for an address', async () => {
            /* Request first use. */
            const result = await addressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.height).to.equal(222667)
            expect(result.block_height).to.equal(222667)
        } )

        it( 'should receive the first transaction for an address', async () => {
            /* Request first use. */
            const result = await addressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.tx_hash).to.equal('f1385dbef064bf3b66d208f421caabaf370dcf343622047b918e3f0768af5519')
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
