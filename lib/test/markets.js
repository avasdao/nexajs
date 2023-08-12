/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Markets } from '../index.js'

/* Import (individual) modules. */
import {
    getPrice,
    getQuote,
    getTicker,
} from '../index.js'

const API_MEXC_ID = process.env.API_MEXC_ID
const API_MEXC_SECRET = process.env.API_MEXC_SECRET
const NEXA_TEST_PARAM = 'someval'

describe( 'Markets Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Markets' class.` )
    } )

    describe( 'Markets -> Get Markets instance', () => {
        it( 'should instantiate a new Markets object', () => {
            /* TBD. */
            const myMarkets = new Markets()
            // console.log('MY MARKETS', myMarkets)

            expect(myMarkets).to.be.an('object')
        } )
    } )

    describe( 'Markets -> Get Price', () => {
        it( 'should retrieve the live NEXA/USD price', async () => {
            const price = await getPrice()
            // console.log('PRICE', price)

            expect(price).to.gte(0.00)
        } )
    } )

    describe( 'Markets -> Get Ticker', () => {
        it( 'should retrieve the live NEXA/USD ticker', async () => {
            const ticker = await getTicker()
            // console.log('TICKER', ticker)

            expect(ticker).to.be.an('object')
            expect(ticker.maxSupply).to.equal(21000000000000)
            expect(ticker.quote.USD.price).to.gte(0.00)
        } )
    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
