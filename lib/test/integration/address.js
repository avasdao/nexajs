/* Setup environment. */
import '../../env.js'

/* Import (test) modules. */
import { expect } from 'chai'

import { OP } from '@nexajs/script'

/* Import class. */
import { Address } from '../../index.js'

/* Import (individual) modules. */
import {
    decodeAddress,
    encodeAddress,
    getSender,
    listUnspent,
    watchAddress,
} from '../../index.js'

/* Import environment variables. */
const ALICE_ADDRESS = process.env.ALICE_ADDRESS

/* Import test(-ing) vectors. */
import {
    SAMPLE_INPUT,
} from '../test_vectors.js'

describe( 'Address Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (private on-chain) JavaScript methods provided by the 'Address' class.` )
    } )

    after( () => {
        // NOTE: We MUST force async tests to end. (remaining open socket connections??)
        // setTimeout(() => process.exit(0), 100)
    } )

    describe( 'List Unspent', () => {
        it( 'it should retrieve the UTXOs for an address', async () => {
            const unspent = await listUnspent(ALICE_ADDRESS)
                .catch(err => console.error(err))
            // console.log('UNSPENT', unspent)

            expect(unspent).to.be.an('array')
            expect(unspent[0].txid).to.have.lengthOf(64)
            expect(typeof unspent[0].satoshis).to.equal('bigint')
            expect(unspent[0].hasToken).to.exist
        } )

    } )

    describe( 'List Unspent Tokens', () => {
        it( 'it should retrieve the UTXOs for an address', async () => {
            const unspent = (await listUnspent(ALICE_ADDRESS)
                .catch(err => console.error(err)))
                .filter(_utxo => _utxo.hasToken === true)
            // console.log('UNSPENT TOKENS', unspent)

            expect(unspent).to.be.an('array')
            expect(unspent[0].tokenidHex).to.have.lengthOf(64)
            expect(typeof unspent[0].tokens).to.equal('bigint')
        } )

    } )

    describe( 'List Authorities', () => {
        it( 'it should retrieve the UTXOs for an address', async () => {
            const unspent = (await listUnspent(ALICE_ADDRESS)
                .catch(err => console.error(err)))
                .filter(_utxo => _utxo.hasToken === true)
                .filter(_utxo => _utxo.tokens < 0)
            // console.log('UNSPENT AUTHORITIES', unspent)

            expect(unspent).to.be.an('array')
            expect(unspent[0].tokenidHex).to.have.lengthOf(64)
            expect(typeof unspent[0].tokens).to.equal('bigint')
            expect(unspent[0].amount).to.equal(5.46)
        } )

    } )

    describe( 'Subscribe to Address', () => {
        it( 'it should subscribe to an address', async () => {
            // const myHandler = (updatedInfo) => {
            //     console.log('HANDLER', updatedInfo)
            // }
            // const myAddress = 'nexa:nqtsq5g5ynxl8rwp5pzh47muagnn795pckdgtjrtatyzv2p5'
            // const cleanup = watchAddress(myAddress, myHandler)
            // console.log('CLEANUP', cleanup)
            // cleanup() // Execute to cancel (and cleanup) an Address subscription.

            // expect(unspent).to.be.an('array')
            // expect(unspent[0].tokenidHex).to.have.lengthOf(64)
        } )

    } )

} )
