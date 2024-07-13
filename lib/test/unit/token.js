/* Import (test) modules. */
import { expect } from 'chai'
import { v4 as uuidv4 } from 'uuid'

import { encodeAddress } from '@nexajs/address'

import {
    encodePrivateKeyWif,
    parseWif,
} from '@nexajs/hdnode'

import { broadcast } from '@nexajs/provider'

import { getCoins } from '@nexajs/purse'

import {
    encodeDataPush,
    encodeNullData,
    OP,
} from '@nexajs/script'

import {
    binToHex,
    hexToBin,
    reverseHex,
} from '@nexajs/utils'

/* Import class. */
import { Token } from '../../index.js'

/* Import library modules. */
import {
    getGroupDataScript,
    getGroupId,
    getTokens,
    getTopTokens,
} from '../../index.js'

/* Import test(-ing) vectors. */
import {
    BIT_AUTH,
    BIT_MINT,
    BIT_MELT,
    BIT_BATON,
    BIT_RESCRIPT,
    BIT_SUBGROUP,

    TIMEOUT,
} from '../test_vectors.js'

/* Initialize locals. */
let prefix

/**
 * Random Int From Interval
 *
 * TBD...
 */
const randomIntFromInterval = (_min, _max) => {
    return Math.floor(Math.random() * (_max - _min + 1) + _min)
}

describe( 'Token (Unit) Test Suite', () => {
    before( () => {
        console.info( `  ↳ targeting all (non-mutating) JavaScript methods provided by the 'Token' class.` )

        prefix = 'nexa'
    } )

    describe( 'Token -> Class', () => {
        it( 'should confirm the AUTHORITY bit', () => {
            /* Set authority bit flag. */
            const authTxo = Token.flags.AUTHTXO
            // console.log('AUTH TXO', authTxo)

            expect(authTxo).to.equal(BIT_AUTH)
        } )

        it( 'should confirm the MINT bit', () => {
            /* Set authority bit flag. */
            const authMint = Token.flags.MINT
            // console.log('AUTH MINT', authMint)

            expect(authMint).to.equal(BIT_MINT)
        } )

        it( 'should confirm the MELT bit', () => {
            /* Set authority bit flag. */
            const authMelt = Token.flags.MELT
            // console.log('AUTH MELT', authMelt)

            expect(authMelt).to.equal(BIT_MELT)
        } )

        it( 'should confirm the BATON bit', () => {
            /* Set authority bit flag. */
            const authBaton = Token.flags.BATON
            // console.log('AUTH BATON', authBaton)

            expect(authBaton).to.equal(BIT_BATON)
        } )

        it( 'should confirm the RESCRIPT bit', () => {
            /* Set authority bit flag. */
            const authRescript = Token.flags.RESCRIPT
            // console.log('AUTH RESCRIPT', authRescript)

            expect(authRescript).to.equal(BIT_RESCRIPT)
        } )

        it( 'should confirm the SUBGROUP bit', () => {
            /* Set authority bit flag. */
            const authSubgroup = Token.flags.SUBGROUP
            // console.log('AUTH SUBGROUP', authSubgroup)

            expect(authSubgroup).to.equal(BIT_SUBGROUP)
        } )

    } )

    describe( 'Token -> getGroupDataScript', () => {
        it( 'should create a new token group and return an OP_RETURN info data script', () => {
            const params = {
                ticker: 'NEXAJS',
                name: `NEXA.js.a24c71b0`,
                uri: 'https://nexajs.org',
                hash: '1337000000000000000000000000000000000000000000000000000088888888',
                decimals: 2, // determanistic
            }

            const groupDataScript = getGroupDataScript(params)
            // console.log('GROUP DATA SCRIPT', binToHex(groupDataScript))

            expect(binToHex(groupDataScript)).to.eq('6a0438564c05064e4558414a53104e4558412e6a732e61323463373162301268747470733a2f2f6e6578616a732e6f726720888888880000000000000000000000000000000000000000000000000000371352')
        } )

        it( 'should create a (RANDOM) new token group and return an OP_RETURN info data script', () => {
            const params = {
                ticker: 'NEXAJS',
                name: `NEXA.js.${uuidv4().slice(0, 8)}`,
                uri: 'https://nexajs.org',
                hash: '1337000000000000000000000000000000000000000000000000000088888888',
                decimals: randomIntFromInterval(0, 8),
            }

            const groupDataScript = getGroupDataScript(params)
            // console.log('GROUP DATA SCRIPT', binToHex(groupDataScript))

            expect(groupDataScript).to.have.length.gte(76)
        } )

    } )

    describe( 'Token -> getGroupId', () => {
        it( 'should generate and return a NEW group id', async () => {
            let groupData
            let groupid
            let nonceDec
            let outpoint
            let scriptPubKey

            outpoint = '48f3a733fa9346b161454b15a72f27f90634a2dd20208fcb52c046472d384ef6'

            groupData = hexToBin('6a0438564c05054f524e4745066f72616e67650f687474703a2f2f6e6578612e6f726720000000000000000000000000000000000000000000000000000000000000000054')
            let { groupidBin, nonceBin } = await getGroupId(outpoint, groupData)
            // console.log('GROUP ID (hex):', binToHex(groupidBin))
            // console.log('NONCE (hex):', binToHex(nonceBin))

            // NOTE: Clone and trim (4) bytes.
            nonceDec = parseInt(binToHex([...nonceBin].reverse()).slice(8), 16)
            // console.log('NONCE (decimal):', nonceDec)

            expect(groupidBin).to.have.length(32)
            expect(nonceBin).to.eql(hexToBin('d7210100000000fc'))
            expect(groupidBin).to.eql(hexToBin('a24c71b0585f49ecf5968a07b4c564dec1842a0f4b05d39f990e1848ffe20000'))

            /* Encode the public key hash into a P2PKH nexa address. */
            groupid = encodeAddress(
                prefix,
                'GROUP',
                groupidBin,
            )
            // console.log('GROUP ID', groupid)
            // expect(groupid).to.equal('nexa:tqs2ynr3kpv97j0v7ktg5pa5c4jdasvy9g85kpwnn7vsuxzgll3qqqqmvy6ytu4')
            expect(groupid).to.equal('nexa:tz3ycudstp05nm84j69q0dx9vn0vrpp2pa9st5ulny8psj8lugqqqfvyfp3sf')
        } ).timeout(TIMEOUT)

    } )

    describe( 'errors', () => {
        it( 'should return a (missing prefix) error', () => {
            // expect(err.toString()).to.include('Missing prefix')
        } )
    } )

} )
