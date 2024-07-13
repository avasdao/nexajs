/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'

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

/* Import test(-ing) vectors. */
import {
    NEXA_TEST_ADDRESS,
    NEXA_TOKENID,
    NEXA_TOKENID_HEX,
    NIFTY_TOKENID,
    AVAS_TOKENID,
    LIVE_TOKEN_ADDRESS,
} from '../test_vectors.js'

// const NEXA_TEST_ADDRESS = 'nexa:nqtsq5g570krcx3gl9l3yhh8lsh2gq446fse9vef5hwewryc'
// const NEXA_TOKENID = 'nexa:tr8dsp7r9dr2efafva3wkylhyus3nq76gw637um5k5ps3999ngqqq3dtn9avf' // NEXAJS
// const NEXA_TOKENID_HEX = 'ced807c32b46aca7a96762eb13f727211983da43b51f7374b5030894a59a0000' // NEXAJS
// const NIFTY_TOKENID = 'nexa:tr9v70v4s9s6jfwz32ts60zqmmkp50lqv7t0ux620d50xa7dhyqqqcg6kdm6f' // NiftyArt.cash
// const AVAS_TOKENID = 'nexa:tptlgmqhvmwqppajq7kduxenwt5ljzcccln8ysn9wdzde540vcqqqcra40x0x'
// const LIVE_TOKEN_ADDRESS = 'nexa:nqtsq5g5eap34upgh8g09n44lh4ccx32fqr7g48fzlqha8w2' // Wally wallet

describe( 'Rostrum (LIVE) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (public on-chain) JavaScript methods provided by the 'Rostrum' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        setTimeout(() => process.exit(0), 100)
    } )

    after( () => {
        console.info( `\n  Test address being watched is:\n  [ %s ]`, NEXA_TEST_ADDRESS )
    } )

    describe( 'Blockchain -> Address -> Balance', () => {
        it( 'should receive an OBJECT (by Class) from the REMOTE server', async () => {
            /* Create (new) Rostrum instance. */
            const rostrum = await Rostrum.init()
            // console.log('ROSTRUM', rostrum)
            // console.log('Rostrum.init (status-1):', rostrum.status)
            // setTimeout(() => {
            //     console.log('Rostrum.init (status-2):', rostrum.status)
            // }, 1000)

            /* Request balance. */
            const result = await rostrum.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-1', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive an OBJECT (by Method) from the REMOTE server', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-2', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive CONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-3', result)
            expect(result.confirmed).to.be.above(546)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            const result = await getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-4', result)
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
            // expect(result.payload).to.equal('005114f3ec3c1a28f97f125ee7fc2ea402b5d26192b329')
            expect(result.payload).to.equal('00511484ac0b79c2695ceb96aa88c6f5b7bedbd5e193f2')
        } )

        it( 'should receive a matching PAYLOAD', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TOKENID)
            expect(result.payload).to.equal(NEXA_TOKENID_HEX)
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TEST_ADDRESS)
            expect(result.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            const result = await decodeRemoteAddress(NEXA_TOKENID)
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
            // expect(result.block_hash).to.equal('cfbf7de19339a2de74af454289be7ace72fab620c7cbfaca892ad3c6467b4a10')
            expect(result.block_hash).to.equal('d84656f7c7d225db895315f7e9f10c4bc6eed2be77de70e4bf951bfc5958d24f')
        } )

        it( 'should receive the FIRST BLOCK HEIGHT for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            // expect(result.height).to.equal(222667)
            expect(result.height).to.equal(230815)
            // expect(result.block_height).to.equal(222667)
            expect(result.block_height).to.equal(230815)
        } )

        it( 'should receive the FIRST TRANSACTION for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(NEXA_TEST_ADDRESS)
            // expect(result.tx_hash).to.equal('f1385dbef064bf3b66d208f421caabaf370dcf343622047b918e3f0768af5519')
            expect(result.tx_hash).to.equal('3c74b90266b73d5db2e719323eff9110523f028e4900000d79940709f1c1668b')
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
            // expect(result).to.equal('729fc21d57730ce07e31ff500eacb14c7c3a24488646dce408a042124f402fff')
            expect(result).to.equal('42f8e0e30dbdc1e30cf68b428874c765c1f6d7628ba65355d79ea243f1509967')
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

    describe( 'Blockchain -> Address -> Subscribe', () => {
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
            console.log('GENESIS INFO ($AVAS decimals):', result)
            expect(result).to.be.an('object')
        } ).timeout(10000)
        // FIXME Why is $AVAS request sooo slow?!

        it( 'should receive a (NEXA) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(NEXA_TOKENID)
            console.log('GENESIS INFO (NEXAJS)', result)
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
