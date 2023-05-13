/* Import (test) modules. */
import { expect } from 'chai'

/* Import class. */
import { Rostrum } from '../index.js'

/* Import (individual) modules. */
import { getAddressBalance } from '../index.js'
import { decodeRemoteAddress } from '../index.js'
import { getAddressFirstUse } from '../index.js'
import { getAddressHistory } from '../index.js'
import { getAddressMempool } from '../index.js'
import { getAddressScriptHash } from '../index.js'
import { getAddressUnspent } from '../index.js'
// ...
import { getBlock } from '../index.js'
// ...
import { getTransaction } from '../index.js'
// ...
import { getGenesisInfo } from '../index.js'
import { getTokenInfo } from '../index.js'
import { getNftList } from '../index.js'
// ...
import { getTokenHistory } from '../index.js'
// ...
import { subscribeAddress } from '../index.js'

const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g570krcx3gl9l3yhh8lsh2gq446fse9vef5hwewryc'
const NEXA_TOKEN_ADDRESS = 'nexa:tqjdvl627lz78s5sr37u65d0rqskla20cpcjytl3n2mxwgsv55qqq09265twm'
const AVAS_TOKEN_ADDRESS = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'

describe( 'Rostrum (LIVE) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Rostrum' class.` )
    } )

    describe( 'Blockchain -> Address -> Balance', () => {
        it( 'should receive an OBJECT (by Class) from the REMOTE server', async () => {
            /* Create (new) Rostrum instance. */
            const rostrum = new Rostrum()

            /* Request balance. */
            const result = await rostrum.getAddressBalance(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive an OBJECT (by Method) from the REMOTE server', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive CONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            // expect(result.confirmed).to.equal(133700)
            expect(result.confirmed).to.equal(140700)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            expect(result.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'Blockchain -> Address -> Decoding', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TEST_ADDRESS)
            expect(result).to.be.an('object')
        } )

        it( 'should receive a "TOKEN AWARE" ADDRESS', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TEST_ADDRESS)
            expect(result.is_token_aware).to.be.true
        } )

        it( 'should receive a matching PAYLOAD', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TEST_ADDRESS)
            expect(result.payload).to.equal('17005114f3ec3c1a28f97f125ee7fc2ea402b5d26192b329')
        } )

        it( 'should receive a matching PAYLOAD', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TOKEN_ADDRESS)
            expect(result.payload).to.equal('24d67f4af7c5e3c2901c7dcd51af18216ff54fc071222ff19ab667220ca50000')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TEST_ADDRESS)
            expect(result.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TOKEN_ADDRESS)
            expect(result.type).to.equal('group')
        } )
    } )

    describe( 'Blockchain -> Address -> First Use', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            // console.log('FIRST USE', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the FIRST BLOCK HASH for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.block_hash).to.equal('cfbf7de19339a2de74af454289be7ace72fab620c7cbfaca892ad3c6467b4a10')
        } )

        it( 'should receive the FIRST BLOCK HEIGHT for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.height).to.equal(222667)
            expect(result.block_height).to.equal(222667)
        } )

        it( 'should receive the FIRST TRANSACTION for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            expect(result.tx_hash).to.equal('f1385dbef064bf3b66d208f421caabaf370dcf343622047b918e3f0768af5519')
        } )

    } )

    describe( 'Blockchain -> Address -> History', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request history. */
            const result = await getAddressHistory(NEXA_TEST_ADDRESS)
            // console.log('HISTORY', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Blockchain -> Address -> Mempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request mempool. */
            const result = await getAddressMempool(NEXA_TEST_ADDRESS)
            // console.log('MEMPOOL', result)
            // expect(result).to.be.an('object')
            expect(result).to.be.empty
        } )

    } )

    describe( 'Blockchain -> Address -> ScriptHash', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(NEXA_TEST_ADDRESS)
            // console.log('SCRIPT HASH', result)
            expect(result).to.be.a('string')
        } )

        it( 'should equal its script hash', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(NEXA_TEST_ADDRESS)
            expect(result).to.equal('729fc21d57730ce07e31ff500eacb14c7c3a24488646dce408a042124f402fff')
        } )

    } )

    describe( 'Blockchain -> Address -> ListUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request unspent list. */
            const result = await getAddressUnspent(NEXA_TEST_ADDRESS)
            // console.log('UNSPENT', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Blockchain -> Address -> Suscribe', () => {
        it( 'should receive real-time for an ADDRESS', async () => {
            const _handler = (_data) => {
                console.log('Subscription handler (data):', _data)

                expect(_data).to.be.an('array')
                expect(_data[0]).to.equal(NEXA_TEST_ADDRESS)
            }

            /* Request transaction details. */
            const result = await subscribeAddress(NEXA_TEST_ADDRESS, _handler)
            // console.log('ADDRESS SUB', result)
        } )

    } )

    describe( 'Blockchain -> Block -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request block details. */
            const result = await getBlock(1337)
            console.log('BLOCK', result)
            expect(result).to.equal('ceac57ae91b3bfd0e8ffc5d7926966bb04be9907b0a55d5f4d541b4947118798c499001e01c839537ce90782da85aa1423a4dbb16c0fa9eed735df0edd4ebae14f14c7ed72bbae99a4a74383dc568bf25dbbcf06d6c4521e9ac427928cfb7dc3d91a6c8d00000000000000000000000000000000000000000000000000000000000000001735b2628939e69ad1c106000000000000000000000000000000000000000000000000000000f80000000000000001000000047ae6bb6f010000020100ca9a3b0000000017005114f9b094d47f93becf557ea8a29bb21448042eba450000000000000000000f6a023905000900000000000000000000000000')
        } )

    } )

    describe( 'Blockchain -> Transaction -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request transaction details. */
            const result = await getTransaction('2a234d53e48e9cdd5e549a7ecca433af3f172c1a2114a1b3a1fac447a58f6a3a')
            console.log('TRANSACTION', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> Genesis -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(AVAS_TOKEN_ADDRESS)
            console.log('GENESIS INFO (decimals):', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            // console.log('GENESIS INFO', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the DOCUMENT HASH for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.document_hash).to.equal('0000000000000000000000000000000000000000000000000000000000000000')
        } )

        it( 'should receive the DOCUMENT URL for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.document_url).to.equal('https://wallydice.com')
        } )

        it( 'should receive the BLOCK HEIGHT for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.height).to.equal(180041)
        } )

        it( 'should receive the NAME for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.name).to.equal('Wally Dice')
        } )

        it( 'should receive the TICKER for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.ticker).to.equal('DICE')
        } )

        it( 'should receive the TOKEN ID (HEX) for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKEN_ADDRESS)
            expect(result.token_id_hex).to.equal('24d67f4af7c5e3c2901c7dcd51af18216ff54fc071222ff19ab667220ca50000')
        } )

    } )

    describe( 'Token -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getTokenInfo(NEXA_TOKEN_ADDRESS)
            // console.log('TOKEN INFO', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'NFT -> List', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request NFT list. */
            const result = await getNftList(NEXA_TOKEN_ADDRESS)
            // console.log('NFT LIST', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> History', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token history. */
            const result = await getTokenHistory(NEXA_TOKEN_ADDRESS)
            // console.log('TOKEN HISTORY', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
