/* Setup environment. */
import '../env.js'

/* Import (test) modules. */
import { expect } from 'chai'

import { parseWif } from '@nexajs/hdnode'

/* Import class. */
import { Provider } from '../../index.js'

/* Import (individual) modules. */
import {
    broadcast,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    ALICE_PAYLOAD,
    NEXA_TEST_ADDRESS,
    NEXA_TOKENID,
    NEXA_TOKENID_HEX,
    SAMPLE_OUTPOINT,
    SAMPLE_RAW_TX,
    SAMPLE_TXID,

    NIFTY_TOKENID,
    BLOCK_HASH,
    LIVE_TOKEN_ADDRESS,
    ADDRESS_SCRIPT_HASH,
} from '../test_vectors.js'

/* Initialize globals. */
let parsed
let prefix
let primaryWif
let privateKey
let publicKey
let primaryAddress
let response

describe( 'Provider Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Provider' class.` )

        /* Handle prefix. */
        prefix = 'nexa'
        // console.log('PREFIX', prefix)

        primaryWif = process.env.ALICE_WIF
        expect(primaryWif).to.have.length(52)

        // providerWif = process.env.BOB_WIF

        // adminWif = process.env.CHARLIE_WIF

        // tokenidHex = process.env.BOB_TOKENID_HEX

        /* Set (Alice) address. */
        primaryAddress = (
            await parseWif(primaryWif, prefix)).address
        console.log('PRIMARY ADDR', primaryAddress)

        // /* Set (Alice) public key. */
        // publicKey = (
        //     await parseWif(primaryWif, prefix)).publicKey
        // // console.log('PUBLIC KEY', publicKey)
        //
        // /* Set (Bob) address. */
        // providerAddress = (
        //     await parseWif(providerWif, prefix)).address
        // console.log('PROVIDER ADDRESS', providerAddress)
        //
        // providerPkh = decodeAddress(providerAddress, prefix).hash.slice(3)
        // console.log('PROVIDER PKH', providerPkh)
        //
        // /* Set (Charlie) address. */
        // adminAddress = (
        //     await parseWif(adminWif, prefix)).address
        // console.log('ADMIN ADDRESS', adminAddress)
        //
        // adminPkh = decodeAddress(adminAddress, prefix).hash.slice(3)
        // console.log('ADMIN PKH', adminPkh)
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Provider -> Broadcast', () => {
        it( 'should attempt to broadcast a transaction', async () => {
            response = await broadcast(SAMPLE_RAW_TX)
                .catch(err => console.error(err))
            // console.log('BROADCAST', response)

            expect(response).to.be.an('object')
        } )
    } )

    describe( 'Provider -> getAddressBalance', () => {
        it( 'should receive an OBJECT (by Class) from the REMOTE server', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-1', response)

            expect(response).to.be.an('object')
        } )

        it( 'should receive CONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-2', response)

            expect(response.confirmed).to.be.above(546)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            response = await Provider.getAddressBalance(NEXA_TEST_ADDRESS)
            // console.log('ADDRESS BALANCE-3', response)

            expect(response.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'Provider -> decodeRemoteAddress', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            // console.log('REMOTE ADDRESS', response)
            expect(response).to.be.an('object')
        } )

        it( 'should receive a "TOKEN AWARE" ADDRESS', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(response.is_token_aware).to.be.true
        } )

        it( 'should receive a matching (Alice) PAYLOAD', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(response.payload).to.equal(ALICE_PAYLOAD)
        } )

        it( 'should receive a matching PAYLOAD', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(NEXA_TOKENID)
                .catch(err => console.error(err))
            expect(response.payload).to.equal(NEXA_TOKENID_HEX)
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(response.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            response = await Provider.decodeRemoteAddress(NEXA_TOKENID)
                .catch(err => console.error(err))
            expect(response.type).to.equal('group')
        } )
    } )

    describe( 'Provider -> getAddressFirstUse', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request first use. */
            const response = await Provider.getAddressFirstUse(primaryAddress)
            // console.log('FIRST USE', response)
            expect(response).to.be.an('object')
        } )

        it( 'should receive the FIRST BLOCK HASH for an address', async () => {
            /* Request first use. */
            const response = await Provider.getAddressFirstUse(primaryAddress)
            expect(response.block_hash).to.equal('0394b6fc1ffcf2a2a8613c029b7c3aa758bd9c61c2577cf314399ab053790074')
        } )

        it( 'should receive the FIRST BLOCK HEIGHT for an address', async () => {
            /* Request first use. */
            const response = await Provider.getAddressFirstUse(primaryAddress)
            expect(response.height).to.equal(636476)
            expect(response.block_height).to.equal(636476)
        } )

        it( 'should receive the FIRST TRANSACTION for an address', async () => {
            /* Request first use. */
            const response = await Provider.getAddressFirstUse(primaryAddress)
            expect(response.tx_hash).to.equal('7bc467b72c7993899b8adc7918d97e20c1a56ba2a39130c5b51e1be0ea8b9f49')
        } )

    } )

    describe( 'Provider -> getAddressHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request history. */
            const response = await Provider.getAddressHistory(primaryAddress)
            // console.log('HISTORY', response)
            expect(response).to.be.an('array')
        } )

    } )

    describe( 'Provider -> getAddressMempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request mempool. */
            const response = await Provider.getAddressMempool(primaryAddress)
            // console.log('MEMPOOL', response)
            // expect(response).to.be.an('object')
            expect(response).to.be.empty
        } )

    } )

    describe( 'Provider -> getAddressScriptHash', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request script hash. */
            const response = await Provider.getAddressScriptHash(primaryAddress)
            // console.log('SCRIPT HASH', response)
            expect(response).to.be.a('string')
        } )

        it( 'should equal its script hash', async () => {
            /* Request script hash. */
            const response = await Provider.getAddressScriptHash(primaryAddress)
            expect(response).to.equal(ADDRESS_SCRIPT_HASH)
        } )

    } )

    describe( 'Provider -> getAddressUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request unspent list. */
            const response = await Provider.getAddressUnspent(primaryAddress)
            // console.log('UNSPENT', response)
            expect(response).to.be.an('array')
        } )

    } )

    describe( 'Provider -> getBlock', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request block details. */
            const response = await Provider.getBlock(101)
            // console.log('BLOCK', response)
            expect(response).to.equal('7983d259525c36ef2a209b3d9e9ea24db141960770d5254b422968da980f7878d0fa001e01c839537ce90782da85aa1423a4dbb16c0fa9eed735df0edd4ebae14f14c7ed0ab265be3c323cd9d81794640941182d9871d3336f7da86af804bc888a992383000000000000000000000000000000000000000000000000000000000000000041ceb1626544fea26600000000000000000000000000000000000000000000000000000000f700000000000000010000000425f40787010000020100ca9a3b0000000017005114f9b094d47f93becf557ea8a29bb21448042eba450000000000000000000f6a0165000a0000000000000000000000000000')
        } )

    } )

    describe( 'Provider -> getTip', () => {
        it( 'should receive the latest BLOCK HASH and HEIGHT', async () => {
            /* Request block details. */
            const response = await Provider.getTip()
            // console.log('TIP', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> getTransaction', () => {
        it( 'should receive an OBJECT with transaction details', async () => {
            /* Request transaction details. */
            const response = await Provider.getTransaction('8d6c1ad9c37dfb8c9227c49a1e52c4d606cfbb5df28b56dc8343a7a499aebb72')
            // console.log('TRANSACTION', response)
            expect(response).to.be.an('object')
            expect(response.size).to.equal(65)
        } )

    } )

    describe( 'Provider -> getOutpoint', () => {
        it( 'should receive an object with OUTPOINT details', async () => {
            /* Request transaction details. */
            const response = await Provider.getOutpoint('2cac443a40d9624e8b6d9929d6c7566a049efe4d7e6c668d3afe95f737b7667f')
            // console.log('OUTPOINT', response)
            expect(response.amount).to.equal(999999814)
            expect(response.height).to.equal(150013)
        } )

    } )

    describe( 'Provider -> (Token) getGenesisInfo', () => {
        it( 'should receive an (ALICE) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            // console.log('GENESIS INFO', response)
            expect(response).to.be.an('object')
        } )

        it( 'should receive a (NEXA) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            // console.log('GENESIS INFO (NEXAJS)', response)
            expect(response).to.be.an('object')
        } )

        it( 'should receive the DOCUMENT HASH for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.document_hash).to.equal('8888888800000000000000000000000000000000000000000000000000003713')
        } )

        it( 'should receive the DOCUMENT URL for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.document_url).to.equal('https://nexajs.org')
        } )

        it( 'should receive the BLOCK HEIGHT for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.height).to.equal(355199)
        } )

        it( 'should receive the NAME for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.name).to.equal('NexaJS.325a5dc4')
        } )

        it( 'should receive the TICKER for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.ticker).to.equal('NEXAJS')
        } )

        it( 'should receive the TOKEN ID (HEX) for a token', async () => {
            /* Request genesis info. */
            const response = await Provider.getGenesisInfo(NEXA_TOKENID)
            expect(response.token_id_hex).to.equal(NEXA_TOKENID_HEX)
        } )

    } )
// return
    describe( 'Provider -> (Token) getTokenInfo', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const response = await Provider.getTokenInfo(NEXA_TOKENID_HEX)
            // console.log('TOKEN INFO', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) [CACHED] getTokenInfo', () => {
        it( 'should receive an OBJECT from the LOCAL CACHE', async () => {
            /* Request token info. */
            const response = await Provider.getTokenInfo('5f2456fa44a88c4a831a4b7d1b1f34176a29a3f28845af639eb9b1c88dd40000')
            // console.log('(CACHED) TOKEN INFO', response)
            expect(response).to.be.an('object')
            expect(response.height).to.eq(472285)
            expect(response.txidem).to.eq('c6e9f842d4ac8bde8c875320e38be32ec9b65a9593880276560fedd7bf66baaa')
        } )

    } )

    describe( 'Provider -> (Token) getAddressTokenBalance', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const response = await Provider.getAddressTokenBalance(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) BALANCE', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) getAddressTokenHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const response = await Provider.getAddressTokenHistory(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) HISTORY', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) getAddressTokenMempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const response = await Provider.getAddressTokenMempool(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) MEMPOOL', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) getAddressTokenUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const response = await Provider.getAddressTokenUnspent(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) UNSPENT', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) getNftList', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request NFT list. */
            const response = await Provider.getNftList(NIFTY_TOKENID)
            // console.log('NFT LIST', response.nft.length, response.nft[0], response.nft[response.nft.length - 1])
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'Provider -> (Token) getTokenHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token history. */
            const response = await Provider.getTokenHistory(NEXA_TOKENID_HEX)
            // console.log('TOKEN HISTORY', response)
            expect(response).to.be.an('object')
        } )

    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
