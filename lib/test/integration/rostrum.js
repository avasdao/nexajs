/* Setup environment. */
import '../env.js'

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

import {
    DUST_VAL,

    MINING_PAYLOAD,

    ALICE_PAYLOAD,
    ALICE_TOKENID,
    ALICE_TOKENID_HEX,

    FIRST_USE_BLOCK,
    FIRST_USE_TX,

    BLOCK_HEIGHT,
    BLOCK_HASH,

    SAMPLE_TXID,
    SAMPLE_OUTPOINT,

    ADDRESS_SCRIPT_HASH,
} from '../test_vectors.js'

/* Initialize globals. */
let parsed
let prefix
let primaryWif
let privateKey
let publicKey
let primaryAddress
let result
let rostrum

describe( 'Rostrum (LIVE) Test Suite', () => {
    before( async () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Rostrum' class.` )

        /* Handle prefix. */
        if (process.env.TESTNET) {
            prefix = 'nexatest'
        } else if (process.env.REGTEST) {
            prefix = 'nexareg'
        } else {
            prefix = 'nexa'
        }
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

    // after( () => {
    //     // NOTE: We MUST force async tests to end. (remaining open socket connections??)
    //     setTimeout(() => process.exit(0), 100)
    // } )

    after( () => {
        console.info( `\n  Test address being watched is:\n  [ %s ]`, primaryAddress )

        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

    describe( 'Rostrum -> getAddressBalance', () => {
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
            expect(result.confirmed).to.be.above(DUST_VAL)
        } )

        it( 'should receive UNCONFIRMED BALANCE for the given address', async () => {
            /* Request balance. */
            result = await getAddressBalance(primaryAddress)
                .catch(err => console.error(err))
            expect(result.unconfirmed).to.equal(0)
        } )
    } )

    describe( 'Rostrum -> decodeRemoteAddress', () => {
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
            result = await decodeRemoteAddress(ALICE_TOKENID)
                .catch(err => console.error(err))
            expect(result.payload).to.equal(ALICE_TOKENID_HEX)
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(primaryAddress)
                .catch(err => console.error(err))
            expect(result.type).to.equal('scripttemplate')
        } )

        it( 'should receive a matching ADDRESS TYPE', async () => {
            /* Request decoding. */
            result = await decodeRemoteAddress(ALICE_TOKENID)
                .catch(err => console.error(err))
            expect(result.type).to.equal('group')
        } )
    } )

    describe( 'Rostrum -> getAddressFirstUse', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            // console.log('FIRST USE', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the FIRST BLOCK HASH for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.block_hash).to.equal(FIRST_USE_BLOCK)
        } )

        it( 'should receive the FIRST BLOCK HEIGHT for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.height).to.equal(BLOCK_HEIGHT)
            expect(result.block_height).to.equal(BLOCK_HEIGHT)
        } )

        it( 'should receive the FIRST TRANSACTION for an address', async () => {
            /* Request first use. */
            const result = await getAddressFirstUse(primaryAddress)
            expect(result.tx_hash).to.equal(FIRST_USE_TX)
        } )

    } )

    describe( 'Rostrum -> getAddressHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request history. */
            const result = await getAddressHistory(primaryAddress)
            // console.log('HISTORY', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Rostrum -> getAddressMempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request mempool. */
            const result = await getAddressMempool(primaryAddress)
            // console.log('MEMPOOL', result)
            // expect(result).to.be.an('object')
            expect(result).to.be.empty
        } )

    } )

    describe( 'Rostrum -> getAddressScriptHash', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(primaryAddress)
            // console.log('SCRIPT HASH', result)
            expect(result).to.be.a('string')
        } )

        it( 'should equal its script hash', async () => {
            /* Request script hash. */
            const result = await getAddressScriptHash(primaryAddress)
            expect(result).to.equal(ADDRESS_SCRIPT_HASH)
        } )

    } )

    describe( 'Rostrum -> getAddressUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request unspent list. */
            const result = await getAddressUnspent(primaryAddress)
            // console.log('UNSPENT', result)
            expect(result).to.be.an('array')
        } )

    } )

    describe( 'Rostrum -> subscribeAddress', () => {
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

    describe( 'Rostrum -> getBlock', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request block details. */
            const result = await getBlock(101)
            // console.log('BLOCK', result)
            expect(result).to.equal(BLOCK_HASH)
        } )

    } )

    describe( 'Rostrum -> getTip', () => {
        it( 'should receive the latest BLOCK HASH and HEIGHT', async () => {
            /* Request block details. */
            const result = await getTip()
            // console.log('TIP', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> getTransaction', () => {
        it( 'should receive an OBJECT with transaction details', async () => {
            /* Request transaction details. */
            const result = await getTransaction(SAMPLE_TXID)
            // console.log('TRANSACTION', result)
            expect(result).to.be.an('object')
            expect(result.size).to.equal(65)
        } )

    } )

    describe( 'Rostrum -> getOutpoint', () => {
        it( 'should receive an object with OUTPOINT details', async () => {
            /* Request transaction details. */
            const result = await getOutpoint(SAMPLE_OUTPOINT)
            // console.log('OUTPOINT', result)
            expect(result.amount).to.equal(1e9)
            expect(result.height).to.equal(2)
        } )

    } )

    describe( 'Rostrum -> (Token) getGenesisInfo', () => {
        it( 'should receive an (ALICE) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            // console.log('GENESIS INFO', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive a (NEXA) OBJECT from the REMOTE server', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            // console.log('GENESIS INFO (NEXAJS)', result)
            expect(result).to.be.an('object')
        } )

        it( 'should receive the DOCUMENT HASH for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.document_hash).to.equal('3322110000000000000000000000000000000000000000000000000088888888')
        } )

        it( 'should receive the DOCUMENT URL for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.document_url).to.equal('https://alice.me/alice.json')
        } )

        it( 'should receive the BLOCK HEIGHT for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.height).to.equal(105)
        } )

        it( 'should receive the NAME for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.name).to.equal('AliceCoin.97c2d97c')
        } )

        it( 'should receive the TICKER for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.ticker).to.equal('ALICE')
        } )

        it( 'should receive the TOKEN ID (HEX) for a token', async () => {
            /* Request genesis info. */
            const result = await getGenesisInfo(ALICE_TOKENID)
            expect(result.token_id_hex).to.equal(ALICE_TOKENID_HEX)
        } )

    } )
return
    describe( 'Rostrum -> (Token) getTokenInfo', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getTokenInfo(ALICE_TOKENID_HEX)
            // console.log('TOKEN INFO', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getAddressTokenBalance', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenBalance(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) BALANCE', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getAddressTokenHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenHistory(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) HISTORY', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getAddressTokenMempool', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenMempool(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) MEMPOOL', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getAddressTokenUnspent', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token info. */
            const result = await getAddressTokenUnspent(LIVE_TOKEN_ADDRESS)
            // console.log('TOKEN (address) UNSPENT', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getNftList', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request NFT list. */
            const result = await getNftList(NIFTY_TOKENID)
            // console.log('NFT LIST', result.nft.length, result.nft[0], result.nft[result.nft.length - 1])
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'Rostrum -> (Token) getTokenHistory', () => {
        it( 'should receive an OBJECT from the REMOTE server', async () => {
            /* Request token history. */
            const result = await getTokenHistory(ALICE_TOKENID_HEX)
            // console.log('TOKEN HISTORY', result)
            expect(result).to.be.an('object')
        } )

    } )

    describe( 'errors', () => {
        // TBD
    } )

} )
