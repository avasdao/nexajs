/* Setup environment. */
import 'dotenv/config'

/* Import (test) modules. */
import { expect } from 'chai'

import { parseWif } from '@nexajs/hdnode'

/* Import class. */
import { Rostrum } from '../../index.js'

/* Import (individual) modules. */
import {
    getAddressBalance,
    decodeRemoteAddress,
    getAddressFirstUse,
    getAddressHistory,
    getAddressMempool,
    getAddressScriptHash,
    getAddressUnspent,
    getBlock,
    getTransaction,
    getGenesisInfo,
    getTokenInfo,
    getAddressTokenBalance,
    getAddressTokenHistory,
    getAddressTokenMempool,
    getAddressTokenUnspent,
    getNftList,
    getOutpoint,
    getTip,
    getTokenHistory,
    subscribeAddress,
} from '../../index.js'

const NEXA_TOKENID = 'nexa:tr8dsp7r9dr2efafva3wkylhyus3nq76gw637um5k5ps3999ngqqq3dtn9avf' // NEXAJS
const NEXA_TOKENID_HEX = 'ced807c32b46aca7a96762eb13f727211983da43b51f7374b5030894a59a0000' // NEXAJS
const NIFTY_TOKENID = 'nexa:tr9v70v4s9s6jfwz32ts60zqmmkp50lqv7t0ux620d50xa7dhyqqqcg6kdm6f' // NiftyArt.cash
const AVAS_TOKENID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
const LIVE_TOKEN_ADDRESS = 'nexa:nqtsq5g5eap34upgh8g09n44lh4ccx32fqr7g48fzlqha8w2' // Wally wallet

const MINING_PAYLOAD = '005114c5c521c611bfd1b32c2fbd22212b3bbd5bd0b09e'
const ALICE_PAYLOAD = '0051143a858e9cb548482ae91e27ec7266656dc516883f'

/* Initialize globals. */
let parsed
let privateKey
let publicKey
let primaryAddress
let result
let rostrum

describe( 'Rostrum (LIVE) Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all JavaScript methods provided by the 'Rostrum' class.` )

        /* Validate (LENGTH) wallet import format (WIF). */
        expect(process.env.ALICE_WIF).to.have.length(52)

        /* Parse (Alice's) WIF. */
        parsed = await parseWif(process.env.ALICE_WIF)
        // console.log('PARSED', parsed)

        /* Set address. */
        primaryAddress = parsed.address

        /* Set public key. */
        publicKey = parsed.publicKey

        /* Set private key. */
        privateKey = parsed.privateKey
    } )

    after( () => {
        console.info( `\n  Test address being watched is:\n  [ %s ]`, primaryAddress )
    } )

    describe( 'Blockchain -> Address -> Balance', () => {
        it( 'should receive an OBJECT (by Class) from the REMOTE server', async () => {
            /* Create (new) Rostrum instance. */
            rostrum = await Rostrum.init()
            // console.log('ROSTRUM', rostrum)

            /* Request balance. */
            result = await rostrum
                .getAddressBalance(primaryAddress)
                .catch(err => console.error(err))
            // console.log('ADDRESS BALANCE', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive an OBJECT (by Method) from the REMOTE server', async () => {
            /* Request balance. */
            result = await getAddressBalance(primaryAddress)
                .catch(err => console.error(err))
            expect(result).to.be.an('object')
        } )

        it( 'should receive CONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            result = await getAddressBalance(primaryAddress)
                .catch(err => console.error(err))
            expect(result.confirmed).to.be.above(546)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            result = await getAddressBalance(primaryAddress)
                .catch(err => console.error(err))
            expect(result.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'Blockchain -> Address -> Decoding', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            // console.log('REMOTE ADDRESS', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive a "TOKEN AWARE" ADDRESS', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(result.is_token_aware).to.be.true
        } )

        it( 'should receive a matching (Alice) PAYLOAD', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(result.payload).to.equal(ALICE_PAYLOAD)
        } )

        it( 'should receive a matching PAYLOAD', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(NEXA_TOKENID)
                .catch(err => console.error(err))
            expect(result.payload).to.equal(NEXA_TOKENID_HEX)
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(result.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(NEXA_TOKENID)
                .catch(err => console.error(err))
            expect(result.type).to.equal('group')
        } )
    } )
return
    describe( 'Blockchain -> Address -> First Use', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            // console.log('FIRST USE', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the FIRST BLOCK HASH for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.block_hash).to.equal('cfbf7de19339a2de74af454289be7ace72fab620c7cbfaca892ad3c6467b4a10')
        } )

        it( 'should receive the FIRST BLOCK HEIGHT for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.height).to.equal(222667)
            expect(result.block_height).to.equal(222667)
        } )

        it( 'should receive the FIRST TRANSACTION for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.tx_hash).to.equal('f1385dbef064bf3b66d208f421caabaf370dcf343622047b918e3f0768af5519')
        } )

    } )

    describe( 'Blockchain -> Address -> History', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request history. */
            const result = await getAddressHistory(primaryAddress)
            // console.log('HISTORY', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Blockchain -> Address -> Mempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request mempool. */
            const result = await getAddressMempool(primaryAddress)
            // console.log('MEMPOOL', result)
            // expect(result).to.be.an('object')
            expect(result).to.be.empty
        } )

    } )

    describe( 'Blockchain -> Address -> ScriptHash', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(primaryAddress)
            // console.log('SCRIPT HASH', result)
            expect(result).to.be.a('string')
        } )

        it( 'should equal its script hash', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(primaryAddress)
            expect(result).to.equal('729fc21d57730ce07e31ff500eacb14c7c3a24488646dce408a042124f402fff')
        } )

    } )

    describe( 'Blockchain -> Address -> ListUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request unspent list. */
            const result = await getAddressUnspent(primaryAddress)
            // console.log('UNSPENT', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Blockchain -> Address -> Subscribe', () => {
        it( 'should receive real-time for an ADDRESS', async () => {
            const _handler = (_data) => {
                console.log('Subscription handler (data):', _data)

                expect(_data).to.be.an('array')
                expect(_data[0]).to.equal(primaryAddress)
            }

            /* Request transaction details. */
            const result = await subscribeAddress(primaryAddress, _handler)
            // console.log('ADDRESS SUB', result)
        } )

    } )

    describe( 'Blockchain -> Block -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request block details. */
            const result = await getBlock(1337)
            // console.log('BLOCK', result)
            expect(result).to.equal('ceac57ae91b3bfd0e8ffc5d7926966bb04be9907b0a55d5f4d541b4947118798c499001e01c839537ce90782da85aa1423a4dbb16c0fa9eed735df0edd4ebae14f14c7ed72bbae99a4a74383dc568bf25dbbcf06d6c4521e9ac427928cfb7dc3d91a6c8d00000000000000000000000000000000000000000000000000000000000000001735b2628939e69ad1c106000000000000000000000000000000000000000000000000000000f80000000000000001000000047ae6bb6f010000020100ca9a3b0000000017005114f9b094d47f93becf557ea8a29bb21448042eba450000000000000000000f6a023905000900000000000000000000000000')
        } )

    } )

    describe( 'Blockchain -> Headers -> Tip', () => {
        it( 'should receive the latest BLOCK HASH and HEIGHT', async () => {
            /* Request block details. */
            const result = await getTip()
            // console.log('TIP', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Blockchain -> Transaction -> Info', () => {
        it( 'should receive an OBJECT with transaction details', async () => {
            /* Request transaction details. */
            const result = await getTransaction('2a234d53e48e9cdd5e549a7ecca433af3f172c1a2114a1b3a1fac447a58f6a3a')
            // console.log('TRANSACTION', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Blockchain -> Outpoint -> Info', () => {
        it( 'should receive an object with OUTPOINT details', async () => {
            /* Request transaction details. */
            const result = await getOutpoint('fbe5296e53e75ca5225210dc63e33ee3a7a9c7a1870ea49a0101f47d7c143797')
            // console.log('OUTPOINT', result)
            expect(result.amount).to.equal(20131)
            expect(result.height).to.equal(342168)
        } )

    } )

    describe( 'Token -> Genesis -> Info', () => {
        it( 'should receive an (AVAS) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(AVAS_TOKENID)
            // console.log('GENESIS INFO ($AVAS decimals):', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive a (NEXA) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            // console.log('GENESIS INFO (NEXAJS)', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the DOCUMENT HASH for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.document_hash).to.equal('8888888800000000000000000000000000000000000000000000000000003713')
        } )

        it( 'should receive the DOCUMENT URL for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.document_url).to.equal('https://nexajs.org')
        } )

        it( 'should receive the BLOCK HEIGHT for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.height).to.equal(355199)
        } )

        it( 'should receive the NAME for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.name).to.equal('NexaJS.325a5dc4')
        } )

        it( 'should receive the TICKER for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.ticker).to.equal('NEXAJS')
        } )

        it( 'should receive the TOKEN ID (HEX) for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            expect(result.token_id_hex).to.equal(NEXA_TOKENID_HEX)
        } )

    } )

    describe( 'Token -> Info', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getTokenInfo(NEXA_TOKENID)
            // console.log('TOKEN INFO', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> Address Balance', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenBalance(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) BALANCE', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> Address History', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenHistory(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) HISTORY', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> Address Mempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenMempool(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) MEMPOOL', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> Address Unspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenUnspent(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) UNSPENT', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'NFT -> List', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request NFT list. */
            const result = await getNftList(NIFTY_TOKENID)
            // console.log('NFT LIST', result.nft.length, result.nft[0], result.nft[result.nft.length - 1])
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Token -> History', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token history. */
            const result = await getTokenHistory(NEXA_TOKENID)
            // console.log('TOKEN HISTORY', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
