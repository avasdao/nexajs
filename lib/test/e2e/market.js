/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import { sha256 } from '@nexajs/crypto'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

/* Import library modules. */
import {
    getCoins,
    sendCoins,
} from '@nexajs/purse'

import { getTip } from '@nexajs/rostrum'

import {
    getTokens,
    sendTokens,
} from '@nexajs/token'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Libauth helpers. */
import {
    instantiateRipemd160,
    instantiateSecp256k1,
} from '@bitauth/libauth'

/* Import (individual) modules. */
import {
    decodeNullData,
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

/* Import class. */
import { Market } from '../../index.js'

/* Import (individual) modules. */
import {
    getPrice,
    getQuote,
    getTicker,
} from '../../index.js'

/* Import environment variables. */
const API_MEXC_ID = process.env.API_MEXC_ID
const API_MEXC_SECRET = process.env.API_MEXC_SECRET

/* Import test(-ing) vectors. */
import {
    XXX_PARAM,
} from '../test_vectors.js'

const NEXA_TEST_PARAM = 'someval'

const NEXA_FOR_EVERYONE = 'NEXAForEveryone'
const NEXA_FOR_EVERYONE_HEX = '4e455841466f7245766572796f6e65'
const SAMPLE_NULL_DATA = '6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054' // Token creation for NexaJS

const MNEMONIC = 'bacon mind chronic bean luxury endless ostrich festival bicycle dragon worth balcony' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const PRIVATE_KEY = 'baa017c1c3458fc80c31c7b5a2ce833a3af44d3c172bff3981103d272f9a5a3c' // nexa:nqtsq5g5sjkqk7wzd9wwh9423rr0tda7m027ryljkfy84cjz
const NEXA_RECEIVING_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const NEXA_DUMP_ADDRESS = 'nexa:nqtsq5g57qupnngwws0rlvsevggu6zxqc0tmk7d3v5ulpfh6'
const AVAS_ID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const AVAS_ID_HEX = '57f46c1766dc0087b207acde1b3372e9f90b18c7e67242657344dcd2af660000'
const STUDIO_ID = 'nexa:tztnyazksgqpkphrx2m2fgxapllufqmuwp6k07xtlc8k4xcjpqqqq99lxywr8'
const STUDIO_ID_HEX = '9732745682001b06e332b6a4a0dd0fffc4837c707567f8cbfe0f6a9b12080000'
const SATOSHIS = 1337n
const TOKENS = 1337n

const TRADING_POST_HEX = '6c6c6c6c00c7517f7c76010087636d00677f7501207f756852cd517f7c76010087636d00677f7501207f756888030051147c7e51cd8851cc767b9652cd517f7c76010087636d00677f77517f7c76010087636d00677f75816868789d00c7517f7c76010087636d00677f77517f7c76010087636d00677f758168689f6300cd01217f76517f6e7c817f7700c701217f76517f6e7c817f775979557988557978886d6d6d6d6d687b950210279602220278a16353cc78a2690300511452797e53cd7888756855c478a169c4788ca26353cd517f7c76010087636d00677f7501207f756881009d68c49c6354cd517f7c76010087636d00677f7501207f756881009d686d'

/* Instantiate Libauth crypto interfaces. */
const ripemd160 = await instantiateRipemd160()
const secp256k1 = await instantiateSecp256k1()

const sleep = ms => new Promise(r => setTimeout(r, ms))

/* Initialize globals. */
let parsed
let prefix
let primaryAddress

describe( 'Market Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (public on-chain) JavaScript methods provided by the 'Market' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Market -> Get Price', () => {
        it( 'should retrieve the live NEXA/USD price', async () => {
            const price = await getPrice()
            console.log('PRICE', price)

            expect(price).to.gte(0.00)
        } )
    } )

    describe( 'Market -> Get Ticker', () => {
        it( 'should retrieve the live NEXA/USD ticker', async () => {
            const ticker = await getTicker()
            console.log('TICKER', ticker)

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
